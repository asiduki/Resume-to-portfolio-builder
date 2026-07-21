"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
  username: string;
  showToast: (message: string) => void;
}

export default function CopyButton({ username, showToast }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      const url = `${window.location.origin}/portfolio/${username}`;
      await navigator.clipboard.writeText(url);

      setCopied(true);
      showToast("Portfolio link copied!");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy link");
    }
  }

  return (
    <ToolbarButton
      icon={
        copied ? (
          <Check size={18} className="text-green-500" />
        ) : (
          <Link2 size={18} />
        )
      }
      label="Copy Link"
      onClick={copyLink}
    />
  );
}
