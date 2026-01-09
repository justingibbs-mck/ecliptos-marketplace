# Phase 1: Quick Setup Plan

## Overview

Phase 1 establishes the foundation for the EcliptOS Marketplace UI. This phase focuses on setting up the Next.js project structure, creating a basic layout, integrating with the marketplace catalog data, and verifying that data can be loaded successfully.

## Prerequisites

- Marketplace must be built first (run `make build-marketplace` to generate `marketplace/catalog.json`)
- Node.js and npm installed
- Project root: `/Users/Justin_Gibbs/Projects/Marketplace/ecliptos-marketplace`

## Tasks

### Task 1: Initialize Next.js Project

**Location**: Create `ui/` directory at project root

**Actions**:
- Create `ui/` directory
- Initialize Next.js project using `npx create-next-app@latest` with:
  - TypeScript enabled
  - Tailwind CSS enabled
  - App Router (not Pages Router)
  - ESLint enabled
  - Use current directory (`.`) as target
- Verify `package.json`, `tsconfig.json`, `tailwind.config.js`, and `next.config.js` are created

**Files Created**:
- `ui/package.json`
- `ui/tsconfig.json`
- `ui/tailwind.config.js`
- `ui/postcss.config.js`
- `ui/next.config.js`
- `ui/.eslintrc.json`
- `ui/src/app/layout.tsx`
- `ui/src/app/page.tsx`
- `ui/src/app/globals.css`

**Command**:
```bash
cd ui
npx create-next-app@latest . --typescript --tailwind --app --yes
```

### Task 2: Update Next.js Configuration for Static Export

**Location**: `ui/next.config.js`

**Actions**:
- Configure Next.js for static export (for v1 prototype)
- Set `output: 'export'` mode
- Ensure proper asset handling

**Rationale**: Per spec, v1 uses static export. Can upgrade to full SSR later (Option C).

### Task 3: Create Basic Layout Structure

**Location**: `ui/src/app/layout.tsx` and `ui/src/app/page.tsx`

**Actions**:
- Update root layout with:
  - Header component with "EcliptOS Marketplace" title
  - Main content area
  - Basic semantic HTML structure
- Create minimal home page that will display catalog data
- Apply basic Tailwind styling for header and layout

**Components to Create**:
- `ui/src/components/Header.tsx` - Simple header with title

### Task 4: Copy Catalog Data to Public Directory

**Location**: `ui/public/` directory

**Actions**:
- Create `ui/public/` directory if it doesn't exist
- Copy `marketplace/catalog.json` to `ui/public/catalog.json`
- Copy `marketplace/functions/` directory to `ui/public/functions/`
- Copy `marketplace/modules/` directory to `ui/public/modules/`
- Copy `marketplace/steps/` directory to `ui/public/steps/`

**Note**: Using file copy (not symlinks) for Phase 1 per user preference. Can switch to symlinks later.

**Verification**: Ensure `ui/public/catalog.json` exists and is readable

### Task 5: Create Catalog Loader Utility

**Location**: `ui/src/lib/catalog.ts`

**Actions**:
- Create TypeScript utility to load and parse `catalog.json`
- Define TypeScript interfaces for catalog structure:
  - `Catalog` - root catalog type
  - `CatalogItem` - individual function/module/step
  - `CatalogMetadata` - item metadata (name, description, categories, etc.)
- Create `loadCatalog()` function that:
  - Fetches `/catalog.json` from public directory
  - Parses JSON
  - Returns typed catalog data
- Handle basic error cases (file not found, invalid JSON)

**Type Structure** (based on BUILD_OUTPUT_FILES.md):
```typescript
interface Catalog {
  functions?: { [channel: string]: { [name: string]: CatalogItem } };
  modules?: { [channel: string]: { [name: string]: CatalogItem } };
  steps?: { [channel: string]: { [name: string]: CatalogItem } };
}
```

### Task 6: Integrate Catalog Loader in Home Page

**Location**: `ui/src/app/page.tsx`

