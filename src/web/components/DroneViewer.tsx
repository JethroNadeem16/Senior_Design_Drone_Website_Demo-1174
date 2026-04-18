import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Part label data ───────────────────────────────────────────────────────────
const PART_LABELS: Record<string, { title: string; specs: string[] }> = {
  arm_fl: {
    title: "Front-Left Arm",
    specs: ["Material: Carbon Fiber", "Length: ~110mm", "Thickness: 4mm", "Integrated motor mount"],
  },
  arm_fr: {
    title: "Front-Right Arm",
    specs: ["Material: Carbon Fiber", "Length: ~110mm", "Thickness: 4mm", "Integrated motor mount"],
  },
  arm_rl: {
    title: "Rear-Left Arm",
    specs: ["Material: Carbon Fiber", "Length: ~110mm", "Thickness: 4mm", "Counter-rotating motor"],
  },
  arm_rr: {
    title: "Rear-Right Arm",
    specs: ["Material: Carbon Fiber", "Length: ~110mm", "Thickness: 4mm", "Counter-rotating motor"],
  },
  top_plate: {
    title: "Top Plate",
    specs: ["Material: Carbon Fiber", "Thickness: 1.5mm", "Houses: FC, ESCs, receiver", "QAV250 signature X-layout"],
  },
  bottom_plate: {
    title: "Bottom Plate",
    specs: ["Material: Carbon Fiber", "Thickness: 2mm", "Battery mount underneath", "PDB integration"],
  },
  pixhawk: {
    title: "Pixhawk 6C Mini",
    specs: ["MCU: STM32H753 @ 480MHz", "IMU: ICM-42688-P × 2", "Barometer: ICP-20100", "Size: 38.8 × 38.8mm"],
  },
  motor_fl: {
    title: "Motor FL (CW)",
    specs: ["Type: BLDC Brushless", "KV: ~2300–2700", "Protocol: DSHOT600", "Rotation: Clockwise"],
  },
  motor_fr: {
    title: "Motor FR (CCW)",
    specs: ["Type: BLDC Brushless", "KV: ~2300–2700", "Protocol: DSHOT600", "Rotation: Counter-CW"],
  },
  motor_rl: {
    title: "Motor RL (CCW)",
    specs: ["Type: BLDC Brushless", "KV: ~2300–2700", "Protocol: DSHOT600", "Rotation: Counter-CW"],
  },
  motor_rr: {
    title: "Motor RR (CW)",
    specs: ["Type: BLDC Brushless", "KV: ~2300–2700", "Protocol: DSHOT600", "Rotation: Clockwise"],
  },
  prop_fl: {
    title: "Propeller FL",
    specs: ['Size: 5" (5045)', "Pitch: 4.5\"", "Material: PC/Nylon", "Rotation: Clockwise"],
  },
  prop_fr: {
    title: "Propeller FR",
    specs: ['Size: 5" (5045)', "Pitch: 4.5\"", "Material: PC/Nylon", "Rotation: Counter-CW"],
  },
  prop_rl: {
    title: "Propeller RL",
    specs: ['Size: 5" (5045)', "Pitch: 4.5\"", "Material: PC/Nylon", "Rotation: Counter-CW"],
  },
  prop_rr: {
    title: "Propeller RR",
    specs: ['Size: 5" (5045)', "Pitch: 4.5\"", "Material: PC/Nylon", "Rotation: Clockwise"],
  },
  battery: {
    title: "LiPo Battery",
    specs: ["Cell count: 4S", "Voltage: 14.8V nominal", "Capacity: 1300–1500mAh", "Mount: bottom velcro strap"],
  },
  gps: {
    title: "GPS Module",
    specs: ["Chipset: u-blox M10", "Accuracy: <1.5m CEP", "Compass: IST8310", "Interface: UART + I2C"],
  },
};

// ─── Materials ─────────────────────────────────────────────────────────────────
function makeMat(color: number, roughness = 0.4, metalness = 0.6, emissive = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: 0 });
}

