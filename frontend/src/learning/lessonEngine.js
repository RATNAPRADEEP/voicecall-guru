export const LESSON = [
  { id: 'phone', label: 'Open the phone', prompt: 'Find the green phone picture.' },
  { id: 'contact', label: 'Choose your daughter', prompt: "Touch your daughter's picture." },
  { id: 'call', label: 'Start the call', prompt: 'Touch the green call button.' }
];

export const ASSISTANCE = {
  1: 'Independent',
  2: 'Hint',
  3: 'Guide'
};

export function createInitialLearningState() {
  return {
    stepIndex: 0,
    attempt: 1,
    assistance: 3,
    mistakes: 0,
    completed: false,
    message: ''
  };
}

export function getStepInstruction(state) {
  const step = LESSON[state.stepIndex];
  if (!step) return '';

  if (state.assistance === 3) {
    return `Look here. ${step.prompt}`;
  }

  if (state.assistance === 2) {
    return step.prompt;
  }

  return step.label + '.';
}

export function applyAction(state, action) {
  if (state.completed) return state;

  const expected = LESSON[state.stepIndex].id;

  if (action !== expected) {
    return {
      ...state,
      mistakes: state.mistakes + 1,
      assistance: Math.min(3, state.assistance + 1),
      message: 'That is not the step yet. I will give you a little more help.'
    };
  }

  if (state.stepIndex === LESSON.length - 1) {
    return {
      ...state,
      completed: true,
      message: 'Great! You completed the call task.'
    };
  }

  return {
    ...state,
    stepIndex: state.stepIndex + 1,
    message: 'Good job. Now follow the next instruction.'
  };
}

export function startNextAttempt(state) {
  return {
    ...state,
    stepIndex: 0,
    attempt: state.attempt + 1,
    assistance: Math.max(1, state.assistance - 1),
    completed: false,
    message: 'Try the same task again. You will get less help this time.'
  };
}

export function getMasteryLabel(state) {
  if (state.completed && state.assistance === 1) return 'Independent';
  if (state.completed) return 'Complete';
  if (state.attempt >= 3 && state.assistance === 1) return 'Independent practice';
  return 'Learning';
}
