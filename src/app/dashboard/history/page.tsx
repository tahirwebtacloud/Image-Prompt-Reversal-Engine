"use client";

import { useState, useEffect } from "react";

interface HistoryItem {
  id: number;
  image_name: string;
  analysis_json: Record<string, unknown>;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (res.ok) setHistory(data.history || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fade-in">
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
          Analysis History
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "500" }}>
          Your intelligence archive of past design deconstructions
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer" style={{ height: "100px" }} />
          ))}
        </div>
      )}

      {!loading && history.length === 0 && (
        <div
          className="glass-card"
          style={{
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            No analyses yet
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Upload an image on the Analyze tab to get started
          </p>
          <a href="/dashboard" className="btn-primary">
            Go to Analyze
          </a>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div
          className="stagger-children"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {history.map((item) => {
            const analysis = item.analysis_json as Record<string, unknown>;
            const recommendations = analysis?.recommendations as Record<string, unknown> | undefined;
            const colorAnalysis = analysis?.colorAnalysis as Record<string, unknown> | undefined;
            const score = (recommendations?.overallScore as number) || 0;
            const colors = (colorAnalysis?.extractedColors as Array<Record<string, string>>) || [];
            const isExpanded = expandedId === item.id;
            const promptText = String(analysis?.reverseEngineeredPrompt || "");
            const reasoningText = String(recommendations?.scoreReasoning || "");

            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() =>
                  setExpandedId(isExpanded ? null : item.id)
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  {/* Score */}
                  <div
                    className="score-badge"
                    style={{
                      background:
                        score >= 7
                          ? "var(--green-dim)"
                          : score >= 5
                          ? "var(--amber-dim)"
                          : "var(--red-dim)",
                      color:
                        score >= 7
                          ? "var(--green)"
                          : score >= 5
                          ? "var(--amber)"
                          : "var(--red)",
                      flexShrink: 0,
                    }}
                  >
                    {score}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: "600",
                        fontSize: "15px",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.image_name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDate(item.created_at)}
                    </div>
                  </div>

                  {/* Mini color swatches */}
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    {colors.slice(0, 5).map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          backgroundColor: c.hex,
                          border: "1px solid var(--border)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Expand icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                    style={{
                      transform: isExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {promptText && (
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--brand-yellow)",
                            fontWeight: "700",
                            marginBottom: "8px",
                          }}
                        >
                          Reverse-Engineered Prompt
                        </div>
                        <div
                          style={{
                            padding: "12px",
                            background: "var(--bg-primary)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            lineHeight: "1.6",
                            fontFamily: "monospace",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {promptText}
                        </div>
                      </div>
                    )}

                    {reasoningText && (
                      <div>
                        <div
                          style={{
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--brand-yellow)",
                            fontWeight: "700",
                            marginBottom: "8px",
                          }}
                        >
                          Score Reasoning
                        </div>
                        <div
                          style={{
                            padding: "12px",
                            background: "var(--bg-primary)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            lineHeight: "1.6",
                          }}
                        >
                          {reasoningText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
