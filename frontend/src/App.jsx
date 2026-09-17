import { useMemo, useState } from 'react';

const STEPS = [
  { id: 'phone', label: 'Open the phone', prompt: 'Find the green phone picture.' },
  { id: 'contact', label: 'Choose your daughter', prompt: 'Touch your daughter\'s picture.' },
  { id: 'call', label: 'Start the call', prompt: 'Touch the green call button.' }
];

const ASSISTANCE = {
  1: 'Guide',
  2: 'Hint',
  3: 'Independent'
};

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [assistance, setAssistance] = useState(3);
  const [message, setMessage] = useState('');
  const [completed, setCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const step = STEPS[stepIndex];
  const progress = useMemo(() => `${stepIndex + (completed ? 1 : 0)} / ${STEPS.length}`, [stepIndex, completed]);

  function resetForNextAttempt() {
    setStepIndex(0);
    setCompleted(false);
    setMessage('Try the same task again. You will get less help this time.');
    setAttempt((value) => value + 1);
    setAssistance((value) => Math.max(1, value - 1));
  }

  function handleAction(action) {
    if (completed) return;

    const expected = step.id;
    if (action !== expected) {
      setMistakes((value) => value + 1);
      setAssistance((value) => Math.min(3, value + 1));
      setMessage('That is not the step yet. Look for the highlighted action.');
      return;
    }

    if (stepIndex === STEPS.length - 1) {
      setCompleted(true);
      setMessage('Great! You completed the call task.');
      return;
    }

    setStepIndex((value) => value + 1);
    setMessage('Good job. Now follow the next instruction.');
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">ADAPTIVE SMARTPHONE TEACHER</p>
          <h1>VoiceCall Guru</h1>
          <p className="tagline">Teach → Observe → Adapt → Repeat → Fade</p>
        </div>
        <div className="status-pill">Attempt {attempt}</div>
      </section>

      <section className="dashboard">
        <aside className="learning-panel">
          <p className="section-label">TODAY'S LESSON</p>
          <h2>Call your daughter</h2>
          <p className="instruction">{completed ? 'You did it independently.' : step.prompt}</p>
          <div className="progress-row">
            <span>Step {progress}</span>
            <span>{ASSISTANCE[assistance]}</span>
          </div>
          <div className="progress-track"><span style={{ width: `${completed ? 100 : ((stepIndex) / STEPS.length) * 100}%` }} /></div>
          <div className="feedback" aria-live="polite">{message || 'Listen to the instruction, then touch the correct picture.'}</div>
          {completed && (
            <button className="primary-button" onClick={resetForNextAttempt}>
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
                <button className={step.id === 'phone' ? 'phone-action target' : 'phone-action'} onClick={() => handleAction('phone')} aria-label="Phone">
                  <span className="icon phone-icon">☎</span><span>Phone</span>
                </button>
                <button className="phone-action" onClick={() => handleAction('wrong')} aria-label="Messages">
                  <span className="icon">✉</span><span>Messages</span>
                </button>
              </div>

              {step.id !== 'phone' && !completed && (
                <div className="contacts-view">
                  <p className="mini-title">Contacts</p>
                  <button className={step.id === 'contact' ? 'contact-card target' : 'contact-card'} onClick={() => handleAction('contact')}>
                    <span className="avatar">👩</span><span><strong>Daughter</strong><small>Family</small></span>
                  </button>
                  <button className="contact-card" onClick={() => handleAction('wrong')}>
                    <span className="avatar">👨</span><span><strong>Brother</strong><small>Family</small></span>
                  </button>
                </div>
              )}

              {step.id === 'call' && !completed && (
                <button className="call-button target" onClick={() => handleAction('call')}>☎ Call</button>
              )}

              {completed && <div className="success-view"><div className="success-icon">✓</div><h3>Call started</h3><p>Task mastered for this attempt.</p></div>}
            </div>
            <div className="phone-home" />
          </div>
        </section>
      </section>

      <section className="proof-strip">
        <div><strong>{attempt}</strong><span>attempts</span></div>
        <div><strong>{mistakes}</strong><span>mistakes recovered</span></div>
        <div><strong>{ASSISTANCE[assistance]}</strong><span>current assistance</span></div>
        <div><strong>{completed ? 'Complete' : 'Learning'}</strong><span>mastery state</span></div>
      </section>
    </main>
  );
}
