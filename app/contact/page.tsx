"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram, Music2 } from "lucide-react";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {

  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_schneider",
        "template_bdi9f1v",
        formRef.current,
        "JKae60u9tsSmBk6s8"
      )
      .then(
        () => {
          alert("تم إرسال الرسالة بنجاح ✅");
          formRef.current?.reset();
        },
        () => {
          alert("حدث خطأ ❌ حاول مرة أخرى");
        }
      );
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-32">

      {/* ===== Title ===== */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-center text-[#d4af37] mb-20"
      >
        اتصل بنا
      </motion.h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

        {/* ===== Contact Info ===== */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >

          <div className="flex items-start gap-4">
            <Phone className="text-[#d4af37] mt-1" size={30} />
            <div className="flex flex-col text-gray-300 text-lg">
              <a href="tel:07730847080" className="hover:text-[#d4af37]">
                07730847080
              </a>
              <a href="tel:07703719380" className="mt-2 hover:text-[#d4af37]">
                07703719380
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="text-[#d4af37]" size={30} />
            <a
              href="mailto:schneider3930@gmail.com"
              className="text-gray-300 text-lg hover:text-[#d4af37]"
            >
              schneider3930@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="text-[#d4af37]" size={30} />
            <span className="text-gray-300 text-lg">العراق - بغداد</span>
          </div>

          {/* ===== Social Media ===== */}
          <div className="pt-8">
            <h3 className="text-xl font-bold text-[#d4af37] mb-4">
              صفحاتنا
            </h3>

            <div className="flex gap-6">

              <a href="https://facebook.com/yourpage" target="_blank">
                <Facebook className="text-[#d4af37] hover:scale-110 transition" size={28} />
              </a>

              <a href="https://instagram.com/yourpage" target="_blank">
                <Instagram className="text-[#d4af37] hover:scale-110 transition" size={28} />
              </a>

              <a href="https://tiktok.com/@yourpage" target="_blank">
                <Music2 className="text-[#d4af37] hover:scale-110 transition" size={28} />
              </a>

            </div>
          </div>

        </motion.div>

        {/* ===== Contact Form ===== */}
        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="bg-[#111] p-8 rounded-2xl border border-[#d4af37]/20 space-y-6 shadow-lg"
        >
          <input
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            required
            className="w-full p-4 bg-black border border-[#d4af37]/20 rounded-lg text-white focus:outline-none focus:border-[#d4af37]"
          />

          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            required
            className="w-full p-4 bg-black border border-[#d4af37]/20 rounded-lg text-white focus:outline-none focus:border-[#d4af37]"
          />

          <textarea
            name="message"
            placeholder="اكتب رسالتك هنا..."
            rows={4}
            required
            className="w-full p-4 bg-black border border-[#d4af37]/20 rounded-lg text-white focus:outline-none focus:border-[#d4af37]"
          ></textarea>

          <button
            type="submit"
            className="w-full py-4 bg-[#d4af37] text-black font-bold rounded-lg hover:scale-105 transition duration-300"
          >
            إرسال الرسالة
          </button>

        </motion.form>

      </div>

    </main>
  );
}