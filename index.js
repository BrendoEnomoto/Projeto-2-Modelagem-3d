import * as THREE from './three.module.js'
import {GLTFLoader} from './GLTFLoader.js'
import {OrbitControls} from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "./EffectComposer.js";
import { RenderPass } from "./RenderPass.js";
import { UnrealBloomPass } from "./UnrealBloomPass.js";

//Configurações básicas
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

//renderização
var renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

//opções de sombremento
renderer.shadowMap.enabled = true;
//renderer.shadowMapType = THREE.PCFSoftShadowMap;




//renderização bloom 
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2;
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//Orbitcontrols
const controlador = new OrbitControls(camera, renderer.domElement);


//Sol azul

const color = new THREE.Color("#B22222");
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({ color: color });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(-50, 20, -60);
sphere.layers.set(1);
scene.add(sphere);

//Sol vermelho
const color2 = new THREE.Color("#4169E1");
const geometry2 = new THREE.IcosahedronGeometry(1, 15);
const material2 = new THREE.MeshBasicMaterial({ color: color2 });
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.position.set(50, 20, 60);
sphere2.layers.set(1);
scene.add(sphere2);

// geometria da galaxia
const starGeometry = new THREE.SphereGeometry(80, 64, 64);

// material da galaxia
const starMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("texture/galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});

// galaxia mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1);
scene.add(starMesh);

//geometria da terra
const earthgeometry = new THREE.SphereGeometry(19.6, 64, 64);

//material da terra
const earthMaterial = new THREE.MeshPhongMaterial({
  roughness: 1,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/earthmap1.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
  bumpScale: 0.3,
});

//mash da terra
const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
earthMesh.receiveShadow = true;
earthMesh.castShadow = true;
earthMesh.layers.set(0);
scene.add(earthMesh);


//geometria das nuvens
const cloudgeometry = new THREE.SphereGeometry(19.8, 64, 64);

//material das nuvens
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture("texture/earthCloud.png"),
  transparent: true,
});

//nuvem mesh
const cloud = new THREE.Mesh(cloudgeometry, cloudMaterial);
earthMesh.layers.set(0);
scene.add(cloud);

//geometria da nuvem
const moongeometry = new THREE.SphereGeometry(2, 64, 64);

//material da nuvem 
const moonMaterial = new THREE.MeshPhongMaterial({
  roughness: 5,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/moonmap4k.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/moonbump4k.jpg"),
  bumpScale: 0.02,
});

//mash da lua
const moonMesh = new THREE.Mesh(moongeometry, moonMaterial);
moonMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.position.x = 40;
moonMesh.layers.set(0);

//pivo de rotação da lua
var moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);

//adiciona os modelos 3d
var loader = new GLTFLoader();

//base de lançamento
var launcher;

loader.load( "./models/launcher/scene.glb",function(gltf){gltf.scene.traverse(function(node){
    if ( node.isMesh ) { 
        node.castShadow = true;
        node.receiveShadow = true;
    }
});
launcher = gltf.scene;
launcher.position.set(37.995,0,0);
launcher.rotation.z = 1.5;
launcher.scale.set(0.005,0.005,0.005);
scene.add(launcher);
} );

//ISS

var ISS;

loader.load( "./models/iss/scene.glb",function(gltf){gltf.scene.traverse(function(node){
  if ( node.isMesh ) { 
      node.castShadow = true;
      node.receiveShadow = false;
  }
});
ISS = gltf.scene;
ISS.scale.set(0.5,0.5,0.5);
ISS.position.set(20,0);
ISS.layers.set(0)
scene.add(ISS);
} );


//sol vermelho ponto de luz 
const pointLight = new THREE.PointLight(0xB22222, 4);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);


//sol azul ponto de luz 
const pointLight2 = new THREE.PointLight(0x4169E1, 4);
pointLight2.castShadow = true;
pointLight2.shadowCameraVisible = true;
pointLight2.shadowBias = 0.00001;
pointLight2.shadowDarkness = 0.2;
pointLight2.shadowMapWidth = 2048;
pointLight2.shadowMapHeight = 2048;
pointLight2.position.set(50, 20, 60);
scene.add(pointLight2);

//adciona a detecção automatica do tamamanho da janela de exibição 
window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

camera.position.set(0,4,50)

var launcherPivot = new THREE.Object3D();
var cameraPivot = new THREE.Object3D();
var issPivot = new THREE.Object3D();

const animate = () => {
    if (launcher) {
        //rotação da lua
        moonPivot.rotation.y -= 0.005;
        moonPivot.rotation.x = 0.5;

        //pivo de rotação da base
        earthMesh.add(launcherPivot);
        launcherPivot.add(launcher);
        launcherPivot.rotation.y -= 0.005;
        launcherPivot.rotation.x = 0.5;

        //pivo da camera
        //launcher.add(cameraPivot);
        //cameraPivot.add(camera);
    }
    if (ISS) {
        //pivo de rotação da ISS 
        earthMesh.add(issPivot);
        issPivot.add(ISS);
        issPivot.rotation.y -= 0.002;
        issPivot.rotation.x = 0.005;
        //pivo da camera
        //ISS.add(cameraPivot);
        //cameraPivot.add(camera);
  }
    requestAnimationFrame(animate);
    cloud.rotation.y-=0.0002;
    //pivo da camera
    //cameraPivot.rotation.y += 0.001;
    starMesh.rotation.y += 0.0002;
    camera.layers.set(1);
    bloomComposer.render();
    renderer.clearDepth();
    camera.layers.set(0);
    renderer.render(scene, camera);
  };
animate();

// adiciona musica de fundo
/* const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './interstellar.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.3 );
	sound.play();
});  */