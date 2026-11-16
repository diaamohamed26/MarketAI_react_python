
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Megaphone,
  DollarSign,
  Eye,
  MousePointerClick,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  Send,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { apiRequest } from "../services/api";
import { generateContent } from "../services/aiService";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setLoadError("");

    try {
      const data = await apiRequest("/dashboard/");
      setDashboard(data);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();

    if (!prompt.trim() || generating) return;

    setGenerating(true);
    setResult("");

    try {
      const data = await generateContent(prompt);
      setResult(
        data.content ||
        data.result ||
        data.reply ||
        data.message ||
        "No content returned."
      );
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  }

  const d = dashboard || {};

  const stats = [
    {
      title: "Total Campaigns",
      value: d.total_campaigns ?? d.campaign_count ?? "—",
      note: "Campaigns created",
      icon: Megaphone,
    },
    {
      title: "Total Budget",
      value:
        d.total_budget != null
          ? `${Number(d.total_budget).toLocaleString()} EGP`
          : "—",
      note: "Total campaign budget",
      icon: DollarSign,
    },
    {
      title: "Impressions",
      value:
        d.total_impressions != null
          ? Number(d.total_impressions).toLocaleString()
          : "—",
      note: "Total audience reach",
      icon: Eye,
    },
    {
      title: "Total Clicks",
      value:
        d.total_clicks != null
          ? Number(d.total_clicks).toLocaleString()
          : "—",
      note: "Campaign interactions",
      icon: MousePointerClick,
    },
  ];

  const recent = d.recent_campaigns || d.campaigns || [];

  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 p-6 text-white shadow-xl shadow-violet-200 md:p-9">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-violet-100">
              <Sparkles size={14} />
              YOUR MARKETING OVERVIEW
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Welcome to MarketAI
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-violet-100 md:text-base">
              Plan, create, and improve your marketing campaigns with the
              power of artificial intelligence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                <Megaphone size={17} />
                Create Campaign
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/ai-chat"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Sparkles size={17} />
                Ask AI Assistant
              </Link>
            </div>
          </div>

          <div className="hidden h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 md:flex">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
              <TrendingUp size={48} />
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />
      </section>

      {/* Error Message */}
      {loadError && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center">
          <p>Could not load dashboard: {loadError}</p>
          <button
            onClick={loadDashboard}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics Header */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Marketing Performance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Overview of your business performance
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 xl:grid-cols-5">

        {/* AI Generator */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                AI Marketing Assistant
              </h2>
              <p className="text-sm text-slate-500">
                Generate marketing ideas and content instantly.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <label
              htmlFor="dashboard-prompt"
              className="block text-sm font-semibold text-slate-700"
            >
              What would you like to create?
            </label>

            <textarea
              id="dashboard-prompt"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create a launch campaign for a new coffee brand targeting young adults..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />

            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Generate with AI
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold text-violet-800">
                <Sparkles size={17} />
                AI Generated Result
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {result}
              </p>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(result)}
                className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                Copy Result
              </button>
            </div>
          )}
        </section>

        {/* Recent Campaigns */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Campaigns
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest marketing activity
              </p>
            </div>

            <Link
              to="/campaigns"
              className="text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              View all
            </Link>
          </div>

          {loading && !dashboard ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading campaigns...
            </p>
          ) : recent.length ? (
            <div className="space-y-4">
              {recent.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Megaphone size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {campaign.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {campaign.platform || "Platform not set"}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {campaign.status || "Draft"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Megaphone size={25} />
              </div>

              <h3 className="font-semibold text-slate-700">
                No campaigns yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first campaign to get started.
              </p>

              <Link
                to="/campaigns"
                className="mt-4 inline-block text-sm font-semibold text-violet-600 hover:text-violet-800"
              >
                Create Campaign →
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
