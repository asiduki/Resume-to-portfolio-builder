"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { Camera, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImg, setSelectedImg] = useState("/avatar.png");

  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    setSelectedFile(file);
    setSelectedImg(URL.createObjectURL(file));
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
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
        alert(data.message || data.error || "Registration failed");
        return;
      }

      alert("Registration Successful");

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-5">
      <div className="w-full max-w-md rounded-xl border bg-base-200 p-8 shadow-lg">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Register to continue
          </p>
        </div>

        {/* Avatar */}

        <div className="flex flex-col items-center mb-8">

          <div className="relative">

            <Image
              src={selectedImg}
              alt="Profile"
              width={130}
              height={130}
              className="rounded-full object-cover border"
            />

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-black p-2"
            >
              <Camera
                size={18}
                className="text-white"
              />

              <input
                id="avatar-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>

          </div>

          <p className="mt-3 text-sm text-gray-500">
            Upload Profile Picture (Optional)
          </p>

        </div>

        {/* Name */}

        <div className="mb-4">

          <label className="mb-2 flex items-center gap-2 text-sm">
            <User size={16} />
            Full Name
          </label>

          <input
            type="text"
            className="w-full rounded-lg border p-3 outline-none"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

        </div>

        {/* Email */}

        <div className="mb-4">

          <label className="mb-2 flex items-center gap-2 text-sm">
            <Mail size={16} />
            Email
          </label>

          <input
            type="email"
            className="w-full rounded-lg border p-3 outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </div>

        {/* Password */}

        <div className="mb-6">

          <label className="mb-2 flex items-center gap-2 text-sm">
            <Lock size={16} />
            Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border p-3 outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full rounded-lg bg-black py-3 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

      </div>
    </div>
  );
}