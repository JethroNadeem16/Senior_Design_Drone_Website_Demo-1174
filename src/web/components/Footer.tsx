export default function Footer() {
  return (
    <footer
      className="py-16 px-6 relative"
      style={{ background: "#060606", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ border: "1px solid #00F5FF", boxShadow: "0 0 10px rgba(0,245,255,0.3)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 7L7 13L1 7L7 1Z" stroke="#00F5FF" strokeWidth="1.5" />
                  <circle cx="7" cy="7" r="2" fill="#00F5FF" />
                </svg>
              </div>
              <span className="font-display text-xl" style={{ color: "#F0F0F0" }}>
                QAV250 DIGITAL TWIN
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed" style={{ color: "#6b7280", maxWidth: "280px" }}>
              A Senior Design Project exploring model-based drone programming, PID control tuning, and digital twin validation.
            </p>
          </div>

          {/* Tech stack */}
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#6b7280" }}>
              Built With
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "QAV250", "Pixhawk 6C Mini", "PX4 Autopilot", "Simulink",
                "PX4 Toolbox", "Embedded Coder", "Unreal Engine 5", "Colosseum/AirSim", "MAVLink"
              ].map((t) => (
                <span key={t} className="tag" style={{ fontSize: "0.6rem" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#6b7280" }}>
              In Collaboration With
            </div>
            <div className="space-y-3">
              <div
                className="font-heading font-semibold"
                style={{ color: "#00F5FF" }}
              >
                MathWorks
              </div>
              <p className="font-mono text-xs" style={{ color: "#6b7280" }}>
                Project documentation to be featured on the MathWorks platform.
              </p>
            </div>
          </div>
        </div>

        <div className="scan-line mb-6" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs" style={{ color: "#6b7280" }}>
            Senior Design Project — In Progress
          </span>
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#39FF14", boxShadow: "0 0 6px #39FF14" }}
            />
            <span className="font-mono text-xs" style={{ color: "#39FF14" }}>
              Project Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
