import { createContext, useContext, useEffect, useState } from "react";

import api, {
  setAccessTokenGetter,
  setRefreshAccessToken,
  setAuthFailureHandler,
} from "../lib/api";
const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAccessTokenGetter(() => accessToken);
  }, [accessToken]);

  useEffect(() => {
  setRefreshAccessToken(async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken } = response.data;

    setAccessToken(accessToken);
    setAccessTokenGetter(() => accessToken);

    return accessToken;
  });
}, []);


  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.post("/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = response.data;

        setAccessToken(accessToken);
        setAccessTokenGetter(() => accessToken);

        const meResponse = await api.get("/auth/me");

        setUser(meResponse.data.user);
      } catch (error) {
        console.error("Failed to restore session:", error);

        localStorage.removeItem("refreshToken");
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);


  useEffect(() => {
  setAuthFailureHandler(() => {
    setUser(null)
    setAccessToken(null)

    localStorage.removeItem('refreshToken')
  })
}, [])

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;

      setUser(user);
      setAccessToken(accessToken);

      localStorage.setItem("refreshToken", refreshToken);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);

    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
