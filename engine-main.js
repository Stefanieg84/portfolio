// engine-main.js - Main initialization and coordination

import { dataManager } from './engine-data.js';
import { Engine3D } from './engine-3d.js';
import { UIManager } from './engine-ui.js';

class GASEngine {
    constructor() {
        this.engine3D = null;
        this.uiManager = null;
        this.initialized = false;
    }

    async init() {
        console.log('Initializing Governed Adaptive Systems Engine...');
        
        try {
            // Show loading indicator
            const loading = document.getElementById('loading');
            loading.classList.remove('hidden');
            
            // Load all data
            await dataManager.loadAllData();
            
            // Initialize 3D engine
            const canvas = document.getElementById('engine-canvas');
            this.engine3D = new Engine3D(canvas);
            this.engine3D.init();
            
            // Setup 3D selection callback
            this.engine3D.onSelect((data) => {
                this.uiManager.updateSelectedInfo(data);
            });
            
            // Initialize UI manager
            this.uiManager = new UIManager();
            this.uiManager.init();
            
            // Setup controls
            this.setupControls();
            
            // Hide loading indicator
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 500);
            
            this.initialized = true;
            console.log('Engine initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize engine:', error);
            alert('Failed to load engine. Please check console for details.');
        }
    }

    setupControls() {
        // Rotation speed control
        const rotationSpeed = document.getElementById('rotationSpeed');
        rotationSpeed.addEventListener('input', (e) => {
            this.engine3D.setRotationSpeed(e.target.value);
        });
        
        // View mode control
        const viewMode = document.getElementById('viewMode');
        viewMode.addEventListener('change', (e) => {
            this.engine3D.setViewMode(e.target.value);
        });
        
        // Reset view button
        const resetBtn = document.getElementById('resetView');
        resetBtn.addEventListener('click', () => {
            this.engine3D.resetView();
        });
        
        // Stories filter
        const storiesFilter = document.getElementById('storiesFilter');
        if (storiesFilter) {
            storiesFilter.addEventListener('change', () => {
                this.uiManager.loadStories();
            });
        }
        
        // Timeline range
        const timelineRange = document.getElementById('timelineRange');
        if (timelineRange) {
            timelineRange.addEventListener('change', () => {
                this.uiManager.loadTimeline();
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const engine = new GASEngine();
        engine.init();
    });
} else {
    const engine = new GASEngine();
    engine.init();
}

// Console easter egg
console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   GOVERNED ADAPTIVE SYSTEMS ENGINE                                   ║
║                                                                      ║
║   This is not a portfolio. This is a living representation of       ║
║   professional practice - a governed system that reflects how        ║
║   I think, decide, adapt, and create impact.                         ║
║                                                                      ║
║   Principles:                                                        ║
║   • Integration over silos                                           ║
║   • Evidence over assertion                                          ║
║   • Retrospection over prediction                                    ║
║   • Use cases over skills                                            ║
║   • Governance as enabler                                            ║
║   • Adaptation without identity loss                                 ║
║                                                                      ║
║   Curious about the data structure? Check the /data folder.         ║
║   Want to add a rating? Use the Evidence panel.                     ║
║                                                                      ║
║   - Stefanie Garises                                                 ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
`);

export { GASEngine };
