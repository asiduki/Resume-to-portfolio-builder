"use client";

import { useCallback, useRef, useState } from "react";
import { Eye, LayoutTemplate, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import ToolbarButton from "./ToolbarButton";
import PublishButton from "./PublishButton";
import CopyButton from "./CopyButton";
import ShareButton from "./ShareButton";
import DeployButton from "./DeployButton";
import DownloadResumeButton from "./DownloadResumeButton";
import AnalyticsButton from "./AnalyticsButton";
import ThemeButton from "./ThemeButton";
import ProfileImageButton from "./ProfileImageButton";
import DeletePortfolioButton from "./DeletePortfolioButton";

interface Props {
  username: string;
  name: string;
  published: boolean;
  profileImage?: string;
}

export default function OwnerToolbar({
  username,
  name,
  published,
  profileImage,
}: Props) {
  const router = useRouter();

  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }, []);

  return (
    <>
      {/* Floating toolbar — top right on desktop, bottom dock on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:bottom-auto md:right-6 md:top-6"
      >
        <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/40 bg-white/70 p-2 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          {/* Status badge */}
          <span
            className={`mr-1 flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
              ${
                published
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-slate-600"
              }
            `}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                published ? "bg-green-500" : "bg-slate-400"
              }`}
            />
            {published ? "Published" : "Draft"}
          </span>

          <div className="h-6 w-px shrink-0 bg-slate-900/10" />

          <ToolbarButton
            icon={<Pencil size={18} />}
            label="Edit Portfolio"
            onClick={() => router.push("/dashboard/edit")}
          />
          <ToolbarButton
            icon={<LayoutTemplate size={18} />}
            label="Change Template"
            onClick={() => router.push("/dashboard/templates")}
          />
          <ToolbarButton
            icon={<Eye size={18} />}
            label="Preview"
            onClick={() => router.push("/dashboard/preview")}
          />

          <div className="h-6 w-px shrink-0 bg-slate-900/10" />

          <PublishButton published={published} showToast={showToast} />
          <CopyButton username={username} showToast={showToast} />
          <ShareButton username={username} name={name} showToast={showToast} />
          <DeployButton username={username} />

          <div className="h-6 w-px shrink-0 bg-slate-900/10" />

          <ProfileImageButton
            profileImage={profileImage}
            showToast={showToast}
          />
          <DownloadResumeButton showToast={showToast} />
          <AnalyticsButton />
          <ThemeButton />

          <div className="h-6 w-px shrink-0 bg-slate-900/10" />

          <DeletePortfolioButton showToast={showToast} />
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl md:bottom-8"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
