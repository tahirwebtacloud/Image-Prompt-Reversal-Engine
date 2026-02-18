"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, SessionProvider } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

function DashboardSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const navItems = [
    {
      label: "Analyze",
      href: "/dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      label: "History",
      href: "/dashboard/history",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Credentials",
      href: "/dashboard/credentials",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Logo */}
      <div
        style={{
          padding: "32px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "7px",
              background: "var(--brand-yellow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px var(--primary-glow)",
            }}
          >
            <svg
              width="22"
              height="22"
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
          <div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: "900",
                fontSize: "16px",
                color: "var(--brand-yellow)",
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
              }}
            >
              Obsidian
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "-2px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              AI Analyzer
            </div>
          </div>
        </Link>
        {/* Mobile Close Button - Overlay handles this mostly, but X can be added if needed */}
      </div>

      {/* Navigation */}
      <nav style={{ padding: "24px 0", flex: 1 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${
              pathname === item.href ? "active" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      {session?.user && (
        <div
          style={{
            padding: "24px 20px",
            borderTop: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "2px solid var(--brand-yellow)",
                  padding: "1px",
                }}
              />
            )}
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: "700",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {session.user.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "500",
                }}
              >
                {session.user.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="btn-secondary"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "12px",
              borderWidth: "1px",
              opacity: 0.8,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "4px" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            System Logout
          </button>
        </div>
      )}
    </div>
  );
}

function MobileHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="mobile-header">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={onOpen}
          style={{
            background: "none",
            border: "none",
            color: "var(--brand-yellow)",
            cursor: "pointer",
            padding: "8px",
            margin: "-8px",
            zIndex: 50,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "var(--brand-yellow)", borderRadius: "4px" }} />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: "900",
              fontSize: "18px",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Obsidian
          </span>
        </div>
      </div>
    </header>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MobileHeader onOpen={() => setIsSidebarOpen(true)} />
      
      <div style={{ display: "flex", flex: 1 }}>
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Overlay */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}
