import * as THREE from '../lib/three.module.js';

export default class FogManager {
    constructor(scene) {
        this.scene = scene;
        // Definerer startnærhet (near) for tåken
        this.near = 1;
        // Definerer sluttnærhet (far) for tåken
        this.far = 5000;
        this.color = 0xaaaaaa;
        this.setupFog();
    }

    setupFog() {
        this.scene.fog = new THREE.Fog(this.color, this.near, this.far);
    }
}