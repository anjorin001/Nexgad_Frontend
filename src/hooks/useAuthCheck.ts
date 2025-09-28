/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const useAuthCheck = () => {
  const { setIsAuthenticated, isAuthenticated } = useAppContext();
  const location = useLocation();
  console.log("is auth", isAuthenticated);
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("nexgad_token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          localStorage.removeItem("nexgad_token");
          localStorage.removeItem("nexgad_user")

          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("nexgad_token");
        localStorage.removeItem("nexgad_user")
        setIsAuthenticated(false);
      }
    };

    checkTokenValidity();
  }, [location.pathname, setIsAuthenticated]);
};

export default useAuthCheck;
