import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Loader from "../nexgadMidPageLoader";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    current: string;
    new: string;
    confirm: string;
  }) => void;
}

type PasswordVisibilty = "current" | "new" | "confirm";

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { isChangingPasswordLoading } = useAppContext();
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: PasswordVisibilty) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(passwordData);
    setPasswordData({
      current: "",
      new: "",
      confirm: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {isChangingPasswordLoading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
          <h3 className="text-2xl font-bold text-[#1B3C53] mb-6">
            Change Password
          </h3>

          <div className="space-y-4">
            {(["current", "new", "confirm"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#456882] mb-2">
                  {field === "current"
                    ? "Current Password"
                    : field === "new"
                    ? "New Password"
                    : "Confirm New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords[field] ? "text" : "password"}
                    value={passwordData[field]}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pr-12 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882] hover:text-[#1B3C53]"
                  >
                    {showPasswords[field] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#1B3C53] text-white py-3 px-4 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium"
            >
              Update Password
            </button>
            <button
              onClick={() => {
                onClose();
                setPasswordData({ current: "", new: "", confirm: "" });
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordModal;
