# BeBetter.ai

Short description: BeBetter.ai is a Next.js TypeScript application that provides interview practice agents, mock tests, chatbots, resume analysis and feedback, and premium/subscription gating. It uses TRPC for server APIs, Drizzle ORM with a Postgres-compatible database, and Better-Auth (Polar) for authentication and subscriptions.

## Live Demo

- https://be-better-ai.vercel.app

## Video Demo

- https://1drv.ms/v/c/31a9485100315802/IQD6DyXcodyBToQbMPwfcX7bAf66asp1IBBo64OM-J7-NFg?e=bVt0bB


## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS and styled-components (UI primitives/components under `components/ui`)
- API: Next.js Route Handlers + tRPC (server + client)
- Database: PostgreSQL (Drizzle ORM + drizzle-kit), Neon-compatible usage via `drizzle-orm/neon-http`
- Auth & Billing: `better-auth` with Polar integration (social providers: GitHub, Google + email/password)
- Background / Tasks: Inngest functions used for async jobs
- AI / LLM: Gemini / OpenAI adapters via helper libs and LangChain-related packages
- File Uploads: ImageKit integration for resume uploads
- Other: TanStack React Query, Zod, NanoID, Inngest, Drizzle-kit

## Key Features

- Authentication & Accounts
	- Email/password and social login (GitHub, Google) using `better-auth` and Drizzle database adapter
	- Polar integration for subscriptions/checkout and portal
- TRPC API surface for client <-> server RPC
- Interview agents
	- Create and run interview-style agents, transcripts, and feedback generation
	- Stores transcripts and structured interview feedback
- Chat system
	- Chat creation and message storage with speaker enum and sequencing
- Resume analysis / feedback
	- Upload resumes (PDF), store metadata, and run resume analysis feedback
- Mock tests
	- Create mock tests, questions, user answers and aggregated results
- Jobs search endpoint (using Adzuna API keys) under `/api/jobs`
- Upload handler for resumes integrating ImageKit (`/api/upload-resume`)
- Inngest-based serverless/background functions for asynchronous processing (e.g. feedback generation)

## Architecture Overview

This is a full-stack Next.js App Router project that follows a server-centric architecture:

- UI: React + Next.js app pages/components in `app/` and `components/`
- Server APIs: Next.js Route Handlers in `app/api/*` and a TRPC router exposed at `/api/trpc`
- Database: Drizzle ORM schema defined in `db/schema.ts` and a Drizzle client in `db/index.ts` (connected via `process.env.DATABASE_URL`)
- Auth & Billing: `lib/auth.ts` configures `better-auth` with Polar + social providers and uses a Drizzle adapter
- Background jobs: `inngest/functions` contains functions invoked asynchronously
- Domain layers: `modules/*` contains server-side procedures and domain logic for agents, chat, resume, mock-tests, premium, etc.

## Folder Structure (overview)

- `app/` — Next.js App Router pages, layouts, and API route handlers
- `components/` — Reusable UI components and primitives (Radix + custom UI)
- `db/` — Drizzle ORM schema (`schema.ts`) and DB client (`index.ts`)
- `lib/` — Application libraries and helpers (auth config, AI brains, analyzers, TTS, prompts)
- `modules/` — Feature modules (agents, chatbot, mock-test, resume, premium) including server procedures used by TRPC
- `trpc/` — tRPC initialization and routers (app router composed from `modules`)
- `inngest/` — Inngest client and serverless functions
- `public/` — Static assets

## Database schema (high level)

Defined in `db/schema.ts` (Drizzle):

- `user`, `session`, `account`, `verification` — core auth/account tables
- `agents` — interview agents configuration
- `session_transcripts` — transcripts per agent with speaker enum
- `interview_feedback` — structured interview feedback (JSONB)
- `chat`, `chat_message` — chat metadata and messages
- `resume_feedback` — resume analysis results (JSONB) with file metadata
- `mock_test`, `mock_test_questions`, `mock_test_user_answer`, `mock_test_overall_result` — mock-test domain tables
- `user_usage` — counters to enforce free-tier limits (used by premium checks)

For full table definitions see: `db/schema.ts`.

## API Routes

Notable route handlers under `app/api/`:

