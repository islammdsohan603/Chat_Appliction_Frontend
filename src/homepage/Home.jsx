/**
 * Home — NEXORA Landing Page
 * Sections: Navbar → Hero → Features → Live Preview → Security → CTA → Footer
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlinePaperClip,
  HiOutlineFaceSmile,
  HiOutlineLockClosed,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlineChatBubbleLeftRight,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
} from "react-icons/hi2";

/* ─────────────────────────────────────────
   Particle config (reused from Login)
   ───────────────────────────────────────── */
const PARTICLES = [
  { left: "8%", top: "15%", dur: "20s", delay: "0s", bg: "rgba(6,182,212,0.4)", size: "3px" },
  { left: "20%", top: "70%", dur: "25s", delay: "-4s", bg: "rgba(139,92,246,0.5)", size: "2px" },
  { left: "40%", top: "10%", dur: "18s", delay: "-8s", bg: "rgba(236,72,153,0.35)", size: "2px" },
  { left: "60%", top: "80%", dur: "22s", delay: "-2s", bg: "rgba(6,182,212,0.3)", size: "4px" },
  { left: "75%", top: "25%", dur: "19s", delay: "-6s", bg: "rgba(139,92,246,0.4)", size: "2px" },
  { left: "90%", top: "55%", dur: "24s", delay: "-1s", bg: "rgba(236,72,153,0.3)", size: "3px" },
  { left: "50%", top: "40%", dur: "21s", delay: "-3s", bg: "rgba(6,182,212,0.35)", size: "2px" },
  { left: "30%", top: "90%", dur: "17s", delay: "-5s", bg: "rgba(139,92,246,0.3)", size: "3px" },
];

/* ─────────────────────────────────────────
   NEXORA Logo Mark (shared)
   ───────────────────────────────────────── */
const Logo = ({ size = "md" }) => {
  const logoSize = size === "lg" ? "w-12 h-12" : "w-9 h-9";
  const iconSize = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const textSize = size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${logoSize} rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_4px_16px_rgba(139,92,246,0.35)]`}>
        <div className="absolute -inset-0.5 rounded-[14px] bg-gradient-to-br from-purple-500/40 to-cyan-500/40 -z-[1] blur-[6px]" />
        <svg className={`${iconSize} text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <span className={`${textSize} font-extrabold bg-gradient-to-br from-indigo-200 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-tight`}>
        NEXORA
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────
   Navbar
   ───────────────────────────────────────── */
