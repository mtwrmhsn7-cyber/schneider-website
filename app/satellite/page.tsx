"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

export default function SatellitePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Service | null>(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("category", "ستلايت")
      .order("created_at", { ascending: false });

    if (data) setServices(data);
  };

  /* 🔥 إضافة للسلة */
  const confirmAddToCart = async (product: Service) => {
    setLoading(true);

    /* تحقق إذا موجود مسبقاً */
    const { data: existing } = await supabase
      .from("cart")
      .select("id")
      .eq("product_id", product.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("cart").insert([
        {
          product_id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
        },
      ]);
    }

    setLoading(false);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
      setSelectedProduct(null);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-28">

      {/* العنوان */}
      <section className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold text-[#d4af37]"
        >
          أنظمة ستلايت
        </motion.h1>

        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
          تركيب وضبط أنظمة استقبال فضائي بإشارة قوية وثابتة باستخدام أحدث الأجهزة.
        </p>
      </section>

      {/* عرض الخدمات */}
      <section className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {services.map((service) => (
          <motion.div
            key={service.id}
            className="bg-[#111] p-6 rounded-2xl border border-[#d4af37]/20 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition duration-300"
          >

            <div
              className="bg-black rounded-xl p-4 flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedImage(service.image)}
            >
              <img
                src={service.image}
                className="max-h-60 object-contain"
              />
            </div>

            <h3 className="text-[#d4af37] font-bold mt-4">الاسم:</h3>
            <p className="text-white font-semibold">
              {service.title}
            </p>

            <h4 className="text-[#d4af37] font-bold mt-3">الوصف:</h4>
            <p className="text-gray-400 text-sm">
              {service.description}
            </p>

            <h4 className="text-[#d4af37] font-bold mt-3">السعر:</h4>
            <p className="text-lg font-bold text-white">
              {service.price}
            </p>

            <button
              onClick={() => setSelectedProduct(service)}
              className="mt-5 w-full py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:scale-105 transition"
            >
              أضف إلى السلة
            </button>

          </motion.div>
        ))}

      </section>

      {/* رجوع */}
      <div className="mt-20 text-center">
        <Link href="/">
          <button className="px-8 py-3 bg-[#d4af37] text-black font-bold rounded-full hover:scale-105 transition">
            العودة للرئيسية
          </button>
        </Link>
      </div>

      {/* تكبير الصورة */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* نافذة التأكيد */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#111] p-8 rounded-2xl border border-[#d4af37]/30 w-[90%] max-w-md text-center"
            >
              <img
                src={selectedProduct.image}
                className="max-h-48 object-contain mx-auto mb-4"
              />

              <h3 className="text-[#d4af37] font-bold">الاسم:</h3>
              <p className="text-white font-semibold">
                {selectedProduct.title}
              </p>

              <h4 className="text-[#d4af37] font-bold mt-3">الوصف:</h4>
              <p className="text-gray-400 text-sm">
                {selectedProduct.description}
              </p>

              <h4 className="text-[#d4af37] font-bold mt-3">السعر:</h4>
              <p className="text-white font-bold">
                {selectedProduct.price}
              </p>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => confirmAddToCart(selectedProduct)}
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 rounded-xl font-bold disabled:opacity-50"
                >
                  {loading ? "جاري الإضافة..." : "تأكيد الإضافة"}
                </button>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 bg-gray-700 rounded-xl"
                >
                  إلغاء
                </button>
              </div>

              {added && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-green-500 font-bold"
                >
                  ✔ تم إضافته إلى السلة
                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}