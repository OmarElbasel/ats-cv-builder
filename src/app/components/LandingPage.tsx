import {
  FileText,
  Sparkles,
  Layers,
  Highlighter,
  ShieldCheck,
  Maximize2,
  Search,
  Download,
  ArrowRight,
  Terminal,
  Zap,
  Settings,
} from 'lucide-react';
import { getUserProfile, clearUserProfile } from '../../profiles';

type View = 'setup' | 'landing' | 'generate' | 'cv';

const features = [
  {
    icon: Layers,
    title: 'Your own data',
    body: 'Fill in your info once — name, experience, projects, skills. Everything lives in your browser, nothing on a server.',
  },
  {
    icon: Sparkles,
    title: 'AI tailoring',
    body: 'Paste a job description, copy the prompt to Claude, and get a tailored summary and skill order in seconds.',
  },
  {
    icon: Highlighter,
    title: 'Smart emphasis',
    body: 'Role tags highlight the most relevant bullets for each job type — recruiter eye lands where it should.',
  },
  {
    icon: ShieldCheck,
    title: 'ATS-friendly',
    body: 'Single-column, no tables, no images, plain-text contact info. Built-in scanner flags pitfalls before you send.',
  },
  {
    icon: FileText,
    title: 'A4 single page',
    body: 'Print styles tuned for A4. Cmd+P produces a clean one-page PDF every time, no manual fiddling.',
  },
  {
    icon: Maximize2,
    title: 'Density toggle',
    body: 'Append ?density=compact to any URL to tighten line-height when you need to fit more without shrinking text.',
  },
  {
    icon: Search,
    title: 'Keyword diff',
    body: 'Compare your CV text against a JD and see exactly which keywords are missing.',
  },
  {
    icon: ShieldCheck,
    title: 'ATS check',
    body: 'Scans the built HTML for tables, images, and missing contact text that ATS parsers commonly mangle.',
  },
  {
    icon: Download,
    title: 'PDF export',
    body: 'Headless Puppeteer script renders your CV to a dated PDF — consistent fonts and clickable links.',
  },
];

export function LandingPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  const profile = getUserProfile();
  const name = profile?.header.name;

  function handleReset() {
    if (!confirm('This will clear your saved CV data. Are you sure?')) return;
    clearUserProfile();
    onNavigate('setup');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs mb-6">
            <Zap className="w-3 h-3" />
            ATS-friendly · A4 optimized · AI-tailored
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            {name ? `${name}'s CV Builder` : 'ATS CV Builder'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
            One source of truth, multiple tailored variants. Paste a job description, run one command,
            and get a single-page A4 PDF tuned for that exact role.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg shadow-indigo-200"
            >
              <Sparkles className="w-4 h-4" /> Generate from JD
            </button>
            <button
              onClick={() => onNavigate('cv')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              View my CV <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('setup')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" /> Edit my info
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Features</h2>
        <p className="text-gray-600 mb-8">Everything wired into the builder.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-400 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 text-white mb-3">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Tailor for a specific job</h2>
              <p className="text-gray-600">Paste a JD, paste Claude's response — get a custom CV in 2 minutes. All in-browser.</p>
            </div>
            <button
              onClick={() => onNavigate('generate')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg shadow-indigo-200 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" /> Open generator
            </button>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Or use the CLI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Step
            n={1}
            title="Save the JD"
            cmd="code job.txt   # paste full JD, save"
            body="Drop the job description into job.txt at the project root."
          />
          <Step
            n={2}
            title="Prepare the prompt"
            cmd="pnpm generate-profile prepare"
            body="Builds a prompt and copies it to your clipboard via pbcopy."
          />
          <Step
            n={3}
            title="Send to Claude"
            cmd="# open claude.ai → cmd+V → send"
            body="Claude responds with a JSON object. Copy it."
          />
          <Step
            n={4}
            title="Apply"
            cmd={"code .ai-response.json   # paste\npnpm generate-profile apply"}
            body="Writes src/profiles/generated.ts, then visit /?profile=generated and cmd+P."
          />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScriptCard
            icon={Search}
            title="Keyword diff"
            cmd="pnpm keyword-diff default ./job.txt"
            body="See which JD keywords are missing from your profile."
          />
          <ScriptCard
            icon={ShieldCheck}
            title="ATS check"
            cmd="pnpm build && pnpm ats-check"
            body="Scan the built HTML for ATS pitfalls."
          />
          <ScriptCard
            icon={Download}
            title="PDF export"
            cmd="pnpm export-pdf default"
            body="Render your CV to a named PDF (needs puppeteer)."
          />
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-200 mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>ATS CV Builder · Your data stays in your browser.</span>
        <button
          onClick={handleReset}
          className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2"
        >
          Reset & start over
        </button>
      </footer>
    </div>
  );
}

function Step({ n, title, cmd, body }: { n: number; title: string; cmd: string; body: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-semibold">
          {n}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <pre className="bg-gray-950 text-gray-100 text-xs rounded-lg p-3 mb-2 overflow-x-auto whitespace-pre">{cmd}</pre>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}

function ScriptCard({
  icon: Icon,
  title,
  cmd,
  body,
}: {
  icon: typeof Terminal;
  title: string;
  cmd: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-700" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <pre className="bg-gray-100 text-gray-900 text-xs rounded-lg p-2.5 mb-2 overflow-x-auto">{cmd}</pre>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}
