"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useSpring, useTransform, useScroll } from "framer-motion";
import { Heart, Stars } from "lucide-react";

// --- 1. LOVE PARTICLE ENGINE ---
const LoveEngine = ({ isHovered, targetRef }: { isHovered: boolean, targetRef: React.RefObject<HTMLDivElement | null> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const animationRef = useRef<number>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Palet warna biru dengan aksen pink
    const colors = ["#60A5FA", "#3B82F6", "#93C5FD", "#FFB7C5", "#FFFFFF"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; y: number; baseX: number; baseY: number;
      vx: number; vy: number; size: number; color: string;
      angle: number; speed: number; formationPos: number;
      ease: number; friction: number;
      shimmerOffset: number; shimmerSpeed: number; baseSize: number;

      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = 0;
        this.vy = 0;
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.002 + Math.random() * 0.003;
        this.formationPos = Math.random() * Math.PI * 2;

        this.ease = 0.02 + Math.random() * 0.02;
        this.friction = 0.92 + Math.random() * 0.03;
        this.shimmerOffset = Math.random() * Math.PI * 2;
        this.shimmerSpeed = 0.02 + Math.random() * 0.03;
      }

      update(cardRect: DOMRect | null, hovered: boolean, time: number) {
        let targetX = this.baseX;
        let targetY = this.baseY;
        let currentEase = 0.01;

        if (hovered && cardRect) {
          currentEase = this.ease * 0.3;
          const cx = cardRect.left + cardRect.width / 2;
          const cy = cardRect.top + cardRect.height / 2;

          const t = this.formationPos;

          // Breathing pulse - hati membesar mengecil pelan
          const pulse = 1 + Math.sin(time * 0.001) * 0.03;
          const baseScale = Math.min(window.innerWidth / 38, 12);
          const scale = baseScale * pulse;

          const heartX = 16 * Math.pow(Math.sin(t), 3);
          const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

          // Shimmer - gerakan halus
          const shimmer = Math.sin(time * 0.008 + this.shimmerOffset) * 1.5;
          const shimmerY = Math.cos(time * 0.006 + this.shimmerOffset) * 1.5;

          targetX = cx + heartX * scale + shimmer;
          targetY = cy + heartY * scale + shimmerY;

          // Ukuran partikel berdenyut pelan
          this.size = this.baseSize + Math.sin(time * 0.002 + this.shimmerOffset) * 0.4;
        } else {
          this.angle += this.speed;
          targetX = this.baseX + Math.cos(this.angle) * 40;
          targetY = this.baseY + Math.sin(this.angle) * 40;
          this.size = this.baseSize;
        }

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.vx += dx * currentEase;
        this.vy += dy * currentEase;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = isHovered ? 0.9 : 0.4;
        ctx.fill();
      }
    }

    if (particles.current.length === 0) {
      for (let i = 0; i < 300; i++) particles.current.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cardRect = targetRef.current?.getBoundingClientRect() || null;
      const time = performance.now();

      particles.current.forEach((p) => {
        p.update(cardRect, isHovered, time);
        p.draw();
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isHovered, targetRef]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 bg-blue-50/20" />;
};

// --- 2. MESSAGE CARDS DATA ---
const messages = [
  {
    title: "Ngga Gampang Nyerah",
    content: "Salah satu hal yang bikin aku salut sama kamu, kamu ngga gampang nyerah. Aku tau, hari-harimu ngga selalu gampang, tapi kamu tetep semangat. Ngga semua orang bisa kayak gitu loh.",
    emoji: "💪"
  },
  {
    title: "Perjuangan Buat Kuliah",
    content: "Aku kagum ngeliat gimana kamu berjuang buat dapet kampus yang kamu mau. Tiap hari belajar, ngerjain soal UTBK/SNBT, ngga ngeluh (walaupun kemaren ngeluh WKWKWKW). Tapi serius, itu keren banget.",
    emoji: "🎓"
  },
  {
    title: "Kuat Banget",
    content: "Kamu suka ngga ngomong kalau misalnya ada problem, dan itu kadang bikin aku khawatir. Tapi aku juga tau kamu orangnya kuat. Cuma, jangan lupa kalau kamu ngga harus kuat sendirian terus ya.",
    emoji: "🌟"
  },
  {
    title: "Beda dari yang Lain",
    content: "Kalau orang lain ada di posisimu, belum tentu mereka kuat. Tapi kamu? Kamu malah makin niat. Menurutku, itu yang bikin kamu beda, dan itu yang bikin kamu special.",
    emoji: "🔥"
  },
  {
    title: "Selalu Percaya",
    content: "Mau gimanapun hasilnya nanti, yang penting kamu tau, usahamu udah lebih dari cukup. Dan aku bakal selalu ada buat nemenin kamu, apapun yang terjadi.",
    emoji: "💙"
  },
  {
    title: "Adalah Pokoknya",
    content: "Aku gabisa bohong sih kalau aku sedih pas kamu gamau ketemu. Aku kangen banget. Padahal ketemu sebentar aja udah cukup banget buat aku. (Aku beneran gaada makanan di rumah, hehe).",
    emoji: "😔"
  },
  {
    title: "Janji",
    content: "Tapi Kamu tau ngga? Aku sayang banget sama kamu. Dan karena itu, aku ngga mau bikin kamu sedih atau kecewa. Aku mau jadi orang yang selalu bikin kamu senyum, bukan sebaliknya.",
    emoji: "🤍"
  }
];

// --- 3. INTERACTIVE MESSAGE CARD ---
const InteractiveMessage = ({ msg, index }: { msg: typeof messages[0], index: number }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="relative z-10 min-h-screen flex items-center justify-center px-8 py-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        {/* Clickable Card */}
        <motion.div
          onClick={() => setIsRevealed(!isRevealed)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative cursor-pointer p-12 md:p-16 rounded-3xl text-center
            transition-all duration-500 ease-out
            ${isRevealed
              ? 'bg-blue-500 text-white shadow-2xl shadow-blue-200'
              : 'bg-slate-50 hover:bg-blue-50 border-2 border-dashed border-slate-200 hover:border-blue-300'
            }
          `}
        >
          {/* Hidden State - Tap to reveal */}
          <motion.div
            animate={{ opacity: isRevealed ? 0 : 1, y: isRevealed ? -20 : 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ scale: isHovered ? 1.2 : 1 }}
              className="text-6xl mb-4"
            >
              {msg.emoji}
            </motion.div>
            <p className="text-slate-400 text-sm">Tap untuk membuka pesan #{index + 1}</p>
          </motion.div>

          {/* Revealed State - The message */}
          <motion.div
            animate={{
              opacity: isRevealed ? 1 : 0,
              y: isRevealed ? 0 : 20,
              scale: isRevealed ? 1 : 0.9
            }}
            transition={{ delay: isRevealed ? 0.1 : 0 }}
            className={isRevealed ? '' : 'pointer-events-none'}
          >
            {/* Quote Mark */}
            <div className="text-white/30 text-[100px] md:text-[140px] font-serif leading-none select-none mb-[-30px] md:mb-[-50px]">
              "
            </div>

            {/* Message Content */}
            <p className="text-xl md:text-3xl font-medium leading-relaxed">
              {msg.content}
            </p>

            {/* Title */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-white/40" />
              <span className="text-white/80 font-bold uppercase tracking-widest text-xs">
                {msg.title}
              </span>
              <div className="h-px w-8 bg-white/40" />
            </div>

            {/* Tap again hint */}
            <p className="mt-6 text-white/50 text-xs">Tap lagi untuk tutup</p>
          </motion.div>
        </motion.div>

        {/* Message Counter */}
        <div className="flex justify-center mt-6 gap-2">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === index
                ? 'w-8 bg-blue-500'
                : 'w-2 bg-slate-200'
                }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// --- 4. MAIN PAGE ---
export default function RembulanProject() {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Progress bar spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative bg-white text-slate-800 font-sans overflow-x-hidden selection:bg-blue-100">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Background Particles */}
      <LoveEngine isHovered={isHovered} targetRef={contentRef} />

      {/* Floating Header */}
      <nav className="fixed top-1 w-full z-50 px-8 h-24 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-blue-500 tracking-tighter text-xl">
          <Heart className="text-pink-400" fill="currentColor" size={24} />
          <span>Message for Nabila</span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">
          Created for you
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div
          ref={contentRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer group relative p-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">From Zhanix, To You</span>
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none text-slate-800">
              Nabila.
            </h1>
            <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              Arahkan kursor ke sini atau tap untuk melihat sesuatu yang keren :D
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs text-slate-400">Scroll & tap setiap kartu 💙</span>
          <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-blue-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Interactive Messages */}
      {messages.map((msg, index) => (
        <InteractiveMessage key={index} msg={msg} index={index} />
      ))}

      {/* Closing Message */}
      <section className="relative z-10 py-32 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Heart className="text-pink-400 mx-auto mb-6" fill="currentColor" size={48} />
          </motion.div>
          <p className="text-2xl md:text-3xl font-medium text-slate-700 leading-relaxed">
            "Aku selalu rela ngadepin pasang surutnya hubungan ini, karena aku yakin sama kita. Karena buat aku, kamu worth it banget untuk aku perjuangkan 💙"
          </p>
          <p className="mt-8 text-blue-500 font-bold">— Dari yang selalu ada buatmu, zx 💙</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center">
        <div className="flex items-center justify-center gap-4 text-blue-200 text-[10px] font-black uppercase tracking-[0.5em]">
          <div className="h-px w-12 bg-blue-100" />
          Always here for you
          <div className="h-px w-12 bg-blue-100" />
        </div>
      </footer>
    </div>
  );
}