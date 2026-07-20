import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Education from "@/components/portfolio/Education";
import Certifications from "@/components/portfolio/Certifications";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

import { TemplateProps } from "./types";

export default function ModernTemplate({ portfolio }: TemplateProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Hero personal={portfolio.personal} />

      <About personal={portfolio.personal} />

      <Skills skills={portfolio.skills} />

      <Projects projects={portfolio.projects} />

      <Experience experience={portfolio.experience} />

      <Education education={portfolio.education} />

      <Certifications certifications={portfolio.certifications} />

      <Contact
        personal={portfolio.personal}
        social={portfolio.social}
      />

      <Footer personal={portfolio.personal} />
    </main>
  );
}
