import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const canvas = document.querySelector('canvas.appCanvas');
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 50);
camera.position.set(0,26,6);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const controls = new OrbitControls(camera, canvas);
controls.target.set(0,26,0);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.maxDistance = 7;
controls.minDistance = 4;
controls.panSpeed = 0.8;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: '',
  RIGHT: THREE.MOUSE.PAN
}
controls.touches = {
	ONE: THREE.TOUCH.PAN,
	TWO: ''
}

updateZoom();

const tick = () => {
  if(controls.target.x < -1.5){
    controls.target.x = -1.5;
    camera.position.x = -1.5;
  }
  if(controls.target.x > 1.5){
    controls.target.x = 1.5;
    camera.position.x = 1.5;
  }
  if(controls.target.y < 0){
    controls.target.y = 0;
    camera.position.y = 0;
  }
  if(controls.target.y > 27){
    controls.target.y = 27;
    camera.position.y = 27;
  }
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();

/**
 * 
 * 
 * 
 * 
 */

const loadingManager = new THREE.LoadingManager(
  //loaded
  () => {
  },
  //progress
  (itemURL, itemsLoaded, itemsTotal) => {
    // const progressRatio = itemsLoaded / itemsTotal;
    // console.log(progressRatio * 100 +  ' / 100');
  },
  //error
  () => {
    console.log(urlError);
  }
);


const gridHelper = new THREE.GridHelper(10,10);
scene.add(gridHelper);

const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath('/draco/');
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

const textureLoader = new THREE.TextureLoader(loadingManager);

const matcap01 = textureLoader.load('./textures/4F4742_B7B1AA_847E79_969294.jpg');
const matcap02 = textureLoader.load('./textures/7877EE_D87FC5_75D9C7_1C78C0.jpg');
const matcap03 = textureLoader.load('./textures/3F4441_D1D7D6_888F87_A2ADA1.jpg');
const matcap04 = textureLoader.load('./textures/313131_BBBBBB_878787_A3A4A4.jpg');
const matcap05 = textureLoader.load('./textures/AE9D99_29303B_585F70_875C33.jpg');
const matcap06 = textureLoader.load('./textures/422A1E_716767_685D59_5E4F4A.jpg');
const matcap07 = textureLoader.load('./textures/4B362C_715A4F_211913_644C44.jpg');

const matcap_01 = new THREE.MeshMatcapMaterial({matcap: matcap01});
const matcap_02 = new THREE.MeshMatcapMaterial({matcap: matcap02});
const matcap_03 = new THREE.MeshMatcapMaterial({matcap: matcap03});
const matcap_04 = new THREE.MeshMatcapMaterial({matcap: matcap04});
const matcap_05 = new THREE.MeshMatcapMaterial({matcap: matcap05});
const matcap_06 = new THREE.MeshMatcapMaterial({matcap: matcap06});
const matcap_07 = new THREE.MeshMatcapMaterial({matcap: matcap07});

const tex_icons = textureLoader.load('./textures/icons.png');
tex_icons.flipY = false;
const tex_text = textureLoader.load('./textures/signs.png');
tex_text.flipY = false;
const tex_red = textureLoader.load('./textures/red.png');
tex_red.flipY = false;
const tex_wip = textureLoader.load('./textures/wip.png');
tex_wip.flipY = false;

const mat_icons = new THREE.MeshBasicMaterial({map: tex_icons, transparent: true});
const mat_text = new THREE.MeshBasicMaterial({map: tex_text, transparent: true});
const mat_red = new THREE.MeshBasicMaterial({map: tex_red, transparent: true});
const mat_wip = new THREE.MeshBasicMaterial({map: tex_wip, transparent: true});

gltfLoader.load('./models/wall.glb', (gltf) => {
  gltf.scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.name == 'wall') {
        obj.material = matcap_01;
      }
    }
  });
  gltf.scene.rotation.y = Math.PI / -2;
  gltf.scene.scale.set(0.5,0.5,0.5);
  scene.add(gltf.scene);
});

gltfLoader.load('./models/inWall.glb', (gltf) => {
  gltf.scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      switch (obj.name) {
        case 'chain':
          obj.material = matcap_03;
          break;
        case 'icons':
          obj.material = mat_icons;
          break;
        case 'mc_01':
          obj.material = matcap_02;
          break;
        case 'mc_02':
          obj.material = matcap_04;
          break;
        case 'mc_sign':
          obj.material = matcap_05;
          break;
        case 'text':
          obj.material = mat_text;
          break;
        case 'mc_wood_01':
          obj.material = matcap_06;
          break;
        case 'mc_wood_02':
          obj.material = matcap_07;
          break;
        case 'red':
          obj.material = mat_red;
          break;
        case 'wip':
          obj.material = mat_wip;
          break;
      }
    }
  });
  gltf.scene.rotation.y = Math.PI / -2;
  gltf.scene.scale.set(0.5,0.5,0.5);
  scene.add(gltf.scene);
});

// window.addEventListener('wheel', (event)=>{
//   console.log(event);
// });

function updateZoom() {
  const ar = sizes.width / sizes.height;
  if(ar < 1){
    controls.maxDistance = 6 / ar;
    controls.target.set(0, 26 - (6 * ar), 0);
    camera.position.z = 6 / ar;
    camera.position.y = 26 - (6 * ar);
  }
}