// Interactive 3D Cyber Core using Three.js
(function () {
  const container = document.getElementById('hero-3d-container');
  const canvas = document.getElementById('hero-three-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const initialW = container.clientWidth || 300;
  const initialH = container.clientHeight || 270;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    initialW / initialH,
    0.1,
    1000
  );
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(initialW, initialH, true);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x6366f1, 1.2);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xa855f7, 3.5, 50);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x38bdf8, 3, 50);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // Group for all core 3D objects with tuned scale for generous viewport clearance
  const coreGroup = new THREE.Group();
  coreGroup.scale.set(0.80, 0.80, 0.80);
  scene.add(coreGroup);

  // 1. Central Core - Glowing Dual Icosahedron (Faceted Solid + Wireframe)
  const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
  
  // Solid semi-transparent interior with reflections
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e1035,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.75,
    wireframe: false
  });
  const innerCore = new THREE.Mesh(coreGeo, coreMat);
  coreGroup.add(innerCore);

  // Glowing wireframe outer layer
  const wireGeo = new THREE.IcosahedronGeometry(1.62, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const wireCore = new THREE.Mesh(wireGeo, wireMat);
  coreGroup.add(wireCore);

  // 2. Orbiting Neon Tech Rings (Torus)
  const ring1Geo = new THREE.TorusGeometry(2.3, 0.035, 16, 100);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    emissive: 0x6366f1,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(2.7, 0.025, 16, 100);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  coreGroup.add(ring2);

  const ring3Geo = new THREE.TorusGeometry(3.1, 0.02, 16, 100);
  const ring3Mat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0xa855f7,
    emissiveIntensity: 1.0,
    roughness: 0.3
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.z = Math.PI / 5;
  coreGroup.add(ring3);

  // 3. Orbiting Data Satellite Nodes (Small glowing spheres on rings)
  const satelliteGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const satelliteMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const satelliteMat2 = new THREE.MeshBasicMaterial({ color: 0xc084fc });

  const sat1 = new THREE.Mesh(satelliteGeo, satelliteMat1);
  const sat2 = new THREE.Mesh(satelliteGeo, satelliteMat2);
  coreGroup.add(sat1);
  coreGroup.add(sat2);

  // 4. Floating Holographic Particle Cloud
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = 2.0 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePos[i * 3 + 2] = radius * Math.cos(phi);

    // Alternate indigo and purple hues
    const isPurple = Math.random() > 0.5;
    particleColors[i * 3] = isPurple ? 0.65 : 0.22;
    particleColors[i * 3 + 1] = isPurple ? 0.33 : 0.74;
    particleColors[i * 3 + 2] = isPurple ? 0.96 : 0.97;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.065,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  coreGroup.add(particleSystem);

  // Mouse Interaction & Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  function onMouseMove(event) {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    targetRotationY = (x / rect.width) * 0.8;
    targetRotationX = (y / rect.height) * 0.8;

    if (isDragging) {
      const deltaX = event.clientX - prevMouseX;
      const deltaY = event.clientY - prevMouseY;
      coreGroup.rotation.y += deltaX * 0.008;
      coreGroup.rotation.x += deltaY * 0.008;
      prevMouseX = event.clientX;
      prevMouseY = event.clientY;
    }
  }

  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support
  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
      targetRotationY = (x / rect.width) * 0.8;
      targetRotationX = (y / rect.height) * 0.8;
    }
  }, { passive: true });

  // Window Resize Handler with adaptive camera distance
  function handleResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width <= 0 || height <= 0) return;
    camera.aspect = width / height;
    
    // If container is taller than wide or narrower, back up camera to guarantee no clipping
    if (camera.aspect < 1.1) {
      camera.position.z = 10 / Math.min(camera.aspect, 1.0);
    } else {
      camera.position.z = 10;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height, true);
  }
  window.addEventListener('resize', handleResize);
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);
  }
  // Initial call to ensure proper bounds
  handleResize();

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Subtle autonomous rotations
    innerCore.rotation.x = elapsedTime * 0.2;
    innerCore.rotation.y = elapsedTime * 0.3;
    wireCore.rotation.x = -elapsedTime * 0.15;
    wireCore.rotation.y = elapsedTime * 0.25;

    ring1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.4) * 0.15;
    ring1.rotation.z = elapsedTime * 0.4;

    ring2.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.3) * 0.2;
    ring2.rotation.x = -Math.PI / 6 + elapsedTime * 0.35;

    ring3.rotation.z = elapsedTime * 0.25;
    ring3.rotation.x = Math.sin(elapsedTime * 0.5) * 0.25;

    // Orbiting satellites
    sat1.position.x = Math.cos(elapsedTime * 1.2) * 2.3;
    sat1.position.y = Math.sin(elapsedTime * 1.2) * 2.3 * Math.cos(Math.PI / 3);
    sat1.position.z = Math.sin(elapsedTime * 1.2) * 2.3 * Math.sin(Math.PI / 3);

    sat2.position.x = Math.cos(-elapsedTime * 1.0) * 2.7 * Math.cos(Math.PI / 4);
    sat2.position.y = Math.sin(-elapsedTime * 1.0) * 2.7;
    sat2.position.z = Math.cos(-elapsedTime * 1.0) * 2.7 * Math.sin(Math.PI / 4);

    particleSystem.rotation.y = -elapsedTime * 0.08;
    particleSystem.rotation.x = elapsedTime * 0.04;

    // Smooth lerp to mouse parallax
    if (!isDragging) {
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;
    }

    // Floating vertical oscillation
    coreGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.18;

    renderer.render(scene, camera);
  }

  animate();
})();
