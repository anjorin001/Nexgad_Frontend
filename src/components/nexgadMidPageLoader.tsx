import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-transparent border-t-[#2A4E66] rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;