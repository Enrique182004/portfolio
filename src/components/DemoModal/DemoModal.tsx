"use client";

import { useEffect } from "react";

interface DemoModalProps {
  url: string;
  name: string;
  onClose: () => void;
}

export default function DemoModal({ url, name, onClose }: DemoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6, 6, 16, 0.88)",
        backdropFilter: "blur(8px)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 1100,
          height: "85vh",
          background: "var(--bg-deep)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--purple-core)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 3,
              color: "var(--purple-light)",
            }}
          >
            {name.toUpperCase()}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "auto",
              fontSize: 8,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              letterSpacing: 2,
              textDecoration: "none",
            }}
          >
            ↗ OPEN
          </a>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: 2,
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            [ ESC ]
          </button>
        </div>
        <iframe
          src={url}
          title={name}
          style={{ flex: 1, border: "none", background: "#fff" }}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
