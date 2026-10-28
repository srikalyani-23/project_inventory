
import { useState } from "react";
import {
  ChartNoAxesCombined,
  Sparkles,
  Package,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  CalendarDays,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { NavLink } from "react-router-dom";
import { inventorydata, forecastData } from "../data/inventorydata";

function DemandForecast() {
  const [productId, setProductId] = useState(String(inventorydata[0]?.id ?? ""));
  const [range, setRange] = useState("10");

  const product = inventorydata.find(
    (item) => item.id === Number(productId)
  ) ?? inventorydata[0];

  const data = forecastData.slice(0, Number(range));

  const forecastValues = data
    .map((point) => point.forecast)
    .filter((value) => typeof value === "number");

  const averageForecast = forecastValues.length
    ? Math.round(
        forecastValues.reduce((sum, value) => sum + value, 0) /
          forecastValues.length
      )
    : 0;

  const peakForecast = forecastValues.length
    ? Math.max(...forecastValues)
    : 0;

  if (!product) {
    return <div className="page">No inventory products available.</div>;
  }

  return (
    <div className="page forecasting-page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="eyebrow-dot" />
            PREDICTIVE ANALYTICS
          </div>
          <h1>Demand Forecasting</h1>
          <p>
            Explore demand trends and plan inventory replenishment using
            the available demo forecast.
          </p>
        </div>

        <div className="forecast-demo-label">
          <Info size={14} />
          Demo predictions
        </div>
      </div>

      <section className="panel forecast-selector-panel">
        <div className="forecast-selector-heading">
          <div className="selector-icon">
            <ChartNoAxesCombined size={19} />
          </div>
          <div>
            <h2>Forecast Configuration</h2>
            <p>Select a product and forecast horizon</p>
          </div>
        </div>

        <div className="forecast-selector-controls">
          <div className="control-group">
            <label htmlFor="forecast-product">Product</label>
            <select
              id="forecast-product"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
            >
              {inventorydata.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="forecast-horizon">Forecast horizon</label>
            <select
              id="forecast-horizon"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="5">5 data points</option>
              <option value="7">7 data points</option>
              <option value="10">10 data points</option>
            </select>
          </div>

          <div className="selected-product-meta">
            <Package size={17} />
            <div>
              <span>Selected category</span>
              <strong>{product.category}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="kpi-grid forecast-kpi-grid">
        <ForecastKpi
          icon={<Package size={19} />}
          title="Current Stock"
          value={`${product.currentStock} units`}
          note="Available inventory"
          tone="purple"
        />
        <ForecastKpi
          icon={<RefreshCw size={19} />}
          title="Reorder Point"
          value={`${product.reorderPoint} units`}
          note="Configured threshold"
          tone="amber"
        />
        <ForecastKpi
          icon={<TrendingUp size={19} />}
          title="Average Demo Forecast"
          value={`${averageForecast} units`}
          note="Across selected data points"
          tone="green"
        />
        <ForecastKpi
          icon={<ShieldAlert size={19} />}
          title="Suggested Order"
          value={`${product.recommendedOrder} units`}
          note="Sample inventory recommendation"
          tone="red"
        />
      </div>

      <section className="panel forecast-main-panel">
        <div className="panel-heading forecast-chart-heading">
          <div>
            <div className="section-kicker">
              <ChartNoAxesCombined size={15} />
              DEMAND ANALYSIS
            </div>
            <h2>{product.product} — Demand Trend</h2>
            <p>Historical demand and sample forecast values</p>
          </div>

          <div className="forecast-peak">
            <span>Peak demo forecast</span>
            <strong>{peakForecast} units</strong>
          </div>
        </div>

        <div className="forecast-chart-legend">
          <span>
            <i className="forecast-legend-dot historical-dot" />
            Historical demand
          </span>
          <span>
            <i className="forecast-legend-dot predicted-dot" />
            Demo forecast
          </span>
        </div>

        <div className="forecast-large-chart">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart
              data={data}
              margin={{ top: 16, right: 15, left: -10, bottom: 4 }}
            >
              <CartesianGrid
                stroke="#efedf6"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "#8e8ba4", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />

              <YAxis
                tick={{ fill: "#8e8ba4", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ecebf4",
                  boxShadow: "0 8px 24px rgba(39,31,82,.08)",
                  fontSize: 12,
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ display: "none" }}
              />

              <ReferenceLine
                y={product.reorderPoint}
                stroke="#e6a13b"
                strokeDasharray="5 5"
                label={{
                  value: "Reorder point",
                  fill: "#b78025",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />

              <Line
                type="monotone"
                dataKey="actual"
                name="Historical demand"
                stroke="#7660e8"
                strokeWidth={2.5}
                connectNulls={false}
                dot={{ r: 4, fill: "#7660e8", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                name="Demo forecast"
                stroke="#25b995"
                strokeWidth={2.5}
                strokeDasharray="6 5"
                connectNulls={false}
                dot={{ r: 4, fill: "#25b995", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="forecast-chart-note">
          <Info size={15} />
          <span>
            The chart uses shared demo data. It is not yet a product-specific
            ML prediction.
          </span>
        </div>
      </section>

      <div className="forecast-insights-grid">
        <section className="panel forecast-insight-card">
          <div className="insight-heading">
            <div className="insight-icon purple-insight">
              <Sparkles size={18} />
            </div>
            <div>
              <h2>Inventory Recommendation</h2>
              <p>Based on the current sample inventory record</p>
            </div>
          </div>

          <div className="recommendation-number">
            {product.recommendedOrder}
            <span> units</span>
          </div>

          <p className="recommendation-description">
            {product.recommendedOrder > 0
              ? `The demo inventory data suggests ordering ${product.recommendedOrder} units of ${product.product}. Validate this quantity against actual demand, supplier lead time and your ML model before placing an order.`
              : `${product.product} currently has no suggested reorder quantity in the demo data. Review demand and stock levels before making a purchasing decision.`}
          </p>

          <NavLink to={`/inventory/${product.id}`} className="insight-action-link">
            View product details <ArrowRight size={15} />
          </NavLink>
        </section>

        <section className="panel forecast-insight-card">
          <div className="insight-heading">
            <div className="insight-icon amber-insight">
              <CalendarDays size={18} />
            </div>
            <div>
              <h2>Planning Checklist</h2>
              <p>Inputs to verify before replenishment</p>
            </div>
          </div>

          <div className="planning-list">
            <div>
              <span className="planning-check">1</span>
              <span>Review current stock and reorder threshold</span>
            </div>
            <div>
              <span className="planning-check">2</span>
              <span>Check supplier lead time and open orders</span>
            </div>
            <div>
              <span className="planning-check">3</span>
              <span>Validate recommendations against ML output</span>
            </div>
          </div>

          <NavLink to="/inventory" className="insight-action-link">
            Open inventory catalog <ArrowRight size={15} />
          </NavLink>
        </section>
      </div>
    </div>
  );
}

function ForecastKpi({ icon, title, value, note, tone }) {
  return (
    <div className={`kpi-card kpi-${tone}`}>
      <div className="kpi-top">
        <span>{title}</span>
        <div className="kpi-icon">{icon}</div>
      </div>
      <h2 className="forecast-kpi-value">{value}</h2>
      <p>{note}</p>
    </div>
  );
}

export default DemandForecast;
