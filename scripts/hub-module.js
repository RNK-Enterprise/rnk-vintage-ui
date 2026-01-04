// RNK Vintage UI Control Hub

import { getPlayerSettings, setPlayerSettings } from './settings-module.js';

export function initializeHub() {
    // Bind keyboard shortcut Ctrl+Alt+N
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            showHub();
        }
    });
    
    // Add hub button to scene controls layers
    function addHubButton() {
        // Try multiple selectors for different Foundry versions
        const layersMenu = document.getElementById('scene-controls-layers') || 
                          document.querySelector('#scene-controls ol') ||
                          document.querySelector('#scene-controls menu') ||
                          document.querySelector('#scene-controls .main-controls');
        
        if (!layersMenu) {
            console.log('RNK Vintage UI | Scene controls not found yet');
            return false;
        }
        
        // Check if button already exists
        if (document.querySelector('.rnk-hub-control')) return true;
        
        // Create hub button
        const li = document.createElement('li');
        li.className = 'rnk-hub-control';
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'control ui-control layer icon fa-solid fa-sliders';
        button.style.color = '#39ff14';
        button.style.textShadow = '0 0 10px #39ff14';
        button.setAttribute('data-tooltip', 'RNK™ Vintage UI Hub (Ctrl+Alt+N)');
        button.setAttribute('aria-label', 'RNK™ Vintage UI Hub');
        button.onclick = showHub;
        
        li.appendChild(button);
        layersMenu.appendChild(li);
        console.log('RNK Vintage UI | Hub button added');
        return true;
    }
    
    // Try on renderSceneControls hook
    Hooks.on('renderSceneControls', () => {
        addHubButton();
    });
    
    // Also try immediately with timeout as fallback for v13
    setTimeout(() => {
        if (!document.querySelector('.rnk-hub-control')) {
            addHubButton();
        }
    }, 500);
}

function showHub() {
    const isGM = game.user.isGM;
    
    if (isGM) {
        showGMHub();
    } else {
        showPlayerHub();
    }
}

