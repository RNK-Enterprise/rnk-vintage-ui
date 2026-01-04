// RNK 12 UI - Main entry point
// Modular Foundry VTT UI repositioning and enhancement module

import { initializeHotbar } from './hotbar-module.js';
import { initializeSidebar } from './sidebar-module.js';
import { initializeSceneControls } from './scene-controls-module.js';
import { initializePlayers, initializeSceneNavigation } from './players-navigation-module.js';

initializeHotbar();
initializeSidebar();
initializeSceneControls();
initializePlayers();
initializeSceneNavigation();
