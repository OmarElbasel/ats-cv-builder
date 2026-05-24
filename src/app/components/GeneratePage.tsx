import { useMemo, useState } from "react";
import { getUserProfile, GENERATED_STORAGE_KEY } from "../../profiles";
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const LLM_OPTIONS = [
  { name: "Claude", url: "https://claude.ai/new" },
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Gemini", url: "https://gemini.google.com" },
  { name: "DeepSeek", url: "https://chat.deepseek.com" },
  { name: "Grok", url: "https://grok.com" },
] as const;

const VALID_TAGS = [
  "frontend",
  "backend",
  "fullstack",
  "devops",
  "mobile",
  "data",
  "ai",
] as const;

function buildPrompt(profileJson: string, jd: string): string {
  return `You are tailoring a CV profile for a specific job. Output ONLY a JSON object — no prose, no markdown fences.

# RULES (strict — do not violate)
1. Do NOT invent companies, job titles, dates, technologies, metrics, or certifications. Use only what appears in the source profile below.
2. You MAY: rewrite the summary, reorder skill rows, set the emphasis role tag.
3. You may NOT add or remove bullet points. You may NOT change a bullet's text.
4. The summary must be 2–3 sentences, ATS-friendly (plain words from the JD where they truthfully apply).
5. Skill row categories must be a permutation of the existing categories — same set, new order. Put the most relevant first.
6. emphasis must be one of: frontend | backend | fullstack | devops | mobile | data | ai.

# OUTPUT JSON SCHEMA
{
  "id": "generated",
  "label": "<short label, e.g. 'Backend @ Acme'>",
  "emphasis": "<one role tag>",
  "headerTitle": "<job title to display under name, e.g. 'Backend engineer'>",
  "summary": "<2-3 sentences>",
  "skillsOrder": ["<category>", "<category>", ...]
}

# SOURCE PROFILE (the only facts you may use)
\`\`\`json
${profileJson}
\`\`\`

# JOB DESCRIPTION
${jd}

Now output the JSON object only.`;
}

interface ParsedResponse {
  id: string;
  label: string;
  emphasis: string;
  headerTitle: string;
  summary: string;
  skillsOrder: string[];
}

function parseResponse(raw: string): { data?: ParsedResponse; error?: string } {
  let text = raw.trim();
  text = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e: any) {
    return { error: `Invalid JSON: ${e.message}` };
  }
  const required = [
    "id",
    "label",
    "emphasis",
    "headerTitle",
    "summary",
    "skillsOrder",
  ];
  for (const k of required) {
    if (!(k in data)) return { error: `Missing field: ${k}` };
  }
  if (!VALID_TAGS.includes(data.emphasis)) {
    return {
      error: `Invalid emphasis "${data.emphasis}". Must be one of: ${VALID_TAGS.join(", ")}`,
    };
  }
  if (!Array.isArray(data.skillsOrder) || data.skillsOrder.length === 0) {
    return { error: "skillsOrder must be a non-empty array." };
  }
  return { data: data as ParsedResponse };
}

export function GeneratePage() {
  const userProfile = getUserProfile();
  const profileJson = useMemo(
    () => (userProfile ? JSON.stringify(userProfile, null, 2) : ""),
    [],
  );
  const [jd, setJd] = useState("");
  const [response, setResponse] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [applied, setApplied] = useState<ParsedResponse | null>(() => {
    try {
      const raw = localStorage.getItem(GENERATED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [parseError, setParseError] = useState<string | null>(null);

  const prompt = useMemo(
    () => (jd.trim() && profileJson ? buildPrompt(profileJson, jd.trim()) : ""),
    [jd, profileJson],
  );

  async function copyPrompt() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // Fallback: select the textarea
    }
  }

  function applyResponse() {
    setParseError(null);
    const result = parseResponse(response);
    if (result.error) {
      setParseError(result.error);
      return;
    }
    if (result.data) {
      localStorage.setItem(GENERATED_STORAGE_KEY, JSON.stringify(result.data));
      setApplied(result.data);
      window.dispatchEvent(new Event("cv-profile-updated"));
    }
  }

  function clearGenerated() {
    localStorage.removeItem(GENERATED_STORAGE_KEY);
    setApplied(null);
    setResponse("");
    setParseError(null);
    window.dispatchEvent(new Event("cv-profile-updated"));
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No CV data found. Set up your profile first.
          </p>
          <a href="/" className="text-gray-900 underline">
            ← Back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40 backdrop-blur bg-white/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Builder
          </a>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h1 className="text-lg font-semibold text-gray-900">
              Tailor your CV
            </h1>
          </div>
          {applied ? (
            <a
              href="/?profile=generated"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 inline-flex items-center gap-1"
            >
              Open CV <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-sm text-gray-400">No generated CV yet</span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {applied && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
            <p className="text-gray-900">
              A generated CV is active in your browser. Apply a new response
              below to replace it.
            </p>
          </div>
        )}

        {/* Step 1 */}
        <StepCard n={1} title="Paste the job description">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here — title, responsibilities, requirements, nice-to-haves..."
            className="w-full min-h-[180px] rounded-lg border border-gray-300 p-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <p className="text-xs text-gray-500 mt-2">
            {jd.length.toLocaleString()} characters
          </p>
        </StepCard>

        {/* Step 2 */}
        <StepCard n={2} title="Copy the prompt, then send to any AI">
          <div className="relative">
            <textarea
              value={prompt}
              readOnly
              placeholder="Paste a JD above to generate the prompt..."
              className="w-full min-h-[140px] rounded-lg border border-gray-300 bg-gray-50 p-3 text-xs font-mono leading-relaxed"
            />
            <button
              onClick={copyPrompt}
              disabled={!prompt}
              className="absolute top-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copiedPrompt ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedPrompt ? "Copied" : "Copy prompt"}
            </button>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Open in
            </p>
            <div className="flex flex-wrap gap-2">
              {LLM_OPTIONS.map((llm) => (
                <a
                  key={llm.name}
                  href={llm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  {llm.name} <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Paste the prompt in a new chat → send → copy the JSON response
              back here.
            </p>
          </div>
        </StepCard>

        {/* Step 3 */}
        <StepCard n={3} title="Paste the AI's JSON response">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={'{\n  "id": "generated",\n  "label": "...",\n  ...\n}'}
            className="w-full min-h-[160px] rounded-lg border border-gray-300 p-3 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {parseError && (
            <div className="mt-2 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={applyResponse}
              disabled={!response.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" /> Apply
            </button>
            {applied && (
              <button
                onClick={clearGenerated}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear generated
              </button>
            )}
          </div>
        </StepCard>

        {/* Result */}
        {applied && (
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Generated CV ready
              </h3>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <Field label="Label" value={applied.label} />
              <Field label="Emphasis" value={applied.emphasis} />
              <Field label="Header title" value={applied.headerTitle} />
              <Field
                label="Skills order"
                value={applied.skillsOrder.join(" → ")}
              />
              <div className="md:col-span-2">
                <Field label="Summary" value={applied.summary} multiline />
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/?profile=generated"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700"
              >
                Open CV <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Stored in your browser (localStorage). Visit /?profile=generated
              and Cmd+P to print.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function StepCard({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-semibold">
          {n}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">
        {label}
      </dt>
      <dd
        className={`text-gray-900 ${multiline ? "leading-relaxed" : "truncate"}`}
      >
        {value}
      </dd>
    </div>
  );
}
