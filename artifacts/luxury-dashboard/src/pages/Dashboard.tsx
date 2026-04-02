import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const THEMES = ["dark", "darker", "gold"] as const;
type Theme = typeof THEMES[number];

function useCountUp(target: number, duration: number = 2000, start: boolean = true) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const startVal = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return current;
}

function formatCurrency(val: number, short = false) {
  if (short) {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
  }
  return `$${val.toLocaleString()}`;
}

const generateChartData = (points: number, base: number, variance: number) =>
  Array.from({ length: points }, (_, i) => ({
    day: i + 1,
    value: base + Math.sin(i * 0.5) * variance + Math.random() * variance * 0.5,
  }));

const ASSETS = [
  { icon: "🏰", name: "Monaco Penthouse", type: "Real Estate", value: 48_500_000, change: 3.2 },
  { icon: "✈️", name: "Gulfstream G700", type: "Private Jet", value: 75_000_000, change: 1.1 },
  { icon: "🚗", name: "Bugatti La Voiture Noire", type: "Supercar", value: 18_000_000, change: 12.4 },
  { icon: "🛥️", name: "Oceanis 540 Yacht", type: "Superyacht", value: 22_000_000, change: 5.8 },
  { icon: "💎", name: "Pink Diamond Collection", type: "Jewelry", value: 4_200_000, change: 8.3 },
  { icon: "🏝️", name: "Private Island, Maldives", type: "Real Estate", value: 32_000_000, change: 2.1 },
];

const INVESTMENTS = [
  { symbol: "NVDA", name: "NVIDIA Corp", value: 8_420_000, change: 142.3, data: generateChartData(20, 800, 120) },
  { symbol: "BTC", name: "Bitcoin", value: 12_800_000, change: 87.2, data: generateChartData(20, 65000, 8000) },
  { symbol: "ETH", name: "Ethereum", value: 4_100_000, change: 34.5, data: generateChartData(20, 3200, 400) },
  { symbol: "TSLA", name: "Tesla Inc", value: 2_950_000, change: -8.4, data: generateChartData(20, 220, 30) },
  { symbol: "AAPL", name: "Apple Inc", value: 5_600_000, change: 23.1, data: generateChartData(20, 180, 15) },
];

const PURCHASES = [
  { icon: "🥂", name: "Dom Pérignon P3 Jeroboam", amount: 28_000, time: "2 min ago", category: "Champagne" },
  { icon: "✈️", name: "Private Charter — Monaco to Cannes", amount: 45_000, time: "1 hr ago", category: "Aviation" },
  { icon: "🌹", name: "Suite at Hotel de Paris Monte Carlo", amount: 12_400, time: "3 hrs ago", category: "Hospitality" },
  { icon: "💍", name: "Cartier Panthère de Cartier Ring", amount: 84_000, time: "Yesterday", category: "Jewelry" },
  { icon: "🎨", name: "Basquiat Original — Auction", amount: 2_800_000, time: "2 days ago", category: "Fine Art" },
  { icon: "🚢", name: "Mediterranean Yacht Charter 7 Nights", amount: 320_000, time: "3 days ago", category: "Travel" },
  { icon: "🍾", name: "Pétrus 1961 Case (12 bottles)", amount: 92_000, time: "4 days ago", category: "Wine" },
];

const NOTIFICATIONS = [
  { id: 1, text: "You earned $45,000 today", icon: "💰" },
  { id: 2, text: "NVDA up 3.2% — +$268,000", icon: "📈" },
  { id: 3, text: "BTC hit $98,400 — nice.", icon: "₿" },
  { id: 4, text: "Your Monaco penthouse appreciated $800K", icon: "🏰" },
  { id: 5, text: "New dividend: Apple $124,000", icon: "🍎" },
  { id: 6, text: "Portfolio milestone: $128M reached", icon: "🎯" },
];

interface ToastNotification {
  id: number;
  text: string;
  icon: string;
  leaving?: boolean;
}

