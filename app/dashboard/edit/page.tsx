"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Eye,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import PersonalForm from "@/components/editor/PersonalForm";
import AboutForm from "@/components/editor/AboutForm";
import SkillsForm from "@/components/editor/SkillsForm";
import ProjectsForm from "@/components/editor/ProjectsForm";
import ExperienceForm from "@/components/editor/ExperienceForm";
import EducationForm from "@/components/editor/EducationForm";
import CertificationForm from "@/components/editor/CertificationForm";
import SocialForm from "@/components/editor/SocialForm";
import SeoForm from "@/components/editor/SeoForm";

import { EditablePortfolio, ValidationErrors } from "@/components/editor/types";
import { validatePortfolio, errorTab } from "@/components/editor/validation";

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "social", label: "Social" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const AUTOSAVE_DELAY_MS = 2000;

function formatSavedAt(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export default function EditPortfolioPage() {
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<EditablePortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [dirty, setDirty] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Forces a re-render every 15s so "Saved Xs ago" stays roughly accurate
  // even when the user stops editing after a save.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (dirty) e.preventDefault();
    }

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  async function fetchPortfolio() {
    try {
      setLoading(true);
      setLoadError(null);

      const res = await fetch("/api/portfolio");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(
          res.status === 404
            ? "No portfolio found. Upload your resume first to generate one."
            : data.message || "Failed to load your portfolio."
        );
        return;
      }

      setPortfolio(data.portfolio);
      setDirty(false);
    } catch (err) {
      console.error(err);
      setLoadError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function update(patch: Partial<EditablePortfolio>) {
    setPortfolio((prev) => (prev ? { ...prev, ...patch } : prev));
    setDirty(true);
  }

  async function savePortfolio(options?: { silent?: boolean }) {
    if (!portfolio) return false;

    const validationErrors = validatePortfolio(portfolio);

    // Autosave never overwrites the error panel while the user is mid-typing —
    // it just quietly waits for the fields to become valid on a later pass.
    if (!options?.silent) {
      setErrors(validationErrors);
    }

    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      if (!options?.silent) {
        setActiveTab(errorTab(errorKeys[0]) as TabId);
        setSaveError(
          `Please fix ${errorKeys.length} validation ${
            errorKeys.length === 1 ? "error" : "errors"
          } before saving.`
        );
      }
      return false;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const res = await fetch("/api/portfolio/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personal: portfolio.personal,
          skills: portfolio.skills,
          projects: portfolio.projects,
          experience: portfolio.experience,
          education: portfolio.education,
          certifications: portfolio.certifications,
          social: portfolio.social,
          seo: portfolio.seo,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (!options?.silent) {
          setSaveError(data.message || "Failed to save changes.");
        }
        return false;
      }

      setPortfolio(data.portfolio);
      setDirty(false);
      setLastSavedAt(new Date());
      return true;
    } catch (err) {
      console.error(err);
      if (!options?.silent) {
        setSaveError("Could not reach the server. Your changes are not saved.");
      }
      return false;
    } finally {
      setSaving(false);
    }
  }

  // Autosave: fires AUTOSAVE_DELAY_MS after the last edit, as long as nothing
  // else is already saving. If a save is in flight when new edits land,
  // `saving` flips back to false afterwards, this effect re-runs (it's a dep),
  // and — since `dirty` is still true — a fresh timer is scheduled.
  useEffect(() => {
    if (!dirty || !portfolio || saving) return;

    const timer = setTimeout(() => {
      savePortfolio({ silent: true });
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio, dirty, saving]);

  // Count errors per tab for the badge indicators
  const tabErrorCounts = Object.keys(errors).reduce<Record<string, number>>(
    (acc, key) => {
      const tab = errorTab(key);
      acc[tab] = (acc[tab] ?? 0) + 1;
      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />

        <p className="text-lg text-slate-700">{loadError}</p>

        <div className="flex gap-3">
          <button
            onClick={fetchPortfolio}
            className="flex items-center gap-2 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Retry
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Edit Portfolio
            </h1>

            <p className="text-sm text-slate-500">
              /portfolio/{portfolio.username}
              {saving && (
                <span className="text-blue-600 ml-2 inline-flex items-center gap-1">
                  <Loader2 className="animate-spin" size={12} />
                  Saving...
                </span>
              )}
              {!saving && dirty && (
                <span className="text-amber-600 ml-2">• Unsaved changes</span>
              )}
              {!saving && !dirty && lastSavedAt && (
                <span className="text-green-600 ml-2">
                  • Saved {formatSavedAt(lastSavedAt)}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/preview")}
              className="flex items-center gap-2 border border-slate-300 px-4 py-2.5 rounded-lg hover:bg-slate-50 text-sm font-medium"
            >
              <Eye size={16} />
              Preview
            </button>

            <button
              onClick={() => savePortfolio()}
              disabled={saving || !dirty}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="bg-red-50 border-t border-red-200">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {saveError}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Tabs — sidebar on desktop, horizontal scroll on mobile */}
        <nav
          className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible
            lg:sticky lg:top-28 lg:self-start -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0"
        >
          {TABS.map((tab) => {
            const errorCount = tabErrorCounts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }
                `}
              >
                {tab.label}

                {errorCount > 0 && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center
                      ${
                        activeTab === tab.id
                          ? "bg-white text-blue-600"
                          : "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {errorCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active section */}
        <div className="min-w-0">
          {activeTab === "personal" && (
            <PersonalForm
              value={portfolio.personal}
              onChange={(personal) => update({ personal })}
              errors={errors}
            />
          )}

          {activeTab === "about" && (
            <AboutForm
              value={portfolio.personal}
              onChange={(personal) => update({ personal })}
              errors={errors}
            />
          )}

          {activeTab === "skills" && (
            <SkillsForm
              value={portfolio.skills}
              onChange={(skills) => update({ skills })}
              errors={errors}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsForm
              value={portfolio.projects}
              onChange={(projects) => update({ projects })}
              errors={errors}
            />
          )}

          {activeTab === "experience" && (
            <ExperienceForm
              value={portfolio.experience}
              onChange={(experience) => update({ experience })}
              errors={errors}
            />
          )}

          {activeTab === "education" && (
            <EducationForm
              value={portfolio.education}
              onChange={(education) => update({ education })}
              errors={errors}
            />
          )}

          {activeTab === "certifications" && (
            <CertificationForm
              value={portfolio.certifications}
              onChange={(certifications) => update({ certifications })}
              errors={errors}
            />
          )}

          {activeTab === "social" && (
            <SocialForm
              value={portfolio.social}
              onChange={(social) => update({ social })}
              errors={errors}
            />
          )}

          {activeTab === "seo" && (
            <SeoForm
              value={portfolio.seo}
              onChange={(seo) => update({ seo })}
              errors={errors}
            />
          )}
        </div>
      </div>
    </main>
  );
}