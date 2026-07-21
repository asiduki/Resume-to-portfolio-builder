"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  AtSign,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Globe,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  User,
  X,
} from "lucide-react";

import { useUsernameCheck } from "@/components/dashboard/useUsernameCheck";

interface ProfileUser {
  name: string;
  username: string | null;
  email: string;
  image: string;
  createdAt: string;
}

interface PortfolioSummary {
  username: string;
  published: boolean;
  updatedAt: string;
  template: string;
  profileImage: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { status: usernameStatus, message: usernameMessage } = useUsernameCheck(
    username,
    user?.username ?? undefined
  );

  const emailChanged = !!user && email.trim().toLowerCase() !== user.email;

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      setLoadError(null);

      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(data.message || "Failed to load your profile.");
        return;
      }

      applyProfile(data);
    } catch (err) {
      console.error(err);
      setLoadError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function applyProfile(data: {
    user: ProfileUser;
    portfolio: PortfolioSummary | null;
  }) {
    setUser(data.user);
    setPortfolio(data.portfolio);

    setName(data.user.name);
    setUsername(data.user.username || "");
    setEmail(data.user.email);
    setCurrentPassword("");
  }

  async function handleSave() {
    if (!user) return;

    setSaveError(null);
    setSaveSuccess(null);

    const payload: Record<string, string> = {};

    if (name.trim() !== user.name) payload.name = name.trim();

    const newUsername = username.trim().toLowerCase();
    const usernameChanged = newUsername !== (user.username || "");

    if (usernameChanged) {
      if (usernameStatus !== "available") {
        setSaveError("Please choose an available username.");
        return;
      }
      payload.username = newUsername;
    }

    if (emailChanged) {
      if (!currentPassword) {
        setSaveError("Enter your current password to change your email.");
        return;
      }
      payload.email = email.trim().toLowerCase();
      payload.currentPassword = currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      setSaveSuccess("Nothing to save — no changes made.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSaveError(data.message || "Failed to save changes.");
        return;
      }

      applyProfile(data);

      setSaveSuccess(
        usernameChanged
          ? `Profile updated. Your portfolio now lives at /portfolio/${newUsername}`
          : "Profile updated."
      );
    } catch (err) {
      console.error(err);
      setSaveError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setAvatarError("Must be an image under 2MB.");
      return;
    }

    try {
      setUploadingAvatar(true);
      setAvatarError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setAvatarError(
          data.message || data.error || "Image upload failed. Try again later."
        );
        return;
      }

      setUser((u) => (u ? { ...u, image: data.image } : u));
    } catch (err) {
      console.error(err);
      setAvatarError("Image upload failed. Try again later.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (loadError || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />

        <p className="text-lg text-slate-700">{loadError}</p>

        <button
          onClick={fetchProfile}
          className="flex items-center gap-2 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">Profile</h1>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative shrink-0">
            <Image
              src={user.image || "/avatar.png"}
              alt="Profile photo"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border border-slate-200 object-cover"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Camera size={15} />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarSelect}
            />
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <p className="text-lg font-semibold text-slate-900">{user.name}</p>

            {user.username && (
              <p className="text-slate-500">@{user.username}</p>
            )}

            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-400 sm:justify-start">
              <Calendar size={14} />
              Joined {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {avatarError && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
            <X size={14} />
            {avatarError}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
          {portfolio ? (
            <>
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  portfolio.published
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    portfolio.published ? "bg-green-500" : "bg-amber-500"
                  }`}
                />
                {portfolio.published ? "Published" : "Draft"}
              </span>

              <Link
                href={`/portfolio/${portfolio.username}`}
                target="_blank"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                <Globe size={14} />
                /portfolio/{portfolio.username}
              </Link>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No portfolio yet —{" "}
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                upload your resume
              </Link>{" "}
              to create one.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-slate-900">Account Details</h2>

        {saveError && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 size={16} className="shrink-0" />
            {saveSuccess}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
              <User size={16} />
              Full Name
            </label>

            <input
              type="text"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
              <AtSign size={16} />
              Username
            </label>

            <input
              type="text"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
              }
              autoComplete="username"
            />

            {username && username !== (user.username || "") && usernameMessage && (
              <p
                className={`mt-2 flex items-center gap-1.5 text-sm ${
                  usernameStatus === "available"
                    ? "text-green-600"
                    : usernameStatus === "checking"
                    ? "text-slate-500"
                    : "text-red-600"
                }`}
              >
                {usernameStatus === "available" ? (
                  <Check size={14} />
                ) : usernameStatus === "checking" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <X size={14} />
                )}
                {usernameMessage}
              </p>
            )}

            <p className="mt-1 text-xs text-slate-400">
              Changing this also changes your portfolio URL.
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
              <Mail size={16} />
              Email
            </label>

            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {emailChanged && (
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
                <Lock size={16} />
                Current Password
              </label>

              <input
                type="password"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Required to change your email"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />

              <p className="mt-1 text-xs text-slate-400">
                For your security, confirm your password to change your email.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
