import React from 'react';
// Fix: Corrected type import from LifeAnalysisData to PlanetAnalysisData to match the exported type in types.ts.
import type { PlanetAnalysisData } from '../types';

interface LifeAnalysisResultModalProps {
  planetName: string;
  data: PlanetAnalysisData;
  onClose: () => void;
  onSimulate?: () => void;
}

const InfoSection: React.FC<{ title: string; content: string; icon: React.ReactNode, imageUrl?: string }> = ({ title, content, icon, imageUrl }) => (
    <div className="mb-4">
        <div className="flex items-center mb-2">
            <div className="text-purple-400 mr-3">{icon}</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="pr-8">
          <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{content}</p>
          {imageUrl && (
            <div className="mt-3 w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <img src={imageUrl} alt={`تصور هنری از ${title}`} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
    </div>
);

const LifeAnalysisResultModal: React.FC<LifeAnalysisResultModalProps> = ({ planetName, data, onClose, onSimulate }) => {
    const lifeFormImageUrl = data.lifeFormImagePrompt ? `https://pollinations.ai/p/${encodeURIComponent(data.lifeFormImagePrompt)}` : undefined;
    
    const icons = {
        probability: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        lifeForm: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.621 10.118a8.038 8.038 0 01-1.242 8.448 8.038 8.038 0 01-10.828 1.42M3.379 13.882a8.038 8.038 0 011.242-8.448 8.038 8.038 0 0110.828-1.42" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.42v15.16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945" /></svg>,
        reasoning: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.373 3.373 0 0014 18.467V19a2 2 0 11-4 0v-.533c0-.896-.356-1.75-1-2.407l-.547-.547z" /></svg>,
        adaptation: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="life-analysis-title"
    >
      <div 
        className="bg-gray-800 rounded-lg p-6 sm:p-8 max-w-2xl w-full border border-purple-500 shadow-2xl transform transition-all animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 id="life-analysis-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                تحلیل حیات در {planetName}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="بستن">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto pr-2">
            <InfoSection title="احتمال وجود حیات" content={data.lifePossibility} icon={icons.probability} />
            <InfoSection title="شکل غالب حیات" content={data.dominantLifeForm} icon={icons.lifeForm} imageUrl={lifeFormImageUrl} />
            <InfoSection title="استدلال علمی" content={data.reasoning} icon={icons.reasoning} />
            <InfoSection title="سازگاری‌های کلیدی" content={data.adaptationFeatures} icon={icons.adaptation} />
        </div>

        {onSimulate ? (
            <div className="flex flex-col sm:flex-row-reverse gap-3 mt-6">
                <button onClick={onSimulate} className="w-full sm:flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                    شبیه‌سازی شهر در این سیاره
                </button>
                <button onClick={onClose} className="w-full sm:flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                  بازگشت
                </button>
            </div>
        ) : (
            <button onClick={onClose} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
              بستن
            </button>
        )}
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LifeAnalysisResultModal;