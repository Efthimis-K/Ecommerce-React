import { createContext, useState, useContext } from "react";

const CURRENT_USER_KEY = "currentUserEmail";

function loadStoredUser() {
  try {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    return email ? { email } : null;
  } catch {
    return null;
  }
}

export const AuthContext = createContext(undefined);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  function signup(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((user) => user.email === email)) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
    };
    users.push(newUser);

    try {
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, email);
    } catch {
      return { success: false, message: "Could not save account" };
    }

    setUser({ email });

    return { success: true, message: "User created successfully" };
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (user) {
      try {
        localStorage.setItem(CURRENT_USER_KEY, email);
      } catch {
        return { success: false, message: "Could not save session" };
      }
      setUser({ email });
      return { success: true, message: "Login successful" };
    }

    return { success: false, message: "Invalid email or password" };
  }

  function logout() {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      // ignore storage errors on logout
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
