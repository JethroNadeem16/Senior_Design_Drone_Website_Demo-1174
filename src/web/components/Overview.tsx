import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const objectives = [
  {
    icon: "◈",
    title: "Model-Based Design",
    desc: "Program the drone entirely in MathWorks Simulink — generating embedded C code that runs directly on the Pixhawk 6C Mini hardware.",
    color: "#00F5FF",
  },
  {
    icon: "◎",
    title: "PID Controller Tuning",
    desc: "Leverage the built-in PX4 Autopilot Toolbox PID structure and tune gains for altitude, attitude, and position — not replacing it, not starting from scratch.",
    color: "#4D9FFF",
  },
  {
    icon: "⬡",
    title: "Digital Twin Validation",
    desc: "Before a single real flight, simulate every maneuver in an Unreal Engine environment that mirrors real-world physics and sensor behavior.",
    color: "#39FF14",
  },
  {
    icon: "◇",
    title: "Hardware-in-the-Loop",
    desc: "Connect the physical Pixhawk board to the Simulink/UE simulation pipeline so the actual flight controller software runs against the virtual world.",
    color: "#00F5FF",
  },
];

export default function Overview() {
  const ref = useReveal();

  return (
    <section id="overview" className="py-32 px-6 relative">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 50%, rgba(0,245,255,0.02) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="reveal" style={{ transitionDelay: "0s" }}>
          <SectionHeader
            number="01"
            label="Project Overview"
            title="What We're"
            accent="Building"
            subtitle="An end-to-end autonomous flight system — from Simulink model to real hover — with a digital twin standing between design and reality."
          />
        </div>

        {/* Objective cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="reveal stat-card group cursor-default"
              style={{
                transitionDelay: `${i * 0.1}s`,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-2xl mt-0.5"
                  style={{ color: obj.color, filter: `drop-shadow(0 0 8px ${obj.color})` }}
                >
                  {obj.icon}
                </span>
                <div>
                  <h3
                    className="font-heading font-semibold text-lg mb-2"
                    style={{ color: "#F0F0F0" }}
                  >
                    {obj.title}
                  </h3>
                  <p className="font-mono text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                    {obj.desc}
                  </p>
                </div>
              </div>
              {/* Hover accent */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: obj.color, opacity: 0.4 }}
              />
            </div>
          ))}
        </div>

        {/* Pipeline diagram */}
        <div
          className="reveal neon-border p-8"
          style={{ background: "#0a0a0a", transitionDelay: "0.4s" }}
        >
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#6b7280" }}>
            System Pipeline
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            {[
              { label: "Simulink\nModel", color: "#00F5FF" },
              { label: "Code\nGeneration", color: "#4D9FFF" },
              { label: "Pixhawk\n6C Mini", color: "#F0F0F0" },
              { label: "UE Digital\nTwin", color: "#39FF14" },
              { label: "HIL\nSim", color: "#4D9FFF" },
              { label: "Real\nFlight", color: "#00F5FF" },
            ].map((node, i, arr) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: node.color,
                      boxShadow: `0 0 10px ${node.color}`,
                    }}
                  />
                  <div
                    className="font-mono text-center"
                    style={{
                      fontSize: "0.65rem",
                      color: node.color,
                      whiteSpace: "pre-line",
                      lineHeight: 1.3,
                    }}
                  >
                    {node.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="w-8 h-px"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
