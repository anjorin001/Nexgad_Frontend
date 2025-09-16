import { useState } from "react";
import { UserProfile, type UserData } from "../components/UserProfile";
import { useAppContext } from "../context/AppContext";
import { LogoutRequest } from "../utils/LogoutLogic";
import { useToast } from "../utils/ToastNotification";
import api from "../utils/api";

const Profile = () => {
  const { setIsAuthenticated, setIsChangingPasswordLoading } = useAppContext();
  const userRawData = JSON.parse(localStorage.getItem("nexgad_user"));
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const userData: UserData = {
    firstName: userRawData.firstName,
    lastName: userRawData.lastName,
    email: userRawData.email,
    phoneNumber: userRawData.phoneNumber,
    address1: userRawData?.address1,
    address2: userRawData?.address2,
    language: "English",
    joinedDate: userRawData.createdAt,
  };

  const hanldeUpdateUser = async (userData: Partial<UserData>) => {
    setIsLoading(true);
    try {
      const { email, joinedDate, language, ...editedData } = userData;

      const originalData = {
        firstName: userRawData.firstName,
        lastName: userRawData.lastName,
        phoneNumber: userRawData.phoneNumber,
        address1: userRawData?.address1 || "",
        address2: userRawData?.address2 || "",
      };

      const changedFields = Object.fromEntries(
        Object.entries(editedData).filter(([key, value]) => {
          const originalValue = originalData[key as keyof typeof originalData];
          const hasChanged = originalValue !== value;

          const requiredFields = ["firstName", "lastName", "phoneNumber"];
          if (requiredFields.includes(key)) {
            return hasChanged && Boolean(value);
          }

          const optionalFields = ["address1", "address2"];
          if (optionalFields.includes(key)) {
            return hasChanged;
          }

          return hasChanged && Boolean(value);
        })
      );

      if (Object.keys(changedFields).length === 0) {
        toast.info("", "No changes to update");
        return;
      }

      console.log("Only changed fields:", changedFields);
      const request = await api.post("/user", changedFields);
      const response = request.data;

      localStorage.setItem("nexgad_user", JSON.stringify(response.data));
      toast.success("", "Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        "",
        "An error occurred while updating profile, try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsChangingPasswordLoading(true);
    try {
      const request = await api.post("/auth/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      toast.success(
        "Password Update",
        "Your password has been updated successfully"
      );
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Password Update",
        err.response?.data?.message || "An error occurred"
      );
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsChangingPasswordLoading(true);
    try {
      const request = await api.delete("/auth/delete-account");
      LogoutRequest();
      toast.success(
        "Account Deletion",
        "Your account has been deleted successfully"
      );
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Account Deletion",
        err.response?.data?.message || "An error occurred"
      );
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {" "}
      <UserProfile
        userData={userData}
        onUpdateProfile={hanldeUpdateUser}
        onChangePassword={handleUpdatePassword}
        onLogout={() => LogoutRequest(setIsAuthenticated)}
        onDeleteAccount={handleDeleteAccount}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Profile;
