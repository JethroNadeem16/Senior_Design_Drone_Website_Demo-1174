import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class DroneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <DroneFallback />;
    return this.props.children;
  }
}

function DroneFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {/* SVG schematic of a quad from above */}
      <svg
        viewBox="0 0 260 260"
        width="220"
        height="220"
        style={{ opacity: 0.85 }}
      >
        {/* Arm lines */}
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz], i) => (
          <line
            key={i}
            x1="130" y1="130"
            x2={130 + sx * 85} y2={130 + sz * 85}
            stroke="#00F5FF" strokeWidth="5" strokeLinecap="round"
            opacity="0.7"
          />
        ))}
        {/* Motor circles */}
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz], i) => (
          <g key={i}>
            <circle cx={130 + sx * 85} cy={130 + sz * 85} r="20"
              fill="#0f0f0f" stroke="#00F5FF" strokeWidth="1.5" opacity="0.9" />
            <circle cx={130 + sx * 85} cy={130 + sz * 85} r="5"
              fill="#00F5FF" opacity="0.7" />
            {/* Prop arc */}
            <circle cx={130 + sx * 85} cy={130 + sz * 85} r="28"
              fill="none" stroke="#00F5FF" strokeWidth="1"
              strokeDasharray="6 4" opacity="0.3" />
          </g>
        ))}
        {/* Center body */}
        <rect x="105" y="105" width="50" height="50" rx="4"
          fill="#0a0a0a" stroke="#4D9FFF" strokeWidth="1.5" />
        {/* Pixhawk outline */}
        <rect x="116" y="116" width="28" height="28" rx="2"
          fill="#0d2137" stroke="#4D9FFF" strokeWidth="1" />
        {/* LED dots */}
        <circle cx="122" cy="122" r="2" fill="#00F5FF" opacity="0.9" />
        <circle cx="130" cy="122" r="2" fill="#4D9FFF" opacity="0.9" />
        <circle cx="138" cy="122" r="2" fill="#39FF14" opacity="0.9" />
        {/* GPS mast */}
        <line x1="130" y1="105" x2="130" y2="80" stroke="#888" strokeWidth="1.5" />
        <circle cx="130" cy="75" r="7" fill="#0f0f0f" stroke="#aaa" strokeWidth="1" />
        <circle cx="130" cy="75" r="3" fill="#00F5FF" opacity="0.6" />
        {/* Battery */}
        <rect x="102" y="165" width="56" height="16" rx="2"
          fill="#111" stroke="#555" strokeWidth="1" />
        <rect x="102" y="166" width="56" height="5" rx="1" fill="#c8a020" opacity="0.5" />
      </svg>

      <div className="text-center">
        <div className="font-heading font-bold text-base mb-1" style={{ color: "#00F5FF" }}>
          QAV250 — Top View
        </div>
        <div className="font-mono text-xs" style={{ color: "#6b7280" }}>
          3D viewer requires WebGL
        </div>
      </div>
    </div>
  );
}
