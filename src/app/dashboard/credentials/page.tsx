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

  // Public API Keys state
  const [publicKeys, setPublicKeys] = useState<{ id: number; name: string; last_four: string; created_at: string }[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchPublicKeys();
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

  const fetchPublicKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (res.ok) setPublicKeys(data.keys);
    } catch {
      // ignore
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

  const handleGeneratePublicKey = async () => {
    if (!newKeyName.trim()) return;
    setIsGeneratingKey(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedKey(data.key.plainKey);
        setNewKeyName("");
        await fetchPublicKeys();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to generate key" });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokePublicKey = async (id: number) => {
    if (!confirm("Are you sure you want to revoke this API key? External apps using it will immediately lose access.")) return;
    try {
      const res = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchPublicKeys();
        setMessage({ type: "success", text: "API key revoked successfully." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to revoke key." });
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "32px",
            fontWeight: "900",
            letterSpacing: "-0.04em",
            marginBottom: "12px",
            textTransform: "uppercase",
            color: "var(--brand-yellow)",
          }}
        >
          Credentials
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "500" }}>
          Manage your AI intelligence keys and external access
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
            style={{ color: "var(--brand-yellow)", fontWeight: "600" }}
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

      {/* Public API Keys Section */}
      <div style={{ marginTop: "40px", marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Public API Access
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
          Generate API keys to access the Post Analyzer from external applications.
        </p>

        {/* Key Generation */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "24px", border: "1px solid var(--primary-dim)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Generate New Key</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              className="input-field"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key Name (e.g. My External App)"
              style={{ flex: 1 }}
            />
            <button
              className="btn-primary"
              onClick={handleGeneratePublicKey}
              disabled={isGeneratingKey || !newKeyName.trim()}
              style={{ whiteSpace: "nowrap" }}
            >
              {isGeneratingKey ? "Generating..." : "Generate Key"}
            </button>
          </div>

          {generatedKey && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: "var(--amber-dim)",
                border: "1px solid var(--amber-bright)",
                borderRadius: "var(--radius-sm)",
                color: "var(--amber-bright)",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "8px", fontSize: "14px" }}>
                ⚠️ Copy your API key now!
              </div>
              <div style={{ fontSize: "13px", marginBottom: "12px" }}>
                For security, we cannot show this key again once you leave this page.
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <code
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    flex: 1,
                    fontFamily: "monospace",
                    fontSize: "14px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {generatedKey}
                </code>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey);
                    setMessage({ type: "success", text: "Copied to clipboard!" });
                  }}
                  style={{ padding: "8px" }}
                >
                  Copy
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setGeneratedKey(null)}
                  style={{ padding: "8px" }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Keys List */}
        <div className="glass-card" style={{ padding: "0" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--white-10)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "600" }}>Active API Keys</h3>
          </div>
          {publicKeys.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
              No active API keys found.
            </div>
          ) : (
            <div>
              {publicKeys.map((key) => (
                <div
                  key={key.id}
                  style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid var(--white-10)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>{key.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      Key: <code style={{ color: "var(--brand-yellow)", fontWeight: "700" }}>sk_••••••••{key.last_four}</code> • Created {new Date(key.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="btn-link"
                    onClick={() => handleRevokePublicKey(key.id)}
                    style={{ color: "var(--red-bright)", fontSize: "12px", fontWeight: "500" }}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <a
            href="/dashboard/docs"
            style={{
              color: "var(--brand-yellow)",
              fontSize: "13px",
              fontWeight: "700",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            View API Documentation
          </a>
        </div>
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
