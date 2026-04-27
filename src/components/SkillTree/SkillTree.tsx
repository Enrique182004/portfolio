"use client";

import { useState } from "react";

interface Skill {
  id: string;
  label: string;
  proficiency: number; // 0–5 filled dots
  projects?: string[];
}

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  dim: string;
  skills: Skill[];
}

const CATEGORIES: Category[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "◈",
    color: "#a78bfa",
    dim: "rgba(167,139,250,0.12)",
    skills: [
      {
        id: "react",
        label: "React / Next.js",
        proficiency: 5,
        projects: ["Portfolio", "ToDoList"],
      },
      {
        id: "html",
        label: "HTML5 / CSS3",
        proficiency: 5,
        projects: ["Portfolio"],
      },
      {
        id: "js",
        label: "JavaScript / TS",
        proficiency: 4,
        projects: ["Portfolio", "Crawler"],
      },
      {
        id: "d3",
        label: "D3.js / Recharts",
        proficiency: 4,
        projects: ["Visualizations"],
      },
      { id: "figma", label: "Figma", proficiency: 3 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "⬡",
    color: "#60a5fa",
    dim: "rgba(96,165,250,0.12)",
    skills: [
      {
        id: "node",
        label: "Node.js",
        proficiency: 4,
        projects: ["Portfolio", "Crawler"],
      },
      {
        id: "python",
        label: "Flask / FastAPI",
        proficiency: 4,
        projects: ["Crawler", "ML APIs"],
      },
      { id: "java", label: "Java / Java Swing", proficiency: 4 },
      { id: "sql", label: "SQL / Firebase", proficiency: 4 },
      { id: "docker", label: "Docker", proficiency: 3, projects: ["Crawler"] },
    ],
  },
  {
    id: "aiml",
    label: "AI / ML",
    icon: "◎",
    color: "#34d399",
    dim: "rgba(52,211,153,0.12)",
    skills: [
      {
        id: "sklearn",
        label: "scikit-learn",
        proficiency: 4,
        projects: ["Classifiers"],
      },
      {
        id: "xgboost",
        label: "XGBoost",
        proficiency: 4,
        projects: ["Classifiers"],
      },
      {
        id: "pandas",
        label: "Pandas / NumPy",
        proficiency: 5,
        projects: ["Data pipelines"],
      },
      { id: "jupyter", label: "Jupyter", proficiency: 5 },
      {
        id: "restapi",
        label: "REST APIs",
        proficiency: 4,
        projects: ["Crawler", "Portfolio"],
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: "◇",
    color: "#f59e0b",
    dim: "rgba(245,158,11,0.12)",
    skills: [
      {
        id: "php",
        label: "PHP",
        proficiency: 3,
        projects: ["Connect4-PHP-Server"],
      },
      {
        id: "dart",
        label: "Dart (Flutter)",
        proficiency: 3,
        projects: ["Connect4-Dart"],
      },
      {
        id: "haskell",
        label: "Haskell",
        proficiency: 2,
        projects: ["Connect4-Haskell"],
      },
      { id: "git", label: "Git / GitHub", proficiency: 5 },
      { id: "androidstudio", label: "Android Studio", proficiency: 3 },
    ],
  },
];

function Dots({ filled, color }: { filled: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i < filled ? color : "rgba(255,255,255,0.08)",
            boxShadow: i < filled ? `0 0 4px ${color}` : "none",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function SkillNode({
  skill,
  color,
  dim,
  isLast,
}: {
  skill: Skill;
  color: string;
  dim: string;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      {/* Spine segment */}
      <div
        style={{
          position: "absolute",
          left: 11,
          top: 0,
          bottom: isLast ? "50%" : 0,
          width: 1,
          background: `linear-gradient(to bottom, ${color}44, ${color}22)`,
        }}
      />

      {/* Branch connector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 18,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: hovered ? color : `${color}88`,
            boxShadow: hovered ? `0 0 8px ${color}` : `0 0 4px ${color}44`,
            border: `1px solid ${color}`,
            flexShrink: 0,
            zIndex: 1,
            transition: "all 0.2s",
            marginLeft: 8,
          }}
        />
        <div
          style={{
            width: 16,
            height: 1,
            background: hovered ? `${color}cc` : `${color}44`,
            transition: "background 0.2s",
          }}
        />
      </div>

      {/* Node box */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1,
          marginTop: 10,
          marginBottom: 6,
          padding: "8px 12px",
          background: hovered ? dim : "rgba(255,255,255,0.02)",
          border: `1px solid ${hovered ? color + "88" : color + "33"}`,
          borderLeft: `2px solid ${hovered ? color : color + "66"}`,
          borderRadius: "0 4px 4px 0",
          cursor: "default",
          transition: "all 0.2s",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 1,
            color: hovered ? "#e9d5ff" : "var(--text-muted)",
            marginBottom: 4,
            transition: "color 0.2s",
          }}
        >
          {skill.label}
        </div>
        <Dots filled={skill.proficiency} color={color} />

        {/* Tooltip */}
        {hovered && skill.projects && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              left: 0,
              background: "#0a0a18",
              border: `1px solid ${color}44`,
              borderRadius: 3,
              padding: "5px 10px",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              letterSpacing: 1,
              color: color,
              whiteSpace: "nowrap",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            Used in: {skill.projects.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryColumn({ cat }: { cat: Category }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: "0 8px" }}>
      {/* Category header */}
      <div
        style={{
          padding: "12px 14px",
          background: cat.dim,
          border: `1px solid ${cat.color}66`,
          borderTop: `2px solid ${cat.color}`,
          borderRadius: "4px 4px 0 0",
          marginBottom: 0,
          boxShadow: `0 0 16px ${cat.color}22`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 14, color: cat.color }}>{cat.icon}</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: 3,
              color: cat.color,
              textTransform: "uppercase",
            }}
          >
            {cat.label}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: 2,
            color: `${cat.color}88`,
          }}
        >
          {cat.skills.length} SKILLS
        </div>
      </div>

      {/* Spine start */}
      <div
        style={{
          marginLeft: 11,
          width: 1,
          height: 12,
          background: `linear-gradient(to bottom, ${cat.color}44, ${cat.color}22)`,
        }}
      />

      {/* Skill nodes */}
      <div>
        {cat.skills.map((skill, i) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            color={cat.color}
            dim={cat.dim}
            isLast={i === cat.skills.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function SkillTree() {
  return (
    <div>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          padding: "8px 12px",
          background: "rgba(45,27,105,0.08)",
          border: "1px solid var(--border)",
          borderRadius: 3,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: 2,
            color: "var(--text-muted)",
          }}
        >
          PROFICIENCY
        </span>
        {["LEARNING", "FAMILIAR", "CAPABLE", "PROFICIENT", "EXPERT"].map(
          (label, i) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 2,
                }}
              >
                {Array.from({ length: 5 }, (_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: j <= i ? "#a78bfa" : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 7,
                  letterSpacing: 1,
                  color: "var(--text-muted)",
                }}
              >
                {label}
              </span>
            </div>
          ),
        )}
      </div>

      {/* 4-column tree */}
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
        {CATEGORIES.map((cat) => (
          <CategoryColumn key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
