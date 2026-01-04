// Drag handler utilities and state management for RNK 12 UI module

export const DragHandlers = {
    // Hotbar drag state
    hotbar: {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0
    },
    
    // Scene Controls drag state
    controls: {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0
    },
    
    // Players drag state
    players: {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0
    },
    
    // Players Active drag state
    active: {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0
    },
    
    setTranslate(xPos, yPos, el) {
        el.style.setProperty('left', xPos + 'px', 'important');
        el.style.setProperty('bottom', yPos + 'px', 'important');
    },
    
    createHotbarHandlers() {
        const dragStart = (e) => {
            if (e.target.closest('.macro') || e.target.closest('.page-controls')) return;
            this.hotbar.initialX = e.clientX - this.hotbar.xOffset;
            this.hotbar.initialY = window.innerHeight - e.clientY - this.hotbar.yOffset;
            this.hotbar.isDragging = true;
        };
        
        const drag = (e) => {
            if (!this.hotbar.isDragging) return;
            e.preventDefault();
            this.hotbar.currentX = e.clientX - this.hotbar.initialX;
            this.hotbar.currentY = window.innerHeight - e.clientY - this.hotbar.initialY;
            this.hotbar.xOffset = this.hotbar.currentX;
            this.hotbar.yOffset = this.hotbar.currentY;
            const hotbar = document.getElementById('hotbar');
            if (hotbar) this.setTranslate(this.hotbar.currentX, this.hotbar.currentY, hotbar);
        };
        
        const dragEnd = () => {
            if (!this.hotbar.isDragging) return;
            this.hotbar.initialX = this.hotbar.currentX;
            this.hotbar.initialY = this.hotbar.currentY;
            this.hotbar.isDragging = false;
            localStorage.setItem('rnk-vintage-ui-hotbar-position', JSON.stringify({ 
                x: this.hotbar.xOffset, 
                y: this.hotbar.yOffset 
            }));
        };
        
        return { dragStart, drag, dragEnd };
    },
    
    createControlsHandlers() {
        const dragStart = (e) => {
            const controls = document.getElementById('scene-controls');
            if (!controls) return;
            this.controls.initialX = e.clientX - this.controls.xOffset;
            this.controls.initialY = e.clientY - this.controls.yOffset;
            this.controls.isDragging = true;
        };
        
        const drag = (e) => {
            if (!this.controls.isDragging) return;
            e.preventDefault();
            this.controls.currentX = e.clientX - this.controls.initialX;
            this.controls.currentY = e.clientY - this.controls.initialY;
            this.controls.xOffset = this.controls.currentX;
            this.controls.yOffset = this.controls.currentY;
            const controls = document.getElementById('scene-controls');
            if (controls) {
                controls.style.setProperty('left', this.controls.currentX + 'px', 'important');
                controls.style.setProperty('top', this.controls.currentY + 'px', 'important');
                controls.style.setProperty('bottom', 'auto', 'important');
                controls.style.setProperty('right', 'auto', 'important');
            }
        };
        
        const dragEnd = () => {
            if (!this.controls.isDragging) return;
            this.controls.initialX = this.controls.currentX;
            this.controls.initialY = this.controls.currentY;
            this.controls.isDragging = false;
            localStorage.setItem('rnk-vintage-ui-controls-position', JSON.stringify({ 
                x: this.controls.xOffset, 
                y: this.controls.yOffset 
            }));
        };
        
        return { dragStart, drag, dragEnd };
    },
    
    createPlayersHandlers() {
        const dragStart = (e) => {
            const players = document.getElementById('players');
            if (!players) return;
            this.players.initialX = e.clientX - this.players.xOffset;
            this.players.initialY = e.clientY - this.players.yOffset;
            this.players.isDragging = true;
        };
        
        const drag = (e) => {
            if (!this.players.isDragging) return;
            e.preventDefault();
            this.players.currentX = e.clientX - this.players.initialX;
            this.players.currentY = e.clientY - this.players.initialY;
            this.players.xOffset = this.players.currentX;
            this.players.yOffset = this.players.currentY;
            const players = document.getElementById('players');
            if (players) {
                players.style.setProperty('left', this.players.currentX + 'px', 'important');
                players.style.setProperty('top', this.players.currentY + 'px', 'important');
                players.style.setProperty('bottom', 'auto', 'important');
                players.style.setProperty('right', 'auto', 'important');
            }
        };
        
        const dragEnd = () => {
            if (!this.players.isDragging) return;
            this.players.initialX = this.players.currentX;
            this.players.initialY = this.players.currentY;
            this.players.isDragging = false;
            localStorage.setItem('rnk-vintage-ui-players-position', JSON.stringify({ 
                x: this.players.xOffset, 
                y: this.players.yOffset 
            }));
        };
        
        return { dragStart, drag, dragEnd };
    },
    
    createActivePlayersHandlers() {
        const dragStart = (e) => {
            if (e.target.closest('button')) return;
            const playersActive = document.getElementById('players-active');
            if (!playersActive) return;
            this.active.initialX = e.clientX - this.active.xOffset;
            this.active.initialY = e.clientY - this.active.yOffset;
            this.active.isDragging = true;
        };
        
        const drag = (e) => {
            if (!this.active.isDragging) return;
            e.preventDefault();
            this.active.currentX = e.clientX - this.active.initialX;
            this.active.currentY = e.clientY - this.active.initialY;
            this.active.xOffset = this.active.currentX;
            this.active.yOffset = this.active.currentY;
            const playersActive = document.getElementById('players-active');
            if (playersActive) {
                playersActive.style.setProperty('left', this.active.currentX + 'px', 'important');
                playersActive.style.setProperty('top', this.active.currentY + 'px', 'important');
            }
        };
        
        const dragEnd = () => {
            if (!this.active.isDragging) return;
            this.active.initialX = this.active.currentX;
            this.active.initialY = this.active.currentY;
            this.active.isDragging = false;
            localStorage.setItem('rnk-vintage-ui-players-active-position', JSON.stringify({ 
                x: this.active.xOffset, 
                y: this.active.yOffset 
            }));
        };
        
        return { dragStart, drag, dragEnd };
    }
};
