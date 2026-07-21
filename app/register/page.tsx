"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AtSign,
  Camera,
  Check,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  X,
} from "lucide-react";

import AuthPanel from "@/components/auth/AuthPanel";
import { useUsernameCheck } from "@/components/dashboard/useUsernameCheck";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImg, setSelectedImg] = useState("/avatar.png");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { status: usernameStatus, message: usernameMessage } =
    useUsernameCheck(username);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setSelectedImg(URL.createObjectURL(file));
  };

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }

    if (usernameStatus !== "available") {
      setError("Please choose an available username.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPanel>
      <div className="mb-6">
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-slate-900">
            Portfolio Studio
          </span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">Create account</h1>

        <p className="mt-2 text-slate-500">
          A few details and your portfolio is minutes away.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div className="relative shrink-0">
          <Image
            src={selectedImg}
            alt="Profile"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full border border-slate-200 object-cover"
          />

          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-blue-600 p-1.5 transition hover:bg-blue-700"
          >
            <Camera size={14} className="text-white" />

            <input
              id="avatar-upload"
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
        </div>

        <div className="text-sm text-slate-500">
          <p className="font-medium text-slate-700">Profile picture</p>
          <p>Optional — JPG or PNG, max 2MB</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <User size={15} />
            Full Name
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <AtSign size={15} />
            Username
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="your-username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
            }
            autoComplete="username"
          />

          {username && usernameMessage && (
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
            Your portfolio will live at /portfolio/{username || "username"}
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail size={15} />
            Email
          </label>

          <input
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Lock size={15} />
            Password
          </label>

          <input
            type="password"
            className={inputClass}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Lock size={15} />
            Confirm Password
          </label>

          <input
            type="password"
            className={
              passwordsMismatch
                ? "w-full rounded-lg border border-red-300 bg-white p-3 text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
                : inputClass
            }
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {passwordsMismatch && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
              <X size={14} />
              Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            usernameStatus === "checking" ||
            usernameStatus === "taken" ||
            usernameStatus === "invalid" ||
            passwordsMismatch
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthPanel>
  );
}
