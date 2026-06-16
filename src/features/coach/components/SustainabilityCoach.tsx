import { useRef, useEffect } from "react";
import { useCoach } from "../../../hooks/useCoach";
import { MessageCircle, Send, ArrowRight, User, Trash2 } from "lucide-react";

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
  const {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
    clearChat,
  } = useCoach({ identityTitle, estimatedTotalCO2 });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
          onClick={clearChat}
          className={`p-2 rounded-xl border text-xs text-rose-600 transition-all flex items-center gap-1 cursor-pointer hover:bg-rose-50 border-rose-100/10 ${
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
                      ? "bg-indigo-600/10 text-stone-900 rounded-tr-none border border-indigo-155 border-indigo-200"
                      : isTwilightMode ? "bg-slate-900/40 border border-slate-800/80 text-slate-200 rounded-tl-none font-serif" : "bg-stone-50 text-stone-950 rounded-tl-none font-serif border border-stone-200"
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-300 animate-pulse text-stone-700 font-bold text-xs">
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask me: Is organic beef better or plant burgers? How do I carbon offset?"
              className={`flex-1 p-3.5 border rounded-xl text-xs focus:outline-none focus:ring-1 transition-all ${
                isTwilightMode
                  ? "bg-[#161D26] border-[#222E3C] text-stone-100 focus:ring-indigo-500"
                  : "bg-white border-[#E4E2DB] text-stone-900 focus:ring-emerald-700"
              }`}
            />
            <button
              id="btn-send-message"
              onClick={() => sendMessage(input)}
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

            <div className="space-y-2 pt-1.5 border-t border-stone-200/10">
              {QUICK_PROMPTS.map((promptText, i) => (
                <button
                  key={`qp-${i}`}
                  id={`btn-qp-${i}`}
                  onClick={() => sendMessage(promptText)}
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