function showPlayerHub() {
    const currentSettings = {
        enableVintageUI: game.settings.get('rnk-vintage-ui', 'enableVintageUI'),
        enableHotbarDrag: game.settings.get('rnk-vintage-ui', 'enableHotbarDrag'),
        enableSceneControlsDrag: game.settings.get('rnk-vintage-ui', 'enableSceneControlsDrag'),
        enableSidebarDrag: game.settings.get('rnk-vintage-ui', 'enableSidebarDrag'),
        enablePlayersDrag: game.settings.get('rnk-vintage-ui', 'enablePlayersDrag')
    };

    const content = `
        <div class="rnk-hub-player">
            <div class="rnk-hub-header">
                <h2 style="color: #39ff14; text-shadow: 0 0 10px #39ff14;">RNK™ Vintage UI</h2>
                <p style="color: #888; margin-top: 10px;">Your Personal Settings</p>
            </div>
            
            <div class="rnk-setting-card">
                <div class="rnk-setting-header">
                    <h3>Master Control</h3>
                </div>
                <div class="rnk-setting-row">
                    <label>
                        <input type="checkbox" id="enableVintageUI" ${currentSettings.enableVintageUI ? 'checked' : ''}>
                        <span>Enable All Vintage UI Features</span>
                    </label>
                </div>
            </div>
            
            <div class="rnk-setting-card">
                <div class="rnk-setting-header">
                    <h3>Individual Features</h3>
                </div>
                <div class="rnk-setting-row">
                    <label>
                        <input type="checkbox" id="enableHotbarDrag" ${currentSettings.enableHotbarDrag ? 'checked' : ''}>
                        <span>Hotbar Dragging & Minimize</span>
                    </label>
                </div>
                <div class="rnk-setting-row">
                    <label>
                        <input type="checkbox" id="enableSceneControlsDrag" ${currentSettings.enableSceneControlsDrag ? 'checked' : ''}>
                        <span>Scene Controls Dragging</span>
                    </label>
                </div>
                <div class="rnk-setting-row">
                    <label>
                        <input type="checkbox" id="enableSidebarDrag" ${currentSettings.enableSidebarDrag ? 'checked' : ''}>
                        <span>Sidebar Dragging & Minimize</span>
                    </label>
                </div>
                <div class="rnk-setting-row">
                    <label>
                        <input type="checkbox" id="enablePlayersDrag" ${currentSettings.enablePlayersDrag ? 'checked' : ''}>
                        <span>Player List Dragging</span>
                    </label>
                </div>
            </div>
            
            <p class="rnk-note">Refresh (F5) after saving to apply changes</p>
        </div>
    `;

    new Dialog({
        title: "RNK™ Vintage UI - Player Settings",
        content: content,
        buttons: {
            save: {
                icon: '<i class="fas fa-save"></i>',
                label: "Save & Refresh",
                callback: async (html) => {
                    await game.settings.set('rnk-vintage-ui', 'enableVintageUI', html.find('#enableVintageUI')[0].checked);
                    await game.settings.set('rnk-vintage-ui', 'enableHotbarDrag', html.find('#enableHotbarDrag')[0].checked);
                    await game.settings.set('rnk-vintage-ui', 'enableSceneControlsDrag', html.find('#enableSceneControlsDrag')[0].checked);
                    await game.settings.set('rnk-vintage-ui', 'enableSidebarDrag', html.find('#enableSidebarDrag')[0].checked);
                    await game.settings.set('rnk-vintage-ui', 'enablePlayersDrag', html.find('#enablePlayersDrag')[0].checked);
                    
                    ui.notifications.info('Settings saved! Refreshing...');
                    setTimeout(() => window.location.reload(), 500);
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel"
            }
        },
        default: "save"
    }, {
        width: 500,
        classes: ['rnk-hub-dialog']
    }).render(true);
}

function showGMHub() {
    const players = game.users.filter(u => u.active);
    const gmOverride = game.settings.get('rnk-vintage-ui', 'gmOverride');
    
    let playerCards = '';
    players.forEach(player => {
        const color = player.color || '#888888';
        const settings = getPlayerSettings(player.id);
        
        playerCards += `
            <div class="rnk-player-card" data-user-id="${player.id}">
                <div class="rnk-player-header" style="border-left: 4px solid ${color};">
                    <div class="rnk-player-avatar" style="background-color: ${color};">
                        ${player.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="rnk-player-info">
                        <h4>${player.name}</h4>
                        <span class="rnk-player-role">${player.isGM ? 'GM' : 'Player'}</span>
                    </div>
                </div>
                <div class="rnk-player-settings">
                    <label class="rnk-toggle">
                        <input type="checkbox" class="setting-hotbar" data-player="${player.id}" ${settings.hotbar ? 'checked' : ''}>
                        <span>Hotbar</span>
                    </label>
                    <label class="rnk-toggle">
                        <input type="checkbox" class="setting-controls" data-player="${player.id}" ${settings.controls ? 'checked' : ''}>
                        <span>Controls</span>
                    </label>
                    <label class="rnk-toggle">
                        <input type="checkbox" class="setting-sidebar" data-player="${player.id}" ${settings.sidebar ? 'checked' : ''}>
                        <span>Sidebar</span>
                    </label>
                    <label class="rnk-toggle">
                        <input type="checkbox" class="setting-players" data-player="${player.id}" ${settings.players ? 'checked' : ''}>
                        <span>Players</span>
                    </label>
                </div>
            </div>
        `;
    });

    const content = `
        <div class="rnk-gm-hub">
            <div class="rnk-hub-header">
                <h2 style="color: #39ff14; text-shadow: 0 0 10px #39ff14;">RNK™ Vintage UI</h2>
                <p style="color: #888;">GM Control Center</p>
            </div>
            
            <div class="rnk-gm-controls">
                <div class="rnk-override-section">
                    <label class="rnk-override-toggle">
                        <input type="checkbox" id="gmOverride" ${gmOverride ? 'checked' : ''}>
                        <span class="rnk-override-text">
                            <strong style="color: #ff6b6b;">GM OVERRIDE</strong>
                            <small>Force all players to use Vintage UI</small>
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="rnk-players-grid">
                ${playerCards}
            </div>
            
            <div class="rnk-hub-actions">
                <button class="rnk-btn rnk-btn-all" id="enableAll">
                    <i class="fas fa-check-double"></i> Enable All
                </button>
                <button class="rnk-btn rnk-btn-all" id="disableAll">
                    <i class="fas fa-times"></i> Disable All
                </button>
            </div>
            
            <p class="rnk-note">Changes apply immediately. Players may need to refresh.</p>
        </div>
    `;

    const dialog = new Dialog({
        title: "RNK™ Vintage UI - GM Hub",
        content: content,
        buttons: {
            apply: {
                icon: '<i class="fas fa-bolt"></i>',
                label: "Apply Changes",
                callback: async (html) => {
                    const override = html.find('#gmOverride')[0].checked;
                    
                    // Save GM override setting
                    await game.settings.set('rnk-vintage-ui', 'gmOverride', override);
                    
                    // Save per-player settings
                    const players = game.users.filter(u => u.active);
                    for (const player of players) {
                        const settings = {
                            hotbar: html.find(`.setting-hotbar[data-player="${player.id}"]`)[0].checked,
                            controls: html.find(`.setting-controls[data-player="${player.id}"]`)[0].checked,
                            sidebar: html.find(`.setting-sidebar[data-player="${player.id}"]`)[0].checked,
                            players: html.find(`.setting-players[data-player="${player.id}"]`)[0].checked
                        };
                        await setPlayerSettings(player.id, settings);
                    }
                    
                    ui.notifications.info('RNK™ Vintage UI settings saved!');
                    ui.notifications.warn('Players should refresh (F5) to see changes');
                }
            },
            close: {
                icon: '<i class="fas fa-times"></i>',
                label: "Close"
            }
        },
        default: "apply",
        render: (html) => {
            // Enable all button
            html.find('#enableAll').on('click', () => {
                html.find('.rnk-player-settings input[type="checkbox"]').prop('checked', true);
            });
            
            // Disable all button
            html.find('#disableAll').on('click', () => {
                html.find('.rnk-player-settings input[type="checkbox"]').prop('checked', false);
            });
            
            // GM Override toggle behavior
            html.find('#gmOverride').on('change', (e) => {
                const isChecked = e.target.checked;
                html.find('.rnk-player-card').css('opacity', isChecked ? '0.5' : '1');
                html.find('.rnk-player-settings input').prop('disabled', isChecked);
            });
            
            // Trigger initial state
            if (html.find('#gmOverride')[0].checked) {
                html.find('.rnk-player-card').css('opacity', '0.5');
                html.find('.rnk-player-settings input').prop('disabled', true);
            }
        }
    }, {
        width: 700,
        height: 600,
        classes: ['rnk-hub-dialog', 'rnk-gm-hub-dialog']
    }).render(true);
}
