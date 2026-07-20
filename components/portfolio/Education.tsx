import { IEducation } from "@/models/Portfolio/portfolio.types";

export default function Education({
  education,
}: {
  education: IEducation[];
}) {
  if (education.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">
        Education
      </h2>

      {education.map((edu, index) => (
        <div
          key={index}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold">
            {edu.degree}
          </h3>

          <p>{edu.institution}</p>

          <p className="text-slate-400">
            {edu.duration}
          </p>
        </div>
      ))}
    </section>
  );
}
