
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { apiRequest } from "../services/api";

const initialSettings = {
  business_name: "",
  industry: "",
  target_audience: "",
  brand_tone: "Professional",
  language: "English",
  email_notifications: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiRequest("/settings/");
        setSettings({ ...initialSettings, ...data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function saveSettings(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("/settings/", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings({ ...settings, ...data });
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function update(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  if (loading) {
    return <p className="p-8 text-center text-slate-500">Loading settings...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-violet-600">
          <SettingsIcon size={20} />
          <span className="text-sm font-semibold">Workspace Preferences</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Configure your business and AI content preferences.</p>
      </div>

      <form onSubmit={saveSettings} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Business Name</label>
          <input
            value={settings.business_name}
            onChange={(e) => update("business_name", e.target.value)}
            placeholder="Your business name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
          <input
            value={settings.industry}
            onChange={(e) => update("industry", e.target.value)}
            placeholder="Example: E-commerce, Food, Technology"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Target Audience</label>
          <textarea
            rows="3"
            value={settings.target_audience}
            onChange={(e) => update("target_audience", e.target.value)}
            placeholder="Describe your target audience..."
            className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-violet-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Brand Tone</label>
            <select value={settings.brand_tone} onChange={(e) => update("brand_tone", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500">
              <option>Professional</option>
              <option>Friendly</option>
              <option>Funny</option>
              <option>Luxury</option>
              <option>Persuasive</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Language</label>
            <select value={settings.language} onChange={(e) => update("language", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500">
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(settings.email_notifications)}
            onChange={(e) => update("email_notifications", e.target.checked)}
            className="h-4 w-4 accent-violet-600"
          />
          Enable email notifications
        </label>

        {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
          <Save size={18} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
