import { TemplateProps, SKILL_GROUPS } from "./types";

export default function DeveloperTemplate({ portfolio }: TemplateProps) {
  const { personal, skills, projects, experience, education, certifications, social } =
    portfolio;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-green-400">~/portfolio $ whoami</p>

        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          {personal.name}
          <span className="text-green-400 animate-pulse">_</span>
        </h1>

        <h2 className="text-xl text-green-400 mt-2">
          {"// "}{personal.title}
        </h2>

        {personal.about && (
          <p className="text-zinc-400 mt-6 max-w-3xl leading-7">
            {personal.about}
          </p>
        )}
      </section>

      {/* Skills */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-green-400">
          $ ls ./skills
        </h2>

        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900 space-y-4">
          {SKILL_GROUPS.map(({ title, key }) => {
            const items = skills[key];
            if (!items || items.length === 0) return null;

            return (
              <div key={key} className="flex flex-wrap gap-x-2 gap-y-1">
                <span className="text-green-400">
                  {title.toLowerCase()}:
                </span>
                <span className="text-zinc-300">
                  [{items.map((s) => `"${s}"`).join(", ")}]
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            $ ls ./projects
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden hover:border-green-400 transition-colors"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-video object-cover border-b border-zinc-800"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-zinc-100">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-zinc-400 text-sm leading-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs text-green-400 border border-green-400/40 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-5 text-sm">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        className="text-green-400 underline underline-offset-4"
                      >
                        [source]
                      </a>
                    )}

                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        className="text-green-400 underline underline-offset-4"
                      >
                        [demo]
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            $ cat ./experience.log
          </h2>

          {experience.map((exp, index) => (
            <div
              key={index}
              className="border-l-2 border-green-400 pl-6 mb-8"
            >
              <h3 className="text-lg font-semibold">
                {exp.position}{" "}
                <span className="text-green-400">@ {exp.company}</span>
              </h3>

              <p className="text-zinc-500 text-sm">{exp.duration}</p>

              <p className="mt-3 text-zinc-400 text-sm leading-6">
                {exp.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            $ cat ./education.log
          </h2>

          {education.map((edu, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <p className="text-zinc-400">{edu.institution}</p>
              <p className="text-zinc-500 text-sm">{edu.duration}</p>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            $ ls ./certifications
          </h2>

          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index} className="text-sm">
                <span className="text-zinc-100">{cert.name}</span>
                <span className="text-zinc-500">
                  {" "}— {cert.issuer} ({cert.year})
                </span>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    className="text-green-400 underline underline-offset-4 ml-2"
                  >
                    [verify]
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6 text-green-400">
          $ ./contact --me
        </h2>

        <div className="space-y-2 text-sm">
          {personal.email && (
            <p>
              <span className="text-green-400">email:</span>{" "}
              {personal.email}
            </p>
          )}

          {personal.phone && (
            <p>
              <span className="text-green-400">phone:</span>{" "}
              {personal.phone}
            </p>
          )}

          {personal.location && (
            <p>
              <span className="text-green-400">location:</span>{" "}
              {personal.location}
            </p>
          )}

          {social.github && (
            <a
              href={social.github}
              target="_blank"
              className="text-green-400 underline underline-offset-4 block"
            >
              github
            </a>
          )}

          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              className="text-green-400 underline underline-offset-4 block"
            >
              linkedin
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} {personal.name} — exit 0
        </div>
      </footer>
    </main>
  );
}
