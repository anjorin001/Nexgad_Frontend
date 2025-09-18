import { Key, Loader2, Lock } from "lucide-react";
import { useState } from "react";

export const ResetStep = ({ email, onSubmit, isLoading, onBack }) => {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && token && !isLoading) {
      onSubmit({ password, token });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#1B3C53] rounded-lg flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-[#1B3C53] mb-2">
          Reset Password
        </h2>
        <p className="text-[#456882] text-sm">
          Check your email for the reset token
        </p>
        <p className="text-xs text-[#456882] mt-1">Token sent to: {email}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-[#456882] mb-2"
          >
            Reset Token
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-[#456882] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#CBDCEB] rounded-lg focus:ring-2 focus:ring-[#456882] focus:border-transparent outline-none transition-all duration-200"
              placeholder="Enter reset token"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#456882] mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#456882] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#CBDCEB] rounded-lg focus:ring-2 focus:ring-[#456882] focus:border-transparent outline-none transition-all duration-200"
              placeholder="Enter new password (min 8 chars)"
              minLength={8}
              required
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-[#456882] mt-1">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 bg-[#CBDCEB] text-[#456882] py-3 px-4 rounded-lg font-medium hover:bg-[#b5cde3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading || !password || password.length < 8 || !token}
            className="flex-1 bg-[#1B3C53] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2d4f68] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
