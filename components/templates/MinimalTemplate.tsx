import { TemplateProps, SKILL_GROUPS } from "./types";

export default function MinimalTemplate({ portfolio }: TemplateProps) {
  const { personal, skills, projects, experience, education, certifications, social } =
    portfolio;

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight">
          {personal.name}
        </h1>

        <h2 className="text-lg text-neutral-500 mt-2">
          {personal.title}
        </h2>

        {personal.about && (
          <p className="text-neutral-700 mt-8 leading-8">
            {personal.about}
          </p>
        )}
      </section>

      {/* Skills */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-t border-neutral-200">
        <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
          Skills
        </h2>

        <div className="space-y-3">
          {SKILL_GROUPS.map(({ title, key }) => {
            const items = skills[key];
            if (!items || items.length === 0) return null;

            return (
              <div key={key} className="flex gap-4">
                <span className="w-28 shrink-0 text-neutral-400 text-sm pt-0.5">
                  {title}
                </span>
                <span className="text-neutral-700">
                  {items.join(" · ")}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10 border-t border-neutral-200">
          <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
            Projects
          </h2>

          <div className="space-y-10">
            {projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-xl font-medium">
                  {project.title}
                </h3>

                <p className="mt-2 text-neutral-700 leading-7">
                  {project.description}
                </p>

                <p className="mt-2 text-sm text-neutral-400">
                  {project.technologies.join(" · ")}
                </p>

                <div className="flex gap-5 mt-3 text-sm">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      className="underline underline-offset-4"
                    >
                      GitHub
                    </a>
                  )}

                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      className="underline underline-offset-4"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10 border-t border-neutral-200">
          <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
            Experience
          </h2>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-lg font-medium">
                    {exp.position}
                  </h3>
                  <span className="text-sm text-neutral-400 shrink-0">
                    {exp.duration}
                  </span>
                </div>

                <p className="text-neutral-500">{exp.company}</p>

                <p className="mt-2 text-neutral-700 leading-7">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10 border-t border-neutral-200">
          <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
            Education
          </h2>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-lg font-medium">
                    {edu.degree}
                  </h3>
                  <span className="text-sm text-neutral-400 shrink-0">
                    {edu.duration}
                  </span>
                </div>

                <p className="text-neutral-500">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-10 border-t border-neutral-200">
          <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
            Certifications
          </h2>

          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <p key={index} className="text-neutral-700">
                {cert.name}{" "}
                <span className="text-neutral-400">
                  — {cert.issuer}, {cert.year}
                </span>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    className="underline underline-offset-4 ml-2 text-sm"
                  >
                    View
                  </a>
                )}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-neutral-200">
        <h2 className="text-sm uppercase tracking-widest text-neutral-400 mb-6">
          Contact
        </h2>

        <div className="space-y-2 text-neutral-700">
          {personal.email && (
            <a
              href={`mailto:${personal.email}`}
              className="underline underline-offset-4 block"
            >
              {personal.email}
            </a>
          )}

          {personal.location && <p>{personal.location}</p>}

          <div className="flex gap-5 pt-2 text-sm">
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                className="underline underline-offset-4"
              >
                GitHub
              </a>
            )}

            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                className="underline underline-offset-4"
              >
                LinkedIn
              </a>
            )}

            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                className="underline underline-offset-4"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-neutral-400">
          © {new Date().getFullYear()} {personal.name}
        </div>
      </footer>
    </main>
  );
}
