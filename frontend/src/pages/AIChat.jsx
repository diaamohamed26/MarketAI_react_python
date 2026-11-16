
import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { chatWithAI } from "../services/aiService";

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your MarketAI assistant. How can I help with your marketing today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(e) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const data = await chatWithAI(message);
      const reply = data.reply || data.content || data.message || data.result || "I couldn't generate a response.";
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-150px)] max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-5">
        <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
          <Bot size={22} />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">MarketAI Assistant</h1>
          <p className="text-xs text-emerald-600">AI Marketing Assistant</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/70 p-4 md:p-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${message.role === "user" ? "bg-slate-200 text-slate-700" : "bg-violet-100 text-violet-700"}`}>
              {message.role === "user" ? <User size={18} /> : <Sparkles size={18} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 md:max-w-[75%] ${message.role === "user" ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Sparkles size={18} className="animate-pulse text-violet-600" />
            MarketAI is thinking...
          </div>
        )}
      </div>

      {error && <p className="bg-red-50 px-5 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-100 bg-white p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about marketing..."
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500"
        />
        <button disabled={loading || !input.trim()} className="rounded-xl bg-violet-600 px-4 text-white hover:bg-violet-700 disabled:opacity-50">
          <Send size={19} />
        </button>
      </form>
    </div>
  );
}
