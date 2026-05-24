import type { Profile, SkillRow } from './types';

export const PROFILE_STORAGE_KEY = 'cv-user-profile-v1';
export const GENERATED_STORAGE_KEY = 'cv-generated-profile-v1';

export type Density = 'normal' | 'compact';

export function getUserProfile(): Profile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function clearUserProfile(): void {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(GENERATED_STORAGE_KEY);
}

interface StoredGenerated {
  id: string;
  label: string;
  emphasis: Profile['emphasis'];
  headerTitle: string;
  summary: string;
  skillsOrder: string[];
}

function buildGeneratedProfile(base: Profile): Profile | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(GENERATED_STORAGE_KEY);
    if (!raw) return undefined;
    const data = JSON.parse(raw) as StoredGenerated;
    const reordered: SkillRow[] = [...base.skills].sort((a, b) => {
      const ai = data.skillsOrder.indexOf(a.category);
      const bi = data.skillsOrder.indexOf(b.category);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    return {
      ...base,
      id: 'generated',
      label: data.label,
      emphasis: data.emphasis,
      header: { ...base.header, title: data.headerTitle },
      summary: data.summary,
      skills: reordered,
    };
  } catch {
    return undefined;
  }
}

export function getActiveProfile(): Profile | null {
  const base = getUserProfile();
  if (!base) return null;
  if (typeof window === 'undefined') return base;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('profile') ?? 'default';
  if (id === 'generated') return buildGeneratedProfile(base) ?? base;
  return base;
}

export function getActiveDensity(): Density {
  if (typeof window === 'undefined') return 'normal';
  const params = new URLSearchParams(window.location.search);
  return params.get('density') === 'compact' ? 'compact' : 'normal';
}

export function hasStoredGenerated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem(GENERATED_STORAGE_KEY));
  } catch {
    return false;
  }
}

export type { Profile } from './types';
