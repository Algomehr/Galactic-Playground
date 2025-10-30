import React, { useState, useEffect, useRef } from 'react';
import { generateAudio } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

interface StoryModalProps {
  planetName: string;
  story: string;
  onClose: () => void;
}

const AudioButton: React.FC<{
  isLoading: boolean;
  isPlaying: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ isLoading, isPlaying, onClick, disabled }) => {
  let content;
  if (isLoading) {
    content = (
      <>
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        آماده‌سازی صدا...
      </>
    );
  } else if (isPlaying) {
    content = (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" /></svg>
        توقف
      </>
    );
  } else {
    content = (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        برام بخون
      </>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 text-lg font-display flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {content}
    </button>
  );
};

const StoryModal: React.FC<StoryModalProps> = ({ planetName, story, onClose }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!story) return;
      setIsAudioLoading(true);
      setAudioError(null);
      try {
        const base64Audio = await generateAudio(story);
        setAudioData(base64Audio);
      } catch (error) {
        console.error("Failed to fetch story audio:", error);
        setAudioError("متاسفانه نشد صدا رو آماده کنم.");
      } finally {
        setIsAudioLoading(false);
      }
    };

    fetchAudio();
  }, [story]);

  useEffect(() => {
    // Cleanup function
    return () => {
      audioSourceRef.current?.stop();
      audioContextRef.current?.close().catch(console.error);
    };
  }, []);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioSourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    if (!audioData) return;

    try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            // Fix: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        
        const audioBuffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        source.onended = () => {
            setIsPlaying(false);
            audioSourceRef.current = null;
        };
        
        source.start();
        audioSourceRef.current = source;
        setIsPlaying(true);

    } catch (error) {
        console.error("Error playing audio:", error);
        setAudioError("مشکلی در پخش صدا پیش اومد.");
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-title"
    >
      <div 
        className="bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-yellow-500 shadow-2xl transform transition-all animate-fade-in-up flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
            <h2 id="story-title" className="text-3xl sm:text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                ماجراجویی تو در {planetName}
            </h2>
        </div>
        
        <div className="max-h-[55vh] overflow-y-auto pr-2 space-y-4 mb-6">
            <p className="text-gray-200 whitespace-pre-line text-lg leading-relaxed text-justify">
                {story}
            </p>
        </div>

        {audioError && <p className="text-red-400 text-center text-sm mb-4">{audioError}</p>}
        
        <div className="mt-auto flex flex-col sm:flex-row gap-4">
           <AudioButton 
              isLoading={isAudioLoading}
              isPlaying={isPlaying}
              onClick={handlePlayPause}
              disabled={!audioData || !!audioError}
            />
            <button 
                onClick={onClose} 
                className="w-full flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-full transition-colors duration-200 text-lg font-display"
            >
              عالی بود!
            </button>
        </div>
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

export default StoryModal;