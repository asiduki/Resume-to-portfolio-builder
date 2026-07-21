"use client";

import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

import ToolbarButton from "./ToolbarButton";

export default function AnalyticsButton() {
  const router = useRouter();

  return (
    <ToolbarButton
      icon={<BarChart3 size={18} />}
      label="Analytics"
      onClick={() => router.push("/dashboard/analytics")}
    />
  );
}
