import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

export default function NetworkErrorBoundary({ 
  children, 
  onRetry 
}: NetworkErrorBoundaryProps) {
  const [networkError, setNetworkError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleError = () => setNetworkError(true);
    const handleOnline = () => setNetworkError(false);
    
    window.addEventListener("network-error", handleError);
    window.addEventListener("offline", handleError);
    window.addEventListener("online", handleOnline);
    
    return () => {
      window.removeEventListener("network-error", handleError);
      window.removeEventListener("offline", handleError);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      await fetch('/api/health-check', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      if (onRetry) {
        await onRetry();
      }
      
      setNetworkError(false);
    } catch (error) {
      console.log('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  if (networkError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="relative max-w-md w-full">
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#1B3C53_1px,_transparent_0)] bg-[length:20px_20px]"></div>
            </div>
            
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#CBDCEB]/30 to-[#456882]/20 backdrop-blur-sm border border-[#456882]/20 flex items-center justify-center shadow-inner">
                <WifiOff className="w-10 h-10 text-[#456882]" />
              </div>

              <h2 className="text-2xl font-bold text-[#1B3C53] mb-3">
                Connection Lost
              </h2>

              <p className="text-[#456882] mb-8 leading-relaxed">
                Unable to connect to our servers. Please check your internet connection and try again.
              </p>

              <div className="flex items-center justify-center gap-2 mb-8 p-3 rounded-xl bg-[#CBDCEB]/30 border border-[#456882]/10">
                <AlertTriangle className="w-4 h-4 text-[#456882]" />
                <span className="text-sm font-medium text-[#456882]">
                  Network connectivity required
                </span>
              </div>

              {/* <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="group relative w-full bg-[#1B3C53] hover:bg-[#456882] disabled:bg-[#456882]/70 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-center gap-3">
                  <RefreshCw 
                    className={`w-5 h-5 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} 
                  />
                  <span>
                    {isRetrying ? 'Reconnecting...' : 'Try Again'}
                  </span>
                </div>
              </button> */}

              <div className="mt-6 pt-6 border-t border-[#CBDCEB]/30">
                <p className="text-xs text-[#456882]/70">
                  If the problem persists, please contact support
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#CBDCEB]/50"></div>
            <div className="absolute top-8 right-8 w-1 h-1 rounded-full bg-[#456882]/30"></div>
            <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#456882]/20"></div>
          </div>

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1B3C53]/10 to-[#456882]/10 blur-xl -z-10 opacity-50"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}