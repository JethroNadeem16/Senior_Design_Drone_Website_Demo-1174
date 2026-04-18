import { useState } from "react";
import { useReveal } from "./useReveal";
import SectionHeader from "./SectionHeader";

const categories = ["All", "Hardware", "Simulation", "Software", "Testing"];

const placeholders = [
  {
    id: 1,
    cat: "Hardware",
    title: "QAV250 Frame Assembly",
    desc: "Carbon fiber frame with motor mounts",
    aspect: "wide",
    color: "#00F5FF",
  },
  {
    id: 2,
    cat: "Hardware",
    title: "Pixhawk 6C Mini",
    desc: "Flight controller with GPS module",
    aspect: "square",
    color: "#4D9FFF",
  },
  {
    id: 3,
    cat: "Simulation",
    title: "UE5 Environment",
    desc: "Digital twin flight arena",
    aspect: "square",
    color: "#39FF14",
  },
  {
    id: 4,
    cat: "Simulation",
    title: "HIL Setup",
    desc: "Hardware-in-the-loop workbench",
    aspect: "wide",
    color: "#4D9FFF",
  },
  {
    id: 5,
    cat: "Software",
    title: "Simulink Model",
    desc: "PX4 Autopilot Toolbox block diagram",
    aspect: "square",
    color: "#00F5FF",
  },
  {
    id: 6,
    cat: "Software",
    title: "PID Tuning Scope",
    desc: "Real-time response plots in Simulink",
    aspect: "square",
    color: "#F0A500",
  },
  {
    id: 7,
    cat: "Testing",
    title: "Bench Test",
    desc: "Motor + ESC power verification",
    aspect: "square",
    color: "#39FF14",
  },
  {
    id: 8,
    cat: "Hardware",
    title: "Full Build",
    desc: "Completed QAV250 with all electronics",
    aspect: "wide",
    color: "#00F5FF",
  },
];

export default function Gallery() {
  const ref = useReveal();
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered =
    active === "All" ? placeholders : placeholders.filter((p) => p.cat === active);

  return (
    <section id="gallery" className="py-32 px-6 relative" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="reveal">
          <SectionHeader
            number="07"
            label="Gallery / Media"
            title="Build &"
            accent="Progress"
            subtitle="Hardware, simulation screenshots, software diagrams, and flight footage."
          />
        </div>

        {/* Filter tabs */}
        <div className="reveal flex flex-wrap gap-2 mb-10" style={{ transitionDelay: "0.1s" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200"
              style={{
                border: `1px solid ${active === cat ? "#00F5FF" : "rgba(255,255,255,0.1)"}`,
                color: active === cat ? "#00F5FF" : "#6b7280",
                background: active === cat ? "rgba(0,245,255,0.06)" : "transparent",
                boxShadow: active === cat ? "0 0 12px rgba(0,245,255,0.15)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="reveal grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          style={{ transitionDelay: "0.2s" }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden cursor-pointer group ${item.aspect === "wide" ? "col-span-2" : ""}`}
              style={{ aspectRatio: item.aspect === "wide" ? "16/9" : "1/1" }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Placeholder background */}
              <div
                className="absolute inset-0 hud-grid"
                style={{
                  background: "#0f0f0f",
                  border: `1px solid ${hovered === item.id ? item.color + "40" : "rgba(255,255,255,0.06)"}`,
                  transition: "border-color 0.2s",
                }}
              />

              {/* Centered icon / placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div
                  className="text-5xl mb-3 transition-all duration-300"
                  style={{
                    color: item.color,
                    opacity: hovered === item.id ? 1 : 0.25,
                    filter: hovered === item.id ? `drop-shadow(0 0 15px ${item.color})` : "none",
                    transform: hovered === item.id ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {item.cat === "Hardware" ? "⬡" : item.cat === "Simulation" ? "◎" : item.cat === "Software" ? "◈" : "◇"}
                </div>
                <div
                  className="font-heading font-semibold text-center text-sm transition-colors duration-200"
                  style={{ color: hovered === item.id ? "#F0F0F0" : "#9ca3af" }}
                >
                  {item.title}
                </div>
                <div
                  className="font-mono text-xs text-center mt-1 transition-colors duration-200"
                  style={{ color: hovered === item.id ? "#6b7280" : "rgba(107,114,128,0.5)" }}
                >
                  {item.desc}
                </div>
                <span
                  className="tag mt-3 transition-opacity duration-200"
                  style={{
                    opacity: hovered === item.id ? 1 : 0.3,
                    borderColor: item.color + "50",
                    color: item.color,
                  }}
                >
                  {item.cat}
                </span>
              </div>

              {/* Corner HUD decorations */}
              <div
                className="absolute top-2 left-2 w-4 h-4 transition-opacity duration-200"
                style={{
                  borderTop: `1px solid ${item.color}`,
                  borderLeft: `1px solid ${item.color}`,
                  opacity: hovered === item.id ? 0.8 : 0.2,
                }}
              />
              <div
                className="absolute bottom-2 right-2 w-4 h-4 transition-opacity duration-200"
                style={{
                  borderBottom: `1px solid ${item.color}`,
                  borderRight: `1px solid ${item.color}`,
                  opacity: hovered === item.id ? 0.8 : 0.2,
                }}
              />

              {/* "Coming soon" overlay for placeholder */}
              <div
                className="absolute inset-0 flex items-end justify-end p-3 transition-opacity duration-200"
                style={{ opacity: hovered === item.id ? 1 : 0 }}
              >
                <span className="font-mono text-xs" style={{ color: item.color, opacity: 0.6 }}>
                  MEDIA COMING SOON
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Upload note */}
        <div
          className="reveal mt-8 p-4 flex items-center gap-3"
          style={{
            background: "rgba(0,245,255,0.03)",
            border: "1px solid rgba(0,245,255,0.1)",
            transitionDelay: "0.3s",
          }}
        >
          <span style={{ color: "#00F5FF" }}>◈</span>
          <span className="font-mono text-xs" style={{ color: "#6b7280" }}>
            Media gallery will be updated with real photos, UE5 screenshots, Simulink diagrams, and flight footage as the project progresses.
          </span>
        </div>
      </div>
    </section>
  );
}
