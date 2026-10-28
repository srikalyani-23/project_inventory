
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { forecastData } from "./data/inventorydata";
import { useInventory } from "./context/InventoryContext";
import Inventory from "./pages/Inventory";
import ProductDetails from "./pages/ProductDetails";
import Alerts from "./pages/Alerts";
import DemandForecast from "./pages/DemandForecast";
import "./App.css";

function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
const { inventory } = useInventory();
  const pageNames = {
    "/": "Executive Dashboard",
    "/inventory": "Inventory Catalog",
    "/forecast": "Demand Forecasting",
    "/alerts": "Risk & Reports",
  };

  const currentPage =
    location.pathname.startsWith("/inventory/")
      ? "Product Details"
      : pageNames[location.pathname] || "StockPulse AI";

  function handleSearch(event) {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;

    const product = inventorydata.find((item) =>
      item.product.toLowerCase().includes(query.toLowerCase())
    );

    if (product) {
      window.location.href = `/inventory/${product.id}`;
    } else {
      window.location.href = "/inventory";
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <div className="brand-logo">
            <Activity size={23} strokeWidth={2.4} />
          </div>
          <div>
            <strong>StockPulse AI</strong>
            <span>Inventory Intelligence</span>
          </div>
        </NavLink>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="nav-menu" aria-label="Main navigation">
          <NavLink to="/" end className="nav-item">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/inventory" className="nav-item">
            <Package size={18} />
            <span>Inventory Catalog</span>
          </NavLink>

          <NavLink to="/forecast" className="nav-item">
            <ChartNoAxesCombined size={18} />
            <span>Demand Forecasting</span>
          </NavLink>

          <NavLink to="/alerts" className="nav-item">
            <ShieldAlert size={18} />
            <span>Risk & Reports</span>
          </NavLink>
        </nav>

        <div className="sidebar-engine">
          <span className="engine-indicator" />
          <div>
            <strong>Inventory Engine</strong>
            <span>Demo data active</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot" />
            UI system online
          </div>
          <div className="user-mini">
            <div className="avatar">SP</div>
            <div>
              <strong>Inventory Manager</strong>
              <span>SME Admin</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-page-label">
            <span>WORKSPACE</span>
            <strong>{currentPage}</strong>
          </div>

          <div className="topbar-actions">
            {searchOpen && (
              <form className="search-form" onSubmit={handleSearch}>
                <Search size={16} />
                <input
                  autoFocus
                  className="top-search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search products"
                />
              </form>
            )}

            <button
              className="icon-btn"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              title="Search products"
            >
              <Search size={18} />
            </button>

            <button
              className="icon-btn notification-button"
              aria-label="Notifications"
              title="Inventory alerts"
              onClick={() => {
                window.location.href = "/alerts";
              }}
            >
              <Bell size={18} />
              {inventorydata.some((item) =>
                ["Critical", "Low Stock"].includes(item.status)
              ) && <span className="notification-dot" />}
            </button>

            <div className="top-avatar">SP</div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function Dashboard() {
  const totalProducts = inventorydata.length;
  const lowStockCount = inventorydata.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const criticalCount = inventorydata.filter(
    (item) => item.status === "Critical"
  ).length;
  const reorderCount = inventorydata.filter(
    (item) => item.recommendedOrder > 0
  ).length;
  const overstockCount = inventorydata.filter(
    (item) => item.status === "Overstock"
  ).length;
  const healthyCount = inventorydata.filter(
    (item) => item.status === "Healthy"
  ).length;

  const inventoryValue = inventorydata.reduce(
    (sum, item) => sum + item.currentStock,
    0
  );

  const alerts = inventorydata.filter(
    (item) => item.status !== "Healthy"
  );

  
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-dot" />
            INVENTORY INTELLIGENCE
          </div>
          <h1>Executive Dashboard</h1>
          <p>
            Monitor inventory health, forecast demand and prioritize
            replenishment.
          </p>
        </div>

        <NavLink to="/forecast" className="primary-button dashboard-cta">
          <Sparkles size={15} />
          Explore Forecast
          <ArrowRight size={15} />
        </NavLink>
      </div>

      <div className="dashboard-context">
        <div>
          <span className="context-dot" />
          Demo workspace
        </div>
        <span>Sample inventory data · ML integration pending</span>
      </div>

      <div className="kpi-grid">
        <Kpi
          title="Total Products"
          value={totalProducts.toLocaleString()}
          note="Products tracked"
          icon={<Boxes size={19} />}
          tone="purple"
        />
        <Kpi
          title="Critical Stock"
          value={criticalCount}
          note="Immediate attention"
          icon={<AlertTriangle size={19} />}
          tone="red"
        />
        <Kpi
          title="Reorder Required"
          value={reorderCount}
          note="Suggested replenishment"
          icon={<RefreshCw size={19} />}
          tone="amber"
        />
        <Kpi
          title="Healthy Stock"
          value={healthyCount}
          note="Within healthy range"
          icon={<TrendingUp size={19} />}
          tone="green"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel forecast-dashboard">
          <div className="panel-heading">
            <div>
              <div className="section-kicker">
                <ChartNoAxesCombined size={15} />
                DEMAND PLANNING
              </div>
              <h2>Demand Forecast & Projection</h2>
              <p>Historical demand compared with the demo forecast</p>
            </div>
            <NavLink to="/forecast" className="text-link">
              View details <ArrowRight size={14} />
            </NavLink>
          </div>
          <ForecastChart />
        </section>

        <section className="panel risk-overview">
          <div className="panel-heading">
            <div>
              <div className="section-kicker">
                <ShieldAlert size={15} />
                STOCK HEALTH
              </div>
              <h2>Inventory Risk</h2>
              <p>Product distribution by current status</p>
            </div>
          </div>

          <div className="risk-summary">
            <div>
              <strong>{lowStockCount + criticalCount}</strong>
              <span>products need attention</span>
            </div>
            <AlertTriangle size={19} />
          </div>

          <div className="risk-bars">
            <RiskBar label="Critical" count={criticalCount} total={totalProducts} />
            <RiskBar label="Low Stock" count={lowStockCount} total={totalProducts} />
            <RiskBar label="Overstock" count={overstockCount} total={totalProducts} />
            <RiskBar label="Healthy" count={healthyCount} total={totalProducts} />
          </div>

          <NavLink to="/alerts" className="risk-footer-link">
            Review inventory risks <ChevronRight size={15} />
          </NavLink>
        </section>
      </div>

      <section className="panel alerts-dashboard-panel">
        <div className="panel-heading">
          <div>
            <div className="section-kicker">
              <AlertTriangle size={15} />
              ACTION CENTER
            </div>
            <h2>Inventory Alerts</h2>
            <p>Products requiring attention or replenishment</p>
          </div>
          <NavLink to="/alerts" className="text-link">
            View all <ArrowRight size={14} />
          </NavLink>
        </div>

        <div className="alert-list">
          {alerts.map((item) => (
            <div className="alert-row" key={item.id}>
              <div className={`alert-icon ${statusClass(item.status)}`}>
                {item.status === "Overstock" ? (
                  <Boxes size={17} />
                ) : (
                  <AlertTriangle size={17} />
                )}
              </div>

              <div className="alert-product">
                <strong>{item.product}</strong>
                <span>{item.category}</span>
              </div>

              <StatusBadge status={item.status} />

              <div className="alert-stock">
                <span>Current stock</span>
                <strong>{item.currentStock} units</strong>
              </div>

              <div className="alert-order">
                <span>Suggested action</span>
                <strong>
                  {item.recommendedOrder > 0
                    ? `Order ${item.recommendedOrder}`
                    : "Review excess stock"}
                </strong>
              </div>

              <NavLink to={`/inventory/${item.id}`} className="small-view">
                View <ChevronRight size={13} />
              </NavLink>
            </div>
          ))}

          {alerts.length === 0 && (
            <p className="empty-state">No inventory alerts at this time.</p>
          )}
        </div>
      </section>

      <div className="dashboard-footnote">
        <Activity size={14} />
        <span>
          Figures are calculated from the current demo dataset. Actual ML
          forecasts will appear after backend integration.
        </span>
      </div>
    </div>
  );
}

function Kpi({ title, value, note, icon, tone }) {
  return (
    <div className={`kpi-card kpi-${tone}`}>
      <div className="kpi-top">
        <span>{title}</span>
        <div className="kpi-icon">{icon}</div>
      </div>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

function RiskBar({ label, count, total }) {
  const width = total ? (count / total) * 100 : 0;

  return (
    <div className="risk-bar">
      <div className="risk-label">
        <span>{label}</span>
        <strong>{count}</strong>
      </div>
      <div
        className="bar-track"
        role="progressbar"
        aria-label={`${label} products`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
      >
        <div
          className={`bar-fill ${statusClass(label)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${statusClass(status)}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function ForecastChart() {
  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <span>
          <i className="legend-line actual" />
          Historical demand
        </span>
        <span>
          <i className="legend-line forecast" />
          Demo forecast
        </span>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <LineChart
          data={forecastData}
          margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#efedf6"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9290a7", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            tick={{ fill: "#9290a7", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #ecebf4",
              boxShadow: "0 8px 24px rgba(39,31,82,.08)",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Historical demand"
            stroke="#7660e8"
            strokeWidth={2.5}
            connectNulls={false}
            dot={{ r: 3, fill: "#7660e8", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Demo forecast"
            stroke="#25b995"
            strokeWidth={2.5}
            strokeDasharray="6 5"
            connectNulls={false}
            dot={{ r: 3, fill: "#25b995", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<ProductDetails />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/forecast" element={<DemandForecast />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
