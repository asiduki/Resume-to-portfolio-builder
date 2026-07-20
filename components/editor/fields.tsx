"use client";

import { ReactNode } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

/** Returns a new array with the item at `from` moved to `to`. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;

  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

// ============================
// Section wrapper
// ============================

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>

      {description && (
        <p className="text-slate-500 mt-1 text-sm">{description}</p>
      )}

      <div className="mt-6">{children}</div>
    </div>
  );
}

// ============================
// Text input
// ============================

export function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-400 bg-red-50" : "border-slate-300"}
        `}
      />

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// ============================
// Textarea
// ============================

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>

        {maxLength && (
          <span
            className={`text-xs ${
              (value?.length ?? 0) > maxLength
                ? "text-red-600"
                : "text-slate-400"
            }`}
          >
            {value?.length ?? 0}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 resize-y
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-400 bg-red-50" : "border-slate-300"}
        `}
      />

      {hint && !error && (
        <p className="text-slate-400 text-xs mt-1">{hint}</p>
      )}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// ============================
// Comma-separated list → string[]
// ============================

export function TagsField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        defaultValue={(value ?? []).join(", ")}
        onBlur={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        placeholder={placeholder ?? "Comma separated, e.g. React, Next.js"}
        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {value?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================
// List-section helpers (CRUD)
// ============================

export function AddItemButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm
        border border-dashed border-blue-300 hover:border-blue-500 rounded-lg px-4 py-2.5 w-full justify-center transition-colors"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}

export function ItemCard({
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  children,
}: {
  title: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-5 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-slate-900 truncate pr-4">{title}</h3>

        <div className="flex items-center gap-1 shrink-0">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              aria-label={`Move ${title} up`}
              className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
            >
              <ChevronUp size={18} />
            </button>
          )}

          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              aria-label={`Move ${title} down`}
              className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${title}`}
            className="text-slate-400 hover:text-red-600 p-1 ml-1 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
