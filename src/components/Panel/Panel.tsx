"use client";

import { MutableRefObject, RefObject } from "react";
import { NodeId } from "@/types/node";
import { CanvasState } from "@/components/StarMap/starmap.types";

interface PanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  activeNodeId: NodeId | null;
  displayedNodeId: NodeId | null;
  onClose: () => void;
  canvasStateRef: MutableRefObject<CanvasState>;
  children: React.ReactNode;
}

const LABELS: Record<NodeId, string> = {
  hero: "Home",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  "ai-ml": "AI / ML",
  games: "Games",
  contact: "Contact",
};

export default function Panel({
  panelRef,
  displayedNodeId,
  onClose,
  children,
}: PanelProps) {
  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 20,
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 28px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: 2,
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: 2,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--purple-light)";
            e.currentTarget.style.color = "var(--purple-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          ← BACK
        </button>
        <div
          style={{
            width: 1,
            height: 16,
            background: "var(--border)",
            marginLeft: 4,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 4,
            color: "var(--purple-light)",
            textTransform: "uppercase",
          }}
        >
          {displayedNodeId ? LABELS[displayedNodeId] : ""}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
        {children}
      </div>
    </div>
  );
}
