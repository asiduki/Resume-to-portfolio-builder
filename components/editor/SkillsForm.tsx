"use client";

import { ISkills } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import { SectionCard, TagsField } from "./fields";

const SKILL_GROUPS: { label: string; key: keyof ISkills; placeholder: string }[] =
  [
    { label: "Languages", key: "languages", placeholder: "JavaScript, TypeScript, Python" },
    { label: "Frontend", key: "frontend", placeholder: "React, Next.js, Tailwind CSS" },
    { label: "Backend", key: "backend", placeholder: "Node.js, Express" },
    { label: "Database", key: "database", placeholder: "MongoDB, PostgreSQL" },
    { label: "Frameworks", key: "frameworks", placeholder: "Next.js, NestJS" },
    { label: "Tools", key: "tools", placeholder: "Git, Docker, Postman" },
    { label: "Cloud", key: "cloud", placeholder: "AWS, Vercel" },
    { label: "Other", key: "other", placeholder: "GraphQL, WebSockets" },
  ];

export default function SkillsForm({
  value,
  onChange,
}: SectionFormProps<ISkills>) {
  return (
    <SectionCard
      title="Skills"
      description="Separate each skill with a comma. Empty categories are hidden on your portfolio."
    >
      <div className="grid md:grid-cols-2 gap-5">
        {SKILL_GROUPS.map(({ label, key, placeholder }) => (
          <TagsField
            key={key}
            label={label}
            value={value[key]}
            onChange={(v) => onChange({ ...value, [key]: v })}
            placeholder={placeholder}
          />
        ))}
      </div>
    </SectionCard>
  );
}
