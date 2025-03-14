import "./globals.css";
import { AuthProvider } from "../context/auth-context";
import FirebaseTokenHandler from "../components/auth/firebase-token-handler";

export const metadata = {
  title: "AI Prompt Engineer",
  description: "Generate optimized prompts for various LLM models",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FirebaseTokenHandler />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
