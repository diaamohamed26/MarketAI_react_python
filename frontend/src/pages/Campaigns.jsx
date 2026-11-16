
import { useEffect, useState } from "react";
import { Plus, Megaphone, Trash2, RefreshCw } from "lucide-react";
import { apiRequest } from "../services/api";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    platform: "Instagram",
    objective: "Brand Awareness",
    budget: 1000,
  });

  async function loadCampaigns() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/campaigns/");
      setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function createCampaign(e) {
    e.preventDefault();
    try {
      await apiRequest("/campaigns/", {
        method: "POST",
        body: JSON.stringify({ ...form, budget: Number(form.budget) }),
      });
      setForm({
        name: "",
        platform: "Instagram",
        objective: "Brand Awareness",
        budget: 1000,
      });
      setShowForm(false);
      loadCampaigns();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCampaign(id) {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await apiRequest(`/campaigns/${id}/`, { method: "DELETE" });
      loadCampaigns();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your marketing campaigns.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {showForm && (
        <form onSubmit={createCampaign} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
          <input
            required
            placeholder="Campaign name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Google Ads</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
          </select>
          <select
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          >
            <option>Brand Awareness</option>
            <option>Lead Generation</option>
            <option>Website Traffic</option>
            <option>Sales</option>
          </select>
          <input
            type="number"
            min="0"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            placeholder="Budget"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />
          <button className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 md:col-span-2">
            Create Campaign
          </button>
        </form>
      )}

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">All Campaigns</h2>
          <button onClick={loadCampaigns} className="text-slate-500 hover:text-violet-600">
            <RefreshCw size={18} />
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <Megaphone className="mx-auto mb-3 text-slate-300" size={36} />
            <p className="font-medium text-slate-700">No campaigns yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first campaign to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {campaign.platform} · {campaign.objective}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-700">
                    {campaign.budget ?? 0} EGP
                  </span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                    {campaign.status || "Active"}
                  </span>
                  <button onClick={() => deleteCampaign(campaign.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
