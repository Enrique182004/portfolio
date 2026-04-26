export default function AboutPanel() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 22,
          letterSpacing: 3,
          color: "var(--text-bright)",
          marginBottom: 8,
        }}
      >
        Enrique Calleros
      </h2>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: 4,
          color: "var(--purple-light)",
          marginBottom: 32,
          textTransform: "uppercase",
        }}
      >
        Researcher &amp; Developer
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1",
            border: "1px solid var(--border)",
            borderRadius: 4,
            background: "rgba(45, 27, 105, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "1px solid var(--purple-core)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(124,58,237,0.3)",
            }}
          >
            <span style={{ fontSize: 32, color: "var(--purple-light)" }}>
              ⬡
            </span>
          </div>
        </div>

        <div>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.8,
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            Computer Science student at the University of Texas at El Paso
            (UTEP), focused on full-stack web development, machine learning, and
            building things that are actually useful. I work across the entire
            stack — from UI to infrastructure — and gravitate toward projects
            that combine data, interaction, and clean engineering.
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              { label: "University", value: "UTEP" },
              { label: "Degree", value: "Computer Science" },
              { label: "Focus", value: "Full Stack + AI/ML" },
              { label: "GitHub", value: "Enrique182004" },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  borderLeft: "2px solid var(--border)",
                  paddingLeft: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 8,
                    letterSpacing: 3,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-bright)" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
