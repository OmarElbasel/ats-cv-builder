import {
  FileText,
  Sparkles,
  Highlighter,
  ShieldCheck,
  Settings,
  ArrowRight,
  Zap,
} from "lucide-react";
import { getUserProfile, clearUserProfile } from "../../profiles";

type View = "setup" | "landing" | "generate" | "cv";

const features = [
  {
    icon: FileText,
    title: "Your data, your browser",
    body: "Fill in your info once — it stays in your browser. Nothing is sent to any server.",
  },
  {
    icon: Sparkles,
    title: "AI tailoring",
    body: "Paste a job description, copy the generated prompt to Claude, and get a tailored CV in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-friendly by default",
    body: "Single-column layout, no tables, no images. Readable by every ATS parser out of the box.",
  },
  {
    icon: FileText,
    title: "Print-ready A4",
    body: 'Click "Download PDF" (or Ctrl+P) to get a clean, single-page A4 PDF every time.',
  },
  {
    icon: Highlighter,
    title: "Smart emphasis",
    body: "Role tags automatically highlight the most relevant bullets for each job type.",
  },
];

export function LandingPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  const profile = getUserProfile();
  const name = profile?.header.name;

  function handleReset() {
    if (!confirm("This will clear all your saved CV data. Are you sure?"))
      return;
    clearUserProfile();
    onNavigate("setup");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            ATS-friendly · AI-tailored · Private
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
            {name ? `${name}'s CV Builder` : "ATS CV Builder"}
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
            One source of truth for your CV. Tailor it per job in seconds using
            AI — then print a clean one-page PDF.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("cv")}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              View my CV <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("generate")}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Tailor for a job
            </button>
            <button
              onClick={() => onNavigate("setup")}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4" /> Edit my info
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
          What's included
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-gray-900 text-white">
                <f.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tailor CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Ready to apply for a job?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Paste the job description, copy the prompt to Claude, and get a
              tailored CV variant in under 2 minutes.
            </p>
          </div>
          <button
            onClick={() => onNavigate("generate")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors whitespace-nowrap text-sm"
          >
            <Sparkles className="w-4 h-4" /> Start tailoring
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <span>Your CV data is stored only in this browser.</span>
        <button
          onClick={handleReset}
          className="text-xs text-red-400 hover:text-red-600 transition-colors underline underline-offset-2"
        >
          Reset & start over
        </button>
      </footer>
    </div>
  );
}
