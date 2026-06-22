# jaideepsingh.com

Personal portfolio for **Jaideep Singh** — Software Engineer (Toronto, ON).

A single-page, dependency-free static site (HTML / CSS / vanilla JS) hosted on
GitHub Pages. No build step required.

## Structure

```
index.html        Markup & content
styles.css        All styling (dark theme, animations, responsive)
script.js         Scroll reveals, project filtering, active-nav, count-up
assets/           favicon + résumé PDF
CNAME             Custom domain (jaideepsingh.com)
```

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing content

All content lives in `index.html`. Projects are `<article class="project-card">`
blocks tagged with `data-cats` (e.g. `fullstack ai`) that drive the filter buttons.

## Deploy

Pushing to `main` auto-publishes via GitHub Pages (Settings → Pages → Source: `main` / root).
