import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailStep } from "../components/forgetPasswordComponents.tsx/EmailStep";
import { ResetStep } from "../components/forgetPasswordComponents.tsx/PasswordResetStep";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

export const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (emailValue: string) => {
    setIsLoading(true);
    console.log("email", emailValue);
    setEmail(email)
    try {
      console.log("email", email);
      await api.post("/auth/forget-password", { email: emailValue });
      setStep(2);
    } catch (err: any) {
      console.error("Error sending reset token:", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (data: {
    password: string;
    token: string;
  }) => {
    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password/${data.token}`, {
        password: data.password,
      });

      toast.addToast({
        type: "success",
        title: "Password reset successfull",
        message: "Enter your new password to login",
        duration: 10000,
      });
      navigate("/login")
    } catch (err: any) {
      console.error("Error sending reset token:", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#CBDCEB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <EmailStep onSubmit={handleEmailSubmit} isLoading={isLoading} />
        ) : (
          <ResetStep
            email={email}
            onSubmit={handlePasswordReset}
            isLoading={isLoading}
            onBack={handleBack}
          />
        )}

        <div className="flex justify-center mt-6 space-x-2">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step === 1 ? "bg-[#1B3C53]" : "bg-white border-2 border-[#1B3C53]"
            }`}
          />
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step === 2 ? "bg-[#1B3C53]" : "bg-white border-2 border-[#456882]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
