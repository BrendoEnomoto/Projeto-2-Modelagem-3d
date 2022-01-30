import * as THREE from './three.module.js'
import {GLTFLoader} from './GLTFLoader.js'
import {OrbitControls} from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";

//Configurações básicas
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();

document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
//importar os modelos 3d
const controlador = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

var launcher;

loader.load("./models/launcher/scene.gltf", function(gltf){
    launcher = gltf.scene;
    scene.add(gltf.scene);
});

var rocket;

loader.load("./models/rocket/scene.gltf", function(gltf){
    rocket = gltf.scene;
    rocket.position.set(0,3,0)
    scene.add(gltf.scene);
});

var light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
scene.add(light);

camera.position.set(0,0,10)

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
};
animate();

