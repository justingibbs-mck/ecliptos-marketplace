# Phase 2: Core Display Plan

## Overview

Phase 2 focuses on building the core UI components to display marketplace items (functions, modules, steps) in a card-based grid layout matching the MLRun Hub style. This phase establishes the visual foundation for browsing and discovering marketplace items.

## Prerequisites

- ✅ Phase 1 complete (Next.js setup, catalog loader, basic layout)
- Marketplace built (`make build-marketplace`)
- Catalog data copied to `ui/public/` (`make copy-ui` or manual copy)
- Dev server can run (`npm run dev` in `ui/` directory)

## Goals

1. Create a reusable `FunctionCard` component that displays item metadata
2. Display all marketplace items (functions, modules, steps) in a responsive grid layout
3. Apply MLRun Hub-inspired styling with Tailwind CSS
4. Show all required metadata fields on each card

## Data Structure Reference

Based on the catalog structure, each item has:
- `name`: Item name (e.g., "auto_trainer", "mlflow_utils")
- `description`: Short description text
- `categories`: Array of category strings (e.g., ["machine-learning", "model-training"])
- `kind`: From `spec.kind` (e.g., "job", "serving", "nuclio:serving", "monitoring_application", "generic")
- `version`: Version string (e.g., "1.8.0")
- `generationDate`: Date string in format "YYYY-MM-DD:HH-MM" (can be used for "updated" date)
- `type`: Item type ("functions", "modules", or "steps")

## Tasks

### Task 1: Update Catalog Types

**Location**: `ui/src/lib/catalog.ts`

**Actions**:
- Enhance `CatalogItem` interface to include all available fields from catalog.json
- Add helper functions to extract:
  - `getItemKind(item)`: Extract kind from `spec.kind`
  - `getItemUpdatedDate(item)`: Format `generationDate` to readable "Updated X ago" format
  - `getItemTypeLabel(item, type)`: Convert type to display label ("Functions", "Modules", "Steps")
- Ensure types match actual catalog structure

**Fields to add to CatalogItem interface**:
```typescript
export interface CatalogItem {
  latest: {
    name: string;
    description?: string;
    categories?: string[];
    kind?: string;  // From spec.kind
    version?: string;
    generationDate?: string;  // Format: "YYYY-MM-DD:HH-MM"
    spec?: {
      kind?: string;  // Actual kind value
      [key: string]: any;
    };
    [key: string]: any;
  };
  [version: string]: any;
}
```

### Task 2: Create Utility Functions for Date Formatting

**Location**: `ui/src/lib/utils.ts` (new file)

**Actions**:
- Create `formatRelativeDate(dateString: string): string` function
  - Parse `generationDate` format ("YYYY-MM-DD:HH-MM")
  - Convert to relative time (e.g., "Updated 2 days ago", "Updated 3 months ago")
  - Handle edge cases (today, yesterday, future dates)
- Create `formatCategoryName(category: string): string` function
  - Convert kebab-case to Title Case (e.g., "machine-learning" → "Machine Learning")
  - Handle special cases

**Dependencies**: No external dependencies - implement simple relative date logic

### Task 3: Create FunctionCard Component

**Location**: `ui/src/components/FunctionCard.tsx` (new file)

**Actions**:
- Create a card component that displays:
  - **Name**: As heading (h3 or h4)
  - **Type badge**: "Functions", "Modules", or "Steps" (color-coded)
  - **Kind badge**: "Job", "Serving", "Monitoring Application", etc. (from spec.kind)
  - **Description**: Full or truncated (with ellipsis if too long)
  - **Categories**: Display as tags/badges (limit to 3-4, show "+X more" if needed)
  - **Updated date**: "Updated X ago" format
  - **Hover effects**: Subtle shadow/elevation on hover
  - **Click handler**: Prepare for Phase 4 (detail view)

**Design Requirements**:
- Match MLRun Hub card style:
  - White background with subtle border
  - Rounded corners
  - Shadow on hover
  - Spacing between elements
  - Badge styling (small, rounded, color-coded)
- Responsive: Cards should stack on mobile, grid on desktop
- Accessible: Proper semantic HTML, keyboard navigation

**Props Interface**:
```typescript
interface FunctionCardProps {
  item: {
    type: 'functions' | 'modules' | 'steps';
    name: string;
    item: CatalogItem;
    channel: string;
  };
  // Note: onClick will be added in Phase 4
}
```

**Styling Guidelines**:
- Use Tailwind utility classes
- Type badges: Different colors for functions/modules/steps
- Kind badges: Neutral colors (gray/blue)
- Category tags: Small, muted colors
- Card padding: `p-4` or `p-6`
- Card spacing: `mb-4` or `mb-6`
- Border: `border border-gray-200`
- Hover: `hover:shadow-lg transition-shadow`

### Task 4: Create ItemGrid Component

**Location**: `ui/src/components/ItemGrid.tsx` (new file)

**Actions**:
- Create a grid container component that:
  - Displays cards in a responsive grid
  - Uses CSS Grid or Flexbox
  - Responsive breakpoints:
    - Mobile (< 768px): 1 column
    - Tablet (768-1024px): 2 columns
    - Desktop (> 1024px): 3-4 columns
  - Handles empty state (no items)
  - Accepts array of items from `getAllItems()`

**Props Interface**:
```typescript
interface ItemGridProps {
  items: Array<{
    type: 'functions' | 'modules' | 'steps';
    name: string;
    item: CatalogItem;
    channel: string;
  }>;
  // Note: onItemClick will be added in Phase 4
}
```

