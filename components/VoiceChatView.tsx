import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Session, Blob } from "@google/genai";
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

const AstronautAvatar: React.FC<{ isSpeaking: boolean, isListening: boolean }> = ({ isSpeaking, isListening }) => {
    return (
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
            <div className={`absolute inset-0 rounded-full bg-yellow-400 transition-all duration-500 ${isSpeaking ? 'animate-ping-slow opacity-75' : 'opacity-0'}`}></div>
            <div className={`absolute inset-0 rounded-full border-4 border-dashed border-teal-400 transition-all duration-500 ${isListening ? 'animate-spin-slow opacity-100' : 'opacity-0'}`}></div>
            <div className="relative z-10 w-full h-full bg-gray-700 rounded-full flex items-center justify-center text-8xl sm:text-9xl border-4 border-gray-600">
                🧑‍🚀
            </div>
        </div>
    );
};

const VoiceChatView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [status, setStatus] = useState('در حال آماده‌سازی برای تماس...');
    const [error, setError] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [modelTranscript, setModelTranscript] = useState('');

    const sessionPromiseRef = useRef<Promise<Session> | null>(null);
    
    const cleanupRef = useRef<(() => void) | null>(null);

    const startConversation = useCallback(async () => {
        setError(null);
        setStatus('در حال درخواست دسترسی به میکروفون...');

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // Fix: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
        const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        // Fix: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputAudioContext.createGain();
        outputNode.connect(outputAudioContext.destination);
        const sources = new Set<AudioBufferSourceNode>();
        let nextStartTime = 0;
        let stream: MediaStream | null = null;
        let scriptProcessor: ScriptProcessorNode | null = null;
        let mediaSource: MediaStreamAudioSourceNode | null = null;
        
        const cleanup = () => {
          if (cleanupRef.current === cleanup) {
              inputAudioContext.close();
              outputAudioContext.close();
              if (stream) {
                  stream.getTracks().forEach(track => track.stop());
              }
              if(scriptProcessor) {
                  scriptProcessor.disconnect();
              }
              if(mediaSource) {
                  mediaSource.disconnect();
              }
              sessionPromiseRef.current?.then(session => session.close());
              setIsListening(false);
              setIsSpeaking(false);
              console.log("Cleanup complete.");
          }
        };
        cleanupRef.current = cleanup;

        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                }
            });
            
            setStatus('در حال برقراری ارتباط با فضا...');

            const systemInstruction = `
شما کاپیتان کیان، یک فضانورد شجاع و ماجراجو هستید. شخصیت شما کاملاً ثابت است.

**داستان پس‌زمینه شما:**
- **نام:** کاپیتان کیان
- **شخصیت:** شجاع، خوش‌بین، شوخ‌طبع، بی‌نهایت کنجکاو و عاشق فضا. شما از توضیح مفاهیم پیچیده به زبان ساده و هیجان‌انگیز لذت می‌برید و در همه چیز شگفتی می‌بینید.
- **سفینه فضایی:** شما فرمانده سفینه اکتشافی "کاوش-۱" هستید، یک سفینه زیبا که با انرژی خورشیدی کار می‌کند.
- **همکار هوش مصنوعی:** شما یک همکار هوش مصنوعی به نام "دانا" دارید که گاهی اوقات در مکالمات به او اشاره می‌کنید (مثلاً: "دانا میگه داریم به یک سحابی نزدیک میشیم!").
- **ماموریت فعلی:** شما در حال نقشه‌برداری از بخش ناشناخته‌ای از کهکشان به نام "بخش ادیب" هستید که به پدیده‌های کیهانی عجیب و زیبایش معروف است.
- **خاطره ویژه:** خاطره مورد علاقه شما برای تعریف کردن، مربوط به زمانی است که روی سیاره "شب‌تاب-۷" فرود آمدید و جنگل‌هایی از قارچ‌های غول‌پیکر و درخشان را کشف کردید و با موجودات کوچک و پشمالویی به نام "فوفولوها" دوست شدید که با تغییر رنگ با شما حرف می‌زدند.
- **هدف اصلی:** هدف شما صحبت با کودکان روی زمین و الهام بخشیدن به آنها برای تبدیل شدن به نسل بعدی دانشمندان، مهندسان و کاشفان است.

**قوانین گفتگو:**
- همیشه در نقش کاپیتان کیان باقی بمانید.
- با بچه‌ها حرف می‌زنید پس خیلی ساده، شاد و دوستانه صحبت کنید. جواب‌هایتان کوتاه و هیجان‌انگیز باشد.
- از داستان پس‌زمینه خود (سفینه کاوش-۱، هوش مصنوعی دانا، سیاره شب‌تاب-۷ و فوفولوها) در جواب‌هایتان استفاده کنید تا شخصیت شما واقعی به نظر برسد.
- همیشه مکالمات را با یک پیام مثبت و الهام‌بخش تمام کنید (مثلاً: "یادت باشه، ستاره‌ها منتظر تو هستن!").
- از کلمه‌های سخت استفاده نکنید.
`;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('ارتباط برقرار شد! صحبت کن...');
                        setIsListening(true);
                        mediaSource = inputAudioContext.createMediaStreamSource(stream!);
                        scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        mediaSource.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.outputTranscription) {
                            setIsSpeaking(true);
                            setModelTranscript(prev => prev + message.serverContent.outputTranscription.text);
                        } else if (message.serverContent?.inputTranscription) {
                            setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
                        }

                        if (message.serverContent?.turnComplete) {
                            setIsSpeaking(false);
                            setUserTranscript('');
                            setModelTranscript('');
                        }
                        
                        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64EncodedAudioString) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => {
                                sources.delete(source);
                                if (sources.size === 0) setIsSpeaking(false);
                            });
                            source.start(nextStartTime);
                            nextStartTime = nextStartTime + audioBuffer.duration;
                            sources.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            for (const source of sources.values()) {
                                source.stop();
                                sources.delete(source);
                            }
                            nextStartTime = 0;
                            setIsSpeaking(false);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        setError(`اوه! ارتباط با ایستگاه فضایی قطع شد: ${e.message}`);
                        setIsListening(false);
                        setIsSpeaking(false);
                        cleanup();
                    },
                    onclose: (e: CloseEvent) => {
                        setStatus('تماس به پایان رسید.');
                        setIsListening(false);
                        setIsSpeaking(false);
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: systemInstruction,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (err) {
            console.error(err);
            setError('نتونستم به میکروفون دسترسی پیدا کنم. اجازه دادی؟');
            setStatus('خطا در دسترسی به میکروفون');
        }
    }, []);

    useEffect(() => {
        startConversation();
        return () => {
            cleanupRef.current?.();
        };
    }, [startConversation]);

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white p-4 sm:p-6 items-center justify-center animate-fade-in">
            <div className="w-full max-w-4xl text-center">
                <h1 className="text-4xl sm:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
                    تماس صوتی با فضانورد
                </h1>

                <AstronautAvatar isSpeaking={isSpeaking} isListening={isListening} />

                <p className="text-xl text-yellow-300 mt-6 h-8">{error || status}</p>

                <div className="mt-6 p-4 bg-gray-800/50 rounded-2xl min-h-[100px] text-right text-lg">
                    <p className="text-gray-400">
                        <span className="font-bold text-white">تو: </span>
                        {userTranscript || "..."}
                    </p>
                    <p className="text-teal-300 mt-2">
                         <span className="font-bold text-white">کاپیتان کیان: </span>
                         {modelTranscript || "..."}
                    </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                     <button
                        onClick={onBack}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-4 px-10 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 font-display"
                    >
                        پایان تماس
                    </button>
                    <button onClick={startConversation} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors">
                        راه اندازی مجدد
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
                @keyframes ping-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.75; }
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default VoiceChatView;