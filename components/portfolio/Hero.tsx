import { IPersonal } from "@/models/Portfolio/portfolio.types";

export default function Hero({ personal }: { personal: IPersonal }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <img
        src={personal.profileImage || "/default-avatar.png"}
        alt={personal.name}
        className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
      />

      <h1 className="text-5xl font-bold mt-6">
        {personal.name}
      </h1>

      <h2 className="text-2xl text-blue-400 mt-2">
        {personal.title}
      </h2>

      {personal.tagline && (
        <p className="text-slate-400 mt-3 text-lg">
          {personal.tagline}
        </p>
      )}
    </section>
  );
}
