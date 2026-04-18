import { useEffect, useRef, Suspense, lazy } from "react";
import { DroneErrorBoundary } from "./DroneErrorBoundary";

const DroneViewer = lazy(() => import("./DroneViewer"));

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const dots: { x: number; y: number; phase: number }[] = [];
    const spacing = 55;

    const buildDots = () => {
      dots.length = 0;
      for (let x = 0; x < canvas.width + spacing; x += spacing)
        for (let y = 0; y < canvas.height + spacing; y += spacing)
          dots.push({ x, y, phase: Math.random() * Math.PI * 2 });
    };
    buildDots();
    window.addEventListener("resize", buildDots);

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      dots.forEach((dot) => {
        const pulse = Math.sin(frame * 0.015 + dot.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 255, ${pulse * 0.18})`;
        ctx.fill();
      });

      // HUD corner brackets
      const w = canvas.width, h = canvas.height, sz = 36;
      ctx.strokeStyle = "rgba(0,245,255,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(20, 20 + sz); ctx.lineTo(20, 20); ctx.lineTo(20 + sz, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 20 - sz, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + sz); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, h - 20 - sz); ctx.lineTo(20, h - 20); ctx.lineTo(20 + sz, h - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 20 - sz, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - sz); ctx.stroke();

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", buildDots);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Animated dot-grid background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none", zIndex: 0 }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,245,255,0.06) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* ── Top bar: tags ── */}
      <div className="relative z-10 flex items-center gap-3 px-6 pt-28 pb-0 flex-wrap fade-up" style={{ animationDelay: "0.1s" }}>
        <span className="tag">Senior Design Project</span>
        <span className="tag" style={{ borderColor: "rgba(77,159,255,0.3)", color: "#4D9FFF" }}>
          In Collaboration with MathWorks
        </span>
        <span className="flex items-center gap-1.5 ml-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#39FF14", boxShadow: "0 0 8px #39FF14" }} />
          <span className="font-mono text-xs" style={{ color: "#39FF14" }}>ACTIVE</span>
        </span>
      </div>

      {/* ── Main layout: title left, drone center, stats right ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-0 px-6 py-4">

        {/* LEFT: Title block */}
        <div className="flex flex-col justify-center gap-4 lg:pr-4 order-2 lg:order-1 py-4 lg:py-0">
          <div className="fade-up" style={{ animationDelay: "0.2s" }}>
            {/* Glitch title */}
            <div className="relative">
              <div
                className="font-display absolute inset-0 pointer-events-none select-none glitch-layer"
                style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 0.95, color: "#00F5FF", opacity: 0.12 }}
              >
                AUTONOMOUS
              </div>
              <h1
                className="font-display"
                style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 0.95, color: "#F0F0F0" }}
              >
                AUTONOMOUS
              </h1>
            </div>
            <h1
              className="font-display glow-cyan"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 0.95, color: "#00F5FF" }}
            >
              FLIGHT
            </h1>
            <div
              className="font-display mt-1"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)", lineHeight: 1, color: "#4D9FFF" }}
            >
              DIGITAL TWIN
            </div>
          </div>

          <div className="scan-line fade-up" style={{ animationDelay: "0.3s", maxWidth: "240px" }} />

          <p
            className="font-mono text-sm leading-relaxed fade-up"
            style={{ color: "#9ca3af", maxWidth: "340px", animationDelay: "0.35s" }}
          >
            QAV250 quadcopter programmed via{" "}
            <span style={{ color: "#00F5FF" }}>Simulink</span> on a{" "}
            <span style={{ color: "#4D9FFF" }}>Pixhawk 6C Mini</span> —
            validated in an{" "}
            <span style={{ color: "#F0F0F0" }}>Unreal Engine</span> digital twin before real flight.
          </p>

          {/* CTA */}
          <div className="fade-up flex gap-3 flex-wrap" style={{ animationDelay: "0.45s" }}>
            <a
              href="#overview"
              className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-200"
              style={{
                border: "1px solid #00F5FF",
                color: "#00F5FF",
                background: "rgba(0,245,255,0.05)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.05)"; }}
            >
              Explore Project →
            </a>
            <a
              href="#hardware"
              className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#6b7280",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F0F0F0"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6b7280"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              Hardware Specs
            </a>
          </div>
        </div>

        {/* CENTER: 3D Drone — the star */}
        <div
          className="relative order-1 lg:order-2 fade-up"
          style={{
            minHeight: "520px",
            height: "clamp(520px, 70vh, 780px)",
            animationDelay: "0.15s",
          }}
        >
          {/* Glow under drone */}
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "260px",
              height: "40px",
              background: "radial-gradient(ellipse, rgba(0,245,255,0.18) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{ borderColor: "#00F5FF", borderTopColor: "transparent" }}
                  />
                  <span className="font-mono text-xs" style={{ color: "#6b7280" }}>
                    Loading drone...
                  </span>
                </div>
              </div>
            }
          >
            <DroneErrorBoundary>
              <DroneViewer />
            </DroneErrorBoundary>
          </Suspense>
        </div>

        {/* RIGHT: Live stats */}
        <div className="flex flex-col justify-center gap-3 lg:pl-4 order-3 py-4 lg:py-0">
          {[
            { label: "PLATFORM",    value: "QAV250",           sub: "Carbon Fiber Frame",       color: "#00F5FF" },
            { label: "FLIGHT CTRL", value: "Pixhawk 6C",       sub: "STM32H753 @ 480MHz",       color: "#4D9FFF" },
            { label: "AUTOPILOT",   value: "PX4",              sub: "Open-Source v1.14+",        color: "#39FF14" },
            { label: "DESIGN ENV",  value: "Simulink",         sub: "MathWorks PX4 Toolbox",    color: "#00F5FF" },
            { label: "SIMULATION",  value: "Unreal 5",         sub: "Colosseum / AirSim HIL",   color: "#4D9FFF" },
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card fade-up"
              style={{ animationDelay: `${0.3 + i * 0.08}s` }}
            >
              <div className="font-mono text-xs mb-0.5" style={{ color: "#6b7280", letterSpacing: "0.1em" }}>
                {stat.label}
              </div>
              <div className="font-heading font-bold text-lg leading-tight" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-mono text-xs" style={{ color: "#6b7280" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom: scroll hint ── */}
      <div className="relative z-10 flex justify-center pb-8">
        <div className="flex flex-col items-center gap-2 fade-up" style={{ animationDelay: "0.8s" }}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#6b7280" }}>Scroll</span>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(0,245,255,0.5), transparent)" }} />
        </div>
      </div>
    </section>
  );
}
