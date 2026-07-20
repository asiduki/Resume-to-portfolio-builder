"use client";

import { ISocial } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import { SectionCard, TextField } from "./fields";

const SOCIAL_LINKS: { label: string; key: keyof ISocial; placeholder: string }[] =
  [
    { label: "GitHub", key: "github", placeholder: "https://github.com/username" },
    { label: "LinkedIn", key: "linkedin", placeholder: "https://linkedin.com/in/username" },
    { label: "Twitter / X", key: "twitter", placeholder: "https://x.com/username" },
    { label: "LeetCode", key: "leetcode", placeholder: "https://leetcode.com/username" },
    { label: "Codeforces", key: "codeforces", placeholder: "https://codeforces.com/profile/username" },
    { label: "CodeChef", key: "codechef", placeholder: "https://codechef.com/users/username" },
    { label: "HackerRank", key: "hackerrank", placeholder: "https://hackerrank.com/username" },
  ];

export default function SocialForm({
  value,
  onChange,
  errors,
}: SectionFormProps<ISocial>) {
  return (
    <SectionCard
      title="Social Links"
      description="Full profile URLs. Empty links are hidden on your portfolio."
    >
      <div className="grid md:grid-cols-2 gap-5">
        {SOCIAL_LINKS.map(({ label, key, placeholder }) => (
          <TextField
            key={key}
            label={label}
            type="url"
            value={value[key]}
            onChange={(v) => onChange({ ...value, [key]: v })}
            error={errors[`social.${key}`]}
            placeholder={placeholder}
          />
        ))}
      </div>
    </SectionCard>
  );
}
