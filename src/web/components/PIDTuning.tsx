import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const axes = [
  {
    axis: "Roll",
    symbol: "φ",
    color: "#00F5FF",
    kp: "MC_ROLL_P",
    ki: "MC_ROLLRATE_I",
    kd: "MC_ROLLRATE_D",
    desc: "Controls lateral tilt. Fast response needed for stabilization.",
  },
  {
    axis: "Pitch",
    symbol: "θ",
    color: "#4D9FFF",
    kp: "MC_PITCH_P",
    ki: "MC_PITCHRATE_I",
    kd: "MC_PITCHRATE_D",
    desc: "Controls fore/aft tilt. Coupled with forward velocity.",
  },
  {
    axis: "Yaw",
    symbol: "ψ",
    color: "#39FF14",
    kp: "MC_YAW_P",
    ki: "MC_YAWRATE_I",
    kd: "MC_YAWRATE_D",
    desc: "Heading control. Slower dynamics, integrator important.",
  },
  {
    axis: "Altitude",
    symbol: "z",
    color: "#F0A500",
    kp: "MPC_Z_P",
    ki: "MPC_Z_VEL_I",
    kd: "MPC_Z_VEL_D",
    desc: "Vertical position. Sensitive to throttle/weight ratio.",
  },
];

const approach = [
  {
    title: "Start with PX4 Defaults",
    detail: "PX4 Autopilot ships with pre-tuned default gains from Holybro's reference configuration for the Pixhawk 6C. We use these as our baseline — they fly.",
    step: "01",
  },
  {
    title: "Identify Divergence",
    detail: "Run the default config in the Unreal Engine digital twin. Log state errors, oscillation frequency, and settling time. Find which axis is under/over-damped.",
    step: "02",
  },
  {
    title: "Systematic Tuning in Simulink",
    detail: "Modify Kp, Ki, Kd parameters in the PX4 Toolbox blocks inside Simulink. Re-generate code. Flash. Re-test in simulation. Iterate without ever touching the real drone.",
    step: "03",
  },
  {
    title: "Validate in HIL",
    detail: "Hardware-in-the-loop: the physical Pixhawk runs the tuned code while Unreal Engine feeds it simulated sensor data. Ground truth before real air.",
    step: "04",
  },
  {
    title: "Real Flight Verification",
    detail: "Transfer tuned parameters to real flight. Compare logged flight data against simulation predictions. Fine-tune residual differences in-field.",
    step: "05",
  },
];

export default function PIDTuning() {
  const ref = useReveal();

  return (
    <section
      id="pid"
      className="py-32 px-6 relative"
      style={{ background: "#0a0a0a" }}
    >
      <div className="absolute inset-0 pointer-events-none hud-grid opacity-30" />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="reveal">
          <SectionHeader
            number="04"
            label="PID Tuning / Control Theory"
            title="Tuning the"
            accent="Controller"
            subtitle="We don't replace PX4's built-in PID architecture — and we don't accept it blindly. We tune it: analytically, systematically, in simulation first."
          />
        </div>

        {/* PID formula */}
        <div
          className="reveal neon-border p-8 mb-12 text-center"
          style={{ background: "#0f0f0f", transitionDelay: "0.1s" }}
        >
          <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#6b7280" }}>
            PID Control Law
          </div>
          <div
            className="font-mono text-2xl md:text-3xl"
            style={{ color: "#F0F0F0", letterSpacing: "0.05em" }}
          >
            <span style={{ color: "#00F5FF" }}>u</span>(t) ={" "}
            <span style={{ color: "#4D9FFF" }}>K</span>
            <sub style={{ fontSize: "0.7em" }}>p</sub>
            <span style={{ color: "#9ca3af" }}>·e(t)</span>{" "}
            +{" "}
            <span style={{ color: "#4D9FFF" }}>K</span>
            <sub style={{ fontSize: "0.7em" }}>i</sub>
            <span style={{ color: "#9ca3af" }}>·∫e(τ)dτ</span>{" "}
            +{" "}
            <span style={{ color: "#4D9FFF" }}>K</span>
            <sub style={{ fontSize: "0.7em" }}>d</sub>
            <span style={{ color: "#9ca3af" }}>·ė(t)</span>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            {[
              { sym: "Kp", name: "Proportional", desc: "Reacts to current error", color: "#00F5FF" },
              { sym: "Ki", name: "Integral", desc: "Eliminates steady-state offset", color: "#4D9FFF" },
              { sym: "Kd", name: "Derivative", desc: "Dampens rate of change", color: "#39FF14" },
            ].map((g, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl mb-1" style={{ color: g.color }}>{g.sym}</div>
                <div className="font-mono text-xs font-medium mb-1" style={{ color: "#F0F0F0" }}>{g.name}</div>
                <div className="font-mono text-xs" style={{ color: "#6b7280" }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Control axes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {axes.map((axis, i) => (
            <div
              key={i}
              className="reveal neon-border p-5"
              style={{
                background: "#0f0f0f",
                transitionDelay: `${0.1 + i * 0.08}s`,
                borderColor: `${axis.color}25`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-display text-5xl" style={{ color: axis.color, opacity: 0.2 }}>
                  {axis.symbol}
                </div>
                <span
                  className="font-heading font-bold text-lg"
                  style={{ color: axis.color }}
                >
                  {axis.axis}
                </span>
              </div>
              <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: "#6b7280" }}>
                {axis.desc}
              </p>
              <div className="space-y-1.5">
                {[
                  { label: "Kp param", val: axis.kp },
                  { label: "Ki param", val: axis.ki },
                  { label: "Kd param", val: axis.kd },
                ].map((p, pi) => (
                  <div key={pi} className="flex justify-between">
                    <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{p.label}</span>
                    <span className="font-mono text-xs" style={{ color: axis.color, fontSize: "0.6rem" }}>{p.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Approach */}
        <div className="reveal mb-4" style={{ transitionDelay: "0.5s" }}>
          <div className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: "#6b7280" }}>
            Tuning Approach
          </div>
          <div className="space-y-0">
            {approach.map((a, i) => (
              <div key={i} className="timeline-item pb-8">
                <div className="flex gap-4 items-start">
                  <div className="font-display text-2xl" style={{ color: "rgba(0,245,255,0.2)" }}>
                    {a.step}
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-base mb-1" style={{ color: "#F0F0F0" }}>
                      {a.title}
                    </h4>
                    <p className="font-mono text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                      {a.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key insight box */}
        <div
          className="reveal p-6"
          style={{
            background: "rgba(0,245,255,0.04)",
            border: "1px solid rgba(0,245,255,0.2)",
            transitionDelay: "0.6s",
          }}
        >
          <div className="flex gap-4 items-start">
            <span className="text-2xl" style={{ color: "#00F5FF" }}>◈</span>
            <div>
              <h4 className="font-heading font-semibold mb-2" style={{ color: "#00F5FF" }}>
                Why Not Build From Scratch?
              </h4>
              <p className="font-mono text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                PX4's control architecture is battle-tested across thousands of platforms. Building from scratch would mean re-solving sensor fusion, mode management, failsafes, and arming logic — weeks of work that doesn't advance the goal. Instead, we treat PX4 as a baseline and apply engineering judgment to tune it for the QAV250's specific mass, inertia, and actuator dynamics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
