# Phase 3: Search & Filter Plan

## Overview

Phase 3 adds search and filtering capabilities to the marketplace UI, matching the MLRun Hub functionality. This phase enables users to find specific functions, modules, and steps through text search, category filtering, kind filtering, and sorting options.

## Prerequisites

- ✅ Phase 1 complete (Next.js setup, catalog loader, basic layout)
- ✅ Phase 2 complete (FunctionCard, ItemGrid components displaying all items)
- Marketplace built (`make build-marketplace`)
- Catalog data copied to `ui/public/` (`make copy-ui` or manual copy)
- Dev server can run (`npm run dev` in `ui/` directory)

## Goals

1. Add global search bar that filters items by name and description
2. Create category filter sidebar with checkboxes for all available categories
3. Create kind filter sidebar with expandable sections for Functions and Modules
4. Add sort dropdown with "Title (A-Z)" and "Last Modified" options
5. Display result count ("X results")
6. Maintain filter state when searching
7. Match MLRun Hub UI/UX patterns

## Data Structure Reference

Based on existing catalog structure:
- **Categories**: Array of strings from `latest.categories` (e.g., ["machine-learning", "data-analysis", "audio"])
- **Kinds**: From `spec.kind` (e.g., "job", "serving", "nuclio:serving", "monitoring_application", "generic")
- **Item Types**: "functions", "modules", "steps"
- **Sort Fields**: 
  - Name (alphabetical)
  - Last Modified (from `generationDate`)

## Tasks

### Task 1: Create Search Utility Functions

**Location**: `ui/src/lib/search.ts` (new file)

**Actions**:
- Create `filterItemsBySearch(items, query)` function:
  - Search in item name (case-insensitive)
  - Search in item description (case-insensitive)
  - Return filtered array
- Create `getAllCategories(items)` function:
  - Extract all unique categories from all items
  - Return sorted array of unique category strings
- Create `getAllKinds(items)` function:
  - Extract all unique kinds from all items
  - Group by item type (functions vs modules)
  - Return object: `{ functions: string[], modules: string[] }`
- Create `filterItemsByCategories(items, selectedCategories)` function:
  - Filter items that have at least one selected category
  - If no categories selected, return all items
- Create `filterItemsByKinds(items, selectedKinds)` function:
  - Filter items by selected kinds
  - If no kinds selected, return all items
- Create `sortItems(items, sortBy)` function:
  - Sort by "name" (alphabetical A-Z)
  - Sort by "modified" (most recent first, using `generationDate`)
  - Return sorted array

**Type Definitions**:
```typescript
export type SortOption = 'name' | 'modified';

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedKinds: string[];
  sortBy: SortOption;
}
```

### Task 2: Create SearchBar Component

**Location**: `ui/src/components/SearchBar.tsx` (new file)

**Actions**:
- Create search input component with:
  - Placeholder: "Q Search..." (matching MLRun Hub)
  - Real-time search as user types (no debouncing)
  - Clear button (X icon) when text is entered
- Styling:
  - Match MLRun Hub search bar style
  - Full-width or contained width
  - Icon on left (search icon)
  - Clear button on right
  - Focus states

**Props Interface**:
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

**Features**:
- Controlled input component
- Clear button appears when value is not empty
- Accessible (proper labels, keyboard navigation)

### Task 3: Create CategoryFilter Component

**Location**: `ui/src/components/CategoryFilter.tsx` (new file)

**Actions**:
- Create sidebar component with:
  - Title: "Categories" or "Filter by Category"
  - List of checkboxes for each category
  - Checkbox labels formatted (kebab-case → Title Case)
  - "Select All" / "Clear All" buttons (required)
- Styling:
  - Sidebar layout (fixed or sticky)
  - Scrollable if many categories
  - Checkbox styling matching MLRun Hub
  - Active filter indicator (optional)

**Props Interface**:
```typescript
interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
}
```

**Features**:
- Multi-select checkboxes
- Visual feedback for selected categories
- Accessible (proper labels, keyboard navigation)

