import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileSpreadsheet,
  Filter,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LogIn,
  Menu,
  PackageCheck,
  PanelLeftClose,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UploadCloud,
  Users,
  X,
  Zap,
} from "lucide-react";

type Marketplace = "USA" | "UK";
type Page = "overview" | "inventory" | "reports" | "settings";

type Product = {
  id: string;
  title: string;
  sku: string;
  asin: string;
  marketplace: Marketplace;
  variation: string;
  price: number;
  fee: number;
  supplierCost: number;
  stock: number;
  threshold: number;
  sold30: number;
  trend: "up" | "down" | "steady";
};

type SaleRow = {
  date: string;
  productId: string;
  units: number;
};

const productsSeed: Product[] = [
  { id: "p1", title: "Aurora Glass Water Bottle", sku: "AGB-750-BLK", asin: "B0AURORA01", marketplace: "USA", variation: "750ml / Midnight", price: 29.99, fee: 8.19, supplierCost: 7.4, stock: 184, threshold: 35, sold30: 126, trend: "up" },
  { id: "p2", title: "Aurora Glass Water Bottle", sku: "AGB-500-SAG", asin: "B0AURORA02", marketplace: "USA", variation: "500ml / Sage", price: 24.99, fee: 7.15, supplierCost: 6.2, stock: 68, threshold: 35, sold30: 73, trend: "up" },
  { id: "p3", title: "Luma Desk Light", sku: "LUMA-WHT-01", asin: "B0LUMA001", marketplace: "USA", variation: "Warm White", price: 44.5, fee: 12.04, supplierCost: 14.8, stock: 21, threshold: 30, sold30: 42, trend: "steady" },
  { id: "p4", title: "Luma Desk Light", sku: "LUMA-SND-01", asin: "B0LUMA002", marketplace: "UK", variation: "Sandstone", price: 39.95, fee: 10.68, supplierCost: 13.4, stock: 9, threshold: 24, sold30: 28, trend: "down" },
  { id: "p5", title: "Everyday Carry Organizer", sku: "ECO-GRY-02", asin: "B0CARRY001", marketplace: "UK", variation: "Graphite / 2-pack", price: 18.5, fee: 5.48, supplierCost: 4.25, stock: 0, threshold: 20, sold30: 19, trend: "down" },
  { id: "p6", title: "Cloud Knit Throw", sku: "CKT-CRM-03", asin: "B0CLOUD001", marketplace: "UK", variation: "Cream / Large", price: 49.0, fee: 13.76, supplierCost: 18.1, stock: 37, threshold: 18, sold30: 17, trend: "steady" },
  { id: "p7", title: "Focus Cable Kit", sku: "FCK-4IN1-01", asin: "B0FOCUS001", marketplace: "USA", variation: "4-in-1 / Black", price: 16.99, fee: 4.72, supplierCost: 3.15, stock: 248, threshold: 40, sold30: 94, trend: "up" },
  { id: "p8", title: "Cedar Travel Case", sku: "CTC-TAN-01", asin: "B0CEDAR001", marketplace: "USA", variation: "Tan / Medium", price: 32.0, fee: 8.71, supplierCost: 9.7, stock: 14, threshold: 20, sold30: 8, trend: "down" },
];

const seedProducts = productsSeed;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateOffset(offset: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return dateKey(d);
}

const salesSeed: SaleRow[] = Array.from({ length: 45 }, (_, dayIndex) =>
  productsSeed.flatMap((product, productIndex) => {
    const base = product.sold30 / 30;
    const wave = ((dayIndex * 7 + productIndex * 3) % 6) - 2;
    const weekendAdjustment = dayIndex % 7 === 5 || dayIndex % 7 === 6 ? 1 : 0;
    const units = Math.max(0, Math.round(base + wave * 0.35 + weekendAdjustment));
    return units ? [{ date: dateOffset(-44 + dayIndex), productId: product.id, units }] : [];
  }),
).flat();

const money = (value: number, currency: string) =>
  new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));

