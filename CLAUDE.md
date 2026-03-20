# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint (flat config, v9+)
```

No test framework is configured yet.

## Tech Stack

- **Next.js 16.2.0** (App Router) with React 19 and TypeScript 5
- **Tailwind CSS v4** via `@tailwindcss/postcss` (uses `@import "tailwindcss"` syntax, not v3 `@tailwind` directives)
- **ESLint v9** flat config with `next/core-web-vitals` and `next/typescript` rules

## Architecture

- `app/` — Next.js App Router: layouts, pages, and route handlers live here
- `public/` — Static assets served at root
- Path alias: `@/*` maps to project root

## Critical: Next.js 16 Breaking Changes

This project uses Next.js 16.2.0, which has breaking changes from earlier versions. **Before writing any Next.js code, consult the relevant guide in `node_modules/next/dist/docs/`** — especially under `01-app/` for App Router patterns. Do not rely on pre-trained knowledge of Next.js APIs.
