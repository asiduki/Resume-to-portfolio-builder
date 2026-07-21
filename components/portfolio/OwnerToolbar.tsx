"use client";

import { useCallback, useRef, useState } from "react";
import {
  ChevronDown,
  Eye,
  LayoutTemplate,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
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

/** Labeled row inside the expanded panel. */
function ToolbarGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}

export default function OwnerToolbar({
  username,
  name,
  published,
  profileImage,
}: Props) {
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }, []);

  return (
    <>
      
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="fixed bottom-3 left-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2
          md:bottom-auto md:left-auto md:right-6 md:top-6 md:w-auto md:max-w-none md:translate-x-0"
      >
        <div className="rounded-2xl border border-white/40 bg-white/70 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          
          <div className="flex items-center gap-1 p-2">
           
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
              icon={<Eye size={18} />}
              label="Preview"
              onClick={() => router.push("/dashboard/preview")}
            />

            <PublishButton published={published} showToast={showToast} />
            <ShareButton username={username} name={name} showToast={showToast} />

            <div className="h-6 w-px shrink-0 bg-slate-900/10" />

            <ToolbarButton
              icon={
                expanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <MoreHorizontal size={18} />
                )
              }
              label={expanded ? "Less" : "More actions"}
              onClick={() => setExpanded((v) => !v)}
            />
          </div>

        
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 border-t border-slate-900/10 p-3">
                  <ToolbarGroup label="Share">
                    <CopyButton username={username} showToast={showToast} />
                    <DeployButton username={username} />
                  </ToolbarGroup>

                  <ToolbarGroup label="Customize">
                    <ToolbarButton
                      icon={<LayoutTemplate size={18} />}
                      label="Change Template"
                      onClick={() => router.push("/dashboard/templates")}
                    />
                    <ThemeButton />
                    <ProfileImageButton
                      profileImage={profileImage}
                      showToast={showToast}
                    />
                  </ToolbarGroup>

                  <ToolbarGroup label="Manage">
                    <DownloadResumeButton showToast={showToast} />
                    <AnalyticsButton />
                    <DeletePortfolioButton showToast={showToast} />
                  </ToolbarGroup>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

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
