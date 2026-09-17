# VoiceCall Guru — Reliability Contract

VoiceCall Guru is designed so the core learning task remains usable even when optional cloud services fail.

## Failure handling

| Failure | Expected behavior |
|---|---|
| Wrong learner action | Record a mistake, increase assistance, explain the expected action, allow retry |
| Repeated wrong actions | Continue bounded assistance escalation; never execute an unapproved action |
| Browser storage unavailable | Continue the current session in memory |
| Cloud GET fails | Continue with local learner state |
| Cloud PUT fails | Keep local state and show local fallback status |
| Cloud response is malformed | Ignore invalid profile and preserve usable local state |
| Optional AI unavailable | Use deterministic instruction templates |
| Core voice asset unavailable | Use the visible instruction path; do not block the lesson |

## Safety boundary

The simulator accepts only known lesson actions: `phone`, `contact`, `call`, and deliberate `wrong` test actions. The learning engine, not a generative model, decides which action is valid.

## Persistence boundary

Local browser persistence is the immediate fallback. Cloud persistence is an enhancement for learner continuity across sessions. A cloud outage must not prevent the core lesson from running.

## Demo reliability rule

The three-minute demonstration must be reproducible without depending on a live generative-AI response. If optional cloud or AI components are unavailable, the deterministic lesson must still demonstrate:

1. a wrong action,
2. recovery guidance,
3. successful completion,
4. a second attempt with reduced assistance.

## Engineering evidence

CI validates the frontend build and backend JavaScript syntax. Functional learning-engine tests cover initial state, wrong-action recovery, successful progression, completion, and assistance reduction.
