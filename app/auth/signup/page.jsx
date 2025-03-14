import SignupForm from "@/components/auth/signup-form";

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
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignupPage() {
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create an account</h1>
          <p style={styles.description}>
            Enter your information to create an account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
