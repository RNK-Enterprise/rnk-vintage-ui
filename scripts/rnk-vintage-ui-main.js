// RNK Vintage UI - Main entry point
// Modular Foundry VTT UI repositioning and enhancement module

import { registerSettings } from './settings-module.js';
import { initializeHotbar } from './hotbar-module.js';
import { initializeSidebar } from './sidebar-module.js';
import { initializeSceneControls } from './scene-controls-module.js';
import { initializePlayers, initializeSceneNavigation } from './players-navigation-module.js';
import { initializeHub } from './hub-module.js';

// Register settings immediately
Hooks.once('init', () => {
    console.log('RNK Vintage UI | Initializing module...');
    registerSettings();
});

// Initialize after settings are fully ready
Hooks.once('ready', () => {
    console.log('RNK Vintage UI | Starting feature initialization...');
    
    // Initialize hub button (always available)
    initializeHub();
    
    // Initialize all features - they'll check settings internally
    initializeHotbar();
    initializeSidebar();
    initializeSceneControls();
    initializePlayers();
    initializeSceneNavigation();
    
    console.log('RNK Vintage UI | All features initialized');
});
