// Scene controls management module for RNK Vintage UI

import { DragHandlers } from './drag-handlers.js';
import { isFeatureEnabled } from './settings-module.js';

export function initializeSceneControls() {
    const handlers = DragHandlers.createControlsHandlers();
    
    document.addEventListener('mousemove', handlers.drag);
    document.addEventListener('mouseup', handlers.dragEnd);
    
    function setupControls() {
        if (!isFeatureEnabled('enableSceneControlsDrag')) return false;
        const sceneControls = document.getElementById('scene-controls');
        if (!sceneControls) {
            console.log('RNK Vintage UI | Scene controls element not found');
            return false;
        }

        setupControlsPosition(sceneControls, handlers);
        setupControlsMinimize(sceneControls);
        console.log('RNK Vintage UI | Scene controls initialized');
        return true;
    }
    
    // Try on renderSceneControls hook
    Hooks.on('renderSceneControls', () => {
        setupControls();
    });
    
    // Also try immediately with timeout as fallback for v13
    setTimeout(() => {
        setupControls();
    }, 500);
}

function setupControlsPosition(sceneControls, handlers) {
    const savedControlsPosition = localStorage.getItem('rnk-vintage-ui-controls-position');
    if (savedControlsPosition) {
        const pos = JSON.parse(savedControlsPosition);
        sceneControls.style.setProperty('left', pos.x + 'px', 'important');
        sceneControls.style.setProperty('top', pos.y + 'px', 'important');
        sceneControls.style.setProperty('bottom', 'auto', 'important');
        sceneControls.style.setProperty('right', 'auto', 'important');
        sceneControls.style.setProperty('position', 'fixed', 'important');
        DragHandlers.controls.xOffset = pos.x;
        DragHandlers.controls.yOffset = pos.y;
    } else {
        sceneControls.style.setProperty('position', 'fixed', 'important');
    }

    sceneControls.style.cursor = 'move';
    sceneControls.removeEventListener('mousedown', handlers.dragStart);
    sceneControls.addEventListener('mousedown', handlers.dragStart);
}

function setupControlsMinimize(sceneControls) {
    const layersList = sceneControls.querySelector('ol') || 
                       sceneControls.querySelector('menu') || 
                       sceneControls.querySelector('.main-controls') || 
                       sceneControls.querySelector('#scene-controls-layers');
    
    if (!layersList) {
        console.warn('RNK 12 UI | Could not find layers list in scene controls');
        return;
    }
    
    const oldBtn = layersList.querySelector('.rnk-minimize-controls');
    if (oldBtn) oldBtn.remove();
    
    const li = document.createElement('li');
    li.classList.add('rnk-minimize-controls');
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('control', 'ui-control', 'layer', 'icon', 'fa-solid', 'fa-minus');
    btn.dataset.tooltip = "Minimize Controls";
    btn.setAttribute('aria-label', "Minimize Controls");
    
    li.appendChild(btn);
    layersList.appendChild(li);
    
    console.log('RNK 12 UI | Scene controls minimize button added');

    btn.addEventListener('click', (e) => handleMinimizeClick(e, sceneControls, layersList, li, btn));
}

function handleMinimizeClick(e, sceneControls, layersList, li, btn) {
    e.preventDefault();
    e.stopPropagation();
    
    const siblings = Array.from(layersList.children).filter(child => child !== li);
    const isMinimized = siblings.length > 0 && siblings[0].style.display === 'none';
    
    const subControls = sceneControls.querySelector('.sub-controls') || 
                       sceneControls.querySelector('ol.sub-controls') || 
                       sceneControls.querySelector('#scene-controls-tools') ||
                       sceneControls.querySelector('[data-application-part="tools"]');
    
    console.log('RNK 12 UI | Scene controls minimize clicked, state:', isMinimized ? 'minimized' : 'expanded');
    console.log('RNK 12 UI | Sub-controls found:', !!subControls, subControls?.id || subControls?.className);

    siblings.forEach(sib => {
        sib.style.display = isMinimized ? '' : 'none';
    });
    
    if (subControls) {
        subControls.style.display = isMinimized ? '' : 'none';
        console.log('RNK 12 UI | Sub-controls toggled to:', isMinimized ? 'visible' : 'hidden');
    } else {
        console.warn('RNK 12 UI | Sub-controls element not found');
    }

    if (isMinimized) {
        btn.classList.remove('fa-plus');
        btn.classList.add('fa-minus');
        btn.dataset.tooltip = "Minimize Controls";
    } else {
        btn.classList.remove('fa-minus');
        btn.classList.add('fa-plus');
        btn.dataset.tooltip = "Maximize Controls";
    }
}
