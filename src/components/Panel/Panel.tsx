"use client";

import { useRef, useState, useEffect, MutableRefObject } from "react";
import { NodeId } from "@/types/node";
import { CanvasState } from "@/components/StarMap/starmap.types";
import { usePanel } from "./use-panel";

interface PanelProps {
  activeNodeId: NodeId | null;
  onClose: () => void;
  canvasStateRef: MutableRefObject<CanvasState>;
  children: React.ReactNode;
}

export default function Panel({
  activeNodeId,
  onClose,
  canvasStateRef,
  children,
}: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [displayedNodeId, setDisplayedNodeId] = useState<NodeId | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeNodeId) {
      setDisplayedNodeId(activeNodeId);
      setIsVisible(true);
    }
  }, [activeNodeId]);

  usePanel({
    activeNodeId,
    panelRef,
    canvasStateRef,
    onCloseComplete: () => {
      setIsVisible(false);
      setDisplayedNodeId(null);
    },
  });

  if (!isVisible && !activeNodeId) return null;

  const LABELS: Record<NodeId, string> = {
    hero: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    "ai-ml": "AI / ML",
    contact: "Contact",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "transparent",
          zIndex: 10,
          display: isVisible ? "block" : "none",
        }}
      />
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: "5%",
          right: "5%",
          height: "78vh",
          background: "rgba(9, 9, 26, 0.96)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--purple-core)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          borderRadius: "8px 8px 0 0",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          transform: "translateY(100%)",
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
            padding: "12px 24px",
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
              boxShadow: "0 0 8px var(--purple-core)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 4,
              color: "var(--purple-light)",
              textTransform: "uppercase",
            }}
          >
            {displayedNodeId ? LABELS[displayedNodeId] : ""}
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: 2,
              cursor: "pointer",
            }}
          >
            [ ESC ]
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {children}
        </div>
      </div>
    </>
  );
}
