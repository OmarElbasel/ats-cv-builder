import type { SectionId } from "./types";

export interface SectionMeta {
  id: SectionId;
  cvTitle: string;
  label: string;
}

export const CV_SECTIONS: SectionMeta[] = [
  { id: "summary", cvTitle: "SUMMARY", label: "Summary" },
  { id: "experience", cvTitle: "EXPERIENCE", label: "Experience" },
  { id: "projects", cvTitle: "PROJECTS", label: "Projects" },
  { id: "education", cvTitle: "EDUCATION", label: "Education" },
  { id: "certifications", cvTitle: "CERTIFICATIONS", label: "Certifications" },
  { id: "skills", cvTitle: "SKILLS", label: "Skills" },
  { id: "languages", cvTitle: "Languages", label: "Languages" },
];

export const DEFAULT_SECTION_ORDER: SectionId[] = CV_SECTIONS.map((s) => s.id);

const SECTION_BY_ID: Record<SectionId, SectionMeta> = Object.fromEntries(
  CV_SECTIONS.map((s) => [s.id, s]),
) as Record<SectionId, SectionMeta>;

export function getSectionMeta(id: SectionId): SectionMeta {
  return SECTION_BY_ID[id];
}

// Returns the saved order with unknown/duplicate ids dropped and any
// missing known sections appended, so the order is always complete and valid.
export function normalizeSectionOrder(order?: string[]): SectionId[] {
  const known = new Set<string>(DEFAULT_SECTION_ORDER);
  const seen = new Set<SectionId>();
  const result: SectionId[] = [];
  for (const id of order ?? []) {
    if (known.has(id) && !seen.has(id as SectionId)) {
      result.push(id as SectionId);
      seen.add(id as SectionId);
    }
  }
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) result.push(id);
  }
  return result;
}
