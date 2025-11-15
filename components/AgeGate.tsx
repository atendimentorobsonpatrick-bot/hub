
import React from 'react';

interface AgeGateProps {
  onEnter: () => void;
}

const AgeGate: React.FC<AgeGateProps> = ({ onEnter }) => {
  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-2xl text-center max-w-lg mx-4 border border-brand-pink">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-pink mb-4">
          VERIFY YOUR AGE
        </h1>
        <p className="text-brand-text-dark mb-8 text-sm md:text-base">
          This platform is exclusively for adults. By entering, you confirm you are 18 years of age or older and consent to our Terms of Service.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onEnter}
            className="w-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            I Am 18 or Older
          </button>
          <button
            onClick={handleExit}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;