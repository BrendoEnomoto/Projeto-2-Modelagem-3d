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


//adiciona os modelos 3d
var loader = new GLTFLoader();

//base de lançamento
loader.load( "./models/launcher/scene.glb", function( gltf ) {gltf.scene.traverse( function( node ) {

  if ( node.isMesh ) { 
      node.castShadow = true;
      node.receiveShadow = true;
  }

} );

scene.add(gltf.scene);

} );

//spot lights para a launcher
var spot_light_1 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_1.castShadow = true;
spot_light_1.target.position.set(0,3,0);
spot_light_1.position.set(13.5,10,25);
scene.add(spot_light_1);
scene.add(spot_light_1.target);
spot_light_1.shadow.camera.zoom = 1;

var spot_light_2 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_2.castShadow = true;
spot_light_2.target.position.set(0,3,0);
spot_light_2.position.set(13.5,7,25);
scene.add(spot_light_2);
scene.add(spot_light_2.target);
spot_light_2.shadow.camera.zoom = 1;

var spot_light_3 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_3.castShadow = true;
spot_light_3.target.position.set(0,3,0);
spot_light_3.position.set(16.5,8,-14);
scene.add(spot_light_3);
scene.add(spot_light_3.target);
spot_light_3.shadow.camera.zoom = 1;

var spot_light_4 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_4.castShadow = true;
spot_light_4.target.position.set(0,3,0);
spot_light_4.position.set(-11,7,-14);
scene.add(spot_light_4);
scene.add(spot_light_4.target);
spot_light_4.shadow.camera.zoom = 1;

var spot_light_5 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_5.castShadow = true;
spot_light_5.target.position.set(0,3,0);
spot_light_5.position.set(-11,10,-14);
scene.add(spot_light_5);
scene.add(spot_light_5.target);
spot_light_5.shadow.camera.zoom = 1;

var spot_light_6 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_6.castShadow = true;
spot_light_6.target.position.set(0,3,0);
spot_light_6.position.set(-18,8,15);
scene.add(spot_light_6);
scene.add(spot_light_6.target);
spot_light_6.shadow.camera.zoom = 1;



//sol vermelho ponto de luz 
const pointLight = new THREE.PointLight(0xB22222, 2);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);


//sol azul ponto de luz 
const pointLight2 = new THREE.PointLight(0x4169E1, 2);
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

const animate = () => {
    requestAnimationFrame(animate);
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