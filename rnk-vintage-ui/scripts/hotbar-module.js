// Hotbar management module for RNK 12 UI

import { DragHandlers } from './drag-handlers.js';

export function initializeHotbar() {
    const handlers = DragHandlers.createHotbarHandlers();
    
    document.addEventListener('mousemove', handlers.drag);
    document.addEventListener('mouseup', handlers.dragEnd);
    
    Hooks.on('renderHotbar', () => {
        const hotbar = document.getElementById('hotbar');
        if (!hotbar) return;

        const savedPosition = localStorage.getItem('rnk-12-ui-hotbar-position');
        if (savedPosition) {
            const pos = JSON.parse(savedPosition);
            DragHandlers.setTranslate(pos.x, pos.y, hotbar);
            DragHandlers.hotbar.xOffset = pos.x;
            DragHandlers.hotbar.yOffset = pos.y;
        }

        hotbar.style.cursor = 'move';
        hotbar.removeEventListener('mousedown', handlers.dragStart); 
        hotbar.addEventListener('mousedown', handlers.dragStart);

        createMinimizeButton(hotbar);
    });
}

function createMinimizeButton(hotbar) {
    let muteBtn = hotbar.querySelector('button[data-action="mute"]');
    
    if (!muteBtn) {
        muteBtn = hotbar.querySelector('.fa-volume-xmark, .fa-volume-up, .fa-volume-off, .fa-volume-mute')?.closest('button');
    }

    if (muteBtn) {
        muteBtn.style.display = 'none';
        const container = muteBtn.parentNode;
        
        if (container) {
            const oldBtn = container.querySelector('.rnk-minimize-hotbar');
            if (oldBtn) oldBtn.remove();
            
            const minimizeBtn = document.createElement('button');
            minimizeBtn.type = 'button';
            minimizeBtn.classList.add('rnk-minimize-hotbar', 'ui-control', 'icon', 'fa-solid', 'fa-minus');
            minimizeBtn.dataset.tooltip = "Minimize Stack";
            minimizeBtn.setAttribute('aria-label', "Minimize Stack");
            
            container.insertBefore(minimizeBtn, muteBtn.nextSibling);
            minimizeBtn.addEventListener('click', (e) => handleMinimizeClick(e, hotbar, container, minimizeBtn));
        }
    } else {
        console.warn("RNK 12 UI | Could not find Mute button.");
    }
}

function handleMinimizeClick(e, hotbar, container, minimizeBtn) {
    e.preventDefault();
    e.stopPropagation();

    console.log('RNK 12 UI | Hotbar children:', Array.from(hotbar.children).map(c => c.id || c.className || c.tagName));
    
    const macroList = hotbar.querySelector('#macro-list');
    const barControls = hotbar.querySelector('.bar-controls');
    const macroDir = hotbar.querySelector('#macro-directory');
    const actionBar = hotbar.querySelector('#action-bar');
    const hotbarDirectory = hotbar.querySelector('#hotbar-directory');
    const pageControls = hotbar.querySelector('.page-controls');
    const macros = hotbar.querySelectorAll('.macro');
    
    const buttonSiblings = container ? Array.from(container.children).filter(btn => btn !== minimizeBtn) : [];
    const allBarControlButtons = barControls ? Array.from(barControls.querySelectorAll('button')).filter(btn => btn !== minimizeBtn) : [];
    const allButtonsToHide = [...new Set([...buttonSiblings, ...allBarControlButtons])];
    
    let targetElement = macroList || barControls || actionBar;
    
    if (!targetElement && macros.length > 0) {
        toggleMacros(macros, hotbarDirectory, pageControls, allButtonsToHide, minimizeBtn);
        return;
    }
    
    if (!targetElement) {
        console.warn('RNK 12 UI | Could not find any element to minimize in hotbar');
        return;
    }

    const isMinimized = targetElement.style.display === 'none';
    console.log('RNK 12 UI | Hotbar minimize clicked, state:', isMinimized ? 'minimized' : 'expanded', 'element:', targetElement.id || targetElement.className);
    
    targetElement.style.display = isMinimized ? '' : 'none';
    if (macroDir) macroDir.style.display = isMinimized ? '' : 'none';
    if (hotbarDirectory) hotbarDirectory.style.display = isMinimized ? '' : 'none';
    if (pageControls) pageControls.style.display = isMinimized ? '' : 'none';
    allButtonsToHide.forEach(btn => {
        btn.style.display = isMinimized ? '' : 'none';
    });
    
    updateMinimizeButton(minimizeBtn, isMinimized);
}

function toggleMacros(macros, hotbarDirectory, pageControls, allButtonsToHide, minimizeBtn) {
    const isMinimized = macros[0].style.display === 'none';
    console.log('RNK 12 UI | Hotbar minimize (macros mode), state:', isMinimized ? 'minimized' : 'expanded');
    
    macros.forEach(macro => {
        macro.style.display = isMinimized ? '' : 'none';
    });
    if (hotbarDirectory) hotbarDirectory.style.display = isMinimized ? '' : 'none';
    if (pageControls) pageControls.style.display = isMinimized ? '' : 'none';
    allButtonsToHide.forEach(btn => {
        btn.style.display = isMinimized ? '' : 'none';
    });
    
    updateMinimizeButton(minimizeBtn, isMinimized);
}

function updateMinimizeButton(btn, isMinimized) {
    if (isMinimized) {
        btn.classList.remove('fa-plus');
        btn.classList.add('fa-minus');
        btn.dataset.tooltip = "Minimize Stack";
    } else {
        btn.classList.remove('fa-minus');
        btn.classList.add('fa-plus');
        btn.dataset.tooltip = "Maximize Stack";
    }
}
