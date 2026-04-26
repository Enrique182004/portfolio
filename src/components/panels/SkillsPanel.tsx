import SkillTree from "@/components/SkillTree/SkillTree";

export default function SkillsPanel() {
  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 18,
          letterSpacing: 3,
          color: "var(--text-bright)",
          marginBottom: 6,
        }}
      >
        Skills
      </h2>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: 3,
          color: "var(--text-muted)",
          marginBottom: 32,
          textTransform: "uppercase",
        }}
      >
        Technology stack — hover leaf nodes for project context
      </p>
      <SkillTree />
    </div>
  );
}
