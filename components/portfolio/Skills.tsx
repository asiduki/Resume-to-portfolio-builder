import { ISkills } from "@/models/Portfolio/portfolio.types";

const SKILL_GROUPS: { title: string; key: keyof ISkills }[] = [
  { title: "Languages", key: "languages" },
  { title: "Frontend", key: "frontend" },
  { title: "Backend", key: "backend" },
  { title: "Database", key: "database" },
  { title: "Frameworks", key: "frameworks" },
  { title: "Tools", key: "tools" },
  { title: "Cloud", key: "cloud" },
  { title: "Other", key: "other" },
];

export default function Skills({ skills }: { skills: ISkills }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">
        Skills
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {SKILL_GROUPS.map(({ title, key }) => (
          <SkillCard
            key={key}
            title={title}
            skills={skills[key]}
          />
        ))}
      </div>
    </section>
  );
}

function SkillCard({
  title,
  skills,
}: {
  title: string;
  skills: string[];
}) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <h3 className="text-xl font-semibold mb-4">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-slate-800 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
