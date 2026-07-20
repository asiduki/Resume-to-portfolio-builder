"use client";

import { ICertification } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import {
  SectionCard,
  TextField,
  AddItemButton,
  ItemCard,
  moveItem,
} from "./fields";

const EMPTY_CERTIFICATION: ICertification = {
  name: "",
  issuer: "",
  year: "",
  credentialUrl: "",
};

export default function CertificationForm({
  value,
  onChange,
  errors,
}: SectionFormProps<ICertification[]>) {
  function updateItem(index: number, patch: Partial<ICertification>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <SectionCard
      title="Certifications"
      description="Courses and credentials you have earned."
    >
      <div className="space-y-6">
        {value.map((cert, index) => (
          <ItemCard
            key={index}
            title={cert.name || `Certification ${index + 1}`}
            onRemove={() => removeItem(index)}
            onMoveUp={() => onChange(moveItem(value, index, index - 1))}
            onMoveDown={() => onChange(moveItem(value, index, index + 1))}
            isFirst={index === 0}
            isLast={index === value.length - 1}
          >
            <div className="grid md:grid-cols-2 gap-5">
              <TextField
                label="Name"
                required
                value={cert.name}
                onChange={(v) => updateItem(index, { name: v })}
                error={errors[`certifications.${index}.name`]}
                placeholder="AWS Certified Developer"
              />

              <TextField
                label="Issuer"
                value={cert.issuer}
                onChange={(v) => updateItem(index, { issuer: v })}
                placeholder="Amazon Web Services"
              />

              <TextField
                label="Year"
                value={cert.year}
                onChange={(v) => updateItem(index, { year: v })}
                placeholder="2025"
              />

              <TextField
                label="Credential URL"
                type="url"
                value={cert.credentialUrl}
                onChange={(v) => updateItem(index, { credentialUrl: v })}
                error={errors[`certifications.${index}.credentialUrl`]}
                placeholder="https://credential.example.com/abc"
              />
            </div>
          </ItemCard>
        ))}

        <AddItemButton
          label="Add Certification"
          onClick={() => onChange([...value, { ...EMPTY_CERTIFICATION }])}
        />
      </div>
    </SectionCard>
  );
}
