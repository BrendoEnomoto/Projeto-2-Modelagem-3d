import * as THREE from './three.module.js'
import {GLTFLoader} from './GLTFLoader.js'
import {OrbitControls} from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";

//Configurações básicas
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);


var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

//Modelos 3d e sombras
const controlador = new OrbitControls(camera, renderer.domElement);
var loader = new GLTFLoader();

loader.load( "./models/rocket/scene.gltf", function( gltf ) {gltf.scene.traverse( function( node ) {

        if ( node.isMesh ) { node.castShadow = true; }

    } );

    scene.add(gltf.scene);

} );

loader.load( "./models/launcher/scene.glb", function( gltf ) {gltf.scene.traverse( function( node ) {

    if ( node.isMesh ) { node.castShadow = true; }

} );

scene.add(gltf.scene);

} );

//launcher
var launcher;

loader.load("./models/launcher/scene.glb", function(gltf){
    launcher = gltf.scene;
    launcher.receiveShadow = true;
    launcher.castShadow = true;
    scene.add(launcher);

});

//Rocket
var rocket;

loader.load("./models/rocket/scene.gltf", function(gltf){
    rocket = gltf.scene;
    rocket.position.set(0,3,0)
    rocket.castShadow = true;
    rocket.receiveShadow = true;
    scene.add(rocket);
});

//iluminação

// luz ambiente
//var teste = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
//scene.add(teste);

//spot lights para a launcher
var spot_light_1 = new THREE.SpotLight(new THREE.Color(0xffffff),0.80);
spot_light_1.castShadow = true;
spot_light_1.target.position.set(0,3,0);
spot_light_1.position.set(13.5,10,25);
scene.add(spot_light_1);
scene.add(spot_light_1.target);
spot_light_1.shadow.camera.zoom = 1;

var spot_light_2 = new THREE.SpotLight(new THREE.Color(0xffffff),0.80);
spot_light_2.castShadow = true;
spot_light_2.target.position.set(0,3,0);
spot_light_2.position.set(13.5,7,25);
scene.add(spot_light_2);
scene.add(spot_light_2.target);
spot_light_2.shadow.camera.zoom = 1;

var spot_light_3 = new THREE.SpotLight(new THREE.Color(0xffffff),0.80);
spot_light_3.castShadow = true;
spot_light_3.target.position.set(0,3,0);
spot_light_3.position.set(16.5,8,-14);
scene.add(spot_light_3);
scene.add(spot_light_3.target);
spot_light_3.shadow.camera.zoom = 1;

var spot_light_4 = new THREE.SpotLight(new THREE.Color(0xffffff),0.80);
spot_light_4.castShadow = true;
spot_light_4.target.position.set(0,3,0);
spot_light_4.position.set(-11,7,-14);
scene.add(spot_light_4);
scene.add(spot_light_4.target);
spot_light_4.shadow.camera.zoom = 1;

var spot_light_5 = new THREE.SpotLight(new THREE.Color(0xffffff),0.80);
spot_light_5.castShadow = true;
spot_light_5.target.position.set(0,3,0);
spot_light_5.position.set(-11,10,-14);
scene.add(spot_light_5);
scene.add(spot_light_5.target);
spot_light_5.shadow.camera.zoom = 1;

var spot_light_6 = new THREE.SpotLight(new THREE.Color(0xffffff),0.80);
spot_light_6.castShadow = true;
spot_light_6.target.position.set(0,3,0);
spot_light_6.position.set(-18,8,15);
scene.add(spot_light_6);
scene.add(spot_light_6.target);
spot_light_6.shadow.camera.zoom = 1;


//Ajudantes das spot lights
var Helper_1_spot_light_1 = new THREE.PointLightHelper(spot_light_1);
scene.add(Helper_1_spot_light_1)

var Helper_2_spot_light_2 = new THREE.PointLightHelper(spot_light_2);
scene.add(Helper_2_spot_light_2)

var Helper_3_spot_light_3 = new THREE.PointLightHelper(spot_light_3);
scene.add(Helper_3_spot_light_3)

var Helper_4_spot_light_4 = new THREE.PointLightHelper(spot_light_4);
scene.add(Helper_4_spot_light_4)

var Helper_5_spot_light_5 = new THREE.PointLightHelper(spot_light_5);
scene.add(Helper_5_spot_light_5)

var Helper_6_spot_light_6 = new THREE.PointLightHelper(spot_light_6);
scene.add(Helper_6_spot_light_6)

var camera_helper_1 = new THREE.CameraHelper(spot_light_1.shadow.camera);
scene.add(camera_helper_1)



camera.position.set(0,0,10)

const geometria = new THREE.BoxGeometry();
const textura = new THREE.TextureLoader();
textura.wrapS = THREE.RepeatWrapping;
textura.wrapT = THREE.RepeatWrapping;
const material = new THREE.MeshBasicMaterial({map: textura.load('https://raw.githubusercontent.com/BrendoEnomoto/Projeto-2-Modelagem-3d/main/texturas/Piso2.jpg')})
const cubo = new THREE.Mesh(geometria,material);
cubo.position.set(5,5,5)
cubo.receiveShadow = true;
cubo.castShadow = true;

scene.add(cubo);

//Plano
const geometry3 = new THREE.BoxGeometry( 80, 80 );
var material3 = new THREE.MeshPhongMaterial( {map: textura.load('https://raw.githubusercontent.com/BrendoEnomoto/Projeto-2-Modelagem-3d/main/texturas/Piso2.jpg')} );
//const material3 = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE} );
const floor = new THREE.Mesh( geometry3, material3 );
floor.rotation.x = Math.PI * -0.5;
floor.position.y = 0;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);


function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
};
animate();

