import React, { useEffect, useReducer, useState } from 'react';
import {
  ASSISTANCE,
  LESSON,
  applyAction,
  createInitialLearningState,
  getMasteryLabel,
  getStepInstruction,
  startNextAttempt
} from './learning/lessonEngine';
import { clearLearningState, loadLearningState, saveLearningState } from './learning/persistence';
import { isCloudPersistenceConfigured, loadCloudLearner, saveCloudLearner } from './learning/apiClient';

const LEARNER_ID = 'demo-learner';

function profileToLearningState(profile, fallback) {
  if (!profile) return fallback;

  const mastered = new Set(profile.masteredSkills || []);
  const completed = mastered.has('call_button');
  const stepIndex = completed ? LESSON.length - 1 : mastered.has('contact_photo') ? 2 : mastered.has('phone_icon') ? 1 : 0;

  return {
    ...fallback,
    stepIndex,
    attempt: Math.max(1, Number(profile.attempts) || 1),
    assistance: Math.min(3, Math.max(1, Number(profile.assistance) || 3)),
    mistakes: Math.max(0, Number(profile.mistakes) || 0),
    completed,
    message: completed ? 'You did it independently.' : 'Your progress was restored from the cloud.'
  };
}

function hasCloudProgress(profile) {
  return Boolean(
    profile &&
    ((profile.masteredSkills || []).length > 0 || Number(profile.attempts) > 1 || Number(profile.mistakes) > 0)
  );
}

function stateToLearnerProfile(state) {
  const masteredSkills = [];
  if (state.stepIndex >= 1 || state.completed) masteredSkills.push('phone_icon');
  if (state.stepIndex >= 2 || state.completed) masteredSkills.push('contact_photo');
  if (state.completed) masteredSkills.push('call_button');

  return {
    learnerId: LEARNER_ID,
    language: 'en-IN',
    assistance: state.assistance,
    masteredSkills,
    attempts: state.attempt,
    mistakes: state.mistakes
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ACTION': return applyAction(state, action.value);
    case 'NEXT_ATTEMPT': return startNextAttempt(state);
    case 'HYDRATE_PROFILE': return profileToLearningState(action.profile, state);
    case 'RESET': return createInitialLearningState();
    default: return state;
  }
}

function actionClass(base, stepId, state) {
  if (state.completed || stepId !== LESSON[state.stepIndex]?.id) return base;
  if (state.assistance === 3) return `${base} target`;
  if (state.assistance === 2) return `${base} hint`;
  return base;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    loadLearningState(createInitialLearningState)
  );
  const [cloudStatus, setCloudStatus] = useState(isCloudPersistenceConfigured() ? 'Connecting…' : 'Local practice');
  const [cloudLoaded, setCloudLoaded] = useState(!isCloudPersistenceConfigured());
  const step = LESSON[state.stepIndex];
  const displayedStep = state.completed ? LESSON.length : state.stepIndex + 1;
  const progressPercent = state.completed ? 100 : (state.stepIndex / LESSON.length) * 100;

  useEffect(() => {
    saveLearningState(state);
  }, [state]);

  useEffect(() => {
    if (!isCloudPersistenceConfigured()) return undefined;

    const controller = new AbortController();
    loadCloudLearner(LEARNER_ID, controller.signal)
      .then((profile) => {
        if (hasCloudProgress(profile)) dispatch({ type: 'HYDRATE_PROFILE', profile });
        setCloudLoaded(true);
        setCloudStatus(hasCloudProgress(profile) ? 'Cloud progress restored' : 'Cloud connected');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setCloudLoaded(true);
        setCloudStatus('Local fallback');
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!cloudLoaded || !isCloudPersistenceConfigured()) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      saveCloudLearner(LEARNER_ID, stateToLearnerProfile(state), controller.signal)
        .then(() => setCloudStatus('Cloud synced'))
        .catch((error) => {
          if (error.name !== 'AbortError') setCloudStatus('Local fallback');
        });
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [state, cloudLoaded]);

  function handleAction(action) {
    dispatch({ type: 'ACTION', value: action });
  }

  function resetProgress() {
    clearLearningState();
    dispatch({ type: 'RESET' });
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">ADAPTIVE SMARTPHONE TEACHER</p>
          <h1>VoiceCall Guru</h1>
          <p className="tagline">Teach → Observe → Adapt → Repeat → Fade</p>
        </div>
        <div className="status-pill">Attempt {state.attempt}</div>
      </section>

      <section className="dashboard">
        <aside className="learning-panel">
          <p className="section-label">TODAY'S LESSON</p>
          <h2>Call your daughter</h2>
          <p className="instruction">
            {state.completed ? 'You did it independently.' : getStepInstruction(state)}
          </p>
          <div className="progress-row">
            <span>Step {displayedStep} / {LESSON.length}</span>
            <span>{ASSISTANCE[state.assistance]}</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="feedback" aria-live="polite">
            {state.message || 'Listen to the instruction, then touch the correct picture.'}
          </div>
          {state.completed && (
            <button className="primary-button" onClick={() => dispatch({ type: 'NEXT_ATTEMPT' })}>
              Practice Again — Less Help
            </button>
          )}
          <button className="secondary-button" onClick={resetProgress}>
            Reset Practice
          </button>
          <p className="persistence-status" aria-live="polite">{cloudStatus}</p>
        </aside>

        <section className="phone-stage" aria-label="Smartphone simulator">
          <div className="phone">
            <div className="phone-speaker" />
            <div className="phone-screen">
              <div className="phone-topbar"><span>9:41</span><span>● ● ▰</span></div>
              <div className="phone-title">Phone</div>
              <div className="phone-grid">
                <button
                  className={actionClass('phone-action', 'phone', state)}
                  onClick={() => handleAction('phone')}
                  aria-label="Phone"
                >
                  <span className="icon phone-icon">☎</span><span>Phone</span>
                </button>
                <button className="phone-action" onClick={() => handleAction('wrong')} aria-label="Messages">
                  <span className="icon">✉</span><span>Messages</span>
                </button>
              </div>

              {step.id !== 'phone' && !state.completed && (
                <div className="contacts-view">
                  <p className="mini-title">Contacts</p>
                  <button className={actionClass('contact-card', 'contact', state)} onClick={() => handleAction('contact')}>
                    <span className="avatar">👩</span>
                    <span><strong>Daughter</strong><small>Family</small></span>
                  </button>
                  <button className="contact-card" onClick={() => handleAction('wrong')}>
                    <span className="avatar">👨</span>
                    <span><strong>Brother</strong><small>Family</small></span>
                  </button>
                </div>
              )}

              {step.id === 'call' && !state.completed && (
                <button className={actionClass('call-button', 'call', state)} onClick={() => handleAction('call')}>☎ Call</button>
              )}

              {state.completed && (
                <div className="success-view">
                  <div className="success-icon">✓</div>
                  <h3>Call started</h3>
                  <p>Task mastered for this attempt.</p>
                </div>
              )}
            </div>
            <div className="phone-home" />
          </div>
        </section>
      </section>

      <section className="proof-strip">
        <div><strong>{state.attempt}</strong><span>attempts</span></div>
        <div><strong>{state.mistakes}</strong><span>mistakes recovered</span></div>
        <div><strong>{ASSISTANCE[state.assistance]}</strong><span>current assistance</span></div>
        <div><strong>{getMasteryLabel(state)}</strong><span>mastery state</span></div>
      </section>
    </main>
  );
}
