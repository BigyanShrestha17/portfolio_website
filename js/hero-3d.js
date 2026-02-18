import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --------------------
// Scene
// --------------------
const scene = new THREE.Scene();
scene.background = null;

// --------------------
// Camera
// --------------------
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 5);

// --------------------
// --------------------
// Renderer (RIGHT SIDE)
// --------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 0.5, window.innerHeight);

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.right = '0';
renderer.domElement.style.width = '50vw';
renderer.domElement.style.height = '100vh';

// --------------------
// Visibility Toggle (MOBILE HIDE)
// --------------------
function handleVisibility() {
    if (window.innerWidth < 768) {
        renderer.domElement.style.display = 'none';
    } else {
        renderer.domElement.style.display = 'block';
    }
}

document.body.appendChild(renderer.domElement);
handleVisibility();

// --------------------
// Controls (FIXED ROTATION)
// --------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// 🔒 LOCK UP–DOWN ROTATION (IMPORTANT)
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

// --------------------
// Lights
// --------------------
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// --------------------
// Load Model
// --------------------
const loader = new GLTFLoader();
const loaderElement = document.getElementById('three-loader');
const progressBarFill = document.getElementById('progress-bar-fill');

loader.load(
    'model/bigyan_model.glb',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        const scaleFactor = 2.4 / size.y;
        model.scale.setScalar(scaleFactor);

        // Move model down (no navbar clash)
        model.position.y -= 0.8;

        // Hide loader
        if (loaderElement) {
            loaderElement.classList.add('hidden');
            setTimeout(() => {
                loaderElement.style.display = 'none';
            }, 500);
        }
    },
    (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
            const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
            const clampedPercent = Math.min(percentComplete, 100);
            if (progressBarFill) {
                progressBarFill.style.width = `${clampedPercent}%`;
            }
        }
    },
    (err) => {
        console.error(err);
        if (loaderElement) loaderElement.style.display = 'none';
    }
);

// --------------------
// Animate
// --------------------
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --------------------
// Resize
// --------------------
window.addEventListener('resize', () => {
    handleVisibility();
    if (window.innerWidth >= 768) {
        camera.aspect = (window.innerWidth * 0.5) / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.5, window.innerHeight);
    }
});
