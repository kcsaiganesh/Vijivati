"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  _id: string;
  email: string;
  name?: string;
  fullName?: string;
  organizationName?: string;
  userType: "individual" | "organization";
  avatar?: string;
  isEmailVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
  redirectByRole: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetch: async () => {},
  logout: async () => {},
  redirectByRole: () => {},
});

// ── MOCK USERS ──────────────────────────────────────────────────────────────
const MOCK_INDIVIDUAL: AuthUser = {
  _id: "dev-user-001",
  email: "alex@example.com",
  name: "Alex Kumar",
  fullName: "Alex Kumar",
  userType: "individual",
  isEmailVerified: true,
};

const MOCK_ORG: AuthUser = {
  _id: "dev-org-001",
  email: "contact@pawsandcare.org",
  name: "Paws & Care Foundation",
  organizationName: "Paws & Care Foundation",
  userType: "organization",
  isEmailVerified: true,
};

// ── DEV BYPASS CHECK ────────────────────────────────────────────────────────
const IS_DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

function getDevMockUser(): AuthUser {
  // Check localStorage override first (set by DevPanel)
  if (typeof window !== "undefined") {
    const override = localStorage.getItem("dev_user_type");
    if (override === "organization") return MOCK_ORG;
    if (override === "individual") return MOCK_INDIVIDUAL;
  }
  const envType = process.env.NEXT_PUBLIC_DEV_USER_TYPE;
  return envType === "organization" ? MOCK_ORG : MOCK_INDIVIDUAL;
}

// ── PROVIDER ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    // ── DEV BYPASS: skip real API call ──
    if (IS_DEV_BYPASS) {
      setUser(getDevMockUser());
      setIsLoading(false);
      return;
    }

    try {
      const { default: api } = await import("@/lib/api");
      const res = await api.get("/auth/me");
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Listen for dev panel role switches
  useEffect(() => {
    if (!IS_DEV_BYPASS) return;
    const handler = () => {
      setUser(getDevMockUser());
    };
    window.addEventListener("dev-role-switch", handler);
    return () => window.removeEventListener("dev-role-switch", handler);
  }, []);

  const redirectByRole = useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.userType === "organization") {
      router.push("/organizations/dashboard");
    } else {
      router.push("/dashboard");
    }
  }, [user, router]);

  const logout = useCallback(async () => {
    if (IS_DEV_BYPASS) {
      // In dev mode, just switch to login page
      router.push("/login");
      return;
    }
    try {
      const { default: api } = await import("@/lib/api");
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refetch: fetchUser,
        logout,
        redirectByRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
