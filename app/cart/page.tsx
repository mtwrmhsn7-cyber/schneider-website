"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

type CartItem = {
  id: string;
  product_id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  status: "جديد" | "قيد التجهيز" | "تم شحن الطلب" | "تم التوصيل";
  delivered_at: string | null;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [now, setNow] = useState(Date.now());

  /* تحديث الوقت */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* جلب السلة */
  const fetchCart = async () => {
    const { data } = await supabase
      .from("cart")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCart(data as CartItem[]);
    setLoading(false);
  };

  /* حذف عنصر */
  const removeItem = async (id: string) => {
    await supabase.from("cart").delete().eq("id", id);
  };

  /* العناصر الجديدة فقط */
  const newItems = cart.filter((item) => item.status === "جديد");

  const total = newItems.reduce((sum, item) => {
    const numeric = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + (isNaN(numeric) ? 0 : numeric);
  }, 0);

  /* إتمام الطلب */
  const completeOrder = async () => {
    if (!name || !address || !phone) {
      alert("يرجى إدخال جميع المعلومات");
      return;
    }

    if (newItems.length === 0) {
      alert("لا توجد منتجات جديدة");
      return;
    }

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: name,
        customer_address: address,
        customer_phone: phone,
        products: newItems,
        total: total.toString(),
        status: "قيد التجهيز",
      },
    ]);

    if (error) {
      alert("حدث خطأ أثناء حفظ الطلب");
      return;
    }

    await supabase
      .from("cart")
      .update({ status: "قيد التجهيز" })
      .in("id", newItems.map((item) => item.id));

    setShowForm(false);
    setName("");
    setAddress("");
    setPhone("");

    fetchCart();
  };

  /* مزامنة الطلبات */
  useEffect(() => {
    fetchCart();

    const channel = supabase
      .channel("orders-sync")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        async (payload: any) => {

          if (payload.new.status === "تم شحن الطلب") {
            await supabase
              .from("cart")
              .update({ status: "تم شحن الطلب" })
              .eq("status", "قيد التجهيز");
            fetchCart();
          }

          if (payload.new.status === "تم التوصيل") {
            await supabase
              .from("cart")
              .update({
                status: "تم التوصيل",
                delivered_at: new Date().toISOString(),
              })
              .eq("status", "تم شحن الطلب");

            fetchCart();
          }

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* حذف تلقائي بعد 3 ساعات */
  useEffect(() => {
    cart.forEach(async (item) => {
      if (item.status === "تم التوصيل" && item.delivered_at) {
        const deliveredTime = new Date(item.delivered_at).getTime();
        const diff = now - deliveredTime;

        if (diff >= 3 * 60 * 60 * 1000) {
          await removeItem(item.id);
        }
      }
    });
  }, [now, cart]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}س ${m}د ${s}ث`;
  };

  if (loading)
    return (
      <div className="text-center text-white py-20">
        جاري التحميل...
      </div>
    );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-28">

      <h1 className="text-5xl font-bold text-center text-[#d4af37] mb-16">
        سلتي
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400">
          السلة فارغة 🛒
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {cart.map((item) => {
              let remaining = 0;

              if (item.status === "تم التوصيل" && item.delivered_at) {
                const deliveredTime = new Date(item.delivered_at).getTime();
                remaining =
                  3 * 60 * 60 * 1000 - (now - deliveredTime);
              }

              return (
                <div
                  key={item.id}
                  className="bg-[#111] p-6 rounded-2xl border border-[#d4af37]/20"
                >
                  <img
                    src={item.image}
                    className="max-h-48 object-contain mx-auto"
                  />

                  <h3 className="text-[#d4af37] font-bold mt-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    {item.description}
                  </p>

                  <p className="font-bold mt-3">{item.price}</p>

                  {item.status === "جديد" && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-4 w-full bg-red-600 py-2 rounded-xl"
                    >
                      حذف
                    </button>
                  )}

                  {item.status === "قيد التجهيز" && (
                    <div className="mt-4 bg-yellow-500 text-black py-2 rounded-xl text-center font-bold animate-pulse">
                      ⏳ طلبك قيد التجهيز
                    </div>
                  )}

                  {item.status === "تم شحن الطلب" && (
                    <div className="mt-4 bg-blue-600 py-2 rounded-xl text-center font-bold">
                      🚚 تم شحن طلبك
                    </div>
                  )}

                  {item.status === "تم التوصيل" && (
                    <div className="mt-4 bg-green-600 py-3 rounded-xl text-center font-bold">
                      ✅ تم التوصيل
                      <div className="text-sm mt-2">
                        ⏱ المتبقي:{" "}
                        {remaining > 0
                          ? formatTime(remaining)
                          : "جاري الحذف..."}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {newItems.length > 0 && (
            <div className="mt-16 text-center">
              <div className="text-3xl font-bold mb-6">
                المجموع: {total.toLocaleString()} د.ع
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="px-10 py-4 bg-[#d4af37] text-black font-bold rounded-xl hover:scale-105 transition"
              >
                إتمام الطلب
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#111] p-8 rounded-2xl w-[90%] max-w-md"
            >
              <h2 className="text-2xl font-bold text-[#d4af37] mb-6 text-center">
                أدخل معلوماتك
              </h2>

              <input
                type="text"
                placeholder="الاسم الكامل"
                className="w-full p-3 bg-black border border-[#d4af37]/30 rounded mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="العنوان"
                className="w-full p-3 bg-black border border-[#d4af37]/30 rounded mb-4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="w-full p-3 bg-black border border-[#d4af37]/30 rounded mb-6"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="flex gap-4">
                <button
                  onClick={completeOrder}
                  className="flex-1 bg-green-600 py-3 rounded-xl font-bold"
                >
                  تأكيد الطلب
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-700 py-3 rounded-xl"
                >
                  إلغاء
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}