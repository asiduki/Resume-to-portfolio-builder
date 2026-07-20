import { TemplateProps, SKILL_GROUPS } from "./types";

export default function CreativeTemplate({ portfolio }: TemplateProps) {
  const { personal, skills, projects, experience, education, certifications, social } =
    portfolio;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <img
          src={personal.profileImage || "/default-avatar.png"}
          alt={personal.name}
          className="w-40 h-40 rounded-full object-cover mx-auto ring-4 ring-fuchsia-500 ring-offset-4 ring-offset-indigo-950"
        />

        <h1 className="text-5xl md:text-6xl font-extrabold mt-8 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {personal.name}
        </h1>

        <h2 className="text-2xl text-purple-300 mt-4">
          {personal.title}
        </h2>

        {personal.tagline && (
          <p className="text-purple-200/70 mt-4 text-lg max-w-2xl mx-auto">
            {personal.tagline}
          </p>
        )}
      </section>

      {/* About */}
      {personal.about && (
        <section className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-10">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>

            <p className="text-purple-100/80 leading-8">
              {personal.about}
            </p>
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_GROUPS.map(({ title, key }) => {
            const items = skills[key];
            if (!items || items.length === 0) return null;

            return (
              <div
                key={key}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-4 text-fuchsia-300">
                  {title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 border border-fuchsia-500/30 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-fuchsia-500/50 hover:-translate-y-1 transition-all"
              >
                <h3 className="text-2xl font-bold group-hover:text-fuchsia-300 transition-colors">
                  {project.title}
                </h3>

                <p className="mt-4 text-purple-100/70 leading-7">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-purple-600/30 border border-purple-500/30 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-5 mt-6">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      className="text-fuchsia-300 hover:text-fuchsia-200"
                    >
                      GitHub →
                    </a>
                  )}

                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      className="text-purple-300 hover:text-purple-200"
                    >
                      Live Demo →
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
        <section className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Experience
          </h2>

          {experience.map((exp, index) => (
            <div
              key={index}
              className="relative pl-8 pb-10 border-l border-fuchsia-500/40 last:pb-0"
            >
              <span className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500" />

              <h3 className="text-xl font-semibold">
                {exp.position}
              </h3>

              <p className="text-fuchsia-300">{exp.company}</p>

              <p className="text-purple-200/50 text-sm">
                {exp.duration}
              </p>

              <p className="mt-3 text-purple-100/70 leading-7">
                {exp.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Education
          </h2>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold">
                  {edu.degree}
                </h3>

                <p className="text-fuchsia-300">{edu.institution}</p>

                <p className="text-purple-200/50 text-sm">
                  {edu.duration}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Certifications
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold">
                  {cert.name}
                </h3>

                <p className="text-fuchsia-300">{cert.issuer}</p>

                <p className="text-purple-200/50 text-sm">
                  {cert.year}
                </p>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    className="text-purple-300 hover:text-purple-200 inline-block mt-3"
                  >
                    View Credential →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Let&apos;s Connect
        </h2>

        <div className="mt-8 space-y-3 text-purple-100/80">
          {personal.email && (
            <a
              href={`mailto:${personal.email}`}
              className="block text-fuchsia-300 hover:text-fuchsia-200"
            >
              {personal.email}
            </a>
          )}

          {personal.phone && <p>{personal.phone}</p>}

          {personal.location && <p>{personal.location}</p>}
        </div>

        <div className="flex justify-center gap-6 mt-8">
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              className="text-purple-300 hover:text-fuchsia-300"
            >
              GitHub
            </a>
          )}

          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              className="text-purple-300 hover:text-fuchsia-300"
            >
              LinkedIn
            </a>
          )}

          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              className="text-purple-300 hover:text-fuchsia-300"
            >
              Twitter
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-purple-200/50 text-sm">
          © {new Date().getFullYear()} {personal.name}. Made with ✨
        </div>
      </footer>
    </main>
  );
}
