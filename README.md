# Timus — Vite Timer App

A small Vite-based web app providing a focus timer (start / pause / reset) built with vanilla JavaScript and Tailwind-style utility classes.

**Prerequisites**

- Node.js v18+ and `npm`

**Install**

```bash
npm install
```

**Development**

```bash
npm run dev
# open the URL Vite shows (typically http://localhost:5173)
```

**Build**

```bash
npm run build
# output -> dist/
```

**Preview build**

```bash
npm run preview
```

**Deploy (GitHub Pages via Actions)**

This repository includes a workflow at `.github/workflows/deploy.yml` that builds the site and deploys `dist/` to GitHub Pages on push to the `main` branch.

Steps to enable CI deploy:

- Commit and push to `main`:

```bash
git add .
git commit -m "Add deploy workflow and README"
git push origin main
```

- Confirm GitHub Pages is enabled for the repository (Settings → Pages). The Actions workflow will run on push and publish the `dist/` artifact.

**Project structure (key files)**

- `index.html` — app entry
- `package.json` — scripts & dependencies
- `vite.config.js` — Vite config
- `public/` — static assets
- `src/` — source files
	- `main.js`
	- `timer.js`
	- `style.css`

**Useful npm scripts (expected)**

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — locally preview built site

If your `package.json` uses different script names, adapt the commands accordingly.

**Contributing**

PRs and issues welcome — keep changes minimal and focused.

**License**

Add a license file if you want to open-source this project.
