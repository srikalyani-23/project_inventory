import { useParams, Link } from "react-router-dom";
import { forecastData } from "../data/inventorydata";
import { useInventory } from "../context/InventoryContext";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function ProductDetails() {
  const { id } = useParams();
  const product = inventorydata.find(item => item.id === Number(id));

  if (!product) return <div className="page"><div className="panel empty-state"><h2>Product Not Found</h2><Link to="/inventory">← Back to Inventory</Link></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>{product.product}</h1><p>Product inventory details and decision support</p></div>
        <Link to="/inventory" className="back-btn">← Back to Inventory</Link>
      </div>

      <div className="product-info-card">
        <div><span>Category</span><strong>{product.category}</strong></div>
        <div><span>Status</span><StatusBadge status={product.status} /></div>
      </div>

      <div className="kpi-grid">
        <Kpi title="Current Stock" value={product.currentStock} note="Units available" />
        <Kpi title="Safety Stock" value={product.safetyStock} note="Minimum buffer" />
        <Kpi title="Reorder Point" value={product.reorderPoint} note="Trigger level" />
        <Kpi title="Recommended Order" value={product.recommendedOrder} note="Units to reorder" />
      </div>

      <section className="panel forecast-panel">
        <div className="panel-heading"><div><h2>Demand Forecast</h2><p>Historical demand and predicted future demand</p></div></div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={forecastData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
            <Line type="monotone" dataKey="actual" name="Historical Demand" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="forecast" name="Forecasted Demand" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="panel risk-panel">
        <div className="panel-heading"><div><h2>Inventory Risk</h2><p>Current inventory health based on stock levels</p></div></div>
        <div className="risk-content">
          <RiskItem label="Stockout Risk" value={product.currentStock <= product.safetyStock ? "High" : "Low"} />
          <RiskItem label="Overstock Risk" value={product.status === "Overstock" ? "High" : "Low"} />
          <RiskItem label="Reorder Status" value={product.recommendedOrder > 0 ? "Required" : "Not Required"} />
        </div>
      </section>

      <section className="decision-card">
        <h2>Inventory Decision</h2>
        {product.recommendedOrder > 0 ? <>
          <h3>⚠️ Reorder Recommended</h3>
          <p>Current stock is below the recommended inventory level. Consider ordering <strong>{product.recommendedOrder} units</strong>.</p>
        </> : product.status === "Overstock" ? <>
          <h3>📦 Overstock Risk</h3>
          <p>Current inventory is significantly above the reorder requirements. Avoid placing a new order.</p>
        </> : <>
          <h3>✅ Inventory Healthy</h3>
          <p>Current inventory is within a healthy range. No immediate reorder is required.</p>
        </>}
      </section>
    </div>
  );
}

function Kpi({ title, value, note }) {
  return <div className="kpi-card"><span>{title}</span><h2>{value}</h2><p>{note}</p></div>;
}
function RiskItem({ label, value }) {
  return <div className="risk-item"><span>{label}</span><strong className={value === "High" || value === "Required" ? "risk-high" : "risk-low"}>{value}</strong></div>;
}
function StatusBadge({ status }) {
  return <span className={`status-badge ${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}
export default ProductDetails;