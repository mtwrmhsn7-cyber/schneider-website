"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const { count } = await supabase
      .from("cart")
      .select("*", { count: "exact", head: true });

    setCartCount(count || 0);
  };

  useEffect(() => {
    fetchCartCount();

    const channel = supabase
      .channel("cart-navbar")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart" },
        () => {
          fetchCartCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* اسم المكتب */}
        <Link
          href="/"
          className="text-2xl font-bold text-[#d4af37] tracking-wider hover:opacity-80 transition"
        >
          شنايدر
        </Link>

        {/* الروابط */}
        <div className="flex items-center gap-8 text-white">

          <Link
            href="/about"
            className="hover:text-[#d4af37] transition duration-300"
          >
            من نحن
          </Link>

          <Link
            href="/contact"
            className="hover:text-[#d4af37] transition duration-300"
          >
            اتصل بنا
          </Link>

          {/* السلة */}
          <Link href="/cart">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)] cursor-pointer"
            >
              <ShoppingCart size={20} />
              سلتي

              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>

        </div>
      </div>
    </nav>
  );
}