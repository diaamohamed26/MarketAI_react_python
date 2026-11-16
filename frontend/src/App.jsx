
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import SocialMedia from "./pages/SocialMedia";
import AIChat from "./pages/AIChat";
import SEO from "./pages/SEO";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/seo" element={<SEO />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
