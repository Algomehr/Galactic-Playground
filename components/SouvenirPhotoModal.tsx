
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateSouvenirPhoto } from '../services/geminiService';
import type { Planet, SimulationData } from '../types';

interface SouvenirPhotoModalProps {
  planet: Planet;
  simulationData: SimulationData;
  onClose: () => void;
}

const SouvenirPhotoModal: React.FC<SouvenirPhotoModalProps> = ({ planet, simulationData, onClose }) => {
  const [step, setStep] = useState<'camera' | 'preview' | 'result'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError('دوربین کار نمی‌کنه! اجازه دادی ازش استفاده کنیم؟');
    }
  }, []);
  
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    // Cleanup on unmount
    return () => stopCamera();
  }, [step, startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        setStep('preview');
      }
    }
  };

  const handleGenerate = async () => {
      if (!capturedImage) return;
      setIsLoading(true);
      setError(null);
      try {
          const base64Data = capturedImage.split(',')[1];
          const resultBase64 = await generateSouvenirPhoto(base64Data, planet.name, simulationData);
          setEditedImage(`data:image/jpeg;base64,${resultBase64}`);
          setStep('result');
      } catch (err) {
          setError('اوه! دستگاه عکس جادویی کار نکرد. دوباره امتحان کن!');
      } finally {
          setIsLoading(false);
      }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setEditedImage(null);
    setError(null);
    setStep('camera');
  };

  const handleDownload = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = `souvenir-${planet.nameEn.toLowerCase().replace(' ', '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  const renderContent = () => {
    switch(step) {
      case 'camera':
        return (
          <>
            <h3 className="text-2xl font-display mb-4 text-white">یک لبخند فضایی بزن!</h3>
            <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-600">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            <button onClick={handleCapture} disabled={!!error} className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-full text-xl transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-display">
                بگیر!
            </button>
          </>
        );
      case 'preview':
        return (
            <>
                <h3 className="text-2xl font-display mb-4 text-white">عکست خوب شده؟</h3>
                <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-600">
                  <img src={capturedImage!} alt="عکس گرفته شده" className="w-full h-full object-cover" />
                </div>
                {isLoading ? (
                    <div className="text-center mt-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mx-auto mb-2"></div>
                        <p className="text-yellow-300">دارم عکس فضاییت رو آماده می‌کنم...</p>
                    </div>
                ) : (
                    <>
                    {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                    <div className="flex gap-4 mt-6">
                        <button onClick={handleRetake} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-full transition-colors font-display text-lg">
                            دوباره بگیر
                        </button>
                        <button onClick={handleGenerate} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-full transition-all font-display text-lg">
                            عکس فضایی بساز!
                        </button>
                    </div>
                    </>
                )}
            </>
        )
      case 'result':
        return (
            <>
                 <h3 className="text-2xl font-display mb-4 text-white">عکس فضایی تو آماده است!</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                         <p className="text-center text-gray-400 mb-2 text-sm">عکس خودت</p>
                         <img src={capturedImage!} alt="عکس اصلی" className="rounded-2xl w-full aspect-video object-cover" />
                     </div>
                     <div>
                        <p className="text-center text-white mb-2 text-sm">یادگاری از {planet.name}</p>
                        <img src={editedImage!} alt={`یادگاری از ${planet.name}`} className="rounded-2xl w-full aspect-video object-cover" />
                     </div>
                 </div>
                 <div className="flex gap-4 mt-6">
                    <button onClick={handleRetake} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-full transition-colors font-display text-lg">
                        دوباره بگیر
                    </button>
                    <button onClick={handleDownload} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-full transition-colors font-display text-lg">
                        دانلود
                    </button>
                </div>
            </>
        )
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center z-50 p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
    >
      <div 
        className="bg-gray-800 rounded-3xl p-6 max-w-2xl w-full border-2 border-teal-500 shadow-2xl relative transition-all animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10" aria-label="بستن">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {renderContent()}
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

export default SouvenirPhotoModal;
