"use client";

import { useState, useEffect } from "react";

export default function CredentialsPage() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<{
    hasCredential: boolean;
    isValid: boolean;
    maskedKey: string | null;
    lastUpdated: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/credentials");
      const data = await res.json();
      if (res.ok) setStatus(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage({
        type: "success",
        text: "API key saved and validated successfully!",
      });
      setApiKey("");
      await fetchStatus();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Failed to save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your API key?")) return;
    setDeleting(true);

    try {
      const res = await fetch("/api/credentials", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setMessage({ type: "success", text: "API key removed successfully." });
      await fetchStatus();
    } catch {
      setMessage({ type: "error", text: "Failed to delete. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}
        >
          Credentials
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Manage your Gemini API key for image analysis
        </p>
      </div>

      {/* Current Status */}
      {!loading && (
        <div
          className="glass-card"
          style={{ padding: "24px", marginBottom: "24px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: status?.isValid
                  ? "var(--green-dim)"
                  : "var(--amber-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              {status?.isValid ? "✅" : "⚠️"}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {status?.hasCredential
                  ? "API Key Configured"
                  : "No API Key Set"}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                {status?.hasCredential
                  ? `Key: ${status.maskedKey}`
                  : "Add your Google AI Studio API key to start analyzing"}
              </div>
            </div>
          </div>

          {status?.hasCredential && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
                style={{ padding: "8px 16px", fontSize: "12px" }}
              >
                {deleting ? "Removing..." : "Remove Key"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Update Key */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          {status?.hasCredential ? "Update API Key" : "Add API Key"}
        </h3>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Google AI Studio API Key
          </label>
          <input
            type="password"
            className="input-field"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <div
          style={{
            padding: "12px",
            background: "var(--bg-primary)",
            borderRadius: "var(--radius-sm)",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          💡 Get your free API key from{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue-bright)" }}
          >
            Google AI Studio
          </a>
          . Your key is encrypted before storage and never shared.
        </div>

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving || !apiKey.trim()}
          style={{ width: "100%" }}
        >
          {saving ? (
            <>
              <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
              Validating & Saving...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save & Validate Key
            </>
          )}
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div
          className={`toast ${
            message.type === "success" ? "toast-success" : "toast-error"
          }`}
          onClick={() => setMessage(null)}
          style={{ cursor: "pointer" }}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="shimmer" style={{ height: "120px" }} />
          <div className="shimmer" style={{ height: "200px" }} />
        </div>
      )}
    </div>
  );
}
