
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <svg 
            className="w-24 h-24 animate-rocket-fly" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="rotate(45 50 50)">
                <path d="M 50,10 L 70,30 L 70,70 L 50,90 L 30,70 L 30,30 Z" fill="#4299e1" />
                <path d="M 50,20 L 60,30 L 60,60 L 50,70 L 40,60 L 40,30 Z" fill="#90cdf4" />
                <circle cx="50" cy="50" r="5" fill="#f6e05e" />
                <path d="M 70,50 L 85,50 C 85,50 90,55 85,60 L 70,60 Z" fill="#f56565" />
                <path d="M 30,50 L 15,50 C 15,50 10,55 15,60 L 30,60 Z" fill="#f56565" />
                <g className="animate-flame">
                    <path d="M 50,90 C 40,100 60,100 50,90" fill="#f6ad55" />
                    <path d="M 50,90 C 45,105 55,105 50,90" fill="#f6e05e" />
                </g>
            </g>
        </svg>
        <p className="text-yellow-300 text-2xl font-display">آماده پرتاب!</p>
      </div>
      <style>{`
        @keyframes rocket-fly {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-rocket-fly {
            animation: rocket-fly 1.5s ease-in-out infinite;
        }
        @keyframes flame-flicker {
            0% { transform: scaleY(1); opacity: 1; }
            50% { transform: scaleY(1.2); opacity: 0.8; }
            100% { transform: scaleY(1); opacity: 1; }
        }
        .animate-flame {
            animation: flame-flicker 0.3s ease-in-out infinite;
            transform-origin: 50% 90px;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
