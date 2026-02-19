"use client";

import { motion } from "framer-motion";
import { Camera, Zap, SatelliteDish, Wifi } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-black text-white overflow-hidden">

      {/* ===== Hero Section ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-[#d4af37] drop-shadow-[0_0_40px_rgba(212,175,55,0.8)]"
        >
          من نحن
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 max-w-3xl text-gray-400 leading-relaxed text-lg"
        >
          نحن شركة متخصصة في حلول الأمن والطاقة والاتصال.
          نقدم أنظمة مراقبة حديثة، تمديدات كهربائية احترافية،
          شبكات متطورة، وأنظمة ستلايت عالية الجودة.
        </motion.p>

      </section>

      {/* ===== Vision Section ===== */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-[#d4af37] mb-10"
        >
          رؤيتنا
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-gray-400 leading-relaxed text-lg"
        >
          أن نكون الخيار الأول في مجال أنظمة المراقبة والكهرباء
          والشبكات من خلال الجودة، الالتزام، والدعم المستمر.
        </motion.p>

      </section>

      {/* ===== Services Details ===== */}
      <section className="py-24 px-6 bg-[#0d0d0d]">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center">

          {[
            {
              icon: <Camera size={50} />,
              title: "أنظمة المراقبة",
              desc: "تركيب كاميرات بدقة عالية مع تحكم كامل ومتابعة عن بعد."
            },
            {
              icon: <Zap size={50} />,
              title: "الأعمال الكهربائية",
              desc: "تنفيذ تمديدات احترافية وفق أعلى معايير الأمان."
            },
            {
              icon: <SatelliteDish size={50} />,
              title: "أنظمة الستلايت",
              desc: "تركيب وضبط أنظمة استقبال بإشارة قوية ومستقرة."
            },
            {
              icon: <Wifi size={50} />,
              title: "الشبكات والإنترنت",
              desc: "تصميم شبكات داخلية احترافية وسريعة وآمنة."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="p-8 rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#111] to-[#1a1a1a] hover:scale-105 transition duration-300"
            >
              <div className="flex justify-center mb-5 text-[#d4af37]">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#d4af37] mb-4">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}

        </div>

      </section>

      {/* ===== Stats Section ===== */}
      <section className="py-24 text-center">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">

          {[
            { number: "250+", label: "مشروع منجز" },
            { number: "500+", label: "كاميرا مركبة" },
            { number: "100%", label: "رضا العملاء" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <h3 className="text-5xl font-bold text-[#d4af37]">
                {stat.number}
              </h3>
              <p className="mt-4 text-gray-400">{stat.label}</p>
            </motion.div>
          ))}

        </div>

      </section>

    </main>
  );
}