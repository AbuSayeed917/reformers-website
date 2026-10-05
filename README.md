# reformer'S website

A company website for AI automation, apps, websites, custom software, and SaaS products. It uses React, TypeScript, Vinext, and CSS Modules. Client-side state is isolated to the interactive home sections: the revision canvas, perspective toggle, service workbench, process notebook, and enquiry draft. Shared layout and the footer remain server-rendered.

## Run and verify

```sh
npm ci
npm run dev
npm run check
```

`check` runs formatting verification, ESLint, TypeScript, regression tests, generated-brand verification, and the production build. `npm run format` formats the authored application. `npm run lint:all` additionally inspects inherited starter infrastructure. Use Node 22.13 or newer; the asset generator and tests use Node's TypeScript stripping support.

## Where changes belong

| Concern | Location |
| --- | --- |
| Company name and canonical logo geometry | `config/brand.ts` |
| Email, metadata, navigation, section IDs | `config/site.ts` |
| Services and capability-strip labels | `content/services.ts` |
| Process steps | `content/process.ts` |
| Transformation examples, service diagrams, process notes | `content/transformations.ts` |
| Interactive canvas states | `content/reform-frames.ts` |
| Palette, spacing scale, type scale, motion, gutters | `styles/tokens.css` |
| Shared layout, labels, links, header and footer | `components/site/` |
| Shared mark and wordmark | `components/brand/` |
| Homepage sections and their scoped styles | `features/home/` |
| Route composition | `app/page.tsx` |
| Document metadata and base styles | `app/layout.tsx`, `app/globals.css` |
| SVG generation | `scripts/generate-brand.mjs` |

## Design and component rules

- Change shared values in `tokens.css`. Use semantic color tokens and the four-pixel spacing scale. The small typography scale covers ordinary text; deliberately oversized editorial typography and logo geometry stay local to their component.
- Keep global CSS limited to reset/base behavior, accessibility, framework aliases, and reduced motion. Component styles belong in adjacent CSS Modules.
- Reuse `Container`, `SectionLabel`, `TextLink`, `EnquiryLink`, `Wordmark`, and `BrandMark` before introducing a similar implementation. Existing `components/ui` primitives are available for more complex controls.
- Prefer semantic HTML. The shared Choice component uses native radio buttons and checkboxes for keyboard behavior. Native details/summary reveals additional service information.
- Keep content independent from rendering and use stable content IDs for React keys. Section IDs are shared with navigation; link destinations are not copied between components.
- Keep state local. The canvas uses semantic frame IDs for styling and derives its counter and wraparound from its content array. Do not introduce a global store for a local interaction.
- Abstract repeated behavior, not every element. Sections remain straightforward components rather than a configurable page-builder framework.
- Responsive breakpoints are intentionally literal `1000px` and `680px` in component media queries: native CSS variables cannot be used in media conditions. Gutters are tokens. New breakpoints require a layout reason.

## Logo exports

The live logo and SVG assets share the paths in `config/brand.ts`. Export colors come from `styles/tokens.css`.

```sh
npm run brand:generate
npm run brand:check
```

Generated assets live in `public/brand/`, plus `public/favicon.svg` and `public/reform-mark.svg`. Do not edit generated SVGs directly. The wordmark export uses Arial/Helvetica text; outline it in a vector editor if a printer requires font-independent artwork.

## Tests and review

- Mailto tests verify that punctuation, Unicode, and query delimiters remain within the subject.
- Style contract tests reject component-specific hexadecimal palettes and undefined design tokens.
- The brand check catches exported SVGs that drift from their canonical definition.
- Browser review should cover all three canvas states, the perspective toggle, service and process selection, enquiry draft content, keyboard operation, anchor links, and mobile overflow. These visual/interaction checks are currently manual, not an automated browser test suite.

## Boundaries and current limitations

The contact brief builds an email draft from selected services and a short idea. It opens the visitor's email app; the website does not send or persist enquiries. Service and process copy describe the intended offering, without invented client work or performance claims. Hosting is not yet published; the current preview is local.

Vinext is a beta framework. The existing Sites/Cloudflare starter infrastructure, vendored UI components, and lockfile are retained; they are not part of the homepage refactor. Dependencies were not removed simply because this presentation page does not currently use them.

## re:brief enquiry assistant

`/demo/brief` is the first-party enquiry assistant demo. It uses the shared brand
and tokens. `features/brief/schema.ts` owns validation/export, `samples.ts` holds
explicitly fictional, pre-written examples, `provider.ts` owns the server-side
Gemini API adapter, and `workspace.tsx` owns interface state. `/api/brief`
validates requests and returns sanitized failures without exposing provider errors.

To enable live custom enquiries locally, copy `.env.example` to `.env.local`, set
`GEMINI_API_KEY` from a Google AI Studio project on the Free tier, and
restart the server. Keep credentials server-only. Samples remain pre-written even
when live mode is enabled. Changing the input clears prior output; custom enquiries
never silently fall back to sample results. The app does not persist messages or
send emails. Live submissions are sent to Google Gemini 3.5 Flash-Lite. Google may use free-tier content to improve its products; use fictional or non-sensitive enquiries. Free-tier quotas apply. Keep billing disabled on the Google project to avoid paid usage; the app cannot determine a key’s billing tier. There is no paid-provider fallback. HTTP 429 returns a clear quota message without automatic retries.

Live Gemini 3.5 Flash-Lite generation was verified through `/api/brief` with a fictional enquiry. Credentials remain in ignored, server-only local configuration.
Before enabling paid inference on a public deployment, add authenticated access,
per-user rate limits and provider spending limits. This version is a local demo.

API format reference: https://ai.google.dev/api/generate-content

## re:flow automation studio

`/demo/flow` demonstrates an enquiry → classification → reply → human approval
workflow. Sample mode uses explicitly pre-written fictional content. Live mode
makes two server-side Gemini requests through `/api/flow`, with the same key and
privacy/quota constraints as re:brief. Approval and rejection only record a demo
decision; no email is sent. Visitors can edit the draft before approval and export
a JSON run record. State is held in memory and cleared on reload.

`features/flow/model.ts` defines validated step contracts and node statuses;
`provider.ts` handles AI steps, `sample.ts` contains fixture content, and
`workspace.tsx` coordinates the interface. Styles reuse the site design tokens.

## GitHub Pages

The public site is deployed from `main` by `.github/workflows/pages.yml`.
Run `npm run build:pages` to create `pages-out/`. This uses Next.js static export
in an isolated, ignored staging directory; it does not copy environment files or
API routes. `NEXT_PUBLIC_BASE_PATH` defaults to `/reformers-website`.
The public deployment uses sample demos only: GitHub Pages cannot host the
Gemini API routes. Live AI and chat remain available in the local server build.
Never add a Gemini key to client code or GitHub Pages configuration.
