
import React from 'react';
import type { Planet, PlanetAnalysisData } from '../types';

interface PlanetAnalysisViewProps {
  planet: Planet;
  analysisData: PlanetAnalysisData;
  onBack: () => void;
  onSimulate: () => void;
}

const InfoCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
  <div className="bg-gray-800/70 rounded-2xl p-5 border-2 border-gray-700 flex flex-col h-full">
    <div className="flex items-center mb-3">
      <div className="text-yellow-400 mr-3">{icon}</div>
      <h3 className="text-xl font-display text-white">{title}</h3>
    </div>
    <p className="text-gray-300 text-sm leading-relaxed flex-grow whitespace-pre-line">{content}</p>
  </div>
);

const ImageCard: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => (
    <div className={`bg-gray-800 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-700 ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
    </div>
);


const PlanetAnalysisView: React.FC<PlanetAnalysisViewProps> = ({ planet, analysisData, onBack, onSimulate }) => {

  const planetImageUrl = `https://pollinations.ai/p/${encodeURIComponent(analysisData.planetImagePrompt)}`;
  const lifeFormImageUrl = `https://pollinations.ai/p/${encodeURIComponent(analysisData.lifeFormImagePrompt)}`;
  const environmentImageUrls = analysisData.environmentImagePrompts.map(prompt => `https://pollinations.ai/p/${encodeURIComponent(prompt)}`);

  const icons = {
      lifespan: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
      atmosphere: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>,
      probability: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      lifeForm: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.172 7.172a4 4 0 015.656 0L20 6.343a1 1 0 011.414 1.414l-.828.829a4 4 0 010 5.656l.828.828a1 1 0 01-1.414 1.414l-.829-.828a4 4 0 01-5.656 0l-2 2a4 4 0 01-5.656 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414a2 2 0 002.828 0l2-2a2 2 0 000-2.828l-2-2a2 2 0 00-2.828 0L2.172 9.172a4 4 0 010-5.656l-.828-.829a1 1 0 011.414-1.414l.829.828a4 4 0 015.656 0l2-2a4 4 0 015.656 0z" clipRule="evenodd" /></svg>,
      reasoning: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
      adaptation: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>,
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200">
          &rarr; بازگشت
        </button>
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            کشف زندگی در {planet.name}
          </h1>
          <p className="text-lg text-gray-300 mt-2">{planet.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
              <ImageCard src={planetImageUrl} alt={`Planet ${planet.name} from space`} className="aspect-[4/3]"/>
              <ImageCard src={lifeFormImageUrl} alt={`Life form on ${planet.name}`} className="aspect-[4/3]"/>
              {environmentImageUrls.length > 0 && <ImageCard src={environmentImageUrls[0]} alt={`Environment on ${planet.name}`} className="aspect-[4/3] col-span-2"/>}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
             <InfoCard title="هوا و ابرها" content={analysisData.atmosphericConditions} icon={icons.atmosphere} />
             <InfoCard title="عمر سیاره" content={`${analysisData.lifespan}\n\n${analysisData.lifeCycle}`} icon={icons.lifespan} />
             <InfoCard title="شانس زندگی" content={analysisData.lifePossibility} icon={icons.probability} />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <InfoCard title="شکل و شمایل موجودات" content={analysisData.dominantLifeForm} icon={icons.lifeForm} />
            <InfoCard title="چرا اونجا زندگی هست؟" content={analysisData.reasoning} icon={icons.reasoning} />
            <InfoCard title="قدرت‌های ویژه موجودات" content={analysisData.adaptationFeatures} icon={icons.adaptation} />
        </div>

        <div className="text-center p-6 bg-gray-800/70 rounded-2xl border-2 border-gray-700">
            <h2 className="text-3xl font-display text-white mb-4">دوست داری شهرشون رو ببینی؟</h2>
            <button
              onClick={onSimulate}
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 font-display"
            >
              بریم شهرشون رو بسازیم!
            </button>
        </div>

      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PlanetAnalysisView;
