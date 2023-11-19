import Utilities from "../lib/Utilities.js";
import TerrainBufferGeometry from "./TerrainBufferGeometry.js";
import {GLTFLoader} from "../loaders/GLTFLoader.js";
import * as THREE from "../lib/three.module.js";
import {Mesh, RepeatWrapping, TextureLoader,} from "../lib/three.module.js";
import TextureSplattingMaterial from "../materials/TextureSplattingMaterial.js";

export default class Terrain {
    constructor(scene, width, height) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.scene.receiveShadow = true;
        this.scene.castShadow = true;
        this.loadSnowman();
        this.loadChristmasTree(150, this.height -370,100,3*Math.PI/2);
        this.setupTerrain();
        this.loadCabin(-200,this.height - 370,-200,Math.PI *3.2);
        this.loadCabin(150,this.height - 370,-350,Math.PI );
        this.loadCabin(500,this.height - 370,-200,Math.PI/1.5 );
    }

    async setupTerrain() {
        const heightmapImage = await Utilities.loadImage('resources/images/heightmap.png');
        this.terrainGeometry = new TerrainBufferGeometry({
            width: this.width,
            heightmapImage,
            numberOfSubdivisions: 128,
            height: 700
        });

        const snowyRockTexture = this.loadTexture('resources/textures/snowy_rock_01.png', 3000);
        const grassTexture = this.loadTexture('resources/textures/grass_02.png', 3000);
        const snowTexture = this.loadTexture('resources/textures/snow-covered-land.jpg', 12000);
        const waterTexture = this.loadTexture('resources/textures/water.png', 5000);

        const splatMap = this.loadSplatMap('resources/images/splatmapI.png');
        const splatMap2 = this.loadSplatMap('resources/images/splatmapV.png');
        const splatMap3 = this.loadSplatMap('resources/images/splatmapVI.png');
        const splatMap4 = this.loadSplatMap('resources/images/splatmapVII.png');

        const terrainMaterial = new TextureSplattingMaterial({
            specular: 0x222222,
            color: 0xffffff,
            shininess: 1,
            reflectivity: 0.01,
            shadowSide: THREE.FrontSide,

            textures: [snowyRockTexture, snowTexture, waterTexture, grassTexture],
            splatMaps: [splatMap, splatMap2, splatMap3, splatMap4]

        });

        this.terrain = new Mesh(this.terrainGeometry, terrainMaterial);
        this.terrain.receiveShadow= true;
        this.terrain.castShadow = false;
        this.loadTrees();
        this.scene.add(this.terrain);

    }

    loadTexture(path, repeatWidth) {
        const texture = new TextureLoader().load(path);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(repeatWidth / this.width, repeatWidth / this.width);
        return texture;
    }

    loadSplatMap(path) {
        return new TextureLoader().load(path);
    }
    //plasser juletre
    loadChristmasTree(posX, posY, posz, rot) {
        const loader = new GLTFLoader();
        loader.load(
            'resources/models/Christmastree.glb',
            (object) => {
                const CTree = object.scene.children[0].clone();

                CTree.traverse((child) => {
                    if (child.isMesh) {
                        const texture = new TextureLoader().load('resources/textures/christmasTreeWhiteDif_xx.jpg');
                        const bumpTexture = new TextureLoader().load('resources/textures/christmasTreeWhiteDif.jpg');

                        const material = new THREE.MeshStandardMaterial({
                            map: texture,
                            emissiveIntensity: 0,
                            bumpMap: bumpTexture,
                            bumpScale: 300
                        });

                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                CTree.position.set(posX, posY, posz);
                CTree.rotation.x = rot;
                CTree.scale.multiplyScalar(2);
                this.scene.add(CTree);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading cabin model.', error);
            }
        );
    }
    // plasser snømann
    loadSnowman() {
        const loader = new GLTFLoader();
        loader.load(
            'resources/models/snowman2.glb',
            (object) => {
                const snowman = object.scene.children[0].clone();

                snowman.traverse((child) => {

                    if (child.isMesh) {
                        const whiteMaterial = new THREE.MeshStandardMaterial({
                            color: 0xffffff, // White color
                            roughness: 0.5,
                            metalness: 0.5,
                        });

                        child.material = whiteMaterial;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                snowman.position.x = 200;
                snowman.position.y = this.height - 370;
                snowman.position.z = -100;

                snowman.rotation.set(-Math.PI / 2, -Math.PI / 60, 0);


                snowman.scale.multiplyScalar(5);

                this.scene.add(snowman);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading cabin model.', error);
            }
        );
    }
    //plasser hytte
    loadCabin(posX, posY, posz, rot) {
        const loader = new GLTFLoader();
        loader.load(
            'resources/models/scene2.glb',
            (object) => {
                const cabin = object.scene.children[0].clone();

                cabin.traverse((child) => {
                    if (child.isMesh) {
                        const texture = new TextureLoader().load('resources/textures/Farmhouse Texture.jpg');

                        const material = new THREE.MeshStandardMaterial({
                            map: texture,
                            emissiveIntensity: 0
                        });

                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;

                        // Opprett et punktlys med tilpassede egenskaper funker ikke helt. funker greit hvis byggningene er mindre
                        const pointLight = new THREE.PointLight(0xffccaa, 1, 700); // farge, intensitet, rekkevidde
                        pointLight.position.set(posX, posY , posz); // Angi lysposisjon, juster etter behov
                        this.scene.add(pointLight);

                        // Legg til punktlyset som et barn av mesh (hvis du vil at det skal bevege seg med mesh)
                        child.add(pointLight);
                    }
                });
                cabin.position.set(posX, posY, posz);
                cabin.rotation.y = rot;
                cabin.scale.multiplyScalar(4);
                this.scene.add(cabin);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading cabin model.', error);
            }
        );
    }

    //plasser trer
    loadTrees() {
        const loader = new GLTFLoader();
        loader.load(
            'resources/models/kenney_nature_kit/tree_thin.glb',
            (object) => {
                this.placeTrees(object);
            },
            (xhr) => {
                console.log(((xhr.loaded / xhr.total) * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model.', error);
            }
        );
    }


    placeTrees(treeObject) {
        for (let x = -100; x < 600; x += Math.random() * 115 + 157) {
            for (let z = 600; z <900; z += Math.random() * 120 + 143) {
                const px = x + 1 + (100 * Math.random()) - 3;
                const pz = z + 1 + (100 * Math.random()) - 3;
                const height = this.terrainGeometry.getHeightAt(px, pz);

                if (height < 600) {
                    const tree = treeObject.scene.children[0].clone();
                    tree.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    tree.position.x = px ;
                    tree.position.y = height -0.1;
                    tree.position.z = pz;
                    tree.rotation.y = Math.random() * (2 * Math.PI);
                    tree.scale.multiplyScalar(120 + Math.random() * 1);
                    this.scene.add(tree);
                }
            }
        }
    }
}