import { useState } from "react";
import { AccountHeader } from "./Account/Header";
import { PasswordChangeModal } from "./Account/PasswordChange";
import { ProfileForm } from "./Account/ProfileForm";
import { SecurityActions } from "./Account/SecurityAction";
import type { AdminUser, PasswordChangeData } from "./Account/types";

const AdminAccountPage: React.FC = () => {
  const [user, setUser] = useState<AdminUser>({
    id: "1",
    fullName: "John Doe",
    email: "john.doe@company.com",
    phoneNumber: "+234 801 234 5678",
    role: "Super Administrator",
    lastLogin: "2024-08-13T10:30:00Z",
    createdAt: "2023-01-15T09:00:00Z",
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleSaveProfile = (userData: Partial<AdminUser>) => {
    setUser((prev) => ({ ...prev, ...userData }));
    // Here you would typically make an API call to update the user data
    console.log("Profile updated:", userData);
  };

  const handleChangePassword = (passwordData: PasswordChangeData) => {
    // Here you would typically make an API call to change the password
    console.log("Password changed:", {
      ...passwordData,
      currentPassword: "[HIDDEN]",
      newPassword: "[HIDDEN]",
    });
    // Show success message or handle response
  };

  const handleLogout = () => {
    // Here you would typically clear authentication tokens and redirect
    console.log("User logged out");
    // Example: localStorage.removeItem('authToken'); navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#CBDCEB]/10 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <AccountHeader />

        <div className="space-y-8">
          <ProfileForm user={user} onSave={handleSaveProfile} />

          <SecurityActions
            onChangePassword={() => setIsPasswordModalOpen(true)}
            onLogout={handleLogout}
          />
        </div>

        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={handleChangePassword}
        />
      </div>
    </div>
  );
};

export default AdminAccountPage;
