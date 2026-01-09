# Tool Usage Guidelines

This document outlines the correct usage of `npx` vs `npm` and `uv` vs `pip` throughout the project.

## npm vs npx

### When to Use npx

Use `npx` for **one-off package executions** where you want to run a package without installing it globally:

```bash
# ✅ Correct: Using npx for one-off commands
npx create-next-app@latest . --typescript --tailwind --app --yes
npx eslint --init
npx prettier --write .
```

**Benefits:**
- No need to install packages globally
- Always uses the latest version (unless version is specified)
- Cleaner system without global package pollution

### When to Use npm

Use `npm` for **project-level operations**:

1. **Installing dependencies from package.json:**
   ```bash
   # ✅ Correct: Installing project dependencies
   npm install
   ```

2. **Running scripts defined in package.json:**
   ```bash
   # ✅ Correct: Running npm scripts
   npm run dev
   npm run build
   npm run link-marketplace
   ```

3. **Installing packages to add to package.json:**
   ```bash
   # ✅ Correct: Adding a dependency to the project
   npm install <package-name>
   npm install --save-dev <package-name>
   ```

### Summary Table

| Use Case | Command | Example |
|----------|---------|---------|
| One-off package execution | `npx` | `npx create-next-app@latest` |
| Run npm script | `npm run` | `npm run dev` |
| Install project dependencies | `npm install` | `npm install` |
| Add dependency to project | `npm install <pkg>` | `npm install react` |

## uv vs pip

### When to Use uv

Use `uv` for **all Python package management** in this project:

1. **Running Python commands:**
   ```bash
   # ✅ Correct: Using uv run for Python commands
   uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master
   uv run ruff format .
   uv run pytest
   ```

2. **Installing dependencies:**
   ```bash
   # ✅ Correct: Using uv for dependency management
   uv sync                    # Sync from lockfile
   uv pip install -r requirements.txt  # Install from requirements file
   ```

3. **Managing Python environments:**
   ```bash
   # ✅ Correct: UV manages Python versions automatically
   uv sync  # Automatically creates/manages virtual environment
   ```

### When NOT to Use pip

**Never use `pip` directly** in this project:

```bash
# ❌ Wrong: Don't use pip directly
pip install <package>
python -m pip install <package>
python script.py

# ✅ Correct: Use uv instead
uv pip install <package>
uv run python script.py
```

### Benefits of uv

1. **Speed**: 10-100x faster than pip
2. **Consistency**: Lockfile ensures reproducible builds
3. **Python Management**: Automatically manages Python versions
4. **Better Dependency Resolution**: More reliable than pip
5. **Project Standard**: This project standardizes on uv

### Summary Table

| Use Case | Command | Example |
|----------|---------|---------|
| Run Python script | `uv run python` | `uv run python -m cli.cli` |
| Install dependencies | `uv sync` | `uv sync` |
| Install from requirements | `uv pip install -r` | `uv pip install -r requirements.txt` |
| Run Python tool | `uv run <tool>` | `uv run ruff format .` |

## Current Project Status

### ✅ Already Correct

1. **Python Commands**: All Python commands in CONTEXT files use `uv run`
   - `uv run python -m cli.cli build-marketplace ...`
   - `uv run ruff format .`
   - `uv run pytest`

2. **One-off npm Commands**: Already using `npx` where appropriate
   - `npx create-next-app@latest ...`

3. **npm Scripts**: Correctly using `npm run` for package.json scripts
   - `npm run dev`
   - `npm run build`
   - `npm run link-marketplace`

### 📝 Documentation Updates Made

1. Added clarifying notes in `FRONTEND_QUICK_START.md` about when to use `npx` vs `npm run`
2. Added notes in `FRONTEND_INTEGRATION_PLAN.md` about npm vs npx usage
3. Added comprehensive notes in `HUB_UI_SPECIFICATION.md` about npm vs npx
4. Added notes in `DEVELOPMENT_WORKFLOW.md` about using `uv run` instead of `pip`
5. Added notes in `BUILD_OUTPUT_FILES.md` about using `uv` for Python package management

## Best Practices

### For Frontend Development

```bash
# One-time setup
npx create-next-app@latest . --typescript --tailwind --app --yes
npm install

# Daily development
npm run dev          # Start dev server
npm run build        # Build for production
npm run link-marketplace  # Link marketplace data
```

### For Python/Backend Development

```bash
# Setup
uv sync              # Install all dependencies

# Development
uv run python -m cli.cli build-marketplace ...
uv run ruff format .
uv run ruff check .
uv run pytest

# Installing additional dependencies
uv pip install -r functions/src/my_function/requirements.txt
```

## Makefile Commands

The Makefile already uses `uv` correctly:

```makefile
sync: ## Sync dependencies from lockfile
	uv sync

format: ## Format code with ruff
	uv run ruff format .
	uv run ruff check --fix .

lint: ## Run linters
	uv run ruff format --check .
	uv run ruff check .

test: ## Run tests
	uv run python -m cli.cli run-tests ...

build-marketplace: ## Build marketplace
	uv run python -m cli.cli build-marketplace ...
```

## References

- [UV Documentation](https://github.com/astral-sh/uv)
- [npm vs npx](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/)
- [npm Scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)

