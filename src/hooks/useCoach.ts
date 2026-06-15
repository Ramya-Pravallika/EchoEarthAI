import { useState, useCallback } from "react";

export interface Message {
  role: "user" | "model";
  text: string;
}

interface UseCoachProps {
  identityTitle: string;
  estimatedTotalCO2: number;
}

export function useCoach({ identityTitle, estimatedTotalCO2 }: UseCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: `Hello! I am EchoEarth AI, your AI Sustainability Coach. I see you are profiled as "${
        identityTitle || "A Conscious Explorer"
      }" with estimated carbon impact of ${
        estimatedTotalCO2 ? estimatedTotalCO2.toFixed(1) : "10.0"
      } metric tons/year. Ask me any environmental alternatives, tips or plans to help scale your virtual biome!`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const trimmedText = textToSend.trim();
      if (!trimmedText || loading) return;

      const userMessage: Message = { role: "user", text: trimmedText };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/coach-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history: updatedMessages,
            message: trimmedText,
            identityTitle,
            estimatedTotalCO2,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          setMessages((prev) => [
            ...prev,
            { role: "model", text: json.reply || "I am reflecting on your ecosystem. Small habits matter!" },
          ]);
        } else {
          throw new Error("API call failed");
        }
      } catch (e) {
        console.error("Coach chat connection fault:", e);
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "I dropped my mirror reflection connection for an instant. Can you please re-ask or check your network?",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, identityTitle, estimatedTotalCO2]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "model",
        text: `Mirror chat logs refreshed. Let's restart our sustainability tutoring! Ask me any practical tips.`,
      },
    ]);
  }, []);

  return {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
    clearChat,
  };
}
export default useCoach;
