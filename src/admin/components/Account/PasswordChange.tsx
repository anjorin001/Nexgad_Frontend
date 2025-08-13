import { AlertCircle, Eye, EyeOff, Lock, Shield, X } from "lucide-react";
import { useState } from "react";
import type { PasswordChangeData } from "./types";

// Types
interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwordData: PasswordChangeData) => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
    >
      <div className="bg-white rounded-md shadow-2xl max-w-md w-full animate-in slide-in-from-bottom duration-500">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#263b51] via-[#456882] to-[#263b51] p-6 text-white rounded-t-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-white" size={24} />
              <div>
                <h2 className="text-xl font-bold">Change Password</h2>
                <p className="text-white/80 text-sm">
                  Update your account security
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-2">
              Current Password *
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className={`w-full pl-10 pr-12 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 ${
                  errors.currentPassword ? "border-red-300" : ""
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#456882] hover:text-[#263b51] transition-colors duration-200"
              >
                {showPasswords.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-2">
              New Password *
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className={`w-full pl-10 pr-12 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 ${
                  errors.newPassword ? "border-red-300" : ""
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#456882] hover:text-[#263b51] transition-colors duration-200"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                        i < passwordStrength
                          ? passwordStrength <= 2
                            ? "bg-red-400"
                            : passwordStrength <= 3
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs ${
                    passwordStrength <= 2
                      ? "text-red-600"
                      : passwordStrength <= 3
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {passwordStrength <= 2
                    ? "Weak"
                    : passwordStrength <= 3
                    ? "Medium"
                    : "Strong"}{" "}
                  password strength
                </p>
              </div>
            )}

            {errors.newPassword && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.newPassword}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className={`w-full pl-10 pr-12 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 ${
                  errors.confirmPassword ? "border-red-300" : ""
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#456882] hover:text-[#263b51] transition-colors duration-200"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-3xl border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-[#456882] rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#263b51] to-[#456882] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
