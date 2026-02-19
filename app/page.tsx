import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Camera, Zap, SatelliteDish, Wifi } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white overflow-hidden">

        {/* ===== Hero Section ===== */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">

          {/* توهج خلفي */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-[#d4af37]/15 blur-[220px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[#d4af37] drop-shadow-[0_0_35px_rgba(212,175,55,0.8)]">
            حلول متكاملة للأمن والطاقة والاتصال
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl leading-relaxed">
            نقدم أحدث أنظمة المراقبة، التمديدات الكهربائية، الشبكات والستلايت
            بأعلى معايير الجودة والاحتراف مع ضمان الأداء والثقة.
          </p>

          {/* اللوكو بالنص */}
          <div className="mt-14 relative group animate-fadeIn">
            <div className="absolute inset-0 -z-10 blur-3xl bg-[#d4af37]/20 rounded-full scale-110"></div>

            <Image
              src="/login.png"
              alt="Schneider Logo"
              width={450}
              height={450}
              className="mx-auto drop-shadow-[0_0_50px_rgba(212,175,55,0.8)] transition duration-500 group-hover:scale-105"
              priority
            />
          </div>

        </section>

        {/* ===== Services Section ===== */}
        {/* ===== Services Section ===== */}
<section className="py-24 px-6 max-w-7xl mx-auto">

  <div className="grid md:grid-cols-4 gap-10">

    {[
  {
    title: "كاميرات مراقبة",
    desc: "تركيب أنظمة مراقبة حديثة بدقة عالية مع تحكم ومتابعة كاملة.",
    icon: <Camera size={40} className="text-[#d4af37]" />,
    link: "/cameras"
  },
  {
    title: "أعمال كهربائية",
    desc: "تنفيذ تمديدات احترافية للمنازل والمشاريع بجودة عالية.",
    icon: <Zap size={40} className="text-[#d4af37]" />,
    link: "/electricity"
  },
  {
    title: "أنظمة ستلايت",
    desc: "تركيب وضبط أنظمة استقبال بإشارة قوية وثابتة.",
    icon: <SatelliteDish size={40} className="text-[#d4af37]" />,
    link: "/satellite"
  },
  {
    title: "شبكات وإنترنت",
    desc: "تصميم وتنفيذ شبكات داخلية سريعة وآمنة.",
    icon: <Wifi size={40} className="text-[#d4af37]" />,
    link: "/internet"
  }
].map((service, i) => (
  <Link key={i} href={service.link} className="group">
    <div
      className="cursor-pointer bg-gradient-to-br from-[#111] to-[#1a1a1a] p-8 rounded-2xl border border-[#d4af37]/20 
      hover:-translate-y-3 hover:scale-105 transition duration-300 
      shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] text-center"
    >

      {/* الأيقونة */}
      <div className="flex justify-center mb-5">
        <div className="p-4 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 
        shadow-[0_0_20px_rgba(212,175,55,0.3)] 
        group-hover:scale-110 transition duration-300">
          {service.icon}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-[#d4af37] mb-4">
        {service.title}
      </h3>

      <p className="text-gray-400">
        {service.desc}
      </p>

    </div>
  </Link>
))}

  </div>

</section>

        {/* ===== About Section ===== */}
        <section className="py-24 text-center px-6 bg-[#0d0d0d] border-t border-[#d4af37]/10">

          <h2 className="text-4xl font-bold text-[#d4af37] mb-8">
            لماذا تختارنا؟
          </h2>

          <p className="max-w-3xl mx-auto text-gray-400 leading-relaxed text-lg">
            نمتلك خبرة واسعة في مجال أنظمة المراقبة والكهرباء والشبكات.
            نلتزم بأعلى معايير الجودة والدقة في التنفيذ، مع دعم فني مستمر
            لضمان رضا عملائنا وتحقيق أفضل النتائج.
          </p>

        </section>

        {/* ===== Footer ===== */}
        <footer className="py-8 text-center border-t border-[#d4af37]/20 bg-black text-gray-500 text-sm">
          جميع الحقوق محفوظة © {new Date().getFullYear()} شركة Wolf_Mind
        </footer>

      </main>
    </>
  );
}