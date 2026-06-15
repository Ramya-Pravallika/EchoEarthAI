import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Send, ArrowRight, User, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

interface SustainabilityCoachProps {
  identityTitle: string;
  estimatedTotalCO2: number;
  isTwilightMode: boolean;
}

const QUICK_PROMPTS = [
  "How can I easily reduce household food waste?",
  "Standard gasoline car alternative hacks?",
  "Explain Carbon Offsets vs direct mitigation.",
  "Which shopping habits have the highest environmental factor?",
];

export default function SustainabilityCoach({
  identityTitle,
  estimatedTotalCO2,
  isTwilightMode,
}: SustainabilityCoachProps) {
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
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", text: textToSend };
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
          message: textToSend,
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
      console.error("Coach chat error", e);
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
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "model",
        text: `Mirror chat logs refreshed. Let's restart our sustainability tutoring! Ask me any practical tips.`,
      },
    ]);
  };

  return (
    <div
      id="sustainability-coach-container"
      className={`p-6 rounded-2xl border transition-all duration-500 space-y-4 ${
        isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
      }`}
    >
      <div className="flex justify-between items-center border-b border-stone-200/40 pb-3">
        <div className="space-y-0.5">
          <h4 className={`font-bold tracking-tight text-base flex items-center gap-2 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <MessageCircle className="w-5 h-5 text-emerald-700" /> AI Sustainability Coach
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            A secure full-stack conversational guide matching your profile traits.
          </p>
        </div>

        <button
          id="btn-clear-chat"
          onClick={handleClearChat}
          className={`p-2 rounded-xl border text-xs text-rose-600 transition-all flex items-center gap-1 cursor-pointer hover:bg-rose-50 border-rose-100 ${
            isTwilightMode ? "border-[#232A31] hover:bg-slate-900" : "hover:bg-rose-50"
          }`}
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" /> Clear Logs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat History Container */}
        <div className="lg:col-span-8 flex flex-col h-[400px]">
          <div
            id="chat-scroll-viewport"
            ref={scrollRef}
            className={`flex-1 overflow-y-auto p-4 rounded-xl border space-y-4 mb-4 ${
              isTwilightMode ? "bg-[#0A0D14] border-[#1E252D]" : "bg-white border-[#E4E2DB]"
            }`}
          >
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={`msg-${idx}`}
                  className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : isTwilightMode ? "bg-amber-400 text-slate-950" : "bg-emerald-800 text-stone-100"
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : "✦"}
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    isUser
                      ? "bg-indigo-600/10 text-stone-900 rounded-tr-none border border-indigo-200"
                      : isTwilightMode ? "bg-slate-900/40 border border-slate-800 text-slate-200 rounded-tl-none font-serif" : "bg-stone-50 text-stone-950 rounded-tl-none font-serif border border-stone-200"
                  }`}>
                    <span className={`block font-extrabold text-[9px] uppercase tracking-wider ${
                      isUser ? "text-indigo-600" : "text-emerald-700"
                    }`}>
                      {isUser ? "You" : "EchoEarth AI Coach"}
                    </span>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-stone-300 animate-pulse`}>
                  ✦
                </div>
                <div className={`p-3 rounded-xl bg-stone-100 border text-xs max-w-sm border-stone-200 text-stone-500 animate-pulse`}>
                  Reflecting thoughts under the mirror pool...
                </div>
              </div>
            )}
          </div>

          {/* Prompt Entry Box */}
          <div className="flex gap-2">
            <input
              id="coach-input-field"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask me: Is organic beef better or plant burgers? How do I carbon offset?"
              className={`flex-1 p-3.5 border rounded-xl text-xs focus:outline-none focus:ring-1 transition-all ${
                isTwilightMode
                  ? "bg-[#161D26] border-[#222E3C] text-stone-150 text-stone-100 focus:ring-indigo-500"
                  : "bg-white border-[#E4E2DB] text-stone-900 focus:ring-emerald-700"
              }`}
            />
            <button
              id="btn-send-message"
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50 min-h-[44px] shrink-0"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Helper Prompts Side Panel */}
        <div id="quick-prompts-panel" className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <span className={`text-[10px] uppercase font-bold tracking-widest block ${
              isTwilightMode ? "text-slate-400" : "text-stone-500"
            }`}>
              Quick Guide Queries
            </span>
            <p className="text-xs font-serif leading-relaxed text-slate-400">
              Click suggestions below to quickly quiz EchoEarth AI with focus questions regarding alternative options.
            </p>

            <div className="space-y-2 pt-1.5ClassName bg-slate-200">
              {QUICK_PROMPTS.map((promptText, i) => (
                <button
                  key={`qp-${i}`}
                  id={`btn-qp-${i}`}
                  onClick={() => handleSend(promptText)}
                  disabled={loading}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start justify-between gap-2 hover:-translate-y-0.5 active:translate-y-0 ${
                    isTwilightMode
                      ? "bg-[#161D26] border-[#222E3C] text-slate-300 hover:border-slate-500 hover:bg-[#1E2733]"
                      : "bg-white border-[#E4E2DB] text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  <span className="leading-tight">{promptText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-[11px] font-sans font-medium text-slate-400 mt-4 leading-relaxed ${
            isTwilightMode ? "bg-[#0E131E] border-[#1E252D]" : "bg-[#F3EFE9] border-stone-200 text-stone-600"
          }`}>
            ✦ <strong>Behavior Hack</strong>: Small, regular habits have a 92% higher chance of permanent adoption compared to massive weekend shifts. Try simple actions first!
          </div>
        </div>
      </div>
    </div>
  );
}
