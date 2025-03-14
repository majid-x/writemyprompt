"use client";

import PromptGenerator from "../components/prompt-generator";
import ProtectedRoute from "../components/auth/protected-route";
import { useAuth } from "../context/auth-context";

const styles = {
  main: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
  },
  container: {
    maxWidth: "64rem",
    width: "100%",
    position: "relative",
    paddingTop: "6rem",
  },
  header: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    textAlign: "center",
    padding: "0 1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    padding: "0 4rem",
    lineHeight: "1.2",
  },
  description: {
    color: "var(--muted-foreground)",
    padding: "0 2rem",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    margin: "0.5rem auto 1rem",
    maxWidth: "36rem",
  },
  signOutButton: {
    position: "fixed", // Changed to fixed positioning
    top: "1.5rem",
    right: "1.5rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    borderRadius: "var(--radius)",
    fontSize: "0.875rem",
    fontWeight: "500",
    height: "2.5rem",
    padding: "0 1rem",
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
    cursor: "pointer",
    border: "none",
    zIndex: 1000, // Increased z-index
  },
  contentWrapper: {
    position: "relative",
    marginTop: "1rem",
  },
};

const mobileStyles = `@media (max-width: 640px) {
  .header-title {
    font-size: 1.5rem !important;
    padding: 0 1rem !important;
    margin-top: 2.5rem !important;
  }
  .header-description {
    font-size: 0.8rem !important;
    padding: 0 1rem !important;
    margin: 0.5rem 0 2rem !important;
  }
  .container {
    padding-top: 5rem !important;
  }
  .sign-out-btn {
    top: 1rem !important;
    right: 1rem !important;
    height: 2.25rem !important;
    padding: 0 0.75rem !important;
  }
}`;

export default function Home() {
  const { signOut } = useAuth();

  return (
    <ProtectedRoute>
      <main style={styles.main}>
        <style>{mobileStyles}</style>
        <div style={styles.container}>
          <div style={styles.header}>
            <button
              onClick={signOut}
              style={{ ...styles.signOutButton, className: "sign-out-btn" }}>
              Sign Out
            </button>
            <h1 style={{ ...styles.title, className: "header-title" }}>
              AI Prompt Engineer
            </h1>
            <p
              style={{
                ...styles.description,
                className: "header-description",
              }}>
              Create optimized prompts for various AI models without technical
              knowledge
            </p>
          </div>
          <div style={styles.contentWrapper}>
            <PromptGenerator />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
