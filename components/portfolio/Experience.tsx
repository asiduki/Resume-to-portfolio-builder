import { IExperience } from "@/models/Portfolio/portfolio.types";

export default function Experience({
  experience,
}: {
  experience: IExperience[];
}) {
  if (experience.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">
        Experience
      </h2>

      {experience.map((exp, index) => (
        <div
          key={index}
          className="border-l-2 border-blue-500 pl-6 mb-10"
        >
          <h3 className="text-xl font-semibold">
            {exp.position}
          </h3>

          <p className="text-blue-400">
            {exp.company}
          </p>

          <p className="text-slate-400">
            {exp.duration}
          </p>

          <p className="mt-4">
            {exp.description}
          </p>
        </div>
      ))}
    </section>
  );
}
