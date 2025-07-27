import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa6';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterProps {
  onRegister?: (formData: RegisterFormData) => void;
  onGoogleRegister?: () => void;
  isLoading?: boolean;
}

const RegisterCnt: React.FC<RegisterProps> = ({ onRegister, onGoogleRegister, isLoading = false }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onRegister) {
      onRegister(formData);
    }
  };

  const handleGoogleRegister = () => {
    if (onGoogleRegister) {
      onGoogleRegister();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CBDCEB] to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#456882]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <NavLink to="/" className="text-3xl font-bold text-[#1B3C53] hover:text-[#456882] transition-colors duration-200">
                NexGad
              </NavLink>
            </div>
            <h2 className="text-3xl font-bold text-[#1B3C53] mb-2">
              Create your account
            </h2>
            <p className="text-[#456882]/70">
              Or{' '}
              <NavLink 
                to="/login" 
                className="text-[#456882] hover:text-[#1B3C53] font-semibold hover:underline transition-colors duration-200"
              >
                sign in to existing account
              </NavLink>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-[#CBDCEB]/30 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.firstName 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#CBDCEB] focus:border-[#456882] focus:bg-white'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-[#CBDCEB]/30 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.lastName 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#CBDCEB] focus:border-[#456882] focus:bg-white'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1B3C53] mb-2">
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
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#CBDCEB] focus:border-[#456882] focus:bg-white'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 bg-[#CBDCEB]/30 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#CBDCEB] focus:border-[#456882] focus:bg-white'
                  }`}
                  placeholder="Create a strong password"
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
              <p className="mt-2 text-xs text-[#456882]/60">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="text-sm text-[#456882]/70 leading-relaxed">
              By creating an account, you agree to our{' '}
              <NavLink
                to="/terms"
                className="text-[#1B3C53] hover:text-[#456882] font-semibold hover:underline transition-colors duration-200"
              >
                Terms of Service
              </NavLink>
              {' '}and{' '}
              <NavLink
                to="/privacy"
                className="text-[#1B3C53] hover:text-[#456882] font-semibold hover:underline transition-colors duration-200"
              >
                Privacy Policy
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CBDCEB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#456882]/70 font-medium">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-[#CBDCEB] rounded-xl text-[#1B3C53] bg-white hover:bg-[#CBDCEB]/20 hover:border-[#456882] transition-all duration-200 transform hover:scale-[1.02] font-semibold"
          >
            <FaGoogle className="text-lg mr-3" />
            Continue with Google
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#456882]/70">
              Already have an account?{' '}
              <NavLink
                to="/login"
                className="text-[#1B3C53] hover:text-[#456882] font-semibold hover:underline transition-colors duration-200"
              >
                Sign in here
              </NavLink>
            </p>
          </div>
        </div>

        {/* Bottom Brand */}
        <div className="text-center mt-8">
          <p className="text-[#456882]/60 text-sm">
            Join thousands of users on NexGad
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCnt;