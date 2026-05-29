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
    const savedSession = localStorage.getItem("session");

    if (savedSession) {
      const parsed = JSON.parse(savedSession);

      setUser(parsed.user);
    }

    setLoading(false);
  }, []);

  /*
  -------------------------
  LOGIN
  -------------------------
  */

  async function login(email, password) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);

        return false;
      }

      /*
      -------------------------
      SAVE SESSION
      -------------------------
      */

      localStorage.setItem("session", JSON.stringify(data.session));

      setUser(data.user);

      return true;
    } catch (error) {
      console.error(error);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        alert(data.error);

        return false;
      }

      return true;
    } catch (error) {
      console.error(error);

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
