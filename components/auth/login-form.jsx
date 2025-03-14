"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/auth-context";

const styles = {
  card: {
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    color: "var(--card-foreground)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    padding: "1.5rem",
  },
  alert: {
    position: "relative",
    width: "100%",
    borderRadius: "var(--radius)",
    border: "1px solid var(--destructive)",
    padding: "1rem",
    marginBottom: "1rem",
    color: "var(--destructive)",
  },
  alertIcon: {
    position: "absolute",
    left: "1rem",
    top: "1rem",
    color: "var(--destructive)",
  },
  alertDescription: {
    paddingLeft: "1.75rem",
    fontSize: "0.875rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    display: "flex",
    height: "2.5rem",
    width: "100%",
    borderRadius: "var(--radius)",
    border: "1px solid var(--input)",
    backgroundColor: "var(--background)",
    padding: "0 0.75rem",
    fontSize: "0.875rem",
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
    width: "100%",
  },
  buttonDisabled: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  divider: {
    margin: "1rem 0",
    textAlign: "center",
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
  },
  googleButton: {
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
    backgroundColor: "transparent",
    border: "1px solid var(--input)",
    color: "var(--foreground)",
    cursor: "pointer",
    width: "100%",
    marginTop: "0.75rem",
  },
  googleIcon: {
    marginRight: "0.5rem",
    height: "1rem",
    width: "1rem",
  },
  signupLink: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.875rem",
  },
  link: {
    color: "var(--primary)",
    textDecoration: "underline",
  },
};

export default function LoginForm() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn(formData.email, formData.password);
      router.push("/");
    } catch (error) {
      console.error(error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error(error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Sign in was cancelled.";
      default:
        return "An error occurred during sign in. Please try again.";
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        {error && (
          <div style={styles.alert}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={styles.alertIcon}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div style={styles.alertDescription}>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.divider}>
          <p>Or continue with</p>
        </div>

        <button
          type="button"
          style={{
            ...styles.googleButton,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
          onClick={handleGoogleSignIn}
          disabled={isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={styles.googleIcon}>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <div style={styles.signupLink}>
          <p>
            Don't have an account?{" "}
            <Link href="/auth/signup" style={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
