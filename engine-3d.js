// engine-3d.js - Three.js 3D visualization engine

import { dataManager } from './engine-data.js';

export class Engine3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.core = null;
        this.useCaseFaces = [];
        this.skillModules = [];
        this.signalParticles = [];
        this.eaPlanes = [];
        this.grcMesh = null;
        this.rotationSpeed = 0.005;
        this.selectedObject = null;
        this.onSelectCallback = null;
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

        // Camera setup
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x4A90E2, 1, 100);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x50C878, 0.8, 100);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);

        // Create core (invariant values)
        this.createCore();

        // Create use case polyhedron
        this.createUseCasePolyhedron();

        // Create skill modules
        this.createSkillModules();

        // Create signal particles
        this.createSignalParticles();

        // Create EA planes
        this.createEAPlanes();

        // Create GRC mesh
        this.createGRCMesh();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Handle mouse interaction
        this.canvas.addEventListener('click', (event) => this.onCanvasClick(event));

        // Start animation
        this.animate();

        console.log('3D Engine initialized');
    }

    createCore() {
        // Glowing sphere at center representing core values
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4A90E2,
            emissive: 0x4A90E2,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        this.core = new THREE.Mesh(geometry, material);
        this.core.userData = { type: 'core', name: 'Core Values' };
        this.scene.add(this.core);

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x4A90E2,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.core.add(glow);
    }

    createUseCasePolyhedron() {
        // Create dodecahedron for use cases
        const useCases = dataManager.data.useCases;
        const radius = 4;
        
        // Dodecahedron has 12 faces - perfect for use cases
        const geometry = new THREE.DodecahedronGeometry(radius);
        
        // Create individual faces
        const faces = [];
        const faceCount = Math.min(12, useCases.length);
        
        for (let i = 0; i < faceCount; i++) {
            const faceGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
            const faceMaterial = new THREE.MeshPhongMaterial({
                color: 0x1a1a1a,
                emissive: 0x4A90E2,
                emissiveIntensity: 0.2,
                side: THREE.DoubleSide
            });
            const face = new THREE.Mesh(faceGeometry, faceMaterial);
            
            // Position faces around sphere
            const phi = Math.acos(-1 + (2 * i) / faceCount);
            const theta = Math.sqrt(faceCount * Math.PI) * phi;
            
            face.position.x = radius * Math.cos(theta) * Math.sin(phi);
            face.position.y = radius * Math.sin(theta) * Math.sin(phi);
            face.position.z = radius * Math.cos(phi);
            
            face.lookAt(0, 0, 0);
            
            face.userData = {
                type: 'usecase',
                data: useCases[i] || {},
                index: i
            };
            
            this.scene.add(face);
            faces.push(face);
        }
        
        this.useCaseFaces = faces;
    }

    createSkillModules() {
        const skills = dataManager.data.skills;
        const radius = 7;
        
        skills.forEach((skill, index) => {
            const size = 0.4 + (skill.cmmi_level * 0.1);
            const geometry = new THREE.BoxGeometry(size, size, size);
            
            const color = dataManager.getCMMIColor(skill.cmmi_level);
            const decay = dataManager.getSkillDecay(skill.skill_id);
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: decay
            });
            
            const module = new THREE.Mesh(geometry, material);
            
            // Distribute skills in 3D space
            const phi = Math.acos(-1 + (2 * index) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            
            module.position.x = radius * Math.cos(theta) * Math.sin(phi);
            module.position.y = radius * Math.sin(theta) * Math.sin(phi);
            module.position.z = radius * Math.cos(phi);
            
            module.userData = {
                type: 'skill',
                data: skill
            };
            
            this.scene.add(module);
            this.skillModules.push(module);
        });
    }

    createSignalParticles() {
        // Create orbiting particles representing signals
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        for (let i = 0; i < particleCount; i++) {
            const radius = 8 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Random signal colors
            const signalTypes = ['learning', 'project', 'regulatory', 'life_context'];
            const type = signalTypes[Math.floor(Math.random() * signalTypes.length)];
            const color = new THREE.Color(dataManager.getSignalColor(type));
            
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: 'signals' };
        this.scene.add(particles);
        this.signalParticles.push(particles);
    }

    createEAPlanes() {
        // Four semi-transparent intersecting planes for EA architecture
        const planeSize = 10;
        const planes = [
            { color: 0x4A90E2, rotation: [0, 0, 0], name: 'Business' },
            { color: 0x50C878, rotation: [Math.PI / 2, 0, 0], name: 'Data' },
            { color: 0xE2A14A, rotation: [0, Math.PI / 2, 0], name: 'Application' },
            { color: 0xA14AE2, rotation: [0, 0, Math.PI / 2], name: 'Infrastructure' }
        ];
        
        planes.forEach(planeConfig => {
            const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
            const material = new THREE.MeshBasicMaterial({
                color: planeConfig.color,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide
            });
            
            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.set(...planeConfig.rotation);
            plane.userData = {
                type: 'ea_plane',
                name: planeConfig.name
            };
            
            // Add wireframe
            const wireframe = new THREE.LineSegments(
                new THREE.EdgesGeometry(geometry),
                new THREE.LineBasicMaterial({ 
                    color: planeConfig.color,
                    opacity: 0.3,
                    transparent: true
                })
            );
            plane.add(wireframe);
            
            this.scene.add(plane);
            this.eaPlanes.push(plane);
        });
    }

    createGRCMesh() {
        // Create lattice structure representing GRC mesh
        const geometry = new THREE.IcosahedronGeometry(6, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        
        this.grcMesh = new THREE.Mesh(geometry, material);
        this.grcMesh.userData = { type: 'grc_mesh' };
        this.scene.add(this.grcMesh);
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects([
            this.core,
            ...this.useCaseFaces,
            ...this.skillModules
        ]);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.selectObject(object);
        }
    }

    selectObject(object) {
        // Reset previous selection
        if (this.selectedObject) {
            this.selectedObject.material.emissiveIntensity = 0.3;
        }
        
        // Highlight new selection
        this.selectedObject = object;
        object.material.emissiveIntensity = 0.8;
        
        // Trigger callback
        if (this.onSelectCallback) {
            this.onSelectCallback(object.userData);
        }
    }

    setViewMode(mode) {
        // Show/hide different elements based on view mode
        this.useCaseFaces.forEach(face => {
            face.visible = ['full', 'use-cases'].includes(mode);
        });
        
        this.skillModules.forEach(module => {
            module.visible = ['full', 'skills'].includes(mode);
        });
        
        this.signalParticles.forEach(particles => {
            particles.visible = ['full', 'signals'].includes(mode);
        });
        
        this.eaPlanes.forEach(plane => {
            plane.visible = ['full', 'ea-planes'].includes(mode);
        });
        
        if (this.grcMesh) {
            this.grcMesh.visible = ['full', 'grc-mesh'].includes(mode);
        }
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = parseFloat(speed) * 0.01;
    }

    resetView() {
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate use case faces
        this.useCaseFaces.forEach(face => {
            face.rotation.y += this.rotationSpeed;
        });
        
        // Rotate skill modules
        this.skillModules.forEach(module => {
            module.rotation.x += this.rotationSpeed * 0.5;
            module.rotation.y += this.rotationSpeed * 0.5;
        });
        
        // Rotate signal particles
        this.signalParticles.forEach(particles => {
            particles.rotation.y += this.rotationSpeed * 0.3;
        });
        
        // Pulse GRC mesh
        if (this.grcMesh) {
            this.grcMesh.rotation.x += this.rotationSpeed * 0.2;
            this.grcMesh.rotation.y += this.rotationSpeed * 0.2;
            const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
            this.grcMesh.scale.set(scale, scale, scale);
        }
        
        // Pulse core
        if (this.core) {
            const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
            this.core.scale.set(scale, scale, scale);
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onSelect(callback) {
        this.onSelectCallback = callback;
    }
}
