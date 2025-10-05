import React, { useState } from 'react';
import type { Planet, SimulationData, View, ChatRole, ChatTarget, CustomPlanetParams, MainViewTab, PlanetAnalysisData } from './types';
import MainView from './components/MainView';
import SimulationView from './components/SimulationView';
import ChatView from './components/ChatView';
import VoiceChatView from './components/VoiceChatView';
import LoadingSpinner from './components/LoadingSpinner';
import { generateSimulation, generatePlanetAnalysis } from './services/geminiService';
import PlanetAnalysisView from './components/PlanetAnalysisView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const [activeTab, setActiveTab] = useState<MainViewTab>('explore');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planetAnalysisData, setPlanetAnalysisData] = useState<PlanetAnalysisData | null>(null);
  const [customPlanetParams, setCustomPlanetParams] = useState<CustomPlanetParams | null>(null);

  const handleSelectPlanetForSimulation = async (planet: Planet) => {
    setIsLoading(true);
    setError(null);
    setSelectedPlanet(planet);
    setPlanetAnalysisData(null);
    try {
      const data = await generateSimulation(planet.nameEn);
      setSimulationData(data);
      setView('simulation');
    } catch (err) {
      setError('اوه! مشکلی در ساخت سیاره پیش اومد. دوباره امتحان کن!');
      setView('main'); // Go back to main on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCustomPlanet = async (params: CustomPlanetParams) => {
    setIsLoading(true);
    setError(null);
    setCustomPlanetParams(params);

    const customPlanet: Planet = {
      name: params.name,
      nameEn: params.name,
      description: params.description || 'سیاره‌ای که شما خلق کرده‌اید.',
      image: `https://placehold.co/800x600/9F7AEA/FFFFFF/png?text=${encodeURIComponent(params.name)}`
    };
    setSelectedPlanet(customPlanet);

    const planetDescription = `
      نام سیاره: ${params.name}
      نوع سیاره: ${params.planetType}
      فاصله از ستاره میزبان: ${params.distanceFromStar}
      اتمسفر: ${params.atmosphere}
      گرانش سطحی: ${params.gravity}
      وجود آب: ${params.waterPresence}
      منابع کلیدی: ${params.resources || 'نامشخص'}
      نوع ستاره میزبان: ${params.starType}
      موقعیت در منظومه: ${params.systemLayout}
      محیط کهکشانی: ${params.galacticNeighborhood}
      توضیحات اضافی: ${params.description || 'ندارد'}
    `.trim();

    try {
      const data = await generatePlanetAnalysis(planetDescription);
      setPlanetAnalysisData(data);
      setView('planetAnalysis');
    } catch (err) {
      setError('اوه! تحلیل سیاره‌ای که ساختی با مشکل مواجه شد. دوباره امتحان کن!');
      setCustomPlanetParams(null);
      setSelectedPlanet(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateCustomPlanet = async () => {
    if (!customPlanetParams) return;

    setIsLoading(true);
    setError(null);
    setPlanetAnalysisData(null);

    const planetDescription = `
      یک شهر در این سیاره بساز. مشخصات سیاره:
      نام سیاره: ${customPlanetParams.name}
      نوع سیاره: ${customPlanetParams.planetType}
      فاصله از ستاره میزبان: ${customPlanetParams.distanceFromStar}
      اتمسفر: ${customPlanetParams.atmosphere}
      گرانش سطحی: ${customPlanetParams.gravity}
      وجود آب: ${customPlanetParams.waterPresence}
      منابع کلیدی: ${customPlanetParams.resources || 'نامشخص'}
      نوع ستاره میزبان: ${customPlanetParams.starType}
      موقعیت در منظومه: ${customPlanetParams.systemLayout}
      محیط کهکشانی: ${customPlanetParams.galacticNeighborhood}
      توضیحات اضافی: ${customPlanetParams.description || 'ندارد'}
    `.trim();
    
    try {
      const data = await generateSimulation(planetDescription);
      setSimulationData(data);
      setView('simulation');
    } catch (err) {
      setError('اوه! ساخت شهر در سیاره‌ای که ساختی با مشکل مواجه شد!');
      setView('main');
    } finally {
      setIsLoading(false);
      setCustomPlanetParams(null); // Clear custom params after simulation
    }
  };

  const handleAnalyzeLife = async (planet: Planet) => {
    setIsLoading(true);
    setError(null);
    setSelectedPlanet(planet);
    setCustomPlanetParams(null); // Not a custom planet
    try {
        const data = await generatePlanetAnalysis(planet.nameEn);
        setPlanetAnalysisData(data);
        setView('planetAnalysis');
    } catch (err) {
        setError('اوه! تحلیل زندگی در این سیاره با مشکل مواجه شد.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleProceedToSimulation = () => {
    if (customPlanetParams) {
      handleSimulateCustomPlanet();
    } else if (selectedPlanet) {
      handleSelectPlanetForSimulation(selectedPlanet);
    }
  };

  const handleStartChat = (role: ChatRole, persona: string) => {
    if (selectedPlanet && simulationData) {
      setChatTarget({ role, persona });
      setView('chat');
    }
  };

  const handleStartAstronautVoiceChat = () => {
    setView('voiceChat');
  };

  const handleStartAstronautTextChat = () => {
    const astronautPlanet: Planet = {
        name: 'ایستگاه فضایی بین‌المللی',
        nameEn: 'International Space Station',
        image: '', 
        description: '',
    };
    const astronautSimData: SimulationData = {
        cityName: 'مدار زمین',
        cityOverview: '',
        lifestyle: '',
        government: '',
        military: '',
        technology: '',
        cityImagePrompt: '',
    };
    setSelectedPlanet(astronautPlanet);
    setSimulationData(astronautSimData);
    setChatTarget({ role: 'فضانورد', persona: 'یک فضانورد ماجراجو' });
    setView('chat');
};

  const handleBackToMain = () => {
    setView('main');
    setSelectedPlanet(null);
    setSimulationData(null);
    setError(null);
    setPlanetAnalysisData(null);
    setCustomPlanetParams(null);
    setChatTarget(null);
  };
  
  const handleBackToSimulation = () => {
    setView('simulation');
    setChatTarget(null);
  };

  const renderView = () => {
    switch (view) {
      case 'voiceChat':
        return <VoiceChatView onBack={handleBackToMain} />;
      case 'planetAnalysis':
        if (selectedPlanet && planetAnalysisData) {
          return <PlanetAnalysisView
                    planet={selectedPlanet}
                    analysisData={planetAnalysisData}
                    onBack={handleBackToMain}
                    onSimulate={handleProceedToSimulation}
                  />
        }
        return null;
      case 'simulation':
        if (selectedPlanet && simulationData) {
          return <SimulationView 
                    planet={selectedPlanet} 
                    data={simulationData} 
                    onStartChat={handleStartChat}
                    onBack={handleBackToMain}
                 />;
        }
        return null;
      case 'chat':
        if (selectedPlanet && simulationData && chatTarget) {
          return <ChatView 
                    planet={selectedPlanet} 
                    simulationData={simulationData} 
                    chatTarget={chatTarget}
                    onBack={chatTarget.role === 'فضانورد' ? handleBackToMain : handleBackToSimulation}
                 />;
        }
        return null;
      case 'main':
      default:
        return <MainView 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onSelectPlanet={handleSelectPlanetForSimulation}
                  onGenerate={handleAnalyzeCustomPlanet}
                  onAnalyzeLife={handleAnalyzeLife}
                  onStartAstronautVoiceChat={handleStartAstronautVoiceChat}
                  onStartAstronautTextChat={handleStartAstronautTextChat}
                />;
    }
  };

  return (
    <div className="App">
      {isLoading && <LoadingSpinner />}
      {error && (
        <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-xl shadow-lg z-50 flex items-center gap-3">
          <p>🤔</p>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="mr-2 text-xl font-bold">&times;</button>
        </div>
      )}
      {renderView()}
    </div>
  );
};

export default App;