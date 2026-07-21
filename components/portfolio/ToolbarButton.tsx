"use client";

import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export default function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition
        ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
        }
        disabled:cursor-not-allowed disabled:opacity-40
      `}
    >
      {icon}

      <span className="pointer-events-none absolute top-full mt-2 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 md:block">
        {label}
      </span>
    </button>
  );
}
