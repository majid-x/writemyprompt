"use client";

import { useEffect } from "react";
import { auth } from "../../lib/fitrbase";

export default function FirebaseTokenHandler() {
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        // Get the token
        const token = await user.getIdToken();

        // Store the token in a cookie
        document.cookie = `firebase-token=${token}; path=/; max-age=${
          60 * 60 * 24 * 5
        }; SameSite=Strict; Secure`;
      } else {
        // Remove the cookie when user is signed out
        document.cookie = "firebase-token=; path=/; max-age=0";
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
