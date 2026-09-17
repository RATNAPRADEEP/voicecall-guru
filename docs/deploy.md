# VoiceCall Guru — AWS Deployment Runbook

This runbook is intentionally explicit so the cloud path can be verified before it is presented as live in the demo.

## 1. Prerequisites

Install/configure:

- AWS CLI with credentials for the target AWS account
- AWS SAM CLI
- Node.js
- npm

Verify the active AWS identity before deployment:

```bash
aws sts get-caller-identity
```

## 2. Build the backend

From the repository root:

```bash
cd backend
npm install
npm run check
cd ..
```

## 3. Validate and deploy the SAM stack

From the repository root:

```bash
sam validate --template-file infrastructure/template.yaml
sam build --template-file infrastructure/template.yaml
sam deploy --guided --template-file .aws-sam/build/template.yaml
```

Choose a dedicated stack name such as `voicecall-guru` and record the `LearnerApiUrl` output.

## 4. Connect the frontend

Create `frontend/.env.local` locally (do not commit credentials or secrets):

```text
VITE_API_BASE_URL=<LearnerApiUrl>
```

Then:

```bash
cd frontend
npm install
npm test
npm run build
npm run dev
```

## 5. End-to-end verification

Use the browser and verify all of these:

1. Start with a fresh learner.
2. Complete the phone → daughter → call flow.
3. Confirm the UI changes assistance from Guide toward less assistance on practice attempts.
4. Refresh the browser.
5. Confirm the learner state is restored from DynamoDB.
6. Cause a failed API request and confirm the lesson still works locally.
7. Reset the practice and confirm the reset state is persisted.

## 6. Evidence to capture

Record:

- successful SAM deployment output,
- `LearnerApiUrl`,
- DynamoDB learner item after completion,
- browser cloud status changing to `Cloud synced`,
- refresh followed by `Cloud progress restored`,
- CI passing on the repository.

Only the evidence actually observed during the final test should be shown or claimed in the submission.

## 7. Important security rule

The hackathon demo learner is synthetic. Do not upload real contact lists, call recordings, personal phone numbers, or other unnecessary personal information to the demo table.
