# AGENTS.md

A localized React SPA that sends client-side optimized images to a local LM Studio
vision model and renders structured, type-safe JSON results.

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
Babel preset. The compiler memoizes automatically, so manual memoization is an
antipattern:

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
- Verification after any change: `pnpm typecheck` (via `tsc -b`), `pnpm build`, `pnpm lint`.
