import {
  CheckCircle,
  Edit2,
  Globe,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useToast } from "../utils/ToastNotification";
import Loader from "./nexgadMidPageLoader";
import ChangePasswordModal from "./userProfileComponents/ChangePasswordModal";
import CircularProgress from "./userProfileComponents/CircularProgress";
import ConfirmModal from "./userProfileComponents/DeleteAccountModal";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address1?: string;
  address2?: string;
  language: string;
  joinedDate: string;
}

interface UserProfileProps {
  userData: UserData;
  onUpdateProfile?: (updatedData: Partial<UserData>) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  isLoading: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userData,
  onUpdateProfile,
  onChangePassword,
  onLogout,
  onDeleteAccount,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const [editData, setEditData] = useState<Partial<UserData>>(userData);

  const profileCompletion = useMemo(() => {
    const requiredFields = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.phoneNumber,
    ];

    const optionalFields = [userData.address1, userData.address2];

    const completedRequired = requiredFields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    const completedOptional = optionalFields.filter(
      (field) => field && field.trim() !== ""
    ).length;

    const requiredScore = (completedRequired / requiredFields.length) * 80;
    const optionalScore = (completedOptional / optionalFields.length) * 20;

    return Math.round(requiredScore + optionalScore);
  }, [userData]);

  const handleEditSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editData);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handlePasswordChange = (data: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    setIsChangingPassword(true);
    if (data.new !== data.confirm) {
      toast.error(
        "Password Update",
        "New passwords do not match confirm password"
      );
      return;
    }
    if (data.new.length < 8) {
      toast.error(
        "Password Update",
        "Password must be at least 8 characters long"
      );
      return;
    }
    if (onChangePassword) {
      onChangePassword(data.current, data.new);
    }
  };

  const handleDeleteAccount = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    setIsDeleting(true);
  };

  const getInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  return (
    <>
      {isLoading ? (
        <Loader
          fullScreen={true}
          size={64}
          thickness={1}
          label="updating profile info"
        />
      ) : (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="bg-[#1B3C53] rounded-md p-8 mb-6 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 text-white flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {getInitials()}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-white/80 text-lg mb-3">{userData.email}</p>
                <p className="text-white/70">
                  Member since{" "}
                  {new Date(userData.joinedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <CircularProgress percentage={profileCompletion} />
                <div className="text-center">
                  <p className="text-sm text-white/80">Profile Complete</p>
                  {profileCompletion === 100 && (
                    <div className="flex items-center gap-1 text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">All done!</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1B3C53] rounded-lg hover:bg-white/90 transition-all duration-200 font-medium"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-md border border-[#CBDCEB] p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1B3C53] mb-8 flex items-center gap-3">
                <User className="w-6 h-6" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#456882] mb-3">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <p className="text-[#1B3C53] font-medium text-lg bg-gray-50 p-3 rounded-lg">
                      {userData.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#456882] mb-3">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <p className="text-[#1B3C53] font-medium text-lg bg-gray-50 p-3 rounded-lg">
                      {userData.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#456882] mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <p className="text-[#1B3C53] font-medium text-lg bg-gray-50 p-3 rounded-lg">
                    {userData.email}
                  </p>
                </div>

                <div>
                  <label className=" text-sm font-semibold text-[#456882] mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phoneNumber || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      placeholder="+234 xxx xxx xxxx"
                      className="w-full px-4 py-3 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <p className="text-[#1B3C53] font-medium text-lg bg-gray-50 p-3 rounded-lg">
                      {userData.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className=" text-sm font-semibold text-[#456882] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address 1{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address1 || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          address1: e.target.value,
                        }))
                      }
                      placeholder="Enter your primary address"
                      className="w-full px-4 py-3 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <p className="text-[#1B3C53] font-medium text-lg bg-gray-50 p-3 rounded-lg">
                      {userData.address1 || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className=" text-sm font-semibold text-[#456882] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address 2{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address2 || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          address2: e.target.value,
                        }))
                      }
                      placeholder="Enter your secondary address"
                      className="w-full px-4 py-3 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <p className="text-[#1B3C53] font-medium text-lg bg-gray-50 p-3 rounded-lg">
                      {userData.address2 || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-8 pt-8 border-t border-[#CBDCEB]">
                  <button
                    onClick={handleEditSave}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1B3C53] text-white rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#CBDCEB] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B3C53] mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Preferences
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#456882] mb-3">
                      Language
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-[#1B3C53] font-medium">English</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Default language
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#CBDCEB] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B3C53] mb-6">
                  Account Actions
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#456882] text-white rounded-lg hover:bg-[#1B3C53] transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isChangingPassword && (
            <ChangePasswordModal
              isOpen={isChangingPassword}
              onClose={() => setIsChangingPassword(false)}
              onSubmit={handlePasswordChange}
            />
          )}

          {showDeleteConfirm && (
            <>
              {isDeleting ? (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <Loader />
                </div>
              ) : (
                <ConfirmModal
                  title="Delete Account"
                  message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
                  confirmText="Yes, Delete Account"
                  cancelText="Cancel"
                  confirmColor="red"
                  onConfirm={handleDeleteAccount}
                  onCancel={() => setShowDeleteConfirm(false)}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
