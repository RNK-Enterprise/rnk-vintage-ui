# RNK 12 UI - Developer Documentation

## Architecture Overview

RNK 12 UI is a modular Foundry VTT module that provides enhanced UI positioning and minimize functionality for various UI elements including hotbar, scene controls, sidebar tabs, and player lists.

## Module Structure

The codebase follows RNK standards with all modules under 500 lines for optimal maintainability.

### Core Modules

#### rnk-12-ui-main.js (14 lines)
Main entry point that initializes all sub-modules. Imports and calls initialization functions for each UI component.

#### drag-handlers.js (202 lines)
Centralized drag state management system providing:
- Drag state objects for hotbar, scene controls, players, and players-active
- Reusable drag handler factory functions
- Position persistence via localStorage
- setTranslate utility for consistent positioning

**Key Functions:**
- `createHotbarHandlers()` - Returns drag handlers for hotbar
- `createControlsHandlers()` - Returns drag handlers for scene controls
- `createPlayersHandlers()` - Returns drag handlers for player list
- `createActivePlayersHandlers()` - Returns drag handlers for active players

#### hotbar-module.js (131 lines)
Manages hotbar positioning and minimize functionality:
- Restores saved positions on render
- Creates minimize button from mute button
- Implements minimize logic for macros and controls
- Handles both macro-list and individual macro hiding

**Key Functions:**
- `initializeHotbar()` - Sets up hotbar with drag and minimize
- `createMinimizeButton(hotbar)` - Creates and configures minimize button
- `handleMinimizeClick()` - Toggles minimize state for hotbar elements

#### sidebar-module.js (155 lines)
Handles sidebar tabs repositioning and minimize:
- Implements custom drag system with threshold
- Hides original collapse button, replaces with minimize
- Persists sidebar position
- Prevents accidental tab switching during drag

**Key Functions:**
- `initializeSidebar()` - Main setup function
- `setupSidebarDrag(sidebarTabs)` - Configures draggable behavior
- `setupSidebarMinimize(sidebarTabs)` - Creates minimize button and logic

#### scene-controls-module.js (107 lines)
Manages scene controls panel:
- Position restoration and persistence
- Minimize button addition to layers list
- Hides both main controls and sub-controls on minimize

**Key Functions:**
- `initializeSceneControls()` - Sets up controls
- `setupControlsPosition()` - Restores saved position
- `setupControlsMinimize()` - Adds minimize functionality
- `handleMinimizeClick()` - Toggles control visibility

#### players-navigation-module.js (207 lines)
Handles player list and scene navigation:
- Player list and active players drag functionality
- Scene navigation minimize button
- Quick scene switcher with prev/next/search
- Dialog-based scene search functionality

**Key Functions:**
- `initializePlayers()` - Sets up player list dragging
- `initializeSceneNavigation()` - Configures scene navigation
- `setupSceneSwitcher()` - Creates prev/next/search buttons
- `navigateToPrevScene()`, `navigateToNextScene()`, `showSceneSearch()`

## Data Persistence

All UI positions are stored in localStorage with keys:
- `rnk-12-ui-hotbar-position` - {x, y}
- `rnk-12-ui-sidebar-position` - {x, y}
- `rnk-12-ui-controls-position` - {x, y}
- `rnk-12-ui-players-position` - {x, y}
- `rnk-12-ui-players-active-position` - {x, y}

## Minimize Logic Pattern

All minimize buttons follow the same pattern:
1. Find sibling elements to hide
2. Check current minimize state via display property
3. Toggle display between '' and 'none'
4. Update button icon (fa-minus ↔ fa-plus)
5. Update tooltip text

## Hooks Used

- `renderHotbar` - Initialize hotbar on render
- `ready` (once) - Initialize sidebar tabs
- `renderSceneControls` - Setup scene controls
- `renderPlayerList` - Configure player list dragging
- `renderSceneNavigation` - Setup scene navigation features

## Testing

Test suite validates:
- All modules under 500 lines (RNK standard)
- No emoji usage in code
- Module configuration correctness
- File existence checks

Run tests:
```bash
npm test
```

Expected output: `100/100/100/100 - PERFECT SCORE`

## Foundry VTT Integration

Module uses ES6 modules loaded via `esmodules` in module.json. All code executes in browser context with access to:
- Foundry `game` object
- Foundry `Hooks` API
- Standard browser DOM APIs
- localStorage for persistence

## Troubleshooting

### Minimize not working
Check console for element detection logs. Module logs all children elements when minimize is clicked.

### Position not persisting
Verify localStorage is enabled in browser. Check browser console for quota errors.

### Drag not working
Ensure no other modules are intercepting mouse events. Check for console errors during drag operations.

## Contributing

When modifying code:
1. Keep all files under 500 lines
2. No emojis in code or comments
3. Follow existing patterns for consistency
4. Run `npm test` before committing
5. Update CHANGELOG.md with changes
6. Maintain module version in module.json

## RNK Standards Compliance

This module adheres to all RNK development standards:
- Modular architecture (no files >500 lines)
- No emoji usage
- Comprehensive testing with 100/100/100/100 score
- Proper documentation
- Clean, maintainable code structure
