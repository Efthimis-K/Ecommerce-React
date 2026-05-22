import { createContext, useState, useContext } from "react";

const CURRENT_USER_KEY = "currentUserEmail";
const USERS_KEY = "users";

function loadStoredUser() {
  try {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    return email ? { email } : null;
  } catch {
    return null;
  }
}

function loadStoredUsers() {
  let storedUsers = null;

  try {
    storedUsers = localStorage.getItem(USERS_KEY);
    if (!storedUsers) return { users: [], storedUsers, error: false };

    const users = JSON.parse(storedUsers);
    if (!Array.isArray(users)) {
      throw new Error("Stored users must be an array");
    }

    return { users, storedUsers, error: false };
  } catch (error) {
    console.warn("Could not read stored users.", error);

    try {
      localStorage.removeItem(USERS_KEY);
    } catch {
      // ignore cleanup errors
    }

    return { users: [], storedUsers, error: true };
  }
}

export const AuthContext = createContext(undefined);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  function signup(email, password) {
    const { users, storedUsers, error } = loadStoredUsers();

    if (error) {
      return {
        success: false,
        message: "Saved accounts could not be read. Please try again.",
      };
    }

    if (users.find((user) => user.email === email)) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
    };
    const updatedUsers = [...users, newUser];

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, email);
    } catch {
      try {
        if (storedUsers === null) {
          localStorage.removeItem(USERS_KEY);
        } else {
          localStorage.setItem(USERS_KEY, storedUsers);
        }
      } catch {
        // ignore rollback errors
      }

      return { success: false, message: "Could not save account" };
    }

    setUser({ email });

    return { success: true, message: "User created successfully" };
  }

  function login(email, password) {
    const { users, error } = loadStoredUsers();

    if (error) {
      return {
        success: false,
        message: "Saved accounts could not be read. Please try again.",
      };
    }

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
