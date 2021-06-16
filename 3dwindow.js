// Generates an interactive 3D view and loads a mesh

import * as THREE from './three.js/build/three.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from './three.js/examples/jsm/loaders/OBJLoader.js';
// import { GUI } from './three.js/examples/jsm/libs/dat.gui.module.js';
// import { Lut } from './three.js/examples/jsm/math/Lut.js';


let scene, camera, renderer;

// initializes the scene
function init() {

  // create a scene in the threejsCanvas html object
  const canvas = document.querySelector('#threejsCanvas');
  // var ctx = canvas.getContext('2d');
  // var text='w3resource'; 
  // ctx.font = "24px Unknown Font, sans-serif";  
  // ctx.fillText(text, 120, 40);


  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xffffff);
  scene.background = new THREE.Color("rgb(33, 37, 41)");


  // create a renderer
  renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  // renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setSize(canvas.clientWidth,canvas.clientHeight);
  document.body.appendChild(renderer.domElement);


  // create a camera
  camera = new THREE.PerspectiveCamera(40,canvas.clientWidth/canvas.clientHeight,1,5000);
  camera.position.set(-200,200,200)
  camera.lookAt(0,0,0)


  // create user controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update()


  // add lighting
  const ambientLight = new THREE.AmbientLight( 0xffffff );
  scene.add( ambientLight );

  const light1 = new THREE.PointLight( 0xffffff, 1, 0 );
  light1.position.set( 0, 200, 0 );
  scene.add( light1 );

  const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
  light2.position.set( 100, 200, 100 );
  scene.add( light2 );

  const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
  light3.position.set( - 100, - 200, - 100 );
  scene.add( light3 );
}

export function loadMeshFile(modelId){
  // clear the current mesh
  var selectedObject = scene.getObjectByName('BRACKETMESH');
  scene.remove(selectedObject);

  // get the new mesh file to be loaded
  var meshFileName = 'data/meshes/'+modelId+'.obj'
  console.log(meshFileName)

  const material = new THREE.MeshStandardMaterial({
    color: 0xebebeb, 
    roughness: 1.0,
    metalness: 1.0,
    wireframe: false
  });

  let loader = new OBJLoader();
  loader.load(meshFileName, function(obj){
    const bracket = obj.children[0]

    bracket.geometry.center();
    bracket.rotation.set(3*3.141592/2,0,0)

    bracket.material = material
    bracket.name = 'BRACKETMESH'
    scene.add(bracket);
    animate();
  });
}

// redraw window during interaction
function animate() {
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

// initialize the scene
init();