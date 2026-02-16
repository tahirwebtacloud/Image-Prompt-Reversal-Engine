"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface AnalysisResult {
  postType: string;
  category: string;
  reverseEngineeredPrompt: string;
  designElements: {
    layout: string;
    visualHierarchy: string;
    focalPoint: string;
    whiteSpace: string;
    balance: string;
    microDetails?: {
      positioning: string;
      shadows: string;
      gradients: string;
      borders: string;
      textures: string;
    };
  };
  scrollStoppingFactors: Array<{
    factor: string;
    description: string;
    effectiveness: number;
  }>;
  colorAnalysis: {
    extractedColors: Array<{
      hex: string;
      name: string;
      usage: string;
      percentage: number;
    }>;
    harmony: string;
    psychology: string;
    score: number;
  };
  typographyAnalysis: {
    identifiedFonts: Array<{
      role: string;
      font: string;
      style: string;
      size: string;
    }>;
    pairingEffectiveness: string;
    readability: number;
    recommendedPairings: Array<{
      heading: string;
      body: string;
      rationale: string;
    }>;
  };
  hookAnalysis: {
    currentHook: string;
    emotionalResonance: number;
    effectiveness: string;
    alternativeHooks: string[];
  };
  recommendations: {
    fonts: Array<{
      name: string;
      useFor: string;
      rationale: string;
    }>;
    colorPalettes: Array<{
      name: string;
      colors: string[];
      rationale: string;
    }>;
    hooks: string[];
    layoutImprovements: string[];
    overallScore: number;
    scoreReasoning: string;
  };
  guidelineCompliance: {
    hookStrength: string;
    structureReadability: string;
    valueProposition: string;
    authenticityFactor: string;
    ctaEffectiveness: string;
    visualImpact: string;
  };
}

