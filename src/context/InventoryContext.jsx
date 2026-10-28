
import { createContext, useContext, useEffect, useState } from "react";
import { inventorydata as initialInventory } from "../data/inventorydata";

const InventoryContext = createContext(null);
const STORAGE_KEY = "stockpulse_inventory_v1";

function getInitialInventory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not load saved inventory:", error);
  }

  return initialInventory;
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(getInitialInventory);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (error) {
      console.error("Could not save inventory:", error);
    }
  }, [inventory]);

  function addProduct(formData) {
    const currentMaxId = inventory.reduce(
      (max, item) => Math.max(max, Number(item.id) || 0),
      0
    );

    const currentStock = Number(formData.currentStock);
    const safetyStock = Number(formData.safetyStock);
    const reorderPoint = Number(formData.reorderPoint);
    const recommendedOrder =
      currentStock <= reorderPoint
        ? Math.max(safetyStock * 2 - currentStock, reorderPoint - currentStock + safetyStock)
        : 0;

    let status = "Healthy";

    if (currentStock <= safetyStock) {
      status = "Critical";
    } else if (currentStock <= reorderPoint) {
      status = "Low Stock";
    }

    const newProduct = {
      id: currentMaxId + 1,
      product: formData.product.trim(),
      category: formData.category,
      currentStock,
      safetyStock,
      reorderPoint,
      recommendedOrder,
      status,
    };

    setInventory((current) => [...current, newProduct]);
    return newProduct;
  }

  return (
    <InventoryContext.Provider value={{ inventory, addProduct }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used inside InventoryProvider");
  }

  return context;
}
