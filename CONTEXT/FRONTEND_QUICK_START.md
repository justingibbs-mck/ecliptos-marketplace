# Frontend Quick Start Guide

## TL;DR

The frontend will live in `ui/` directory, completely self-contained. It reads from the built marketplace via symlinks. To separate later, just move the `ui/` directory.

## Directory Structure

```
ecliptos-marketplace/
├── ui/                    # ← Frontend lives here (NEW)
│   ├── package.json
│   ├── src/
│   └── public/            # Symlinks to marketplace/ build output
├── marketplace/           # Build output (gitignored)
│   ├── catalog.json
│   ├── functions/
│   ├── modules/
│   └── steps/
├── cli/                   # Python CLI (existing)
├── functions/             # Source (existing)
├── modules/               # Source (existing)
└── steps/                 # Source (existing)
```

## Workflow

### Initial Setup (One-time)
```bash
# 1. Create Next.js project in ui/ directory
cd ui
npx create-next-app@latest . --typescript --tailwind --app --yes

# 2. Install dependencies
# Note: npm install is correct here - it installs from package.json
npm install

# 3. Create symlink script (see below)
```

### Daily Development
```bash
# Option 1: Use Makefile (recommended)
make build-marketplace  # Build marketplace
make link-ui            # Create symlinks
make dev-ui             # Start frontend dev server

# Option 2: Manual steps
# Build marketplace
uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master
uv run python -m cli.cli build-marketplace -s modules/src -sn modules -m marketplace -c master
uv run python -m cli.cli build-marketplace -s steps/src -sn steps -m marketplace -c master

# Link marketplace to UI
cd ui && npm run link-marketplace

# Start dev server
cd ui && npm run dev

# Note: For one-off npm package installations, use npx:
# npx <package-name> [args]
# For running scripts defined in package.json, use npm run:
# npm run <script-name>
```

## Symlink Script

Create `ui/scripts/link-marketplace.js`:

```javascript
const fs = require('fs');
const path = require('path');

const marketplaceDir = path.join(__dirname, '../../marketplace');
const publicDir = path.join(__dirname, '../public');

// Check if marketplace exists
if (!fs.existsSync(marketplaceDir)) {
  console.error('❌ Marketplace not built yet. Run: make build-marketplace');
  process.exit(1);
}

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Remove existing symlinks/files
const toLink = [
  { from: 'catalog.json', to: 'catalog.json' },
  { from: 'functions', to: 'functions' },
  { from: 'modules', to: 'modules' },
  { from: 'steps', to: 'steps' },
];

toLink.forEach(({ from, to }) => {
  const target = path.join(publicDir, to);
  const source = path.join(marketplaceDir, from);
  
  // Remove existing
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
  
  // Create symlink
  if (fs.existsSync(source)) {
    fs.symlinkSync(path.relative(publicDir, source), target, 'dir');
    console.log(`✅ Linked ${to}`);
  } else {
    console.warn(`⚠️  ${from} not found in marketplace`);
  }
});

console.log('✅ Marketplace linked to UI');
```

Add to `ui/package.json`:
```json
{
  "scripts": {
    "link-marketplace": "node scripts/link-marketplace.js"
  }
}
```

## Separation Strategy (Future)

When ready to move frontend to separate repo:

1. **Move directory**: `mv ui/ ../ecliptos-marketplace-ui/`
2. **Update data source**: 
   - Read from API endpoint, OR
   - Read from published catalog.json URL, OR
   - Pull catalog.json as build step
3. **No code changes needed** - frontend is already self-contained

## Key Points

✅ **Self-contained**: Frontend has its own package.json, dependencies, build process  
✅ **No coupling**: Doesn't depend on Python tooling  
✅ **Easy separation**: Just move `ui/` directory  
✅ **Symlinks**: Keep data in sync automatically (or use copy script for Windows)  
✅ **Gitignored**: Build outputs not tracked, only source code

## Next Steps

1. Review `FRONTEND_INTEGRATION_PLAN.md` for full details
2. Create `ui/` directory
3. Initialize Next.js project
4. Create symlink script
5. Update Makefile with convenience commands
6. Start building UI according to `HUB_UI_SPECIFICATION.md`

