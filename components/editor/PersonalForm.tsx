"use client";

import { IPersonal } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import { SectionCard, TextField } from "./fields";
import ImageUploader from "./ImageUploader";

export default function PersonalForm({
  value,
  onChange,
  errors,
}: SectionFormProps<IPersonal>) {
  function set<K extends keyof IPersonal>(key: K, val: IPersonal[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <SectionCard
      title="Personal Information"
      description="Basic details shown in your portfolio hero section."
    >
      <div className="mb-6">
        <ImageUploader
          label="Profile Image"
          aspect="square"
          value={value.profileImage}
          onChange={(v) => set("profileImage", v)}
          hint="Shown in your portfolio hero. Square images work best."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <TextField
          label="Name"
          required
          value={value.name}
          onChange={(v) => set("name", v)}
          error={errors["personal.name"]}
          placeholder="Jane Doe"
        />

        <TextField
          label="Title"
          required
          value={value.title}
          onChange={(v) => set("title", v)}
          error={errors["personal.title"]}
          placeholder="Full Stack Developer"
        />

        <TextField
          label="Email"
          type="email"
          value={value.email}
          onChange={(v) => set("email", v)}
          error={errors["personal.email"]}
          placeholder="jane@example.com"
        />

        <TextField
          label="Phone"
          type="tel"
          value={value.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+91 98765 43210"
        />

        <TextField
          label="Location"
          value={value.location}
          onChange={(v) => set("location", v)}
          placeholder="Mumbai, India"
        />

        <TextField
          label="Website"
          type="url"
          value={value.website}
          onChange={(v) => set("website", v)}
          error={errors["personal.website"]}
          placeholder="https://janedoe.dev"
        />
      </div>

      <div className="mt-5">
        <TextField
          label="Tagline"
          value={value.tagline}
          onChange={(v) => set("tagline", v)}
          placeholder="Building delightful web experiences"
        />
      </div>
    </SectionCard>
  );
}
