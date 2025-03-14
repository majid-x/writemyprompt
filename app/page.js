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
    margin: "0.5rem auto 2rem",
    maxWidth: "36rem",
  },
  signOutButton: {
    position: "fixed",
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
    zIndex: 1000,
  },
  contentWrapper: {
    position: "relative",
    marginTop: "1rem",
    minHeight: "400px",
  },
};

const mobileStyles = `@media (max-width: 640px) {
  main {
    justify-content: flex-start;
    padding-top: 6rem;
  }
  .container {
    padding-top: 2rem !important;
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 8rem);
  }
  .header {
    position: static !important;
    order: 1;
    margin-bottom: 1rem;
  }
  .header-title {
    font-size: 1.5rem !important;
    padding: 0 1rem !important;
    margin-top: 0 !important;
  }
  .header-description {
    font-size: 0.8rem !important;
    padding: 0 1rem !important;
    margin: 1rem 0 2rem !important;
  }
  .content-wrapper {
    order: 2;
    min-height: 500px !important;
    margin-top: 0 !important;
    flex: 1;
  }
  .sign-out-btn {
    top: 1rem !important;
    right: 1rem !important;
  }
}`;

export default function Home() {
  const { signOut } = useAuth();

  return (
    <ProtectedRoute>
      <main style={styles.main}>
        <style>{mobileStyles}</style>
        <div style={styles.container}>
          <div style={styles.header} className="header">
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
          <div
            style={{ ...styles.contentWrapper, className: "content-wrapper" }}>
            <PromptGenerator />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
