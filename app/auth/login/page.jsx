import LoginForm from "@/components/auth/login-form";

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  formContainer: {
    margin: "0 auto",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "350px",
    gap: "1.5rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    letterSpacing: "-0.025em",
  },
  description: {
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
  },
};

export const metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.description}>
            Enter your credentials to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
