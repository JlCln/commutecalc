import { createContext, useCallback, useContext, useState } from "react";

interface User {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
  logout: () => void;
  verifyAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    const userWithAvatar = {
      ...data.user,
      avatar_url: data.user.avatar_url || null,
    };

    setUser(userWithAvatar);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userWithAvatar));
  };

  const register = async (
    email: string,
    password: string,
    username: string,
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      },
    );

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const verifyAuth = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      throw new Error("No token found");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      setUser(data.user);
      setToken(savedToken);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        register,
        verifyAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
