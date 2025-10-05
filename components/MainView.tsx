import React from 'react';
import type { Planet, CustomPlanetParams, MainViewTab } from '../types';
import PlanetSelector from './PlanetSelector';
import PlanetCreator from './PlanetCreator';

interface MainViewProps {
  activeTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
  onSelectPlanet: (planet: Planet) => void;
  onGenerate: (params: CustomPlanetParams) => void;
  onAnalyzeLife: (planet: Planet) => void;
  onStartAstronautVoiceChat: () => void;
  onStartAstronautTextChat: () => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; color: string }> = ({ active, onClick, children, color }) => {
  const baseClasses = "px-6 py-4 text-xl font-display rounded-full transition-all duration-300 transform focus:outline-none shadow-lg";
  const activeClasses = `text-white ${color} scale-110`;
  const inactiveClasses = "bg-gray-800/70 text-gray-300 hover:bg-gray-700/90 hover:text-white";
  return (
    <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

const MainView: React.FC<MainViewProps> = ({ activeTab, onTabChange, onSelectPlanet, onGenerate, onAnalyzeLife, onStartAstronautVoiceChat, onStartAstronautTextChat }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      <div className="text-center my-10">
        <h1 className="text-5xl sm:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
          ماجراجویی در سیاره‌ها
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          یک سیاره را برای سفر انتخاب کن, دنیای خودت را بساز، یا با یک فضانورد حرف بزن!
        </p>
      </div>

      <div className="w-full max-w-7xl">
        <div className="mb-8 flex justify-center flex-wrap gap-4">
            <TabButton active={activeTab === 'explore'} onClick={() => onTabChange('explore')} color="bg-gradient-to-r from-teal-400 to-blue-500">
                🚀 سفر به سیاره‌ها
            </TabButton>
            <TabButton active={activeTab === 'create'} onClick={() => onTabChange('create')} color="bg-gradient-to-r from-purple-500 to-pink-500">
                🎨 سیاره خودت رو بساز
            </TabButton>
             <TabButton active={activeTab === 'life'} onClick={() => onTabChange('life')} color="bg-gradient-to-r from-green-400 to-teal-500">
                👽 کشف موجودات فضایی
            </TabButton>
            <TabButton active={activeTab === 'astronaut'} onClick={() => onTabChange('astronaut')} color="bg-gradient-to-r from-orange-400 to-red-500">
                🧑‍🚀 ارتباط با فضانورد
            </TabButton>
        </div>

        <div className="mt-12">
            {activeTab === 'explore' && (
                <div>
                    <h2 className="text-3xl font-display text-center text-white mb-6">کدوم سیاره رو برای ماجراجویی انتخاب می‌کنی؟</h2>
                    <PlanetSelector onSelectPlanet={onSelectPlanet} />
                </div>
            )}
            {activeTab === 'create' && (
                <PlanetCreator onGenerate={onGenerate} />
            )}
            {activeTab === 'life' && (
                <div>
                    <p className="text-center text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                        یک سیاره انتخاب کن تا ببینیم چه جور موجودات بامزه‌ای ممکنه اونجا زندگی کنن!
                    </p>
                    <PlanetSelector onSelectPlanet={onAnalyzeLife} />
                </div>
            )}
             {activeTab === 'astronaut' && (
                <div className="text-center">
                    <div className="max-w-lg mx-auto bg-gray-800/70 rounded-3xl p-8 border-2 border-gray-700">
                        <div className="text-6xl mb-4">🧑‍🚀</div>
                        <h2 className="text-3xl font-display text-white mb-4">ارتباط با فضانورد</h2>
                        <p className="text-gray-300 mb-6">
                            دوست داری چطوری با فضانورد صحبت کنی؟ باهاش تماس صوتی بگیر یا بهش پیام متنی بده!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={onStartAstronautVoiceChat}
                                className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 font-display"
                            >
                                📞 تماس صوتی
                            </button>
                             <button 
                                onClick={onStartAstronautTextChat}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 font-display"
                            >
                                💬 چت متنی
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MainView;