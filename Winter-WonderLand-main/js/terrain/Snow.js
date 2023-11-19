import * as THREE from "../lib/three.module.js";


export default class Snow {
    constructor(scene, snowflakeCount = 3000, snowflakeSpeed = 5) {
        this.scene = scene;
        this.snowflakeCount = snowflakeCount;
        this.snowflakeSpeed = snowflakeSpeed;


        //Teksturen for snøflakene
        this.snowflakeTexture = new THREE.TextureLoader().load('resources/textures/snowflake.png');

        // Oppretter materiale for snøflakene med definerte egenskaper
        this.snowflakeMaterial = new THREE.PointsMaterial({
            size: 5,
            map: this.snowflakeTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.snowflakeGeometry = new THREE.Geometry();

        // Fyller geometrien med tilfeldige snøflak
        for (let i = 0; i < this.snowflakeCount; i++) {
            const snowflake = new THREE.Vector3(
                Math.random() * 2000 - 1000,
                Math.random() * 4000 - 500,
                Math.random() * 2000 - 1000
            );
            this.snowflakeGeometry.vertices.push(snowflake);
        }

        // Oppretter et Points-objekt med geometri og materiale, og legger det til i scenen
        this.snowflakeSystem = new THREE.Points(this.snowflakeGeometry, this.snowflakeMaterial);
        this.scene.add(this.snowflakeSystem);
    }

    // Metode for å animere snøfallet
    animateSnowfall() {
        // Itererer gjennom alle snøflakene i geometrien
        for (let i = 0; i < this.snowflakeGeometry.vertices.length; i++) {
            const snowflake = this.snowflakeGeometry.vertices[i];
            // Endrer Y-posisjonen basert på snøfartsparameteren
            snowflake.y -= this.snowflakeSpeed;

            // Reseter snøflaket til toppen hvis det når bunnen av scenen
            if (snowflake.y < -1000) {
                snowflake.y = 1000;
            }
        }

        // Oppdaterer geometrien for å reflektere endringene
        this.snowflakeGeometry.verticesNeedUpdate = true;
    }
}