**Styling**:
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` (3 columns max on xl screens)
- Container: `container mx-auto px-4 py-8`

### Task 5: Update Home Page to Display Grid

**Location**: `ui/src/app/page.tsx`

**Actions**:
- Replace current catalog status display with ItemGrid
- Pass all items from `getAllItems(catalog)` to ItemGrid
- Remove or simplify the status message (keep minimal or remove)
- Ensure loading state still works
- Ensure error state still works

**Changes**:
- Import `ItemGrid` component
- Import `getAllItems` from catalog
- Replace status display with `<ItemGrid items={items} />`
- Keep loading/error states

### Task 6: Enhance Styling and Polish

**Location**: Multiple files

**Actions**:
- Update `globals.css` if needed for base styles
- Ensure consistent spacing throughout
- Add smooth transitions for hover effects
- Test card truncation (long descriptions)
- Test with various data (items with/without categories, descriptions, etc.)
- Verify responsive behavior on different screen sizes

**Styling Checklist**:
- [ ] Cards have consistent spacing
- [ ] Badges are properly styled and readable
- [ ] Text truncation works for long descriptions
- [ ] Hover effects are smooth
- [ ] Grid is responsive (1/2/3/4 columns)
- [ ] Colors are accessible (sufficient contrast)
- [ ] Typography is readable

### Task 7: Handle Edge Cases

**Location**: `ui/src/components/FunctionCard.tsx` and related files

**Actions**:
- Handle missing fields gracefully:
  - No description: Show placeholder text or hide section
  - No categories: Don't show category section
  - No kind: Don't show kind badge
  - No generationDate: Don't show updated date
- Handle long text:
  - Truncate descriptions (2-3 lines max with ellipsis)
  - Limit category display (show 3-4, indicate more)
- Handle special characters in names/descriptions

## File Structure After Phase 2

```
ui/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Updated: Displays ItemGrid
│   │   ├── layout.tsx            # Unchanged
│   │   └── globals.css           # Updated: Additional base styles if needed
│   ├── components/
│   │   ├── Header.tsx             # Unchanged
│   │   ├── FunctionCard.tsx       # NEW: Card component
│   │   └── ItemGrid.tsx           # NEW: Grid container
│   └── lib/
│       ├── catalog.ts             # Updated: Enhanced types and helpers
│       └── utils.ts               # NEW: Date formatting utilities
```

## Implementation Details

### Kind Mapping

Map `spec.kind` values to display labels:
- `"job"` → "Job"
- `"serving"` → "Serving"
- `"nuclio:serving"` → "Serving" (or "Nuclio Serving")
- `"monitoring_application"` → "Monitoring Application"
- `"generic"` → "Generic"
- Others: Use as-is or format (e.g., "custom_kind" → "Custom Kind")

### Category Display

- Display first 3-4 categories as badges
- If more exist, show "+X more" indicator
- Format category names: "machine-learning" → "Machine Learning"
- Use muted colors for category badges

### Date Formatting

Parse `generationDate` format: "YYYY-MM-DD:HH-MM"
- Convert to Date object
- Calculate relative time
- Format as "Updated X ago" where X is:
  - "just now" (< 1 hour)
  - "X hours ago" (< 24 hours)
  - "X days ago" (< 30 days)
  - "X months ago" (< 12 months)
  - "X years ago" (>= 12 months)

### Type Badge Colors

Suggested color scheme:
- **Functions**: Blue (e.g., `bg-blue-100 text-blue-800`)
- **Modules**: Green (e.g., `bg-green-100 text-green-800`)
- **Steps**: Purple (e.g., `bg-purple-100 text-purple-800`)

## Success Criteria

- [ ] FunctionCard component displays all required fields
- [ ] Cards are styled to match MLRun Hub aesthetic
- [ ] All items (functions, modules, steps) display in grid
- [ ] Grid is responsive (1/2/3/4 columns based on screen size)
- [ ] Hover effects work smoothly
- [ ] Edge cases handled (missing fields, long text)
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] Code is clean and maintainable

## Testing Checklist

- [ ] Test with all item types (functions, modules, steps)
- [ ] Test with items that have all fields
- [ ] Test with items missing optional fields
- [ ] Test with long descriptions (truncation)
- [ ] Test with many categories (truncation)
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Test hover effects
- [ ] Test with empty catalog (edge case)
- [ ] Verify accessibility (keyboard navigation, screen readers)

## Dependencies

- **date-fns** (optional): For date formatting - can use `npm install date-fns` or implement simple relative date logic
- No other new dependencies required (using existing React, Next.js, Tailwind)

## Notes

- **Prototype Focus**: Don't over-optimize - focus on getting cards displaying correctly
- **Styling**: Match MLRun Hub style as closely as possible, but don't worry about pixel-perfect matching
- **Performance**: Grid should handle 30-40 items without issues (no pagination needed yet)
- **Accessibility**: Basic accessibility is fine for prototype (semantic HTML, keyboard navigation)

## Next Steps (Phase 3)

After Phase 2 completion:
- Add search functionality
- Add category filtering
- Add kind filtering
- Add sort options
- Add result count display

## Decisions Made

1. **Date Library**: ✅ Implement simple relative date logic (no external dependencies)
2. **Card Click Behavior**: ✅ Wait until Phase 4 (no onClick implementation in Phase 2)
3. **Category Limit**: ✅ Show 3-4 categories before truncating, then "+X more"
4. **Description Length**: ✅ Truncate to 2-3 lines with ellipsis
5. **Grid Columns**: ✅ 3 columns on xl screens (1280px+)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-09  
**Status**: Ready for Implementation

