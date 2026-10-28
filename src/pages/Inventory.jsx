
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useInventory } from "../context/InventoryContext";

const emptyForm = {
  product: "",
  category: "Electronics",
  currentStock: "",
  safetyStock: "",
  reorderPoint: "",
};

function Inventory() {
  const { inventory, addProduct } = useInventory();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const categories = useMemo(
    () => [...new Set(inventory.map((item) => item.category))].sort(),
    [inventory]
  );

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).includes(search);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, search, category, status]);

  const criticalCount = inventory.filter(
    (item) => item.status === "Critical"
  ).length;
  const lowStockCount = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const healthyCount = inventory.filter(
    (item) => item.status === "Healthy"
  ).length;

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError("");
  }

  function handleAddProduct(event) {
    event.preventDefault();
    setSuccessMessage("");

    if (!form.product.trim()) {
      setFormError("Please enter a product name.");
      return;
    }

    const numbers = [
      form.currentStock,
      form.safetyStock,
      form.reorderPoint,
    ];

    if (
      numbers.some(
        (value) => value === "" || !Number.isFinite(Number(value)) || Number(value) < 0
      )
    ) {
      setFormError("Enter valid stock values. Numbers cannot be negative.");
      return;
    }

    if (
      !Number.isInteger(Number(form.currentStock)) ||
      !Number.isInteger(Number(form.safetyStock)) ||
      !Number.isInteger(Number(form.reorderPoint))
    ) {
      setFormError("Stock quantities must be whole numbers.");
      return;
    }

    const duplicate = inventory.some(
      (item) => item.product.trim().toLowerCase() === form.product.trim().toLowerCase()
    );

    if (duplicate) {
      setFormError("A product with this name already exists.");
      return;
    }

    const newProduct = addProduct(form);

    setForm(emptyForm);
    setFormError("");
    setShowForm(false);
    setSearch("");
    setCategory("All");
    setStatus("All");
    setSuccessMessage(`${newProduct.product} was added successfully.`);
  }

  function exportCSV() {
    const columns = [
      "ID",
      "Product",
      "Category",
      "Current Stock",
      "Safety Stock",
      "Reorder Point",
      "Recommended Order",
      "Status",
    ];

    const rows = filteredInventory.map((item) => [
      item.id,
      item.product,
      item.category,
      item.currentStock,
      item.safetyStock,
      item.reorderPoint,
      item.recommendedOrder,
      item.status,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "stockpulse-inventory.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">INVENTORY MANAGEMENT</span>
          <h1>Inventory Catalog</h1>
          <p>Manage products, stock levels and replenishment requirements.</p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setFormError("");
            setShowForm(true);
          }}
        >
          <Plus size={17} /> Add Product
        </button>
      </div>

      {successMessage && (
        <div className="inventory-success-message" role="status">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
          <button
            type="button"
            aria-label="Dismiss success message"
            onClick={() => setSuccessMessage("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="inventory-summary-grid">
        <SummaryCard
          title="Total Products"
          value={inventory.length}
          icon={<Boxes size={19} />}
          tone="purple"
        />
        <SummaryCard
          title="Critical Stock"
          value={criticalCount}
          icon={<AlertTriangle size={19} />}
          tone="red"
        />
        <SummaryCard
          title="Low Stock"
          value={lowStockCount}
          icon={<AlertTriangle size={19} />}
          tone="amber"
        />
        <SummaryCard
          title="Healthy Stock"
          value={healthyCount}
          icon={<CheckCircle2 size={19} />}
          tone="green"
        />
      </div>

      <section className="panel inventory-catalog-panel">
        <div className="panel-heading">
          <div>
            <h2>All Products</h2>
            <p>Search, filter, export or open product details.</p>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={exportCSV}
          >
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>

        <div className="inventory-filter-row">
          <label className="inventory-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, category or ID..."
              aria-label="Search inventory"
            />
          </label>

          <select
            className="inventory-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            className="inventory-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by stock status"
          >
            <option value="All">All statuses</option>
            {["Critical", "Low Stock", "Healthy", "Overstock"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="inventory-result-strip">
          Showing <strong>{filteredInventory.length}</strong> of{" "}
          <strong>{inventory.length}</strong> products
        </div>

        <div className="table-wrap">
          <table className="premium-inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Safety Stock</th>
                <th>Reorder Point</th>
                <th>Recommended Order</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="catalog-product">
                      <div className="catalog-product-icon">
                        <Boxes size={18} />
                      </div>
                      <div>
                        <strong>{item.product}</strong>
                        <span>SKU-{String(item.id).padStart(3, "0")}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="category-chip">{item.category}</span></td>
                  <td>
                    <strong className={
                      item.currentStock <= item.safetyStock ? "stock-number stock-warning" : "stock-number"
                    }>
                      {item.currentStock}
                    </strong>
                    <span className="unit-label"> units</span>
                  </td>
                  <td>{item.safetyStock}</td>
                  <td>{item.reorderPoint}</td>
                  <td>
                    {item.recommendedOrder > 0 ? (
                      <strong className="recommended-quantity">
                        {item.recommendedOrder} units
                      </strong>
                    ) : (
                      <span className="no-reorder">—</span>
                    )}
                  </td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <Link className="catalog-view-link" to={`/inventory/${item.id}`}>
                      View <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div className="inventory-empty-state">
              <Search size={25} />
              <h3>No products found</h3>
              <p>Try changing your search or filters.</p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setStatus("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div
          className="product-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
          >
            <div className="product-modal-heading">
              <div>
                <span className="page-eyebrow">INVENTORY MANAGEMENT</span>
                <h2 id="add-product-title">Add new product</h2>
                <p>Enter the product information and stock thresholds.</p>
              </div>
              <button
                type="button"
                className="product-modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="product-form" onSubmit={handleAddProduct}>
              <label>
                Product name
                <input
                  name="product"
                  value={form.product}
                  onChange={handleFormChange}
                  placeholder="e.g. Wireless Headphones"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                >
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Furniture</option>
                  <option>Office Supplies</option>
                  <option>Other</option>
                </select>
              </label>

              <div className="product-form-grid">
                <label>
                  Current stock
                  <input
                    name="currentStock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.currentStock}
                    onChange={handleFormChange}
                    placeholder="e.g. 25"
                    required
                  />
                </label>

                <label>
                  Safety stock
                  <input
                    name="safetyStock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.safetyStock}
                    onChange={handleFormChange}
                    placeholder="e.g. 10"
                    required
                  />
                </label>
              </div>

              <label>
                Reorder point
                <input
                  name="reorderPoint"
                  type="number"
                  min="0"
                  step="1"
                  value={form.reorderPoint}
                  onChange={handleFormChange}
                  placeholder="e.g. 20"
                  required
                />
              </label>

              {formError && (
                <p className="product-form-error" role="alert">{formError}</p>
              )}

              <div className="product-form-note">
                The stock status and suggested order quantity will be calculated
                automatically from the values you enter.
              </div>

              <div className="product-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={16} /> Save Product
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, tone }) {
  return (
    <div className={`inventory-summary-card summary-${tone}`}>
      <div className="inventory-summary-card-top">
        <span>{title}</span>
        <div className="inventory-summary-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status.toLowerCase().replaceAll(" ", "-")}`}>
      {status}
    </span>
  );
}

export default Inventory;
