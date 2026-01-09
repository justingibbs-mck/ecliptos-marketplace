# Marketplace Build Output Files

This document lists all files and directories created by the marketplace build process (via `build_marketplace` function).

## Build Process Overview

The build process is typically run via:
```bash
uv run python -m cli.cli build-marketplace -s <source_dir> -sn <source_name> -m <marketplace_dir> -c <channel>
```

For example:
```bash
uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master
```

**Note:** The command above builds a single source (functions in this example). To build all sources (functions, modules, and steps) at once, use the Makefile target:
```bash
make build-marketplace
```
This runs the CLI command three times (once for each source) and is the recommended approach for full marketplace builds.

**Note:** This project uses `uv` instead of `pip` for all Python package management. The `uv run` command ensures:
- Dependencies are resolved from the project's lockfile
- Consistent Python version across environments
- Faster execution compared to traditional pip-based workflows

## Directory Structure Created

The build process creates the following structure in the `marketplace_dir`:

```
marketplace/                          # Root marketplace directory
├── catalog.json                      # Main catalog (all sources/channels combined)
├── index.html                        # Root index page
├── README.md                         # Changelog and documentation
│
├── functions/                        # Source: functions
│   └── master/                       # Channel: master (or development)
│       ├── catalog.json              # Channel-specific catalog (with assets)
│       ├── tags.json                 # All categories and kinds
│       ├── _static/                  # Static resources (CSS, JS, etc.)
│       │   └── css/
│       │       └── ...                # Sphinx-generated CSS files
│       │
│       └── {function_name}/          # One directory per function
│           ├── latest/               # Latest version
│           │   ├── src/              # Complete source directory copy
│           │   │   ├── item.yaml
│           │   │   ├── function.yaml (if exists)
│           │   │   ├── *.py
│           │   │   ├── *.ipynb
│           │   │   └── ...            # All source files
│           │   │
│           │   └── static/           # Generated HTML documentation
│           │       ├── {function_name}.html      # Source code docs
│           │       ├── documentation.html        # Main documentation
│           │       ├── example.html              # Example notebook (if exists)
│           │       ├── source.html               # Python source code view
│           │       ├── item.html                 # item.yaml view
│           │       └── function.html             # function.yaml view (if exists)
│           │
│           └── {version}/            # Versioned directory (e.g., "0.1.0")
│               ├── src/              # Same as latest/src
│               └── static/            # Same as latest/static
│
├── modules/                          # Source: modules
│   └── master/                       # Same structure as functions/master/
│       └── ...
│
└── steps/                            # Source: steps
    └── master/                       # Same structure as functions/master/
        └── ...
```

## Files Created

### Root Level Files

1. **`catalog.json`** (at `marketplace/catalog.json`)
   - Combined catalog for all sources and channels
   - Structure: `{ "functions": { "master": {...} }, "modules": {...}, "steps": {...} }`
   - Does NOT include asset paths

2. **`index.html`** (at `marketplace/index.html`)
   - Root index page (copied from template)

3. **`README.md`** (at `marketplace/README.md`)
   - Contains changelog of what was added/updated/deleted
   - Appended to existing content if file exists

### Per-Source-Per-Channel Files

For each source (functions/modules/steps) and channel (master/development):

1. **`catalog.json`** (at `marketplace/{source}/{channel}/catalog.json`)
   - Channel-specific catalog
   - Structure: `{ "function_name": { "latest": {...}, "0.1.0": {...} } }`
   - **Includes asset paths** (with_assets=True)

2. **`tags.json`** (at `marketplace/{source}/{channel}/tags.json`)
   - All unique categories and kinds found in items
   - Structure: `{ "categories": [...], "kind": [...] }`

3. **`_static/`** directory
   - Static resources copied from Sphinx build
   - Contains CSS files, JavaScript, images, etc.

### Per-Item Files

For each function/module/step, the build creates:

#### Source Files (in `{item_name}/latest/src/` and `{item_name}/{version}/src/`)
- Complete copy of the source directory
- Includes:
  - `item.yaml`
  - `function.yaml` / `module.yaml` / `step.yaml` (if exists)
  - All Python files (`.py`)
  - All notebooks (`.ipynb`)
  - All other source files

#### Static HTML Files (in `{item_name}/latest/static/` and `{item_name}/{version}/static/`)

1. **`{item_name}.html`**
   - Sphinx-generated documentation from source code
   - Contains docstrings, API reference, etc.

2. **`documentation.html`**
   - Main documentation page
   - Processed version of the source HTML with fixed paths

3. **`example.html`** (if example notebook exists)
   - Rendered example notebook
   - Processed with fixed paths

4. **`source.html`** (if Python file exists)
   - Syntax-highlighted Python source code
   - Generated from Jinja template

5. **`item.html`**
   - Syntax-highlighted `item.yaml` content
   - Generated from Jinja template

6. **`function.html`** / **`module.html`** / **`step.html`** (if asset YAML exists)
   - Syntax-highlighted `function.yaml` / `module.yaml` / `step.yaml` content
   - Generated from Jinja template

## Summary

**Total files created per build:**

- **Root level**: 3 files (`catalog.json`, `index.html`, `README.md`)
- **Per source/channel**: 2 files (`catalog.json`, `tags.json`) + `_static/` directory
- **Per item**: 
  - Complete source directory copy (in `latest/src/` and `{version}/src/`)
  - 4-6 HTML files (in `latest/static/` and `{version}/static/`)

**For a typical build with:**
- 3 sources (functions, modules, steps)
- 1 channel (master)
- ~30 functions, ~5 modules, ~1 step

**Approximate output:**
- ~40 root/channel-level files
- ~30 × 2 = 60 item directories (latest + version)
- ~180-240 HTML files (6 per item × 30-40 items)
- Hundreds of source files (copied from source directories)

## Files Needed for Frontend

For the Next.js frontend, you'll need:

1. **`catalog.json`** (root level) - Main data source
2. **`{source}/{channel}/functions/`** directories - For accessing static HTML documentation
3. **`{source}/{channel}/modules/`** directories - For accessing static HTML documentation  
4. **`{source}/{channel}/steps/`** directories - For accessing static HTML documentation

The frontend can read:
- `catalog.json` for metadata and search/filter
- `{item_name}/latest/static/documentation.html` for detailed documentation
- `{item_name}/latest/static/example.html` for examples
- `{item_name}/latest/static/source.html` for source code viewing

## Notes

- All build output is in the `marketplace/` directory (which should be gitignored)
- The build process preserves version history (creates `{version}/` directories)
- HTML files are processed to fix relative paths for proper linking
- Source files are copied as-is (not modified)
- The `catalog.json` at root level is different from channel-level (root has no assets, channel has assets)

