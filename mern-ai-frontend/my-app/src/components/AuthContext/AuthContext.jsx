import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../../apis/user/usersAPI";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔥 Better initial state (prevents flicker + loops)
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // 🔥 React Query to check auth status
  const { isError, isLoading, data, isSuccess } = useQuery({
    queryFn: checkUserAuthStatusAPI,
    queryKey: ["checkAuth"],
  });

  // ✅ FIX: set boolean, not full object
  useEffect(() => {
    if (isSuccess && data) {
      setIsAuthenticated(data.isAuthenticated); // ✅ important fix
    }
  }, [isSuccess, data]);

  // ✅ Login updater
  const login = () => {
    setIsAuthenticated(true);
  };

  // ✅ Logout updater
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isError,
        isLoading,
        isSuccess,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};