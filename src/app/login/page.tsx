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
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(10, 102, 194, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(88, 166, 255, 0.08) 0%, transparent 50%), var(--bg-deep)",
        padding: "24px",
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        {/* Logo & Branding */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, var(--blue-primary), var(--blue-light))",
              marginBottom: "20px",
              boxShadow: "0 8px 32px var(--blue-glow)",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
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
              fontSize: "32px",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              marginBottom: "8px",
              background:
                "linear-gradient(135deg, var(--text-primary), var(--blue-bright))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Post Analyzer
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: "1.5",
              maxWidth: "340px",
              margin: "0 auto",
            }}
          >
            Reverse-engineer any social media post with AI-powered design
            analysis
          </p>
        </div>

        {/* Login Card */}
        <div
          className="glass-card"
          style={{
            padding: "36px",
            marginBottom: "24px",
          }}
        >
          {/* Features List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[
              {
                icon: "🎨",
                text: "Reverse-engineer image prompts & design choices",
              },
              {
                icon: "🔍",
                text: "Extract colors, fonts & visual hierarchy",
              },
              {
                icon: "⚡",
                text: "Get scroll-stopping improvement recommendations",
              },
              {
                icon: "📊",
                text: "Track your analysis history in Google Sheets",
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  background: "var(--bg-primary)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ fontSize: "18px" }}>{feature.icon}</span>
                {feature.text}
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
                padding: "14px 24px",
                fontSize: "15px",
                gap: "12px",
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
              Continue with Google
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          Powered by Gemini 3 Pro · Bring Your Own API Key
        </p>
      </div>
    </div>
  );
}
