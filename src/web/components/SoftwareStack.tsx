import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const layers = [
  {
    layer: "SIMULATION LAYER",
    tools: [
      {
        name: "Unreal Engine 5",
        role: "Digital Twin Environment",
        desc: "Physics-accurate 3D world. AirSim/Colosseum plugin connects UE with the flight controller for sensor emulation, aerodynamics, and visual feedback.",
        color: "#4D9FFF",
        tags: ["AirSim", "Colosseum Plugin", "Physics Sim", "HIL"],
      },
    ],
  },
  {
    layer: "DESIGN LAYER",
    tools: [
      {
        name: "MathWorks Simulink",
        role: "Model-Based Design & Code Generation",
        desc: "The entire flight control algorithm is designed as a block diagram. PX4 Autopilot Toolbox provides the base controller blocks. We tune the PID parameters within this environment, then auto-generate C code for the target hardware.",
        color: "#00F5FF",
        tags: ["PX4 Toolbox", "Code Generation", "Embedded Coder", "SIL/HIL"],
      },
    ],
  },
  {
    layer: "FIRMWARE LAYER",
    tools: [
      {
        name: "PX4 Autopilot",
        role: "Open-Source Flight Stack",
        desc: "Industry-standard open-source autopilot. Provides the base PID control structure, sensor fusion (EKF2), MAVLink communication, and flight modes. We extend — not replace — its controller.",
        color: "#39FF14",
        tags: ["EKF2 Fusion", "MAVLink", "uORB", "NuttX RTOS"],
      },
    ],
  },
  {
    layer: "HARDWARE LAYER",
    tools: [
      {
        name: "Pixhawk 6C Mini",
        role: "Target Hardware",
        desc: "The generated Simulink code is flashed and runs natively on the STM32H753 processor. Sensor data flows up, actuator commands flow down.",
        color: "#F0F0F0",
        tags: ["STM32H753", "FMUv6C", "UART/SPI/I2C", "PWM/DSHOT"],
      },
    ],
  },
];

const workflow = [
  { step: "01", title: "Design in Simulink", desc: "Build control loops as block diagrams using PX4 Autopilot Toolbox" },
  { step: "02", title: "Tune PID Gains", desc: "Adjust Kp, Ki, Kd within the Simulink model for each control axis" },
  { step: "03", title: "SIL Test", desc: "Software-in-the-loop simulation — pure math, no hardware" },
  { step: "04", title: "Generate Code", desc: "Embedded Coder outputs optimized C targeting the STM32H753" },
  { step: "05", title: "Flash & HIL", desc: "Flash Pixhawk, connect to Unreal Engine for hardware-in-the-loop sim" },
  { step: "06", title: "Real Flight", desc: "Validated code, tested gains — clear for real-world test flight" },
];

export default function SoftwareStack() {
  const ref = useReveal();

  return (
    <section id="software" className="py-32 px-6 relative" style={{ background: "#080808" }}>
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 100% 50%, rgba(77,159,255,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <div className="reveal">
          <SectionHeader
            number="03"
            label="Software Stack"
            title="PX4 +"
            accent="Simulink + Unreal"
            subtitle="Three tools. One integrated pipeline. Each layer talks to the next — from high-level control design down to real motor commands."
          />
        </div>

        {/* Layer stack */}
        <div className="space-y-3 mb-16">
          {layers.map((layer, li) => (
            <div
              key={li}
              className="reveal"
              style={{ transitionDelay: `${li * 0.12}s` }}
            >
              <div
                className="font-mono text-xs tracking-widest mb-2"
                style={{ color: "#6b7280" }}
              >
                {layer.layer}
              </div>
              {layer.tools.map((tool, ti) => (
                <div
                  key={ti}
                  className="neon-border p-6 relative overflow-hidden group"
                  style={{
                    background: "#0f0f0f",
                    borderColor: `${tool.color}25`,
                  }}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: tool.color }}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3
                          className="font-heading font-bold text-xl"
                          style={{ color: tool.color }}
                        >
                          {tool.name}
                        </h3>
                        <span
                          className="font-mono text-xs"
                          style={{ color: "#6b7280" }}
                        >
                          / {tool.role}
                        </span>
                      </div>
                      <p className="font-mono text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                        {tool.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag, ti2) => (
                        <span
                          key={ti2}
                          className="font-mono text-xs px-2 py-1"
                          style={{
                            border: `1px solid ${tool.color}30`,
                            color: tool.color,
                            background: `${tool.color}08`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Workflow timeline */}
        <div className="reveal" style={{ transitionDelay: "0.5s" }}>
          <div className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: "#6b7280" }}>
            Development Workflow
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflow.map((w, i) => (
              <div key={i} className="relative">
                <div
                  className="font-display text-5xl mb-2"
                  style={{ color: "rgba(0,245,255,0.15)" }}
                >
                  {w.step}
                </div>
                <h4 className="font-heading font-semibold text-sm mb-1" style={{ color: "#F0F0F0" }}>
                  {w.title}
                </h4>
                <p className="font-mono text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                  {w.desc}
                </p>
                {i < workflow.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-6 -right-2 w-4 h-px"
                    style={{ background: "rgba(0,245,255,0.2)" }}
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