const MAT = {
  cf:        makeMat(0x2a2a2a, 0.45, 0.5),          // visible dark gray carbon fiber
  cfTop:     makeMat(0x383838, 0.35, 0.55),          // slightly lighter top plate
  motor:     makeMat(0x1c3a5c, 0.25, 0.85),          // bright blue-steel motor can
  motorRing: makeMat(0x2255aa, 0.15, 0.95),          // bright blue ring
  prop:      makeMat(0x444444, 0.55, 0.15),          // medium gray prop (visible)
  propAccent:makeMat(0x00f5ff, 0.3, 0.4),            // full neon cyan tip
  pixhawk:   makeMat(0x0a3a6a, 0.25, 0.6),           // bright blue PCB
  pcbGreen:  makeMat(0x0d4a28, 0.4, 0.3),            // visible PCB green
  connector: makeMat(0xeeeeee, 0.3, 0.8),
  battery:   makeMat(0x2a2a2a, 0.45, 0.25),          // visible dark battery
  battLabel: makeMat(0xffbb00, 0.6, 0.15),           // bright yellow label
  gps:       makeMat(0xfafafa, 0.3, 0.35),           // bright white GPS puck
  wire:      makeMat(0xff4422, 0.7, 0.15),           // bright red wire
  standoff:  makeMat(0xaaaaaa, 0.25, 0.95),          // bright silver standoff
};

