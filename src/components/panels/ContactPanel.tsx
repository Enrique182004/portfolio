"use client";

import { useState, FormEvent } from "react";

export default function ContactPanel() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(45,27,105,0.1)",
    border: "1px solid var(--border)",
    borderRadius: 3,
    padding: "10px 14px",
    color: "var(--text-bright)",
    fontFamily: "var(--font-body)",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 18,
          letterSpacing: 3,
          color: "var(--text-bright)",
          marginBottom: 6,
        }}
      >
        Contact
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
        Get in touch
      </p>

      <div
        style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}
      >
        {[
          {
            label: "GitHub",
            href: "https://github.com/Enrique182004",
            icon: "⌥",
          },
          {
            label: "Email",
            href: "mailto:ecalleros4@miners.utep.edu",
            icon: "✉",
          },
        ].map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              border: "1px solid var(--border)",
              borderRadius: 3,
              color: "var(--purple-light)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 2,
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--purple-core)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          >
            <span>{icon}</span> {label}
          </a>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <input name="name" required placeholder="Name" style={inputStyle} />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            style={inputStyle}
          />
        </div>
        <textarea
          name="message"
          required
          placeholder="Message"
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          style={{
            padding: "10px 24px",
            background: "rgba(124,58,237,0.2)",
            border: "1px solid var(--purple-core)",
            borderRadius: 3,
            color: "var(--text-bright)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: 3,
            cursor: status === "sent" ? "default" : "pointer",
            boxShadow: "0 0 12px rgba(124,58,237,0.2)",
          }}
        >
          {status === "idle" && "SEND MESSAGE"}
          {status === "sending" && "SENDING..."}
          {status === "sent" && "MESSAGE SENT ✓"}
          {status === "error" && "RETRY"}
        </button>
      </form>
    </div>
  );
}
