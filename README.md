# VoiceCall Guru

> **Teach a person how to use a smartphone — then gradually stop helping them.**

VoiceCall Guru is an adaptive smartphone task teacher designed for people with low digital literacy or limited ability to rely on text. The first learning task is simple: **make a phone call to a family member**.

Instead of only telling a learner what to tap, VoiceCall Guru observes the learner's progress, responds to mistakes, remembers what they struggled with, and reduces assistance as they demonstrate mastery.

## Core learning loop

**Teach → Observe → Adapt → Repeat → Fade**

A typical session progresses from:

1. Find the phone icon with strong guidance.
2. Recover from a deliberate wrong tap.
3. Find a family contact using a large photo and voice instruction.
4. Complete the call action.
5. Repeat the task with fewer hints.
6. Reach an independent state where guidance is minimal.

## Why this is different

Existing smartphone accessibility features help people operate devices. VoiceCall Guru focuses on the **teaching and mastery layer**: it teaches a workflow, tracks the learner's difficulty, adapts assistance, and intentionally fades help as skills improve.

The product does not give an AI model unrestricted control over a phone. Deterministic learning logic controls approved actions; AI, where enabled, is limited to language adaptation.

## MVP

The hackathon MVP uses a controlled smartphone simulator so the team can demonstrate the learning system reliably without depending on OEM-specific Android behavior.

### Functional proof

- Guided phone-call lesson
- Visual focus/highlight
- Wrong-action detection
- Recovery hint
- Assistance escalation after failure
- Attempt tracking
- Reduced assistance on later attempts
- Mastery state
- Deterministic fallback behavior

## Architecture

```text
Learner
   │
   ▼
React Smartphone Simulator
   │
   ├── Learning State Machine
   ├── Action Validator
   └── Assistance Controller
   │
   ▼
API / Backend
   │
   ├── AWS Step Functions → lesson orchestration
   ├── Amazon DynamoDB   → learner progress/mastery
   ├── AWS Lambda        → validation/adaptation APIs
   ├── Amazon Polly      → voice instructions
   ├── Amazon S3         → lesson assets
   ├── Amazon Bedrock    → controlled language adaptation (optional)
   └── Amazon CloudWatch → observability
```

## Reliability principles

- Core lesson remains deterministic.
- AI output cannot execute device actions.
- Failed AI/TTS calls have template/cache fallbacks.
- Repeated failure increases assistance.
- Repeated success reduces assistance.
- The demo uses synthetic contacts and does not require real contact lists or recordings.

## Metrics

The system records engineering-level learning signals such as:

- task completion
- attempt count
- incorrect actions
- assistance level
- recovery after mistakes
- mastery state
- time to completion

These metrics demonstrate system behavior; they are not presented as real-world user-study results.

## Hackathon demo

The three-minute demonstration is built around one visible transformation:

**First attempt:** high assistance → mistake → recovery → completion

**Later attempt:** lower assistance → completion

**Mastery:** minimal guidance → learner completes the task independently

## Repository structure

```text
voicecall-guru/
├── frontend/              # React learner experience + smartphone simulator
├── backend/               # API and learning services
├── infrastructure/        # AWS infrastructure definitions
├── docs/                  # architecture, testing, reliability and demo evidence
├── .github/workflows/     # CI
├── README.md
├── LICENSE
└── .gitignore
```

## Development status

This repository is being built during **WeMakeDevs × AWS First Commit 2026**. The implementation and meaningful feature work are created during the event window.

## License

MIT
