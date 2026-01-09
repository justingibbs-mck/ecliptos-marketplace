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

## Future Workflow (After Frontend is Created)

Once the `ui/` directory is set up, the workflow will be:

### Option 1: Step-by-Step

```bash
# 1. Build marketplace
make build-marketplace

# 2. Link marketplace data to frontend
make link-ui

# 3. Start frontend dev server
make dev-ui
```

### Option 2: One Command (Combined)

```bash
# Build + Link + Start dev server
make dev
```

This will:
1. Build the marketplace (if needed)
2. Create symlinks in `ui/public/` pointing to `marketplace/`
3. Start Next.js dev server on `http://localhost:3000`

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

### Watch Mode (Future Enhancement)

Once the frontend is set up, Next.js will hot-reload when you change frontend code. However, if you change marketplace source files, you'll need to:

1. Rebuild marketplace: `make build-marketplace`
2. The symlinks will automatically point to the new files
3. Refresh the browser (or Next.js might auto-reload)

### Troubleshooting

**Problem**: Frontend can't find `catalog.json`
- **Solution**: Run `make build-marketplace` first, then `make link-ui`

**Problem**: Changes to functions don't show up
- **Solution**: Rebuild marketplace, then refresh browser

**Problem**: Symlinks not working (Windows)
- **Solution**: Use the copy-based script instead (see frontend integration plan)

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
         │ make link-ui (symlinks)
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
1. `make build-marketplace` → Creates all marketplace files
2. `make link-ui` → Connects marketplace to frontend (once frontend exists)
3. `make dev-ui` → Starts frontend dev server (once frontend exists)
4. Open browser → See your UI!