export default function Dashboard() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [netWorth, setNetWorth] = useState(128_450_920);
  const [dailyIncome, setDailyIncome] = useState(45_200);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [notifCount, setNotifCount] = useState(3);
  const [addingIncome, setAddingIncome] = useState(false);
  const [activeAssetTab, setActiveAssetTab] = useState("all");
  const [started, setStarted] = useState(false);
  const netWorthDisplay = useCountUp(netWorth, 2500, started);
  const dailyIncomeDisplay = useCountUp(dailyIncome, 1800, started);
  const notifIndex = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    return () => document.documentElement.removeAttribute("data-theme");
  }, [theme]);

  const showToast = useCallback((notification: Omit<ToastNotification, 'leaving'>) => {
    const id = Date.now() + Math.random();
    const toast: ToastNotification = { ...notification, id };
    setToasts(prev => [toast, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === toast.id ? { ...t, leaving: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 350);
    }, 4000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const n = NOTIFICATIONS[notifIndex.current % NOTIFICATIONS.length];
      showToast(n);
      notifIndex.current++;
    }, 8000);
    return () => clearInterval(interval);
  }, [showToast]);

  useEffect(() => {
    const incomeTimer = setInterval(() => {
      const delta = Math.floor(Math.random() * 500 + 100);
      setDailyIncome(prev => prev + delta);
      setNetWorth(prev => prev + delta);
    }, 3000);
    return () => clearInterval(incomeTimer);
  }, []);

  const handleAddIncome = () => {
    if (addingIncome) return;
    setAddingIncome(true);
    const amount = Math.floor(Math.random() * 500_000 + 100_000);
    setNetWorth(prev => prev + amount);
    setDailyIncome(prev => prev + amount);
    showToast({ id: Date.now(), text: `+${formatCurrency(amount)} added to portfolio`, icon: "🚀" });
    setNotifCount(n => n + 1);
    setTimeout(() => setAddingIncome(false), 1500);
  };

  const netWorthData = generateChartData(30, 100_000_000, 10_000_000);

  const cycleTheme = () => {
    setTheme(prev => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  };

  const themeLabel = { dark: "Dark", darker: "Darker", gold: "Gold Noir" }[theme];
  const themeIcon = { dark: "🌑", darker: "⚫", gold: "✨" }[theme];

  return (
    <div className="min-h-screen animated-bg relative">
      {/* Background orbs */}
      <div className="orb w-96 h-96 top-[-100px] right-[-50px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)" }} />
      <div className="orb w-80 h-80 bottom-[10%] left-[-100px] opacity-15"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)" }} />
      <div className="orb w-64 h-64 top-[40%] left-[30%] opacity-10"
        style={{ background: "radial-gradient(circle, rgba(180,83,9,0.5) 0%, transparent 70%)" }} />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
        {toasts.map(toast => (
          <div key={toast.id} className={`glass-gold rounded-xl px-4 py-3 flex items-center gap-3 ${toast.leaving ? 'slide-out' : 'slide-in'}`}>
            <span className="text-2xl">{toast.icon}</span>
            <p className="text-sm font-medium text-amber-200">{toast.text}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 glass-dark border-b border-amber-900/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full gold-glow-strong flex items-center justify-center text-2xl float"
                style={{ background: "linear-gradient(135deg, #b45309, #fde68a, #d97706)" }}>
                👑
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-background pulse-gold" />
            </div>
            <div>
              <p className="text-xs text-amber-500 font-medium uppercase tracking-widest">Premium Member</p>
              <h2 className="text-base font-semibold text-amber-100">Alexander Thorne</h2>
            </div>
          </div>

          {/* Title */}
          <div className="hidden md:block text-center">
            <h1 className="text-xl font-bold gold-text tracking-wide">AUREX WEALTH</h1>
            <p className="text-[10px] text-amber-700 uppercase tracking-[0.2em]">Luxury Portfolio Management</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button onClick={cycleTheme}
              className="glass rounded-xl px-3 py-2 text-sm flex items-center gap-2 hover:border-amber-600/40 transition-all btn-press">
              <span>{themeIcon}</span>
              <span className="text-amber-300 font-medium">{themeLabel}</span>
            </button>

            {/* Notifications */}
            <button className="relative glass rounded-xl w-10 h-10 flex items-center justify-center hover:border-amber-600/40 transition-all btn-press">
              <span className="text-lg">🔔</span>
              {notifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center badge-pulse">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="glass rounded-xl w-10 h-10 flex items-center justify-center hover:border-amber-600/40 transition-all btn-press">
              <span className="text-lg">⚙️</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Net Worth Hero */}
        <section className="glass-gold rounded-3xl p-8 gold-glow luxury-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-amber-500 text-sm font-medium uppercase tracking-widest mb-2">Total Net Worth</p>
              <div className="flex items-end gap-4">
                <h1 className="text-5xl md:text-7xl font-black gold-text-2 tabular-nums">
                  {formatCurrency(netWorthDisplay)}
                </h1>
                <div className="mb-2 flex items-center gap-1.5 bg-green-900/40 border border-green-700/40 rounded-full px-3 py-1">
                  <span className="text-green-400 text-sm">↑</span>
                  <span className="text-green-400 font-semibold text-sm">+12.4%</span>
                  <span className="text-green-600 text-xs">YTD</span>
                </div>
              </div>
              <p className="text-amber-700 text-sm mt-2">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <button onClick={handleAddIncome}
                disabled={addingIncome}
                className="btn-press px-6 py-3 rounded-2xl font-bold text-black transition-all disabled:opacity-60"
                style={{
                  background: addingIncome
                    ? "linear-gradient(135deg, #92400e, #b45309)"
                    : "linear-gradient(135deg, #f59e0b, #fde68a, #d97706)",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.4)"
                }}>
                {addingIncome ? "Processing..." : "💸 Add Income"}
              </button>
              <div className="flex items-center gap-3 text-amber-300">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-xs text-amber-600">Portfolio Rank</p>
                  <p className="font-bold">#247 Globally</p>
                </div>
              </div>
            </div>
          </div>

          {/* Net Worth Chart */}
          <div className="mt-6 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthData}>
                <defs>
                  <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2}
                  fill="url(#netWorthGrad)" dot={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "8px", color: "#fde68a" }}
                  formatter={(v: number) => [formatCurrency(v, true), "Net Worth"]}
                  labelFormatter={() => ""}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "💰", label: "Daily Income", value: formatCurrency(dailyIncomeDisplay), sub: "↑ $1.2K/hr", color: "text-green-400" },
            { icon: "🏦", label: "Liquid Assets", value: "$18.4M", sub: "Available instantly", color: "text-amber-400" },
            { icon: "📈", label: "Investments", value: "$89.2M", sub: "↑ 3.4% today", color: "text-blue-400" },
            { icon: "🌍", label: "Countries", value: "31", sub: "Active assets", color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 luxury-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-amber-600 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className={`text-2xl font-black ${stat.color} tabular-nums`}>{stat.value}</p>
              <p className="text-xs text-amber-700 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Assets + Investments Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Assets */}
          <section className="glass rounded-2xl p-6 luxury-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-amber-100 text-lg">Physical Assets</h2>
                <p className="text-amber-700 text-xs mt-0.5">Portfolio value: $199.7M</p>
              </div>
              <div className="flex gap-1">
                {["all", "property", "transport"].map(tab => (
                  <button key={tab} onClick={() => setActiveAssetTab(tab)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeAssetTab === tab ? "bg-amber-500 text-black" : "text-amber-600 hover:text-amber-300"}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {ASSETS.map((asset, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {asset.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-amber-100 text-sm truncate">{asset.name}</p>
                    <p className="text-xs text-amber-700">{asset.type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-amber-300 text-sm">{formatCurrency(asset.value, true)}</p>
                    <p className={`text-xs font-medium ${asset.change > 0 ? "text-green-400" : "text-red-400"}`}>
                      {asset.change > 0 ? "+" : ""}{asset.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Investments */}
          <section className="glass rounded-2xl p-6 luxury-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-amber-100 text-lg">Investments</h2>
                <p className="text-amber-700 text-xs mt-0.5">Total: $33.87M</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-600">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Markets Open
              </div>
            </div>
            <div className="space-y-4">
              {INVESTMENTS.map((inv, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-black flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                      {inv.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-amber-100 text-sm">{inv.symbol}</p>
                        <p className="font-bold text-amber-300 text-sm">{formatCurrency(inv.value, true)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-amber-700">{inv.name}</p>
                        <p className={`text-xs font-semibold ${inv.change > 0 ? "text-green-400" : "text-red-400"}`}>
                          {inv.change > 0 ? "+" : ""}{inv.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={inv.data}>
                        <Line type="monotone" dataKey="value"
                          stroke={inv.change > 0 ? "#4ade80" : "#f87171"}
                          strokeWidth={1.5} dot={false} />
                        <Tooltip
                          contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", color: "#fde68a", fontSize: "11px" }}
                          formatter={(v: number) => [v.toLocaleString(), inv.symbol]}
                          labelFormatter={() => ""}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Daily Income + Purchases Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Daily Income */}
          <section className="glass rounded-2xl p-6 luxury-card">
            <h2 className="font-bold text-amber-100 text-lg mb-1">Daily Income</h2>
            <p className="text-amber-700 text-xs mb-4">Live ticker — resets midnight</p>

            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-3xl">💸</span>
              </div>
              <p className="text-4xl font-black gold-text tabular-nums">
                {formatCurrency(dailyIncomeDisplay, true)}
              </p>
              <p className="text-green-400 text-sm font-medium mt-2">↑ Earning right now</p>
            </div>

            {/* Income breakdown */}
            <div className="space-y-3 mt-4">
              {[
                { name: "Rental Income", amount: 12_400, pct: 28 },
                { name: "Dividends", amount: 8_200, pct: 18 },
                { name: "Trading Profits", amount: 18_600, pct: 41 },
                { name: "Business", amount: 6_000, pct: 13 },
              ].map((src, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-400">{src.name}</span>
                    <span className="text-amber-300 font-medium">${src.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-amber-950/60">
                    <div className="h-full rounded-full progress-fill"
                      style={{
                        background: "linear-gradient(90deg, #f59e0b, #fde68a)",
                        width: `${src.pct}%`
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Luxury Purchases */}
          <section className="glass rounded-2xl p-6 luxury-card lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-amber-100 text-lg">Recent Acquisitions</h2>
                <p className="text-amber-700 text-xs mt-0.5">Latest luxury activity</p>
              </div>
              <button className="text-xs text-amber-500 hover:text-amber-300 transition-colors font-medium">View All →</button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {PURCHASES.map((purchase, i) => (
                <div key={i}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-amber-900/30">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {purchase.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-amber-100 text-sm truncate">{purchase.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-amber-700">{purchase.time}</span>
                      <span className="w-1 h-1 bg-amber-800 rounded-full" />
                      <span className="text-xs text-amber-600 bg-amber-950/60 px-1.5 py-0.5 rounded-md">{purchase.category}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-amber-400 text-sm">-{formatCurrency(purchase.amount, true)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Portfolio Allocation */}
        <section className="glass rounded-2xl p-6 luxury-card">
          <h2 className="font-bold text-amber-100 text-lg mb-6">Portfolio Allocation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Real Estate", pct: 62, value: "$80.5M", color: "#f59e0b" },
              { label: "Aviation & Transport", pct: 72, value: "$93M", color: "#d97706" },
              { label: "Equities & Crypto", pct: 45, value: "$33.9M", color: "#fbbf24" },
              { label: "Collectibles", pct: 28, value: "$6.3M", color: "#b45309" },
            ].map((alloc, i) => (
              <div key={i} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9"
                      fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9"
                      fill="none" stroke={alloc.color} strokeWidth="3"
                      strokeDasharray={`${alloc.pct} ${100 - alloc.pct}`}
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 6px ${alloc.color}60)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-300 font-black text-lg">{alloc.pct}%</span>
                  </div>
                </div>
                <p className="text-amber-200 font-semibold text-sm">{alloc.value}</p>
                <p className="text-amber-700 text-xs mt-0.5">{alloc.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center py-4">
          <p className="text-amber-900/60 text-xs">
            This is a fictional demo UI · All data is simulated · Not a real financial product
          </p>
        </div>
      </main>
    </div>
  );
}
