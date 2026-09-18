import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from './SoundController';
import { Disc, Sparkles, Orbit, Layers, Compass, Zap, Eye } from 'lucide-react';

export default function InteractivePlayground() {
  const mountRef = useRef(null);
  // Default to Star Ribbon Knot (User's absolute favorite)
  const [currentShape, setCurrentShape] = useState('starKnot');
  const [materialPreset, setMaterialPreset] = useState('prism'); // Neon Cyber
  const [wireframe, setWireframe] = useState(false);
  const [speed, setSpeed] = useState(1.4);

  const sceneRef = useRef(null);
  const meshGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const explodedRef = useRef(false);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // 5 Hypnotic, High-Density Manifold Sculptures (Every single one has the Star Knot's glorious volume & wireframe!)
  const createIntricateGeometry = (type) => {
    switch (type) {
      case 'starKnot':
        // Star Ribbon Knot (User's proven favorite!)
        return new THREE.TorusKnotGeometry(1.0, 0.28, 160, 24, 3, 5);
      case 'celestialTrefoil':
        // Triple-Loop Intertwined Celestial Knot
        return new THREE.TorusKnotGeometry(1.05, 0.26, 180, 28, 2, 3);
      case 'cinquefoil':
        // 5-Petal Celtic Infinity Ribbon
        return new THREE.TorusKnotGeometry(1.0, 0.22, 200, 28, 5, 2);
      case 'septagramHelix':
        // 7-Fold Cosmic Spiral Ribbon
        return new THREE.TorusKnotGeometry(1.15, 0.20, 220, 28, 7, 3);
      case 'quantumGeodesic':
        // Dense Geodesic Tensor Lattice
        return new THREE.IcosahedronGeometry(1.3, 2);
      default:
        return new THREE.TorusKnotGeometry(1.0, 0.28, 160, 24, 3, 5);
    }
  };

  // Custom Neon Cyber Facet Shader
  const getFacetedMaterial = (preset, isWireframe) => {
    let baseColor, accentColor, specularColor;

    if (preset === 'prism') {
      // NEON CYBER (User's Favorite!)
      baseColor = new THREE.Color('#0d0520');
      accentColor = new THREE.Color('#00e5ff');
      specularColor = new THREE.Color('#ff00aa');
    } else if (preset === 'emerald') {
      baseColor = new THREE.Color('#021a12');
      accentColor = new THREE.Color('#00ff88');
      specularColor = new THREE.Color('#00e5ff');
    } else if (preset === 'chrome') {
      baseColor = new THREE.Color('#0f1118');
      accentColor = new THREE.Color('#e2e8f0');
      specularColor = new THREE.Color('#ffffff');
    } else {
      // gold
      baseColor = new THREE.Color('#251302');
      accentColor = new THREE.Color('#f59e0b');
      specularColor = new THREE.Color('#fef08a');
    }

    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 uBaseColor;
      uniform vec3 uAccentColor;
      uniform vec3 uSpecularColor;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vec3 fdx = dFdx(vWorldPosition);
        vec3 fdy = dFdy(vWorldPosition);
        vec3 faceNormal = normalize(cross(fdx, fdy));
        vec3 viewDir = normalize(vViewPosition);

        vec3 light1 = normalize(vec3(1.6, 2.0, 2.2));
        vec3 light2 = normalize(vec3(-2.2, -1.2, 1.8));
        vec3 light3 = normalize(vec3(0.0, 3.5, -2.5));

        float diff1 = max(dot(faceNormal, light1), 0.0);
        float diff2 = max(dot(faceNormal, light2), 0.0);
        float diff3 = max(dot(faceNormal, light3), 0.0);

        vec3 half1 = normalize(light1 + viewDir);
        float spec1 = pow(max(dot(faceNormal, half1), 0.0), 36.0);
        float fresnel = pow(1.0 - max(dot(faceNormal, viewDir), 0.0), 2.4);

        vec3 color = uBaseColor;
        color += diff1 * uAccentColor * 0.95;
        color += diff2 * uSpecularColor * 0.55;
        color += diff3 * vec3(0.1, 0.3, 0.4) * 0.3;
        color += spec1 * uSpecularColor * 1.6;
        color += fresnel * uAccentColor * 1.4;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBaseColor: { value: baseColor },
        uAccentColor: { value: accentColor },
        uSpecularColor: { value: specularColor },
      },
      wireframe: isWireframe,
      side: THREE.DoubleSide,
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.x = 0.5;
    group.rotation.y = 0.7;
    scene.add(group);
    meshGroupRef.current = group;

    // Build Initial Shape: Star Ribbon Knot (User's Favorite)
    const geometry = createIntricateGeometry('starKnot');
    const material = getFacetedMaterial('prism', false);
    const mainMesh = new THREE.Mesh(geometry, material);
    group.add(mainMesh);

    // Glowing Wireframe Edge Accent
    const wireGeo = new THREE.WireframeGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.55,
      linewidth: 1.2,
    });
    const wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireframeMesh);

    // Orbiting 800 Nano Shards
    const shardCount = 800;
    const shardGeo = new THREE.BufferGeometry();
    const shardPos = new Float32Array(shardCount * 3);
    const origShardPos = new Float32Array(shardCount * 3);

    for (let i = 0; i < shardCount; i++) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.0;

      shardPos[i * 3] = Math.cos(theta) * radius;
      shardPos[i * 3 + 1] = y;
      shardPos[i * 3 + 2] = Math.sin(theta) * radius;

      origShardPos[i * 3] = shardPos[i * 3];
      origShardPos[i * 3 + 1] = shardPos[i * 3 + 1];
      origShardPos[i * 3 + 2] = shardPos[i * 3 + 2];
    }

    shardGeo.setAttribute('position', new THREE.BufferAttribute(shardPos, 3));
    const shardMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const shardParticles = new THREE.Points(shardGeo, shardMat);
    scene.add(shardParticles);
    particlesRef.current = { points: shardParticles, original: origShardPos };

    // Mouse Drag Rotation
    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotVelocity = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isMouseDown = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isMouseDown || !meshGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rotVelocity.y = deltaX * 0.007;
      rotVelocity.x = deltaY * 0.007;

      meshGroupRef.current.rotation.y += rotVelocity.y;
      meshGroupRef.current.rotation.x += rotVelocity.x;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId;
    const clock = new THREE.Clock();

    const render = () => {
      const time = clock.getElapsedTime();
      const spd = speedRef.current;

      if (meshGroupRef.current) {
        meshGroupRef.current.rotation.y += 0.01 * spd;
        meshGroupRef.current.rotation.x += 0.006 * spd;

        if (!isMouseDown) {
          rotVelocity.x *= 0.95;
          rotVelocity.y *= 0.95;
          meshGroupRef.current.rotation.x += rotVelocity.x;
          meshGroupRef.current.rotation.y += rotVelocity.y;
        }
      }

      if (shardParticles) {
        shardParticles.rotation.y = -time * 0.08 * spd;
        shardParticles.rotation.x = Math.sin(time * 0.4) * 0.15;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Geometry cleanly
  const handleShapeChange = (shapeKey) => {
    sound.playSweep();
    setCurrentShape(shapeKey);
    if (!meshGroupRef.current) return;

    const group = meshGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      group.remove(child);
    }

    const newGeo = createIntricateGeometry(shapeKey);
    const newMat = getFacetedMaterial(materialPreset, wireframe);
    const newMesh = new THREE.Mesh(newGeo, newMat);
    group.add(newMesh);

    // Add wireframe accent overlay
    const newWireGeo = new THREE.WireframeGeometry(newGeo);
    const newWireMat = new THREE.LineBasicMaterial({
      color: materialPreset === 'prism' ? 0x00e5ff : materialPreset === 'emerald' ? 0x00ff88 : 0xffffff,
      transparent: true,
      opacity: 0.55,
      linewidth: 1.2,
    });
    const newWireMesh = new THREE.LineSegments(newWireGeo, newWireMat);
    group.add(newWireMesh);
  };

  // Update Material
  const handleMaterialChange = (presetKey) => {
    sound.playClick();
    setMaterialPreset(presetKey);
    if (!meshGroupRef.current || meshGroupRef.current.children.length === 0) return;

    const mainMesh = meshGroupRef.current.children[0];
    if (mainMesh) {
      mainMesh.material.dispose();
      mainMesh.material = getFacetedMaterial(presetKey, wireframe);
    }
  };

  // Toggle Wireframe
  const toggleWireframe = () => {
    sound.playClick();
    const next = !wireframe;
    setWireframe(next);
    if (!meshGroupRef.current || meshGroupRef.current.children.length === 0) return;
    const mainMesh = meshGroupRef.current.children[0];
    if (mainMesh) {
      mainMesh.material.wireframe = next;
    }
  };

  // Disperse Particle Shards
  const triggerExplosion = () => {
    sound.playShockwave();
    if (!particlesRef.current) return;
    const { points, original } = particlesRef.current;
    const pos = points.geometry.attributes.position.array;

    explodedRef.current = !explodedRef.current;

    for (let i = 0; i < pos.length; i += 3) {
      if (explodedRef.current) {
        pos[i] = original[i] * (2.4 + Math.random() * 2.8);
        pos[i + 1] = original[i + 1] * (2.4 + Math.random() * 2.8);
        pos[i + 2] = original[i + 2] * (2.4 + Math.random() * 2.8);
      } else {
        pos[i] = original[i];
        pos[i + 1] = original[i + 1];
        pos[i + 2] = original[i + 2];
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
  };

  // 5 Proven, Hypnotic Manifold Geometries
  const shapes = [
    { id: 'starKnot', label: 'STAR RIBBON KNOT', icon: Disc },
    { id: 'celestialTrefoil', label: 'CELESTIAL TREFOIL', icon: Orbit },
    { id: 'cinquefoil', label: 'CINQUEFOIL INFINITY', icon: Sparkles },
    { id: 'septagramHelix', label: 'SEPTAGRAM SPIRAL', icon: Layers },
    { id: 'quantumGeodesic', label: 'QUANTUM GEODESIC', icon: Compass },
  ];

  const presets = [
    { id: 'prism', label: 'NEON CYBER', color: '#00e5ff' },
    { id: 'emerald', label: 'EMERALD PRISM', color: '#00ff88' },
    { id: 'chrome', label: 'LIQUID CHROME', color: '#ffffff' },
    { id: 'gold', label: 'MOLTEN GOLD', color: '#f59e0b' },
  ];

  return (
    <section id="labs" className="relative py-32 bg-[#060608] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] tracking-widest mb-3 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
              <span>LUSION LABS // 3D KINETIC SCULPTOR</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
              HYPER-FACETED 3D LAB
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-zinc-300 text-sm max-w-md font-sans leading-relaxed">
            Drag to rotate and inspect dense topological ribbon knots and geodesic manifolds. Every shape is an intricate continuous mathematical sculpture with neon cyber wireframe accents.
          </p>
        </div>

        {/* 3D Viewport with Glass GUI HUD */}
        <div className="relative w-full h-[640px] rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-b from-black via-zinc-950 to-black shadow-2xl backdrop-blur-md">
          {/* WebGL Canvas */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top Left: 5 Hypnotic Knot & Manifold Sculptures */}
          <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2 bg-black/85 backdrop-blur-2xl border border-white/20 p-2 rounded-2xl max-w-2xl shadow-xl">
            {shapes.map((s) => {
              const Icon = s.icon;
              const isSel = currentShape === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleShapeChange(s.id)}
                  onMouseEnter={() => sound.playHover()}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isSel
                      ? 'bg-[#00ff88] text-black font-extrabold shadow-[0_0_25px_rgba(0,255,136,0.7)] scale-105'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Top Right: Disperse Action */}
          <div className="absolute top-6 right-6">
            <button
              onClick={triggerExplosion}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center space-x-2 bg-white/10 hover:bg-[#00ff88] hover:text-black transition-colors backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>DISPERSE FIELD</span>
            </button>
          </div>

          {/* Bottom HUD */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-black/85 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl">
            {/* Speed & Wireframe */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-zinc-400">ROTATION SPEED:</span>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.2"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-24 accent-[#00ff88] bg-zinc-700 rounded h-1 cursor-pointer"
                />
                <span className="text-[#00ff88] font-bold w-8">{speed.toFixed(1)}x</span>
              </div>

              <button
                onClick={toggleWireframe}
                onMouseEnter={() => sound.playHover()}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                  wireframe
                    ? 'border-[#00ff88] text-black bg-[#00ff88] font-bold shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                    : 'border-white/15 text-zinc-300 hover:text-white bg-white/5'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>WIREFRAME</span>
              </button>
            </div>

            {/* Material Presets */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-zinc-400 mr-1 hidden sm:inline">
                SHADING:
              </span>
              {presets.map((p) => {
                const isSel = materialPreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleMaterialChange(p.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                      isSel
                        ? 'bg-white text-black font-extrabold border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        : 'border-white/15 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
