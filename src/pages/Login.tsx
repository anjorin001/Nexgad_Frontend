import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCnt, { type LoginFormData } from "../components/Login";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../utils/ToastNotification";
import api from "../utils/api";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const { setIsAuthenticated } = useAppContext();
  const toast = useToast();
  const navigate = useNavigate();

  const handleBackendErrors = (errorResponse: any) => {
    const newErrors: Record<string, string> = {};

    if (Array.isArray(errorResponse.message)) {
      errorResponse.message.forEach((msg: string) => {
        if (msg.toLowerCase().includes("firstname")) {
          newErrors.firstName = msg;
        } else if (msg.toLowerCase().includes("lastname")) {
          newErrors.lastName = msg;
        } else if (msg.toLowerCase().includes("email")) {
          newErrors.email = msg;
        } else if (msg.toLowerCase().includes("password")) {
          newErrors.password = msg;
        } else if (msg.toLowerCase().includes("phone")) {
          newErrors.phone = msg;
        } else {
          toast.error("Login Error", msg);
        }
      });
    }

    setErrors(newErrors);
  };

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    try {
      const request = await api.post("/auth/login", formData);
      const response = request.data;
      localStorage.setItem("nexgad_token", response.data.token);
      toast.success("Login", "Login Successful");
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: any) {
      if (err.response && err.response.data) {
        handleBackendErrors(err.response.data);
        toast.error("Login Error", err.response.data.message);
      } else {
        toast.error(
          "Registeration Error",
          "something went wrong, try again later"
        );
        window.dispatchEvent(new CustomEvent("network-error"));
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <LoginCnt
        onLogin={handleLogin}
        isLoading={isLoading}
        backendErrors={errors}
      />
    </div>
  );
};

export default Login;
