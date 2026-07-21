"use client";

import { useState } from "react";
import { Rocket, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import ToolbarButton from "./ToolbarButton";

interface Props {
  username: string;
}

export default function DeployButton({ username }: Props) {
  const [open, setOpen] = useState(false);

  // Set NEXT_PUBLIC_DEPLOYMENT_URL in .env when deployed (e.g. on Vercel)
  const deploymentUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;

  function handleClick() {
    if (deploymentUrl) {
      window.open(`${deploymentUrl}/portfolio/${username}`, "_blank");
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <ToolbarButton
        icon={<Rocket size={18} />}
        label="Deploy"
        onClick={handleClick}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Deploy your portfolio
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Your portfolio is live on this site at{" "}
                <span className="font-mono text-slate-900">
                  /portfolio/{username}
                </span>
                . To serve it from your own deployment, deploy this app to
                Vercel and set{" "}
                <span className="font-mono">NEXT_PUBLIC_DEPLOYMENT_URL</span>.
              </p>

              <p className="mt-3 text-sm text-slate-500">
                Custom domain support is coming soon.
              </p>

              <button
                onClick={() => setOpen(false)}
                className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
