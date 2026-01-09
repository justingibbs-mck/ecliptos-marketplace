.PHONY: help sync format lint test cli

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

sync: ## Sync dependencies from lockfile
	uv sync

format: ## Format code with ruff
	uv run ruff format .
	uv run ruff check --fix .

lint: ## Run linters
	uv run ruff format --check .
	uv run ruff check .

test: ## Run tests for a specific asset (usage: make test NAME=aggregate [TYPE=functions])
	@if [ -z "$(NAME)" ]; then \
		echo "Error: NAME parameter is required"; \
		echo "Usage: make test NAME=<asset_name> [TYPE=functions|modules|steps]"; \
		echo "Example: make test NAME=aggregate"; \
		echo "Example: make test NAME=mymodule TYPE=modules"; \
		exit 1; \
	fi
	@TYPE=$${TYPE:-functions}; \
	echo "Running tests for $$TYPE/src/$(NAME)"; \
	uv run python -m cli.cli run-tests -r $$TYPE/src/$(NAME) -s py -fn $(NAME)

cli: ## Run the CLI tool (usage: make cli ARGS="command args")
	uv run python -m cli.cli $(ARGS)

build-marketplace: ## Build marketplace for all sources (functions, modules, steps)
	@echo "Building marketplace for functions..."
	uv run python -m cli.cli build-marketplace -s functions/src -sn functions -m marketplace -c master
	@echo "Building marketplace for modules..."
	uv run python -m cli.cli build-marketplace -s modules/src -sn modules -m marketplace -c master
	@echo "Building marketplace for steps..."
	uv run python -m cli.cli build-marketplace -s steps/src -sn steps -m marketplace -c master
	@echo "✅ Marketplace build complete!"

copy-ui: ## Copy marketplace data to ui/public/ (run after build-marketplace)
	@if [ ! -d "marketplace" ]; then \
		echo "❌ Error: marketplace/ directory not found. Run 'make build-marketplace' first."; \
		exit 1; \
	fi
	@echo "Copying marketplace data to ui/public/..."
	@mkdir -p ui/public
	@if [ -f "marketplace/catalog.json" ]; then \
		cp marketplace/catalog.json ui/public/catalog.json && \
		echo "✅ Copied catalog.json"; \
	else \
		echo "⚠️  Warning: catalog.json not found in marketplace/"; \
	fi
	@if [ -d "marketplace/functions" ]; then \
		rm -rf ui/public/functions && \
		cp -r marketplace/functions ui/public/ && \
		echo "✅ Copied functions/"; \
	else \
		echo "⚠️  Warning: functions/ not found in marketplace/"; \
	fi
	@if [ -d "marketplace/modules" ]; then \
		rm -rf ui/public/modules && \
		cp -r marketplace/modules ui/public/ && \
		echo "✅ Copied modules/"; \
	else \
		echo "⚠️  Warning: modules/ not found in marketplace/"; \
	fi
	@if [ -d "marketplace/steps" ]; then \
		rm -rf ui/public/steps && \
		cp -r marketplace/steps ui/public/ && \
		echo "✅ Copied steps/"; \
	else \
		echo "⚠️  Warning: steps/ not found in marketplace/"; \
	fi
	@echo "✅ Marketplace data copied to ui/public/"

dev-ui: ## Start Next.js dev server (requires copy-ui first)
	@if [ ! -f "ui/public/catalog.json" ]; then \
		echo "❌ Error: ui/public/catalog.json not found."; \
		echo "   Run 'make build-marketplace' then 'make copy-ui' first."; \
		exit 1; \
	fi
	@cd ui && npm run dev

build-ui: ## Build Next.js for production
	@cd ui && npm run build

dev: build-marketplace copy-ui dev-ui ## Build marketplace, copy to UI, and start dev server

.DEFAULT_GOAL := help

