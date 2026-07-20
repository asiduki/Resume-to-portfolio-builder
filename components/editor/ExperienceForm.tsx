"use client";

import { IExperience } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import {
  SectionCard,
  TextField,
  TextAreaField,
  AddItemButton,
  ItemCard,
  moveItem,
} from "./fields";

const EMPTY_EXPERIENCE: IExperience = {
  company: "",
  position: "",
  employmentType: "",
  location: "",
  duration: "",
  description: "",
};

export default function ExperienceForm({
  value,
  onChange,
  errors,
}: SectionFormProps<IExperience[]>) {
  function updateItem(index: number, patch: Partial<IExperience>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <SectionCard
      title="Experience"
      description="Your work history, most recent first."
    >
      <div className="space-y-6">
        {value.map((exp, index) => (
          <ItemCard
            key={index}
            title={
              exp.position
                ? `${exp.position}${exp.company ? ` @ ${exp.company}` : ""}`
                : `Experience ${index + 1}`
            }
            onRemove={() => removeItem(index)}
            onMoveUp={() => onChange(moveItem(value, index, index - 1))}
            onMoveDown={() => onChange(moveItem(value, index, index + 1))}
            isFirst={index === 0}
            isLast={index === value.length - 1}
          >
            <div className="grid md:grid-cols-2 gap-5">
              <TextField
                label="Position"
                required
                value={exp.position}
                onChange={(v) => updateItem(index, { position: v })}
                error={errors[`experience.${index}.position`]}
                placeholder="Software Engineer"
              />

              <TextField
                label="Company"
                required
                value={exp.company}
                onChange={(v) => updateItem(index, { company: v })}
                error={errors[`experience.${index}.company`]}
                placeholder="Acme Corp"
              />

              <TextField
                label="Employment Type"
                value={exp.employmentType}
                onChange={(v) => updateItem(index, { employmentType: v })}
                placeholder="Full-time / Internship / Freelance"
              />

              <TextField
                label="Location"
                value={exp.location}
                onChange={(v) => updateItem(index, { location: v })}
                placeholder="Remote / Bengaluru, India"
              />

              <TextField
                label="Duration"
                value={exp.duration}
                onChange={(v) => updateItem(index, { duration: v })}
                placeholder="Jan 2024 – Present"
              />
            </div>

            <div className="mt-5">
              <TextAreaField
                label="Description"
                rows={3}
                value={exp.description}
                onChange={(v) => updateItem(index, { description: v })}
                placeholder="What did you build, ship, or improve?"
              />
            </div>
          </ItemCard>
        ))}

        <AddItemButton
          label="Add Experience"
          onClick={() => onChange([...value, { ...EMPTY_EXPERIENCE }])}
        />
      </div>
    </SectionCard>
  );
}
