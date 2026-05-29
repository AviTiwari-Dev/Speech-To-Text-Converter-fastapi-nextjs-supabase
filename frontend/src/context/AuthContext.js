"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /*
  -------------------------
  LOAD SESSION
  -------------------------
  */

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("session");

      if (savedSession) {
        const parsed = JSON.parse(savedSession);

        if (parsed?.user) {
          setUser(parsed.user);
        }
      }
    } catch (error) {
      console.error("SESSION LOAD ERROR:", error);

      localStorage.removeItem("session");
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  -------------------------
  LOGIN
  -------------------------
  */

  async function login(email, password) {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        alert("API URL missing");

        return false;
      }

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      /*
      -------------------------
      HANDLE NON-JSON ERRORS
      -------------------------
      */

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();

        console.error("NON JSON RESPONSE:", text);

        alert("Server error");

        return false;
      }

      const data = await response.json();

      /*
      -------------------------
      HANDLE API ERRORS
      -------------------------
      */

      if (!response.ok) {
        alert(data.error || "Login failed");

        return false;
      }

      if (data.error) {
        alert(data.error);

        return false;
      }

      /*
      -------------------------
      SAVE SESSION
      -------------------------
      */

      localStorage.setItem(
        "session",
        JSON.stringify({
          user: data.user,
          session: data.session,
        }),
      );

      setUser(data.user);

      return true;
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert("Unable to connect to server");

      return false;
    }
  }

  /*
  -------------------------
  SIGNUP
  -------------------------
  */

  async function signup(email, password) {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        alert("API URL missing");

        return false;
      }

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      /*
      -------------------------
      HANDLE NON-JSON ERRORS
      -------------------------
      */

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();

        console.error("NON JSON RESPONSE:", text);

        alert("Server error");

        return false;
      }

      const data = await response.json();

      /*
      -------------------------
      HANDLE API ERRORS
      -------------------------
      */

      if (!response.ok) {
        alert(data.error || "Signup failed");

        return false;
      }

      if (data.error) {
        alert(data.error);

        return false;
      }

      return true;
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      alert("Unable to connect to server");

      return false;
    }
  }

  /*
  -------------------------
  LOGOUT
  -------------------------
  */

  function logout() {
    localStorage.removeItem("session");

    setUser(null);

    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
