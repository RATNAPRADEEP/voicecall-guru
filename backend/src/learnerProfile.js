const DEFAULT_PROFILE = Object.freeze({
  learnerId: 'demo-learner',
  language: 'en-IN',
  assistance: 3,
  masteredSkills: [],
  attempts: 0,
  mistakes: 0,
});

export function createLearnerProfile(overrides = {}) {
  return {
    ...DEFAULT_PROFILE,
    ...overrides,
    masteredSkills: [...(overrides.masteredSkills || DEFAULT_PROFILE.masteredSkills)],
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
    assistance: Number(item.assistance),
    masteredSkills: item.masteredSkills || [],
    attempts: Number(item.attempts),
    mistakes: Number(item.mistakes),
  });
}