export default function AnalyzePage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, WebP, etc.)");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("Image must be less than 20MB");
      return;
    }

    setImageName(file.name);
    setMimeType(file.type);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove the data URL prefix to get pure base64
      const base64 = result.split(",")[1];
      setImageData(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
          }
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [processFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleAnalyze = async () => {
    if (!imageData) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageData,
          mimeType,
          imageName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
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
          Analyze Post
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Upload a social media post image to get a full design breakdown
        </p>
      </div>

      {/* Upload Area */}
      {!imageData ? (
        <div
          className={`drop-zone ${dragOver ? "dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "var(--blue-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--blue-bright)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                }}
              >
                Drop image here or click to upload
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                You can also paste (Ctrl+V) an image from your clipboard
              </p>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                padding: "6px 12px",
                background: "var(--bg-primary)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              JPEG, PNG, WebP, GIF · Max 20MB
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Image Preview + Controls */}
          <div
            className="glass-card"
            style={{ padding: "24px", marginBottom: "24px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  flex: "0 0 auto",
                  maxWidth: "300px",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <img
                  src={`data:${mimeType};base64,${imageData}`}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {imageName || "Pasted Image"}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    marginBottom: "20px",
                  }}
                >
                  Ready for analysis
                </p>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    className="btn-primary animate-pulse-glow"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    style={{ minWidth: "180px" }}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        Analyze with Gemini
                      </>
                    )}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setImageData(null);
                      setImageName("");
                      setAnalysis(null);
                      setError(null);
                    }}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div
          className="animate-fade-in-up"
          style={{
            padding: "16px 20px",
            background: "var(--red-dim)",
            border: "1px solid rgba(248, 81, 73, 0.3)",
            borderRadius: "var(--radius-md)",
            color: "var(--red)",
            fontSize: "14px",
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shimmer"
              style={{
                height: i === 1 ? "120px" : i === 2 ? "200px" : "160px",
              }}
            />
          ))}
          <p
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontFamily: "var(--font-heading)",
              marginTop: "8px",
            }}
          >
            🔍 Gemini 3 Pro is analyzing your image... This usually takes 15-30
            seconds
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div
          className="stagger-children"
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Overall Score */}
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              className="score-badge"
              style={{
                background:
                  analysis.recommendations.overallScore >= 7
                    ? "var(--green-dim)"
                    : analysis.recommendations.overallScore >= 5
                    ? "var(--amber-dim)"
                    : "var(--red-dim)",
                color:
                  analysis.recommendations.overallScore >= 7
                    ? "var(--green)"
                    : analysis.recommendations.overallScore >= 5
                    ? "var(--amber)"
                    : "var(--red)",
                width: "64px",
                height: "64px",
                fontSize: "24px",
              }}
            >
              {analysis.recommendations.overallScore}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                Design Score
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  maxWidth: "600px",
                }}
              >
                {analysis.recommendations.scoreReasoning}
              </p>
            </div>
          </div>

          {/* Type & Category Badges */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div
              className="glass-card"
              style={{
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: "1 1 auto",
              }}
            >
              <span style={{ fontSize: "20px" }}>📑</span>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                >
                  Type
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                  }}
                >
                  {analysis.postType || "Single Image"}
                </div>
              </div>
            </div>
            <div
              className="glass-card"
              style={{
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: "1 1 auto",
              }}
            >
              <span style={{ fontSize: "20px" }}>🏷️</span>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                >
                  Category
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                  }}
                >
                  {analysis.category || "General"}
                </div>
              </div>
            </div>
          </div>

          {/* Reverse Engineered Prompt */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "18px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🎯 Reverse-Engineered Prompt
              </h3>
              <button
                className="btn-secondary"
                style={{ padding: "6px 14px", fontSize: "12px" }}
                onClick={() =>
                  copyToClipboard(analysis.reverseEngineeredPrompt)
                }
              >
                📋 Copy
              </button>
            </div>
            <div
              style={{
                padding: "16px",
                background: "var(--bg-primary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                fontSize: "14px",
                lineHeight: "1.7",
                color: "var(--text-secondary)",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              {analysis.reverseEngineeredPrompt}
            </div>
          </div>

          {/* Design Elements */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📐 Design Elements
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {Object.entries(analysis.designElements).map(([key, value]) => {
                if (key === "microDetails" && typeof value === "object") {
                  return Object.entries(value || {}).map(([subKey, subValue]) => (
                    <div
                      key={subKey}
                      style={{
                        padding: "14px",
                        background: "var(--bg-primary)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                        borderLeft: "3px solid var(--blue-bright)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--blue-bright)",
                          marginBottom: "6px",
                        }}
                      >
                        {subKey}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          lineHeight: "1.5",
                        }}
                      >
                        {subValue as string}
                      </div>
                    </div>
                  ));
                }
                return (
                  <div
                    key={key}
                    style={{
                      padding: "14px",
                      background: "var(--bg-primary)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--blue-bright)",
                        marginBottom: "6px",
                      }}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {value as string}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll-Stopping Factors */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚡ Scroll-Stopping Factors
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {analysis.scrollStoppingFactors.map((factor, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    className="score-badge"
                    style={{
                      width: "36px",
                      height: "36px",
                      fontSize: "14px",
                      flexShrink: 0,
                      background:
                        factor.effectiveness >= 7
                          ? "var(--green-dim)"
                          : "var(--amber-dim)",
                      color:
                        factor.effectiveness >= 7
                          ? "var(--green)"
                          : "var(--amber)",
                    }}
                  >
                    {factor.effectiveness}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: "600",
                        fontSize: "14px",
                        marginBottom: "4px",
                      }}
                    >
                      {factor.factor}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {factor.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🎨 Color Analysis
              <span
                className="score-badge"
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "12px",
                  background: "var(--blue-dim)",
                  color: "var(--blue-bright)",
                }}
              >
                {analysis.colorAnalysis.score}
              </span>
            </h3>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              {analysis.colorAnalysis.extractedColors.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => copyToClipboard(color.hex)}
                  title={`Click to copy ${color.hex}`}
                >
                  <div
                    className="color-swatch"
                    style={{
                      backgroundColor: color.hex,
                      width: "48px",
                      height: "48px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      fontFamily: "monospace",
                    }}
                  >
                    {color.hex}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {color.usage}
                  </span>
                </div>
              ))}
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
              <strong style={{ color: "var(--text-primary)" }}>
                Psychology:{" "}
              </strong>
              {analysis.colorAnalysis.psychology}
            </div>
          </div>

          {/* Typography */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ✏️ Typography Analysis
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {analysis.typographyAnalysis.identifiedFonts.map((font, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--blue-bright)",
                      marginBottom: "6px",
                    }}
                  >
                    {font.role}
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      marginBottom: "2px",
                    }}
                  >
                    {font.font}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {font.style} · {font.size}
                  </div>
                </div>
              ))}
            </div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "10px",
                color: "var(--text-secondary)",
              }}
            >
              Recommended Pairings
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "10px",
              }}
            >
              {analysis.typographyAnalysis.recommendedPairings.map(
                (pair, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "14px",
                      background: "var(--bg-primary)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 8px",
                          background: "var(--blue-dim)",
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: "var(--blue-bright)",
                          fontWeight: "600",
                        }}
                      >
                        {pair.heading}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>+</span>
                      <span
                        style={{
                          padding: "2px 8px",
                          background: "var(--bg-elevated)",
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {pair.body}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        lineHeight: "1.5",
                      }}
                    >
                      {pair.rationale}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Hooks */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🪝 Hook & Copy Analysis
              <span
                className="score-badge"
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "12px",
                  background: "var(--amber-dim)",
                  color: "var(--amber)",
                }}
              >
                {analysis.hookAnalysis.emotionalResonance}
              </span>
            </h3>
            <div
              style={{
                padding: "14px",
                background: "var(--bg-primary)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Current Hook
              </div>
              <div
                style={{ fontWeight: "600", fontSize: "15px" }}
              >
                &ldquo;{analysis.hookAnalysis.currentHook}&rdquo;
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                  lineHeight: "1.5",
                }}
              >
                {analysis.hookAnalysis.effectiveness}
              </div>
            </div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "10px",
                color: "var(--text-secondary)",
              }}
            >
              Alternative Hooks
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {analysis.hookAnalysis.alternativeHooks.map((hook, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => copyToClipboard(hook)}
                >
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "var(--blue-dim)",
                      color: "var(--blue-bright)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  {hook}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              💡 Recommendations
            </h3>

            {/* Guideline Compliance (Strategic Analysis) */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🏆 Strategic Guideline Compliance
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "12px",
                }}
              >
                {Object.entries(analysis.guidelineCompliance).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      style={{
                        padding: "14px",
                        background: "var(--bg-primary)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--blue-bright)",
                          marginBottom: "6px",
                        }}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          lineHeight: "1.5",
                        }}
                      >
                        {value as string}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recommended Color Palettes */}
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-secondary)",
                marginBottom: "10px",
              }}
            >
              Suggested Color Palettes
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {analysis.recommendations.colorPalettes.map((palette, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    {palette.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    {palette.colors.map((color, ci) => (
                      <div
                        key={ci}
                        className="color-swatch"
                        style={{
                          backgroundColor: color,
                          flex: 1,
                          height: "36px",
                          width: "auto",
                          borderRadius:
                            ci === 0
                              ? "6px 0 0 6px"
                              : ci === palette.colors.length - 1
                              ? "0 6px 6px 0"
                              : "0",
                        }}
                        title={color}
                        onClick={() => copyToClipboard(color)}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      lineHeight: "1.5",
                    }}
                  >
                    {palette.rationale}
                  </div>
                </div>
              ))}
            </div>

            {/* Layout Improvements */}
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-secondary)",
                marginBottom: "10px",
              }}
            >
              Layout Improvements
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {analysis.recommendations.layoutImprovements.map(
                (improvement, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      background: "var(--bg-primary)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "var(--green)" }}>✓</span>
                    {improvement}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
