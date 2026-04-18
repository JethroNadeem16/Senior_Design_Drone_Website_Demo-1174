import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const pipeline = [
  {
    title: "Unreal Engine 5",
    sub: "World Rendering + Physics",
    desc: "The virtual environment — terrain, obstacles, lighting, wind. UE5's Chaos physics provides accurate aerodynamic drag and collision responses.",
    color: "#4D9FFF",
    icon: "⬡",
  },
  {
    title: "Colosseum / AirSim",
    sub: "Drone Physics Plugin",
    desc: "Open-source UE plugin that simulates multi-rotor flight dynamics, IMU noise, barometer drift, and GPS signals — all configurable to match the real QAV250.",
    color: "#00F5FF",
    icon: "◎",
  },
  {
    title: "MAVLink Bridge",
    sub: "Communication Protocol",
    desc: "The Pixhawk speaks MAVLink. The simulation speaks MAVLink. The bridge connects both — real controller, virtual world.",
    color: "#39FF14",
    icon: "◈",
  },
  {
    title: "Simulink / HIL",
    sub: "Hardware-in-the-Loop",
    desc: "The generated flight controller code runs on the actual Pixhawk hardware. Sensor data arrives from the simulation. Motor commands go back to the sim. Real-time closed loop.",
    color: "#F0A500",
    icon: "◇",
  },
];

const benefits = [
  { label: "Risk Reduction", desc: "Crash the drone in UE5 — not in real life. Test edge cases safely." },
  { label: "Faster Iteration", desc: "Retune and retest in seconds. No physical repairs, no field trips." },
  { label: "Repeatability", desc: "Every simulation run is identical. Compare PID variants under the same conditions." },
  { label: "Sensor Emulation", desc: "Inject sensor noise, GPS dropout, wind gusts — stress test the controller." },
  { label: "Visual Validation", desc: "Watch the digital twin fly in 3D. Spot instabilities that numbers don't reveal." },
  { label: "Real Data Comparison", desc: "After real flight, compare logged telemetry against simulation predictions." },
];

export default function DigitalTwin() {
  const ref = useReveal();

  return (
    <section id="digital-twin" className="py-32 px-6 relative" style={{ background: "#080808" }}>
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 0% 50%, rgba(77,159,255,0.03) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="reveal">
          <SectionHeader
            number="05"
            label="Digital Twin / Simulation"
            title="Unreal Engine"
            accent="Digital Twin"
            subtitle="A physically accurate virtual copy of the QAV250 — running inside Unreal Engine — where we fly before we fly."
          />
        </div>

        {/* Pipeline cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {pipeline.map((p, i) => (
            <div
              key={i}
              className="reveal neon-border p-6 relative overflow-hidden group"
              style={{
                background: "#0f0f0f",
                transitionDelay: `${i * 0.1}s`,
                borderColor: `${p.color}20`,
              }}
            >
              <div
                className="text-3xl mb-4"
                style={{ color: p.color, filter: `drop-shadow(0 0 10px ${p.color})` }}
              >
                {p.icon}
              </div>
              <h3 className="font-heading font-bold text-base mb-0.5" style={{ color: p.color }}>
                {p.title}
              </h3>
              <div className="font-mono text-xs mb-3" style={{ color: "#6b7280" }}>
                {p.sub}
              </div>
              <p className="font-mono text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
                {p.desc}
              </p>
              <div
                className="absolute bottom-0 right-0 w-12 h-12 opacity-5"
                style={{
                  background: `radial-gradient(circle, ${p.color}, transparent)`,
                  transform: "translate(25%, 25%)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Data flow diagram */}
        <div
          className="reveal neon-border p-8 mb-12"
          style={{ background: "#0a0a0a", transitionDelay: "0.45s" }}
        >
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#6b7280" }}>
            HIL Data Flow
          </div>
          <div className="flex flex-col gap-0">
            {/* Row: Unreal Engine */}
            <div className="flex items-center gap-4 p-4"
              style={{ borderLeft: "3px solid #4D9FFF", background: "rgba(77,159,255,0.04)", marginBottom: "2px" }}>
              <span className="font-mono text-xs font-bold w-36 shrink-0" style={{ color: "#4D9FFF" }}>
                UNREAL ENGINE
              </span>
              <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>
                Renders world → Colosseum computes physics → outputs: IMU data, baro, GPS, LIDAR, camera frames
              </span>
            </div>
            {/* Arrow down */}
            <div className="flex items-center pl-16 my-1">
              <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.3)" }}>
                ↓ MAVLink (UDP) — sensor data
              </span>
            </div>
            {/* Row: Pixhawk */}
            <div className="flex items-center gap-4 p-4"
              style={{ borderLeft: "3px solid #00F5FF", background: "rgba(0,245,255,0.04)", marginBottom: "2px" }}>
              <span className="font-mono text-xs font-bold w-36 shrink-0" style={{ color: "#00F5FF" }}>
                PIXHAWK 6C MINI
              </span>
              <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>
                Runs generated Simulink code → EKF2 fuses sensor inputs → PID controller computes → outputs: motor PWM/DSHOT commands
              </span>
            </div>
            {/* Arrow up */}
            <div className="flex items-center pl-16 my-1">
              <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.3)" }}>
                ↑ MAVLink (UDP) — actuator commands
              </span>
            </div>
            {/* Row: Simulink */}
            <div className="flex items-center gap-4 p-4"
              style={{ borderLeft: "3px solid #39FF14", background: "rgba(57,255,20,0.03)" }}>
              <span className="font-mono text-xs font-bold w-36 shrink-0" style={{ color: "#39FF14" }}>
                SIMULINK LOG
              </span>
              <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>
                Records all states, errors, gains — real-time scopes for PID analysis, export to MATLAB for post-processing
              </span>
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="reveal" style={{ transitionDelay: "0.55s" }}>
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#6b7280" }}>
            Why a Digital Twin?
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="stat-card"
              >
                <div className="font-heading font-semibold text-sm mb-1" style={{ color: "#F0F0F0" }}>
                  {b.label}
                </div>
                <div className="font-mono text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
