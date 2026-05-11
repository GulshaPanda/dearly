"use client";

import { useState } from "react";
import Link from "next/link";

// Dearly palette — peach #F5E6DA · coral #E16D5A · navy #1E1E2E · indigo #4F46E5

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-2xl tracking-tight text-[#4F46E5]"
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Sign-in form ready. Supabase Auth wiring is the next step.");
  }

  function handleGoogleSignIn() {
    alert("Google sign-in via Supabase OAuth — coming next.");
  }

  return (
    <main className="min-h-screen bg-[#F5E6DA] flex flex-col">
      {/* Top nav — same as landing */}
      <header className="px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1E1E2E]/75">
            <Link href="/#product" className="hover:text-[#1E1E2E] transition">
              Product
            </Link>
            <Link href="/#how" className="hover:text-[#1E1E2E] transition">
              How it works
            </Link>
            <Link href="/#creators" className="hover:text-[#1E1E2E] transition">
              Creators
            </Link>
            <Link
              href="/signup"
              className="bg-[#1E1E2E] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#2c2c44] transition"
            >
              Try it Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-16 pt-6 lg:pt-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT — copy + form */}
        <div className="w-full max-w-md">
          <p className="text-xs font-bold text-[#E16D5A] uppercase tracking-[0.18em] mb-5">
            Welcome back
          </p>

          <h1 className="text-[44px] md:text-[52px] font-bold leading-[1.05] tracking-tight text-[#1E1E2E] mb-5">
            Pick up{" "}
            <span
              className="text-[#4F46E5] italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              where
            </span>{" "}
            you left off.
          </h1>

          <p className="text-[#6B6354] text-base md:text-lg leading-relaxed mb-8">
            Sign in to continue your conversation with the AI gifting friend that helps
            you decide — instead of throwing random ideas at you.
          </p>

          {/* Google button first — primary path */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-[#1E1E2E]/12 hover:border-[#1E1E2E]/35 hover:shadow-md text-[#1E1E2E] font-semibold rounded-full px-6 py-3.5 transition flex items-center justify-center gap-2.5 active:scale-[0.99] mb-5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#1E1E2E]/12" />
            <span className="text-[11px] text-[#6B6354] uppercase tracking-[0.18em] font-semibold">
              or with email
            </span>
            <div className="flex-1 h-px bg-[#1E1E2E]/12" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1E1E2E] mb-1.5 uppercase tracking-[0.15em]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white rounded-full border border-[#1E1E2E]/12 px-5 py-3.5 text-[#1E1E2E] placeholder:text-[#6B6354]/50 focus:outline-none focus:border-[#E16D5A] focus:ring-4 focus:ring-[#E16D5A]/15 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#1E1E2E] uppercase tracking-[0.15em]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#E16D5A] font-semibold hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white rounded-full border border-[#1E1E2E]/12 px-5 py-3.5 text-[#1E1E2E] placeholder:text-[#6B6354]/50 focus:outline-none focus:border-[#E16D5A] focus:ring-4 focus:ring-[#E16D5A]/15 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E16D5A] hover:bg-[#cf5e4d] text-white font-semibold rounded-full px-7 py-3.5 transition shadow-lg shadow-[#E16D5A]/25 hover:shadow-xl active:scale-[0.99] mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-[#6B6354] mt-7">
            New here?{" "}
            <Link
              href="/signup"
              className="text-[#E16D5A] font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 text-[11px] text-[#6B6354]/70">
            <span>Free to start</span>
            <span className="w-1 h-1 rounded-full bg-[#6B6354]/30" />
            <span>No credit card</span>
            <span className="w-1 h-1 rounded-full bg-[#6B6354]/30" />
            <span>30 sec sign-up</span>
          </div>
        </div>

        {/* RIGHT — visual (uses the same Group 10 collage as landing) */}
        <div className="hidden lg:flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Group%2010.png"
            alt="Dearly — gifting moments"
            className="w-full max-w-[520px] h-auto"
          />
        </div>
      </section>
    </main>
  );
}
