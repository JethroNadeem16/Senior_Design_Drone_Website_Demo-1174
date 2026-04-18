import { useState, useEffect } from "react";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Hardware", href: "#hardware" },
  { label: "Software", href: "#software" },
  { label: "PID Tuning", href: "#pid" },
  { label: "Digital Twin", href: "#digital-twin" },
  { label: "Results", href: "#results" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navItems.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ border: "1px solid #00F5FF", boxShadow: "0 0 10px rgba(0,245,255,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 7L7 13L1 7L7 1Z" stroke="#00F5FF" strokeWidth="1.5" />
              <circle cx="7" cy="7" r="2" fill="#00F5FF" />
            </svg>
          </div>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            QAV250 <span style={{ color: "#00F5FF" }}>/ DTwin</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="nav-link"
              style={{
                color: activeSection === href.slice(1) ? "#00F5FF" : undefined,
              }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className="block w-5 h-px transition-all duration-200"
            style={{
              background: "#00F5FF",
              transform: menuOpen ? "rotate(45deg) translateY(4px)" : "none",
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-200"
            style={{
              background: "#00F5FF",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-200"
            style={{
              background: "#00F5FF",
              transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-5"
          style={{ background: "rgba(8,8,8,0.98)", borderBottom: "1px solid rgba(0,245,255,0.15)" }}
        >
          {navItems.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="nav-link text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
