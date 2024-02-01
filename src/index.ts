import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Create a scene
const scene: THREE.Scene = new THREE.Scene();

// Create a perspective camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 9;

var raycaster: THREE.Raycaster = new THREE.Raycaster();
var mouse: THREE.Vector2 = new THREE.Vector2();

// Create a WebGLRenderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

// Create a cube geometry
const cubeGeometry = new THREE.BoxGeometry();
const cubeWireFrame = new THREE.WireframeGeometry(cubeGeometry);

const cubeMaterial = new THREE.LineBasicMaterial({
	color: 0xffffff,
	transparent: true,
	opacity: 0.0,
	depthTest: false,
});

// Create a cube mesh with the custom shader material
const cube = new THREE.LineSegments(cubeWireFrame, cubeMaterial);

// Add the cube to the scene
scene.add(cube);

cube.position.x = -6;
cube.position.y = 0;
cube.position.z = 0;

// cylinder stats
const cylinder_stats = {
	radiusTop: 1,
	radiusBottom: 1,
	height: 1,
	radialSegments: 32,
};

// Create a cylinder geometry
const cylinderGeometry =
	new THREE.CylinderGeometry(
		cylinder_stats.radiusTop,
		cylinder_stats.radiusBottom,
		cylinder_stats.height,
		cylinder_stats.radialSegments);

// Create a shader material
const cylinderWireFrame = 
	new THREE.WireframeGeometry(cylinderGeometry);

const cylinderMaterial = new THREE.LineBasicMaterial({
	color: 0xffffff,
	transparent: true,
	opacity: 0.0,
	depthTest: false,
});

// Create a cylinder mesh with the custom shader material
const cylinder = new THREE.LineSegments(cylinderWireFrame, cylinderMaterial);

cylinder.position.x = 0;
cylinder.position.y = 0;
cylinder.position.z = 0;

// Add the cylinder to the scene
scene.add(cylinder);

// Create a sphere geometry
const sphereGeometry = new THREE.IcosahedronGeometry(0.5, 2);
const sphereWireFrame = 
	new THREE.WireframeGeometry(sphereGeometry);

const sphereMaterial = new THREE.LineBasicMaterial({
	color: 0xffffff,
	transparent: true,
	opacity: 0.0,
	depthTest: false,
});

// Create a sphere mesh with the custom shader material
const sphere = new THREE.LineSegments(sphereWireFrame, sphereMaterial);

sphere.position.x = 6;
sphere.position.y = 0;
sphere.position.z = 0;

// Add the sphere to the scene
scene.add(sphere);

var selectedObject: any;
var objSelected: boolean = false;
var cameraDir: THREE.Vector3 = new THREE.Vector3();

document.addEventListener("mousemove", function(event: MouseEvent) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

document.addEventListener("click", function(event: MouseEvent) {
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length > 0) {
		selectedObject = intersects[0].object;
		const cameraSpeed: number = 0.005;

		console.log("selected obj pos: ", selectedObject.position);
		console.log("camera old pos: ", camera.position);

		cameraDir.x = selectedObject.position.x - camera.position.x;
		cameraDir.y = selectedObject.position.y - camera.position.y;
		cameraDir.z = selectedObject.position.z - camera.position.z;

		objSelected = true;

		camera.lookAt(selectedObject.position);
	}
}, false);

// Handle window resize
window.addEventListener('resize', function () {
	const newWidth = window.innerWidth;
	const newHeight = window.innerHeight;

	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(newWidth, newHeight);
});

var lastTimestamp = 0;
// Animation loop
const animate = function (timestamp: number) {
	requestAnimationFrame(animate);

	// Rotate the cube
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.05;

	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.05;

	cylinder.rotation.x += 0.01;
	cylinder.rotation.y += 0.05;

	if (cube.material.opacity <= 1) {
		cube.material.opacity += 0.003;
	}

	if (cylinder.material.opacity <= 1) {
		cylinder.material.opacity += 0.003;
	}

	if (sphere.material.opacity <= 1) {
		sphere.material.opacity += 0.003;
	}

	if (cube.material.opacity == 1) {
		cube.material.depthTest = true;
		cube.material.transparent = false;
	}

	if (cylinder.material.opacity == 1) {
		cylinder.material.depthTest = true;
		cylinder.material.transparent = false;
	}

	if (sphere.material.opacity == 1) {
		sphere.material.depthTest = true;
		sphere.material.transparent = false;
	}

	var deltaTime: number = timestamp - lastTimestamp
	lastTimestamp = timestamp;

	if (objSelected == true) {
		const zoomSpeed: number = 0.0005;

		const distance = camera.position.distanceTo(selectedObject.position)
		console.log("distance ", distance);
		if (distance >= 1.5)
		{
			camera.position.x += deltaTime * zoomSpeed * cameraDir.x;
			camera.position.y += deltaTime * zoomSpeed * cameraDir.y;
			camera.position.z += deltaTime * zoomSpeed * cameraDir.z;
		} else {
			objSelected = false;
		}
	}


	// Render the scene with the camera's matrices
	renderer.render(scene, camera);
};

// Start the animation loop
requestAnimationFrame(animate);
