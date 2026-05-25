export type RoleTag =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "mobile"
  | "data"
  | "ai";

export interface Achievement {
  text: string;
  tags?: RoleTag[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  date: string;
  achievements: (string | Achievement)[];
  tags?: RoleTag[];
}

export interface Project {
  name: string;
  url: string;
  description: string;
  technologies: string;
  tags?: RoleTag[];
}

export interface SkillRow {
  category: string;
  items: string;
  tags?: RoleTag[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface HeaderInfo {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Profile {
  id: string;
  label: string;
  emphasis?: RoleTag;
  header: HeaderInfo;
  summary: string;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  skills: SkillRow[];
  languages: string;
  sectionOrder?: SectionId[];
}

export type SectionId =
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "skills"
  | "languages";
