"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  total: string;
  status: string;
  products: any[];
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newCount, setNewCount] = useState(0);

  /* 🔔 صوت إشعار */
  const playNotification = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.play();
    } catch {}
  };

  /* 📦 جلب الطلبات */
  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setOrders(data as Order[]);
      setNewCount(
        data.filter((o) => o.status === "قيد التجهيز").length
      );
    }
  };

  /* 📲 تنسيق رقم الهاتف */
  const normalizePhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "964" + cleaned.substring(1);
    }
    return cleaned;
  };

  /* 📲 رسالة الشحن */
  const sendShippingMessage = (order: Order) => {
    let message = `مرحبا زبوننا الكريم ${order.customer_name}\n\n`;
    message += `تم شحن طلبك وهو قيد التسليم لشركة التوصيل 🚚\n`;
    message += `وهو منطلق اليك.\n\n`;
    message += `يرجى تزويدنا بلوكيشن (الموقع) لكي يصلك الطلب بدقة.\n`;
    message += `نعمل لصالحك ولراحتك وإيصال طلبك لمنزلك أو مكان عملك بكل سهولة وشفافية.\n`;
    message += `نتمنى لك وقت جميل وراحة أبدية ✨\n\n`;

    message += `📦 تفاصيل الطلب:\n\n`;

    order.products?.forEach((p: any, i: number) => {
      message += `${i + 1}- ${p.title}\n`;
      message += `السعر: ${p.price}\n\n`;
    });

    message += `💰 المجموع: ${order.total} د.ع\n\n`;
    message += `مكتب شنايدر`;

    const encoded = encodeURIComponent(message);
    const customerPhone = normalizePhone(order.customer_phone);

    window.open(
      `https://wa.me/${customerPhone}?text=${encoded}`,
      "_blank"
    );
  };

  /* ❌ حذف */
  const deleteOrder = async (id: string) => {
    const confirmDelete = confirm("هل أنت متأكد من حذف الطلب؟");
    if (!confirmDelete) return;

    await supabase.from("orders").delete().eq("id", id);
    fetchOrders();
  };

  /* 🔄 تحديث الحالة */
  const updateStatus = async (order: Order, status: string) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id);

    /* 🚚 عند الشحن */
    if (status === "تم شحن الطلب") {
      sendShippingMessage(order);
    }

    /* 📦 عند التوصيل */
    if (status === "تم التوصيل") {
      // فقط تحديث الحالة بدون إرسال واتساب
    }

    fetchOrders();
  };

  /* 🔄 Realtime */
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => {
          playNotification();
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex justify-center px-4 py-10 bg-black min-h-screen">

      <div className="w-full max-w-4xl space-y-10">

        <div className="flex justify-between items-center border-b border-[#d4af37]/30 pb-4">
          <h2 className="text-4xl font-bold text-[#d4af37]">
            إدارة الطلبات
          </h2>

          {newCount > 0 && (
            <div className="bg-red-600 px-4 py-2 rounded-full font-bold animate-pulse">
              {newCount} طلب جديد 🔔
            </div>
          )}
        </div>

        {orders.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            لا توجد طلبات حالياً
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#111] p-6 rounded-2xl border border-[#d4af37]/20 shadow-xl"
          >

            <div className="flex justify-between flex-wrap gap-4">

              <div>
                <h3 className="text-2xl font-bold text-[#d4af37]">
                  {order.customer_name}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  📞 {order.customer_phone}
                </p>
                <p className="text-sm text-gray-400">
                  🏠 {order.customer_address}
                </p>
                <p className="font-bold text-lg mt-2 text-white">
                  💰 {order.total} د.ع
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === "تم شحن الطلب"
                    ? "bg-blue-600"
                    : order.status === "تم التوصيل"
                    ? "bg-green-600"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {order.status}
              </span>

            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {order.products?.map((p: any, i: number) => (
                <div
                  key={i}
                  className="bg-black p-3 rounded-xl text-center"
                >
                  <img
                    src={p.image}
                    className="h-20 object-contain mx-auto"
                  />
                  <p className="text-sm mt-2">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4 flex-wrap">

              {order.status === "قيد التجهيز" && (
                <button
                  onClick={() => updateStatus(order, "تم شحن الطلب")}
                  className="flex-1 bg-blue-600 py-3 rounded-xl font-bold hover:scale-105 transition"
                >
                  🚚 شحن الطلب
                </button>
              )}

              {order.status === "تم شحن الطلب" && (
                <button
                  onClick={() => updateStatus(order, "تم التوصيل")}
                  className="flex-1 bg-green-600 py-3 rounded-xl font-bold hover:scale-105 transition"
                >
                  📦 تم التوصيل
                </button>
              )}

              <button
                onClick={() => deleteOrder(order.id)}
                className="flex-1 bg-red-600 py-3 rounded-xl font-bold hover:scale-105 transition"
              >
                ❌ حذف الطلب
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}