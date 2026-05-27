"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function login(data) {
    setUser(data);

    localStorage.setItem("user", JSON.stringify(data));
  }

  function logout() {
    localStorage.removeItem("user");

    setUser(null);

    /*
  -------------------------
  CLEAR CHATS
  -------------------------
  */

    localStorage.removeItem("chats");

    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
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
