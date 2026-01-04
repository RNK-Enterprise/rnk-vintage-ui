// Player list and scene navigation modules for RNK Vintage UI

import { DragHandlers } from './drag-handlers.js';
import { isFeatureEnabled } from './settings-module.js';

export function initializePlayers() {
    const playersHandlers = DragHandlers.createPlayersHandlers();
    const activeHandlers = DragHandlers.createActivePlayersHandlers();
    
    document.addEventListener('mousemove', playersHandlers.drag);
    document.addEventListener('mouseup', playersHandlers.dragEnd);
    document.addEventListener('mousemove', activeHandlers.drag);
    document.addEventListener('mouseup', activeHandlers.dragEnd);
    
    Hooks.on('renderPlayerList', (app, html) => {
        if (!isFeatureEnabled('enablePlayersDrag')) return;
        
        setTimeout(() => {
            setupPlayersPanel(playersHandlers);
            setupPlayersActive(activeHandlers);
        }, 100);
    });
}

function setupPlayersPanel(handlers) {
    const players = document.getElementById('players');
    if (!players) return;
    
    players.style.setProperty('position', 'fixed', 'important');
    players.style.cursor = 'move';
    
    const savedPlayersPosition = localStorage.getItem('rnk-vintage-ui-players-position');
    if (savedPlayersPosition) {
        const pos = JSON.parse(savedPlayersPosition);
        players.style.setProperty('left', pos.x + 'px', 'important');
        players.style.setProperty('top', pos.y + 'px', 'important');
        players.style.setProperty('bottom', 'auto', 'important');
        players.style.setProperty('right', 'auto', 'important');
        DragHandlers.players.xOffset = pos.x;
        DragHandlers.players.yOffset = pos.y;
    } else {
        players.style.setProperty('left', '20px', 'important');
        players.style.setProperty('bottom', '20px', 'important');
        players.style.setProperty('top', 'auto', 'important');
        players.style.setProperty('right', 'auto', 'important');
        
        const rect = players.getBoundingClientRect();
        DragHandlers.players.xOffset = rect.left;
        DragHandlers.players.yOffset = rect.top;
    }

    players.removeEventListener('mousedown', handlers.dragStart);
    players.addEventListener('mousedown', handlers.dragStart);
}

function setupPlayersActive(handlers) {
    const playersActive = document.getElementById('players-active');
    if (!playersActive) return;
    
    playersActive.style.cursor = 'move';
    playersActive.style.setProperty('position', 'fixed', 'important');

    const savedActivePosition = localStorage.getItem('rnk-vintage-ui-players-active-position');
    if (savedActivePosition) {
        const pos = JSON.parse(savedActivePosition);
        playersActive.style.setProperty('left', pos.x + 'px', 'important');
        playersActive.style.setProperty('top', pos.y + 'px', 'important');
        DragHandlers.active.xOffset = pos.x;
        DragHandlers.active.yOffset = pos.y;
    }

    playersActive.removeEventListener('mousedown', handlers.dragStart);
    playersActive.addEventListener('mousedown', handlers.dragStart);
}

export function initializeSceneNavigation() {
    Hooks.on('renderSceneNavigation', (app, html) => {
        const sceneNav = document.getElementById('scene-navigation');
        if (!sceneNav) return;

        setupNavigationMinimize(sceneNav);
        setupSceneSwitcher(sceneNav);
    });
}

function setupNavigationMinimize(sceneNav) {
    const expandBtn = sceneNav.querySelector('#scene-navigation-expand');
    if (!expandBtn) return;

    expandBtn.addEventListener('click', (e) => {
        const activeScenes = sceneNav.querySelector('#scene-navigation-active');
        const inactiveScenes = sceneNav.querySelector('#scene-navigation-inactive');
        const switcherDiv = sceneNav.querySelector('.rnk-scene-switcher');
        const icon = expandBtn.querySelector('i');
        
        if (!activeScenes && !inactiveScenes) return;

        const checkMenu = activeScenes || inactiveScenes;
        const isMinimized = checkMenu.style.display === 'none';

        if (isMinimized) {
            if (activeScenes) activeScenes.style.display = '';
            if (inactiveScenes) inactiveScenes.style.display = '';
            if (switcherDiv) switcherDiv.style.display = '';
            if (icon) {
                icon.classList.remove('fa-caret-up');
                icon.classList.add('fa-caret-down');
            }
        } else {
            if (activeScenes) activeScenes.style.display = 'none';
            if (inactiveScenes) inactiveScenes.style.display = 'none';
            if (switcherDiv) switcherDiv.style.display = 'none';
            if (icon) {
                icon.classList.remove('fa-caret-down');
                icon.classList.add('fa-caret-up');
            }
        }
    });
}

function setupSceneSwitcher(sceneNav) {
    if (sceneNav.querySelector('.rnk-scene-switcher')) return;
    
    const activeMenu = sceneNav.querySelector('#scene-navigation-active');
    if (!activeMenu) return;

    const switcherDiv = document.createElement('div');
    switcherDiv.className = 'rnk-scene-switcher';
    switcherDiv.style.cssText = 'display: flex; gap: 5px; padding: 5px; justify-content: center;';

    const prevBtn = createSwitcherButton('fa-chevron-left', 'Previous Scene', navigateToPrevScene);
    const searchBtn = createSwitcherButton('fa-search', 'Search Scenes', showSceneSearch);
    const nextBtn = createSwitcherButton('fa-chevron-right', 'Next Scene', navigateToNextScene);

    switcherDiv.appendChild(prevBtn);
    switcherDiv.appendChild(searchBtn);
    switcherDiv.appendChild(nextBtn);
    activeMenu.insertAdjacentElement('afterend', switcherDiv);
}

function createSwitcherButton(iconClass, tooltip, handler) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ui-control';
    btn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    btn.dataset.tooltip = tooltip;
    btn.style.cssText = 'flex: 1;';
    btn.addEventListener('click', handler);
    return btn;
}

async function navigateToPrevScene(e) {
    e.preventDefault();
    e.stopPropagation();
    const scenes = game.scenes.contents;
    const current = game.scenes.current;
    if (!current || scenes.length <= 1) return;
    const currentIndex = scenes.indexOf(current);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : scenes.length - 1;
    await scenes[prevIndex].view();
}

async function navigateToNextScene(e) {
    e.preventDefault();
    e.stopPropagation();
    const scenes = game.scenes.contents;
    const current = game.scenes.current;
    if (!current || scenes.length <= 1) return;
    const currentIndex = scenes.indexOf(current);
    const nextIndex = currentIndex < scenes.length - 1 ? currentIndex + 1 : 0;
    await scenes[nextIndex].view();
}

async function showSceneSearch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const scenes = game.scenes.contents;
    if (scenes.length === 0) return;

    const options = scenes.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    const content = `
        <div style="margin: 10px 0;">
            <label style="display: block; margin-bottom: 5px;">Select a scene:</label>
            <select id="rnk-scene-select" style="width: 100%; padding: 5px;">
                ${options}
            </select>
        </div>
    `;

    new Dialog({
        title: "Search Scenes",
        content: content,
        buttons: {
            view: {
                label: "View Scene",
                callback: async (html) => {
                    const sceneId = html.find('#rnk-scene-select').val();
                    const scene = game.scenes.get(sceneId);
                    if (scene) await scene.view();
                }
            },
            cancel: {
                label: "Cancel"
            }
        },
        default: "view"
    }).render(true);
}
