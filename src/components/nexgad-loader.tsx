import React from 'react';

const NexgadLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center overflow-hidden">
      {/* Background animated dots */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20"
            style={{
              background: i % 3 === 0 ? '#1B3C53' : i % 3 === 1 ? '#456882' : '#8BA8C4',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Animated logo/brand name */}
        <div className="relative">
          <h1 className="text-6xl font-bold tracking-wider select-none">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#1B3C53] via-[#456882] to-[#2A4E66] animate-pulse">
              NEX
            </span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#2A4E66] via-[#456882] to-[#1B3C53] animate-pulse delay-300">
              GAD
            </span>
          </h1>
          
          {/* Glowing underline */}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#456882] to-transparent opacity-80">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1B3C53] to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Main circular loader */}
        <div className="relative w-32 h-32">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1B3C53] border-r-[#456882] animate-spin"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#456882] border-l-[#1B3C53] animate-spin reverse-spin"></div>
          
          {/* Inner pulsing core */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#1B3C53] to-[#456882] animate-pulse shadow-lg shadow-[#456882]/50">
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#456882] to-[#8BA8C4] animate-ping opacity-80"></div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-spin shadow-sm"
              style={{
                background: i === 0 ? '#1B3C53' : i === 1 ? '#456882' : '#2A4E66',
                transformOrigin: '64px 64px',
                animationDuration: `${2 + i * 0.5}s`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#1B3C53] via-[#456882] to-[#2A4E66] rounded-full animate-loading-bar shadow-sm"></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <p className="text-[#1B3C53] text-lg font-medium animate-pulse">
            Loading your tech experience...
          </p>
          <div className="flex space-x-1 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#456882] animate-bounce shadow-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating tech icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 opacity-15 animate-float"
            style={{
              left: `${10 + (i % 4) * 25}%`,
              top: `${10 + Math.floor(i / 4) * 80}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            <div className={`w-full h-full rounded shadow-sm ${i % 4 === 0 ? 'bg-[#1B3C53]' : i % 4 === 1 ? 'bg-[#456882]' : i % 4 === 2 ? 'bg-[#2A4E66]' : 'bg-gradient-to-br from-[#1B3C53] to-[#456882]'}`}></div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .reverse-spin {
          animation: reverse-spin 2s linear infinite;
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NexgadLoader;