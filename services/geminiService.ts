import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type { SimulationData, ChatMessage, ChatTarget, PlanetAnalysisData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const simulationSchema = {
  type: Type.OBJECT,
  properties: {
    cityName: { type: Type.STRING, description: 'یک نام خلاقانه و مناسب برای شهر' },
    cityOverview: { type: Type.STRING, description: 'توضیح کلی درباره شهر، معماری و ظاهر آن' },
    lifestyle: { type: Type.STRING, description: 'شرح سبک زندگی، فرهنگ و فعالیت‌های روزمره ساکنان' },
    government: { type: Type.STRING, description: 'توضیح سیستم حکومتی و ساختار سیاسی شهر' },
    military: { type: Type.STRING, description: 'شرح سیستم نظامی، دفاعی و امنیتی' },
    technology: { type: Type.STRING, description: 'توضیح سطح فناوری، نوآوری‌ها و ابزارهای مورد استفاده' },
    cityImagePrompt: { type: Type.STRING, description: 'یک پرامپت انگلیسی دقیق و هنری برای هوش مصنوعی متن به عکس جهت تولید تصویر شهر. مثال: "futuristic martian city, red dust, glass domes, cyberpunk, hyperrealistic, octane render, 8k"' },
  },
  required: ['cityName', 'cityOverview', 'lifestyle', 'government', 'military', 'technology', 'cityImagePrompt'],
};

export async function generateSimulation(planetDescription: string): Promise<SimulationData> {
    try {
        const prompt = `شما یک شبیه‌ساز هوشمند حیات هستید. بر اساس داده‌های علمی شناخته شده یا توضیحات ارائه شده برای سیاره/قمر زیر، یک شهر آینده‌نگرانه قابل قبول طراحی کنید. توضیحات باید خلاقانه، علمی-تخیلی و جذاب باشد.

سیاره/قمر: "${planetDescription}"

توضیحات دقیق، خلاقانه و جذابی برای هر بخش ارائه دهید.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: simulationSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as SimulationData;
    } catch (error) {
        console.error("Error generating simulation:", error);
        throw new Error("Failed to generate simulation from AI.");
    }
}

const planetAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    lifePossibility: { type: Type.STRING, description: 'احتمال وجود حیات (مثلاً: بالا، متوسط، کم، بسیار بعید)' },
    dominantLifeForm: { type: Type.STRING, description: 'توصیف شکل غالب حیات احتمالی (مثلاً: میکروب‌های شیمیوتروف، حیات مبتنی بر سیلیکون)' },
    reasoning: { type: Type.STRING, description: 'استدلال علمی دقیق برای این پیش‌بینی بر اساس ویژگی‌های سیاره' },
    adaptationFeatures: { type: Type.STRING, description: 'ویژگی‌های کلیدی سازگاری که این شکل از حیات برای بقا نیاز دارد' },
    lifespan: { type: Type.STRING, description: 'پیش‌بینی طول عمر سیاره بر اساس ویژگی‌های ستاره میزبان و زمین‌شناسی سیاره' },
    lifeCycle: { type: Type.STRING, description: 'شرح مختصری از چرخه عمر سیاره (مثلاً: شکل‌گیری، دوره فعال زمین‌شناسی، سرد شدن و مرگ)' },
    atmosphericConditions: { type: Type.STRING, description: 'تحلیل دقیق شرایط جوی، از جمله ترکیبات اصلی، فشار، دما و پدیده‌های آب و هوایی' },
    planetImagePrompt: { type: Type.STRING, description: 'یک پرامپت انگلیسی دقیق برای هوش مصنوعی متن به عکس جهت تولید تصویر سیاره از فضا، انگار که با تلسکوپ هابل یا جیمز وب گرفته شده است. مثال: "a rocky exoplanet with thin atmosphere, visible continents and oceans, space telescope view, nebula background, hyperrealistic, 8k"' },
    lifeFormImagePrompt: { type: Type.STRING, description: 'یک پرامپت انگلیسی دقیق و هنری برای هوش مصنوعی متن به عکس جهت تولید تصویر شکل حیات. مثال: "bioluminescent silicon-based creature, Europa\'s deep ocean, dark, cinematic lighting, horror, detailed, macro shot"' },
    environmentImagePrompts: {
        type: Type.ARRAY,
        description: 'آرایه‌ای شامل دقیقاً دو پرامپت انگلیسی مجزا برای تولید تصاویر از دو محیط متفاوت بر سطح سیاره. مثال: ["vast red desert with twin suns in the sky, strange rock formations, matte painting", "glowing alien jungle at night, bioluminescent plants, foggy, cinematic"]',
        items: {
          type: Type.STRING
        }
    }
  },
  required: ['lifePossibility', 'dominantLifeForm', 'reasoning', 'adaptationFeatures', 'lifespan', 'lifeCycle', 'atmosphericConditions', 'planetImagePrompt', 'lifeFormImagePrompt', 'environmentImagePrompts'],
};

export async function generatePlanetAnalysis(planetDescription: string): Promise<PlanetAnalysisData> {
  try {
    const prompt = `شما یک اخترزیست‌شناس و سیاره‌شناس متخصص هستید. یک تحلیل علمی جامع و دقیق در مورد سیاره/قمر زیر ارائه دهید. بر اساس ویژگی‌های شناخته‌شده آن، یک فرضیه علمی معقول و مستدل برای تمام جوانب مورد نیاز ارائه دهید. همچنین، 4 پرامپت تصویر خلاقانه و هنری به زبان انگلیسی بسازید.

سیاره/قمر: "${planetDescription}"

برای هر بخش، توضیحات دقیق، خلاقانه و علمی ارائه دهید.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planetAnalysisSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as PlanetAnalysisData;
  } catch (error) {
    console.error("Error generating planet analysis:", error);
    throw new Error("Failed to generate planet analysis from AI.");
  }
}

export async function createImageGenerationPrompt(subject: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Subject: "${subject}"`,
            config: {
                systemInstruction: "You are an expert prompt engineer for a text-to-image AI model. Your task is to create a detailed, visually rich, and artistic prompt in English based on the user's subject. The prompt should be a single continuous string of descriptive keywords and phrases, separated by commas. Focus on style, lighting, composition, and specific details. Do not add any conversational text or explanations. Only output the prompt itself."
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error creating image generation prompt:", error);
        throw new Error("Failed to create image prompt from AI.");
    }
}

export async function generateSouvenirPhoto(base64ImageData: string, planetName: string, simulationData: SimulationData): Promise<string> {
    try {
        const prompt = `You are an AI digital artist. The user has provided a low-quality selfie. Your task is to use this selfie ONLY as a reference for their facial features, hair style, and general likeness.
        DO NOT simply edit the original photo or place it in a new background.
        Instead, you must completely RE-IMAGINE and RE-DRAW the person as a space traveler, creating a new, high-quality, artistic image.
        
        The setting is the city of "${simulationData.cityName}" on the planet "${planetName}".
        - City description: "${simulationData.cityOverview}"
        - Planet environment hints: "${simulationData.lifestyle}"

        Incorporate the style of the city and planet into the artwork. The person should be wearing futuristic, sci-fi appropriate clothing. The final result should be a stunning digital painting or concept art that serves as a souvenir, while making sure the person in the artwork is clearly recognizable as the person from the selfie. Make the final image look cool and artistic, not like a simple photo edit.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: 'image/jpeg',
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }

        throw new Error("AI did not return an image.");

    } catch (error) {
        console.error("Error generating souvenir photo:", error);
        throw new Error("Failed to generate souvenir photo from AI.");
    }
}

