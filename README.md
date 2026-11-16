# TasioLabs website

A dependency-free static site for GitHub Pages. Four pages, locally stored images, shared CSS/JS, and a small Node build script. No CMS, backend, runtime framework, analytics, or paid hosting.

## Local development

Use Node 22 or newer. No package installation is needed.

```sh
npm test
npm run dev
```

Open http://localhost:3000. After editing, restart the command to rebuild. For a production-path build:

```sh
BASE_PATH=/tasio-website/ npm run build
```

Output goes to ignored `dist/`. `BASE_PATH` defaults to `/` locally. The workflow supplies `/tasio-website/`, so navigation, images, modules, and data work at https://tasio-code.github.io/tasio-website/. Do not add a CNAME file.

## GitHub Pages setup

GitHub Pages is configured to use GitHub Actions (enabled by the repository owner). Merge this PR to trigger the first deployment. PRs run the build and tests without deployment; subsequent pushes/merges to `main` deploy automatically. No custom domain is configured.

## Editing

- Page copy and templates: `scripts/build.mjs`
- Colors, layout, responsive styles: `src/styles.css` (muted blue `#466b8a`, warm paper `#f6f5f0`; original logo colors retained)
- Project copy: `src/data/projects.json`
- Events: `src/data/events.json`
- Contact endpoint: `src/data/site.json`
- Original downloaded assets: `src/assets/`

### Speaking and events

Add an object to `src/data/events.json`:

```json
{
  "eventName": "Confirmed event name",
  "startDate": "2027-05-10",
  "endDate": "2027-05-11",
  "location": "City, region or Online",
  "sessionTitle": "Confirmed session title",
  "speakers": ["Thomas Altman"],
  "description": "Optional confirmed session description.",
  "eventUrl": "https://example.org/event"
}
```

Dates are inclusive calendar dates, not local timestamps. Use ISO `YYYY-MM-DD`; an event moves to past at 00:00 UTC the day after `endDate`. This explicit global convention avoids browser timezone differences. Upcoming events sort by start ascending; past by start descending. Both groups render at build time and refresh on page load, so an already-deployed site updates without rebuilding. An open tab updates on reload. If JavaScript or fetching fails, built HTML remains available (with its build-time grouping).

Optional event artwork: add `"logo": {"file": "cesse.png", "alt": "CESSE"}` and place the asset in `src/assets/events/`. Use `"darkBackground": true` for white logos. Omit `logo` for a text-only entry. Use event-specific or organizer artwork from a verified source and document that source in `CONTENT_REVIEW.md`.

Use `null` for unknown location or event URL and an empty string for an unknown description; these details are omitted rather than invented. Optional `verificationNote` is internal and never rendered. Build validation rejects malformed dates, reversed ranges, missing speakers, and non-HTTPS event links. Remove sample objects rather than publishing hypothetical appearances.

### Enable Formspree

1. Register a form with Formspree and configure its recipient and allowed origins, including the GitHub Pages origin. Check the provider's current terms and limits before use.
2. Replace `https://formspree.io/f/YOUR_FORM_ID` in `src/data/site.json` with the real endpoint.
3. Merge the change, then test delivery, invalid fields, network failure, and success on the deployed site.

Until configured, the UI explicitly says it cannot send messages and disables submission. The real endpoint enables the button automatically. Native required/email/length validation, whitespace checks, a hidden `_gotcha` honeypot, disabled in-flight submissions, and accessible live status feedback are included. Errors preserve input. Formspree receives the fields only on submission. No credentials belong in this public repository. JavaScript is required for form submission.

## Deployment

The repository Pages source must be **GitHub Actions** (Settings → Pages → Build and deployment). `.github/workflows/pages.yml` validates and builds pull requests; only pushes/merges to `main` or a manual run on `main` deploy. The deploy job uses the `github-pages` environment with least-privilege Pages/OIDC permissions. Organization policies or environment protection rules may require an administrator's approval. No custom domain or DNS changes are needed.

Initial delivery is a PR; merging it starts the first Pages deployment. Check the Actions run and its published URL after merging. Failed PR checks do not publish. To roll back, revert the relevant commit through a PR.

## Content provenance and review

See [CONTENT_REVIEW.md](CONTENT_REVIEW.md) for sources, uncertainties, and checks before launch. No projects, people, events, or achievements have been invented. The editorial introduction follows the supplied brief. Existing event descriptions, locations, and URLs are missing from the source and have not been guessed.

## Verification

`npm test` covers event date boundaries, timezone offsets, ordering, malformed data, and the project-path build's internal links/assets. `npm run build` validates source events. Before launch, review desktop/mobile layouts, keyboard navigation, zoom, form delivery, and the Pages workflow in a browser. Browser preview was unavailable in the initial implementation environment.
