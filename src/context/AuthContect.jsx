// AuthContext.jsx - Authentication context for the application

import { createContext, useState } from "react";

// Create context
export const AuthContext = createContext(
  localStorage.getItem("currentUserEmail")
    ? { email: localStorage.getItem("currentUserEmail") }
    : null,
);

// Create provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // signup function
  function signup(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // check if email already exists
    if (users.find((user) => user.email === email)) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
    };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    setUser({ email });

    return { success: true, message: "User created successfully" };
  }

  // Login function
  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (user) {
      setUser({ email });
      localStorage.setItem("currentUserEmail", email);
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
