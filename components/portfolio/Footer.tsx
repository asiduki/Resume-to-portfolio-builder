import { IPersonal } from "@/models/Portfolio/portfolio.types";

export default function Footer({ personal }: { personal: IPersonal }) {
  return (
    <footer className="border-t border-slate-800 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} {personal.name}. All rights reserved.
      </div>
    </footer>
  );
}
