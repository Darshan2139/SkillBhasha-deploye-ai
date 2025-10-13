import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  role: "learner" | "trainer" | "admin";
  name?: string;
  badges?: string[];
  avatarColor?: string;
  settings?: Record<string, any>;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: User['role'], name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Dar@6514";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("skillbhasha_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        localStorage.removeItem("skillbhasha_user");
      }
    }
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem("skillbhasha_user", JSON.stringify(u));
    else localStorage.removeItem("skillbhasha_user");
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    // Demo authentication logic
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      persist({ email, role: "admin", name: "Admin", badges: ["Moderator", "Verified"], avatarColor: "#0f172a" });
      return true;
    }

    // For demo, accept any other email/password and default to learner
    // If email contains "trainer" use trainer role
    const role: User['role'] = /trainer/i.test(email) ? "trainer" : "learner";
    const baseName = email.split("@")[0];
    const defaultBadges = role === "trainer" ? ["Creator", "Reviewer"] : ["Learner"];
    const avatarColor = role === "trainer" ? "#1f6feb" : "#10b981";
    persist({ email, role, name: baseName, badges: defaultBadges, avatarColor });
    return true;
  };

  const signup = async (email: string, password: string, role: User['role'], name?: string) => {
    // For demo, simply persist
    const baseName = name ?? email.split("@")[0];
    const defaultBadges = role === "trainer" ? ["Creator"] : ["Learner"];
    const avatarColor = role === "trainer" ? "#1f6feb" : "#10b981";
    persist({ email, role, name: baseName, badges: defaultBadges, avatarColor });
    return true;
  };

  const updateProfile = async (data: Partial<User>) => {
    const next = { ...(user || {}), ...data } as User;
    persist(next);
    return true;
  };

  const logout = () => {
    persist(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
