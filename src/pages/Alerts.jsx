
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";

function Alerts() {
  const { inventorydata } = useInventory();
  const alerts = inventorydata.filter(
  (item) => item.status !== "Healthy"
);

const count = (status) =>
  inventorydata.filter((item) => item.status === status).length;
  const criticalCount = count("Critical");
  const lowStockCount = count("Low Stock");
  const overstockCount = count("Overstock");

  const getPriority = (status) => {
    if (status === "Critical") return "High";
    if (status === "Low Stock") return "Medium";
    return "Review";
  };

  const getAction = (item) => {
    if (item.status === "Critical") {
      return `Order ${item.recommendedOrder} units as soon as possible`;
    }

    if (item.status === "Low Stock") {
      return item.recommendedOrder > 0
        ? `Plan to order ${item.recommendedOrder} units`
        : "Review replenishment needs";
    }

    if (item.status === "Overstock") {
      return "Pause replenishment and review excess stock";
    }

    return "No action required";
  };

  return (
    <div className="page alerts-dashboard">
      <div className="alerts-page-heading">
        <div>
          <span className="page-eyebrow">INVENTORY INTELLIGENCE</span>
          <h1>Risk &amp; Recommendations</h1>
          <p>
            Identify stock risks early and review the recommended next
            actions for your inventory.
          </p>
        </div>

        <div className="alerts-live-status">
          <span className="alerts-status-dot" />
          Demo data active
        </div>
      </div>

      <div className="alerts-intro-banner">
        <div className="alerts-intro-icon">
          <ShieldAlert size={23} />
        </div>
        <div className="alerts-intro-copy">
          <h2>Inventory risk overview</h2>
          <p>
            {alerts.length > 0
              ? `${alerts.length} products need review based on their current demo stock status.`
              : "All products are currently marked healthy in the demo dataset."}
          </p>
        </div>
        <div className="alerts-intro-count">
          <strong>{alerts.length}</strong>
          <span>Open alerts</span>
        </div>
      </div>

      <div className="kpi-grid alerts-kpi-grid">
        <div className="kpi-card alerts-kpi-card critical-kpi">
          <div className="alerts-kpi-top">
            <span>Critical Stock</span>
            <div className="alerts-kpi-icon">
              <AlertTriangle size={19} />
            </div>
          </div>
          <h2>{criticalCount}</h2>
          <p>
            <span className="alerts-kpi-emphasis">High priority</span>
            {" "}· Immediate review
          </p>
        </div>

        <div className="kpi-card alerts-kpi-card low-kpi">
          <div className="alerts-kpi-top">
            <span>Low Stock</span>
            <div className="alerts-kpi-icon">
              <Package size={19} />
            </div>
          </div>
          <h2>{lowStockCount}</h2>
          <p>Review replenishment needs</p>
        </div>

        <div className="kpi-card alerts-kpi-card overstock-kpi">
          <div className="alerts-kpi-top">
            <span>Overstock</span>
            <div className="alerts-kpi-icon">
              <Boxes size={19} />
            </div>
          </div>
          <h2>{overstockCount}</h2>
          <p>Review excess inventory</p>
        </div>

        <div className="kpi-card alerts-kpi-card total-alerts-kpi">
          <div className="alerts-kpi-top">
            <span>Total Alerts</span>
            <div className="alerts-kpi-icon">
              <Clock3 size={19} />
            </div>
          </div>
          <h2>{alerts.length}</h2>
          <p>Products requiring attention</p>
        </div>
      </div>

      <section className="panel alerts-page-panel premium-alerts-panel">
        <div className="panel-heading alerts-list-heading">
          <div>
            <span className="section-kicker">ACTION CENTER</span>
            <h2>Recommended Actions</h2>
            <p>Review each product and open its details for more information.</p>
          </div>

          <Link to="/inventory" className="alerts-inventory-link">
            View inventory <ArrowRight size={16} />
          </Link>
        </div>

        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.map((item) => {
              const priority = getPriority(item.status);

              return (
                <article className="premium-alert-card" key={item.id}>
                  <div className={`premium-alert-icon ${item.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {item.status === "Critical" ? (
                      <AlertTriangle size={21} />
                    ) : item.status === "Overstock" ? (
                      <Boxes size={21} />
                    ) : (
                      <TrendingUp size={21} />
                    )}
                  </div>

                  <div className="premium-alert-product">
                    <div className="premium-alert-title-row">
                      <h3>{item.product}</h3>
                      <span
                        className={`alert-priority priority-${priority.toLowerCase()}`}
                      >
                        {priority} priority
                      </span>
                    </div>
                    <p>
                      {item.category} <span>·</span> SKU-{String(item.id).padStart(3, "0")}
                    </p>
                    <div className="premium-alert-action">
                      <span>Recommended action</span>
                      <strong>{getAction(item)}</strong>
                    </div>
                  </div>

                  <div className="premium-alert-stock">
                    <span>Current stock</span>
                    <strong>{item.currentStock}</strong>
                    <small>units</small>
                  </div>

                  <div className="premium-alert-reorder">
                    <span>Reorder point</span>
                    <strong>{item.reorderPoint}</strong>
                    <small>units</small>
                  </div>

                  <div className="premium-alert-status">
                    <StatusBadge status={item.status} />
                    <Link
                      to={`/inventory/${item.id}`}
                      className="alert-view-link"
                      aria-label={`View ${item.product} details`}
                    >
                      View details <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="alerts-empty-state">
              <CheckCircle2 size={34} />
              <h3>Everything looks healthy</h3>
              <p>No inventory alerts were found in the current demo data.</p>
            </div>
          )}
        </div>

        <div className="alerts-panel-footer">
          <InfoNote />
          <p>
            These alerts use the current sample inventory statuses. Live ML
            risk scores and automated recommendations are not connected yet.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}

function InfoNote() {
  return (
    <span className="alerts-info-icon" aria-hidden="true">
      i
    </span>
  );
}

export default Alerts;
