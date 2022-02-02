import * as THREE from './three.module.js'
import {GLTFLoader} from './GLTFLoader.js'
import {OrbitControls} from "https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "./EffectComposer.js";
import { RenderPass } from "./RenderPass.js";
import { UnrealBloomPass } from "./UnrealBloomPass.js";

//Configurações básicas
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

//renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const controlador = new OrbitControls(camera, renderer.domElement);

//red sun object
const color = new THREE.Color("#B22222");
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({ color: color });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(-50, 20, -60);
sphere.layers.set(1);
scene.add(sphere);

//blue sun object
const color2 = new THREE.Color("#4169E1");
const geometry2 = new THREE.IcosahedronGeometry(1, 15);
const material2 = new THREE.MeshBasicMaterial({ color: color2 });
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.position.set(50, 20, 60);
sphere2.layers.set(1);
scene.add(sphere2);

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(80, 64, 64);

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("texture/galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1);
scene.add(starMesh);

//earth geometry
const earthgeometry = new THREE.SphereGeometry(9.8, 64, 64);

//earth material
const earthMaterial = new THREE.MeshPhongMaterial({
  roughness: 1,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/earthmap1.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
  bumpScale: 0.3,
});

//earthMesh
const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
earthMesh.receiveShadow = true;
earthMesh.castShadow = true;
earthMesh.layers.set(0);
scene.add(earthMesh);


//cloud geometry
const cloudgeometry = new THREE.SphereGeometry(10, 64, 64);

//cloud material
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture("texture/earthCloud.png"),
  transparent: true,
});

//cloudMesh
const cloud = new THREE.Mesh(cloudgeometry, cloudMaterial);
earthMesh.layers.set(0);
scene.add(cloud);

//moon geometry
const moongeometry = new THREE.SphereGeometry(1, 64, 64);

//moon material
const moonMaterial = new THREE.MeshPhongMaterial({
  roughness: 5,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/moonmap4k.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/moonbump4k.jpg"),
  bumpScale: 0.02,
});

//moonMesh
const moonMesh = new THREE.Mesh(moongeometry, moonMaterial);
moonMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.position.x = 20;
moonMesh.layers.set(0);
scene.add(moonMesh);

var moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);

var cameraPivot = new THREE.Object3D();
moonMesh.add(cameraPivot);
cameraPivot.add(camera);
/* 
//importar os modelos 3d
const loader = new GLTFLoader();

var launcher;

loader.load("./models/launcher/scene.gltf", function(gltf){
    launcher = gltf.scene;
    launcher.scale.set(0.01,0.01,0.01)
    launcher.position.set(0,3,0)
    scene.add(gltf.scene);
});

var rocket;

loader.load("./models/rocket/scene.gltf", function(gltf){
    rocket = gltf.scene;
    rocket.position.set(0,3,0)
    rocket.scale.set(0.01,0.01,0.01)
    scene.add(gltf.scene);
}); */

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientlight);

//var light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
//scene.add(light);

//red sun point Light 
const pointLight = new THREE.PointLight(0x4169E1, 2);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);

//blue sun point Light 
const pointLight2 = new THREE.PointLight(0xB22222, 2);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(50, 20, 60);
scene.add(pointLight2);

//resize listner
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

camera.position.set(0,0,10)

const animate = () => {
    requestAnimationFrame(animate);
    cloud.rotation.y-=0.0002;
    //moon rotation
    moonPivot.rotation.y -= 0.005;
    moonPivot.rotation.x = 0.5;
    cameraPivot.rotation.y += 0.001;
    starMesh.rotation.y += 0.0002;
    camera.layers.set(1);
    bloomComposer.render();
    renderer.clearDepth();
    camera.layers.set(0);
    renderer.render(scene, camera);
  };
animate();

/* const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './projeto 2 audio teste.wav', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.3 );
	sound.play();
}); */