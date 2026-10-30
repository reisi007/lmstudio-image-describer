# AGENTS.md

A localized React SPA that sends client-side optimized images to a local LM Studio
vision model and renders structured, type-safe JSON results.

## Rules only, no decisions

This file contains rules only — instructions that apply to any work in this repo.
Durable decisions, rationale, measurements and history do not belong here but in
`docs/`/`features/` (or the project docs); open work goes to `AGENTS.todo.md`,
settled matters to git history.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React 19 |
| Language | TypeScript (strict, `tsc -b`) |
| Styling | Tailwind CSS v4 + daisyUI v5 |
| Data fetching | SWR (LM Studio heartbeat polling) |
| Forms | React Hook Form |
| i18n | i18next + react-i18next (en, de, hu) |
| Linting | ESLint (flat config) |

## React Compiler

The React Compiler is enabled in `vite.config.ts` via the `reactCompilerPreset()`
Babel preset, which memoizes automatically:

- Do NOT use `useMemo`, `useCallback`, `React.memo`, or `forwardRef`.
- Write plain functions and derive values inline; the compiler handles
  memoization, preserving React semantics (including Rules of Hooks).

## Scripts

```bash
pnpm dev       # Vite dev server
pnpm build     # tsc -b && vite build
pnpm lint      # eslint .
pnpm preview   # vite preview (serves dist)
```

## Conventions

- English only: code, comments, commit messages, UI strings (via i18n).
- Strict TypeScript, no `any`. Use `verbatimModuleSyntax` (type-only imports).
- No comments unless necessary for non-obvious logic.
- Use daisyUI semantic color classes; never raw Tailwind colors for themed UI.
- All image analysis is local via LM Studio (`http://localhost:1234/v1/chat/completions`),
  model alias `local-model`. CORS must be enabled on the LM Studio server.
- `vite.config.ts` reads `BASE_PATH` env var for the base URL (`process.env.BASE_PATH || '/'`),
  used when deploying under a sub-path (e.g. GitHub Pages).
- Verification after any change: `pnpm typecheck` (via `tsc -b`), `pnpm build`,
  `pnpm lint`. This list is the repo-specific part only. The flow around it — pull,
  delegate, verify, commit, push, watch CI — is defined by the central skill
  `build-verify` (agents-skills; core rule `.agents/rules/build-verify.md`).
  Do not restate or override that flow here; change it there.

## Gates

Regeln dieser Ebene. Was nur ein Verzeichnis betrifft, gehört in die
`AGENTS.md` **dieses** Verzeichnisses — sie wird geladen, wenn eine Datei
daraus gelesen wird.

Ein Plan in `docs/plans/` beginnt mit `**Status:** Plan | In Arbeit | Done |
Empfehlung, nicht implementiert`.

Die kanonischen Agent-Regeln laufen über `ratchet` (Preset `agent-rules`):
`ratchet check` vor jedem Commit und in der CI.
