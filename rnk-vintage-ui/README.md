# RNK Vintage UI

A Foundry Virtual Tabletop module that provides enhanced UI positioning, dragging, and minimize functionality for hotbar, scene controls, sidebar tabs, player lists, and scene navigation.

## Features

- Draggable hotbar with position persistence
- Draggable scene controls with minimize functionality
- Draggable sidebar tabs with minimize functionality
- Draggable player lists
- Scene navigation with quick switcher (prev/next/search)
- Minimize buttons for all major UI components
- Clean, modular ES6 code architecture
- Position memory across sessions
- No configuration required

## Installation

### Manual Installation

1. Download the module files
2. Place the `rnk-vintage-ui` folder in your Foundry `Data/modules` directory
3. Launch Foundry VTT
4. Enable the module in your game world settings under "Manage Modules"

### Foundry Package Manager

Coming soon to the official Foundry package listing.

## Compatibility

- Minimum Foundry VTT Version: 11
- Verified Compatible Version: 12

## Usage

Once enabled, the module automatically enhances the UI with the following features:

### Hotbar
- Drag the hotbar to reposition it anywhere on screen
- Click the minimize button to hide/show macros and controls
- Position is saved automatically

### Scene Controls
- Drag the scene controls panel to any position
- Click minimize to hide all layer controls
- Position persists across sessions

### Sidebar Tabs
- Drag sidebar tabs to reposition
- Use minimize button to hide/show individual tabs
- Prevents accidental clicks during dragging

### Player List
- Drag player list and active players panels
- Position saved per session

### Scene Navigation
- Click minimize to hide scene list
- Use quick switcher buttons for prev/next scene
- Search scenes with dialog interface

## Technical Details

This module uses a modular ES6 architecture with separate files for each UI component:
- drag-handlers.js - Centralized drag state management
- hotbar-module.js - Hotbar functionality
- sidebar-module.js - Sidebar tabs features
- scene-controls-module.js - Scene controls panel
- players-navigation-module.js - Player lists and scene navigation

All positions are persisted in browser localStorage.

## Development

See [DEVELOPER.md](DEVELOPER.md) for technical documentation and contribution guidelines.

Run tests:
```bash
npm test
```

## License

All rights reserved by RNK.

## Support

For issues, feature requests, or support: https://www.patreon.com/rnk

## Author

RNK

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

### 1.1.0 (2026-01-04)
- Refactored to modular architecture
- All modules under 500 lines per RNK standards
- Enhanced minimize functionality
- Added comprehensive test suite

### 1.0.0 (2026-01-03)
- Initial release
- Basic hotbar repositioning
