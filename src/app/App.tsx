import { useState } from "react";
import { Printer } from "lucide-react";
import { CVHeader } from "./components/CVHeader";
import { CVSection } from "./components/CVSection";
import { ExperienceItem } from "./components/ExperienceItem";
import { ProjectItem } from "./components/ProjectItem";
import { SkillsGrid } from "./components/SkillsGrid";
import { LandingPage } from "./components/LandingPage";
import { GeneratePage } from "./components/GeneratePage";
import { SetupPage } from "./components/SetupPage";
import {
  getActiveProfile,
  getActiveDensity,
  getUserProfile,
} from "../profiles";

type View = "setup" | "landing" | "generate" | "cv";

function getView(): View {
  if (typeof window === "undefined") return "landing";
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "setup") return "setup";
  if (params.get("view") === "generate") return "generate";
  if (params.has("profile")) return "cv";
  return "landing";
}

export default function App() {
  const [view, setView] = useState<View>(getView);
  const [hasProfile, setHasProfile] = useState(Boolean(getUserProfile()));

  function navigate(v: View) {
    const url = new URL(window.location.href);
    if (v === "landing") url.search = "";
    else if (v === "setup") url.search = "?view=setup";
    else if (v === "generate") url.search = "?view=generate";
    else if (v === "cv") url.search = "?profile=default";
    window.history.pushState({}, "", url.toString());
    setView(v);
  }

  if (view === "setup" || !hasProfile) {
    return (
      <SetupPage
        onComplete={() => {
          setHasProfile(true);
          navigate("landing");
        }}
        onBack={hasProfile ? () => navigate("landing") : undefined}
      />
    );
  }

  if (view === "generate") return <GeneratePage />;

  if (view === "cv") {
    const profile = getActiveProfile();
    const density = getActiveDensity();
    if (!profile) return <SetupPage onComplete={() => navigate("landing")} />;
    const emphasis = profile.emphasis;
    return (
      <div
        className="min-h-screen bg-white p-8 print:p-0 print:shadow-none"
        data-profile={profile.id}
        data-density={density}
      >
        <BackToBuilder onBack={() => navigate("landing")} />
        <PrintButton />
        <div className="max-w-[850px] mx-auto bg-white print:max-w-full print:shadow-none print:mx-auto print:my-0 print:leading-tight">
          <CVHeader {...profile.header} />

          <CVSection title="SUMMARY">
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
          </CVSection>

          <CVSection title="EXPERIENCE">
            {profile.experiences.map((exp, i) => (
              <ExperienceItem key={i} {...exp} emphasis={emphasis} />
            ))}
          </CVSection>

          <CVSection title="PROJECTS">
            {profile.projects.map((p, i) => (
              <ProjectItem key={i} {...p} emphasis={emphasis} />
            ))}
          </CVSection>

          <CVSection title="EDUCATION">
            <div className="space-y-1">
              {profile.education.map((e, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900">{e.degree}</p>
                    <p className="text-gray-600">{e.school}</p>
                  </div>
                  <p className="text-gray-600">{e.year}</p>
                </div>
              ))}
            </div>
          </CVSection>

          {profile.certifications.length > 0 && (
            <CVSection title="CERTIFICATIONS">
              <ul className="list-disc list-outside ml-5 space-y-1 print:space-y-0">
                {profile.certifications.map((c, i) => (
                  <li key={i} className="text-gray-700 text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            </CVSection>
          )}

          <CVSection title="SKILLS">
            <SkillsGrid skills={profile.skills} emphasis={emphasis} />
          </CVSection>

          {profile.languages && (
            <CVSection title="Languages" isLast>
              <p className="text-gray-700">{profile.languages}</p>
            </CVSection>
          )}
        </div>
      </div>
    );
  }

  return <LandingPage onNavigate={navigate} />;
}

function BackToBuilder({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium shadow-lg hover:bg-gray-700 transition-colors print:hidden"
    >
      ← Builder
    </button>
  );
}

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-700 text-white text-xs font-medium shadow-lg hover:bg-gray-600 transition-colors print:hidden"
    >
      <Printer className="w-3.5 h-3.5" /> Download PDF
    </button>
  );
}
