// 导入必要的Three.js模块
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#scene'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 创建纪念币几何体
const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 64);
// 加载纹理
const textureLoader = new THREE.TextureLoader();
const coinTexture = textureLoader.load('image.jpg');
// 创建纪念币材质
const coinMaterial = new THREE.MeshStandardMaterial({
  map: coinTexture,        // 纹理贴图，使用加载的纪念币纹理
  metalness: 0.3,          // 金属度，0.8表示较高的金属感
  roughness: 0.2,          // 粗糙度，0.2表示较光滑的表面
  side: THREE.DoubleSide   // 双面渲染，使纪念币的正反面都可见
});
// 创建纪念币网格
const coin = new THREE.Mesh(coinGeometry, coinMaterial);
scene.add(coin);

// 添加平行光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 创建粒子系统几何体
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);

// 随机生成粒子位置和颜色
for (let i = 0; i < particlesCount * 3; i += 3) {
  posArray[i] = (Math.random() - 0.5) * 10;
  posArray[i + 1] = (Math.random() - 0.5) * 10;
  posArray[i + 2] = (Math.random() - 0.5) * 10;
  
  colorArray[i] = Math.random();
  colorArray[i + 1] = Math.random();
  colorArray[i + 2] = Math.random();
}

// 设置粒子位置和颜色属性
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

// 创建粒子材质
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

// 创建粒子系统
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 处理窗口大小变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 动画循环函数
function animate() {
  requestAnimationFrame(animate);
  
  // 旋转纪念币
  coin.rotation.y += 0.002;
  
  // 更新粒子位置
  const positions = particlesMesh.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += 0.01;
    if (positions[i + 1] > 5) positions[i + 1] = -5;
  }
  particlesMesh.geometry.attributes.position.needsUpdate = true;
  
  // 旋转粒子系统
  particlesMesh.rotation.y += 0.001;
  
  // 更新控制器
  controls.update();
  // 渲染场景
  renderer.render(scene, camera);
}

// 开始动画循环
animate();
