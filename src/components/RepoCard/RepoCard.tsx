"use client";

import { useState } from "react";
import { Repo } from "@/types/repo";
import DemoModal from "@/components/DemoModal/DemoModal";

interface RepoCardProps {
  repo: Repo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: "rgba(45, 27, 105, 0.06)",
          border: `1px solid ${hovered ? "var(--purple-core)" : "var(--border)"}`,
          borderRadius: 4,
          padding: 16,
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "0 8px 24px rgba(124,58,237,0.15)" : "none",
          transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        }}
      >
        {repo.isLive && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 7,
              padding: "2px 6px",
              background: "rgba(16,185,129,0.12)",
              border: "1px solid var(--green)",
              color: "var(--green)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
              letterSpacing: 1,
            }}
          >
            LIVE
          </div>
        )}

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-bright)",
            marginBottom: 8,
            paddingRight: repo.isLive ? 48 : 0,
          }}
        >
          {repo.name}
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: 12,
            minHeight: 36,
          }}
        >
          {repo.description ?? "No description"}
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          {repo.language && (
            <span
              style={{
                fontSize: 8,
                padding: "2px 6px",
                background: "rgba(124,58,237,0.12)",
                border: "1px solid var(--border)",
                color: "var(--purple-light)",
                borderRadius: 2,
                fontFamily: "var(--font-mono)",
                letterSpacing: 1,
              }}
            >
              {repo.language}
            </span>
          )}
          {repo.topics.slice(0, 2).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 8,
                padding: "2px 6px",
                background: "rgba(124,58,237,0.08)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                borderRadius: 2,
                fontFamily: "var(--font-mono)",
                letterSpacing: 1,
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              fontSize: 8,
              color: "var(--text-muted)",
              marginLeft: "auto",
            }}
          >
            ★ {repo.stargazers_count}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {repo.isLive && (
            <button
              onClick={() => setDemoOpen(true)}
              style={{
                fontSize: 8,
                padding: "4px 12px",
                background: "rgba(124,58,237,0.18)",
                border: "1px solid var(--purple-core)",
                color: "var(--text-bright)",
                borderRadius: 2,
                fontFamily: "var(--font-mono)",
                letterSpacing: 2,
                cursor: "pointer",
                boxShadow: "0 0 8px rgba(124,58,237,0.2)",
              }}
            >
              ▶ DEMO
            </button>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 8,
              padding: "4px 12px",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
              letterSpacing: 2,
              textDecoration: "none",
            }}
          >
            ⌥ CODE
          </a>
        </div>
      </div>

      {demoOpen && repo.homepage && (
        <DemoModal
          url={repo.homepage}
          name={repo.name}
          onClose={() => setDemoOpen(false)}
        />
      )}
    </>
  );
}