let chatInstance: Chat | null = null;

export function startChatSession(planetName: string, cityName: string, chatTarget: ChatTarget): Chat {
    let systemInstruction = '';
    const conversationalPrompt = "با بچه‌ها حرف می‌زنی پس خیلی ساده، شاد و دوستانه صحبت کن. جواب‌هات کوتاه و هیجان‌انگیز باشه! می‌تونی از شکلک‌های متنی مثل :) یا :D هم استفاده کنی. از کلمه‌های سخت استفاده نکن.";
    
    switch (chatTarget.role) {
        case 'راهنمای تور':
            systemInstruction = `تو یک راهنمay تور خیلی خوشحال و پرانرژی در شهر "${cityName}" روی سیاره "${planetName}" هستی. تو عاشق اینی که چیزهای جالب رو به بچه‌ها نشون بدی! ${conversationalPrompt}`;
            break;
        case 'مهندس':
            systemInstruction = `تو یک مهندس خلاق و باهوش در شهر "${cityName}" در سیاره "${planetName}" هستی. تو ماشین‌ها و ساختمان‌های شگفت‌انگیز می‌سازی و دوست داری برای بچه‌ها توضیح بدی که چطوری کار می‌کنن. ${conversationalPrompt}`;
            break;
        case 'شهروند':
            systemInstruction = `تو یک شهروند مهربون در شهر "${cityName}" در سیاره "${planetName}" هستی. تو برای بچه‌ها از زندگی روزمره، بازی‌ها و غذاهای خوشمزه اینجا میگی. ${conversationalPrompt}`;
            break;
        case 'پزشک':
            systemInstruction = `تو یک دکتر مهربون در شهر "${cityName}" در سیاره "${planetName}" هستی. تو به بچه‌ها کمک می‌کنی سالم و قوی بمونن و به سوالاتشون در مورد بدن و سلامتی به زبون ساده جواب میدی. ${conversationalPrompt}`;
            break;
        case 'دانشمند':
            systemInstruction = `تو یک دانشمند کنجکاو و بامزه در شهر "${cityName}" در سیاره "${planetName}" هستی. تو عاشق کشف کردن چیزهای جدید در مورد این سیاره هستی و اکتشافاتت رو با هیجان برای بچه‌ها تعریف می‌کنی. ${conversationalPrompt}`;
            break;
        case 'دولتمرد':
            systemInstruction = `تو شهردار مهربون شهر "${cityName}" در سیاره "${planetName}" هستی. تو به بچه‌ها میگی که چطوری همه با هم در صلح و شادی زندگی می‌کنن و قوانین چطور به همه کمک می‌کنه. ${conversationalPrompt}`;
            break;
        case 'فضانورد':
            systemInstruction = `تو یک فضانورد شجاع و ماجراجو هستی که به همه جا سفر کرده! تو در "${cityName}" هستی و داستان‌های هیجان‌انگیز سفر به ستاره‌ها و سیاره‌های مختلف رو برای بچه‌ها تعریف می‌کنی. هدف تو اینه که بچه‌ها رو به فضا و علم علاقه‌مند کنی. ${conversationalPrompt}`;
            break;
    }

    chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.8, 
        }
    });
    return chatInstance;
}

export async function continueChat(message: string): Promise<string> {
    if (!chatInstance) {
        throw new Error("Chat session not started.");
    }
    try {
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error in chat:", error);
        throw new Error("Failed to get a response from the AI.");
    }
}