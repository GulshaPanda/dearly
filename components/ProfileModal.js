"use client";

import { useState, useEffect } from "react";

// 8 preset avatars — variety of styles & brand-friendly backgrounds
export const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Aria&backgroundColor=F5E6DA",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Kai&backgroundColor=FAEEDB",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Luna&backgroundColor=FFE0CD",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Reo&backgroundColor=F8DDD6",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Bolt&backgroundColor=ECE3F8",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=FAEEDB",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Zara&backgroundColor=F5E6DA",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Echo&backgroundColor=FFE0CD",
];

export default function ProfileModal({ open, onClose, user, onSaved }) {
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Pre-fill from user metadata when modal opens
  useEffect(() => {
    if (!open || !user) return;
    setDisplayName(user.user_metadata?.display_name || "");
    setAvatarUrl(user.user_metadata?.avatar_url || PRESET_AVATARS[0]);
    setError("");
    setInfo("");
  }, [open, user]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
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

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("File too large — max 2 MB.");
      return;
    }
    setError("");
    setInfo("");
    setUploading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const ext = file.name.split(".").pop().toLowerCase();
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      setInfo("Uploaded! Click Save below to apply.");
    } catch (e) {
      setError(
        e.message.includes("bucket")
          ? "Upload failed — the 'avatars' bucket isn't set up in Supabase yet. Pick a preset for now."
          : `Upload failed: ${e.message}`
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: updateErr } = await supabase.auth.updateUser({
        data: { display_name: displayName, avatar_url: avatarUrl },
      });
      if (updateErr) throw updateErr;
      onSaved?.({ display_name: displayName, avatar_url: avatarUrl });
      onClose();
    } catch (e) {
      setError(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-[#1E1E2E]/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-[#1E1E2E]/8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1E1E2E]">
            <span
              className="italic text-[#4F46E5]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your
            </span>{" "}
            profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#1E1E2E]/8 flex items-center justify-center text-[#1E1E2E] transition"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 overflow-y-auto flex-1">
          {/* Avatar preview */}
          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#F5E6DA] shadow-md bg-[#FAEEDB]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Preset avatars */}
          <p className="text-xs font-bold text-[#1E1E2E] uppercase tracking-[0.15em] mb-3">
            Choose an avatar
          </p>
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            {PRESET_AVATARS.map((url, i) => {
              const selected = url === avatarUrl;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                    selected
                      ? "border-[#5946D6] ring-4 ring-[#5946D6]/20"
                      : "border-[#1E1E2E]/10 hover:border-[#1E1E2E]/30"
                  }`}
                  aria-label={`Avatar option ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>

          {/* Upload custom */}
          <p className="text-xs font-bold text-[#1E1E2E] uppercase tracking-[0.15em] mb-2">
            Or upload your own
          </p>
          <label
            htmlFor="avatar-upload"
            className="block w-full bg-[#FAEEDB]/60 border-2 border-dashed border-[#1E1E2E]/15 hover:border-[#5946D6]/40 hover:bg-[#FAEEDB] rounded-2xl px-5 py-4 text-center cursor-pointer transition mb-6"
          >
            <p className="text-sm text-[#1E1E2E] font-medium">
              {uploading ? "Uploading…" : "📷 Click to upload an image"}
            </p>
            <p className="text-xs text-[#6B6354] mt-0.5">PNG / JPG · max 2 MB</p>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />

          {/* Display name */}
          <label className="block text-xs font-bold text-[#1E1E2E] uppercase tracking-[0.15em] mb-2">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="What should we call you?"
            className="w-full bg-white rounded-full border border-[#1E1E2E]/12 px-5 py-3 text-sm text-[#1E1E2E] placeholder:text-[#6B6354]/50 focus:outline-none focus:border-[#E16D5A] focus:ring-4 focus:ring-[#E16D5A]/15 transition mb-4"
          />

          {/* Email (read-only) */}
          <label className="block text-xs font-bold text-[#1E1E2E] uppercase tracking-[0.15em] mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full bg-[#F5E6DA]/30 rounded-full border border-[#1E1E2E]/12 px-5 py-3 text-sm text-[#6B6354] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#6B6354]/70 mt-1.5 px-2">
            Email can&apos;t be changed yet — coming soon.
          </p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl px-4 py-2.5">
              ⚠ {error}
            </div>
          )}
          {info && !error && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-xs rounded-2xl px-4 py-2.5">
              ✓ {info}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-[#1E1E2E]/8 flex items-center gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-white border border-[#1E1E2E]/15 hover:border-[#1E1E2E]/35 text-[#1E1E2E] font-semibold rounded-full px-5 py-2.5 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 bg-[#5946D6] hover:bg-[#4838C4] text-white font-semibold rounded-full px-5 py-2.5 transition shadow-md shadow-[#5946D6]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
