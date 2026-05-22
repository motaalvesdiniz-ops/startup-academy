const PROGRESS_KEY = "sa_progress";
const CONTENT_KEY = "sa_content";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ─── Progress ───────────────────────────────────────────────

export function getProgress(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markModuleDone(moduleId: string): Record<string, string> {
  const progress = getProgress();
  progress[moduleId] = "done";
  if (isBrowser()) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
  return progress;
}

export function isModuleDone(moduleId: string): boolean {
  return getProgress()[moduleId] === "done";
}

export function countCompleted(): number {
  const progress = getProgress();
  return Object.values(progress).filter((v) => v === "done").length;
}

// ─── Content Cache ──────────────────────────────────────────

export interface QuizQuestion {
  q: string;
  opts: string[];
  correct: number;
  exp: string;
}

type ContentValue = string | QuizQuestion[];

function getContentCache(): Record<string, ContentValue> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setContentCache(cache: Record<string, ContentValue>): void {
  if (isBrowser()) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(cache));
  }
}

export function contentKey(moduleId: string, section: string): string {
  return `${moduleId}_${section}`;
}

export function getContent(moduleId: string, section: string): ContentValue | null {
  const cache = getContentCache();
  return cache[contentKey(moduleId, section)] ?? null;
}

export function saveContent(
  moduleId: string,
  section: string,
  content: ContentValue
): void {
  const cache = getContentCache();
  cache[contentKey(moduleId, section)] = content;
  setContentCache(cache);
}

export function hasContent(moduleId: string, section: string): boolean {
  return getContent(moduleId, section) !== null;
}

export function deleteContent(moduleId: string, section: string): void {
  const cache = getContentCache();
  delete cache[contentKey(moduleId, section)];
  setContentCache(cache);
  if (isBrowser()) {
    localStorage.removeItem(contentKey(moduleId, section) + "_incomplete");
  }
}

/** Salvar flag de incompleto */
export function setIncomplete(moduleId: string, section: string, isIncomplete: boolean): void {
  if (typeof window === "undefined") return;
  if (isIncomplete) {
    localStorage.setItem(contentKey(moduleId, section) + "_incomplete", "true");
  } else {
    localStorage.removeItem(contentKey(moduleId, section) + "_incomplete");
  }
}

/** Checar se está incompleto */
export function getIncomplete(moduleId: string, section: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(contentKey(moduleId, section) + "_incomplete") === "true";
}

// ─── Reset ──────────────────────────────────────────────────

export function resetAllData(): void {
  if (isBrowser()) {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(CONTENT_KEY);
  }
}
