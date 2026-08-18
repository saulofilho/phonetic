export type PhoneticNotation = 'ipa' | 'respell' | 'pinyin' | 'romaji' | 'arpabet';

export interface WordToken {
  original: string;
  ipa: string;
  syllables?: string;
  stress?: string;
  translation?: string;
  partOfSpeech?: string;
  notes?: string;
}

export interface PhoneticResult {
  id: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  sourceIpa: string;
  targetIpa?: string;
  syllableBreakdown?: string;
  simplifiedRespell?: string;
  words: WordToken[];
  pronunciationNotes: string[];
  homophones?: string[];
  timestamp: number;
}

export interface ExtensionSettings {
  defaultSourceLang: string;
  defaultTargetLang: string;
  defaultNotation: PhoneticNotation;
  showTooltipOnSelect: boolean;
  autoSpeakOnLookup: boolean;
  speechRate: number;
  speechPitch: number;
  preferredVoice: string;
  enableRubyGlosses: boolean;
  enableContextMenu: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
}

export interface ExtensionFile {
  name: string;
  path: string;
  content: string;
  description: string;
  language: string;
}
