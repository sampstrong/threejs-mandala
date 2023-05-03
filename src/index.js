import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

// ------ window ------

// canvas
const canvas = document.querySelector('canvas.threejs');

// viewport
const viewport = {
	width: window.innerWidth,
	height: window.innerHeight
};
viewport.viewAspect = viewport.width / viewport.height;

// ------ scene ------

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, viewport.viewAspect, 0.1, 100);
camera.position.set(0, 0, 8);
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});
renderer.setSize(viewport.width, viewport.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ------ update window size ------

window.addEventListener('resize', () => {
	viewport.width = window.innerWidth;
	viewport.height = window.innerHeight;
	viewport.viewAspect = viewport.width / viewport.height;

	camera.aspect = viewport.viewAspect;
	camera.updateProjectionMatrix();

	renderer.setSize(viewport.width, viewport.height);
	renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

// ------ controls ------

const gui = new GUI();

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ------ scene objects ------

// shader
const shaderMaterial = new THREE.ShaderMaterial({
	vertexShader: document.getElementById('vertex-shader').text,
	fragmentShader: document.getElementById('fragment-shader').text,
	uniforms: {
		uTime: { value: 0 }
	}
});

// objects
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10, 300, 300),
	shaderMaterial
);
scene.add(plane);

// lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.7);
directionalLight.position.set(1, 2, 1.5);
scene.add(ambientLight, directionalLight);

// ------ update ------

const clock = new THREE.Clock();
let previousElapsedTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousElapsedTime;
	previousElapsedTime = elapsedTime;

	// update shader uniforms
	shaderMaterial.uniforms.uTime.value = elapsedTime;

	// update controls
	controls.update();

	// render
	renderer.render(scene, camera);

	// call on tick on next frame
	window.requestAnimationFrame(tick);
};

tick();
