import { IProject } from "@/models/Portfolio/portfolio.types";

export default function Projects({ projects }: { projects: IProject[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">
        Projects
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-900 border border-slate-700 p-6"
          >
            <h3 className="text-2xl font-semibold">
              {project.title}
            </h3>

            <p className="mt-4 text-slate-300">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="bg-blue-600 px-3 py-1 rounded-full text-sm"
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
                  className="text-blue-400"
                >
                  GitHub
                </a>
              )}

              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  className="text-green-400"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
