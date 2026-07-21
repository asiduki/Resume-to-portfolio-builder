"use client";

import { Share2 } from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
  username: string;
  name: string;
  showToast: (message: string) => void;
}

export default function ShareButton({ username, name, showToast }: Props) {
  async function share() {
    const url = `${window.location.origin}/portfolio/${username}`;

    // Native Share API with copy-link fallback
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Portfolio`,
          text: `Check out ${name}'s portfolio`,
          url,
        });
      } catch {
        // User cancelled the share sheet — not an error
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast("Sharing not supported — link copied instead!");
    } catch {
      showToast("Failed to share");
    }
  }

  return (
    <ToolbarButton icon={<Share2 size={18} />} label="Share" onClick={share} />
  );
}
