// Settings module for RNK Vintage UI

export function registerSettings() {
    game.settings.register('rnk-vintage-ui', 'enableVintageUI', {
        name: 'Enable Vintage UI',
        hint: 'Enable draggable UI elements and vintage features. Disable to use standard Foundry v13 UI.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: () => {
            ui.notifications.info('Vintage UI setting changed. Refresh your browser (F5) to apply changes.');
        }
    });

    game.settings.register('rnk-vintage-ui', 'gmOverride', {
        name: 'GM Override (Force Vintage UI for All)',
        hint: 'As GM, force all players to use Vintage UI regardless of their personal settings.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            ui.notifications.info('GM Override changed. All users should refresh their browsers (F5).');
        }
    });
    
    // Store per-player feature settings as JSON
    game.settings.register('rnk-vintage-ui', 'playerSettings', {
        name: 'Per-Player Settings',
        hint: 'GM-controlled per-player feature toggles',
        scope: 'world',
        config: false,
        type: Object,
        default: {},
        restricted: true
    });

    game.settings.register('rnk-vintage-ui', 'enableHotbarDrag', {
        name: 'Enable Hotbar Dragging',
        hint: 'Allow dragging and repositioning the hotbar.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('rnk-vintage-ui', 'enableSceneControlsDrag', {
        name: 'Enable Scene Controls Dragging',
        hint: 'Allow dragging and repositioning scene controls.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('rnk-vintage-ui', 'enableSidebarDrag', {
        name: 'Enable Sidebar Dragging',
        hint: 'Allow dragging and repositioning sidebar tabs.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('rnk-vintage-ui', 'enablePlayersDrag', {
        name: 'Enable Player List Dragging',
        hint: 'Allow dragging and repositioning player lists.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
    
    console.log('RNK Vintage UI | Settings registered successfully');
}

export function isVintageUIEnabled() {
    try {
        if (!game || !game.settings) {
            console.log('RNK Vintage UI | Game settings not ready yet, defaulting to enabled');
            return true;
        }
        
        const gmOverride = game.settings.get('rnk-vintage-ui', 'gmOverride');
        const userEnabled = game.settings.get('rnk-vintage-ui', 'enableVintageUI');
        
        console.log('RNK Vintage UI | Settings check - GM Override:', gmOverride, 'User Enabled:', userEnabled);
        
        if (gmOverride) return true;
        return userEnabled;
    } catch (e) {
        console.warn('RNK Vintage UI | Error checking settings:', e);
        return true;
    }
}

export function isFeatureEnabled(featureName) {
    try {
        if (!game || !game.settings) {
            console.log('RNK Vintage UI | Game settings not ready for', featureName, ', defaulting to enabled');
            return true;
        }
        
        // First check if vintage UI is enabled at all
        const vintageEnabled = isVintageUIEnabled();
        if (!vintageEnabled) {
            console.log('RNK Vintage UI | Vintage UI disabled, skipping', featureName);
            return false;
        }
        
        // Check GM-controlled per-player settings (applies to ALL users including GM)
        const playerSettings = game.settings.get('rnk-vintage-ui', 'playerSettings');
        const userId = game.user.id;
        
        if (playerSettings[userId]) {
            // GM has set specific settings for this user
            const featureMap = {
                'enableHotbarDrag': 'hotbar',
                'enableSceneControlsDrag': 'controls',
                'enableSidebarDrag': 'sidebar',
                'enablePlayersDrag': 'players'
            };
            
            const settingKey = featureMap[featureName];
            if (settingKey && playerSettings[userId][settingKey] !== undefined) {
                console.log('RNK Vintage UI | Using hub setting for', featureName, ':', playerSettings[userId][settingKey]);
                return playerSettings[userId][settingKey];
            }
        }
        
        // Fall back to user's own client settings
        const featureEnabled = game.settings.get('rnk-vintage-ui', featureName);
        console.log('RNK Vintage UI | Feature', featureName, 'enabled:', featureEnabled);
        
        return featureEnabled;
    } catch (e) {
        console.warn('RNK Vintage UI | Error checking feature', featureName, ':', e);
        return true;
    }
}

// Get player-specific settings
export function getPlayerSettings(userId) {
    const playerSettings = game.settings.get('rnk-vintage-ui', 'playerSettings');
    return playerSettings[userId] || {
        hotbar: true,
        controls: true,
        sidebar: true,
        players: true
    };
}

// Save player-specific settings
export async function setPlayerSettings(userId, settings) {
    const playerSettings = game.settings.get('rnk-vintage-ui', 'playerSettings');
    playerSettings[userId] = settings;
    await game.settings.set('rnk-vintage-ui', 'playerSettings', playerSettings);
}
