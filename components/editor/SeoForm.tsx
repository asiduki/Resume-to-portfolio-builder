"use client";

import { ISEO } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import { SectionCard, TextField, TextAreaField, TagsField } from "./fields";

export default function SeoForm({
  value,
  onChange,
  errors,
}: SectionFormProps<ISEO>) {
  return (
    <SectionCard
      title="SEO"
      description="Controls how your portfolio appears in search results and link previews."
    >
      <div className="space-y-5">
        <TextField
          label="SEO Title"
          value={value.title}
          onChange={(v) => onChange({ ...value, title: v })}
          error={errors["seo.title"]}
          placeholder="Jane Doe — Full Stack Developer"
        />

        <TextAreaField
          label="SEO Description"
          rows={3}
          maxLength={160}
          value={value.description}
          onChange={(v) => onChange({ ...value, description: v })}
          error={errors["seo.description"]}
          placeholder="Portfolio of Jane Doe, a full stack developer specializing in Next.js and MongoDB."
          hint="Shown under your page title in Google. Keep it under 160 characters."
        />

        <TagsField
          label="Keywords"
          value={value.keywords}
          onChange={(v) => onChange({ ...value, keywords: v })}
          placeholder="full stack developer, react, next.js"
        />
      </div>
    </SectionCard>
  );
}
