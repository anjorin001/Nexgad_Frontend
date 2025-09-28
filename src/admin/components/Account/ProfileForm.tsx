import {
  AlertCircle,
  CheckCircle,
  Edit3,
  Loader2,
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
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSave,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#CBDCEB]/30">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#CBDCEB]/30 bg-[#CBDCEB]/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1B3C53]">
            Profile Information
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#456882] transition-colors duration-200 font-medium"
            >
              <Edit3 size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-[#456882] rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#456882] disabled:opacity-50 transition-colors duration-200 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#CBDCEB]/30">
          <div className="w-16 h-16 bg-[#1B3C53] rounded-full flex items-center justify-center">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#1B3C53]">
              {user.firstName} {user.lastName}
            </h4>
            <p className="text-[#456882] font-medium">{user.role}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-bold text-[#456882] mb-2">
              First Name *
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200 ${
                  isEditing
                    ? "border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                } ${errors.firstName ? "border-red-400" : ""}`}
                placeholder="Enter first name"
              />
              {isEditing && formData.firstName && !errors.firstName && (
                <CheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  size={18}
                />
              )}
            </div>
            {errors.firstName && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-bold text-[#456882] mb-2">
              Last Name *
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                disabled={!isEditing}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200 ${
                  isEditing
                    ? "border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                } ${errors.lastName ? "border-red-400" : ""}`}
                placeholder="Enter last name"
              />
              {isEditing && formData.lastName && !errors.lastName && (
                <CheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  size={18}
                />
              )}
            </div>
            {errors.lastName && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.lastName}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#456882] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={18}
              />
              <input
                type="email"
                value={formData.email}
                disabled={true}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
                readOnly
              />
            </div>
            <p className="text-xs text-[#456882] mt-1">
              Email cannot be changed for security reasons
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-[#456882] mb-2">
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
                className={`w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200 ${
                  isEditing
                    ? "border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                } ${errors.phoneNumber ? "border-red-400" : ""}`}
                placeholder="+234 xxx xxx xxxx "
              />
              {isEditing && formData.phoneNumber && !errors.phoneNumber && (
                <CheckCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  size={18}
                />
              )}
            </div>
            {errors.phoneNumber && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle size={14} />
                {errors.phoneNumber}
              </div>
            )}
            <p className="text-xs text-[#456882] mt-1">
              Optional - used for account recovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
