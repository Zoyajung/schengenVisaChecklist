# Setup Guide

This guide explains how to set up this reusable Next.js + Sanity boilerplate from a fresh clone or downloaded zip, configure local development, clean test content, and deploy both the web app and Sanity Studio.

## What You Are Setting Up

This is a boilerplate, not a single fixed website. The codebase provides:

- A public Next.js app in `apps/web`.
- A Sanity Studio CMS in `apps/studio`.
- Blog, FAQ, author, category, redirect, landing-page SEO, and site settings schema.
- Draft preview.
- On-demand revalidation.
- SEO metadata and JSON-LD helpers.

The core schema structure should remain stable. Sample content in Sanity can be deleted or replaced.

## Prerequisites

Install these before setup:

- Node.js 20 or newer.
- npm. Do not use yarn, pnpm, or bun for this repo.
- Git, if cloning from a repository.
- A Sanity account.
- A Vercel account, if deploying the web app to Vercel.

## Get The Project

### Option 1: Clone With Git

```bash
git clone <repo-url>
cd monorepo
```

If the folder name is different, `cd` into the downloaded project root where `package.json` exists.

### Option 2: Download Zip

1. Download the repository zip.
2. Extract it.
3. Open a terminal inside the extracted root folder.
4. Confirm the root contains:
   ```text
   package.json
   package-lock.json
   apps/
   README.md
   ABOUT.md
   SETUP.md
   ```

If you downloaded a zip and want git history, initialize your own repository:

```bash
git init
git add .
git commit -m "chore: initialize project from boilerplate"
```

## Install Dependencies

Run from the monorepo root:

```bash
npm install
```

This installs dependencies for both workspaces:

- `apps/web`
- `apps/studio`

## Create Environment Files

Local env files are ignored by git. They hold project-specific IDs and secrets.

### Web Env

Create:

```bash
cp apps/web/.env.example apps/web/.env.local
```

On Windows PowerShell:

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
```

Fill in `apps/web/.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Local or production web origin. Use `http://localhost:3000` locally. |
| `NEXT_PUBLIC_SITE_NAME` | Optional | Fallback site name. Sanity Site Settings can override it. |
| `NEXT_PUBLIC_SITE_TIME_ZONE` | Optional | IANA timezone used for editorial dates such as checklist `Last checked`. |
| `NEXT_PUBLIC_DEFAULT_OG_IMAGE` | Optional | Fallback OG image path or URL. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID used by the web app. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset, usually `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | Sanity API version in `YYYY-MM-DD` format. |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Optional | Studio URL for visual editing links. Use `http://localhost:3333` locally. |
| `SANITY_API_READ_TOKEN` | Preview only | Read token used to read draft documents. |
| `SANITY_API_WRITE_TOKEN` | Checklist generator | Write token used to save generated checklist results. |
| `SANITY_REVALIDATE_SECRET` | Webhooks | Secret used by `/api/revalidate`. |
| `SANITY_PREVIEW_SECRET` | Preview | Secret used by `/api/draft-mode/enable`. |
| `OPENAI_API_KEY` | Checklist generator | OpenAI API key for structured checklist generation. |
| `OPENAI_CHECKLIST_MODEL` | Optional | Model override for checklist generation. |

### Studio Env

Create:

```bash
cp apps/studio/.env.example apps/studio/.env.local
```

On Windows PowerShell:

```powershell
Copy-Item apps/studio/.env.example apps/studio/.env.local
```

Fill in `apps/studio/.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Yes | Sanity project ID used by Studio. |
| `SANITY_STUDIO_DATASET` | Yes | Dataset name used by Studio. |
| `SANITY_STUDIO_APP_ID` | Deploy only | Hosted Studio app id. Replace after deploying your own Studio. |
| `SANITY_STUDIO_PREVIEW_URL` | Preview | Web app origin, such as `http://localhost:3000`. |
| `SANITY_STUDIO_PREVIEW_SECRET` | Preview | Must match `SANITY_PREVIEW_SECRET` in `apps/web/.env.local`. |

### Generate Secrets

Use one generated value for preview and one generated value for revalidation:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Recommended mapping:

