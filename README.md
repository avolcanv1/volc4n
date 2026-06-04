# volc4n Web

## Stack

- React 19
- TypeScript
- Vite 8
- Sanity CMS

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # run ESLint
```

## Sanity CMS

Content is managed in Sanity Studio (`../studio`).

### Website setup

1. Create a project at [sanity.io/manage](https://sanity.io/manage)
2. Copy `.env.example` to `.env` and add your project ID:

```bash
cp .env.example .env
```

```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
```

3. Start the site:

```bash
npm run dev
```

Without `.env`, the site falls back to local placeholder data in `src/data/gallery.ts`.

### Studio setup

```bash
cd ../studio
cp .env.example .env
npm install
npm run dev
```

Studio runs at `http://localhost:3333`.

See `../studio/README.md` for content types and editing instructions.

## Open in Cursor

Open this folder as its own workspace:

**File → Open Folder… →** `volc4n/Web`

Or open the workspace file at `../volc4n.code-workspace`.
