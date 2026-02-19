"use client";

import { useState } from "react";
import ProductsTab from "./products";
import OrdersTab from "./orders";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <h1 className="text-4xl font-bold text-[#d4af37] mb-10">
        لوحة التحكم
      </h1>

      {/* التبويبات */}
      <div className="flex gap-6 mb-12 border-b border-[#d4af37]/30 pb-4">

        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-2 rounded-t-lg font-bold transition ${
            activeTab === "products"
              ? "bg-[#d4af37] text-black"
              : "bg-[#111] hover:bg-[#222]"
          }`}
        >
          رفع المنتجات
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 rounded-t-lg font-bold transition ${
            activeTab === "orders"
              ? "bg-[#d4af37] text-black"
              : "bg-[#111] hover:bg-[#222]"
          }`}
        >
          الطلبات
        </button>

      </div>

      {/* محتوى التبويب */}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "orders" && <OrdersTab />}

    </main>
  );
}