import { useReducer } from 'react';
import {
  ASSISTANCE,
  LESSON,
  applyAction,
  createInitialLearningState,
  getMasteryLabel,
  startNextAttempt
} from './learning/lessonEngine';

function reducer(state, action) {
  switch (action.type) {
    case 'ACTION':
      return applyAction(state, action.value);
    case 'NEXT_ATTEMPT':
      return startNextAttempt(state);
    case 'RESET':
      return createInitialLearningState();
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialLearningState);
  const step = LESSON[state.stepIndex];
  const progress = `${state.stepIndex + (state.completed ? 1 : 0)} / ${LESSON.length}`;

  function handleAction(action) {
    dispatch({ type: 'ACTION', value: action });
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
            {state.completed ? 'You did it independently.' : step.prompt}
          </p>
          <div className="progress-row">
            <span>Step {progress}</span>
            <span>{ASSISTANCE[state.assistance]}</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${state.completed ? 100 : (state.stepIndex / LESSON.length) * 100}%` }} />
          </div>
          <div className="feedback" aria-live="polite">
            {state.message || 'Listen to the instruction, then touch the correct picture.'}
          </div>
          {state.completed && (
            <button className="primary-button" onClick={() => dispatch({ type: 'NEXT_ATTEMPT' })}>
              Practice Again — Less Help
            </button>
          )}
        </aside>

        <section className="phone-stage" aria-label="Smartphone simulator">
          <div className="phone">
            <div className="phone-speaker" />
            <div className="phone-screen">
              <div className="phone-topbar"><span>9:41</span><span>● ● ▰</span></div>
              <div className="phone-title">Phone</div>
              <div className="phone-grid">
                <button
                  className={step.id === 'phone' ? 'phone-action target' : 'phone-action'}
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
                  <button
                    className={step.id === 'contact' ? 'contact-card target' : 'contact-card'}
                    onClick={() => handleAction('contact')}
                  >
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
                <button className="call-button target" onClick={() => handleAction('call')}>
                  ☎ Call
                </button>
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