- Use one value for `SANITY_PREVIEW_SECRET` and `SANITY_STUDIO_PREVIEW_SECRET`.
- Use a different value for `SANITY_REVALIDATE_SECRET`.

## Create Or Choose A Sanity Project

1. Go to `https://www.sanity.io/manage`.
2. Create a new project or open an existing project.
3. Copy the Project ID.
4. Create or choose a dataset, usually `production`.
5. Put the same project ID and dataset into:
   - `apps/web/.env.local`
   - `apps/studio/.env.local`

The project ID and dataset are env-driven. You should not need to edit source files to change them.

## Create A Sanity Read Token

Draft preview needs a token that can read drafts.

1. Go to Sanity Manage.
2. Open your project.
3. Go to API > Tokens.
4. Create a token with Viewer/read access.
5. Put the token in:
   ```env
   SANITY_API_READ_TOKEN=<token>
   ```

Do not commit this token.

## Configure Sanity CORS

In Sanity Manage, open API > CORS Origins.

Add local origins:

```text
http://localhost:3000
http://localhost:3333
```

After deployment, also add your production web origin:

```text
https://your-site.vercel.app
https://your-custom-domain.com
```

Enable credentials for origins that need authenticated preview or Studio requests.

## Start Local Development

From the root:

```bash
npm run dev
```

This starts:

- Web app at `http://localhost:3000`
- Studio at `http://localhost:3333`

Run separately if needed:

```bash
npm run dev:web
npm run dev:studio
```

## Verify Local Setup

Check these in order:

1. Open `http://localhost:3000`.
2. Confirm the app redirects to the default locale route, such as `/en`.
3. Open `http://localhost:3333`.
4. Log into Sanity Studio.
5. Confirm the Studio shows Site Settings, Blog Posts, Categories, Authors, FAQ Items, and landing-page SEO entries.
6. Create or open a blog post.
7. Test preview if `SANITY_API_READ_TOKEN` and preview secrets are configured.

## Sanity Content Policy

The connected Sanity dataset may already contain test content:

- Sample blog posts.
- Sample FAQ items.
- Sample categories.
- Sample authors.
- Sample landing-page SEO documents.
- Sample redirects or settings.

These content items can be deleted, unpublished, or replaced for a real project.

Do not delete or rename the core schema types unless the user explicitly asks for a schema migration:

- `blogPost`
- `category`
- `author`
- `faqItem`
- `landingPageSeo`
- `redirect`
- `siteSettings`

## Cleaning Test Content

Use Sanity Studio for ordinary cleanup:

1. Open Studio.
2. Delete sample blog posts that are only for testing.
3. Delete sample FAQ items that are only for testing.
4. Delete sample categories that are not needed.
5. Delete sample authors that are not needed.
6. Clear sample analytics IDs and social URLs from Site Settings.
7. Keep or recreate the required landing-page SEO records for homepage and FAQ page as needed.

Recommended cleanup order:

1. Delete blog posts first.
2. Delete FAQ items not referenced by pages.
3. Delete categories and authors after posts are removed.
4. Update Site Settings last.

This avoids reference errors from documents pointing to deleted categories, authors, or FAQ items.

## Core Content To Recreate For A Real Project

At minimum, create or verify:

- `siteSettings`: global site name, description, default SEO, social profiles, analytics, and services.
- `landingPageSeo` with slug `/`: homepage SEO, schema, AI SEO, and optional FAQs.
- `landingPageSeo` with slug `faq`: FAQ page SEO and selected FAQ items.
- At least one `author` before creating blog posts.
- At least one `category` before creating blog posts.

## Localizing Interface Text

Static UI copy belongs in the message bundle, not directly inside page or component JSX.

Current English message folder:

