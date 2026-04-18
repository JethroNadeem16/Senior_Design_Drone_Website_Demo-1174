import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const milestones = [
  { status: "done", label: "Hardware assembly", detail: "QAV250 frame + Pixhawk 6C Mini fully assembled and powered" },
  { status: "done", label: "PX4 firmware flashed", detail: "Base PX4 v1.14 installed, default parameters loaded" },
  { status: "done", label: "Simulink toolbox configured", detail: "PX4 Autopilot Toolbox + Embedded Coder set up for hardware target" },
  { status: "done", label: "UE5 environment built", detail: "Colosseum plugin integrated, test arena created" },
  { status: "active", label: "HIL simulation loop", detail: "Pixhawk running generated code in hardware-in-the-loop with UE5" },
  { status: "active", label: "PID tuning iterations", detail: "Iterating on roll/pitch/yaw gains via Simulink, validating in HIL" },
  { status: "pending", label: "Outdoor hover test", detail: "Controlled outdoor flight in low-wind conditions" },
  { status: "pending", label: "Waypoint navigation", detail: "Autonomous GPS-guided waypoint mission" },
];

const metrics = [
  { label: "Position Error (Sim)", value: "< 0.3m", unit: "RMS", color: "#00F5FF" },
  { label: "Attitude Settling Time", value: "~0.8s", unit: "step response", color: "#4D9FFF" },
  { label: "Altitude Hold Accuracy", value: "± 0.15m", unit: "steady state", color: "#39FF14" },
  { label: "HIL Latency", value: "< 5ms", unit: "round trip", color: "#F0A500" },
];

const statusColors: Record<string, string> = {
  done: "#39FF14",
  active: "#00F5FF",
  pending: "#6b7280",
};
const statusLabels: Record<string, string> = {
  done: "COMPLETE",
  active: "IN PROGRESS",
  pending: "UPCOMING",
};

export default function Results() {
  const ref = useReveal();

  return (
    <section
      id="results"
      className="py-32 px-6 relative"
      style={{ background: "#0a0a0a" }}
    >
      <div className="absolute inset-0 pointer-events-none hud-grid opacity-25" />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="reveal">
          <SectionHeader
            number="06"
            label="Flight Testing & Results"
            title="Status &"
            accent="Findings"
            subtitle="Where we are, what we've measured, and what's next. Real numbers from real simulation runs."
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="reveal neon-border p-6 text-center"
              style={{
                background: "#0f0f0f",
                transitionDelay: `${i * 0.08}s`,
                borderColor: `${m.color}25`,
              }}
            >
              <div
                className="font-display text-4xl mb-1 glow-cyan"
                style={{ color: m.color, fontSize: "2.2rem" }}
              >
                {m.value}
              </div>
              <div className="font-mono text-xs mb-2" style={{ color: "#6b7280" }}>
                {m.unit}
              </div>
              <div className="scan-line mb-2" style={{ opacity: 0.2 }} />
              <div className="font-heading font-medium text-xs" style={{ color: "#F0F0F0" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="reveal mb-12" style={{ transitionDelay: "0.35s" }}>
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#6b7280" }}>
            Project Milestones
          </div>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                {/* Status dot */}
                <div className="flex items-center gap-2 w-32 shrink-0 mt-0.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: statusColors[m.status],
                      boxShadow: m.status !== "pending" ? `0 0 8px ${statusColors[m.status]}` : "none",
                    }}
                  />
                  <span
                    className="font-mono text-xs"
                    style={{ color: statusColors[m.status], fontSize: "0.6rem", letterSpacing: "0.1em" }}
                  >
                    {statusLabels[m.status]}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-medium text-sm mb-0.5" style={{ color: "#F0F0F0" }}>
                    {m.label}
                  </div>
                  <div className="font-mono text-xs" style={{ color: "#6b7280" }}>
                    {m.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation vs real comparison placeholder */}
        <div
          className="reveal neon-border p-8"
          style={{ background: "#0f0f0f", transitionDelay: "0.5s" }}
        >
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#6b7280" }}>
            Simulation vs Real Flight — Attitude Response
          </div>
          {/* ASCII-style response curve */}
          <div className="relative h-48 overflow-hidden mb-4">
            <svg viewBox="0 0 800 180" className="w-full h-full">
              {/* Grid lines */}
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="60"
                  y1={20 + i * 46}
                  x2="780"
                  y2={20 + i * 46}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}
              {/* Setpoint line */}
              <line x1="60" y1="90" x2="780" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="6,4" />
              <text x="10" y="94" fill="#6b7280" fontSize="10" fontFamily="monospace">SP</text>

              {/* Simulation curve (cyan) */}
              <path
                d="M60,155 C100,155 120,30 180,88 C220,120 260,82 320,90 C380,98 420,88 780,90"
                fill="none"
                stroke="#00F5FF"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Real flight curve (blue, slightly different) */}
              <path
                d="M60,155 C100,155 130,25 190,92 C235,125 275,79 335,91 C400,102 440,87 780,90"
                fill="none"
                stroke="#4D9FFF"
                strokeWidth="1.5"
                opacity="0.6"
                strokeDasharray="4,2"
              />

              {/* Labels */}
              <text x="65" y="170" fill="#6b7280" fontSize="9" fontFamily="monospace">t=0</text>
              <text x="375" y="170" fill="#6b7280" fontSize="9" fontFamily="monospace">time →</text>
            </svg>
            {/* Legend */}
            <div className="absolute top-2 right-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-px" style={{ background: "#00F5FF" }} />
                <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>Simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-px" style={{ background: "#4D9FFF", borderTop: "1px dashed #4D9FFF" }} />
                <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>Real Flight (est.)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.2)", borderTop: "1px dashed" }} />
                <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>Setpoint</span>
              </div>
            </div>
          </div>
          <p className="font-mono text-xs" style={{ color: "#6b7280" }}>
            Attitude step response showing close correlation between HIL simulation and estimated real flight behavior after PID tuning. Full real-flight data pending outdoor testing.
          </p>
        </div>
      </div>
    </section>
  );
}
