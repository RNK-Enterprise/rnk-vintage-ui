// Sidebar tabs management module for RNK 12 UI

import { DragHandlers } from './drag-handlers.js';

export function initializeSidebar() {
    Hooks.once('ready', () => {
        console.log('RNK 12 UI | Hotbar repositioning module initialized');

        const sidebarTabs = document.getElementById('sidebar-tabs');
        if (!sidebarTabs) return;

        setupSidebarDrag(sidebarTabs);
        setupSidebarMinimize(sidebarTabs);
    });
}

function setupSidebarDrag(sidebarTabs) {
    let isSidebarDragging = false;
    let isSidebarMouseDown = false;
    let hasSidebarDragged = false;
    let sidebarCurrentX;
    let sidebarCurrentY;
    let sidebarInitialX;
    let sidebarInitialY;
    let sidebarStartX;
    let sidebarStartY;
    let sidebarXOffset = 0;
    let sidebarYOffset = 0;
    const DRAG_THRESHOLD = 5;

    const savedSidebarPosition = localStorage.getItem('rnk-12-ui-sidebar-position');
    if (savedSidebarPosition) {
        const pos = JSON.parse(savedSidebarPosition);
        sidebarTabs.style.setProperty('right', 'auto', 'important');
        sidebarTabs.style.setProperty('top', 'auto', 'important');
        DragHandlers.setTranslate(pos.x, pos.y, sidebarTabs);
        sidebarXOffset = pos.x;
        sidebarYOffset = pos.y;
    }

    sidebarTabs.style.cursor = 'move';

    function sidebarDragStart(e) {
        if (!sidebarTabs.style.left || sidebarTabs.style.left === 'auto') {
            const rect = sidebarTabs.getBoundingClientRect();
            sidebarXOffset = rect.left;
            sidebarYOffset = window.innerHeight - rect.bottom;
        }

        sidebarInitialX = e.clientX - sidebarXOffset;
        sidebarInitialY = window.innerHeight - e.clientY - sidebarYOffset;
        sidebarStartX = e.clientX;
        sidebarStartY = e.clientY;
        isSidebarMouseDown = true;
        isSidebarDragging = false;
        hasSidebarDragged = false;
    }

    function sidebarDrag(e) {
        if (!isSidebarMouseDown) return;

        if (!isSidebarDragging) {
            const dx = e.clientX - sidebarStartX;
            const dy = e.clientY - sidebarStartY;
            if (Math.sqrt(dx*dx + dy*dy) < DRAG_THRESHOLD) return;
            isSidebarDragging = true;
            hasSidebarDragged = true;
        }
        
        e.preventDefault();
        sidebarCurrentX = e.clientX - sidebarInitialX;
        sidebarCurrentY = window.innerHeight - e.clientY - sidebarInitialY;
        
        sidebarXOffset = sidebarCurrentX;
        sidebarYOffset = sidebarCurrentY;
        
        sidebarTabs.style.setProperty('right', 'auto', 'important');
        sidebarTabs.style.setProperty('top', 'auto', 'important');
        DragHandlers.setTranslate(sidebarCurrentX, sidebarCurrentY, sidebarTabs);
    }

    function sidebarDragEnd() {
        isSidebarMouseDown = false;
        if (!isSidebarDragging) return;
        
        sidebarInitialX = sidebarCurrentX;
        sidebarInitialY = sidebarCurrentY;
        isSidebarDragging = false;
        
        localStorage.setItem('rnk-12-ui-sidebar-position', JSON.stringify({
            x: sidebarXOffset,
            y: sidebarYOffset
        }));
    }

    sidebarTabs.addEventListener('mousedown', sidebarDragStart);
    document.addEventListener('mousemove', sidebarDrag);
    document.addEventListener('mouseup', sidebarDragEnd);
    
    sidebarTabs.addEventListener('click', (e) => {
        if (hasSidebarDragged) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
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