```text
apps/web/src/messages/en/
|-- common.json
|-- home.json
|-- blog.json
|-- faq.json
|-- category.json
|-- author.json
`-- not-found.json
```

Use `common.json` for shared UI such as navbar, footer, breadcrumbs, buttons/shared labels, draft mode, and embeds. Use page-specific files for page and route copy.

Message helper:

```text
apps/web/src/messages/index.js
```

To add another locale later:

1. Add the locale code to `LOCALES` in `apps/web/src/i18n/config.js`.
2. Create `apps/web/src/messages/<locale>/`.
3. Copy every JSON file from `messages/en/` into the new locale folder.
4. Translate every value while keeping the same keys.
5. Import the new JSON files in `apps/web/src/messages/index.js`.
6. Merge the imported files under the locale code in `MESSAGES`.
7. Add a display label in `LOCALE_LABELS`.
8. Add the locale to `RTL_LOCALES` if it is right-to-left.

CMS content such as blog titles, FAQ questions, FAQ answers, author bios, category names, and Portable Text body content still comes from Sanity. Blog posts use document-level localization: each `blogPost` has a `language` field, and translated versions are separate `blogPost` documents linked by the same `translationGroup`. Existing posts without a language are treated as English by the frontend with `coalesce(language, "en")`.

## Creating Translated Blog Posts

Blog translations are managed in Sanity Studio as separate `blogPost` documents. Do not translate blog content in `apps/web/src/messages`; that folder is only for static interface text.

Use this workflow:

1. Create and save the English source blog post normally.
2. Open the source post's `Translations` tab.
3. Click `Copy source JSON`.
4. Translate only the text values outside Sanity. Keep the JSON keys, arrays, Portable Text `_type`, `_key`, mark definitions, references, and image objects intact.
5. Select the target language in the `Target language` dropdown.
6. Paste the translated JSON.
7. Click `Create translated draft`.
8. Open the generated draft, review it, then publish when ready.

The translation tool automatically:

- Creates or replaces one deterministic draft per source post and target language.
- Sets the new post's `language` field to the selected target language.
- Links the translated document to the source through the hidden `translationGroup`.
- Sets `sourceLanguage` and `sourceDocument`.
- Copies shared fields such as featured image, author, category, publish schedule, schema config, and visibility.
- Generates a locale-specific slug from the translated title, such as `my-translated-title-fr`.
- Adds a numeric suffix if the generated slug already exists.

The selected language is what the frontend uses for localized blog routing. For example, `/fr/blog/example` only finds a post whose `language` is `fr` and whose slug is `example`. The Studio blog list also shows the language code beside each post, so translated drafts should display as `FR`, `DE`, `AR`, and so on.

Do not manually duplicate a blog post to translate it. Use the `Translations` tab so the link fields and slug rules stay consistent.

## Build Locally

From the root:

```bash
npm run build
```

Build only web:

```bash
npm run build:web
```

Build only Studio:

```bash
npm run build:studio
```

## Deploy Web App To Vercel

### Import Project

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Go to Vercel.
3. Import the repository.
4. Set Root Directory to:
   ```text
   apps/web
   ```
5. Keep the framework preset as Next.js.

The root directory is critical. If Vercel builds from the monorepo root, the deployment may use the wrong package scripts.

### Vercel Environment Variables

Add the web variables from `apps/web/.env.local` to Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NEXT_PUBLIC_SITE_NAME=Your Brand
NEXT_PUBLIC_SITE_TIME_ZONE=America/New_York
NEXT_PUBLIC_DEFAULT_OG_IMAGE=
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-26
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-studio.sanity.studio
SANITY_API_READ_TOKEN=your_read_token
SANITY_REVALIDATE_SECRET=your_revalidation_secret
SANITY_PREVIEW_SECRET=your_preview_secret
```

Set these for every Vercel environment you use:

- Production
- Preview
- Development, if needed

After Vercel gives you a deployment URL, update:

- `NEXT_PUBLIC_SITE_URL` in Vercel.
- `SANITY_STUDIO_PREVIEW_URL` in Studio env.
- Sanity CORS origins.

## Deploy Sanity Studio

From the repo root:

```bash
cd apps/studio
npx sanity deploy
```

Sanity may ask for a Studio hostname. Choose a project-specific hostname.

After deploy, if Sanity gives you or updates an app id, put it in:

```env
SANITY_STUDIO_APP_ID=<your_studio_app_id>
```

Then rebuild/redeploy Studio when needed.

### Studio Env For Deployment

