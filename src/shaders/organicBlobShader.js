// Enhanced GLSL Shaders for Lusion Experience
// With explosive click shockwaves, dynamic audio pulse, chromatic dispersion, and high-frequency fluid displacement

export const blobVertexShader = `
  uniform float uTime;
  uniform float uDistortion;
  uniform float uFrequency;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uShockwave;     // Shockwave ripple strength
  uniform float uShockwaveTime; // Shockwave propagation phase
  uniform float uTurbulence;    // Additional kinetic energy

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDisplacement;
  varying vec3 vViewPosition;

  // Simplex 3D noise functions
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float getDisplacement(vec3 p) {
    // Multi-octave turbulence
    float speed = 0.6 + uTurbulence * 0.8;
    float noise1 = snoise(p * uFrequency + vec3(uTime * speed * 0.45, uTime * speed * 0.35, uTime * speed * 0.25));
    float noise2 = snoise(p * (uFrequency * 2.3) - vec3(uTime * speed * 0.4, uTime * speed * 0.5, 0.0)) * 0.5;
    float noise3 = snoise(p * (uFrequency * 4.0) + vec3(0.0, uTime * speed * 0.6, uTime * speed * 0.3)) * 0.25;

    // Mouse proximity pull
    vec2 screenCoord = p.xy / 2.5;
    float mouseDist = length(screenCoord - uMouse);
    float mouseWave = sin(mouseDist * 14.0 - uTime * 6.0) * exp(-mouseDist * 2.2) * uMouseStrength;

    // Explosive Click Shockwave Ring
    float radius = length(p);
    float shockDist = abs(radius - (uShockwaveTime * 2.8));
    float shockwaveWave = sin(shockDist * 16.0) * exp(-shockDist * 3.5) * uShockwave;

    return (noise1 + noise2 + noise3) * (uDistortion + uTurbulence * 0.4) + mouseWave + shockwaveWave;
  }

  void main() {
    vUv = uv;
    
    float d = getDisplacement(position);
    vDisplacement = d;
    vec3 displacedPosition = position + normal * d;

    // Finite difference normal recalculation
    float offset = 0.015;
    vec3 tangent1 = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
    if (length(tangent1) < 0.1) tangent1 = normalize(cross(normal, vec3(1.0, 0.0, 0.0)));
    vec3 tangent2 = normalize(cross(normal, tangent1));

    vec3 p1 = (position + tangent1 * offset) + normal * getDisplacement(position + tangent1 * offset);
    vec3 p2 = (position + tangent2 * offset) + normal * getDisplacement(position + tangent2 * offset);

    vec3 newNormal = normalize(cross(p1 - displacedPosition, p2 - displacedPosition));
    if (dot(newNormal, normal) < 0.0) newNormal = -newNormal;

    vNormal = normalize(normalMatrix * newNormal);
    vPosition = displacedPosition;

    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const blobFragmentShader = `
  uniform float uTime;
  uniform int uMode; // 0: Chrome, 1: Iridescent, 2: Neural, 3: Bioluminescent, 4: Molten Gold, 5: Supernova
  uniform float uShockwave;
  uniform vec3 uAccentColor;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDisplacement;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    float fresnel = clamp(1.0 - dot(normal, viewDir), 0.0, 1.0);
    float fresnelPower = pow(fresnel, 2.5);

    vec3 lightDir1 = normalize(vec3(1.4, 1.8, 2.2));
    vec3 lightDir2 = normalize(vec3(-1.8, -1.2, 1.6));

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);

    vec3 halfVec1 = normalize(lightDir1 + viewDir);
    float spec1 = pow(max(dot(normal, halfVec1), 0.0), 40.0);

    vec3 color = vec3(0.0);

    if (uMode == 0) {
      // LIQUID CHROME / LIQUID MERCURY
      vec3 baseChrome = vec3(0.08, 0.08, 0.1);
      vec3 chromeHighlight = vec3(0.95, 0.98, 1.0);
      vec3 electricGreen = vec3(0.0, 1.0, 0.53);

      color = baseChrome + (diff1 * 0.45 + diff2 * 0.3) * chromeHighlight;
      color += spec1 * vec3(1.4);
      color += pow(fresnel, 3.0) * mix(chromeHighlight, electricGreen, 0.5) * 1.8;
      color += sin(vDisplacement * 18.0 + uTime * 3.0) * 0.06;
    }
    else if (uMode == 1) {
      // IRIDESCENT PRISM / SILK DISPERSION
      float angle = dot(normal, viewDir);
      vec3 iridColor;
      iridColor.r = sin(angle * 5.0 + vDisplacement * 7.0 + 0.0) * 0.5 + 0.5;
      iridColor.g = sin(angle * 5.0 + vDisplacement * 7.0 + 2.0) * 0.5 + 0.5;
      iridColor.b = sin(angle * 5.0 + vDisplacement * 7.0 + 4.0) * 0.5 + 0.5;

      color = mix(vec3(0.03, 0.03, 0.05), iridColor, 0.9);
      color += fresnelPower * vec3(1.0, 0.9, 1.0) * 1.5;
      color += spec1 * vec3(1.2);
    }
    else if (uMode == 2) {
      // NEURAL MATRIX / CYBER CORE
      float gridX = abs(fract(vUv.x * 32.0) - 0.5);
      float gridY = abs(fract(vUv.y * 32.0) - 0.5);
      float line = smoothstep(0.05, 0.01, min(gridX, gridY));

      vec3 coreDark = vec3(0.01, 0.01, 0.03);
      vec3 neonGrid = vec3(0.0, 1.0, 0.55);
      vec3 neonPulse = vec3(0.0, 0.85, 1.0);

      float pulse = sin(vPosition.y * 5.0 - uTime * 4.0) * 0.5 + 0.5;
      color = coreDark + line * mix(neonGrid, neonPulse, pulse) * 2.8;
      color += fresnelPower * neonGrid * 1.2;
      color += spec1 * vec3(0.6);
    }
    else if (uMode == 3) {
      // BIOLUMINESCENT DARK MATTER (The User's Favorite!)
      vec3 deepObsidian = vec3(0.02, 0.02, 0.04);
      vec3 bioMagenta = vec3(1.0, 0.05, 0.55);
      vec3 bioCyan = vec3(0.0, 0.95, 1.0);

      float vein = sin(vDisplacement * 22.0 + uTime * 2.2);
      vein = smoothstep(0.6, 0.96, vein);

      color = deepObsidian + diff1 * 0.15;
      color += vein * bioMagenta * 3.2;
      color += fresnelPower * bioCyan * 2.2;
      color += spec1 * vec3(1.0, 1.0, 1.2);
    }
    else if (uMode == 4) {
      // MOLTEN GOLD / CHRONO LIQUID
      vec3 darkGold = vec3(0.2, 0.12, 0.02);
      vec3 richGold = vec3(1.0, 0.75, 0.15);
      vec3 whiteHot = vec3(1.0, 0.95, 0.8);

      color = darkGold + diff1 * richGold * 0.8;
      color += spec1 * whiteHot * 1.8;
      color += fresnelPower * richGold * 1.5;
    }
    else {
      // SUPERNOVA EXPLOSION
      vec3 plasmaRed = vec3(1.0, 0.2, 0.1);
      vec3 plasmaYellow = vec3(1.0, 0.9, 0.2);
      vec3 plasmaViolet = vec3(0.8, 0.1, 1.0);

      float noiseBand = sin(vDisplacement * 30.0 - uTime * 6.0) * 0.5 + 0.5;
      color = mix(plasmaRed, plasmaYellow, noiseBand) * 2.0;
      color += fresnelPower * plasmaViolet * 2.5;
      color += spec1 * vec3(2.0);
    }

    // Add shockwave impact flash
    if (uShockwave > 0.01) {
      color += vec3(0.2, 0.9, 1.0) * uShockwave * 0.8;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;
