"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/fitrbase";
import { useRouter } from "next/navigation";

// Create the auth context
const AuthContext = createContext({});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get the user from our MongoDB
        try {
          const response = await fetch(
            `/api/auth/user?uid=${firebaseUser.uid}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // If user doesn't exist in our DB yet, create them
            if (firebaseUser.email) {
              const createResponse = await fetch("/api/auth/user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  uid: firebaseUser.uid,
                  name:
                    firebaseUser.displayName ||
                    firebaseUser.email.split("@")[0],
                  email: firebaseUser.email,
                  image: firebaseUser.photoURL || "",
                }),
              });

              if (createResponse.ok) {
                const newUserData = await createResponse.json();
                setUser(newUserData);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (name, email, password) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update the user's display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user in MongoDB
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name,
          email,
          image: firebaseUser.photoURL || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create user in database:", errorData);
        throw new Error("Failed to create user in database");
      }

      return firebaseUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Create or update user in MongoDB
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          email: firebaseUser.email,
          image: firebaseUser.photoURL || "",
        }),
      });

      if (!response.ok) {
        console.error("Failed to save user data to database");
        throw new Error("Failed to save user data to database");
      }

      return firebaseUser;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
