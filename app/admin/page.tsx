"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert("بيانات الدخول غير صحيحة ❌");
    window.location.href = "/admin/dashboard";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-sm bg-[#111] p-8 rounded-2xl border border-[#d4af37]/25 space-y-5">
        <h1 className="text-3xl font-bold text-center text-[#d4af37]">تسجيل دخول الإدارة</h1>

        <input
          className="w-full p-3 bg-black border border-[#d4af37]/25 rounded-lg"
          placeholder="الإيميل"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-[#d4af37]/25 rounded-lg"
          placeholder="الباسورد"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full py-3 rounded-lg bg-[#d4af37] text-black font-bold hover:scale-105 transition"
        >
          دخول
        </button>
      </div>
    </main>
  );
}