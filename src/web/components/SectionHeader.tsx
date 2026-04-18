interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  accent?: string;
  subtitle?: string;
}

export default function SectionHeader({
  number,
  label,
  title,
  accent,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="relative mb-16">
      {/* Big background number */}
      <div
        className="section-number absolute -top-6 -left-2 select-none pointer-events-none"
        aria-hidden="true"
      >
        {number}
      </div>

      <div className="relative">
        <span className="tag mb-4 block w-fit">{label}</span>
        <h2
          className="font-heading font-bold leading-tight"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#F0F0F0" }}
        >
          {title}{" "}
          {accent && (
            <span className="glow-cyan" style={{ color: "#00F5FF" }}>
              {accent}
            </span>
          )}
        </h2>
        {subtitle && (
          <p
            className="font-mono text-sm mt-4 leading-relaxed"
            style={{ color: "#6b7280", maxWidth: "560px" }}
          >
            {subtitle}
          </p>
        )}
        <div className="scan-line mt-6" style={{ maxWidth: "200px" }} />
      </div>
    </div>
  );
}
