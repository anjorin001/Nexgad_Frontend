import Loader from "../nexgadMidPageLoader";

export const PaymentPending: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#CBDCEB]/30 rounded-full mb-6">
          <Loader size={64} thickness={1} />
        </div>
        <h1 className="text-2xl font-bold text-[#1B3C53] mb-3">
          Verifying Payment...
        </h1>
        <p className="text-[#456882]">
          Please wait while we confirm your transaction
        </p>
      </div>
    </div>
  );
};
