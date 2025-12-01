# Repository Guidelines

## Project Structure & Module Organization
The Next.js app router lives in `app/` with route groups such as `(auth)`, `checkout`, and `dashboard`, plus `layout.tsx` and `globals.css`. Shared UI, stores, and domain helpers sit in `src/components`, `src/stores`, `src/lib`, and `src/types`; import them through the `@/` aliases configured in `tsconfig.json`. Serve assets from `public/` and keep non-served references in `static/`. Repository-level plumbing (`middleware.ts`, `tailwind.config*.js`, `vercel.json`) and stakeholder documentation in `docs/` round out the structure.

## Build, Test & Development Commands
Use Node 20+ with pnpm 9+. Install dependencies once via `pnpm install`. Run `pnpm dev` for the local server, `pnpm build` to produce the optimized output, and `pnpm start` to boot that build. Guard quality with `pnpm lint`, `pnpm format:check`, and `pnpm type-check` (strict `tsc --noEmit`). Execute Jest suites through `pnpm test` or stay iterative with `pnpm test:watch`.

## Coding Style & Naming Conventions
Stay in strict TypeScript; share contracts from `src/types` and avoid `any` unless you document the reason. Components, hooks, and stores use PascalCase filenames (e.g., `src/components/chat/CategoryChip.tsx`), while folders remain lowercase. ESLint extends `next/core-web-vitals` and warns on unused vars unless they begin with `_`. Prettier plus `prettier-plugin-tailwindcss` locks two-space indentation, ~80-character wrapping, and ordered utility classes—run `pnpm format` before every commit.

## Testing Guidelines
Jest with `ts-jest` (see `jest.config.js`) targets files in `src/**/__tests__` that end with `.test.ts` or `.spec.ts`. Prefer Testing Library helpers for component behavior and keep server utilities pure to work in the default Node environment. Add regression coverage when editing `src/lib/payment` or `src/lib/server`. Always run `pnpm test` and `pnpm type-check`, then manually step through chat, checkout, and auth flows whenever UI changes could escape automation.

## Commit & Pull Request Guidelines
Recent history shows short, imperative commits such as “Add Cyber Monday free access mode feature”; mirror that tense and keep scope focused. Pull requests must explain user impact, list verification commands (`pnpm lint`, `pnpm test`, etc.), attach screenshots for UI adjustments, and reference the relevant issue or doc. Highlight new environment variables and update `docs/` whenever behavior or copy changes.

## Security & Configuration Tips
Secrets belong in `.env` (gitignored) and the files kept under `credentials/`; populate them using the templates in `docs/01-prd-dobbie.md`. Only expose `process.env.NEXT_PUBLIC_*` values that truly need to reach the browser, keeping everything else inside `app/api` routes or `src/lib/server`. Revisit `middleware.ts` whenever auth or checkout logic changes, and rotate keys through Vercel immediately after local testing.
