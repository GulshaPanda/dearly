"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// Palette: peach #F5E6DA — coral #E16D5A — navy #1E1E2E — indigo #4F46E5 — cream #FBF3E9 — muted #6B6354

// ============================================================
// REUSABLE BITS
// ============================================================

function Logo({ dark = false }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-bold text-2xl tracking-tight ${
        dark ? "text-white" : "text-[#4F46E5]"
      }`}
      style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: "italic" }}
    >
      <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#E16D5A]/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Robo-Refined-Face.png" alt="" className="w-full h-full object-cover" />
      </div>
      Dearly
    </Link>
  );
}

function DotGrid({ rows = 7, cols = 7, className = "", color = "#A8A29E", opacity = 1, spacing = 14, radius = 1.6 }) {
  return (
    <svg className={className} width={cols * spacing} height={rows * spacing} fill="none" aria-hidden>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={c * spacing + 4} cy={r * spacing + 4} r={radius} fill={color} opacity={opacity} />
        ))
      )}
    </svg>
  );
}

function StarRow() {
  return (
    <div className="flex items-center gap-0.5 text-[#E16D5A]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.6 7.3H22l-6.2 4.6 2.4 7.6L12 17l-6.2 4.5 2.4-7.6L2 9.3h7.4L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ============================================================
// 1. TOP NAV
// ============================================================

function TopNav({ onLoginClick }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-5 lg:px-12 py-5 lg:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1E1E2E]/75">
          <Link href="#product" className="hover:text-[#1E1E2E] transition">Product</Link>
          <Link href="#how" className="hover:text-[#1E1E2E] transition">How it works</Link>
          <Link href="#creators" className="hover:text-[#1E1E2E] transition">Creators</Link>
          <button
            type="button"
            onClick={onLoginClick}
            className="hover:text-[#1E1E2E] transition cursor-pointer"
          >
            Log In
          </button>
          <Link
            href="/chat?trial=true"
            className="bg-[#1E1E2E] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#2c2c44] transition cursor-pointer"
          >
            Try it Free
          </Link>
        </nav>

        {/* Mobile nav — just Login + Try it Free */}
        <div className="md:hidden flex items-center gap-2 text-sm font-semibold">
          <button
            type="button"
            onClick={onLoginClick}
            className="text-[#1E1E2E]/75 hover:text-[#1E1E2E] transition cursor-pointer px-2"
          >
            Log In
          </button>
          <Link
            href="/chat?trial=true"
            className="bg-[#1E1E2E] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#2c2c44] transition cursor-pointer"
          >
            Try Free
          </Link>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// 2. HERO
// ============================================================

function Hero({ onLoginClick }) {
  return (
    <section className="relative bg-[#F5E6DA] pt-32 pb-24 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — copy */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-[#1E1E2E] mb-6">
            Because{" "}
            <span className="text-[#4F46E5] italic" style={{ fontFamily: 'Georgia, serif' }}>
              meaningful
            </span>{" "}
            gifts aren&apos;t random.
          </h1>
          <p className="text-[#6B6354] text-lg leading-relaxed mb-9 max-w-md">
            A friendly AI that helps you think through gifting situations — instead of throwing
            random ideas at you.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/chat?trial=true"
              className="bg-[#E16D5A] hover:bg-[#cf5e4d] text-white font-semibold rounded-full px-7 py-3.5 transition shadow-lg shadow-[#E16D5A]/25 hover:shadow-xl cursor-pointer"
            >
              Try it Free
            </Link>
            <Link
              href="#how"
              className="bg-transparent border-2 border-[#1E1E2E]/15 hover:border-[#1E1E2E]/40 text-[#1E1E2E] font-semibold rounded-full px-7 py-3.5 transition"
            >
              Get a Demo
            </Link>
          </div>
        </div>

        {/* RIGHT — Figma collage as a single image (visible on all screen sizes) */}
        <div className="relative w-full flex justify-center items-center mt-4 lg:mt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Group%2010.png"
            alt="Dearly — gifting moments"
            className="w-full max-w-[420px] lg:max-w-[560px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 3. "MADE FOR MEANINGFUL MOMENTS" — chat mockup using OUR design
// ============================================================

function ChatMockup() {
  return (
    <section id="how" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E2E] tracking-tight mb-4">
            Made for meaningful moments.
          </h2>
          <p className="text-[#6B6354] text-lg">
            From birthdays to quiet gestures, Dearly helps you find gifts that feel deeply personal.
          </p>
        </div>

        {/* Chat screen mockup — OUR design with tiny robot */}
        <div className="relative max-w-3xl mx-auto">
          {/* Decorative dots */}
          <div className="absolute -top-6 -left-6 hidden md:block">
            <DotGrid rows={4} cols={4} opacity={0.35} />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden md:block">
            <DotGrid rows={4} cols={4} opacity={0.35} />
          </div>

          <div className="relative bg-[#F5E6DA]/40 border border-[#1E1E2E]/8 rounded-[28px] overflow-hidden shadow-2xl shadow-[#1E1E2E]/10">
            {/* App header */}
            <div className="bg-white border-b border-[#1E1E2E]/8 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#E16D5A]/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Robo-Refined-Face.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1E1E2E]">Dearly</p>
                <p className="text-xs text-[#6B6354] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  online &amp; thinking with you
                </p>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>

            {/* Conversation */}
            <div className="px-6 py-7 space-y-4 bg-gradient-to-b from-white to-[#FBF3E9]/40">
              {/* AI greeting */}
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#1E1E2E]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Robo-Refined-Face.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#1E1E2E] text-white text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[75%] shadow-sm">
                  Hey 🎁 Who&apos;s the gift for?
                </div>
              </div>

              {/* User */}
              <div className="flex justify-end">
                <div className="bg-[#E16D5A] text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[75%] shadow-sm shadow-[#E16D5A]/20">
                  Mom&apos;s birthday tomorrow… I&apos;m blanking 😬
                </div>
              </div>

              {/* AI follow-up */}
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#1E1E2E]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Robo-Refined-Face.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#1E1E2E] text-white text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[75%] shadow-sm">
                  Got it — last-minute mom gift. How would you like to approach this?
                </div>
              </div>

              {/* Mode cards */}
              <div className="grid grid-cols-2 gap-3 pl-10">
                <div className="bg-white border border-[#E16D5A]/25 rounded-2xl p-4 hover:border-[#E16D5A]/60 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[#E16D5A]">⚡</span>
                    <p className="font-bold text-sm text-[#1E1E2E]">Quick &amp; Reliable</p>
                  </div>
                  <p className="text-xs text-[#6B6354] leading-snug">
                    Safe, thoughtful gifts ready in minutes.
                  </p>
                </div>
                <div className="bg-white border border-[#4F46E5]/25 rounded-2xl p-4 hover:border-[#4F46E5]/60 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[#4F46E5]">💭</span>
                    <p className="font-bold text-sm text-[#1E1E2E]">Personal &amp; Thoughtful</p>
                  </div>
                  <p className="text-xs text-[#6B6354] leading-snug">
                    We&apos;ll explore her story together.
                  </p>
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#1E1E2E]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Robo-Refined-Face.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-[#1E1E2E]/5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E2E]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E2E]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E2E]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="bg-white border-t border-[#1E1E2E]/8 px-4 py-3 flex items-center gap-2">
              <div className="flex-1 bg-[#F5E6DA]/50 rounded-full px-4 py-2.5 text-xs text-[#6B6354]">
                Type something…
              </div>
              <div className="w-9 h-9 rounded-full bg-[#E16D5A] flex items-center justify-center text-white shadow-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 4. "A WHOLE NEW WAY TO GIFT BETTER"
// ============================================================

function ValueProps({ onLoginClick }) {
  const features = [
    {
      icon: "⏰",
      title: "Last-minute gifting help",
      desc: "Stuck with hours to spare? We help you decide quickly without losing the personal touch.",
      bg: "bg-[#E16D5A]/8 border-[#E16D5A]/20",
    },
    {
      icon: "💜",
      title: "Thoughtful relationship gifting",
      desc: "Remembers the people you gift often so each one feels like the next chapter, not a repeat.",
      bg: "bg-[#4F46E5]/8 border-[#4F46E5]/20",
    },
    {
      icon: "👥",
      title: "Group gifting with friends",
      desc: "Plan together, decide together. No spreadsheets, no last-minute Venmo chaos.",
      bg: "bg-[#1E1E2E]/5 border-[#1E1E2E]/15",
    },
    {
      icon: "🌿",
      title: "Discover unique small creators",
      desc: "Curated independent makers that feel intentional — not endless marketplace listings.",
      bg: "bg-green-700/5 border-green-700/15",
    },
  ];

  return (
    <section id="product" className="bg-[#F5E6DA] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT — feature cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`${f.bg} border rounded-3xl p-5 transition hover:scale-[1.02] hover:shadow-md cursor-default`}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <p className="font-bold text-[#1E1E2E] text-sm mb-1.5">{f.title}</p>
              <p className="text-xs text-[#6B6354] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* RIGHT — heading + CTAs + reviews */}
        <div className="lg:pl-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E2E] tracking-tight leading-[1.1] mb-5">
            A whole new way <br />
            to gift{" "}
            <span className="text-[#E16D5A] italic" style={{ fontFamily: "Georgia, serif" }}>
              better.
            </span>
          </h2>
          <p className="text-[#6B6354] text-lg mb-8 max-w-md">
            Built for the real moments — not generic product lists.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/chat?trial=true"
              className="bg-[#E16D5A] hover:bg-[#cf5e4d] text-white font-semibold rounded-full px-7 py-3.5 transition shadow-lg shadow-[#E16D5A]/25 cursor-pointer"
            >
              Try it Free
            </Link>
            <Link
              href="#how"
              className="bg-transparent border-2 border-[#1E1E2E]/15 hover:border-[#1E1E2E]/40 text-[#1E1E2E] font-semibold rounded-full px-7 py-3.5 transition"
            >
              Get a Demo
            </Link>
          </div>

          <div className="border-t border-[#1E1E2E]/10 pt-6 flex items-center gap-4">
            <StarRow />
            <p className="text-sm text-[#6B6354]">
              Loved by <span className="font-semibold text-[#1E1E2E]">12k+</span> thoughtful gifters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 5. "THOUGHTFUL GIFTS FROM REAL CREATORS"
// ============================================================

function CreatorsSection() {
  const creators = [
    {
      name: "Lumen & Co.",
      blurb: "Handmade scented candles",
      image: "/Candles.jpg",
    },
    {
      name: "Studio Mira",
      blurb: "Personalized portrait art",
      image: "/Portrait.jpg",
    },
    {
      name: "Petal Parcel",
      blurb: "Custom gift boxes & ribbons",
      image: "/gift.jpg",
    },
  ];

  return (
    <section id="creators" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E2E] tracking-tight mb-4">
            Thoughtful gifts from{" "}
            <span className="text-[#E16D5A] italic" style={{ fontFamily: "Georgia, serif" }}>
              real creators.
            </span>
          </h2>
          <p className="text-[#6B6354] text-lg">
            Handpicked makers, not endless marketplace listings.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {creators.map((c, i) => (
            <div
              key={i}
              className="group rounded-3xl overflow-hidden border border-[#1E1E2E]/8 hover:shadow-xl transition"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F5E6DA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white p-5">
                <p className="text-xs uppercase tracking-widest text-[#E16D5A] font-bold mb-1">
                  {c.name}
                </p>
                <p className="font-semibold text-[#1E1E2E] text-base">{c.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 6. FOOTER
// ============================================================

function Footer() {
  return (
    <footer className="bg-[#FBF3E9] border-t border-[#1E1E2E]/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Logo />
          <p className="text-sm text-[#6B6354] mt-4 max-w-xs leading-relaxed">
            The thoughtful AI gifting companion — built for real moments, not random ideas.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-[#1E1E2E]/8 hover:bg-[#1E1E2E] hover:text-white text-[#1E1E2E] flex items-center justify-center transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.55a5.87 5.87 0 00-2.13 1.39A5.87 5.87 0 00.62 4.14c-.3.76-.49 1.63-.55 2.91C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.55 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.63.49 2.91.55C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.55a5.87 5.87 0 002.13-1.39 5.87 5.87 0 001.39-2.13c.3-.76.49-1.63.55-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.55-2.91a5.87 5.87 0 00-1.39-2.13A5.87 5.87 0 0019.86.62C19.1.32 18.23.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16A4 4 0 1112 8a4 4 0 010 8zm6.4-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-[#1E1E2E]/8 hover:bg-[#1E1E2E] hover:text-white text-[#1E1E2E] flex items-center justify-center transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-[#1E1E2E]/8 hover:bg-[#1E1E2E] hover:text-white text-[#1E1E2E] flex items-center justify-center transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#1E1E2E] mb-4">Product</p>
          <ul className="space-y-2.5 text-sm text-[#6B6354]">
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Overview</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Pricing</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Updates</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Roadmap</Link></li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#1E1E2E] mb-4">Features</p>
          <ul className="space-y-2.5 text-sm text-[#6B6354]">
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">AI Assistant</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Reminders</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Group Gifting</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Memory</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#1E1E2E] mb-4">Company</p>
          <ul className="space-y-2.5 text-sm text-[#6B6354]">
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">About</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Careers</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Press</Link></li>
            <li><Link href="#" className="hover:text-[#1E1E2E] transition">Blog</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1E1E2E]/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#6B6354]">
          <p>© 2026 Dearly Inc. — built for thoughtful gifters.</p>
          <p className="italic">Designed to make thoughtful moments easier.</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// LOGIN MODAL — floating popup with dimmed backdrop
// ============================================================

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
    </svg>
  );
}

function LoginModal({ open, onClose, initialMode = "signin" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Sync mode whenever the modal re-opens with a new initialMode
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setAuthError("");
    }
  }, [open, initialMode]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");
    if (!agreed) {
      setAuthError("Please agree to the Terms & Privacy Policy first.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      onClose();
      router.push("/chat");
      router.refresh();
    } catch (err) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogle() {
    setAuthError("");
    setAuthLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Google redirects, no further action needed
    } catch (err) {
      setAuthError(err.message || "Google sign-in failed.");
      setAuthLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-[#1E1E2E]/55 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Modal card */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {/* Banner with robot */}
        <div className="relative h-32 bg-gradient-to-br from-[#FBF3E9] via-[#F5E6DA] to-[#FFD9C2] flex items-center justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Robo-Refined-Face.png" alt="" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#1E1E2E] transition shadow-sm"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-7 pt-6 pb-7">
          <h2 id="login-modal-title" className="text-[26px] font-bold text-[#1E1E2E] mb-1.5 text-center tracking-tight">
            {mode === "signup" ? (
              <>
                Join{" "}
                <span className="italic text-[#4F46E5]" style={{ fontFamily: "Georgia, serif" }}>Dearly</span>
              </>
            ) : (
              <>
                <span className="italic text-[#4F46E5]" style={{ fontFamily: "Georgia, serif" }}>Welcome</span> back
              </>
            )}
          </h2>
          <p className="text-sm text-[#6B6354] text-center mb-6">
            {mode === "signup"
              ? "Create an account to save your conversations and recipients."
              : "Sign in to pick up where you left off."}
          </p>

          {/*
            Google sign-in temporarily disabled — re-enable by un-commenting the
            block below once Google Cloud OAuth client is set up and credentials
            are added to Supabase.

          <button
            type="button"
            onClick={handleGoogle}
            disabled={authLoading}
            className="w-full bg-white border border-[#1E1E2E]/12 hover:border-[#1E1E2E]/35 hover:shadow-md text-[#1E1E2E] font-semibold rounded-full px-5 py-3 transition flex items-center justify-center gap-2.5 active:scale-[0.99] mb-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#1E1E2E]/12" />
            <span className="text-[10px] text-[#6B6354] uppercase tracking-[0.18em] font-semibold">
              or with email
            </span>
            <div className="flex-1 h-px bg-[#1E1E2E]/12" />
          </div>
          */}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white rounded-full border border-[#1E1E2E]/12 px-5 py-3 text-sm text-[#1E1E2E] placeholder:text-[#6B6354]/50 focus:outline-none focus:border-[#E16D5A] focus:ring-4 focus:ring-[#E16D5A]/15 transition"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full bg-white rounded-full border border-[#1E1E2E]/12 px-5 py-3 text-sm text-[#1E1E2E] placeholder:text-[#6B6354]/50 focus:outline-none focus:border-[#E16D5A] focus:ring-4 focus:ring-[#E16D5A]/15 transition"
            />

            <label className="flex items-start gap-2.5 text-xs text-[#6B6354] leading-relaxed cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#E16D5A] shrink-0"
              />
              <span>
                By continuing, I agree to the{" "}
                <a href="#" className="text-[#E16D5A] font-semibold hover:underline">Terms of Use</a>
                {" "}&amp;{" "}
                <a href="#" className="text-[#E16D5A] font-semibold hover:underline">Privacy Policy</a>.
              </span>
            </label>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl px-4 py-2.5">
                ⚠ {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={!agreed || authLoading}
              className={`w-full font-semibold rounded-full px-7 py-3 transition shadow-md active:scale-[0.99] mt-1 ${
                agreed && !authLoading
                  ? "bg-[#E16D5A] hover:bg-[#cf5e4d] text-white shadow-[#E16D5A]/25 hover:shadow-lg cursor-pointer"
                  : "bg-[#1E1E2E]/15 text-[#1E1E2E]/40 cursor-not-allowed shadow-none"
              }`}
            >
              {authLoading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-[#6B6354] text-center mt-5">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setAuthError(""); }}
                  className="text-[#E16D5A] font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to Dearly?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setAuthError(""); }}
                  className="text-[#E16D5A] font-semibold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Inline animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

function LandingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [initialMode, setInitialMode] = useState("signin");
  const openLogin = () => { setInitialMode("signin"); setLoginOpen(true); };
  const openSignup = () => { setInitialMode("signup"); setLoginOpen(true); };
  const closeLogin = () => setLoginOpen(false);

  // Auto-open the login modal if URL has ?login=true or ?signup=true.
  // BUT: if the user is already signed in, skip the modal and send them to /chat instead.
  useEffect(() => {
    const wantsSignup = searchParams.get("signup") === "true";
    const wantsLogin = searchParams.get("login") === "true";
    if (!wantsSignup && !wantsLogin) return;

    let active = true;
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;

      if (user) {
        // Already signed in — bypass modal, go straight to chat
        router.replace("/chat");
      } else {
        // Not signed in — open the appropriate modal
        setInitialMode(wantsSignup ? "signup" : "signin");
        setLoginOpen(true);
        router.replace("/");
      }
    })();
    return () => { active = false; };
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-white">
      <TopNav onLoginClick={openLogin} />
      <Hero onLoginClick={openLogin} />
      <ChatMockup />
      <ValueProps onLoginClick={openLogin} />
      <CreatorsSection />
      <Footer />
      <LoginModal open={loginOpen} onClose={closeLogin} initialMode={initialMode} />
    </main>
  );
}

// Suspense wrapper required for useSearchParams in the App Router
export default function LandingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white" />}>
      <LandingContent />
    </Suspense>
  );
}
