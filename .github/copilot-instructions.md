# Copilot Instructions for 2kcut_saloon

## Build, lint, and test commands

Run from repository root:

| Task | Command | Notes |
| --- | --- | --- |
| Install dependencies | `npm install` | Uses `package-lock.json` |
| Start dev server | `npm run dev` | Next.js dev server |
| Production build | `npm run build` | Next.js production build |
| Start production server | `npm run start` | Requires a completed build |
| Lint all files | `npm run lint` | Runs ESLint with Next core-web-vitals + TS config |
| Lint one file | `npx eslint app/page.tsx` | Use this pattern for targeted linting |

Testing status:
- No test runner or `test` script is currently configured in `package.json`.
- Single-test command is not available until a test framework is added.

## High-level architecture

- This is a Next.js App Router app (Next 16) with a single route rendered from `app/page.tsx`.
- `app/layout.tsx` is the root layout: it defines global metadata and loads Google fonts (`Hanken_Grotesk`, `Libre_Caslon_Text`) as CSS variables.
- `app/globals.css` defines design tokens (`--background`, `--foreground`) and maps them into Tailwind v4 theme variables via `@theme inline`.
- The homepage is a single long-form landing page split into sections (`#home`, `#services`, `#about`, `#gallery`, `#contact`) navigated by anchor links.
- Content structures (`services`, `gallery`, `stats`) live in `app/page.tsx` as in-file arrays and are rendered with `.map(...)`.
- Remote images are rendered with `next/image`; `next.config.ts` only allows `https://lh3.googleusercontent.com` in `images.remotePatterns`.

## Key codebase conventions

- Treat this project as **Next.js 16-specific**. `CLAUDE.md` explicitly warns to check `node_modules/next/dist/docs/` for breaking changes before implementing framework-level work.
- Keep brand styling consistent with existing direct utility usage (custom hex colors and tracking classes) rather than introducing a separate token system ad hoc.
- Keep section anchors and nav labels aligned: changing section IDs requires updating corresponding `href="#..."` links.
- Continue using `next/image` for both local assets (`/public/images/...`) and allowed remote assets; if a new remote host is needed, add it in `next.config.ts`.
- Preserve the current font pipeline: define fonts in `app/layout.tsx`, expose as CSS variables, and consume through `globals.css`/Tailwind theme variables.
