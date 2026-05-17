import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUser,
} from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, authLoading, setAuthLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const userData = await loginUser({ email, password });
      setUser(userData.user);
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setAuthLoading(true);
    try {
      const userData = await registerUser({ username, email, password });
      setUser(userData.user);
    } catch (error) {
      console.log(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setAuthLoading(true);
      try {
        const userData = await getUser();
        setUser(userData.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setAuthLoading(false); 
      }
    };

    fetchUser();
  }, [setUser, setAuthLoading]);

  return {
    user,
    authLoading,
    setAuthLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
