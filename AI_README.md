# AI Assistant Guide

This document provides essential context and conventions for AI assistants working on this project. For detailed documentation, see the files in the [`CONTEXT/`](./CONTEXT/) directory.

## Quick Reference

### Project Overview
- **Name**: EcliptOS Marketplace (forked from MLRun Hub)
- **Purpose**: Centralized repository for MLRun functions, modules, and steps
- **Tech Stack**: 
  - Python (CLI, build tools)
  - Next.js + TypeScript + Tailwind (Frontend - planned)
  - UV (Python package manager)
  - npm/npx (Node.js package manager)

### Critical Conventions

#### Python Package Management
- **ALWAYS use `uv` instead of `pip`**
  - ✅ `uv run python -m cli.cli ...`
  - ✅ `uv sync` (install dependencies)
  - ✅ `uv pip install -r requirements.txt`
  - ❌ Never use `pip install` or `python -m pip install`
  - ❌ Never use `python script.py` directly (use `uv run python script.py`)

#### Node.js Package Management
- **Use `npx` for one-off package executions**
  - ✅ `npx create-next-app@latest ...`
  - ✅ `npx eslint --init`
- **Use `npm run` for package.json scripts**
  - ✅ `npm run dev` (runs script from package.json)
  - ✅ `npm run build`
- **Use `npm install` for installing project dependencies**
  - ✅ `npm install` (installs from package.json)

#### Project Structure
```
ecliptos-marketplace/
├── cli/                    # Python CLI tools
├── functions/src/          # MLRun functions source
├── modules/src/            # MLRun modules source
├── steps/src/              # MLRun steps source
├── marketplace/           # Build output (gitignored)
├── ui/                     # Frontend (planned, not yet created)
├── CONTEXT/                # Detailed documentation
└── Makefile                # Convenience commands
```

## Documentation Index

All detailed documentation is in the [`CONTEXT/`](./CONTEXT/) directory:

### Core Documentation
- **[TOOL_USAGE_GUIDELINES.md](./CONTEXT/TOOL_USAGE_GUIDELINES.md)** - Comprehensive guide on when to use `uv` vs `pip`, `npx` vs `npm`, with examples and best practices

- **[DEVELOPMENT_WORKFLOW.md](./CONTEXT/DEVELOPMENT_WORKFLOW.md)** - Complete development workflow:
  - Building the marketplace
  - Linking to frontend (when created)
  - Running dev servers
  - When to rebuild

- **[BUILD_OUTPUT_FILES.md](./CONTEXT/BUILD_OUTPUT_FILES.md)** - Detailed documentation of:
  - What files are created by the build process
  - Directory structure of build output
  - Files needed for frontend integration

### Frontend Documentation
- **[FRONTEND_INTEGRATION_PLAN.md](./CONTEXT/FRONTEND_INTEGRATION_PLAN.md)** - Architecture and integration plan for Next.js frontend:
  - Directory structure
  - Data access strategy (symlinks)
  - Build process integration
  - Separation strategy for future repo split

- **[FRONTEND_QUICK_START.md](./CONTEXT/FRONTEND_QUICK_START.md)** - Quick start guide for frontend development:
  - Initial setup steps
  - Daily development workflow
  - Symlink script details

- **[HUB_UI_SPECIFICATION.md](./CONTEXT/HUB_UI_SPECIFICATION.md)** - Complete UI specification:
  - Feature requirements
  - Component architecture
  - Implementation phases
  - Technology stack details

## Common Tasks

### Building the Marketplace
```bash
# Build all sources (functions, modules, steps)
make build-marketplace

# Or build individually
uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master
```

### Running Tests
```bash
# Test a specific function
make test NAME=aggregate

# Test a module
make test NAME=count_events TYPE=modules
```

### Code Formatting
```bash
# Format code
make format

# Check formatting
make lint
```

### Frontend Development (When UI is Created)
```bash
# Build marketplace + link + start dev server
make dev

# Or step by step
make build-marketplace
make link-ui
make dev-ui
```

## Key Principles

1. **Always use `uv` for Python operations** - This is a hard requirement, not a suggestion
2. **Use `npx` for one-off npm tools** - Keeps global environment clean
3. **Use `npm run` for project scripts** - Standard way to execute package.json scripts
4. **Check CONTEXT/ files first** - Detailed documentation exists for most scenarios
5. **Follow existing patterns** - Look at similar functions/modules/steps for examples

## Important Notes

- The `marketplace/` directory is gitignored (build output)
- The `ui/` directory doesn't exist yet (planned)
- All Python commands should use `uv run`
- The Makefile is the preferred way to run common tasks
- When in doubt, check the relevant CONTEXT/ file

## When Making Changes

1. **Read relevant CONTEXT/ files** for the area you're working on
2. **Follow tool usage guidelines** (uv, npx, npm)
3. **Check existing code patterns** in similar files
4. **Update CONTEXT/ files** if you add new conventions or workflows
5. **Test your changes** using the appropriate make commands

## Questions?

- Check the relevant file in `CONTEXT/` first
- Review `TOOL_USAGE_GUIDELINES.md` for tool-related questions
- Look at existing code for patterns and conventions
- The Makefile shows common workflows

---

**Last Updated**: 2025-01-08  
**Purpose**: Provide AI assistants with essential context and quick reference to project conventions and documentation

