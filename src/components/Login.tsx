/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export interface LoginFormData {
  email: string;
  password: string;
  general?: string;
}

interface LoginProps {
  onLogin?: (formData: LoginFormData) => void;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
  backendErrors: any;
}

const LoginCnt: React.FC<LoginProps> = ({
  onLogin,
  onGoogleLogin,
  isLoading = false,
  backendErrors,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  useEffect(() => {
    if (backendErrors) {
      setErrors(backendErrors);
    }
  }, [backendErrors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onLogin) {
      onLogin(formData);
    }
  };

  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#CBDCEB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-sm shadow-2xl p-8 border border-[#456882]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <NavLink
                to="/"
                className="text-3xl font-bold text-[#1B3C53] hover:text-[#456882] transition-colors duration-200"
              >
                NexGad
              </NavLink>
            </div>
            <h2 className="text-3xl font-bold text-[#1B3C53] mb-2">
              Sign in to your account
            </h2>
            <p className="text-[#456882]/70">
              Or{" "}
              <NavLink
                to="/register"
                className="text-[#456882] hover:text-[#1B3C53] font-semibold hover:underline transition-colors duration-200"
              >
                create a new account
              </NavLink>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1B3C53] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#CBDCEB]/30 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#CBDCEB] focus:border-[#456882] focus:bg-white"
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

          

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#1B3C53] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 bg-[#CBDCEB]/30 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#CBDCEB] focus:border-[#456882] focus:bg-white"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <NavLink
                to="/forgot-password"
                className="text-sm text-[#456882] hover:text-[#1B3C53] hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </NavLink>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1B3C53] text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-[#456882] focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CBDCEB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#456882]/70 font-medium">
                Or sign in with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-[#CBDCEB] rounded-xl text-[#1B3C53] bg-white hover:bg-[#CBDCEB]/20 hover:border-[#456882] transition-all duration-200 transform hover:scale-[1.02] font-semibold"
          >
            <FaGoogle className="text-lg mr-3" />
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#456882]/70">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-[#1B3C53] hover:text-[#456882] font-semibold hover:underline transition-colors duration-200"
              >
                Sign up here
              </NavLink>
            </p>
          </div>
        </div>

        {/* Bottom Brand */}
        <div className="text-center mt-8">
          <p className="text-[#456882]/60 text-sm">
            Secure login powered by NexGad
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCnt;
