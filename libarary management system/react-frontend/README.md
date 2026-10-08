# React Conversion (Templates to React)

This folder contains a React (Vite) frontend generated from all HTML templates in the Django project.

## What was converted

- Source templates: `../templates/*.html`
- Generated React pages: `src/pages/*Page.jsx`
- Generated route map: `src/routes.generated.jsx`

## Commands

```bash
npm install
npm run generate:pages
npm run dev
npm run build
```

## Route mapping

- `index.html` -> `/`
- `{name}.html` -> `/{name}` (example: `books.html` -> `/books`)

## Important notes

- Django/Jinja tags (`{% ... %}`, `{{ ... }}`) are removed in generated pages.
- Inline `<script>` blocks are removed during generation.
- This conversion gives you a React baseline for UI migration. Dynamic backend behavior should be reimplemented with React state/hooks and API calls.

## Regenerating after template changes

After editing HTML templates, run:

```bash
npm run generate:pages
```

This will regenerate all page components and route definitions.
