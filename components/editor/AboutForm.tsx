"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { IPersonal } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import { SectionCard, TextAreaField } from "./fields";

export default function AboutForm({
  value,
  onChange,
  errors,
}: SectionFormProps<IPersonal>) {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function generateAbout() {
    try {
      setGenerating(true);
      setAiError(null);

      const res = await fetch("/api/ai/generate-about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a first-person "About Me" section (120-160 words) for a developer portfolio. Name: ${value.name}. Title: ${value.title}. Current about: ${value.about || "none"}. Return only the paragraph, no headings or quotes.`,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();

      if (!data.about) {
        throw new Error("Empty response from AI");
      }

      onChange({ ...value, about: data.about.trim() });
    } catch (err) {
      console.error(err);
      setAiError("Could not generate the about section. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <SectionCard
      title="About"
      description="Tell visitors who you are and what you do."
    >
      <TextAreaField
        label="About Me"
        rows={8}
        value={value.about}
        onChange={(v) => onChange({ ...value, about: v })}
        error={errors["personal.about"]}
        placeholder="I am a full stack developer passionate about..."
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={generateAbout}
          disabled={generating}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60
            text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          {generating ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Improve with AI
            </>
          )}
        </button>

        {aiError && <p className="text-red-600 text-sm">{aiError}</p>}
      </div>
    </SectionCard>
  );
}
