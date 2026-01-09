# Development Workflow

## Overview

Yes, exactly! The workflow is:

1. **Build the marketplace** → Creates all the files (catalog.json, HTML docs, etc.)
2. **Link marketplace to frontend** → Create symlinks so frontend can read the data
3. **Start frontend dev server** → View the UI in your browser

## Current Workflow (Before Frontend is Created)

### Step 1: Build the Marketplace

Run the Makefile target to build all sources:

```bash
make build-marketplace
```

This will:
- Build `functions/src` → `marketplace/functions/master/`
- Build `modules/src` → `marketplace/modules/master/`
- Build `steps/src` → `marketplace/steps/master/`
- Create `marketplace/catalog.json` (combined catalog)
- Generate all HTML documentation files
- Create `tags.json` files

**Output**: All files are created in the `marketplace/` directory (which is gitignored)

### Step 2: Verify Build Output

Check that files were created:

```bash
ls marketplace/
# Should see: catalog.json, index.html, README.md, functions/, modules/, steps/

ls marketplace/functions/master/
# Should see: catalog.json, tags.json, _static/, and directories for each function
```

## Current Workflow (After Frontend is Created)

Once the `ui/` directory is set up, the workflow is:

### Option 1: Step-by-Step

```bash
# 1. Build marketplace
make build-marketplace

# 2. Copy marketplace data to frontend
make copy-ui

# 3. Start frontend dev server
make dev-ui
```

### Option 2: One Command (Combined)

```bash
# Build + Copy + Start dev server (all in one)
make dev
```

This will:
1. Build the marketplace (creates `marketplace/` directory)
2. Copy marketplace data to `ui/public/` (catalog.json, functions/, modules/, steps/)
3. Start Next.js dev server on `http://localhost:3000`

**Important**: After rebuilding the marketplace, you must run `make copy-ui` to update the UI with the latest data.

## What Happens When You Build

When you run `make build-marketplace`, it:

1. **Reads source directories** (`functions/src/`, `modules/src/`, `steps/src/`)
2. **Generates documentation** using Sphinx
3. **Creates catalog.json** with all metadata
4. **Copies source files** to marketplace structure
5. **Generates HTML files** for each item:
   - Documentation pages
   - Example notebooks
   - Source code views
   - YAML views

## When to Rebuild

Rebuild the marketplace when:
- ✅ You add a new function/module/step
- ✅ You modify `item.yaml` files
- ✅ You update function code (to regenerate docs)
- ✅ You change function metadata (categories, description, etc.)

**You don't need to rebuild** when:
- ❌ You're only working on frontend code
- ❌ You're just viewing the UI
- ❌ You're making CSS/styling changes

## Development Tips

### Quick Rebuild

If you only changed one source type, you can rebuild just that:

```bash
# Rebuild only functions
uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master

# Rebuild only modules
uv run python -m cli.cli build-marketplace -s modules/src -sn modules -m marketplace -c master
```

**Note:** All Python commands use `uv run` instead of `pip` or `python` directly. This ensures:
- Consistent Python environment management
- Faster dependency resolution
- Better reproducibility across different systems

### Watch Mode

Next.js will hot-reload when you change frontend code. However, if you change marketplace source files, you'll need to:

1. Rebuild marketplace: `make build-marketplace`
2. Copy updated data to UI: `make copy-ui`
3. Refresh the browser (or Next.js might auto-reload)

**Note**: Currently using file copy (not symlinks) for cross-platform compatibility. The copy step is required after each marketplace rebuild.

### Troubleshooting

**Problem**: Frontend can't find `catalog.json`
- **Solution**: Run `make build-marketplace` first, then `make copy-ui`

**Problem**: Changes to functions don't show up
- **Solution**: Rebuild marketplace with `make build-marketplace`, then copy to UI with `make copy-ui`, then refresh browser

**Problem**: UI shows old data after marketplace rebuild
- **Solution**: Run `make copy-ui` after rebuilding the marketplace to update `ui/public/` with the latest data

## Summary

```
┌─────────────────┐
│  Source Files   │  (functions/src/, modules/src/, steps/src/)
│  (item.yaml,    │
│   *.py, etc.)   │
└────────┬────────┘
         │
         │ make build-marketplace
         │
         ▼
┌─────────────────┐
│   Marketplace   │  (marketplace/)
│  (catalog.json, │
│   HTML docs)    │
└────────┬────────┘
         │
         │ make copy-ui (copies files)
         │
         ▼
┌─────────────────┐
│  Frontend UI    │  (ui/public/)
│  (Next.js app)  │
└────────┬────────┘
         │
         │ make dev-ui
         │
         ▼
┌─────────────────┐
│   Browser       │  (http://localhost:3000)
│   (View UI)     │
└─────────────────┘
```

**TL;DR**: 
1. `make build-marketplace` → Creates all marketplace files in `marketplace/`
2. `make copy-ui` → Copies marketplace data to `ui/public/` (run after each rebuild)
3. `make dev-ui` → Starts frontend dev server
4. **OR** `make dev` → Does all three steps above in one command
5. Open browser → See your UI!

**Important**: After rebuilding the marketplace, always run `make copy-ui` to update the UI with the latest data.