- `app/api/auth/[...all]/route.ts` — authentication endpoints (Better-Auth)
- `app/api/trpc/[trpc]/route.ts` — tRPC handler (router composed in `trpc/routers/_app.ts`)
- `app/api/chatbot/route.ts` — chatbot endpoint
- `app/api/generate-quies/route.ts` — question generation endpoint
- `app/api/inngest/route.ts` — inngest webhook endpoint
- `app/api/upload-resume/route.ts` — resume upload to ImageKit
- `app/api/jobs/route.ts` — jobs search (Adzuna)
- `app/api/interview/route.ts` and `app/api/interview-feedback/route.ts` — interview endpoints
- `app/api/insert-mock-test-result/route.ts` — mock test result insertion

TRPC routers (exposed at `/api/trpc` via `appRouter`) include:

- `agents`, `transcript`, `chat`, `chatMessage`, `resume`, `mockTest`, `mockTestQuestions`, `mockTestUserAnswer`, `mockTestOverallFeedback`, `premium`, `interviewFeedback`

See `trpc/routers/_app.ts` for the router composition.

## Environment Variables (.env.example)

Create a `.env` based on the keys below. Add secrets in your deployment provider.

```
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Polar (billing & better-auth)
POLAR_ACCESS_TOKEN=

# Social auth (GitHub, Google)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# LLM / AI keys
GEMINI_API_KEY=
GEMINI_API_KEY_FOR_CHATBOT=
OPENROUTER_API_KEY=

# ImageKit (resume uploads)
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Jobs API (Adzuna)
ADZUNA_APP_ID=
ADZUNA_API_KEY=

# Public keys usable in the browser (prefix with NEXT_PUBLIC_)
NEXT_PUBLIC_SARVAM_API_KEY=
NEXT_PUBLIC_APP_URL=

# Any other environment variables required by your provider (e.g., Vercel)
```

Only include the keys you need. The project reads multiple env vars across `lib/` and `app/api/*` — see `grep "process.env"` if you need a complete list.

## Available NPM scripts

From `package.json`:

- `dev` — Start Next.js in development mode (`next dev`)
- `build` — Build the Next.js app (`next build`)
- `start` — Start production server (`next start`)
- `lint` — Run ESLint (`eslint`)
- `db:studio` — Start `drizzle-kit studio` (database GUI)
- `db:push` — Push schema changes using `drizzle-kit push`

Example:

```
npm run dev
```

## Setup & Installation (local)

1. Clone the repo

```
git clone <repo-url>
cd bebetter.ai
```

2. Install dependencies

```
npm install --legacy-peer-deps
```

3. Create `.env` from `.env.example` and populate required secrets

4. Prepare DB (if using a hosted Postgres / Neon):

```
# push schema (drizzle-kit)
npm run db:push

# optional: open drizzle studio
npm run db:studio
```

5. Run development server

```
npm run dev
```

Then open http://localhost:3000

## Build & Production

Build and start:

```
npm run build
npm run start
```

When deploying, ensure `DATABASE_URL` and all provider secrets are set in your host's environment.

## Deployment

Recommended: deploy to a Next.js-friendly host such as Vercel.

General steps for Vercel:

1. Create a Vercel project pointing to this repository.
2. Add the environment variables from `.env.example` in the Vercel project settings.
3. Use the default build command (`npm run build`) and output settings (Next.js)

Alternative: containerize with Docker (not included in this repo) or deploy to any Node host that supports Next.js.

Notes:

- Drizzle/Neon/Postgres: ensure `DATABASE_URL` uses the correct connection string for your provider.
- Polar/Billing: `POLAR_ACCESS_TOKEN` must be configured for subscription features to work.

## Running tests

This repository does not include a test suite by default. Add unit / integration tests and CI as needed.

## Future Improvements

- Add an automated test suite (unit + integration + end-to-end)
- Add CI (GitHub Actions) with linting and build checks
- Dockerfile + docker-compose for local reproducible development
- Add healthchecks and observability (OpenTelemetry / monitoring)
- Add more sample data and seed scripts to speed development
- Improve README with screenshots and API examples (request/response)

## Contributing

- Fork the repository and open a pull request with a clear description of changes.
- Follow existing code style and run `npm run lint` before submitting.
- For larger features, open an issue first to discuss the design.

## License

This repository does not contain a license file. If you want to open-source it, consider adding a `LICENSE` (for example, MIT).

---

If you'd like, I can also:

- generate a `.env.example` file in the repo with the keys above
- add a basic `Dockerfile` and `docker-compose.yml` for local development
- produce example requests for the TRPC/route handlers

Tell me which of these you'd like next.
