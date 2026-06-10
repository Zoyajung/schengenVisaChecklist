# Next.js + Sanity Monorepo Template

This repo is a two-app npm workspace:

- `apps/web` is the public Next.js app.
- `apps/studio` is the Sanity Studio used to edit CMS content, SEO, redirects, and preview settings.

The repo is set up as a handoffable template. The goal is that another developer can clone it, fill in the env files, understand where each feature lives, and ship without tracing the whole codebase from scratch.

## Detailed Docs

- `AGENTS.md`: rules for agents and developers working on this boilerplate.
- `ABOUT.md`: detailed folder and file structure reference.
- `SETUP.md`: complete local setup, Sanity setup, cleanup, preview, revalidation, and deployment guide.

## Stack

- Next.js 16.2.6
- React 19.2.4
- Sanity Studio 5.26.0
- Tailwind CSS 4
- npm workspaces

## Repository Map

```text
monorepo/
|-- package.json              Root workspace scripts
|-- package-lock.json         npm lockfile
|-- README.md                 This guide
`-- apps/
    |-- web/                  Next.js frontend
    |   |-- .env.example      Public template for web env vars
    |   |-- next.config.mjs   Next image and runtime config
    |   `-- src/
    |      |-- app/           Routes, layouts, API handlers
    |      |-- analytics/     Runtime analytics loader
    |      |-- components/    UI, blog, and shared components
    |      |-- constants/     Site fallbacks such as SITE_URL
    |      |-- i18n/          Locale config and URL helpers
    |      |-- messages/      JSON UI copy bundles per locale
    |      |-- sanity/        Sanity client, fetch helper, queries, types
    |      |-- seo/           Metadata, SEO resolution, and JSON-LD generators
    |      `-- utils/         Portable text, formatting, embeds, hrefs
    `-- studio/               Sanity Studio
        |-- .env.example      Public template for Studio env vars
        |-- sanity.config.ts  Studio config and plugins
        |-- sanity.cli.ts     CLI config and deployment settings
        `-- schemaTypes/      Documents, objects, actions, structure, UI panes
```

## Setup

1. Install dependencies from the repo root:
   ```bash
   npm install
   ```

2. Create the web env file:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

3. Create the Studio env file:
   ```bash
   cp apps/studio/.env.example apps/studio/.env.local
   ```

4. Fill in the values described below.

5. Start both apps:
   ```bash
   npm run dev
   ```

6. Open:
   - Web: `http://localhost:3000`
   - Studio: `http://localhost:3333`

## Environment Variables

### `apps/web/.env.local`

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL used for metadata, sitemap, and JSON-LD |
| `NEXT_PUBLIC_SITE_NAME` | Optional | Fallback site name when Site Settings does not provide one |
| `NEXT_PUBLIC_SITE_TIME_ZONE` | Optional | IANA timezone for editorial dates such as checklist `Last checked` |
| `NEXT_PUBLIC_DEFAULT_OG_IMAGE` | Optional | Fallback OG image path when Sanity does not provide one |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID used by the web app |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset, usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | Sanity API version used by the client and fetch helpers |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Optional | Base URL for Studio links and visual editing |
| `SANITY_API_READ_TOKEN` | Needed for previews | Viewer token used for Draft Mode and Presentation preview |
| `SANITY_API_WRITE_TOKEN` | Needed for checklist generation | Write token used to save generated checklist results in Sanity |
| `SANITY_REVALIDATE_SECRET` | Needed for webhooks | Shared secret for `/api/revalidate` |
| `SANITY_PREVIEW_SECRET` | Needed for preview links | Shared secret for `/api/draft-mode/enable` |
| `OPENAI_API_KEY` | Needed for AI generation | OpenAI API key used by `/api/generate-checklist` |
| `OPENAI_CHECKLIST_MODEL` | Optional | Model override for checklist generation |

### `apps/studio/.env.local`

| Variable | Required | Purpose |
| --- | --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Yes | Studio project ID. The config now reads this value with a safe fallback |
| `SANITY_STUDIO_DATASET` | Yes | Studio dataset name |
| `SANITY_STUDIO_PREVIEW_URL` | Needed for preview | Web app URL used by the Presentation tool and preview panes |
| `SANITY_STUDIO_PREVIEW_SECRET` | Needed for preview | Must match `SANITY_PREVIEW_SECRET` in `apps/web/.env.local` |

Generate a shared secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## What Lives Where

### Web app

- `src/app/[locale]/layout.js` owns the root HTML shell, navigation, footer, analytics, draft banner, JSON-LD, and locale handling.
- `src/app/[locale]/page.js` is the homepage.
- `src/app/[locale]/blog/*` contains blog listing, post, category, and author routes.
- `src/app/[locale]/faq/page.js` is the FAQ landing page.
- `src/app/api/draft-mode/*` turns Draft Mode on and off.
- `src/app/api/revalidate/route.js` handles Sanity webhook revalidation.
- `src/proxy.js` handles locale prefixing and redirect rules.
- `src/sanity/lib/*` is the Sanity client and fetch layer.
- `src/sanity/queries/*` contains the GROQ queries.
- `src/seo/*` resolves metadata, hreflang, robots, inherited SEO fields, and JSON-LD schema output.
- `src/components/shared/*` holds shared layout components such as navbar, footer, breadcrumbs, JSON-LD, and FAQ blocks.
- `src/components/blog/*` holds blog-specific presentation.
- `src/components/blog/portable/*` renders Portable Text blocks.
- `src/i18n/*` defines supported locales and route helpers.
- `src/messages/<locale>/*.json` stores UI text by shared/common and page-specific bundles.