The Studio deployment should have:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_APP_ID=your_studio_app_id
SANITY_STUDIO_PREVIEW_URL=https://your-site.vercel.app
SANITY_STUDIO_PREVIEW_SECRET=your_preview_secret
```

The preview secret must match the web app's `SANITY_PREVIEW_SECRET`.

## Set Up Sanity Revalidation Webhook

This lets Sanity publish events refresh the Next.js cache without redeploying.

1. Go to Sanity Manage.
2. Open your project.
3. Go to API > Webhooks.
4. Create a new webhook.
5. Set URL:
   ```text
   https://your-site.vercel.app/api/revalidate
   ```
6. Set method to `POST`.
7. Set the webhook secret to the exact value of `SANITY_REVALIDATE_SECRET`.
8. Use this filter:
   ```groq
   *[_type in ["blogPost","category","landingPageSeo","siteSettings","redirect","author","faqItem"]]
   ```
9. Use this projection:
   ```groq
   {_type, "slug": slug.current}
   ```
10. Save the webhook.

Test by publishing a small content change in Studio and checking the Vercel logs for `/api/revalidate`.

## Draft Preview Setup

Draft preview requires:

- `SANITY_API_READ_TOKEN` in the web app.
- `SANITY_PREVIEW_SECRET` in the web app.
- Matching `SANITY_STUDIO_PREVIEW_SECRET` in the Studio.
- `SANITY_STUDIO_PREVIEW_URL` pointing to the web app.
- Sanity CORS configured for the web origin.

Local example:

```env
# apps/web/.env.local
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
SANITY_API_READ_TOKEN=your_read_token
SANITY_PREVIEW_SECRET=shared_preview_secret

# apps/studio/.env.local
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
SANITY_STUDIO_PREVIEW_SECRET=shared_preview_secret
```

## Changing Project Keys Later

All portable project identifiers and secrets should be changed through env files:

### Web

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_TIME_ZONE`
- `NEXT_PUBLIC_DEFAULT_OG_IMAGE`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `SANITY_API_READ_TOKEN`
- `SANITY_REVALIDATE_SECRET`
- `SANITY_PREVIEW_SECRET`

### Studio

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_APP_ID`
- `SANITY_STUDIO_PREVIEW_URL`
- `SANITY_STUDIO_PREVIEW_SECRET`

If a key is still hardcoded in source after project customization, move it to the appropriate `.env.example` and `.env.local` file before handoff.

## Common Commands

| Command | Where | Purpose |
| --- | --- | --- |
| `npm install` | root | Install all workspace dependencies |
| `npm run dev` | root | Run web and Studio together |
| `npm run dev:web` | root | Run only Next.js |
| `npm run dev:studio` | root | Run only Sanity Studio |
| `npm run build` | root | Build web and Studio |
| `npm run build:web` | root | Build only web |
| `npm run build:studio` | root | Build only Studio |
| `npm run lint -w apps/web` | root | Lint web app |
| `npm run lint -w apps/studio` | root | Lint Studio |
| `npx sanity deploy` | `apps/studio` | Deploy Studio |
| `npx sanity schema deploy` | `apps/studio` | Deploy schema changes |

## Troubleshooting

### Web app shows empty content

Check:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- published documents in Sanity
- CORS origins

### Draft preview does not work

Check:

- `SANITY_API_READ_TOKEN` exists in web env.
- `SANITY_PREVIEW_SECRET` and `SANITY_STUDIO_PREVIEW_SECRET` match.
- `SANITY_STUDIO_PREVIEW_URL` points to the web app.
- The browser is not blocking cookies.

### Revalidation does not run

Check:

- Webhook URL is `/api/revalidate`.
- Webhook secret equals `SANITY_REVALIDATE_SECRET`.
- Vercel env has `SANITY_REVALIDATE_SECRET`.
- Webhook projection includes `_type`.

### Vercel build fails

Check:

- Vercel Root Directory is `apps/web`.
- npm is used.
- Required env vars exist in Vercel.
- `package-lock.json` is committed.

### Studio points to the wrong project

Check:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Both web and Studio must point to the same Sanity project and dataset unless you intentionally split them.
