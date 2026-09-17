import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyAction,
  createInitialLearningState,
  getStepInstruction,
  startNextAttempt,
} from './lessonEngine.js';

test('starts with guided assistance', () => {
  const state = createInitialLearningState();
  assert.equal(state.attempt, 1);
  assert.equal(state.assistance, 3);
  assert.match(getStepInstruction(state), /Look here/);
});

test('wrong action increases assistance and records recovery', () => {
  const state = createInitialLearningState();
  const next = applyAction(state, 'wrong');
  assert.equal(next.mistakes, 1);
  assert.equal(next.assistance, 3);
  assert.match(next.message, /more help/);
});

test('correct actions advance through the three-step lesson', () => {
  let state = createInitialLearningState();
  state = applyAction(state, 'phone');
  assert.equal(state.stepIndex, 1);
  state = applyAction(state, 'contact');
  assert.equal(state.stepIndex, 2);
  state = applyAction(state, 'call');
  assert.equal(state.completed, true);
});

test('practice again reduces assistance but never below independent', () => {
  let state = createInitialLearningState();
  state = { ...state, completed: true, assistance: 3 };
  state = startNextAttempt(state);
  assert.equal(state.attempt, 2);
  assert.equal(state.assistance, 2);
  state = startNextAttempt({ ...state, completed: true });
  assert.equal(state.assistance, 1);
  state = startNextAttempt({ ...state, completed: true });
  assert.equal(state.assistance, 1);
});
