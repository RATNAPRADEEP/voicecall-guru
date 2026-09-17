# VoiceCall Guru — Judge Proof Checklist

The submission should make the product behavior verifiable from the repository and three-minute demo.

## Product proof

- Show one complete phone-call learning task.
- Deliberately make one wrong action.
- Show the system recovering with stronger guidance.
- Complete the task.
- Start the same task again.
- Show that assistance is reduced on the next attempt.
- Show the learner's attempt, mistakes, assistance, and mastery state.

## AWS proof

The repository contains the AWS persistence path:

`React → persistence adapter → API → Lambda → DynamoDB`

The infrastructure definition creates the learner table and HTTP API and passes the table name to the Lambda through an environment variable.

During the final demo, only claim cloud behavior that has actually been deployed and tested. If AWS is not live, demonstrate the deterministic simulator and clearly label cloud integration as implemented infrastructure rather than a live feature.

## AI proof

AI is intentionally bounded. It may be used for language adaptation in a future/optional layer, but it does not choose arbitrary phone actions or control the simulator.

The deterministic learning engine remains responsible for task progression and action validation.

## Metrics proof

Use measured engineering behavior rather than invented user-study statistics. Useful demo metrics include:

- attempt number,
- mistakes recovered,
- assistance level,
- steps completed,
- mastery state,
- persistence status.

## Three-minute narrative

**0:00–0:20 — Problem**

People with low digital literacy can know what they want to do but still struggle to navigate a text-heavy smartphone workflow.

**0:20–0:40 — Product**

VoiceCall Guru teaches one task through visual and guided interaction, observes the learner's actions, adapts assistance, remembers progress, and fades help.

**0:40–1:30 — First attempt**

Show the phone icon, an intentional wrong tap, recovery guidance, daughter contact, and call action.

**1:30–1:55 — Second attempt**

Repeat the same task with less assistance.

**1:55–2:15 — Independence**

Show the learner completing the task with minimal guidance.

**2:15–2:40 — Architecture**

Explain the deterministic learning engine and the optional cloud persistence path.

**2:40–2:55 — Evidence**

Show assistance decreasing and learner progress being persisted.

**2:55–3:00 — Close**

“We don't just help someone complete the task once. We teach them until they need less help.”
