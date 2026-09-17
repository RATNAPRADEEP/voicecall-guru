const DEFAULT_PROFILE = Object.freeze({
  learnerId: 'demo-learner',
  language: 'en-IN',
  assistance: 3,
  masteredSkills: [],
  attempts: 1,
  mistakes: 0,
});

const ALLOWED_LANGUAGES = new Set(['en-IN', 'te-IN', 'hi-IN']);
const ALLOWED_SKILLS = new Set(['phone_icon', 'contact_photo', 'call_button']);
const MAX_ATTEMPTS = 10000;
const MAX_MISTAKES = 10000;

function clampInteger(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isInteger(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeLearnerId(value) {
  const learnerId = String(value || DEFAULT_PROFILE.learnerId);
  return /^[A-Za-z0-9_-]{1,64}$/.test(learnerId) ? learnerId : DEFAULT_PROFILE.learnerId;
}

function normalizeSkills(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((skill) => ALLOWED_SKILLS.has(skill)))];
}

export function createLearnerProfile(overrides = {}) {
  const language = ALLOWED_LANGUAGES.has(overrides.language) ? overrides.language : DEFAULT_PROFILE.language;

  return {
    learnerId: normalizeLearnerId(overrides.learnerId),
    language,
    assistance: clampInteger(overrides.assistance, 1, 3, DEFAULT_PROFILE.assistance),
    masteredSkills: normalizeSkills(overrides.masteredSkills),
    attempts: clampInteger(overrides.attempts, 1, MAX_ATTEMPTS, DEFAULT_PROFILE.attempts),
    mistakes: clampInteger(overrides.mistakes, 0, MAX_MISTAKES, DEFAULT_PROFILE.mistakes),
  };
}

export function toDynamoItem(profile) {
  return {
    learnerId: profile.learnerId,
    language: profile.language,
    assistance: profile.assistance,
    masteredSkills: profile.masteredSkills,
    attempts: profile.attempts,
    mistakes: profile.mistakes,
  };
}

export function fromDynamoItem(item) {
  if (!item) return null;
  return createLearnerProfile({
    learnerId: item.learnerId,
    language: item.language,
    assistance: item.assistance,
    masteredSkills: item.masteredSkills || [],
    attempts: item.attempts,
    mistakes: item.mistakes,
  });
}
