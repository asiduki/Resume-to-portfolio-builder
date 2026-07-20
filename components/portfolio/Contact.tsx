import { IPersonal, ISocial } from "@/models/Portfolio/portfolio.types";

export default function Contact({
  personal,
  social,
}: {
  personal: IPersonal;
  social: ISocial;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold">
        Contact
      </h2>

      <div className="mt-6 space-y-3">
        {personal.email && <p>Email: {personal.email}</p>}

        {personal.phone && <p>Phone: {personal.phone}</p>}

        {personal.location && <p>Location: {personal.location}</p>}

        {social.linkedin && (
          <a
            href={social.linkedin}
            target="_blank"
            className="text-blue-400 block"
          >
            LinkedIn
          </a>
        )}

        {social.github && (
          <a
            href={social.github}
            target="_blank"
            className="text-blue-400 block"
          >
            GitHub
          </a>
        )}
      </div>
    </section>
  );
}
