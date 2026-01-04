// Sidebar tabs management module for RNK Vintage UI

import { DragHandlers } from './drag-handlers.js';
import { isFeatureEnabled } from './settings-module.js';

export function initializeSidebar() {
    if (!isFeatureEnabled('enableSidebarDrag')) {
        console.log('RNK Vintage UI | Sidebar drag disabled by settings');
        return;
    }
    
    console.log('RNK Vintage UI | Sidebar module initialized');

    const sidebarTabs = document.getElementById('sidebar-tabs');
    if (!sidebarTabs) {
        console.warn('RNK Vintage UI | Sidebar tabs element not found, trying on next render');
        // Try again on next sidebar render
        Hooks.once('renderSidebar', () => {
            const tabs = document.getElementById('sidebar-tabs');
            if (tabs) {
                // setupSidebarDrag(tabs);  // DISABLED - causes sidebar to disappear
                setupSidebarMinimize(tabs);
            }
        });
        return;
    }

    // setupSidebarDrag(sidebarTabs);  // DISABLED - causes sidebar to disappear
    setupSidebarMinimize(sidebarTabs);
}

function setupSidebarDrag(sidebarTabs) {
    // Use same pattern as scene-controls which works
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0;
    let yOffset = 0;

    const savedPosition = localStorage.getItem('rnk-vintage-ui-sidebar-position');
    if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        sidebarTabs.style.setProperty('left', pos.x + 'px', 'important');
        sidebarTabs.style.setProperty('top', pos.y + 'px', 'important');
        sidebarTabs.style.setProperty('right', 'auto', 'important');
        sidebarTabs.style.setProperty('bottom', 'auto', 'important');
        xOffset = pos.x;
        yOffset = pos.y;
    }

    sidebarTabs.style.cursor = 'move';

    function dragStart(e) {
        // If no saved position, get current position from CSS
        if (xOffset === 0 && yOffset === 0) {
            const rect = sidebarTabs.getBoundingClientRect();
            xOffset = rect.left;
            yOffset = rect.top;
        }
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        
        sidebarTabs.style.setProperty('left', currentX + 'px', 'important');
        sidebarTabs.style.setProperty('top', currentY + 'px', 'important');
        sidebarTabs.style.setProperty('right', 'auto', 'important');
        sidebarTabs.style.setProperty('bottom', 'auto', 'important');
    }

    function dragEnd() {
        if (!isDragging) return;
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        
        localStorage.setItem('rnk-vintage-ui-sidebar-position', JSON.stringify({
            x: xOffset,
            y: yOffset
        }));
    }

    sidebarTabs.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function setupSidebarMinimize(sidebarTabs) {
    const collapseBtn = sidebarTabs.querySelector('.collapse');
    if (!collapseBtn) return;
    
    collapseBtn.style.display = 'none';

    const menu = sidebarTabs.querySelector('.flexcol');
    if (!menu || menu.querySelector('.rnk-minimize-sidebar')) return;
    
    const li = document.createElement('li');
    li.classList.add('rnk-minimize-sidebar');
    
    const minimizeBtn = document.createElement('button');
    minimizeBtn.type = 'button';
    minimizeBtn.classList.add('ui-control', 'plain', 'icon', 'fa-solid', 'fa-minus');
    minimizeBtn.dataset.tooltip = "Minimize Tabs";
    minimizeBtn.setAttribute('aria-label', "Minimize Tabs");
    
    li.appendChild(minimizeBtn);
    menu.appendChild(li);

    minimizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const btnLi = minimizeBtn.closest('li');
        const siblings = Array.from(menu.children).filter(child => 
            child !== btnLi && !child.contains(collapseBtn)
        );
        
        const isMinimized = siblings.length > 0 && siblings[0].style.display === 'none';

        siblings.forEach(sib => {
            sib.style.display = isMinimized ? '' : 'none';
        });

        if (isMinimized) {
            minimizeBtn.classList.remove('fa-plus');
            minimizeBtn.classList.add('fa-minus');
            minimizeBtn.dataset.tooltip = "Minimize Tabs";
        } else {
            minimizeBtn.classList.remove('fa-minus');
            minimizeBtn.classList.add('fa-plus');
            minimizeBtn.dataset.tooltip = "Maximize Tabs";
        }
    });
}
