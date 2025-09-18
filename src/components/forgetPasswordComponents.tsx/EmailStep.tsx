import { Loader2, Mail } from "lucide-react";
import { useState } from "react";

export const EmailStep = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && !isLoading) {
      onSubmit(email);
    }
    console.log(email)
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#1B3C53] rounded-lg flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-[#1B3C53] mb-2">Forgot Password?</h2>
        <p className="text-[#456882] text-sm">Enter your email address and we'll send you a reset token</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#456882] mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-[#CBDCEB] rounded-lg focus:ring-2 focus:ring-[#456882] focus:border-transparent outline-none transition-all duration-200"
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !email}
          className="w-full bg-[#1B3C53] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2d4f68] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            'Send Reset Token'
          )}
        </button>
      </div>
    </div>
  );
};