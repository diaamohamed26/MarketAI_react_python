
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Share2,
  Bot,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Campaigns", path: "/campaigns", icon: Megaphone },
  { name: "Social Media", path: "/social-media", icon: Share2 },
  { name: "AI Assistant", path: "/ai-chat", icon: Bot },
  { name: "SEO Tools", path: "/seo", icon: Search },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">MarketAI</h1>
              <p className="text-xs text-slate-400">Marketing Workspace</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {links.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-950/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-violet-300">
              <Sparkles size={17} />
              <span className="text-sm font-semibold">AI Power</span>
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Create smarter campaigns and grow your business with AI.
            </p>
          </div>
          <p className="mt-5 text-center text-xs text-slate-600">
            MarketAI © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
