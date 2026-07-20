"use client";

import { IProject } from "@/models/Portfolio/portfolio.types";

import { SectionFormProps } from "./types";
import {
  SectionCard,
  TextField,
  TextAreaField,
  TagsField,
  AddItemButton,
  ItemCard,
  moveItem,
} from "./fields";

const EMPTY_PROJECT: IProject = {
  title: "",
  description: "",
  technologies: [],
  github: "",
  liveDemo: "",
  image: "",
  highlights: [],
};

export default function ProjectsForm({
  value,
  onChange,
  errors,
}: SectionFormProps<IProject[]>) {
  function updateItem(index: number, patch: Partial<IProject>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <SectionCard
      title="Projects"
      description="Showcase your best work. Order here is the order on your portfolio."
    >
      <div className="space-y-6">
        {value.map((project, index) => (
          <ItemCard
            key={index}
            title={project.title || `Project ${index + 1}`}
            onRemove={() => removeItem(index)}
            onMoveUp={() => onChange(moveItem(value, index, index - 1))}
            onMoveDown={() => onChange(moveItem(value, index, index + 1))}
            isFirst={index === 0}
            isLast={index === value.length - 1}
          >
            <div className="grid md:grid-cols-2 gap-5">
              <TextField
                label="Title"
                required
                value={project.title}
                onChange={(v) => updateItem(index, { title: v })}
                error={errors[`projects.${index}.title`]}
                placeholder="Portfolio Studio"
              />

              <TextField
                label="Image URL"
                type="url"
                value={project.image}
                onChange={(v) => updateItem(index, { image: v })}
                placeholder="https://..."
              />

              <TextField
                label="GitHub URL"
                type="url"
                value={project.github}
                onChange={(v) => updateItem(index, { github: v })}
                error={errors[`projects.${index}.github`]}
                placeholder="https://github.com/user/repo"
              />

              <TextField
                label="Live Demo URL"
                type="url"
                value={project.liveDemo}
                onChange={(v) => updateItem(index, { liveDemo: v })}
                error={errors[`projects.${index}.liveDemo`]}
                placeholder="https://myproject.vercel.app"
              />
            </div>

            <div className="mt-5 space-y-5">
              <TextAreaField
                label="Description"
                rows={3}
                value={project.description}
                onChange={(v) => updateItem(index, { description: v })}
                error={errors[`projects.${index}.description`]}
                placeholder="What does this project do, and what makes it interesting?"
              />

              <TagsField
                label="Technologies"
                value={project.technologies}
                onChange={(v) => updateItem(index, { technologies: v })}
                placeholder="Next.js, MongoDB, Tailwind CSS"
              />

              <TagsField
                label="Highlights"
                value={project.highlights}
                onChange={(v) => updateItem(index, { highlights: v })}
                placeholder="1k+ users, Featured on Product Hunt"
              />
            </div>
          </ItemCard>
        ))}

        <AddItemButton
          label="Add Project"
          onClick={() => onChange([...value, { ...EMPTY_PROJECT }])}
        />
      </div>
    </SectionCard>
  );
}
