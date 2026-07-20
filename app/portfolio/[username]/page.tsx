import { notFound } from "next/navigation";

import { connectToDatabase } from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";

import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;

  await connectToDatabase();

  const portfolio = await Portfolio.findOne({
    username,
    published: true,
  }).lean();

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Hero personal={portfolio.personal} />

      <About personal={portfolio.personal} />

      <Skills skills={portfolio.skills} />

      <Projects projects={portfolio.projects} />

      <Experience experience={portfolio.experience} />

      <Education education={portfolio.education} />

      <Contact
        personal={portfolio.personal}
        social={portfolio.social}
      />

      <Footer personal={portfolio.personal} />
    </main>
  );
}
