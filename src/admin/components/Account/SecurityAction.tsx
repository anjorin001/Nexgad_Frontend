import { Lock, LogOut, Shield } from "lucide-react";
import React from "react";
interface SecurityActionsProps {
  onChangePassword: () => void;
  onLogout: () => void;
}

export const SecurityActions: React.FC<SecurityActionsProps> = ({
  onChangePassword,
  onLogout,
}) => {
  return (
    <div className="bg-white rounded-sm shadow-xl border border-[#CBDCEB]/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#CBDCEB]/80 via-[#CBDCEB]/60 to-[#CBDCEB]/80 px-6 py-4 border-b border-[#CBDCEB]/50">
        <h3 className="text-xl font-semibold text-[#263b51] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#456882] rounded-full"></div>
          Security & Access
        </h3>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Password */}
          <div className="group p-6 bg-gradient-to-br from-[#CBDCEB]/20 to-[#456882]/10 rounded-md border border-[#CBDCEB]/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#263b51]  rounded-xl flex items-center justify-center">
                <Lock className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#263b51]">
                  Change Password
                </h4>
                <p className="text-sm text-[#456882]">
                  Update your account password
                </p>
              </div>
            </div>
            <button
              onClick={onChangePassword}
              className="w-full px-4 py-3 bg-[#456882] text-white rounded-md hover:bg-[#263b51] transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              Change Password
            </button>
          </div>

          {/* Logout */}
          <div className="group p-6 bg-gradient-to-br from-red-50 to-red-100/50 rounded-md border border-red-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <LogOut className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-red-700">Logout</h4>
                <p className="text-sm text-red-600">End your current session</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
