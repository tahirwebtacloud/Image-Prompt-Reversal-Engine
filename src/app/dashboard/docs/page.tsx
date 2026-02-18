"use client";

import React from "react";

export default function ApiDocsPage() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlExample = `curl -X POST https://your-domain.com/api/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "imageBase64": "...base64_data...",
    "mimeType": "image/png"
  }'`;

  const fetchExample = `const response = await fetch("https://your-domain.com/api/v1/analyze", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    imageBase64: "...",
    mimeType: "image/png"
  })
});

const result = await response.json();
console.log(result.data);`;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", paddingBottom: "100px" }}>
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
          API Documentation
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.6" }}>
          Integrate Post Analyzer directly into your workflow using our developer API. 
          Reverse-engineer visual structures, palettes, and typography programmatically.
        </p>
      </div>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Authentication</h2>
        <div className="glass-card" style={{ padding: "24px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            The Post Analyzer API uses Bearer tokens for authentication. Generate your keys in the 
            <a href="/dashboard/credentials" style={{ color: "var(--brand-yellow)", marginLeft: "4px", fontWeight: "600" }}>Credentials</a> section.
          </p>
          <div style={{ background: "var(--bg-primary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--white-10)" }}>
            <code style={{ fontSize: "13px", color: "var(--brand-yellow)", fontWeight: "700" }}>
              Authorization: Bearer sk_...
            </code>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Endpoints</h2>
        
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ 
              background: "var(--brand-yellow)", 
              color: "var(--obsidain-black)", 
              padding: "4px 10px", 
              borderRadius: "4px", 
              fontSize: "11px", 
              fontWeight: "800",
              letterSpacing: "0.05em"
            }}>POST</span>
            <code style={{ fontSize: "15px", fontWeight: "700", color: "var(--brand-yellow)" }}>/api/v1/analyze</code>
          </div>
          
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
            Analyzes an image and returns a prompt-focused reverse-engineering result.
          </p>

          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Request Body</h4>
          <table style={{ width: "100%", fontSize: "13px", color: "var(--text-secondary)", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--white-10)" }}>
                <th style={{ textAlign: "left", padding: "8px 0" }}>Field</th>
                <th style={{ textAlign: "left", padding: "8px 0" }}>Type</th>
                <th style={{ textAlign: "left", padding: "8px 0" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px 0", color: "var(--brand-yellow)", fontWeight: "600" }}>imageBase64</td>
                <td>string</td>
                <td>Raw base64 data of the image (without data: prefix)</td>
              </tr>
              <tr>
                <td style={{ padding: "12px 0", color: "var(--brand-yellow)", fontWeight: "600" }}>mimeType</td>
                <td>string</td>
                <td>MIME type (e.g., image/png, image/jpeg)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Code Examples</h2>
        </div>

        <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", background: "var(--white-5)", borderBottom: "1px solid var(--white-10)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>cURL</span>
            <button 
              className="btn-link" 
              onClick={() => copyToClipboard(curlExample, "curl")}
              style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: copied === "curl" ? "var(--green)" : "var(--brand-yellow)" }}
            >
              {copied === "curl" ? "Copied!" : "Copy code"}
            </button>
          </div>
          <pre style={{ padding: "24px", margin: "0", background: "rgba(0,0,0,0.2)", overflowX: "auto", fontSize: "13px", lineHeight: "1.5", color: "#e6edf3" }}>
            {curlExample}
          </pre>
        </div>

        <div className="glass-card" style={{ padding: "0", overflow: "hidden", marginTop: "20px" }}>
          <div style={{ padding: "16px 24px", background: "var(--white-5)", borderBottom: "1px solid var(--white-10)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>JavaScript (Fetch)</span>
            <button 
              className="btn-link" 
              onClick={() => copyToClipboard(fetchExample, "fetch")}
              style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: copied === "fetch" ? "var(--green)" : "var(--brand-yellow)" }}
            >
              {copied === "fetch" ? "Copied!" : "Copy code"}
            </button>
          </div>
          <pre style={{ padding: "24px", margin: "0", background: "rgba(0,0,0,0.2)", overflowX: "auto", fontSize: "13px", lineHeight: "1.5", color: "#e6edf3" }}>
            {fetchExample}
          </pre>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Response Structure</h2>
        <div className="glass-card" style={{ padding: "24px" }}>
          <pre style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
{`{
  "success": true,
  "data": {
    "reverseEngineeredPrompt": "...",
    "samplePrompt": "...",
    "colorAnalysis": { ... },
    "designElements": { ... }
  }
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
