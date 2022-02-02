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
const earthgeometry = new THREE.SphereGeometry(19.6, 64, 64);

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
const cloudgeometry = new THREE.SphereGeometry(19.8, 64, 64);

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
const moongeometry = new THREE.SphereGeometry(2, 64, 64);

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
moonMesh.position.x = 40;
moonMesh.layers.set(0);

//adiciona os modelos 3d
var loader = new GLTFLoader();
//rocket launcher
var launcher;

loader.load( "./models/launcher/scene.glb",function(gltf){gltf.scene.traverse(function(node){
    if ( node.isMesh ) { 
        node.castShadow = true;
        node.receiveShadow = true;
    }
});
launcher = gltf.scene;
launcher.position.set(0,40)
/*
launcher.position.set(37.995,0,0);
launcher.rotation.z = 1.5;
launcher.scale.set(0.005,0.005,0.005); */


scene.add(launcher);
} );


var moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);


//ambient light
//const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
//scene.add(ambientlight);

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


// launcher lights

var spot_light_1 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_1.castShadow = true;
spot_light_1.target.position.set(0,43,0);
spot_light_1.position.set(13.5,50,25);
scene.add(spot_light_1);
scene.add(spot_light_1.target);
spot_light_1.shadow.camera.zoom = 1;

var spot_light_2 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_2.castShadow = true;
spot_light_2.target.position.set(0,43,0);
spot_light_2.position.set(13.5,47,25);
scene.add(spot_light_2);
scene.add(spot_light_2.target);
spot_light_2.shadow.camera.zoom = 1;

var spot_light_3 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_3.castShadow = true;
spot_light_3.target.position.set(0,43,0);
spot_light_3.position.set(16.5,48,-14);
scene.add(spot_light_3);
scene.add(spot_light_3.target);
spot_light_3.shadow.camera.zoom = 1;

var spot_light_4 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_4.castShadow = true;
spot_light_4.target.position.set(0,43,0);
spot_light_4.position.set(-11,47,-14);
scene.add(spot_light_4);
scene.add(spot_light_4.target);
spot_light_4.shadow.camera.zoom = 1;

var spot_light_5 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_5.castShadow = true;
spot_light_5.target.position.set(0,43,0);
spot_light_5.position.set(-11,50,-14);
scene.add(spot_light_5);
scene.add(spot_light_5.target);
spot_light_5.shadow.camera.zoom = 1;

var spot_light_6 = new THREE.SpotLight(new THREE.Color(0xffffff),3);
spot_light_6.castShadow = true;
spot_light_6.target.position.set(0,43,0);
spot_light_6.position.set(-18,48,15);
scene.add(spot_light_6);
scene.add(spot_light_6.target);
spot_light_6.shadow.camera.zoom = 1;

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

camera.position.set(0,4,50)

var launcherPivot = new THREE.Object3D();
var cameraPivot = new THREE.Object3D()

const animate = () => {
    if (launcher) {
        //moon pivot
        moonPivot.rotation.y -= 0.005;
        moonPivot.rotation.x = 0.5;

        //camera pivot
        //launcher.add(cameraPivot);
        //cameraPivot.add(camera);
        
        //launcher pivot
        //earthMesh.add(launcherPivot);
        //launcherPivot.add(launcher);
        //launcherPivot.rotation.y -= 0.005;
        //launcherPivot.rotation.x = 0.5;
    }
    requestAnimationFrame(animate);
    cloud.rotation.y-=0.0002;
    //moon rotation

    //camerapivot
    //cameraPivot.rotation.y += 0.001;
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