"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

export default function ProductsTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setServices(data as Service[]);
  };

  const uploadImage = async (): Promise<string> => {
    if (!file) throw new Error("اختر صورة أولاً");

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("services")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("services")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const addService = async () => {
    try {
      if (!category) {
        alert("اختر التصنيف أولاً");
        return;
      }

      setLoading(true);

      const imageUrl = await uploadImage();

      await supabase.from("services").insert([
        { title, description, price, image: imageUrl, category },
      ]);

      alert("تمت الإضافة ✅");

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setFile(null);

      fetchServices();
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* نموذج الإضافة */}
      <div className="bg-[#111] p-6 rounded-xl border border-[#d4af37]/20 space-y-4 mb-12">
        <input
          className="w-full p-3 bg-black border border-[#d4af37]/30 rounded"
          placeholder="العنوان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 bg-black border border-[#d4af37]/30 rounded"
          placeholder="الوصف"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-[#d4af37]/30 rounded"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="w-full p-3 bg-black border border-[#d4af37]/30 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">اختر التصنيف</option>
          <option value="كاميرات">كاميرات</option>
          <option value="ستلايت">ستلايت</option>
          <option value="كهرباء">كهرباء</option>
          <option value="انترنيت">انترنيت</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={addService}
          disabled={loading}
          className="w-full py-3 bg-[#d4af37] text-black font-bold rounded"
        >
          {loading ? "جاري الإضافة..." : "إضافة خدمة"}
        </button>
      </div>

      {/* عرض المنتجات */}
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-[#111] p-4 rounded-xl border border-[#d4af37]/20">
            <img src={s.image} className="w-full h-40 object-cover rounded mb-4" />
            <h3 className="text-xl text-[#d4af37] font-bold">{s.title}</h3>
            <p className="text-sm text-[#d4af37]/70">{s.category}</p>
            <p className="text-gray-400 text-sm mt-2">{s.description}</p>
            <p className="mt-2 font-bold">{s.price}</p>
          </div>
        ))}
      </div>
    </>
  );
}