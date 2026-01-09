# Frontend Integration Plan

## Overview

This document outlines the plan for integrating a Next.js frontend into the existing marketplace repository for prototyping, with a clear path for separation into a separate repository later.

## Directory Structure

```
ecliptos-marketplace/
├── ui/                          # Frontend application (NEW - self-contained)
│   ├── package.json             # Frontend dependencies
│   ├── next.config.js           # Next.js configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── public/                  # Static assets
│   │   ├── catalog.json         # Symlink or copy from marketplace build
│   │   └── functions/           # Symlink or copy from marketplace build
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   ├── components/          # React components
│   │   └── lib/                 # Utilities
│   └── README.md                # Frontend-specific docs
├── cli/                         # Existing Python CLI
├── functions/                   # Existing functions
├── modules/                     # Existing modules
├── steps/                       # Existing steps
├── marketplace/                 # Build output (gitignored)
│   ├── catalog.json
│   ├── functions/
│   ├── modules/
│   └── steps/
└── .gitignore                   # Updated to ignore marketplace/ and ui/.next/
```

## Key Design Decisions

### 1. Self-Contained Frontend Directory
- **Location**: `ui/` at the repository root
- **Rationale**: 
  - Clear separation from Python codebase
  - Easy to move to separate repo later (just move the `ui/` directory)
  - Own package.json, dependencies, and build process
  - No coupling with Python tooling

### 2. Data Access Strategy

**Option A: Symlinks (Recommended for Development)**
- Create symlinks from `ui/public/` to `marketplace/` build output
- Pros: Always up-to-date, no copy step needed
- Cons: Requires symlink support (works on macOS/Linux, needs admin on Windows)

**Option B: Build Script Integration**
- Add a step to the marketplace build process to copy files to `ui/public/`
- Pros: Works everywhere, explicit
- Cons: Requires build step coordination

**Option C: Relative Path Reading (For Production)**
- Frontend reads directly from `../marketplace/` at runtime
- Pros: No copy/symlink needed
- Cons: Only works in development, needs different strategy for production

**Recommendation**: Use **Option A (symlinks)** for development, with a fallback script for Windows users.

### 3. Build Process Integration

The marketplace build process should:
1. Build the marketplace (existing functionality)
2. Create/update symlinks in `ui/public/` pointing to built marketplace files
3. Optionally trigger frontend build if needed

### 4. Gitignore Strategy

Add to `.gitignore`:
```
# Marketplace build output
marketplace/

# Frontend build output
ui/.next/
ui/.vercel/
ui/node_modules/
ui/.env*.local
ui/out/
```

**Keep in version control**:
- `ui/` source code
- `ui/package.json`
- `ui/tsconfig.json`
- etc.

## Implementation Steps

### Phase 1: Setup Frontend Structure

1. Create `ui/` directory
2. Initialize Next.js project with TypeScript and Tailwind
3. Set up basic project structure
4. Create README.md in `ui/` explaining the setup

### Phase 2: Data Integration

1. Create symlink script (`scripts/link-marketplace.sh` or `scripts/link-marketplace.js`)
2. Update marketplace build to optionally create symlinks
3. Add npm script in `ui/package.json` to create symlinks
4. Document the process

### Phase 3: Development Workflow

1. Add Makefile targets for:
   - `make build-marketplace` - Build marketplace
   - `make link-ui` - Create symlinks for UI
   - `make dev-ui` - Run frontend dev server
   - `make build-ui` - Build frontend
2. Create a combined workflow script

## Separation Strategy (Future)

When ready to split the frontend:

1. **Move the directory**: `mv ui/ ../ecliptos-marketplace-ui/`
2. **Update data source**: 
   - Option 1: Frontend reads from API endpoint
   - Option 2: Frontend reads from published catalog.json URL
   - Option 3: Frontend build process pulls catalog.json as build step
3. **Update documentation**: Remove references to monorepo structure
4. **No code changes needed**: The frontend is already self-contained

## File Structure Details

### ui/package.json
```json
{
  "name": "ecliptos-marketplace-ui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "link-marketplace": "node scripts/link-marketplace.js"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

### scripts/link-marketplace.js (or .sh)
A script that:
1. Checks if `marketplace/` directory exists
2. Creates symlinks:
   - `ui/public/catalog.json` → `../marketplace/catalog.json`
   - `ui/public/functions/` → `../marketplace/functions/`
   - `ui/public/modules/` → `../marketplace/modules/`
   - `ui/public/steps/` → `../marketplace/steps/`
3. Handles errors gracefully (e.g., marketplace not built yet)

## Makefile Integration

Add to root `Makefile`:
```makefile
# Build marketplace
build-marketplace:
	uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master
	uv run python -m cli.cli build-marketplace -s modules/src -sn modules -m marketplace -c master
	uv run python -m cli.cli build-marketplace -s steps/src -sn steps -m marketplace -c master

# Link marketplace to UI
link-ui:
	cd ui && npm run link-marketplace

# Run UI dev server
dev-ui:
	cd ui && npm run dev

# Build UI
build-ui:
	cd ui && npm run build

# Note: npm run is correct for executing scripts defined in package.json
# For one-off package executions, use npx instead (e.g., npx create-next-app@latest)

# Full workflow: build marketplace + link + dev
dev: build-marketplace link-ui dev-ui
```

## Benefits of This Approach

1. **Clear Separation**: Frontend is completely isolated in its own directory
2. **Easy Development**: Symlinks keep data in sync automatically
3. **Simple Separation**: Moving `ui/` directory is all that's needed
4. **No Coupling**: Frontend doesn't depend on Python tooling
5. **Standard Structure**: Follows Next.js conventions
6. **Version Control**: Only source code is tracked, not build outputs

## Potential Issues & Solutions

### Issue: Symlinks on Windows
**Solution**: Provide a Node.js script that works cross-platform, or use a copy-based approach for Windows

### Issue: Marketplace not built
**Solution**: Script checks for marketplace directory and provides helpful error message

### Issue: Path differences in production
**Solution**: Use environment variables or config to specify catalog.json location

## Next Steps

1. ✅ Review and approve this plan
2. Create `ui/` directory structure
3. Initialize Next.js project
4. Create symlink/copy script
5. Update Makefile
6. Test the workflow
7. Begin Phase 1 implementation from spec

