import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const qav250Specs = [
  { label: "Frame Material", value: "Carbon Fiber" },
  { label: "Motor Distance", value: "250mm diagonal" },
  { label: "Weight (bare)", value: "~120g" },
  { label: "Max Takeoff Weight", value: "~500g" },
  { label: "Prop Size", value: "5\" (5045)" },
  { label: "Battery", value: "3S–4S LiPo" },
  { label: "Form Factor", value: "Racing / Freestyle" },
];

const pixhawkSpecs = [
  { label: "Processor", value: "STM32H753 (480MHz)" },
  { label: "Co-processor", value: "STM32F103" },
  { label: "IMU", value: "ICM-42688-P × 2" },
  { label: "Barometer", value: "ICP-20100" },
  { label: "GPS", value: "M10 (via ext. module)" },
  { label: "Interfaces", value: "UART, SPI, I2C, CAN" },
  { label: "Form Factor", value: "Mini (38.8 × 38.8mm)" },
];

const motors = [
  { label: "Type", value: "Brushless DC (BLDC)" },
  { label: "KV Rating", value: "2300–2700 KV" },
  { label: "ESC Protocol", value: "DSHOT600" },
  { label: "Configuration", value: "Quad X" },
  { label: "Thrust/motor", value: "~300–450g" },
];

export default function Hardware() {
  const ref = useReveal();

  return (
    <section
      id="hardware"
      className="py-32 px-6 relative"
      style={{ background: "#0a0a0a" }}
    >
      <div
        className="absolute inset-0 pointer-events-none hud-grid opacity-40"
      />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="reveal">
          <SectionHeader
            number="02"
            label="Hardware"
            title="QAV250 +"
            accent="Pixhawk 6C Mini"
            subtitle="A race-grade carbon fiber airframe paired with a professional-grade flight controller. Small, fast, and precise."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* QAV250 */}
          <div className="reveal md:col-span-1 neon-border p-6" style={{ background: "#0f0f0f", transitionDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: "#00F5FF", boxShadow: "0 0 8px #00F5FF" }} />
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#00F5FF" }}>
                Frame
              </span>
            </div>
            <h3 className="font-display text-5xl mb-1" style={{ color: "#F0F0F0" }}>QAV</h3>
            <h3 className="font-display text-5xl mb-6 glow-cyan" style={{ color: "#00F5FF" }}>250</h3>
            <p className="font-mono text-xs leading-relaxed mb-6" style={{ color: "#6b7280" }}>
              Compact, rigid, and battle-tested. The QAV250 carbon fiber frame offers exceptional stiffness-to-weight ratio for precise flight dynamics.
            </p>
            <div className="space-y-2">
              {qav250Specs.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{s.label}</span>
                  <span className="font-mono text-xs font-medium" style={{ color: "#F0F0F0" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pixhawk 6C Mini */}
          <div className="reveal md:col-span-1 neon-border p-6" style={{ background: "#0f0f0f", transitionDelay: "0.2s", borderColor: "rgba(77,159,255,0.25)" }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: "#4D9FFF", boxShadow: "0 0 8px #4D9FFF" }} />
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#4D9FFF" }}>
                Flight Controller
              </span>
            </div>
            <h3 className="font-display text-4xl mb-1" style={{ color: "#F0F0F0" }}>PIXHAWK</h3>
            <h3 className="font-display text-4xl mb-6 glow-blue" style={{ color: "#4D9FFF" }}>6C MINI</h3>
            <p className="font-mono text-xs leading-relaxed mb-6" style={{ color: "#6b7280" }}>
              Holybro's compact flagship. Dual IMUs, vibration isolation, and full PX4 compatibility in a mini form factor. Built for serious applications.
            </p>
            <div className="space-y-2">
              {pixhawkSpecs.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{s.label}</span>
                  <span className="font-mono text-xs font-medium" style={{ color: "#F0F0F0" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Motors / ESC */}
          <div className="reveal md:col-span-1 flex flex-col gap-4" style={{ transitionDelay: "0.3s" }}>
            <div className="neon-border p-6 flex-1" style={{ background: "#0f0f0f", borderColor: "rgba(57,255,20,0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: "#39FF14", boxShadow: "0 0 8px #39FF14" }} />
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#39FF14" }}>
                  Propulsion
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-4" style={{ color: "#F0F0F0" }}>
                Motors & ESC
              </h3>
              <div className="space-y-2">
                {motors.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{s.label}</span>
                    <span className="font-mono text-xs font-medium" style={{ color: "#F0F0F0" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-border p-6" style={{ background: "#0f0f0f" }}>
              <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#6b7280" }}>
                Communication
              </div>
              <div className="space-y-2">
                {[
                  { k: "Telemetry", v: "SiK Radio 915MHz" },
                  { k: "RC Input", v: "SBUS / PPM" },
                  { k: "Companion", v: "UART / MAVLink" },
                  { k: "Debug", v: "USB-C" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{row.k}</span>
                    <span className="font-mono text-xs" style={{ color: "#F0F0F0" }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assembly note */}
        <div
          className="reveal code-block"
          style={{ transitionDelay: "0.4s" }}
        >
          <div className="font-mono text-xs mb-3" style={{ color: "#6b7280" }}>
            // hardware_stack.md
          </div>
          <div style={{ color: "#9ca3af" }}>
            <span style={{ color: "#00F5FF" }}>FRAME</span>     QAV250 Carbon Fiber{" "}
            <span style={{ color: "#4D9FFF" }}>[rigid, ~120g]</span>{"\n"}
            <span style={{ color: "#00F5FF" }}>FCU</span>       Pixhawk 6C Mini{" "}
            <span style={{ color: "#4D9FFF" }}>[STM32H753, dual IMU]</span>{"\n"}
            <span style={{ color: "#00F5FF" }}>AUTOPILOT</span> PX4 v1.14+{" "}
            <span style={{ color: "#4D9FFF" }}>[open-source, Simulink target]</span>{"\n"}
            <span style={{ color: "#00F5FF" }}>MOTORS</span>    4× BLDC{" "}
            <span style={{ color: "#4D9FFF" }}>[DSHOT600, quad-X config]</span>{"\n"}
            <span style={{ color: "#00F5FF" }}>POWER</span>     4S LiPo{" "}
            <span style={{ color: "#4D9FFF" }}>[~14.8V nominal, PDB regulated]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