const Navbar = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060918]/90 backdrop-blur-xl border-b border-purple-500/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Security", "Community"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-[width] duration-300" />
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/chat"
                className="px-5 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transition-all"
              >
                Open Chat →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-sm font-semibold hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-500/10 transition-all md:hidden"
          >
            {isOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass border-t border-purple-500/10 pb-4 animate-slideUp">
            <div className="flex flex-col gap-1 pt-3 px-2">
              {["Features", "Security", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-purple-500/10 rounded-xl transition-all"
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-2 mt-3 px-2">
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2.5 text-center text-sm text-slate-300 border border-purple-500/20 rounded-xl hover:bg-purple-500/10 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 px-4 py-2.5 text-center text-sm text-white bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────
   3D Hero Chat Preview
   ───────────────────────────────────────── */
const HeroChatPreview = () => {
  const messages = [
    { id: 1, from: "Alex", text: "Hey! Just pushed the latest build 🚀", time: "10:42 AM", own: false, color: "from-purple-500/20 to-violet-600/20" },
    { id: 2, from: "You", text: "Looks amazing! The UI is super clean 🔥", time: "10:43 AM", own: true },
    { id: 3, from: "Sarah", text: "The design system is 💜", time: "10:44 AM", own: false, color: "from-cyan-500/20 to-blue-600/20" },
    { id: 4, from: "You", text: "Let's ship it! ✅", time: "10:45 AM", own: true },
  ];

  return (
    <div
      className="relative w-full max-w-[520px] animate-heroFloat"
      style={{ perspective: "1000px" }}
    >
      {/* Main chat window */}
      <div
        className="glass rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/40"
        style={{
          transform: "rotateY(-8deg) rotateX(4deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-500/15 bg-[#0d1230]/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            T
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Team NEXORA</p>
            <p className="text-[10px] text-green-400">3 members online</p>
          </div>
          <div className="ml-auto flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 space-y-3 bg-[#060918]/40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.own ? "flex-row-reverse" : ""}`}>
              {!msg.own && (
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${msg.color} border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                  {msg.from[0]}
                </div>
              )}
              <div className={`flex flex-col gap-0.5 ${msg.own ? "items-end" : "items-start"}`}>
                {!msg.own && <span className="text-[10px] text-purple-400/80 ml-1">{msg.from}</span>}
                <div className={`px-3 py-2 rounded-xl text-xs max-w-[180px] leading-relaxed ${msg.own ? "bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-br-sm" : "bg-[#111840] border border-purple-500/10 text-slate-200 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-600 mx-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              S
            </div>
            <div className="px-3 py-2.5 rounded-xl rounded-bl-sm bg-[#111840] border border-purple-500/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[10px] text-slate-500 italic">Sarah is typing…</span>
          </div>
        </div>

        {/* Composer */}
        <div className="px-4 py-3 border-t border-purple-500/10 bg-[#0d1230]/60">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111840] border border-purple-500/20">
            <HiOutlineFaceSmile className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 flex-1">Type a message…</span>
            <HiOutlinePaperClip className="w-4 h-4 text-slate-500" />
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification card */}
      <div className="absolute -top-6 -right-6 glass rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-lg animate-heroFloat2 border border-purple-500/20">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm">
          🚀
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200">Build shipped!</p>
          <p className="text-[10px] text-slate-500">just now</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Online users card */}
      <div className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-lg animate-heroFloat border border-cyan-500/20" style={{ animationDelay: '1s' }}>
        <div className="flex -space-x-2">
          {["A", "S", "M"].map((l, i) => (
            <div key={i} className={`w-7 h-7 rounded-full border-2 border-[#060918] flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${i === 0 ? "from-purple-500 to-violet-600" : i === 1 ? "from-cyan-500 to-blue-600" : "from-pink-500 to-rose-600"}`}>
              {l}
            </div>
          ))}
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-300">+12 online</p>
          <p className="text-[9px] text-green-400">Active now</p>
        </div>
      </div>

      {/* Reaction pop */}
      <div className="absolute top-1/2 -right-10 glass rounded-full px-2.5 py-1.5 text-sm shadow-md animate-scaleIn border border-purple-500/20" style={{ animationDelay: '0.5s' }}>
        🔥 4
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Hero Section
   ───────────────────────────────────────── */
const Hero = ({ isAuthenticated }) => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Background orbs */}
    <div className="absolute w-[600px] h-[600px] -left-[100px] top-1/4 blur-[80px] pointer-events-none opacity-40"
      style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, transparent 70%)" }} />
    <div className="absolute w-[500px] h-[500px] right-0 bottom-0 blur-[80px] pointer-events-none opacity-30"
      style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 70%)" }} />

    {/* Grid */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: [
        "repeating-linear-gradient(0deg, transparent, transparent 78px, rgba(139,92,246,0.025) 78px, rgba(139,92,246,0.025) 80px)",
        "repeating-linear-gradient(90deg, transparent, transparent 78px, rgba(139,92,246,0.025) 78px, rgba(139,92,246,0.025) 80px)",
      ].join(", ")
    }} />

    {/* Particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <div key={i} className="absolute rounded-full animate-particleDrift"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, background: p.bg, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left: copy */}
        <div className="flex-1 text-center lg:text-left animate-slideUp max-w-xl mx-auto lg:mx-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-semibold text-purple-300 mb-6">
            <HiOutlineSparkles className="w-3.5 h-3.5" />
            Introducing NEXORA 1.0
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-[-2px] mb-6">
            <span className="text-slate-100">Connect.</span>{" "}
            <span className="bg-gradient-to-br from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Chat.</span>{" "}
            <span className="text-slate-100">Collaborate.</span>
          </h1>

          <p className="text-lg text-slate-400/80 leading-relaxed mb-8 max-w-[460px] mx-auto lg:mx-0">
            Experience fast, seamless and modern real-time communication built for meaningful conversations. Your team, always connected.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              to={isAuthenticated ? "/chat" : "/signup"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-cyan-500 text-white font-bold text-base tracking-wide hover:shadow-[0_8px_32px_rgba(139,92,246,0.45)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAuthenticated ? "Open NEXORA" : "Start Chatting Free"}
                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-purple-500/25 text-slate-300 font-semibold text-base hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-white transition-all"
            >
              Explore Features
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
            {[
              { value: "10K+", label: "Active users" },
              { value: "99.9%", label: "Uptime" },
              { value: "<50ms", label: "Message delay" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D chat preview */}
        <div className="flex-1 flex justify-center lg:justify-end animate-slideInRight">
          <HeroChatPreview />
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Features Section
   ───────────────────────────────────────── */
const FEATURES = [
  {
    icon: <HiOutlineBolt className="w-6 h-6" />,
    title: "Real-Time Messaging",
    desc: "Instant message delivery powered by WebSocket technology. No refresh, no delay — just pure real-time conversation.",
    color: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: <HiOutlineUserGroup className="w-6 h-6" />,
    title: "Private & Group Chat",
    desc: "Create private conversations or invite your whole team. Unlimited participants with seamless group management.",
    color: "from-purple-500/20 to-violet-600/20",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: <HiOutlineGlobeAlt className="w-6 h-6" />,
    title: "Online Presence",
    desc: "Know who's available instantly with real-time online, away, and busy status indicators across your network.",
    color: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: <HiOutlinePaperClip className="w-6 h-6" />,
    title: "File Sharing",
    desc: "Share images, documents, and files effortlessly. Instant preview with no size limitations for power users.",
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: <HiOutlineFaceSmile className="w-6 h-6" />,
    title: "Message Reactions",
    desc: "Express yourself with emoji reactions to any message. Rich reactions that make conversations more human.",
    color: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: <HiOutlineLockClosed className="w-6 h-6" />,
    title: "Secure Authentication",
    desc: "JWT-based authentication with httpOnly cookies. Your credentials stay safe with bcrypt hashing.",
    color: "from-indigo-500/20 to-violet-600/20",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
];

const Features = () => (
  <section id="features" className="py-24 px-4 relative">
    <div className="max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-4">
          <HiOutlineSparkles className="w-3.5 h-3.5" />
          Everything you need
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
          Built for{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            serious teams
          </span>
        </h2>
        <p className="text-slate-400/80 text-lg max-w-2xl mx-auto leading-relaxed">
          Every feature you need to collaborate effectively, communicate clearly, and move faster.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, i) => (
          <div
            key={feature.title}
            className={`group glass rounded-2xl p-6 border ${feature.border} hover:border-opacity-60 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition-all duration-300`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.border} flex items-center justify-center ${feature.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-400/80 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Live Chat Preview Section
   ───────────────────────────────────────── */
const LivePreview = () => (
  <section id="community" className="py-24 px-4 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-4">
          <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5" />
          See it in action
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
          A chat experience{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            unlike any other
          </span>
        </h2>
        <p className="text-slate-400/80 text-lg max-w-xl mx-auto">
          Real-time, beautiful, and blazing fast. Built to impress and built to ship.
        </p>
      </div>

      {/* App preview */}
      <div className="glass rounded-3xl overflow-hidden border border-purple-500/15 shadow-2xl shadow-purple-900/30 max-w-5xl mx-auto">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-500/10 bg-[#0a0f2a]/80">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-[#111840] border border-purple-500/15 text-[11px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              nexora.app — Secure connection
            </div>
          </div>
        </div>

        {/* Three-panel layout */}
        <div className="flex h-[400px] sm:h-[480px]">
          {/* Sidebar */}
          <div className="w-52 sm:w-64 border-r border-purple-500/10 bg-[#0a0f2a]/60 flex flex-col hidden sm:flex">
            <div className="px-3 py-3 border-b border-purple-500/10">
              <Logo size="sm" />
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111840] border border-purple-500/15 text-[11px] text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search conversations…
              </div>
            </div>
            <div className="flex-1 overflow-hidden px-2 py-1">
              {[
                { name: "Alex Morgan", msg: "Ready to ship 🚀", online: true, badge: 3 },
                { name: "Design Team", msg: "Sarah: mockups done!", online: true },
                { name: "Sarah Chen", msg: "sending files…", online: false, badge: 1 },
                { name: "Dev Squad", msg: "Build passed ✅", online: false },
              ].map((c, i) => (
                <div key={i} className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer ${i === 0 ? "bg-purple-500/15 border border-purple-500/20" : "hover:bg-purple-500/8"} transition-colors mb-0.5`}>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {c.name[0]}
                    </div>
                    {c.online && <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#0a0f2a]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-200 truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{c.msg}</p>
                  </div>
                  {c.badge && (
                    <div className="w-4 h-4 rounded-full bg-purple-500 text-[9px] text-white flex items-center justify-center font-bold shrink-0">
                      {c.badge}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main chat */}
          <div className="flex-1 flex flex-col bg-[#060918]/40">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-500/10">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">A</div>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#060918]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-100">Alex Morgan</p>
                <p className="text-[10px] text-green-400">Online</p>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 px-3 py-4 space-y-2.5 overflow-hidden">
              {[
                { text: "Hey! How's the new build going?", own: false },
                { text: "It's coming together amazingly! 🚀 The UI is so polished", own: true },
                { text: "Real-time updates working?", own: false },
                { text: "Yes! Socket.io integration is complete. Messages fly!", own: true },
                { text: "Can't wait to see the final demo 🔥", own: false },
              ].map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.own ? "flex-row-reverse" : ""}`}>
                  {!m.own && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/40 to-violet-600/40 border border-purple-500/20 shrink-0 self-end" />}
                  <div className={`px-3 py-2 rounded-xl text-[11px] max-w-[70%] leading-relaxed ${m.own ? "bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-br-sm" : "bg-[#111840] border border-purple-500/10 text-slate-200 rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/15 shrink-0 self-end" />
                <div className="px-3 py-2 rounded-xl bg-[#111840] border border-purple-500/10 flex gap-1 items-center">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
            {/* Composer */}
            <div className="px-3 py-2.5 border-t border-purple-500/10">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111840] border border-purple-500/20">
                <span className="text-[10px] text-slate-500 flex-1">Reply to Alex…</span>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Profile panel (hidden on small) */}
          <div className="w-44 border-l border-purple-500/10 bg-[#0a0f2a]/60 hidden lg:flex flex-col items-center py-4 px-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white mb-2">A</div>
            <p className="text-xs font-bold text-slate-100 mb-0.5">Alex Morgan</p>
            <p className="text-[10px] text-purple-400/70 mb-2">@alexmorgan</p>
            <div className="flex items-center gap-1 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-green-400">Online</span>
            </div>
            <div className="w-full">
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Shared Media</p>
              <div className="grid grid-cols-3 gap-1">
                {["from-purple-500/30 to-violet-600/30", "from-cyan-500/30 to-blue-600/30", "from-pink-500/30 to-rose-600/30"].map((g, i) => (
                  <div key={i} className={`aspect-square rounded-md bg-gradient-to-br ${g} border border-purple-500/10`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Security Section
   ───────────────────────────────────────── */
const Security = () => (
  <section id="security" className="py-24 px-4 relative">
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />

    <div className="max-w-7xl mx-auto">
      <div className="glass rounded-3xl border border-cyan-500/20 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)" }} />

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-6">
              <HiOutlineShieldCheck className="w-3.5 h-3.5" />
              Enterprise-grade security
            </div>
            <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
              Your conversations,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                always protected
              </span>
            </h2>
            <p className="text-slate-400/80 text-lg leading-relaxed mb-8">
              Built from the ground up with security-first principles. JWT authentication, bcrypt hashing, and httpOnly cookies keep your data safe.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "JWT tokens stored in httpOnly cookies",
                "Passwords hashed with bcryptjs",
                "CORS protection on all API endpoints",
                "Cookie-parser with secure flag in production",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <HiOutlineCheck className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <HiOutlineShieldCheck className="w-16 h-16 text-cyan-400" />
                </div>
              </div>
              {/* Orbiting dots */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-3 h-3 rounded-full bg-cyan-500/50 border border-cyan-500/30"
                  style={{
                    top: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                    left: `${50 + 46 * Math.cos((deg * Math.PI) / 180)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   CTA Section
   ───────────────────────────────────────── */
const CTA = ({ isAuthenticated }) => (
  <section className="py-24 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <div className="glass rounded-3xl p-12 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
            Ready to{" "}
            <span className="bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              connect?
            </span>
          </h2>
          <p className="text-slate-400/80 text-lg mb-8 max-w-lg mx-auto">
            Join thousands of teams already using NEXORA to communicate faster and collaborate better.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/chat" : "/signup"}
              className="px-10 py-4 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-cyan-500 text-white font-bold text-base hover:shadow-[0_8px_32px_rgba(139,92,246,0.5)] hover:-translate-y-1 transition-all"
            >
              {isAuthenticated ? "Go to NEXORA →" : "Create Free Account →"}
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="px-10 py-4 rounded-2xl border border-purple-500/25 text-slate-300 font-semibold hover:bg-purple-500/10 hover:text-white transition-all">
                Already have an account?
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Footer
   ───────────────────────────────────────── */
const Footer = () => (
  <footer className="border-t border-purple-500/10 py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo />
        <p className="text-sm text-slate-500 text-center">
          © 2026 NEXORA. Built with React, Node.js, and MongoDB.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">Privacy</span>
          <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">Terms</span>
          <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">GitHub</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────
   Main Home Component
   ───────────────────────────────────────── */
const Home = () => {
  const { isAuthenticated } = useSelector((s) => s.user);

  return (
    <div className="min-h-screen bg-[#060918] font-inter text-slate-200">
      <Navbar isAuthenticated={isAuthenticated} />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <LivePreview />
      <Security />
      <CTA isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
};

export default Home;
