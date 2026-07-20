import { IPersonal } from "@/models/Portfolio/portfolio.types";

export default function About({ personal }: { personal: IPersonal }) {
  if (!personal.about) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">
        About
      </h2>

      <p className="text-slate-300 max-w-3xl leading-8">
        {personal.about}
      </p>
    </section>
  );
}