**Actions**:
- Import catalog loader
- Call `loadCatalog()` on page load (use `useEffect` or Server Component)
- Log catalog data to console
- Display basic verification message in UI (e.g., "Catalog loaded: X functions, Y modules, Z steps")
- Handle loading state (show "Loading..." while fetching)

**Goal**: Verify that catalog data can be successfully loaded and accessed

### Task 7: Update .gitignore

**Location**: Root `.gitignore`

**Actions**:
- Add entries for Next.js build outputs:
  - `ui/.next/`
  - `ui/.vercel/`
  - `ui/node_modules/`
  - `ui/.env*.local`
  - `ui/out/`
- Ensure `marketplace/` is already ignored (should be)

### Task 8: Create UI README

**Location**: `ui/README.md`

**Actions**:
- Document the UI setup
- Explain how to run dev server
- Note about copying catalog data
- Link to main project documentation

### Task 9: Verify Setup

**Actions**:
- Run `npm install` in `ui/` directory
- Run `npm run dev` to start dev server
- Verify page loads at `http://localhost:3000`
- Check browser console for catalog data logs
- Verify header displays "EcliptOS Marketplace"
- Confirm catalog data structure is correct

## File Structure After Phase 1

```
ecliptos-marketplace/
├── ui/                          # NEW
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   ├── public/
│   │   ├── catalog.json         # Copied from marketplace/
│   │   ├── functions/           # Copied from marketplace/
│   │   ├── modules/             # Copied from marketplace/
│   │   └── steps/               # Copied from marketplace/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout with header
│   │   │   ├── page.tsx         # Home page (loads catalog)
│   │   │   └── globals.css      # Tailwind imports
│   │   ├── components/
│   │   │   └── Header.tsx       # Header component
│   │   └── lib/
│   │       └── catalog.ts       # Catalog loader utility
│   └── README.md
├── marketplace/                 # Must exist (built separately)
│   └── catalog.json
└── .gitignore                   # Updated with ui/ entries
```

## Success Criteria

- [ ] Next.js project initializes successfully
- [ ] Dev server runs without errors
- [ ] Header displays "EcliptOS Marketplace"
- [ ] Catalog data loads successfully
- [ ] Catalog data appears in browser console
- [ ] Basic page structure is visible
- [ ] TypeScript types are defined for catalog structure
- [ ] No build errors or warnings

## Dependencies

- Next.js 14+ (via `create-next-app`)
- React 18+
- TypeScript 5+
- Tailwind CSS 3+

## Notes

- **Data Copy**: Using file copy for Phase 1. Can switch to symlinks later for automatic updates
- **Error Handling**: Minimal for Phase 1 - assume catalog.json exists and is valid
- **Styling**: Basic Tailwind setup - full styling comes in Phase 2
- **Catalog Structure**: Based on `BUILD_OUTPUT_FILES.md` - structure is `{ "functions": { "master": { "function_name": { "latest": {...} } } } }`

## Next Steps (Phase 2)

After Phase 1 completion:
- Build FunctionCard component
- Display functions in grid layout
- Apply MLRun Hub-style card design
- Show function metadata (name, type, kind, description, categories, updated date)

## Implementation Todos

1. **init-nextjs**: Initialize Next.js project in ui/ directory with TypeScript and Tailwind CSS
2. **config-nextjs**: Configure Next.js for static export in next.config.js (depends on: init-nextjs)
3. **create-layout**: Create basic layout with Header component showing EcliptOS Marketplace title (depends on: init-nextjs)
4. **copy-catalog**: Copy catalog.json and marketplace directories to ui/public/ (depends on: init-nextjs)
5. **create-catalog-loader**: Create catalog.ts utility with TypeScript types and loadCatalog() function (depends on: init-nextjs)
6. **integrate-catalog**: Integrate catalog loader in home page and log data to console (depends on: create-catalog-loader, copy-catalog)
7. **update-gitignore**: Update .gitignore to exclude Next.js build outputs (depends on: init-nextjs)
8. **create-readme**: Create ui/README.md with setup and usage instructions (depends on: init-nextjs)
9. **verify-setup**: Verify dev server runs, catalog loads, and data appears in console (depends on: integrate-catalog, create-layout)

