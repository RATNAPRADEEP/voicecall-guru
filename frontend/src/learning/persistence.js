const STORAGE_KEY = 'voicecall-guru:learning-state:v1';

function isValidState(value) {
  return value && typeof value === 'object'
    && Number.isInteger(value.stepIndex)
    && Number.isInteger(value.attempt)
    && Number.isInteger(value.assistance)
    && Number.isInteger(value.mistakes)
    && typeof value.completed === 'boolean';
}

export function loadLearningState(fallbackFactory) {
  if (typeof window === 'undefined') return fallbackFactory();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackFactory();

    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : fallbackFactory();
  } catch {
    return fallbackFactory();
  }
}

export function saveLearningState(state) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is an enhancement; the lesson remains usable if storage fails.
  }
}

export function clearLearningState() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures so reset never breaks the lesson.
  }
}
