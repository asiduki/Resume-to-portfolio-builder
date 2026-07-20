import { ICertification } from "@/models/Portfolio/portfolio.types";

export default function Certifications({
  certifications,
}: {
  certifications: ICertification[];
}) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">
        Certifications
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-xl font-semibold">
              {cert.name}
            </h3>

            <p className="text-blue-400 mt-1">
              {cert.issuer}
            </p>

            <p className="text-slate-400">
              {cert.year}
            </p>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                className="text-blue-400 inline-block mt-3"
              >
                View Credential
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
