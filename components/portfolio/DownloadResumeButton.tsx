"use client";

import { FileDown } from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
  showToast: (message: string) => void;
}

// ATS Resume PDF generation ships with the Resume Generator feature.
// Until then this button explains itself instead of silently failing.
export default function DownloadResumeButton({ showToast }: Props) {
  return (
    <ToolbarButton
      icon={<FileDown size={18} />}
      label="Download Resume"
      onClick={() => showToast("Resume PDF generator is coming soon!")}
    />
  );
}
