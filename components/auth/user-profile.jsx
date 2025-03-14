"use client";

import { useAuth } from "../../context/auth-context";

const styles = {
  card: {
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    color: "var(--card-foreground)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  cardHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid var(--border)",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    lineHeight: "1",
    letterSpacing: "-0.025em",
  },
  cardContent: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  avatar: {
    height: "6rem",
    width: "6rem",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  avatarImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  avatarFallback: {
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--muted)",
    fontSize: "1.5rem",
    textTransform: "uppercase",
  },
  userInfo: {
    textAlign: "center",
  },
  userName: {
    fontSize: "1.125rem",
    fontWeight: "500",
  },
  userEmail: {
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    borderRadius: "var(--radius)",
    fontSize: "0.875rem",
    fontWeight: "500",
    height: "2.5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
    cursor: "pointer",
    border: "none",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  spinner: {
    height: "2rem",
    width: "2rem",
    animation: "spin 1s linear infinite",
  },
};

export default function UserProfile() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Your Profile</h3>
      </div>
      <div style={styles.cardContent}>
        <div style={styles.avatar}>
          {user.image ? (
            <img
              src={user.image || "/placeholder.svg"}
              alt={user.name}
              style={styles.avatarImage}
            />
          ) : (
            <div style={styles.avatarFallback}>
              {user.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div style={styles.userInfo}>
          <h3 style={styles.userName}>{user.name}</h3>
          <p style={styles.userEmail}>{user.email}</p>
        </div>
        <button onClick={signOut} style={styles.button}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