### Task 4: Create KindFilter Component

**Location**: `ui/src/components/KindFilter.tsx` (new file)

**Actions**:
- Create sidebar component with expandable sections:
  - "Functions" section (expandable/collapsible)
    - List of kinds found in functions (e.g., "Job", "Serving", "Nuclio Serving")
  - "Modules" section (expandable/collapsible)
    - List of kinds found in modules (e.g., "Generic", "Monitoring Application")
- Styling:
  - Accordion-style expandable sections
  - Checkboxes for each kind
  - Match MLRun Hub style
- Note: Steps may not have distinct kinds, so can be omitted or handled separately

**Props Interface**:
```typescript
interface KindFilterProps {
  kindsByType: {
    functions: string[];
    modules: string[];
  };
  selectedKinds: string[];
  onChange: (selected: string[]) => void;
}
```

**Features**:
- Expandable/collapsible sections
- Multi-select checkboxes within each section
- Visual feedback for selected kinds
- Accessible (proper ARIA attributes for accordion)

### Task 5: Create SortDropdown Component

**Location**: `ui/src/components/SortDropdown.tsx` (new file)

**Actions**:
- Create dropdown/select component with:
  - Label: "Sort by:"
  - Options:
    - "Title (A-Z)"
    - "Last Modified"
  - Current selection displayed
- Styling:
  - Native select or custom dropdown (native is simpler for v1)
  - Match MLRun Hub style
  - Proper spacing and alignment

**Props Interface**:
```typescript
interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}
```

**Features**:
- Single-select dropdown
- Clear labels
- Accessible (proper labels)

### Task 6: Create FilterPanel Component (Container)

**Location**: `ui/src/components/FilterPanel.tsx` (new file)

**Actions**:
- Create container component that combines:
  - CategoryFilter
  - KindFilter
- Layout:
  - Sidebar layout (left side on desktop, collapsible on mobile)
  - Sticky or fixed positioning
  - Proper spacing between filters
- Responsive:
  - Desktop: Sidebar visible
  - Mobile: Collapsible sidebar or bottom sheet

**Props Interface**:
```typescript
interface FilterPanelProps {
  categories: string[];
  kindsByType: {
    functions: string[];
    modules: string[];
  };
  selectedCategories: string[];
  selectedKinds: string[];
  onCategoriesChange: (selected: string[]) => void;
  onKindsChange: (selected: string[]) => void;
}
```

### Task 7: Create ResultCount Component

**Location**: `ui/src/components/ResultCount.tsx` (new file)

**Actions**:
- Create simple component that displays:
  - "X results" text
  - Updates based on filtered item count
- Styling:
  - Subtle text (gray)
  - Positioned near search/filters or above grid

**Props Interface**:
```typescript
interface ResultCountProps {
  count: number;
}
```

### Task 8: Update Home Page with Search and Filters

**Location**: `ui/src/app/page.tsx`

**Actions**:
- Add state management for filters:
  - `searchQuery` state
  - `selectedCategories` state
  - `selectedKinds` state
  - `sortBy` state
- Integrate filter functions:
  - Apply search filter
  - Apply category filter
  - Apply kind filter
  - Apply sort
- Update layout:
  - Add SearchBar in main area above filters (Option B layout)
  - Add FilterPanel as collapsible sidebar
  - Add SortDropdown and ResultCount above grid
  - Update ItemGrid to show filtered/sorted items
- Maintain filter state:
  - Filters persist when search query changes
  - All filters work together (AND logic)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│ Header (with SearchBar)             │
