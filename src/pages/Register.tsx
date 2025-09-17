/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterCnt, { type RegisterFormData } from "../components/Register";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
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
          newErrors.phoneNumber = msg;
        } else {
          toast.error("Login Error", msg);
        }
      });
    }

    setErrors(newErrors);
  };

  const handRegister = async (formData: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log("Axios Base URL:", api.defaults.baseURL);
      const request = await api.post("/auth/register", formData);
      toast.addToast({
        type: "success",
        title: "Registration",
        message: "Registration succesfull proceed to login page to login",
        action: {
          label: "Click here to login",
          onClick: () => navigate("/login"),
        },
        duration: 0,
      });
    } catch (err: any) {
      console.log(err);
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
      <RegisterCnt
        onRegister={handRegister}
        isLoading={isLoading}
        backendErrors={errors}
      />
    </div>
  );
};

export default Register;
