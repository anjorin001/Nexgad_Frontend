export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  lastLogin: string;
  createdAt: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}