"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Education from "@/components/portfolio/Education";
import Certifications from "@/components/portfolio/Certifications";
import Contact from "@/components/portfolio/Contact";

export default function PreviewPage() {
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();

      if (data.success) {
        setPortfolio(data.portfolio);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function publishPortfolio() {
    try {
      setPublishing(true);

      const res = await fetch("/api/portfolio/publish", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !portfolio.published,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setPortfolio(data.portfolio);

      alert(data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  return (
    <main className="bg-slate-100 min-h-screen">

      {/* Top Bar */}

      <div className="sticky top-0 bg-white shadow z-50">

        <div className="max-w-7xl mx-auto flex justify-between items-center py-5 px-6">

          <h1 className="text-2xl font-bold">
            Portfolio Preview
          </h1>

          <div className="flex gap-4">

            <button
              onClick={() => router.push("/dashboard/edit")}
              className="px-5 py-2 rounded-lg border"
            >
              Edit
            </button>

            <button
              onClick={publishPortfolio}
              disabled={publishing}
              className={`px-5 py-2 rounded-lg text-white

                ${
                  portfolio.published
                    ? "bg-red-600"
                    : "bg-green-600"
                }
              `}
            >
              {publishing ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : portfolio.published ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </button>

            {portfolio.published && (
              <button
                onClick={() =>
                  window.open(
                    `/portfolio/${portfolio.username}`,
                    "_blank"
                  )
                }
                className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <Globe size={18} />
                View Live
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Portfolio */}

      <div className="max-w-7xl mx-auto bg-white mt-8 rounded-xl shadow overflow-hidden">

        <Hero personal={portfolio.personal} />

        <About personal={portfolio.personal} />

        <Skills skills={portfolio.skills} />

        <Projects projects={portfolio.projects} />

        <Experience experience={portfolio.experience} />

        <Education education={portfolio.education} />

        <Certifications
          certifications={portfolio.certifications}
        />

        <Contact
          personal={portfolio.personal}
          social={portfolio.social}
        />

      </div>

    </main>
  );
}