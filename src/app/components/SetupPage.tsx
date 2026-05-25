import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import { saveUserProfile, getUserProfile } from "../../profiles";
import { getSectionMeta, normalizeSectionOrder } from "../../profiles/sections";
import type {
  Profile,
  Experience,
  Project,
  Education,
  SkillRow,
  SectionId,
} from "../../profiles/types";

const EMPTY_PROFILE: Profile = {
  id: "default",
  label: "My CV",
  header: {
    name: "",
    title: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experiences: [],
  projects: [],
  education: [],
  certifications: [],
  skills: [],
  languages: "",
};

function emptyExp(): Experience {
  return { title: "", company: "", location: "", date: "", achievements: [] };
}
function emptyProject(): Project {
  return { name: "", url: "", description: "", technologies: "" };
}
function emptyEdu(): Education {
  return { degree: "", school: "", year: "" };
}
function emptySkill(): SkillRow {
  return { category: "", items: "" };
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {optional && <span className="ml-1 text-gray-400">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {optional && <span className="ml-1 text-gray-400">(optional)</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
    </div>
  );
}

function ExperienceEditor({
  exp,
  index,
  onChange,
  onRemove,
}: {
  exp: Experience;
  index: number;
  onChange: (e: Experience) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);

  function setField<K extends keyof Experience>(k: K, v: Experience[K]) {
    onChange({ ...exp, [k]: v });
  }

  function updateBullet(i: number, text: string) {
    const next = [...exp.achievements];
    next[i] = text;
    setField("achievements", next);
  }

  function addBullet() {
    setField("achievements", [...exp.achievements, ""]);
  }

  function removeBullet(i: number) {
    setField(
      "achievements",
      exp.achievements.filter((_, idx) => idx !== i),
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">
          {exp.title || exp.company
            ? `${exp.title}${exp.company ? " @ " + exp.company : ""}`
            : `Experience ${index + 1}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      {open && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Job title"
              value={exp.title}
              onChange={(v) => setField("title", v)}
              placeholder="Software Engineer"
            />
            <Field
              label="Company"
              value={exp.company}
              onChange={(v) => setField("company", v)}
              placeholder="Acme Inc."
            />
            <Field
              label="Location"
              value={exp.location}
              onChange={(v) => setField("location", v)}
              placeholder="New York, NY"
            />
            <Field
              label="Date range"
              value={exp.date}
              onChange={(v) => setField("date", v)}
              placeholder="Jan 2023 – Present"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Bullet points
            </label>
            <div className="space-y-2">
              {(exp.achievements as string[]).map((bullet, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <textarea
                    value={
                      typeof bullet === "string" ? bullet : (bullet as any).text
                    }
                    onChange={(e) => updateBullet(i, e.target.value)}
                    placeholder="Describe what you did and the impact it had..."
                    rows={2}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(i)}
                    className="mt-1 p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addBullet}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add bullet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectEditor({
  project,
  index,
  onChange,
  onRemove,
}: {
  project: Project;
  index: number;
  onChange: (p: Project) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  function setField<K extends keyof Project>(k: K, v: Project[K]) {
    onChange({ ...project, [k]: v });
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">
          {project.name || `Project ${index + 1}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      {open && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Project name"
              value={project.name}
              onChange={(v) => setField("name", v)}
              placeholder="My SaaS App"
            />
            <Field
              label="URL"
              value={project.url}
              onChange={(v) => setField("url", v)}
              placeholder="github.com/you/project"
              optional
            />
          </div>
          <TextArea
            label="Description"
            value={project.description}
            onChange={(v) => setField("description", v)}
            placeholder="What it does and why it matters..."
            rows={2}
          />
          <Field
            label="Technologies"
            value={project.technologies}
            onChange={(v) => setField("technologies", v)}
            placeholder="React, TypeScript, Node.js, PostgreSQL"
          />
        </div>
      )}
    </div>
  );
}

function SectionOrderEditor({
  order,
  onChange,
}: {
  order: SectionId[];
  onChange: (order: SectionId[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function moveTo(target: number) {
    if (dragIndex === null || dragIndex === target) return;
    const next = [...order];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    setDragIndex(target);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {order.map((id, i) => (
        <div
          key={id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragEnter={() => moveTo(i)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={() => setDragIndex(null)}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-grab active:cursor-grabbing transition-colors ${
            dragIndex === i
              ? "border-gray-400 bg-gray-50 opacity-60"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-sm font-medium text-gray-700">
            {getSectionMeta(id).label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SetupPage({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack?: () => void;
}) {
  const [profile, setProfile] = useState<Profile>(
    () => getUserProfile() ?? EMPTY_PROFILE,
  );
  const isEditing = Boolean(getUserProfile());
  const [error, setError] = useState("");
  // Raw textarea text so newlines/spaces survive typing; cleaned at save.
  const [certText, setCertText] = useState(() =>
    (getUserProfile()?.certifications ?? []).join("\n"),
  );

  function setHeader(k: keyof Profile["header"], v: string) {
    setProfile((p) => ({ ...p, header: { ...p.header, [k]: v } }));
  }

  function setSummary(v: string) {
    setProfile((p) => ({ ...p, summary: v }));
  }

  function setExps(exps: Experience[]) {
    setProfile((p) => ({ ...p, experiences: exps }));
  }

  function setProjects(projects: Project[]) {
    setProfile((p) => ({ ...p, projects }));
  }

  function setEdu(education: Education[]) {
    setProfile((p) => ({ ...p, education }));
  }

  function setSkills(skills: SkillRow[]) {
    setProfile((p) => ({ ...p, skills }));
  }

  function setSectionOrder(sectionOrder: SectionId[]) {
    setProfile((p) => ({ ...p, sectionOrder }));
  }

  function validate(): boolean {
    if (!profile.header.name.trim()) {
      setError("Name is required.");
      return false;
    }
    if (!profile.header.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!profile.header.title.trim()) {
      setError("Job title is required.");
      return false;
    }
    return true;
  }

  function handleSave() {
    if (!validate()) return;
    setError("");
    const certifications = certText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    saveUserProfile({ ...profile, certifications });
    onComplete();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40 backdrop-blur bg-white/80">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              {isEditing ? "Edit your CV" : "Set up your CV"}
            </h1>
            <p className="text-xs text-gray-500">
              Your data stays in your browser — nothing is sent to a server.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Personal info */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Personal info"
            subtitle="Appears at the top of your CV."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Full name"
              value={profile.header.name}
              onChange={(v) => setHeader("name", v)}
              placeholder="Jane Smith"
            />
            <Field
              label="Job title"
              value={profile.header.title}
              onChange={(v) => setHeader("title", v)}
              placeholder="Full-stack Engineer"
            />
            <Field
              label="Email"
              value={profile.header.email}
              onChange={(v) => setHeader("email", v)}
              placeholder="jane@example.com"
              type="email"
            />
            <Field
              label="Phone"
              value={profile.header.phone}
              onChange={(v) => setHeader("phone", v)}
              placeholder="+1 555 000 0000"
              optional
            />
            <Field
              label="Location"
              value={profile.header.location}
              onChange={(v) => setHeader("location", v)}
              placeholder="New York, NY"
              optional
            />
            <Field
              label="Website"
              value={profile.header.website}
              onChange={(v) => setHeader("website", v)}
              placeholder="janesmith.dev"
              optional
            />
            <Field
              label="LinkedIn"
              value={profile.header.linkedin}
              onChange={(v) => setHeader("linkedin", v)}
              placeholder="linkedin.com/in/janesmith"
              optional
            />
            <Field
              label="GitHub"
              value={profile.header.github}
              onChange={(v) => setHeader("github", v)}
              placeholder="github.com/janesmith"
              optional
            />
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Summary"
            subtitle="2–3 sentences. ATS parsers read this first."
          />
          <TextArea
            label="Professional summary"
            value={profile.summary}
            onChange={setSummary}
            placeholder="Full-stack engineer with 5 years building production web apps. Experienced with React, Node.js, and PostgreSQL. Passionate about developer tooling and clean APIs."
            rows={4}
          />
        </section>

        {/* Experience */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Experience"
            subtitle="Most recent first. Use action verbs and quantify impact where possible."
          />
          <div className="space-y-3">
            {profile.experiences.map((exp, i) => (
              <ExperienceEditor
                key={i}
                exp={exp}
                index={i}
                onChange={(updated) => {
                  const next = [...profile.experiences];
                  next[i] = updated;
                  setExps(next);
                }}
                onRemove={() =>
                  setExps(profile.experiences.filter((_, idx) => idx !== i))
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setExps([...profile.experiences, emptyExp()])}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add experience
          </button>
        </section>

        {/* Projects */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Projects"
            subtitle="Side projects, open source, or notable work outside employment."
          />
          <div className="space-y-3">
            {profile.projects.map((proj, i) => (
              <ProjectEditor
                key={i}
                project={proj}
                index={i}
                onChange={(updated) => {
                  const next = [...profile.projects];
                  next[i] = updated;
                  setProjects(next);
                }}
                onRemove={() =>
                  setProjects(profile.projects.filter((_, idx) => idx !== i))
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setProjects([...profile.projects, emptyProject()])}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add project
          </button>
        </section>

        {/* Education */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Education" />
          <div className="space-y-3">
            {profile.education.map((edu, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
              >
                <Field
                  label="Degree / qualification"
                  value={edu.degree}
                  onChange={(v) => {
                    const n = [...profile.education];
                    n[i] = { ...n[i], degree: v };
                    setEdu(n);
                  }}
                  placeholder="B.Sc. Computer Science"
                />
                <Field
                  label="School / university"
                  value={edu.school}
                  onChange={(v) => {
                    const n = [...profile.education];
                    n[i] = { ...n[i], school: v };
                    setEdu(n);
                  }}
                  placeholder="MIT"
                />
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Field
                      label="Year"
                      value={edu.year}
                      onChange={(v) => {
                        const n = [...profile.education];
                        n[i] = { ...n[i], year: v };
                        setEdu(n);
                      }}
                      placeholder="2022"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEdu(profile.education.filter((_, idx) => idx !== i))
                    }
                    className="mb-0.5 p-2 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEdu([...profile.education, emptyEdu()])}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add education
          </button>
        </section>

        {/* Skills */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Skills"
            subtitle="Group by category. Items are comma-separated."
          />
          <div className="space-y-3">
            {profile.skills.map((skill, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="w-40 shrink-0">
                  <Field
                    label="Category"
                    value={skill.category}
                    onChange={(v) => {
                      const n = [...profile.skills];
                      n[i] = { ...n[i], category: v };
                      setSkills(n);
                    }}
                    placeholder="Frontend"
                  />
                </div>
                <div className="flex-1">
                  <Field
                    label="Items"
                    value={skill.items}
                    onChange={(v) => {
                      const n = [...profile.skills];
                      n[i] = { ...n[i], items: v };
                      setSkills(n);
                    }}
                    placeholder="React, TypeScript, Tailwind, Next.js"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSkills(profile.skills.filter((_, idx) => idx !== i))
                  }
                  className="mb-0.5 p-2 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSkills([...profile.skills, emptySkill()])}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add skill row
          </button>
        </section>

        {/* Certifications */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Certifications" subtitle="One per line." />
          <TextArea
            label="Certifications"
            value={certText}
            onChange={setCertText}
            placeholder={
              "AWS Certified Solutions Architect\nGoogle Cloud Professional Data Engineer"
            }
            rows={4}
            optional
          />
        </section>

        {/* Languages */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader title="Languages" />
          <Field
            label="Languages"
            value={profile.languages}
            onChange={(v) => setProfile((p) => ({ ...p, languages: v }))}
            placeholder="English (native), Spanish (conversational)"
            optional
          />
        </section>

        {/* Section order */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Section order"
            subtitle="Drag to reorder how sections appear on your CV. Empty sections are hidden automatically."
          />
          <SectionOrderEditor
            order={normalizeSectionOrder(profile.sectionOrder)}
            onChange={setSectionOrder}
          />
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end pb-10">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors text-base"
          >
            {isEditing ? "Save changes" : "Build my CV"}{" "}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
