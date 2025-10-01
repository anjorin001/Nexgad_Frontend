import { useState } from "react";
import api from "../../utils/api";
import { LogoutRequest } from "../../utils/LogoutLogic";
import { useToast } from "../../utils/ToastNotification";
import { AccountHeader } from "./Account/Header";
import { PasswordChangeModal } from "./Account/PasswordChange";
import { ProfileForm } from "./Account/ProfileForm";
import { SecurityActions } from "./Account/SecurityAction";
import type { AdminUser } from "./Account/types";

const AdminAccountPage: React.FC = () => {
  const userRawData = JSON.parse(localStorage.getItem("nexgad_user") || "{}");
  const [isUpdateUserLoading, setIsUpadateUserLoading] = useState(false);
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] =
    useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const toast = useToast();

  const hanldeUpdateUser = async (userData: Partial<AdminUser>) => {
    setIsUpadateUserLoading(true);
    try {
      const { email, ...editedData } = userData;

      const originalData = {
        firstName: userRawData.firstName,
        lastName: userRawData.lastName,
        phoneNumber: userRawData.phoneNumber,
      };

      const changedFields = Object.fromEntries(
        Object.entries(editedData).filter(([key, value]) => {
          const originalValue = originalData[key as keyof typeof originalData];
          const hasChanged = originalValue !== value;

          const requiredFields = ["firstName", "lastName", "phoneNumber"];
          if (requiredFields.includes(key)) {
            return hasChanged && Boolean(value);
          }

          return hasChanged && Boolean(value);
        })
      );

      if (Object.keys(changedFields).length === 0) {
        toast.info("", "No changes to update");
        setIsUpadateUserLoading(false);
        return;
      }

      const request = await api.post("/user", changedFields);
      const response = request.data;

      localStorage.setItem("nexgad_user", JSON.stringify(response.data));
      toast.success("", "Profile updated successfully");
    } catch (err: any) {
      console.error("Error updating user", err);

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
      setIsUpadateUserLoading(false);
    }
  };

  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsChangingPasswordLoading(true);
    try {
      await api.post("/auth/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      toast.success(
        "Password Update",
        "Your password has been updated successfully"
      );
      setIsPasswordModalOpen(false);
      return true;
    } catch (err: any) {
      console.error("Error sending reset token:", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      }
      else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#CBDCEB]/10 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <AccountHeader />

        <div className="space-y-8">
          <ProfileForm
            user={userRawData}
            onSave={hanldeUpdateUser}
            isLoading={isUpdateUserLoading}
          />

          <SecurityActions
            onChangePassword={() => setIsPasswordModalOpen(true)}
            onLogout={() => LogoutRequest()}
          />
        </div>

        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={handleUpdatePassword}
          isLoading={isChangingPasswordLoading}
        />
      </div>
    </div>
  );
};

export default AdminAccountPage;
