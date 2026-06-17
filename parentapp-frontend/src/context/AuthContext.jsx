import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "parentapp-token";

// All localStorage keys the app uses (for cleanup on login/logout)
const USER_SCOPED_KEYS = ["parentapp_chats", "mood-log", "milestones-v2", "saved-tips", "tip-of-day"];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setUser(data);
        else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (email, password) => {
    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed");
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ email, id: data.id, onboarded: false });
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    USER_SCOPED_KEYS.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ email: data.email, id: data.id, onboarded: data.onboarded, ...data.profile });
    return data;
  }, []);

  const saveProfile = useCallback(async (profile) => {
    const res = await fetch("http://localhost:4000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to save profile");
    setUser((prev) => ({ ...prev, ...profile, onboarded: true }));
  }, [token]);

  const logout = useCallback(() => {
    if (user?.id) {
      USER_SCOPED_KEYS.forEach((k) => localStorage.removeItem(`${k}_${user.id}`));
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, [user]);

  const profile = user
    ? {
        name: user.name,
        role: user.role,
        firstTime: user.firstTime,
        children: user.children,
        challenges: user.challenges,
        style: user.style,
      }
    : null;

  const userKey = user?.id ?? null;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        userKey,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
