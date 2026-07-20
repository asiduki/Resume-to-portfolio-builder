"use client";

import { IEducation } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import {
  SectionCard,
  TextField,
  AddItemButton,
  ItemCard,
  moveItem,
} from "./fields";

const EMPTY_EDUCATION: IEducation = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  duration: "",
  grade: "",
};

export default function EducationForm({
  value,
  onChange,
  errors,
}: SectionFormProps<IEducation[]>) {
  function updateItem(index: number, patch: Partial<IEducation>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <SectionCard title="Education" description="Degrees, diplomas, and schooling.">
      <div className="space-y-6">
        {value.map((edu, index) => (
          <ItemCard
            key={index}
            title={edu.degree || `Education ${index + 1}`}
            onRemove={() => removeItem(index)}
            onMoveUp={() => onChange(moveItem(value, index, index - 1))}
            onMoveDown={() => onChange(moveItem(value, index, index + 1))}
            isFirst={index === 0}
            isLast={index === value.length - 1}
          >
            <div className="grid md:grid-cols-2 gap-5">
              <TextField
                label="Degree"
                required
                value={edu.degree}
                onChange={(v) => updateItem(index, { degree: v })}
                error={errors[`education.${index}.degree`]}
                placeholder="B.Tech"
              />

              <TextField
                label="Institution"
                required
                value={edu.institution}
                onChange={(v) => updateItem(index, { institution: v })}
                error={errors[`education.${index}.institution`]}
                placeholder="IIT Bombay"
              />

              <TextField
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(v) => updateItem(index, { fieldOfStudy: v })}
                placeholder="Computer Science"
              />

              <TextField
                label="Duration"
                value={edu.duration}
                onChange={(v) => updateItem(index, { duration: v })}
                placeholder="2021 – 2025"
              />

              <TextField
                label="Grade"
                value={edu.grade}
                onChange={(v) => updateItem(index, { grade: v })}
                placeholder="8.5 CGPA"
              />
            </div>
          </ItemCard>
        ))}

        <AddItemButton
          label="Add Education"
          onClick={() => onChange([...value, { ...EMPTY_EDUCATION }])}
        />
      </div>
    </SectionCard>
  );
}
