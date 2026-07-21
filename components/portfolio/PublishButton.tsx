"use client";

import { useState } from "react";
import { Loader2, Globe, GlobeLock } from "lucide-react";
import { useRouter } from "next/navigation";

import ToolbarButton from "./ToolbarButton";

interface Props {
  published: boolean;
  showToast: (message: string) => void;
}

export default function PublishButton({ published, showToast }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePublish() {
    try {
      setLoading(true);

      // Reuse the existing publish API
      const res = await fetch("/api/portfolio/publish", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Something went wrong");
        return;
      }

      showToast(data.message);
      router.refresh();
    } catch {
      showToast("Failed to update publish status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolbarButton
      icon={
        loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : published ? (
          <GlobeLock size={18} />
        ) : (
          <Globe size={18} />
        )
      }
      label={published ? "Unpublish" : "Publish"}
      onClick={togglePublish}
      disabled={loading}
    />
  );
}
