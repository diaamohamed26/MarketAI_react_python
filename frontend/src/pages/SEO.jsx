
import { useState } from "react";
import { Search, Sparkles, Copy } from "lucide-react";
import { analyzeSEO } from "../services/aiService";

export default function SEO() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await analyzeSEO(prompt);
      setResult(data.content || data.result || data.analysis || data.message || "");
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
          <Search size={20} />
          <span className="text-sm font-semibold">Search Engine Optimization</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">AI SEO Analyzer</h1>
        <p className="mt-1 text-sm text-slate-500">Analyze your content and get practical SEO recommendations.</p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">Enter your website URL or content</label>
        <textarea
          required
          rows="7"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your website URL, page content, or target keywords here..."
          className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
          <Sparkles size={18} /> {loading ? "Analyzing..." : "Analyze SEO"}
        </button>
      </form>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">SEO Recommendations</h2>
            <button onClick={() => navigator.clipboard.writeText(result)} className="flex items-center gap-2 text-sm text-violet-600">
              <Copy size={16} /> Copy
            </button>
          </div>
          <p className="whitespace-pre-wrap leading-7 text-slate-700">{result}</p>
        </div>
      )}
    </div>
  );
}
