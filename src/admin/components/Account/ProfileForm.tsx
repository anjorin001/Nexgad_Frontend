import {
  AlertCircle,
  CheckCircle,
  Edit3,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import type { AdminUser } from "./types";

interface ProfileFormProps {
  user: AdminUser;
  onSave: (userData: Partial<AdminUser>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.phoneNumber &&
      !/^[+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-sm shadow-xl border border-[#CBDCEB]/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#CBDCEB]/80 via-[#CBDCEB]/60 to-[#CBDCEB]/80 px-6 py-4 border-b border-[#CBDCEB]/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-semibold text-[#263b51] flex items-center gap-2">
            <div className="w-2 h-2 bg-[#456882] rounded-full"></div>
            Profile Information
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#456882] text-white rounded-xl hover:bg-[#263b51] transition-all duration-200 font-medium"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-[#456882] rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#456882] text-white rounded-xl hover:bg-[#263b51] transition-all duration-200 font-medium"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Picture Placeholder */}
          <div className="lg:col-span-2 flex items-center gap-6 mb-4">
            <div className="w-20 h-20 bg-[#263b51] rounded-full flex items-center justify-center shadow-lg">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#263b51]">
                {user.fullName}
              </h4>
              <p className="text-[#456882]">{user.role}</p>
              <p className="text-sm text-gray-500">
                Last login: {new Date(user.lastLogin).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-3">
              Full Name *
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                  isEditing
                    ? "border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                } ${errors.fullName ? "border-red-300" : ""}`}
                placeholder="Enter your full name"
              />
              {isEditing && formData.fullName && (
                <CheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  size={18}
                />
              )}
            </div>
            {errors.fullName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-3">
              Email Address *
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                  isEditing
                    ? "border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                } ${errors.email ? "border-red-300" : ""}`}
                placeholder="Enter your email address"
              />
              {isEditing && formData.email && !errors.email && (
                <CheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  size={18}
                />
              )}
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
            <div className="text-xs text-[#456882] mt-1">
              This email is used for login and notifications
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-3">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                  isEditing
                    ? "border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                } ${errors.phoneNumber ? "border-red-300" : ""}`}
                placeholder="Enter your phone number (optional)"
              />
              {isEditing && formData.phoneNumber && !errors.phoneNumber && (
                <CheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  size={18}
                />
              )}
            </div>
            {errors.phoneNumber && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.phoneNumber}
              </div>
            )}
            <div className="text-xs text-[#456882] mt-1">
              Optional - used for account recovery and notifications
            </div>
          </div>

          {/* Account Details */}
          <div>
            <label className="block text-sm font-bold text-[#263b51] mb-3">
              Account Created
            </label>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-[#456882] font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
