"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileModal from "@/components/ProfileModal";

const AI_AVATAR = "/Robo-Refined-Face.png";
const ROBOT_FULL = "/Robo-Refined-Full.png";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ============ EVENT CARD HELPERS ============

// Warm gradient palettes — assigned deterministically per event so cards stay consistent
const EVENT_GRADIENTS = [
  "from-[#FFD7C9] via-[#F5BBA9] to-[#E6A28F]",  // peach
  "from-[#E0DAFF] via-[#C9C0FF] to-[#A89DFF]",  // lavender
  "from-[#FFE0EC] via-[#FFC2D7] to-[#FF9DBE]",  // pink
  "from-[#FFF5DE] via-[#FBE4B0] to-[#F5C97D]",  // cream/gold
  "from-[#D7F0E0] via-[#B6E0C6] to-[#8FCBA9]",  // sage
  "from-[#D7E8FF] via-[#B0CFFF] to-[#7FAEFF]",  // sky
];

function getEventGradient(id) {
  if (!id) return EVENT_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return EVENT_GRADIENTS[Math.abs(hash) % EVENT_GRADIENTS.length];
}

const STATUS_STYLES = {
  planning: { label: "Planning", badge: "bg-[#FBE2DA] text-[#C75A4E]", bar: "bg-[#E16D5A]" },
  in_progress: { label: "In Progress", badge: "bg-[#ECE3F8] text-[#5946D6]", bar: "bg-[#5946D6]" },
  ideas: { label: "Ideas", badge: "bg-[#D7E8FF] text-[#3B6FCE]", bar: "bg-[#3B6FCE]" },
  not_started: { label: "Not Started", badge: "bg-[#FBEFD2] text-[#A4791F]", bar: "bg-[#E5A93C]" },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.planning;
}

function formatEventDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDaysLeft(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 0) return `${diff} days left`;
  if (diff === -1) return "Yesterday";
  return `${Math.abs(diff)} days ago`;
}

function CameraIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

// =================== ICONS ===================

function PlusIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function GroupIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function ClockIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function GearIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function MenuIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function LogoutIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function BellIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function SendIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}
function ChatIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function LightbulbIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-7 7c0 3 2 5 3 6s1 2 1 3h6c0-1 0-2 1-3s3-3 3-6a7 7 0 00-7-7z" />
    </svg>
  );
}
function HeartLetterIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function ArrowRight({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// =================== SIDEBAR ===================

function LockIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function Sidebar({ trial = false, onLockedClick, mobileOpen = false, onCloseMobile, onNewEvent }) {
  const LockedItem = ({ icon, label }) => (
    <button
      onClick={onLockedClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#1E1E2E]/50 font-semibold text-sm hover:bg-white/40 transition cursor-pointer"
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <LockIcon className="w-3.5 h-3.5 text-[#1E1E2E]/40" />
    </button>
  );

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#1E1E2E]/40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 shrink-0 bg-[#FAEEDB] border-r border-[#1E1E2E]/8 flex flex-col px-5 py-6 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#4F46E5]/25 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AI_AVATAR} alt="" className="w-full h-full object-cover" />
        </div>
        <span
          className="text-2xl font-bold italic text-[#4F46E5]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Dearly
        </span>
      </Link>

      {/* New Event button */}
      {trial ? (
        <button
          type="button"
          onClick={onLockedClick}
          className="w-full bg-[#5946D6]/40 text-white font-semibold rounded-2xl px-4 py-3 flex items-center justify-center gap-2 transition mb-6 cursor-pointer relative"
        >
          <PlusIcon />
          New Event
          <LockIcon className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 opacity-80" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNewEvent}
          className="w-full bg-[#5946D6] hover:bg-[#4838C4] text-white font-semibold rounded-2xl px-4 py-3 flex items-center justify-center gap-2 transition shadow-md shadow-[#5946D6]/20 mb-6 cursor-pointer"
        >
          <PlusIcon />
          New Event
        </button>
      )}

      {/* Nav */}
      <nav className="space-y-1 mb-6">
        {trial ? (
          <>
            <LockedItem icon={<GroupIcon />} label="Group Gifting" />
            <LockedItem icon={<ClockIcon />} label="Scheduled Surprises" />
          </>
        ) : (
          <>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#1E1E2E] font-semibold text-sm hover:bg-white/60 transition">
              <GroupIcon />
              Group Gifting
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#1E1E2E] font-semibold text-sm hover:bg-white/60 transition">
              <ClockIcon />
              Scheduled Surprises
            </button>
          </>
        )}
      </nav>

      <div className="mb-auto" />

      {/* Bottom — Dearly assistant card */}
      <div className="flex items-center gap-2.5 mt-6 pt-4 border-t border-[#1E1E2E]/8">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#4F46E5]/20 bg-white shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AI_AVATAR} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1E1E2E]">Hi, I&apos;m Dearly</p>
          <p className="text-[11px] text-[#6B6354] leading-tight">
            I&apos;m here to help you create
            <br />
            meaningful moments 💜
          </p>
        </div>
      </div>
      </aside>
    </>
  );
}

// =================== ACTION CARDS ===================

function ActionCards({ onCardClick }) {
  const cards = [
    {
      title: "Plan a Gift",
      desc: "Find a thoughtful direction for someone special.",
      cta: "Start Event",
      icon: "🎁",
      bg: "bg-[#ECE3F8]",
      cta_bg: "bg-[#5946D6] hover:bg-[#4838C4]",
      cta_text: "text-white",
      message: "I want to plan a gift for someone",
    },
    {
      title: "Schedule a Surprise",
      desc: "Send a message, song, or memory at the perfect moment.",
      cta: "Create Surprise",
      icon: "💌",
      bg: "bg-[#F8DDD6]",
      cta_bg: "bg-[#E16D5A] hover:bg-[#cf5e4d]",
      cta_text: "text-white",
      message: "Help me schedule a surprise",
    },
    {
      title: "Start a Group Gift",
      desc: "Plan something meaningful together.",
      cta: "Invite Friends",
      icon: "👥",
      bg: "bg-[#FBEFD2]",
      cta_bg: "bg-[#E5A93C] hover:bg-[#d59930]",
      cta_text: "text-white",
      message: "I want to start a group gift",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
      {cards.map((c, i) => (
        <div key={i} className={`${c.bg} rounded-3xl p-6 flex flex-col`}>
          <div className="text-5xl mb-5 text-center">{c.icon}</div>
          <h3 className="text-lg font-bold text-[#1E1E2E] text-center mb-1.5">
            {c.title}
          </h3>
          <p className="text-sm text-[#6B6354] text-center mb-5 leading-relaxed">
            {c.desc}
          </p>
          <button
            type="button"
            onClick={() => onCardClick(c.message)}
            className={`${c.cta_bg} ${c.cta_text} font-semibold rounded-2xl px-5 py-3 flex items-center justify-center gap-1.5 transition mt-auto active:scale-[0.99]`}
          >
            {c.cta}
            <ArrowRight />
          </button>
        </div>
      ))}
    </div>
  );
}

// =================== HOW IT WORKS ===================

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Tell Dearly\nabout the person",
      desc: "Share their personality, interests and your relationship.",
      Icon: ChatIcon,
    },
    {
      n: 2,
      title: "Explore thoughtful\nideas together",
      desc: "Dearly understands and helps you find the right direction.",
      Icon: LightbulbIcon,
    },
    {
      n: 3,
      title: "Create a memorable\nmoment",
      desc: "Add your personal touch with messages, music and more.",
      Icon: HeartLetterIcon,
    },
  ];
  return (
    <div className="bg-white/55 border border-[#1E1E2E]/8 rounded-3xl px-7 py-7 max-w-5xl mx-auto w-full">
      <p className="text-base font-bold text-[#1E1E2E] mb-6">
        How Dearly Works 💜
      </p>
      <div className="grid md:grid-cols-3 gap-6 relative">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#ECE3F8] flex items-center justify-center text-[#5946D6]">
                <s.Icon className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-[#5946D6] flex items-center justify-center text-[11px] font-bold text-[#5946D6]">
                {s.n}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1E1E2E] text-sm leading-snug whitespace-pre-line mb-1">
                {s.title}
              </p>
              <p className="text-xs text-[#6B6354] leading-relaxed">{s.desc}</p>
            </div>
            {/* Dotted connector to next step */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-7 -right-3 w-6 border-t-2 border-dotted border-[#1E1E2E]/15" />
            )}
          </div>
        ))}
      </div>
      <p
        className="text-center text-base text-[#1E1E2E] mt-7"
        style={{ fontFamily: 'Georgia, serif', fontStyle: "italic" }}
      >
        Thoughtful gifts. Meaningful moments. 💜
      </p>
    </div>
  );
}

// =================== MAIN PAGE ===================

// ============ TRIAL PAYWALL — mandatory, no dismiss ============
function TrialPaywall({ open }) {
  const router = useRouter();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy backdrop — no click to close */}
      <div className="absolute inset-0 bg-[#1E1E2E]/55" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative h-32 bg-gradient-to-br from-[#FBF3E9] via-[#F5E6DA] to-[#FFD9C2] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AI_AVATAR} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="px-7 pt-6 pb-7 text-center">
          <h2 className="text-2xl font-bold text-[#1E1E2E] mb-2">
            Want to see{" "}
            <span className="italic text-[#4F46E5]" style={{ fontFamily: "Georgia, serif" }}>
              your
            </span>{" "}
            ideas?
          </h2>
          <p className="text-sm text-[#6B6354] mb-6 leading-relaxed">
            Create a free account to unlock your recommendations,
            save your recipients, and let Dearly remember the moments
            that matter for next time.
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => router.push("/?signup=true")}
              className="w-full bg-[#5946D6] hover:bg-[#4838C4] text-white font-semibold rounded-full px-6 py-3 transition shadow-md shadow-[#5946D6]/25 cursor-pointer"
            >
              Sign up free to continue
            </button>
            <button
              onClick={() => router.push("/?login=true")}
              className="w-full bg-white border border-[#1E1E2E]/15 hover:border-[#1E1E2E]/30 text-[#1E1E2E] font-semibold rounded-full px-6 py-3 transition cursor-pointer"
            >
              I already have an account
            </button>
          </div>
          <p className="text-[11px] text-[#6B6354]/70 mt-5">
            Free forever · No credit card · 30-second sign up
          </p>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const trial = searchParams.get("trial") === "true";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey 🎁 Who's the gift for?",
      choices: [],
      products: [],
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  const [uploadingEventId, setUploadingEventId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [draggingImageId, setDraggingImageId] = useState(null);
  const [tempImagePosition, setTempImagePosition] = useState(50);
  const userMenuRef = useRef(null);
  const eventFileInputRef = useRef(null);
  const dragStartRef = useRef(null);
  const router = useRouter();

  // ============ Title editing ============
  function startEditTitle(evt, e) {
    e?.stopPropagation?.();
    setEditingTitleId(evt.id);
    setTitleDraft(evt.title || "");
  }
  async function saveTitleEdit() {
    if (!editingTitleId) return;
    const newTitle = titleDraft.trim() || "Untitled event";
    const id = editingTitleId;
    setEditingTitleId(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("events").update({ title: newTitle }).eq("id", id);
      setEvents((prev) => prev.map((evt) => (evt.id === id ? { ...evt, title: newTitle } : evt)));
    } catch (e) {
      console.error("Failed to save title:", e);
    }
  }

  // ============ Image dragging to reposition ============
  function startImageDrag(evt, e) {
    if (!evt.image_url) return;
    e.preventDefault();
    e.stopPropagation();
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    setDraggingImageId(evt.id);
    setTempImagePosition(evt.image_position_y ?? 50);
    dragStartRef.current = { y, pos: evt.image_position_y ?? 50 };
  }

  useEffect(() => {
    if (!draggingImageId) return;
    function onMove(e) {
      if (!dragStartRef.current) return;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (y == null) return;
      const dy = y - dragStartRef.current.y;
      // 1 px drag = ~1% position change
      const newPos = Math.max(0, Math.min(100, dragStartRef.current.pos + dy));
      setTempImagePosition(newPos);
    }
    async function onUp() {
      const id = draggingImageId;
      const finalPos = Math.round(tempImagePosition);
      setDraggingImageId(null);
      dragStartRef.current = null;
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.from("events").update({ image_position_y: finalPos }).eq("id", id);
        setEvents((prev) =>
          prev.map((evt) => (evt.id === id ? { ...evt, image_position_y: finalPos } : evt))
        );
      } catch (e) {
        console.error("Failed to save image position:", e);
      }
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [draggingImageId, tempImagePosition]);

  // Trigger the file picker for a specific event's cover image
  function triggerEventImageUpload(eventId, e) {
    e?.stopPropagation?.();
    setUploadingEventId(eventId);
    eventFileInputRef.current?.click();
  }

  async function handleEventImageChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so picking the same file again still fires onChange
    if (!file || !uploadingEventId || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      console.warn("Image too large (max 5 MB)");
      return;
    }
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const ext = file.name.split(".").pop().toLowerCase();
      const path = `${user.id}/events/${uploadingEventId}/cover-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      await supabase
        .from("events")
        .update({ image_url: data.publicUrl })
        .eq("id", uploadingEventId);

      setEvents((prev) =>
        prev.map((evt) => (evt.id === uploadingEventId ? { ...evt, image_url: data.publicUrl } : evt))
      );
    } catch (err) {
      console.error("Event image upload failed:", err);
    } finally {
      setUploadingEventId(null);
    }
  }

  // Computed: user's avatar URL (from metadata) or null (blank circle fallback)
  const userAvatarUrl = user?.user_metadata?.avatar_url || null;
  const userDisplayName = user?.user_metadata?.display_name || "";

  // Load the current Supabase user and their events (skip in trial mode)
  useEffect(() => {
    if (trial) return;
    let active = true;
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!active) return;
      setUser(u);
      if (!u) return;

      // Fetch this user's events (most recent first)
      let { data: evts } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      // If user has no events yet:
      //   • check for legacy messages without an event_id → migrate them
      //   • otherwise just create their first event with a welcome message
      if (!evts || evts.length === 0) {
        const { data: legacyMsgs } = await supabase
          .from("messages")
          .select("id")
          .is("event_id", null)
          .limit(1);

        const hasLegacy = legacyMsgs && legacyMsgs.length > 0;
        const title = hasLegacy ? "First conversation" : "New event";

        const { data: newEvent, error: createErr } = await supabase
          .from("events")
          .insert({ user_id: u.id, title, icon: "🎁" })
          .select()
          .single();

        if (createErr) {
          console.error("Failed to create initial event:", createErr);
          return;
        }

        if (hasLegacy) {
          // Move all orphan messages into this event so nothing is lost
          await supabase
            .from("messages")
            .update({ event_id: newEvent.id })
            .is("event_id", null);
        } else {
          // Brand-new account → seed with the welcome message
          await supabase.from("messages").insert({
            user_id: u.id,
            event_id: newEvent.id,
            role: "assistant",
            content: "Hey 🎁 Who's the gift for?",
            choices: [],
            products: [],
          });
        }

        evts = [newEvent];
      }

      if (!active) return;
      setEvents(evts);
      setActiveEventId(evts[0].id);
    })();
    return () => {
      active = false;
    };
  }, [trial]);

  // Load messages whenever the active event changes
  useEffect(() => {
    if (trial || !activeEventId) return;
    let active = true;
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: rows, error } = await supabase
        .from("messages")
        .select("*")
        .eq("event_id", activeEventId)
        .order("created_at", { ascending: true });

      if (!active) return;
      if (error) {
        console.error("Failed to load messages for event:", error);
        return;
      }

      if (rows && rows.length > 0) {
        setMessages(
          rows.map((r) => ({
            role: r.role,
            content: r.content,
            choices: r.choices || [],
            products: r.products || [],
            time: new Date(r.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } else {
        // New empty event — show the welcome message in UI without persisting yet
        setMessages([
          {
            role: "assistant",
            content: "Hey 🎁 Who's the gift for?",
            choices: [],
            products: [],
            time: getTime(),
          },
        ]);
      }
    })();
    return () => {
      active = false;
    };
  }, [activeEventId, trial]);

  // Helper to persist a message to Supabase under the current event
  async function persistMessage(msg) {
    if (trial || !user || !activeEventId) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("messages").insert({
        user_id: user.id,
        event_id: activeEventId,
        role: msg.role,
        content: msg.content,
        choices: msg.choices || [],
        products: msg.products || [],
      });
      // Bump the event's updated_at so it sorts to the top
      await supabase
        .from("events")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeEventId);
    } catch (e) {
      console.error("Failed to persist message:", e);
    }
  }

  // Create a brand new event (preserves previous ones as separate cards)
  async function startNewConversation() {
    if (!user) return;
    setUserMenuOpen(false);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: newEvent, error } = await supabase
        .from("events")
        .insert({ user_id: user.id, title: "New event", icon: "🎁" })
        .select()
        .single();
      if (error) throw error;

      // Seed the new event with a welcome message
      await supabase.from("messages").insert({
        user_id: user.id,
        event_id: newEvent.id,
        role: "assistant",
        content: "Hey 🎁 Who's the gift for?",
        choices: [],
        products: [],
      });

      // Add to the events list and switch to it
      setEvents((prev) => [newEvent, ...prev]);
      setActiveEventId(newEvent.id);
    } catch (e) {
      console.error("Failed to create new event:", e);
    }
  }

  // Switch to a different existing event
  function selectEvent(eventId) {
    setActiveEventId(eventId);
    setMobileSidebarOpen(false);
  }

  // Count AI responses that delivered actual product recommendations.
  // The first one locks the paywall in for trial users.
  const productResponseCount = messages.filter(
    (m) => m.role === "assistant" && Array.isArray(m.products) && m.products.length > 0
  ).length;

  // Trigger paywall in trial mode once products have been shown
  useEffect(() => {
    if (trial && productResponseCount >= 1 && !loading) {
      setPaywallOpen(true);
    }
  }, [trial, productResponseCount, loading]);

  function handleLockedClick() {
    router.push("/?signup=true");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    function onClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [userMenuOpen]);

  async function handleLogout() {
    setUserMenuOpen(false);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign-out error:", e);
    }
    router.push("/");
    router.refresh();
  }

  // Welcome dashboard shown until user sends their first message
  const isWelcome = messages.length === 1 && messages[0].role === "assistant";

  async function sendMessage(text) {
    if (!text.trim() || loading) return;

    const userMessage = { role: "user", content: text, time: getTime() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Persist the user message to Supabase (signed-in users only)
    persistMessage({ role: "user", content: text });

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
        choices: data.choices || [],
        products: data.products || [],
        time: getTime(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Persist the AI reply
      persistMessage(assistantMessage);
    } catch (err) {
      console.error("Frontend error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${err.message}`,
          choices: [],
          products: [],
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  const handleSend = () => sendMessage(input);
  const handleChoiceClick = (c) => sendMessage(c);
  const handleCardClick = (msg) => sendMessage(msg);

  return (
    <main className="min-h-screen bg-[#FAEEDB]">
      <div
        className={`flex min-h-screen transition ${
          paywallOpen ? "blur-md pointer-events-none select-none" : ""
        }`}
        aria-hidden={paywallOpen}
      >
      <Sidebar
        trial={trial}
        onLockedClick={handleLockedClick}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNewEvent={() => {
          setMobileSidebarOpen(false);
          startNewConversation();
        }}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — bell + avatar hidden in trial mode */}
        <header className="px-5 lg:px-12 py-5 flex items-center gap-4 min-h-[80px]">
          {/* Mobile hamburger — opens the sidebar drawer */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-full bg-white/70 border border-[#1E1E2E]/8 flex items-center justify-center text-[#1E1E2E] hover:bg-white transition"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="flex-1" />
          {!trial && (
          <button className="relative w-10 h-10 rounded-full bg-white/70 border border-[#1E1E2E]/8 flex items-center justify-center text-[#1E1E2E] hover:bg-white transition">
            <BellIcon />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5946D6]" />
          </button>
          )}
          {/* User avatar with dropdown menu */}
          {!trial && (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-label="Open user menu"
              aria-expanded={userMenuOpen}
              className={`w-11 h-11 rounded-full overflow-hidden bg-[#1E1E2E]/10 border border-[#1E1E2E]/15 hover:bg-[#1E1E2E]/15 transition cursor-pointer ${
                userMenuOpen ? "ring-2 ring-[#5946D6] ring-offset-2 ring-offset-[#FAEEDB]" : ""
              }`}
            >
              {userAvatarUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={userAvatarUrl} alt="" className="w-full h-full object-cover" />
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#1E1E2E]/10 shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#1E1E2E]/8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FAEEDB] shrink-0 ring-1 ring-[#1E1E2E]/8">
                    {userAvatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={userAvatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1E1E2E]/10" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#1E1E2E] truncate">
                      {userDisplayName || "Welcome 👋"}
                    </p>
                    <p className="text-xs text-[#6B6354] truncate">
                      {user?.email || "Loading…"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setProfileOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1E1E2E] hover:bg-[#FAEEDB] transition"
                >
                  <GearIcon className="w-4 h-4" />
                  Profile &amp; settings
                </button>
                <div className="border-t border-[#1E1E2E]/8" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#E16D5A] hover:bg-[#E16D5A]/10 transition"
                >
                  <LogoutIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
          )}
        </header>

        {/* Events bar — rich cards for each gift situation */}
        {!trial && events.length >= 1 && (
          <div className="px-6 lg:px-12 pb-4">
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {events.map((evt) => {
                const isActive = evt.id === activeEventId;
                const gradient = getEventGradient(evt.id);
                const style = getStatusStyle(evt.status);
                const dateText = formatEventDate(evt.event_date);
                const daysLeftText = getDaysLeft(evt.event_date);
                const progress = Math.max(0, Math.min(100, evt.progress ?? 0));
                return (
                  <div
                    key={evt.id}
                    onClick={() => selectEvent(evt.id)}
                    className={`shrink-0 w-[260px] rounded-2xl border-2 overflow-hidden cursor-pointer transition bg-white ${
                      isActive
                        ? "border-[#5946D6] shadow-lg"
                        : "border-[#1E1E2E]/8 hover:border-[#1E1E2E]/30 hover:shadow-md"
                    }`}
                  >
                    {/* Image area — draggable to reposition when an image is set */}
                    <div
                      className={`relative h-24 overflow-hidden ${
                        evt.image_url ? "cursor-ns-resize" : ""
                      }`}
                      onMouseDown={(e) => startImageDrag(evt, e)}
                      onTouchStart={(e) => startImageDrag(evt, e)}
                    >
                      {evt.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={evt.image_url}
                          alt=""
                          draggable={false}
                          className="w-full h-full object-cover select-none"
                          style={{
                            objectPosition: `center ${
                              draggingImageId === evt.id
                                ? tempImagePosition
                                : evt.image_position_y ?? 50
                            }%`,
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                      )}

                      {/* Drag hint when image present */}
                      {evt.image_url && draggingImageId !== evt.id && (
                        <div className="absolute inset-x-0 bottom-0 px-3 py-1 bg-gradient-to-t from-black/40 to-transparent pointer-events-none flex justify-center">
                          <span className="text-[10px] text-white/90 font-medium">↕ drag to adjust</span>
                        </div>
                      )}

                      {/* Camera button — upload/change cover */}
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => triggerEventImageUpload(evt.id, e)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-[#1E1E2E] transition shadow-sm z-10"
                        aria-label="Change cover image"
                        title={evt.image_url ? "Change cover" : "Add cover image"}
                      >
                        <CameraIcon />
                      </button>

                      {/* Icon badge overlay */}
                      <div className="absolute -bottom-3 left-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-lg z-10">
                        {evt.icon || "🎁"}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-4 pt-5 pb-3">
                      {editingTitleId === evt.id ? (
                        <input
                          type="text"
                          autoFocus
                          value={titleDraft}
                          onChange={(e) => setTitleDraft(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={saveTitleEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTitleEdit();
                            if (e.key === "Escape") setEditingTitleId(null);
                          }}
                          placeholder="e.g. Mom's Birthday"
                          className="font-bold text-[15px] text-[#1E1E2E] w-full bg-[#FAEEDB]/60 rounded-lg px-2 py-0.5 mb-0.5 -ml-2 border border-[#5946D6] focus:outline-none focus:ring-2 focus:ring-[#5946D6]/30"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => startEditTitle(evt, e)}
                          className="group font-bold text-[15px] text-[#1E1E2E] truncate mb-0.5 text-left w-full flex items-center gap-1.5 hover:text-[#5946D6] transition"
                          title="Click to rename"
                        >
                          <span className="truncate">{evt.title || "Untitled event"}</span>
                          <svg className="w-3 h-3 opacity-0 group-hover:opacity-60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      )}
                      <p className="text-[11px] text-[#6B6354] truncate mb-3">
                        {dateText && daysLeftText
                          ? `${dateText} • ${daysLeftText}`
                          : evt.recipient_name
                          ? `For ${evt.recipient_name}`
                          : isActive
                          ? "Currently chatting"
                          : "Tap to resume"}
                      </p>

                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}
                        >
                          {style.label}
                        </span>
                        <span className="text-xs font-bold text-[#1E1E2E]">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1E1E2E]/8 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${style.bar} transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hidden file input shared by all event cards */}
            <input
              ref={eventFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleEventImageChange}
              className="hidden"
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 px-6 lg:px-12 pb-6 flex flex-col">
          {isWelcome ? (
            // ============ WELCOME DASHBOARD ============
            <>
              {/* Hero — robot + heading + subtitle */}
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <div className="relative inline-block mb-4">
                  {/* Floating decorations */}
                  <span className="absolute -left-12 top-4 text-2xl">💜</span>
                  <span className="absolute -right-14 top-8 text-3xl">✨</span>
                  <span className="absolute left-2 -top-2 text-xl">✨</span>
                  <span className="absolute right-2 bottom-12 text-xl">💖</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ROBOT_FULL}
                    alt="Dearly"
                    className="w-44 h-44 lg:w-52 lg:h-52 object-contain mx-auto"
                  />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1E1E2E] tracking-tight mb-2">
                  Let&apos;s create something meaningful ✨
                </h1>
                <p className="text-[#6B6354] text-base max-w-md mx-auto leading-relaxed">
                  Dearly helps you think through gifts, surprises, and moments that
                  truly feel personal.
                </p>
              </div>

              {/* Action cards — only for signed-in users (hidden in trial) */}
              {!trial && <ActionCards onCardClick={handleCardClick} />}

              {/* How it works */}
              <div className="mt-10">
                <HowItWorks />
              </div>
            </>
          ) : (
            // ============ ACTIVE CHAT ============
            <div className="max-w-3xl mx-auto w-full flex-1 space-y-5 overflow-y-auto pt-4 pb-2">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const isLastAssistant = !isUser && i === messages.length - 1;
                return (
                  <div key={i}>
                    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 ring-1 ring-[#1E1E2E]/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={AI_AVATAR} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[78%]`}>
                        <span className="text-[10px] text-[#6B6354]/60 mb-1 px-2">
                          {m.time}
                        </span>
                        <div
                          className={`rounded-2xl px-4 py-3 text-[15px] whitespace-pre-line leading-relaxed ${
                            isUser
                              ? "bg-[#5946D6] text-white rounded-br-sm shadow-sm"
                              : "bg-white text-[#1E1E2E] rounded-bl-sm shadow-sm border border-[#1E1E2E]/5"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                      {isUser && (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1E1E2E]/10 border border-[#1E1E2E]/15 shrink-0">
                          {userAvatarUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={userAvatarUrl} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      )}
                    </div>

                    {isLastAssistant && m.choices && m.choices.length > 0 && (
                      <div className="mt-3 ml-11 flex flex-wrap gap-2">
                        {m.choices.map((c, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChoiceClick(c)}
                            disabled={loading}
                            className="px-4 py-2 bg-white border-2 border-[#5946D6]/25 text-[#1E1E2E] rounded-full text-sm font-semibold hover:bg-[#5946D6]/5 hover:border-[#5946D6]/55 transition disabled:opacity-50 shadow-sm"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}

                    {!isUser && m.products && m.products.length > 0 && (
                      <div className="mt-3 ml-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {m.products.map((p, idx) => (
                          <a
                            key={idx}
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border border-[#1E1E2E]/10 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                          >
                            {p.image && (
                              <div className="aspect-square bg-[#F5E6DA]/40 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                              </div>
                            )}
                            <div className="p-3 flex flex-col flex-1">
                              <p className="text-[11px] uppercase tracking-widest font-bold text-[#5946D6] mb-1">{p.concept}</p>
                              <p className="text-sm font-medium text-[#1E1E2E] line-clamp-2 mb-2">{p.title}</p>
                              <div className="mt-auto flex items-center justify-between pt-2">
                                <span className="text-base font-bold text-[#1E1E2E]">{p.price}</span>
                                {p.source && (
                                  <span className="text-xs text-[#6B6354] truncate ml-2">{p.source}</span>
                                )}
                              </div>
                              <button className="mt-2 w-full bg-[#5946D6] hover:bg-[#4838C4] text-white text-sm font-semibold py-2 rounded-full transition">
                                View product →
                              </button>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 ring-1 ring-[#1E1E2E]/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={AI_AVATAR} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-[#1E1E2E]/5 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E2E]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E2E]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E2E]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat input — sticky at bottom */}
        <div className="px-6 lg:px-12 pb-6">
          <div className="max-w-5xl mx-auto bg-white rounded-full border border-[#1E1E2E]/8 shadow-sm px-5 py-2 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isWelcome ? "Hey 🎁 Who's the gift for?" : "Message Dearly…"}
              disabled={loading}
              className="flex-1 bg-transparent text-[#1E1E2E] placeholder:text-[#6B6354]/55 focus:outline-none disabled:opacity-50 py-2"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="rounded-full bg-[#5946D6] hover:bg-[#4838C4] text-white w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
              aria-label="Send"
            >
              {loading ? <span className="text-sm">…</span> : <SendIcon />}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Trial paywall — mandatory after first recommendation in trial mode */}
      <TrialPaywall open={paywallOpen} />

      {/* Profile modal — opens from the avatar dropdown's "Profile & settings" item */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onSaved={(metadata) => {
          // Optimistically update local state so the avatar/name appear instantly
          setUser((prev) =>
            prev ? { ...prev, user_metadata: { ...prev.user_metadata, ...metadata } } : prev
          );
        }}
      />
    </main>
  );
}

// Suspense wrapper required for useSearchParams in the App Router
export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FAEEDB]" />}>
      <HomeContent />
    </Suspense>
  );
}