// ─── Drone builder ─────────────────────────────────────────────────────────────
function buildDrone(): {
  root: THREE.Group;
  props: { mesh: THREE.Group; dir: number }[];
  hitMap: Map<THREE.Object3D, string>;
} {
  const root = new THREE.Group();
  const props: { mesh: THREE.Group; dir: number }[] = [];
  const hitMap = new Map<THREE.Object3D, string>();

  const tag = (obj: THREE.Object3D, key: string) => {
    obj.traverse((c) => hitMap.set(c, key));
  };

  // ── Helper: add object and register hit ──
  const add = (parent: THREE.Group, mesh: THREE.Object3D, key: string) => {
    parent.add(mesh);
    hitMap.set(mesh, key);
    mesh.traverse((c) => hitMap.set(c, key));
  };

  // ── Frame plates ──
  const plateGeo = new THREE.BoxGeometry(0.22, 0.006, 0.1);
  const bottomPlate = new THREE.Mesh(plateGeo, MAT.cf.clone());
  bottomPlate.position.y = -0.015;
  add(root, bottomPlate, "bottom_plate");

  const topPlate = new THREE.Mesh(plateGeo, MAT.cfTop.clone());
  topPlate.position.y = 0.032;
  add(root, topPlate, "top_plate");

  // ── Arms (4 diagonal carbon tubes) ──
  const ARM_ANGLE = Math.PI / 4; // 45°
  const ARM_LEN = 0.14;
  const armPositions = [
    { key: "arm_fl", angle: ARM_ANGLE,             dx:  1, dz: -1 },
    { key: "arm_fr", angle: -ARM_ANGLE,            dx:  1, dz:  1 },
    { key: "arm_rl", angle: Math.PI - ARM_ANGLE,   dx: -1, dz: -1 },
    { key: "arm_rr", angle: Math.PI + ARM_ANGLE,   dx: -1, dz:  1 },
  ];

  const motorPositions: { x: number; z: number; key: string; propDir: number; propKey: string; motorKey: string }[] = [];

  for (const arm of armPositions) {
    const armGrp = new THREE.Group();
    armGrp.rotation.y = arm.angle;

    // Tube
    const tubeGeo = new THREE.CylinderGeometry(0.007, 0.008, ARM_LEN, 8);
    const tube = new THREE.Mesh(tubeGeo, MAT.cf.clone());
    tube.rotation.z = Math.PI / 2;
    tube.position.x = ARM_LEN / 2;
    tube.position.y = 0.01;
    armGrp.add(tube);

    // Carbon weave top stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(ARM_LEN, 0.002, 0.005),
      makeMat(0x555555, 0.6, 0.15)
    );
    stripe.position.x = ARM_LEN / 2;
    stripe.position.y = 0.018;
    armGrp.add(stripe);

    tag(armGrp, arm.key);
    root.add(armGrp);

    // Motor end position in world XZ
    const mx = Math.cos(arm.angle) * ARM_LEN * arm.dx > 0
      ? Math.cos(arm.angle) * ARM_LEN
      : Math.cos(arm.angle) * ARM_LEN;
    const mz = Math.sin(arm.angle) * ARM_LEN;
    const isFL = arm.key === "arm_fl";
    const isFR = arm.key === "arm_fr";
    motorPositions.push({
      x: Math.cos(arm.angle) * ARM_LEN,
      z: Math.sin(arm.angle) * ARM_LEN,
      key: arm.key,
      propDir: (isFL || arm.key === "arm_rr") ? 1 : -1,
      propKey: arm.key.replace("arm_", "prop_"),
      motorKey: arm.key.replace("arm_", "motor_"),
    });
  }

  // ── Motors & Props ──
  for (const mp of motorPositions) {
    const motorGrp = new THREE.Group();
    motorGrp.position.set(mp.x, 0.015, mp.z);

    // Motor can (stator + bell)
    const bellGeo = new THREE.CylinderGeometry(0.022, 0.019, 0.018, 16);
    const bell = new THREE.Mesh(bellGeo, MAT.motor.clone());
    motorGrp.add(bell);

    // Motor ring accent
    const ringGeo = new THREE.TorusGeometry(0.021, 0.002, 8, 16);
    const ring = new THREE.Mesh(ringGeo, MAT.motorRing.clone());
    ring.position.y = 0.006;
    motorGrp.add(ring);

    // Motor shaft
    const shaftGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.012, 8);
    const shaft = new THREE.Mesh(shaftGeo, MAT.connector.clone());
    shaft.position.y = 0.015;
    motorGrp.add(shaft);

    // Motor base
    const baseGeo = new THREE.CylinderGeometry(0.017, 0.017, 0.006, 16);
    const base = new THREE.Mesh(baseGeo, makeMat(0x555566, 0.35, 0.75));
    base.position.y = -0.012;
    motorGrp.add(base);

    tag(motorGrp, mp.motorKey);
    root.add(motorGrp);

    // Propeller group (spins)
    const propGrp = new THREE.Group();
    propGrp.position.set(mp.x, 0.03, mp.z);

    const HUB_R = 0.006;
    const PROP_LEN = 0.063;
    const PROP_W = 0.016;
    const PROP_THICK = 0.003;

    // Hub
    const hubGeo = new THREE.CylinderGeometry(HUB_R, HUB_R, PROP_THICK * 2, 12);
    const hub = new THREE.Mesh(hubGeo, MAT.prop.clone());
    propGrp.add(hub);

    // 2 blades
    for (let b = 0; b < 2; b++) {
      const bladeGrp = new THREE.Group();
      bladeGrp.rotation.y = (b * Math.PI);

      // Main blade shape using ExtrudeGeometry
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(HUB_R, -PROP_W * 0.3);
      bladeShape.quadraticCurveTo(PROP_LEN * 0.5, -PROP_W * 0.6, PROP_LEN, -PROP_W * 0.15);
      bladeShape.quadraticCurveTo(PROP_LEN * 0.9, PROP_W * 0.3, PROP_LEN * 0.6, PROP_W * 0.4);
      bladeShape.quadraticCurveTo(PROP_LEN * 0.3, PROP_W * 0.5, HUB_R, PROP_W * 0.3);
      bladeShape.closePath();

      const extrudeSettings = { depth: PROP_THICK, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 1 };
      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
      bladeGeo.rotateX(-Math.PI / 2);
      bladeGeo.translate(0, PROP_THICK / 2, 0);

      const blade = new THREE.Mesh(bladeGeo, MAT.prop.clone());
      bladeGrp.add(blade);

      // Cyan tip accent
      const tipGeo = new THREE.BoxGeometry(0.012, PROP_THICK + 0.001, PROP_W * 0.4);
      const tip = new THREE.Mesh(tipGeo, MAT.propAccent.clone());
      tip.position.set(PROP_LEN - 0.006, PROP_THICK / 2, 0);
      bladeGrp.add(tip);

      propGrp.add(bladeGrp);
    }

    tag(propGrp, mp.propKey);
    root.add(propGrp);
    props.push({ mesh: propGrp, dir: mp.propDir });
  }

  // ── Standoffs (4 corners) ──
  const standoffPositions = [
    [0.07, -0.045], [0.07, 0.045], [-0.07, -0.045], [-0.07, 0.045]
  ] as [number, number][];

  for (const [sx, sz] of standoffPositions) {
    const soGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.048, 8);
    const so = new THREE.Mesh(soGeo, MAT.standoff.clone());
    so.position.set(sx, 0.008, sz);
    root.add(so);
  }

  // ── Pixhawk 6C Mini ──
  const pxGrp = new THREE.Group();
  pxGrp.position.set(0, 0.045, 0);

  // PCB
  const pcbGeo = new THREE.BoxGeometry(0.039, 0.005, 0.039);
  const pcb = new THREE.Mesh(pcbGeo, MAT.pixhawk.clone());
  pxGrp.add(pcb);

  // PCB green layer
  const pcbGLayer = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.001, 0.038), MAT.pcbGreen.clone());
  pcbGLayer.position.y = 0.003;
  pxGrp.add(pcbGLayer);

  // IMU bump
  const imuGeo = new THREE.BoxGeometry(0.012, 0.004, 0.012);
  const imu = new THREE.Mesh(imuGeo, makeMat(0x2a5888, 0.25, 0.75));
  imu.position.set(0.005, 0.005, 0.005);
  pxGrp.add(imu);

  // USB-C port
  const usbGeo = new THREE.BoxGeometry(0.006, 0.004, 0.003);
  const usb = new THREE.Mesh(usbGeo, makeMat(0xcccccc, 0.3, 0.8));
  usb.position.set(0.0, 0.003, -0.021);
  pxGrp.add(usb);

  // Indicator LEDs (tiny dots — cyan & blue)
  for (let i = 0; i < 3; i++) {
    const ledGeo = new THREE.SphereGeometry(0.0015, 6, 6);
    const ledMat = new THREE.MeshStandardMaterial({
      color: i === 0 ? 0x00f5ff : i === 1 ? 0x4d9fff : 0x39ff14,
      emissive: i === 0 ? 0x00f5ff : i === 1 ? 0x4d9fff : 0x39ff14,
      emissiveIntensity: 1.2,
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.012 + i * 0.008, 0.005, 0.016);
    pxGrp.add(led);
  }

  // UART/I2C connectors on sides
  for (let i = 0; i < 3; i++) {
    const connGeo = new THREE.BoxGeometry(0.006, 0.004, 0.003);
    const conn = new THREE.Mesh(connGeo, makeMat(0xdddddd, 0.3, 0.7));
    conn.position.set(-0.015 + i * 0.014, 0.003, 0.021);
    pxGrp.add(conn);
  }

  tag(pxGrp, "pixhawk");
  root.add(pxGrp);

  // ── GPS Mast ──
  const gpsGrp = new THREE.Group();
  gpsGrp.position.set(-0.05, 0.038, 0);

  // Mast
  const mastGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.04, 8);
  const mast = new THREE.Mesh(mastGeo, MAT.standoff.clone());
  mast.position.y = 0.02;
  gpsGrp.add(mast);

  // GPS puck
  const gpsGeo = new THREE.CylinderGeometry(0.018, 0.016, 0.008, 16);
  const gpsMesh = new THREE.Mesh(gpsGeo, MAT.gps.clone());
  gpsMesh.position.y = 0.044;
  gpsGrp.add(gpsMesh);

  // GPS label ring
  const gpsLabelGeo = new THREE.TorusGeometry(0.015, 0.001, 6, 16);
  const gpsLabel = new THREE.Mesh(gpsLabelGeo, makeMat(0x00f5ff, 0.3, 0.5));
  gpsLabel.position.y = 0.045;
  gpsGrp.add(gpsLabel);

  tag(gpsGrp, "gps");
  root.add(gpsGrp);

  // ── Battery (bottom) ──
  const batGrp = new THREE.Group();
  batGrp.position.set(0, -0.032, 0);

  const batGeo = new THREE.BoxGeometry(0.11, 0.022, 0.035);
  const bat = new THREE.Mesh(batGeo, MAT.battery.clone());
  batGrp.add(bat);

  // Yellow label strip
  const labelGeo = new THREE.BoxGeometry(0.11, 0.001, 0.01);
  const label = new THREE.Mesh(labelGeo, MAT.battLabel.clone());
  label.position.set(0, 0.012, 0);
  batGrp.add(label);

  // XT60 connector
  const xt60Geo = new THREE.BoxGeometry(0.012, 0.015, 0.01);
  const xt60 = new THREE.Mesh(xt60Geo, makeMat(0xcc8800, 0.3, 0.6));
  xt60.position.set(0.062, 0, 0);
  batGrp.add(xt60);

  tag(batGrp, "battery");
  root.add(batGrp);

  // ── ESC wires (decorative) ──
  for (const mp of motorPositions) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.01, 0),
      new THREE.Vector3(mp.x * 0.5, -0.008, mp.z * 0.5),
      new THREE.Vector3(mp.x * 0.9, -0.005, mp.z * 0.9),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.002, 6, false);
    const wire = new THREE.Mesh(tubeGeo, MAT.wire.clone());
    root.add(wire);
  }

  return { root, props, hitMap };
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function DroneViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    rotY: 0.3,
    rotX: 0.22,
    autoRotate: true,
    idleTimer: 0,
    zoom: 2.8,
    targetZoom: 2.8,
    targetRotY: 0.3,
    targetRotX: 0.22,
  });

  const [tooltip, setTooltip] = useState<{
    key: string;
    x: number;
    y: number;
  } | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const tooltipRef = useRef<{ key: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene setup ──
    const scene = new THREE.Scene();
    scene.background = null;

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.01, 100);
    camera.position.set(0, 0.08, stateRef.current.zoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    mount.appendChild(renderer.domElement);

    // ── Lighting — much brighter to pop against dark bg ──
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88ddff, 2.5);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00f5ff, 2.0);
    rimLight.position.set(0, -1, -4);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
    topLight.position.set(0, 5, 0);
    scene.add(topLight);

    const bottomFill = new THREE.PointLight(0x4488ff, 2.5, 4);
    bottomFill.position.set(0, -0.5, 0);
    scene.add(bottomFill);

    // Ground reflection plane (invisible)
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Build drone ──
    const { root: droneRoot, props, hitMap } = buildDrone();
    droneRoot.scale.setScalar(4.2); // scale up so it fills the viewport
    droneRoot.traverse((c) => { if ((c as THREE.Mesh).isMesh) { (c as THREE.Mesh).castShadow = true; (c as THREE.Mesh).receiveShadow = true; } });
    scene.add(droneRoot);

    // ── Hover glow post-processing (manual emissive) ──
    const originalEmissive = new Map<THREE.Material, THREE.Color>();
    const setHighlight = (key: string | null, intensity: number) => {
      droneRoot.traverse((c) => {
        if (!(c as THREE.Mesh).isMesh) return;
        const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (!mat || !mat.isMeshStandardMaterial) return;
        const partKey = hitMap.get(c);
        if (key && partKey === key) {
          if (!originalEmissive.has(mat)) originalEmissive.set(mat, mat.emissive.clone());
          mat.emissive.set(0x00f5ff);
          mat.emissiveIntensity = intensity;
        } else {
          const orig = originalEmissive.get(mat);
          if (orig) { mat.emissive.copy(orig); mat.emissiveIntensity = 0; }
          else { mat.emissive.set(0x000000); mat.emissiveIntensity = 0; }
        }
      });
    };

    // ── Raycaster ──
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lastHovered: string | null = null;

    const getHit = (clientX: number, clientY: number): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const meshes: THREE.Object3D[] = [];
      droneRoot.traverse((c) => { if ((c as THREE.Mesh).isMesh) meshes.push(c); });
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) return hitMap.get(hits[0].object) ?? null;
      return null;
    };

    // ── Mouse events ──
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      stateRef.current.autoRotate = false;
      stateRef.current.idleTimer = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s.isDragging) {
        const dx = e.clientX - s.lastX;
        const dy = e.clientY - s.lastY;
        s.targetRotY += dx * 0.008;
        s.targetRotX += dy * 0.005;
        s.targetRotX = Math.max(-0.8, Math.min(0.8, s.targetRotX));
        s.lastX = e.clientX;
        s.lastY = e.clientY;
      } else {
        const key = getHit(e.clientX, e.clientY);
        if (key !== lastHovered) {
          lastHovered = key;
          if (!locked) {
            setHighlight(key, 0.4);
            setHovered(key);
            if (key) {
              const rect = renderer.domElement.getBoundingClientRect();
              tooltipRef.current = { key, x: e.clientX - rect.left, y: e.clientY - rect.top };
              setTooltip({ key, x: e.clientX - rect.left, y: e.clientY - rect.top });
            } else {
              setTooltip(null);
              tooltipRef.current = null;
            }
          }
          mount.style.cursor = key ? "pointer" : "grab";
        } else if (key && !locked) {
          // Update tooltip pos
          const rect = renderer.domElement.getBoundingClientRect();
          tooltipRef.current = { key, x: e.clientX - rect.left, y: e.clientY - rect.top };
          setTooltip({ key, x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.isDragging) return;
      s.isDragging = false;
      mount.style.cursor = "grab";
      // Check if it was a click (minimal movement)
      const dx = Math.abs(e.clientX - s.lastX);
      const dy = Math.abs(e.clientY - s.lastY);
      if (dx < 5 && dy < 5) {
        const key = getHit(e.clientX, e.clientY);
        if (key) {
          if (locked === key) {
            setLocked(null);
            setHighlight(null, 0);
          } else {
            setLocked(key);
            setHighlight(key, 0.6);
            const rect = renderer.domElement.getBoundingClientRect();
            setTooltip({ key, x: e.clientX - rect.left, y: e.clientY - rect.top });
          }
        } else {
          setLocked(null);
          setHighlight(null, 0);
          setTooltip(null);
        }
      }
    };

    const onMouseLeave = () => {
      stateRef.current.isDragging = false;
      if (!locked) {
        setHighlight(null, 0);
        setHovered(null);
        setTooltip(null);
        tooltipRef.current = null;
      }
      mount.style.cursor = "grab";
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.targetZoom = Math.max(1.2, Math.min(5.5, stateRef.current.targetZoom + e.deltaY * 0.006));
    };

    // Touch events
    let lastTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        stateRef.current.isDragging = true;
        stateRef.current.lastX = e.touches[0].clientX;
        stateRef.current.lastY = e.touches[0].clientY;
        stateRef.current.autoRotate = false;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (e.touches.length === 1 && s.isDragging) {
        const dx = e.touches[0].clientX - s.lastX;
        const dy = e.touches[0].clientY - s.lastY;
        s.targetRotY += dx * 0.008;
        s.targetRotX += dy * 0.005;
        s.targetRotX = Math.max(-0.8, Math.min(0.8, s.targetRotX));
        s.lastX = e.touches[0].clientX;
        s.lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = lastTouchDist - dist;
        s.targetZoom = Math.max(1.2, Math.min(5.5, s.targetZoom + delta * 0.015));
        lastTouchDist = dist;
      }
    };
    const onTouchEnd = () => { stateRef.current.isDragging = false; };

    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    mount.style.cursor = "grab";

    // ── Resize ──
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ──
    let frame = 0;
    let animId: number;
    const IDLE_TIMEOUT = 180; // frames before auto-rotate resumes

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      const s = stateRef.current;

      // Idle timer → auto-rotate
      if (!s.isDragging) {
        s.idleTimer++;
        if (s.idleTimer > IDLE_TIMEOUT) s.autoRotate = true;
      } else {
        s.idleTimer = 0;
        s.autoRotate = false;
      }

      if (s.autoRotate) {
        s.targetRotY += 0.004;
      }

      // Smooth camera interpolation
      s.rotY += (s.targetRotY - s.rotY) * 0.07;
      s.rotX += (s.targetRotX - s.rotX) * 0.07;
      s.zoom += (s.targetZoom - s.zoom) * 0.07;

      droneRoot.rotation.y = s.rotY;
      droneRoot.rotation.x = s.rotX;
      camera.position.z = s.zoom;

      // Gentle float
      droneRoot.position.y = Math.sin(frame * 0.018) * 0.012;

      // Spin props
      for (const p of props) {
        p.mesh.rotation.y += 0.18 * p.dir;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  const info = tooltip ? PART_LABELS[tooltip.key] : null;
  const lockedInfo = locked ? PART_LABELS[locked] : null;

  return (
    <div className="relative w-full h-full select-none">
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Hover tooltip */}
      {tooltip && info && !locked && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: Math.min(tooltip.x + 16, (mountRef.current?.clientWidth ?? 600) - 220),
            top: Math.max(tooltip.y - 10, 10),
            maxWidth: 200,
          }}
        >
          <div
            className="font-mono text-xs px-3 py-2"
            style={{
              background: "rgba(8,8,8,0.92)",
              border: "1px solid rgba(0,245,255,0.35)",
              boxShadow: "0 0 16px rgba(0,245,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="font-heading font-semibold text-sm mb-1" style={{ color: "#00F5FF" }}>
              {info.title}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.65rem" }}>Click for specs</div>
          </div>
        </div>
      )}

      {/* Locked panel (click to open) */}
      {locked && lockedInfo && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 220,
          }}
        >
          <div
            className="font-mono"
            style={{
              background: "rgba(8,8,8,0.95)",
              border: "1px solid rgba(0,245,255,0.4)",
              boxShadow: "0 0 30px rgba(0,245,255,0.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid rgba(0,245,255,0.15)", background: "rgba(0,245,255,0.05)" }}
            >
              <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#6b7280" }}>
                Selected Part
              </div>
              <div className="font-heading font-bold text-sm" style={{ color: "#00F5FF" }}>
                {lockedInfo.title}
              </div>
            </div>
            {/* Specs */}
            <div className="px-4 py-3 space-y-2">
              {lockedInfo.specs.map((s, i) => {
                const [k, v] = s.split(": ");
                return (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span style={{ color: "#4D9FFF", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {k}
                    </span>
                    <span style={{ color: "#F0F0F0", fontSize: "0.75rem" }}>{v || k}</span>
                  </div>
                );
              })}
            </div>
            <div
              className="px-4 py-2 text-center"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span style={{ color: "#6b7280", fontSize: "0.65rem" }}>Click part again to dismiss</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none"
      >
        {[
          { icon: "⟳", label: "Drag to rotate" },
          { icon: "⊕", label: "Scroll to zoom" },
          { icon: "◎", label: "Click part for specs" },
        ].map((h, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span style={{ color: "#00F5FF", fontSize: "0.7rem" }}>{h.icon}</span>
            <span className="font-mono" style={{ color: "#6b7280", fontSize: "0.6rem", letterSpacing: "0.05em" }}>
              {h.label}
            </span>
          </div>
        ))}
      </div>

      {/* Hovered part name (subtle, bottom left) */}
      {hovered && !locked && PART_LABELS[hovered] && (
        <div
          className="absolute bottom-10 left-4 pointer-events-none"
        >
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "rgba(0,245,255,0.5)" }}
          >
            {PART_LABELS[hovered].title}
          </span>
        </div>
      )}
    </div>
  );
}
