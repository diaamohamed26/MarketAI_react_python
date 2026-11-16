
import { useLocation } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";

const pageTitles = {
  "/": "Dashboard",
  "/campaigns": "Campaigns",
  "/social-media": "Social Media",
  "/ai-chat": "AI Assistant",
  "/seo": "SEO Tools",
  "/settings": "Settings",
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "MarketAI";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Welcome to your marketing workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />
          <input
            placeholder="Search..."
            className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
          M
        </div>
      </div>
    </header>
  );
}
