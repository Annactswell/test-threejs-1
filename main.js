import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#scene'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 创建纪念币
const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 64);
const textureLoader = new THREE.TextureLoader();
const coinTexture = textureLoader.load('https://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1305/16/c4/20990657_1368686545122.jpg');
const coinMaterial = new THREE.MeshStandardMaterial({
  map: coinTexture,
  metalness: 0.8,
  roughness: 0.2,
  side: THREE.DoubleSide
});
const coin = new THREE.Mesh(coinGeometry, coinMaterial);
scene.add(coin);

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 处理窗口大小变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  coin.rotation.y += 0.002;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
