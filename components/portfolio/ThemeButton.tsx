"use client";

import { Palette } from "lucide-react";
import { useRouter } from "next/navigation";

import ToolbarButton from "./ToolbarButton";

export default function ThemeButton() {
  const router = useRouter();

  return (
    <ToolbarButton
      icon={<Palette size={18} />}
      label="Theme Settings"
      onClick={() => router.push("/dashboard/settings/theme")}
    />
  );
}
