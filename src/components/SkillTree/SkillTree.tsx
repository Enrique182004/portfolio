"use client";

import { useState } from "react";
import { SkillNode, SKILL_TREE } from "./skill-tree-data";

interface TooltipState {
  nodeId: string | null;
  x: number;
  y: number;
}

function SkillLeaf({ node, depth }: { node: SkillNode; depth: number }) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    nodeId: null,
    x: 0,
    y: 0,
  });
  const isLeaf = !node.children || node.children.length === 0;

  const borderColor =
    depth === 0
      ? "var(--purple-light)"
      : depth === 1
        ? "var(--purple-core)"
        : "var(--border)";
  const textColor =
    depth === 0
      ? "var(--text-bright)"
      : depth === 1
        ? "var(--purple-light)"
        : "var(--text-muted)";
  const fontSize = depth === 0 ? 13 : depth === 1 ? 11 : 10;
  const glowAlpha = node.proficiency * 0.5;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        onMouseEnter={(e) =>
          isLeaf && setTooltip({ nodeId: node.id, x: e.clientX, y: e.clientY })
        }
        onMouseLeave={() => setTooltip({ nodeId: null, x: 0, y: 0 })}
        style={{
          position: "relative",
          padding: "5px 14px",
          border: `1px solid ${borderColor}`,
          borderRadius: 3,
          fontSize,
          fontFamily: "var(--font-mono)",
          letterSpacing: 2,
          color: textColor,
          background: `rgba(45, 27, 105, ${node.proficiency * 0.12})`,
          boxShadow:
            depth <= 1
              ? `0 0 ${node.proficiency * 12}px rgba(167, 139, 250, ${glowAlpha})`
              : "none",
          whiteSpace: "nowrap",
          cursor: isLeaf ? "default" : "default",
        }}
      >
        {node.label}

        {tooltip.nodeId === node.id && node.projects && (
          <div
            style={{
              position: "fixed",
              left: tooltip.x + 12,
              top: tooltip.y - 32,
              background: "var(--bg-deep)",
              border: "1px solid var(--border)",
              borderRadius: 3,
              padding: "6px 10px",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              letterSpacing: 1,
              color: "var(--text-muted)",
              zIndex: 100,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Used in: {node.projects.join(", ")}
          </div>
        )}
      </div>

      {node.children && (
        <>
          <div
            style={{
              width: 1,
              height: 14,
              background:
                "linear-gradient(to bottom, var(--border), transparent)",
            }}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {node.children.map((child) => (
              <div
                key={child.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 1,
                    height: 10,
                    background: "var(--border)",
                  }}
                />
                <SkillLeaf node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SkillTree() {
  return (
    <div style={{ overflowX: "auto", padding: "8px 0 24px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "max-content",
        }}
      >
        <SkillLeaf node={SKILL_TREE} depth={0} />
      </div>
    </div>
  );
}
