import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 10% 10%, rgba(249, 199, 79, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(249, 199, 79, 0.03) 0%, transparent 40%), var(--bg-deep)",
        padding: "24px",
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: "480px",
        }}
      >
        {/* Logo & Branding */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "7px",
              background: "var(--brand-yellow)",
              marginBottom: "24px",
              boxShadow: "0 10px 40px var(--primary-glow)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--obsidian-black)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "36px",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              marginBottom: "12px",
              color: "var(--brand-yellow)",
              textTransform: "uppercase",
            }}
          >
            Obsidian Analyzer
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "1.6",
              maxWidth: "360px",
              margin: "0 auto",
              letterSpacing: "0.01em",
            }}
          >
            Advanced AI Intelligence for Social Media Post Deconstruction
          </p>
        </div>

        {/* Login Card */}
        <div
          className="glass-card"
          style={{
            padding: "48px",
            marginBottom: "32px",
            border: "1px solid rgba(249, 199, 79, 0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Features List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ),
                text: "Reverse-engineer premium design prompts",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16l4-4-4-4M8 12h8"/></svg>
                ),
                text: "Analyze visual hierarchy & color psychology",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                ),
                text: "Get scroll-stopping AI recommendations",
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <div style={{ color: "var(--brand-yellow)", flexShrink: 0 }}>
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Google Sign In */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px 24px",
                fontSize: "15px",
                gap: "14px",
                letterSpacing: "0.1em",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Access
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: "600",
          }}
        >
          Obsidian Logic AI Agent System v2.0
        </p>
      </div>
    </div>
  );
}