├──────────┬──────────────────────────┤
│          │ SortDropdown  ResultCount│
│ Filter   ├──────────────────────────┤
│ Panel    │                          │
│          │ ItemGrid                 │
│          │                          │
└──────────┴──────────────────────────┘
```

### Task 9: Update Header Component

**Location**: `ui/src/components/Header.tsx`

**Actions**:
- Add SearchBar to header (or keep in main area, per MLRun Hub layout)
- Ensure header accommodates search bar
- Maintain responsive design

**Note**: Search bar placed in main area above filters (Option B layout) per user decision.

### Task 10: Enhance Styling and Responsive Design

**Location**: Multiple component files

**Actions**:
- Ensure all filter components are responsive:
  - Desktop: Sidebar visible, filters always accessible
  - Tablet: Sidebar collapsible
  - Mobile: Filters in collapsible sidebar
- Add transitions for filter interactions
- Ensure proper spacing and alignment
- Test with various screen sizes

**Responsive Breakpoints**:
- Mobile: < 768px (filters in collapsible sidebar)
- Tablet: 768px - 1024px (filters in collapsible sidebar)
- Desktop: > 1024px (filters always visible in sidebar)

### Task 11: Handle Edge Cases

**Location**: All filter components

**Actions**:
- Handle empty search results gracefully
- Handle no categories selected (show all items)
- Handle no kinds selected (show all items)
- Handle items with no categories (include in "all" view)
- Handle items with no kind (include in "all" view)
- Handle special characters in search query
- Handle very long category/kind lists (scrollable)

## File Structure After Phase 3

```
ui/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Updated: Filter state management, integrated components
│   │   ├── layout.tsx            # Unchanged
│   │   └── globals.css           # Updated: Additional styles if needed
│   ├── components/
│   │   ├── Header.tsx            # Updated: May include SearchBar or not
│   │   ├── FunctionCard.tsx      # Unchanged
│   │   ├── ItemGrid.tsx          # Unchanged (receives filtered items)
│   │   ├── SearchBar.tsx         # NEW: Search input component
│   │   ├── CategoryFilter.tsx    # NEW: Category filter sidebar
│   │   ├── KindFilter.tsx        # NEW: Kind filter sidebar
│   │   ├── FilterPanel.tsx       # NEW: Container for filters
│   │   ├── SortDropdown.tsx      # NEW: Sort dropdown
│   │   └── ResultCount.tsx       # NEW: Result count display
│   └── lib/
│       ├── catalog.ts             # Unchanged
│       ├── utils.ts               # Unchanged
│       └── search.ts             # NEW: Filter and sort utility functions
```

## Implementation Details

### Search Functionality

**Search Logic**:
- Case-insensitive search
- Search in both name and description
- Partial matches (e.g., "train" matches "auto_trainer")
- Real-time filtering as user types (no debouncing)

**Example**:
```typescript
function filterItemsBySearch(items, query) {
  if (!query.trim()) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(item => {
    const name = item.name.toLowerCase();
    const desc = (item.item.latest.description || '').toLowerCase();
    return name.includes(lowerQuery) || desc.includes(lowerQuery);
  });
}
```

### Category Filtering

**Category Extraction**:
- Collect all unique categories from all items
- Sort alphabetically
- Format for display (kebab-case → Title Case)

**Filter Logic**:
- If no categories selected: Show all items
- If categories selected: Show items that have at least one selected category (OR logic)
- Items without categories: Include when no filters applied, exclude when filters applied

### Kind Filtering

**Kind Extraction**:
- Extract kinds from `spec.kind` for each item
- Group by item type (functions vs modules)
- Format kind labels (e.g., "job" → "Job", "monitoring_application" → "Monitoring Application")

**Filter Logic**:
- If no kinds selected: Show all items
- If kinds selected: Show items matching selected kinds (OR logic within kind filter)
- Items without kind: Include when no filters applied, exclude when filters applied

### Sorting

**Sort Options**:
1. **Title (A-Z)**: Alphabetical by item name
   - Case-insensitive
   - Sort: `items.sort((a, b) => a.name.localeCompare(b.name))`

2. **Last Modified**: Most recent first
   - Parse `generationDate` format: "YYYY-MM-DD:HH-MM"
   - Sort descending (newest first)
   - Items without date: Place at end

**Example**:
```typescript
function sortItems(items, sortBy) {
  if (sortBy === 'name') {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'modified') {
    return [...items].sort((a, b) => {
      const dateA = parseGenerationDate(a.item.latest.generationDate);
      const dateB = parseGenerationDate(b.item.latest.generationDate);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB.getTime() - dateA.getTime(); // Descending
    });
  }
  return items;
}
```

### Filter Combination Logic

**All filters work together with AND logic**:
1. Apply search filter → filtered items
2. Apply category filter to result → filtered items
3. Apply kind filter to result → filtered items
4. Apply sort to final result → sorted items

**Order of operations**:
```typescript
let filtered = items;
filtered = filterItemsBySearch(filtered, searchQuery);
filtered = filterItemsByCategories(filtered, selectedCategories);
filtered = filterItemsByKinds(filtered, selectedKinds);
filtered = sortItems(filtered, sortBy);
```

## Success Criteria

- [ ] Search bar filters items by name and description in real-time
- [ ] Category filter displays all available categories as checkboxes
- [ ] Kind filter displays kinds grouped by type (Functions/Modules) in expandable sections
- [ ] Sort dropdown allows selection between "Title (A-Z)" and "Last Modified"
- [ ] Result count displays correct number of filtered items
- [ ] All filters work together (AND logic)
- [ ] Filter state persists when search query changes
- [ ] UI matches MLRun Hub style and behavior
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] Code is clean and maintainable

## Testing Checklist

- [ ] Test search with various queries (exact match, partial match, case variations)
- [ ] Test category filtering (single, multiple, none selected)
- [ ] Test kind filtering (single, multiple, none selected)
- [ ] Test sorting (both options, with and without filters)
- [ ] Test filter combinations (search + category + kind + sort)
- [ ] Test edge cases:
  - Empty search results
  - Items without categories
  - Items without kinds
  - Items without generationDate
  - Very long category/kind lists
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Test performance with full catalog (30-40 items)

## Dependencies

- No new external dependencies required
- Use existing React, Next.js, Tailwind CSS
- Real-time search (no debouncing needed)

## Notes

- **Prototype Focus**: Keep implementation simple - native HTML elements are fine (e.g., native `<select>` for sort dropdown)
- **Performance**: For 30-40 items, client-side filtering is fast enough. No need for virtualization yet.
- **Accessibility**: Use semantic HTML, proper labels, keyboard navigation
- **MLRun Hub Matching**: Review MLRun Hub UI to match layout and styling as closely as possible
- **Filter Persistence**: Filters should remain active when search query changes (user expectation)

## Layout Options

### Selected Layout: Option B - Search in Main Area
```
┌─────────────────────────────────────┐
│ Header: Logo                         │
├──────────┬──────────────────────────┤
│ Filter   │ SearchBar                │
│ Panel    │ SortDropdown  ResultCount│
│          ├──────────────────────────┤
│          │ ItemGrid                 │
└──────────┴──────────────────────────┘
```

**Decision**: Option B selected - Search bar in main area above filters for simpler v1 implementation.

## Next Steps (Phase 4)

After Phase 3 completion:
- Add click handler to FunctionCard (open detail view)
- Build function detail modal or page
- Add copy-to-clipboard for import command
- Add links to documentation, source code, examples

## Decisions Made

1. **Search Bar Placement**: ✅ Option B - Search bar in main area above filters
2. **Search Debouncing**: ✅ Real-time filtering (no debouncing)
3. **Filter Layout**: ✅ Sidebar layout for desktop, collapsible sidebar for mobile/tablet
4. **Select All/Clear All**: ✅ Include in CategoryFilter component
5. **Sort Dropdown**: ✅ Use native `<select>` for v1 (simpler, accessible)
6. **Filter Logic**: ✅ AND logic between filters (search AND category AND kind)
7. **Empty States**: ✅ Show all items when no filters selected
8. **Category Formatting**: ✅ Use existing `formatCategoryName` utility from utils.ts
9. **Kind Formatting**: ✅ Use existing `formatKindLabel` utility from utils.ts

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-09  
**Status**: Ready for Implementation

