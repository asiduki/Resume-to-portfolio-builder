"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import ToolbarButton from "./ToolbarButton";

interface Props {
  showToast: (message: string) => void;
}

export default function DeletePortfolioButton({ showToast }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);

      const res = await fetch("/api/portfolio", { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed to delete portfolio");
        setDeleting(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      showToast("Failed to delete portfolio");
      setDeleting(false);
    }
  }

  return (
    <>
      <ToolbarButton
        icon={<Trash2 size={18} />}
        label="Delete Portfolio"
        onClick={() => setOpen(true)}
        danger
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6"
            onClick={() => !deleting && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Delete Portfolio?
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  disabled={deleting}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                This permanently deletes your portfolio, including all projects,
                experience, and settings. This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