### Studio

- `schemaTypes/documents/*` defines the editable CMS documents.
- `schemaTypes/objects/*` defines reusable objects embedded inside documents.
- `schemaTypes/actions/publishWithRedirect.ts` records slug history when posts are republished.
- `schemaTypes/components/*` contains custom Studio panes and previews.
- `structure/index.ts` defines the Studio sidebar order and grouped content views.
- `sanity.config.ts` wires plugins, preview, layout, and custom document actions.
- `sanity.cli.ts` configures project, dataset, and deployment metadata.

## How The System Works

### Content ownership

- Page copy for the homepage and other code-built landing pages lives in React files.
- SEO metadata, FAQ data, structured data settings, and redirects live in Sanity.
- Blog posts, categories, authors, and FAQ items are fully CMS-managed.

### Draft preview

1. The Studio preview pane calls `/api/draft-mode/enable`.
2. The web app verifies `SANITY_PREVIEW_SECRET` or the Presentation tool flow.
3. Draft Mode is enabled and `sanityFetch()` switches to draft reads.
4. `DraftModeBanner` appears in the public site.
5. Disable preview through `/api/draft-mode/disable`.

### Revalidation

- Sanity publishes to `/api/revalidate`.
- The route validates `SANITY_REVALIDATE_SECRET`.
- It revalidates the changed type and dependent content tags.
- Blog cards, metadata, JSON-LD, and sitemap data refresh without a redeploy.

### Locale routing

- All public routes live under `/[locale]`.
- The proxy redirects bare paths to the default locale.
- Add or remove supported locales in `src/i18n/config.js`.
- Static UI copy lives in `src/messages/<locale>/*.json`.
- Blog content language is selected from Sanity with `blogPost.language`; translated blog documents are linked by `translationGroup`.
- Editors create translated blog drafts from the blog post `Translations` tab by copying source JSON, pasting translated JSON, and selecting the target language.

## Commands

Run these from the repo root unless noted otherwise.

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies for both apps |
| `npm run dev` | Start web and Studio together |
| `npm run dev:web` | Start only the web app |
| `npm run dev:studio` | Start only the Studio |
| `npm run build` | Build web, then Studio |
| `npm run build:web` | Build the web app |
| `npm run build:studio` | Build the Studio |
| `npm run lint -w apps/web` | Lint the web app |
| `npm run lint -w apps/studio` | Lint the Studio |
| `cd apps/studio && npx sanity deploy` | Deploy the Studio |
| `cd apps/studio && npx sanity schema deploy` | Push schema changes to a hosted Studio |

## Deployment

### Web app

Deploy `apps/web` to Vercel and set the root directory to `apps/web`.

Add the same environment variables from `apps/web/.env.local` to Vercel for production and preview.

### Studio

Deploy the Studio from `apps/studio` with `npx sanity deploy`.

The Studio config now reads `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`, so a fork can target a different project without editing the source first.

After deployment, add the production site URL to Sanity CORS origins.

## Common Edits

- Add or change homepage content in `apps/web/src/app/[locale]/page.js`.
- Add a new public route under `apps/web/src/app/[locale]/...`.
- Update site branding and fallback constants in `apps/web/src/constants/site.js`.
- Update locale behavior in `apps/web/src/i18n/config.js` and `apps/web/src/i18n/routing.js`.
- Update SEO defaults in `apps/web/src/seo/*`.
- Update JSON-LD generators in `apps/web/src/seo/schema/*`.
- Add a CMS document in `apps/studio/schemaTypes/documents/*`.
- Add a reusable object in `apps/studio/schemaTypes/objects/*`.
- Change Studio navigation in `apps/studio/structure/index.ts`.
- Change the publish redirect behavior in `apps/studio/schemaTypes/actions/publishWithRedirect.ts`.

## Notes For New Developers

- `params` in Next.js 16 route files are async. Use `const {locale, slug} = await params`.
- The web app uses JSDoc instead of a TypeScript toolchain.
- The Studio uses TypeScript and Sanity's schema helpers.
- `npm` is the only supported package manager for this repo.
- The repo ships with module-level comments in the important entry files so the runtime flow is visible without reading every implementation line first.

## Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Draft Mode does not activate | `SANITY_PREVIEW_SECRET` and `SANITY_STUDIO_PREVIEW_SECRET` do not match | Set both to the same generated secret |
| Web queries return `null` | Sanity env vars are missing | Fill `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and the API version |
| Studio preview links fail | `SANITY_STUDIO_PREVIEW_URL` is wrong | Set it to the running web app origin |
| Redirects do not update | Webhook secret mismatch or webhook not configured | Recreate the Sanity webhook with `SANITY_REVALIDATE_SECRET` |
| Images fail locally | The dev server is stale or image env vars are missing | Restart the dev server and verify the Sanity image config |

## Handoff Checklist

- Update `.env.local` files for your target Sanity project.
- Verify the Studio project and dataset values in `apps/studio`.
- Confirm the web app can read the expected Sanity dataset.
- Run `npm run dev` and verify locale routing, Draft Mode, and revalidation.
- Update the public site URL and analytics IDs before deployment.
