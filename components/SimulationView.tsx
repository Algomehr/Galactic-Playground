
import React, { useState } from 'react';
import type { Planet, SimulationData, ChatRole } from '../types';
import SouvenirPhotoModal from './SouvenirPhotoModal';

interface SimulationViewProps {
  planet: Planet;
  data: SimulationData;
  onStartChat: (role: ChatRole, persona: string) => void;
  onBack: () => void;
}

const InfoCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
  <div className="bg-gray-800/70 rounded-2xl p-6 border-2 border-gray-700 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <div className="text-yellow-400 mr-4">{icon}</div>
      <h3 className="text-2xl font-display text-white">{title}</h3>
    </div>
    <p className="text-gray-300 flex-grow whitespace-pre-line leading-relaxed">{content}</p>
  </div>
);

const ResidentModal: React.FC<{ onSelect: (role: ChatRole, persona: string) => void; onClose: () => void; }> = ({ onSelect, onClose }) => {
  const residents: { role: ChatRole; persona: string; description: string }[] = [
    { role: 'مهندس', persona: 'یک مهندس خلاق', description: 'درباره ماشین‌های باحال' },
    { role: 'شهروند', persona: 'یک شهروند مهربان', description: 'درباره بازی‌ها و سرگرمی‌ها' },
    { role: 'پزشک', persona: 'یک دکتر مهربان', description: 'درباره سلامتی و خوراکی‌ها' },
    { role: 'دانشمند', persona: 'یک دانشمند کنجکاو', description: 'درباره موجودات و گیاهان' },
    { role: 'دولتمرد', persona: 'یک شهردار خوش‌رو', description: 'درباره قوانین و دوستی' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-3xl p-8 max-w-lg w-full border-2 border-yellow-500" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-display mb-6 text-center text-white">دوست داری با کی حرف بزنی؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {residents.map(res => (
            <button
              key={res.role}
              onClick={() => onSelect(res.role, res.persona)}
              className="bg-gray-700 hover:bg-teal-500 text-white font-bold py-4 px-4 rounded-xl transition-colors duration-200 text-right space-y-1"
            >
              <p className="text-xl font-display">{res.role}</p>
              <p className="text-sm text-gray-300">{res.description}</p>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl">
          فعلا نه!
        </button>
      </div>
    </div>
  );
};


const SimulationView: React.FC<SimulationViewProps> = ({ planet, data, onStartChat, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSouvenirModalOpen, setIsSouvenirModalOpen] = useState(false);
  const cityImageUrl = `https://pollinations.ai/p/${encodeURIComponent(data.cityImagePrompt)}`;
  
  const icons = {
    lifestyle: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 100 2h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1-1v-.5a1.5 1.5 0 01-3 0V15a1 1 0 00-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h1a1 1 0 100-2H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>,
    government: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046A4.993 4.993 0 0116.954 8H18a1 1 0 110 2h-1.046A4.993 4.993 0 0112 14.954V16a1 1 0 11-2 0v-1.046A4.993 4.993 0 015.046 10H4a1 1 0 110-2h1.046A4.993 4.993 0 0110 3.046V2a1 1 0 011.3-.954zM12 5v10a3 3 0 010-6v-1a1 1 0 011-1h1a1 1 0 100-2h-1a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    military: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
    technology: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
       {isModalOpen && <ResidentModal onSelect={(role, persona) => { onStartChat(role, persona); setIsModalOpen(false); }} onClose={() => setIsModalOpen(false)} />}
       {isSouvenirModalOpen && <SouvenirPhotoModal planet={planet} simulationData={data} onClose={() => setIsSouvenirModalOpen(false)} />}
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200">
          &rarr; انتخاب یک سیاره دیگر
        </button>
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            {data.cityName}
          </h1>
          <p className="text-2xl text-gray-300 mt-2 font-display">شهری در سیاره {planet.name}</p>
        </div>

        <div className="mb-8 w-full aspect-video bg-gray-800 rounded-3xl overflow-hidden border-2 border-gray-700 shadow-2xl">
            <img src={cityImageUrl} alt={`نمایی از شهر ${data.cityName}`} className="w-full h-full object-cover" />
        </div>

        <div className="bg-gray-800/70 rounded-2xl p-6 mb-8 border-2 border-gray-700">
          <h2 className="text-3xl font-display text-white mb-3">درباره شهر</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{data.cityOverview}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoCard title="زندگی مردم" content={data.lifestyle} icon={icons.lifestyle} />
          <InfoCard title="قوانین شهر" content={data.government} icon={icons.government} />
          <InfoCard title="محافظان شهر" content={data.military} icon={icons.military} />
          <InfoCard title="فناوری و اختراعات" content={data.technology} icon={icons.technology} />
        </div>

        <div className="text-center p-6 bg-gray-800/70 rounded-2xl border-2 border-gray-700">
          <h2 className="text-3xl font-display text-white mb-4">ماجراجویی بیشتر!</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <button
              onClick={() => onStartChat('راهنمای تور', 'راهنمای تور')}
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
            >
              بپرس و یاد بگیر
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
            >
              با یک دوست صحبت کن
            </button>
            <button
              onClick={() => setIsSouvenirModalOpen(true)}
              className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
            >
              عکس فضایی بگیر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationView;