function MetricCard({ label, value, helper, icon: Icon, tone = "blue", trend }: { label: string; value: string; helper: string; icon: typeof Gauge; tone?: "blue" | "amber" | "green" | "purple" | "red"; trend?: "up" | "down" }) {
  const toneClasses = {
    blue: "bg-cyan-400/10 text-cyan-300 border-cyan-400/15",
    amber: "bg-amber-300/10 text-amber-200 border-amber-300/15",
    green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/15",
    purple: "bg-violet-400/10 text-violet-300 border-violet-400/15",
    red: "bg-rose-400/10 text-rose-300 border-rose-400/15",
  }[tone];
  return (
    <div className="metric-card group">
      <div className={`metric-icon ${toneClasses}`}><Icon size={19} strokeWidth={1.8} /></div>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="metric-value">{value}</p>
        </div>
        {trend && <span className={`trend-pill ${trend === "up" ? "trend-up" : "trend-down"}`}>{trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {trend === "up" ? "12.4%" : "8.1%"}</span>}
      </div>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function MiniBarChart({ values, labels, accent = "cyan" }: { values: number[]; labels: string[]; accent?: "cyan" | "amber" }) {
  const max = Math.max(...values, 1);
  return (
    <div className="mini-chart">
      <div className="chart-grid-lines"><span /><span /><span /></div>
      <div className="relative z-10 flex h-full items-end justify-between gap-1.5">
        {values.map((value, index) => (
          <div key={`${labels[index]}-${index}`} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex w-full max-w-[24px] items-end justify-center" style={{ height: `${Math.max(10, (value / max) * 100)}%` }}>
              <div className={`chart-bar ${accent === "amber" ? "chart-bar-amber" : "chart-bar-cyan"}`} />
              <span className="chart-tooltip">{value}</span>
            </div>
            <span className="text-[9px] font-medium text-slate-600">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("amazon123");
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username === "admin" && password === "amazon123") onLogin();
    else setError("Demo login: use admin / amazon123");
  };
  return (
    <main className="login-shell">
      <div className="login-glow login-glow-one" /><div className="login-glow login-glow-two" />
      <div className="login-card">
        <div className="mb-9 flex items-center gap-3"><div className="brand-mark brand-mark-lg"><Boxes size={22} /></div><div><p className="text-sm font-bold tracking-tight text-white">PIVOT<span className="text-amber-300">OPS</span></p><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Seller intelligence</p></div></div>
        <div className="mb-8"><p className="eyebrow text-cyan-300">Welcome back</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">Run the business.<br /><span className="text-slate-400">Not the spreadsheet.</span></h1><p className="mt-4 text-sm leading-6 text-slate-400">A focused command center for inventory, advertising and profit across your Amazon stores.</p></div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="field-label">Username<input className="dark-input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></label>
          <label className="field-label">Password<input className="dark-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
          {error && <p className="text-xs text-rose-300">{error}</p>}
          <button className="primary-button w-full" type="submit"><LogIn size={16} /> Enter workspace <ChevronRight size={16} className="ml-auto" /></button>
        </form>
        <div className="mt-7 flex items-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={14} className="text-emerald-400" /> Demo mode · data stays in this browser</div>
      </div>
      <div className="login-side-note"><Sparkles size={15} className="text-amber-300" /> Built for US + UK marketplace operators</div>
    </main>
  );
}

function Sidebar({ page, setPage, open, onClose }: { page: Page; setPage: (page: Page) => void; open: boolean; onClose: () => void }) {
  const items: { id: Page; label: string; icon: typeof LayoutDashboard; note?: string }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: PackageCheck, note: "2" },
    { id: "reports", label: "Business reports", icon: BarChart3 },
    { id: "settings", label: "Settings & API", icon: Settings2 },
  ];
  return <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
    <div className="flex items-center justify-between px-5 pb-10 pt-6"><div className="flex items-center gap-3"><div className="brand-mark"><Boxes size={18} /></div><div><p className="text-sm font-bold tracking-tight text-white">PIVOT<span className="text-amber-300">OPS</span></p><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">Seller intelligence</p></div></div><button className="icon-button md:hidden" onClick={onClose}><X size={17} /></button></div>
    <div className="px-3"><p className="nav-section-label">Workspace</p>{items.map((item) => <button key={item.id} onClick={() => { setPage(item.id); onClose(); }} className={`nav-item ${page === item.id ? "nav-item-active" : ""}`}><item.icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.note && <span className="nav-note">{item.note}</span>}{page === item.id && <ChevronRight size={14} className="ml-auto text-cyan-300" />}</button>)}</div>
    <div className="mt-auto px-4 pb-5"><div className="sync-card"><div className="mb-3 flex items-center justify-between"><span className="eyebrow text-slate-500">Data source</span><span className="status-dot"><span /></span></div><p className="text-sm font-medium text-white">Demo data connected</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Swap in SP-API credentials when you are ready to go live.</p><button className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300" onClick={() => setPage("settings")}>Configure source <ChevronRight size={13} /></button></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3"><div className="avatar">AR</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-white">Alex Rivera</p><p className="text-[10px] text-slate-500">Administrator</p></div><ChevronDown size={14} className="ml-auto text-slate-600" /></div></div>
  </aside>;
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("overview");
  const [marketplace, setMarketplace] = useState<Marketplace>("USA");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(productsSeed);
  const [startDate, setStartDate] = useState(dateOffset(-6));
  const [endDate, setEndDate] = useState(dateOffset(0));
  const [adSpend, setAdSpend] = useState(284.4);
  const [additionalCost, setAdditionalCost] = useState(42);
  const [search, setSearch] = useState("");
  const currency = marketplace === "USA" ? "USD" : "GBP";

  const filteredProducts = useMemo(() => products.filter((p) => p.marketplace === marketplace && (!search || `${p.title} ${p.sku} ${p.asin}`.toLowerCase().includes(search.toLowerCase()))), [marketplace, products, search]);
  const filteredSales = useMemo(() => salesSeed.filter((sale) => sale.date >= startDate && sale.date <= endDate && products.find((p) => p.id === sale.productId)?.marketplace === marketplace), [startDate, endDate, marketplace, products]);
  const report = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const units = filteredSales.reduce((total, sale) => total + sale.units, 0);
    const sales = filteredSales.reduce((total, sale) => total + sale.units * (productMap.get(sale.productId)?.price ?? 0), 0);
    const supplier = filteredSales.reduce((total, sale) => total + sale.units * (productMap.get(sale.productId)?.supplierCost ?? 0), 0);
    const fees = filteredSales.reduce((total, sale) => total + sale.units * (productMap.get(sale.productId)?.fee ?? 0), 0);
    const profit = sales - supplier - fees - adSpend;
    const days = Math.max(1, Math.round((new Date(`${endDate}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime()) / 86400000) + 1);
    const previousStart = new Date(`${startDate}T12:00:00`); previousStart.setDate(previousStart.getDate() - days);
    const previousEnd = new Date(`${startDate}T12:00:00`); previousEnd.setDate(previousEnd.getDate() - 1);
    const previousSales = salesSeed.filter((sale) => sale.date >= dateKey(previousStart) && sale.date <= dateKey(previousEnd) && products.find((p) => p.id === sale.productId)?.marketplace === marketplace).reduce((total, sale) => total + sale.units * (productMap.get(sale.productId)?.price ?? 0), 0);
    const previousUnits = salesSeed.filter((sale) => sale.date >= dateKey(previousStart) && sale.date <= dateKey(previousEnd) && products.find((p) => p.id === sale.productId)?.marketplace === marketplace).reduce((total, sale) => total + sale.units, 0);
    return { units, sales, supplier, fees, profit, net: profit - additionalCost, days, previousSales, previousUnits };
  }, [filteredSales, products, startDate, endDate, marketplace, adSpend, additionalCost]);

  const dailyChart = useMemo(() => {
    const days = 7; const productMap = new Map(products.map((p) => [p.id, p]));
    return Array.from({ length: days }, (_, index) => { const date = dateOffset(-(days - 1 - index)); const value = salesSeed.filter((s) => s.date === date && productMap.get(s.productId)?.marketplace === marketplace).reduce((t, s) => t + s.units * (productMap.get(s.productId)?.price ?? 0), 0); return { label: new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2), value: Math.round(value) }; });
  }, [marketplace, products]);
  const topProducts = useMemo(() => products.filter((p) => p.marketplace === marketplace).sort((a, b) => b.sold30 - a.sold30), [marketplace, products]);
  const alerts = useMemo(() => products.filter((p) => p.marketplace === marketplace && p.stock <= p.threshold), [marketplace, products]);

  const updateSupplierCost = (id: string, value: string) => setProducts((current) => current.map((p) => p.id === id ? { ...p, supplierCost: Number(value) || 0 } : p));
  const setQuickRange = (days: number) => { setStartDate(dateOffset(-(days - 1))); setEndDate(dateOffset(0)); };

  const downloadReport = () => {
    const lines: (string | number)[][] = [
      ["PivotOps Amazon Seller Report", `${startDate} to ${endDate}`, marketplace],
      ["Metric", "Value"],
      ["Total units", report.units], ["Total sales", report.sales.toFixed(2)], ["Ad spend", adSpend.toFixed(2)], ["TACoS", `${report.sales ? ((adSpend / report.sales) * 100).toFixed(2) : "0.00"}%`], ["TROAS", `${adSpend ? (report.sales / adSpend).toFixed(2) : "0.00"}x`], ["Supplier cost", report.supplier.toFixed(2)], ["Amazon / FBA fees", report.fees.toFixed(2)], ["Profit / loss", report.profit.toFixed(2)], ["Additional cost", additionalCost.toFixed(2)], ["Net profit / loss", report.net.toFixed(2)], [], ["Product", "SKU", "Units sold", "Sales amount"],
      ...topProducts.map((p) => { const units = filteredSales.filter((s) => s.productId === p.id).reduce((t, s) => t + s.units, 0); return [p.title, p.sku, units, (units * p.price).toFixed(2)]; }),
    ];
    const csv = "\ufeff" + lines.map((row) => row.map((cell: string | number) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); link.download = `pivotops-${marketplace.toLowerCase()}-${startDate}-to-${endDate}.csv`; link.click(); URL.revokeObjectURL(link.href); toast.success("Excel-compatible report downloaded");
  };

  if (!loggedIn) return <LoginScreen onLogin={() => { setLoggedIn(true); toast.success("Welcome back, Alex"); }} />;

  return <div className="app-shell"><Sidebar page={page} setPage={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="sidebar-backdrop md:hidden" onClick={() => setSidebarOpen(false)} /><main className="main-shell">
    <header className="topbar"><div className="flex items-center gap-3"><button className="icon-button md:hidden" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button><div><p className="eyebrow text-cyan-300">{page === "overview" ? "Command center" : page === "inventory" ? "Catalog operations" : page === "reports" ? "Performance intelligence" : "Workspace controls"}</p><h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-white">{page === "overview" ? "Good morning, Alex" : page === "inventory" ? "Inventory" : page === "reports" ? "Business reports" : "Settings & API"}</h1></div></div><div className="flex items-center gap-2 sm:gap-3"><div className="market-switcher"><span className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-600 sm:inline">Store</span><button className={marketplace === "USA" ? "market-active" : ""} onClick={() => setMarketplace("USA")}>US</button><button className={marketplace === "UK" ? "market-active" : ""} onClick={() => setMarketplace("UK")}>UK</button></div><button className="icon-button relative"><Bell size={17} /><span className="notification-dot" /></button><div className="avatar hidden sm:flex">AR</div></div></header>
    {page !== "settings" && <div className="filterbar"><div className="date-controls"><Filter size={14} className="text-slate-600" /><button onClick={() => setQuickRange(1)} className={startDate === dateOffset(0) ? "quick-active" : ""}>Today</button><button onClick={() => setQuickRange(7)} className={startDate === dateOffset(-6) ? "quick-active" : ""}>7 days</button><button onClick={() => setQuickRange(30)} className={startDate === dateOffset(-29) ? "quick-active" : ""}>30 days</button><span className="hidden text-slate-700 sm:inline">|</span><input aria-label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /><span className="text-slate-700">→</span><input aria-label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div><div className="flex items-center gap-2"><span className="demo-badge"><span className="status-dot"><span /></span> Demo data</span><button className="export-button" onClick={downloadReport}><Download size={14} /> <span className="hidden sm:inline">Export</span></button></div></div>}
    <div className="content-area">{page === "overview" && <Overview report={report} currency={currency} adSpend={adSpend} dailyChart={dailyChart} topProducts={topProducts} alerts={alerts} setPage={setPage} />}{page === "inventory" && <Inventory products={filteredProducts} currency={currency} search={search} setSearch={setSearch} updateSupplierCost={updateSupplierCost} />}{page === "reports" && <Reports report={report} currency={currency} adSpend={adSpend} setAdSpend={setAdSpend} additionalCost={additionalCost} setAdditionalCost={setAdditionalCost} dailyChart={dailyChart} topProducts={topProducts} />}{page === "settings" && <Settings />}</div>
  </main></div>;
}

function Overview({ report, currency, adSpend, dailyChart, topProducts, alerts, setPage }: { report: ReturnType<typeof getReportType>; currency: string; adSpend: number; dailyChart: { label: string; value: number }[]; topProducts: Product[]; alerts: Product[]; setPage: (page: Page) => void }) {
  const max = Math.max(...dailyChart.map((d) => d.value), 1); return <div className="animate-in"><div className="hero-strip"><div><div className="flex items-center gap-2"><span className="live-pulse" /> <span className="eyebrow text-emerald-300">Live workspace snapshot</span></div><h2 className="mt-3 max-w-lg font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your store is moving in the right direction.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Profit is up versus the previous period. Keep an eye on the two low-stock listings before the weekend push.</p></div><div className="hero-orbit"><div className="orbit-ring orbit-ring-one" /><div className="orbit-ring orbit-ring-two" /><div className="orbit-core"><TrendingUp size={23} /></div><span className="orbit-label">+18.6%<small>profit trend</small></span></div></div>
    <div className="metric-grid"><MetricCard label="Total sales" value={money(report.sales, currency)} helper={`${report.units} units in selected period`} icon={CircleDollarSign} tone="blue" trend="up" /><MetricCard label="Net profit" value={money(report.net, currency)} helper={`After ${money(adSpend, currency)} ad spend + costs`} icon={TrendingUp} tone="green" trend="up" /><MetricCard label="TACoS" value={`${report.sales ? ((adSpend / report.sales) * 100).toFixed(1) : "0.0"}%`} helper="Ad spend ÷ total sales" icon={Gauge} tone="amber" /><MetricCard label="TROAS" value={`${adSpend ? (report.sales / adSpend).toFixed(2) : "0.00"}x`} helper="Revenue returned per ad dollar" icon={Calculator} tone="purple" /></div>
    <div className="dashboard-grid mt-5"><section className="panel col-span-2"><div className="panel-heading"><div><p className="eyebrow">Revenue pulse</p><h3 className="section-title">Sales performance</h3></div><div className="legend"><span className="legend-dot bg-cyan-300" /> Sales <span className="text-slate-700">•</span> Last 7 days</div></div><div className="chart-with-axis"><div className="axis-labels"><span>{money(max, currency).replace(/\.\d+/, "")}</span><span>{money(max / 2, currency).replace(/\.\d+/, "")}</span><span>0</span></div><MiniBarChart values={dailyChart.map((d) => d.value)} labels={dailyChart.map((d) => d.label)} /></div></section><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Attention needed</p><h3 className="section-title">Stock alerts</h3></div><button className="text-button" onClick={() => setPage("inventory")}>View all <ChevronRight size={13} /></button></div><div className="space-y-2.5">{alerts.slice(0, 3).map((p) => <div key={p.id} className="alert-row"><div className={`alert-icon ${p.stock === 0 ? "alert-danger" : "alert-warn"}`}>{p.stock === 0 ? <X size={14} /> : <AlertTriangle size={14} />}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-200">{p.title}</p><p className="mt-1 text-[10px] text-slate-500">{p.variation}</p></div><div className="text-right"><p className={`text-xs font-bold ${p.stock === 0 ? "text-rose-300" : "text-amber-200"}`}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</p><p className="mt-1 text-[10px] text-slate-600">SKU {p.sku}</p></div></div>)}{alerts.length === 0 && <div className="empty-state">No stock alerts in this store.</div>}</div></section></div>
    <div className="dashboard-grid mt-5"><section className="panel col-span-2"><div className="panel-heading"><div><p className="eyebrow">Product momentum</p><h3 className="section-title">Top sellers & slow movers</h3></div><button className="text-button" onClick={() => setPage("reports")}>Detailed report <ChevronRight size={13} /></button></div><div className="product-list">{topProducts.slice(0, 5).map((p, index) => <div key={p.id} className="product-row"><div className="rank-number">0{index + 1}</div><div className="product-thumb"><span>{p.title.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-200">{p.title}</p><p className="mt-1 truncate text-[10px] text-slate-500">{p.variation} · {p.sku}</p></div><div className="hidden text-right sm:block"><p className="text-xs font-semibold text-slate-300">{money(p.sold30 * p.price, currency)}</p><p className="mt-1 text-[10px] text-slate-500">{p.sold30} units / 30d</p></div><div className={`trend-badge ${p.trend === "up" ? "trend-badge-up" : p.trend === "down" ? "trend-badge-down" : "trend-badge-steady"}`}>{p.trend === "up" ? <TrendingUp size={13} /> : p.trend === "down" ? <TrendingDown size={13} /> : <span>—</span>}</div></div>)}</div></section><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Margin anatomy</p><h3 className="section-title">Where revenue goes</h3></div></div><div className="donut-wrap"><div className="donut"><div className="donut-center"><span>{report.sales ? `${Math.max(0, (report.net / report.sales) * 100).toFixed(0)}%` : "0%"}</span><small>net margin</small></div></div><div className="donut-legend"><div><i className="legend-box bg-emerald-400" /><span>Net profit</span><b>{money(Math.max(0, report.net), currency)}</b></div><div><i className="legend-box bg-cyan-300" /><span>Supplier cost</span><b>{money(report.supplier, currency)}</b></div><div><i className="legend-box bg-violet-400" /><span>Amazon fees</span><b>{money(report.fees, currency)}</b></div><div><i className="legend-box bg-amber-300" /><span>Ad spend</span><b>{money(adSpend, currency)}</b></div></div></div></section></div>
  </div>;
}

type ReportShape = { units: number; sales: number; supplier: number; fees: number; profit: number; net: number; days: number; previousSales: number; previousUnits: number };
const getReportType = (): ReportShape => ({ units: 0, sales: 0, supplier: 0, fees: 0, profit: 0, net: 0, days: 0, previousSales: 0, previousUnits: 0 });

function Inventory({ products, currency, search, setSearch, updateSupplierCost }: { products: Product[]; currency: string; search: string; setSearch: (value: string) => void; updateSupplierCost: (id: string, value: string) => void }) {
  return <div className="animate-in"><div className="page-intro"><div><p className="eyebrow text-cyan-300">Amazon catalog</p><h2 className="page-title">Inventory health</h2><p className="page-subtitle">Demo listing data for the {currency === "USD" ? "US" : "UK"} marketplace, including variations and fee assumptions.</p></div><button className="secondary-button" onClick={() => toast.info("SP-API sync is ready for your credentials in Settings") }><UploadCloud size={15} /> Sync catalog</button></div><div className="inventory-summary"><div><span className="summary-label">Active listings</span><strong>{products.length}</strong></div><div><span className="summary-label">Units on hand</span><strong>{products.reduce((t, p) => t + p.stock, 0)}</strong></div><div><span className="summary-label">Low stock</span><strong className="text-amber-200">{products.filter((p) => p.stock > 0 && p.stock <= p.threshold).length}</strong></div><div><span className="summary-label">Out of stock</span><strong className="text-rose-300">{products.filter((p) => p.stock === 0).length}</strong></div></div><div className="panel mt-5 overflow-hidden"><div className="table-toolbar"><div className="search-field"><Search size={15} /><input placeholder="Search title, SKU or ASIN" value={search} onChange={(e) => setSearch(e.target.value)} /></div><span className="hidden text-xs text-slate-500 sm:block">Supplier cost is editable</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Product / variation</th><th>SKU · ASIN</th><th>Price</th><th>FBA / Amazon fee</th><th>Supplier cost</th><th>Stock</th><th>Health</th></tr></thead><tbody>{products.map((p) => <tr key={p.id}><td><div className="flex min-w-[230px] items-center gap-3"><div className="product-thumb product-thumb-sm"><span>{p.title.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span></div><div><p className="font-semibold text-slate-200">{p.title}</p><p className="mt-1 text-[10px] text-slate-500">{p.variation}</p></div></div></td><td><p className="text-xs font-medium text-slate-300">{p.sku}</p><p className="mt-1 text-[10px] text-slate-600">{p.asin}</p></td><td><span className="font-semibold text-slate-200">{money(p.price, currency)}</span></td><td><span className="font-semibold text-slate-300">{money(p.fee, currency)}</span><p className="mt-1 text-[10px] text-slate-600">{((p.fee / p.price) * 100).toFixed(0)}% of price</p></td><td><div className="cost-input"><span>{currency === "USD" ? "$" : "£"}</span><input type="number" step="0.01" value={p.supplierCost} onChange={(e) => updateSupplierCost(p.id, e.target.value)} /></div></td><td><span className={`stock-number ${p.stock === 0 ? "text-rose-300" : p.stock <= p.threshold ? "text-amber-200" : "text-emerald-300"}`}>{p.stock}</span><p className="mt-1 text-[10px] text-slate-600">threshold {p.threshold}</p></td><td>{p.stock === 0 ? <span className="table-status status-danger"><X size={11} /> Out</span> : p.stock <= p.threshold ? <span className="table-status status-warn"><AlertTriangle size={11} /> Low</span> : <span className="table-status status-good"><Check size={11} /> Healthy</span>}</td></tr>)}</tbody></table></div></div></div>;
}

function Reports({ report, currency, adSpend, setAdSpend, additionalCost, setAdditionalCost, dailyChart, topProducts }: { report: ReportShape; currency: string; adSpend: number; setAdSpend: (value: number) => void; additionalCost: number; setAdditionalCost: (value: number) => void; dailyChart: { label: string; value: number }[]; topProducts: Product[] }) {
  return <div className="animate-in"><div className="page-intro"><div><p className="eyebrow text-cyan-300">Selected period · {report.days} days</p><h2 className="page-title">Business report</h2><p className="page-subtitle">Understand what you sold, what it cost and what you actually kept.</p></div><div className="report-inputs"><label>Ad spend <div className="inline-money-input"><span>{currency === "USD" ? "$" : "£"}</span><input type="number" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} /></div></label><label>Additional costs <div className="inline-money-input"><span>{currency === "USD" ? "$" : "£"}</span><input type="number" value={additionalCost} onChange={(e) => setAdditionalCost(Number(e.target.value))} /></div></label></div></div><div className="metric-grid report-metric-grid"><MetricCard label="Total units sold" value={String(report.units)} helper="Across all active variations" icon={ShoppingCart} tone="blue" /><MetricCard label="Total sales" value={money(report.sales, currency)} helper="Sales price × units sold" icon={CircleDollarSign} tone="green" /><MetricCard label="Profit / loss" value={money(report.profit, currency)} helper="Before additional costs" icon={Calculator} tone={report.profit >= 0 ? "purple" : "red"} /><MetricCard label="Net profit / loss" value={money(report.net, currency)} helper="After additional costs" icon={Zap} tone={report.net >= 0 ? "green" : "red"} /></div><div className="dashboard-grid mt-5"><section className="panel col-span-2"><div className="panel-heading"><div><p className="eyebrow">Sales trend</p><h3 className="section-title">Daily sales amount</h3></div><div className="legend"><span className="legend-dot bg-amber-300" /> Revenue</div></div><div className="chart-with-axis"><div className="axis-labels"><span>{money(Math.max(...dailyChart.map((d) => d.value), 1), currency).replace(/\.\d+/, "")}</span><span>mid</span><span>0</span></div><MiniBarChart values={dailyChart.map((d) => d.value)} labels={dailyChart.map((d) => d.label)} accent="amber" /></div></section><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Efficiency</p><h3 className="section-title">Ad economics</h3></div></div><div className="efficiency-stack"><div className="efficiency-row"><div className="efficiency-icon bg-amber-300/10 text-amber-200"><Gauge size={16} /></div><div><p>TACoS</p><small>Ad spend ÷ total sales</small></div><strong>{report.sales ? ((adSpend / report.sales) * 100).toFixed(1) : "0.0"}%</strong></div><div className="efficiency-row"><div className="efficiency-icon bg-violet-400/10 text-violet-300"><BarChart3 size={16} /></div><div><p>TROAS</p><small>Sales ÷ ad spend</small></div><strong>{adSpend ? (report.sales / adSpend).toFixed(2) : "0.00"}x</strong></div><div className="efficiency-row"><div className="efficiency-icon bg-cyan-300/10 text-cyan-300"><ArrowUpRight size={16} /></div><div><p>Previous period</p><small>{report.previousUnits} units · {money(report.previousSales, currency)}</small></div><strong className={report.sales >= report.previousSales ? "text-emerald-300" : "text-rose-300"}>{report.previousSales ? `${((report.sales / report.previousSales - 1) * 100).toFixed(1)}%` : "—"}</strong></div></div></section></div><section className="panel mt-5"><div className="panel-heading"><div><p className="eyebrow">Unit economics</p><h3 className="section-title">Product performance in selected period</h3></div><span className="text-xs text-slate-600">Sorted by units sold</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Product</th><th>Units sold</th><th>Sales amount</th><th>Supplier cost</th><th>FBA fees</th><th>Contribution</th></tr></thead><tbody>{topProducts.map((p) => { const units = salesSeed.filter((s) => s.productId === p.id && s.date >= dateOffset(-365)).reduce((t, s) => t + s.units, 0); const sales = units * p.price; const contribution = units * (p.price - p.supplierCost - p.fee); return <tr key={p.id}><td><p className="font-semibold text-slate-200">{p.title}</p><p className="mt-1 text-[10px] text-slate-500">{p.variation}</p></td><td className="font-semibold text-slate-300">{units}</td><td>{money(sales, currency)}</td><td>{money(units * p.supplierCost, currency)}</td><td>{money(units * p.fee, currency)}</td><td className="font-semibold text-emerald-300">{money(contribution, currency)}</td></tr>})}</tbody></table></div></section></div>;
}

function Settings() {
  return <div className="animate-in"><div className="page-intro"><div><p className="eyebrow text-cyan-300">Workspace controls</p><h2 className="page-title">Settings & API</h2><p className="page-subtitle">The demo is ready today. These are the connection points for tomorrow.</p></div><span className="demo-badge"><span className="status-dot"><span /></span> Demo mode</span></div><div className="settings-grid"><section className="panel"><div className="settings-icon"><KeyRound size={18} /></div><p className="eyebrow mt-5">Amazon SP-API</p><h3 className="settings-title">Connect your seller account</h3><p className="settings-copy">When you receive your SP-API credentials, this connector will replace the local demo provider with live catalog, inventory, order and fee data.</p><div className="connection-row"><div className="flex items-center gap-3"><div className="connection-dot" /><div><p className="text-sm font-semibold text-slate-200">Demo provider</p><p className="text-[11px] text-slate-500">Local sample catalog is active</p></div></div><span className="table-status status-good"><Check size={11} /> Active</span></div><button className="secondary-button mt-5 w-full" onClick={() => toast.info("SP-API connection form will be enabled once credentials are available")}>Add SP-API credentials <ChevronRight size={15} /></button></section><section className="panel"><div className="settings-icon settings-icon-purple"><ShieldCheck size={18} /></div><p className="eyebrow mt-5">Hosting checklist</p><h3 className="settings-title">Ready for Namecheap</h3><div className="checklist"><div><Check size={14} /> Build produces static files</div><div><Check size={14} /> No API secrets in the browser</div><div><Check size={14} /> CSV export opens in Excel</div><div><Check size={14} /> .htaccess included for routing</div></div><p className="mt-5 text-[11px] leading-5 text-slate-500">For live SP-API access, use a secure server-side integration rather than putting Amazon credentials into this static demo.</p></section></div><section className="panel mt-5"><div className="panel-heading"><div><p className="eyebrow">Architecture note</p><h3 className="section-title">Live data connector map</h3></div></div><div className="connector-map"><div className="connector-node"><Boxes size={18} /><span>Amazon SP-API</span><small>Catalog · Orders · Fees</small></div><div className="connector-line"><span>secure API</span></div><div className="connector-node connector-node-accent"><Gauge size={18} /><span>PivotOps analytics</span><small>Normalize · calculate · alert</small></div><div className="connector-line"><span>reporting</span></div><div className="connector-node"><FileSpreadsheet size={18} /><span>Excel export</span><small>Period-based download</small></div></div></section></div>;
}

// The public static demo intentionally keeps the provider local. A future server-side adapter can implement this same shape.
void (Users || PanelLeftClose || KeyRound);
