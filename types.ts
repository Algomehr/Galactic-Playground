// FIX: Define and export all necessary types for the application.
// The original content of this file was incorrect.

export interface Planet {
  name: string;
  nameEn: string;
  image: string;
  description: string;
}

export interface SimulationData {
  cityName: string;
  cityOverview: string;
  lifestyle: string;
  government: string;
  military: string;
  technology: string;
  cityImagePrompt: string;
}

export interface PlanetAnalysisData {
  lifePossibility: string;
  dominantLifeForm: string;
  reasoning: string;
  adaptationFeatures: string;
  lifespan: string;
  lifeCycle: string;
  atmosphericConditions: string;
  planetImagePrompt: string;
  lifeFormImagePrompt: string;
  environmentImagePrompts: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text?: string;
  imageUrl?: string;
}

export type ChatRole = 'راهنمای تور' | 'مهندس' | 'شهروند' | 'پزشک' | 'دانشمند' | 'دولتمرد' | 'فضانورد';

export interface ChatTarget {
  role: ChatRole;
  persona: string;
}

export type View = 'main' | 'simulation' | 'chat' | 'voiceChat' | 'planetAnalysis';

export interface CustomPlanetParams {
  name: string;
  planetType: string;
  distanceFromStar: string;
  atmosphere: string;
  gravity: string;
  waterPresence: string;
  resources: string;
  description: string;
  starType: string;
  systemLayout: string;
  galacticNeighborhood: string;
}

export type MainViewTab = 'explore' | 'create' | 'life' | 'astronaut';
