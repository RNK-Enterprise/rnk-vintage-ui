# Changelog

All notable changes to the RNK Vintage UI module will be documented in this file.

## [1.1.0] - 2026-01-04

### Changed
- Refactored monolithic codebase into modular architecture
- Split main script into 6 focused modules under 500 lines each
- Improved code maintainability and organization per RNK standards

### Added
- drag-handlers.js: Centralized drag state management for all UI elements
- hotbar-module.js: Hotbar positioning and minimize functionality
- sidebar-module.js: Sidebar tabs drag and minimize features
- scene-controls-module.js: Scene controls positioning and minimize
- players-navigation-module.js: Player list and scene navigation features
- rnk-12-ui-main.js: Main entry point for modular system
- Test suite for module validation
- package.json for npm script management

### Fixed
- Hotbar minimize button now properly hides all buttons when minimized
- Improved button hiding logic using siblings approach

## [1.0.0] - 2026-01-03

### Added
- Initial release of RNK Vintage UI module
- Hotbar repositioning from center-bottom to left side
- Vertical layout for hotbar macro slots
- Compatibility with Foundry VTT v11 and v12

