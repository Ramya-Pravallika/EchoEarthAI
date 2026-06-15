import { Request, Response } from "express";
import { CoachChatRequestSchema } from "../validators/assessment.validator";
import { generateContentWithRetry } from "../services/gemini.service";

export async function coachChat(req: Request, res: Response) {
  try {
    const rawData = req.body;
    const validation = CoachChatRequestSchema.safeParse(rawData);

    if (!validation.success) {
      res.status(400).json({ error: "Malformed user chat request payloads." });
      return;
    }

    const p = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.json({
        reply: "My AI connection mirror is sleeping momentarily. Keep up the high daily actions!"
      });
      return;
    }

    const contents = (p.history || []).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: p.message }],
    });

    const sysInstruction = `You are EchoEarth AI's Sustainability Coach. 
Your user has a Carbon Identity of "${p.identityTitle || "A Conscious Explorer"}" and an annual footprint of estimated ${p.estimatedTotalCO2 || 10} metric tons.
Always be exceptionally encouraging, supportive, and full of action-oriented psychology.
Keep answers concise, extremely practical, and free from guilt. Highlight easy wins first. Write in a clear, formatted human tone. Under 150 words.`;

    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: sysInstruction,
        },
      });

      res.json({ reply: response.text || "I am reflecting on your ecosystem. Small habits matter!" });
    } catch (apiError: any) {
      console.warn("Gemini connection fault, using coach fallback:", apiError.message);
      const msgLower = p.message.toLowerCase();
      let reply = `Hello! As your EchoEarth AI companion, I am so motivated to guide your journey. Your profile "${p.identityTitle || "Conscious Companion"}" has a calculated baseline of ${p.estimatedTotalCO2 || 6.2} tons CO2e. What aspect of your conservation would you like to plan today?`;

      if (msgLower.includes("food") || msgLower.includes("meat") || msgLower.includes("diet") || msgLower.includes("eat")) {
        reply = `Excellent subject! Food represents a major pillar of our footprint. Swapping a single beef-based meal per week for lentils, organic mushrooms, or local beans reduces agricultural water and methane loads. Can you pledge to try a plant-based harmony bowl this week?`;
      } else if (msgLower.includes("car") || msgLower.includes("drive") || msgLower.includes("flight") || msgLower.includes("travel") || msgLower.includes("commute")) {
        reply = `Transit matters significantly! Transitioning to group loops, hybrid habits, or taking a short active walk instead of starting your combustion engine is the single fastest way to clear air smog in your virtual biome. Just saving one short drive can cut pounds of weekly CO2.`;
      } else if (msgLower.includes("energy") || msgLower.includes("solar") || msgLower.includes("plug") || msgLower.includes("heat") || msgLower.includes("power")) {
        reply = `Great point on energy! Unplugging phantom loads (like chargers, TVs, or microwave clocks) can represent 10% of standard home bills. Also wash laundry in cold water loops to cut heating energy up to 75%. Let's secure some phantom saves today!`;
      } else if (msgLower.includes("waste") || msgLower.includes("plastic") || msgLower.includes("recycle") || msgLower.includes("compost")) {
        reply = `Sorting our waste stream has an immediate visual impact on the garden. Compost bins keep organic food scrap from decomposing into raw landfill methane, instead creating rich fertilizer that grows blooming wild flowers. Try setting up a small desktop compost container!`;
      }
      res.json({ reply });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to communicate with AI Coach." });
  }
}
