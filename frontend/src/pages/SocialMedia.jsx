
import { useState } from "react";
import { Share2, Sparkles, Copy } from "lucide-react";
import { generateSocialPost } from "../services/aiService";

export default function SocialMedia() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Friendly");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data = await generateSocialPost({ prompt, platform, tone });
      setResult(data.content || data.result || data.reply || data.message || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-violet-600">
          <Share2 size={20} />
          <span className="text-sm font-semibold">AI Social Media Studio</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Create Social Content</h1>
        <p className="mt-1 text-sm text-slate-500">Generate engaging posts for your social media channels.</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">What is your post about?</label>
          <textarea
            required
            rows="5"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a post promoting our new coffee collection..."
            className="w-full resize-y rounded-xl border border-slate-200 p-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500">
              <option>Instagram</option>
              <option>Facebook</option>
              <option>LinkedIn</option>
              <option>TikTok</option>
              <option>X</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tone of voice</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500">
              <option>Friendly</option>
              <option>Professional</option>
              <option>Funny</option>
              <option>Persuasive</option>
              <option>Luxury</option>
            </select>
          </div>
        </div>

        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
          <Sparkles size={18} /> {loading ? "Generating..." : "Generate Post"}
        </button>
      </form>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Generated Content</h2>
            <button onClick={() => navigator.clipboard.writeText(result)} className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800">
              <Copy size={16} /> Copy
            </button>
          </div>
          <p className="whitespace-pre-wrap leading-7 text-slate-700">{result}</p>
        </div>
      )}
    </div>
  );
}
