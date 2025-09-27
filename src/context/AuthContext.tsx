import React, { createContext, useContext, useEffect, useState } from "react";
import {
  decodeJwt,
  isTokenExpired,
  type JwtPayload,
} from "../admin/helpers/tokenDecoder";
import api from "../utils/api";

type Role = "user" | "admin" | string;

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: Role;
}

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("nexgad_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const rawToken = localStorage.getItem("nexgad_token");
    if (!rawToken) return null;
    const payload = decodeJwt<JwtPayload>(rawToken);
    if (!payload) return null;
    return {
      id: payload.sub ?? "",
      email: payload.email ?? "",
      role: payload.role,
    };
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      if (!token) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        logout();
        setLoading(false);
        return;
      }

      const payload = decodeJwt<JwtPayload>(token);
      if (payload) {
        setUser({
          id: payload.sub ?? "",
          email: payload.email ?? "",
          role: payload.role,
        });
      } else {
        try {
          const request = await api.get("/user");
          if (request) {
            const response = request.data.data;
            setUser({
              id: response._id,
              email: response.email,
              role: response.role,
            });
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (newToken: string) => {
    if (isTokenExpired(newToken)) {
      console.warn("Tried to login with expired token");
      return;
    }
    localStorage.setItem("nexgad_token", newToken);
    setToken(newToken);

    const payload = decodeJwt<JwtPayload>(newToken);
    if (payload) {
      setUser({
        id: payload.sub ?? "",
        email: payload.email ?? "",
        role: payload.role,
      });
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("nexgad_token");
    localStorage.removeItem("nexgad_user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = !!user?.role && user.role.toLowerCase() === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
