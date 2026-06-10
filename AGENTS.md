# Agent Guide

This repository is a reusable Next.js + Sanity boilerplate. It is not a finished website for one client or brand. Treat it as a template that other developers will clone, configure, and adapt for many projects.

## Core Rule

Do not change the core project structure unless the user explicitly asks for a structural change.

The following structure is intentional and should be preserved:

- Root npm workspace with `apps/web` and `apps/studio`.
- Public site code in `apps/web`.
- Sanity Studio code in `apps/studio`.
- Core Sanity documents: `blogPost`, `category`, `author`, `faqItem`, `landingPageSeo`, `redirect`, and `siteSettings`.
- Core Sanity objects: SEO, AI SEO, schema config, redirects, Portable Text, links, images, FAQ lists, analytics, and social defaults.
- Locale-first web routing under `apps/web/src/app/[locale]`.
- Sanity data access through `apps/web/src/sanity/lib` and `apps/web/src/sanity/queries`.
- Metadata through `apps/web/src/seo`.
- JSON-LD through `apps/web/src/seo/schema`.

If a project needs custom website content, add pages, components, or new schema types around this base. Do not remove or rename the boilerplate schema types unless asked explicitly.

## What This Boilerplate Provides

- Next.js frontend with App Router and locale-prefixed routes.
- Sanity Studio with CMS types for blog posts, authors, categories, FAQ items, redirects, landing-page SEO, and site settings.
- Draft Mode and Presentation preview wiring.
- On-demand revalidation webhook endpoint for Sanity publishes.
- SEO inheritance from Site Settings to individual documents.
- JSON-LD schema generators for common website entities.
- Analytics configuration driven from Sanity Site Settings.
- Portable Text renderers for blog content.

## Expected Agent Behavior

- Prefer small, scoped changes that follow existing folder ownership.
- Read `README.md`, `ABOUT.md`, and `SETUP.md` before making broad changes.
- Keep environment-specific IDs, URLs, and secrets in `.env.local` files or `.env.example` templates.
- Never commit real secrets.
- Use npm only. This repo uses npm workspaces and `package-lock.json`.
- Keep files documented with useful module-level comments where behavior is not obvious.
- Update docs when changing setup, folder structure, env variables, or core workflows.
- Put static UI copy in `apps/web/src/messages/<locale>/*.json` instead of hardcoding text in pages or components.
- Blog content localization is document-level in Sanity: filter `blogPost` queries by `language`, link translated posts with `translationGroup`, create translations through the Studio `Translations` tab, and treat missing legacy `language` values as English.

## Web App Boundaries

Use `apps/web` for the public frontend:

- Add app routes under `apps/web/src/app/[locale]`.
- Add shared UI in `apps/web/src/components/shared`.
- Add reusable primitives in `apps/web/src/components/ui`.
- Add blog-only components in `apps/web/src/components/blog`.
- Add GROQ queries in `apps/web/src/sanity/queries`.
- Add SEO behavior in `apps/web/src/seo`.
- Add structured data in `apps/web/src/seo/schema`.
- Add locale behavior in `apps/web/src/i18n`.

Do not fetch Sanity directly from random components. Use `sanityFetch()` and query files.

## Studio Boundaries

Use `apps/studio` for CMS structure and editor tooling:

- Add document types in `apps/studio/schemaTypes/documents`.
- Add reusable object types in `apps/studio/schemaTypes/objects`.
- Add Studio sidebar changes in `apps/studio/structure/index.ts`.
- Add custom document actions in `apps/studio/schemaTypes/actions`.
- Add custom Studio panels or previews in `apps/studio/schemaTypes/components`.

Do not rename existing schema type names unless the user asks. Renaming a Sanity schema type can orphan existing content.

## Test Content Policy

The connected Sanity dataset may contain sample blog posts, FAQ items, categories, authors, and landing-page SEO entries used for testing. Those content documents can be deleted or replaced inside Sanity Studio for a real project.

The schema definitions themselves must remain unless a deliberate migration is requested:

- Keep `blogPost`.
- Keep `category`.
- Keep `author`.
- Keep `faqItem`.
- Keep `landingPageSeo`.
- Keep `redirect`.
- Keep `siteSettings`.

## Deployment Notes

- Web deploys from `apps/web`, usually to Vercel.
- Studio deploys from `apps/studio`, usually with `npx sanity deploy`.
- Sanity project ID, dataset, preview URL, preview secret, revalidation secret, and Studio deployment app id are configurable through env files.
- Vercel must use `apps/web` as the root directory.
- Sanity CORS must include local and production web origins.

## Files To Read First

- `README.md`: concise overview.
- `ABOUT.md`: full project and file structure reference.
- `SETUP.md`: detailed setup, Sanity, Vercel, and deployment guide.
- `apps/web/AGENTS.md`: Next.js-specific warning for this web app.
