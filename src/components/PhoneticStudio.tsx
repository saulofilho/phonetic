import React, { useState } from 'react';
import { 
  Volume2, 
  Copy, 
  Check, 
  Sparkles, 
  BookMarked, 
  ArrowRightLeft, 
  Layers, 
  Zap,
  Terminal,
  Activity,
  Cpu,
  Radio,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { PhoneticResult, WordToken } from '../types';
import { playSpeech } from '../utils/speech';
import { getFallbackPhonetic } from '../utils/phoneticFallback';

interface PhoneticStudioProps {
  onSaveToPractice: (result: PhoneticResult) => void;
  onOpenSimulatorWithText: (text: string) => void;
}

const PRESET_EXAMPLES = [
  { label: 'Transcrição Fonética', text: 'phonetic transcription and cyber pronunciation', lang: 'en' },
  { label: 'Palavras Desafiadoras', text: 'schedule comfortable throughout thoroughly algorithm', lang: 'en' },
  { label: 'Neural Synthesizer', text: 'The synthetic neural network decodes phonetic frequencies flawlessly.', lang: 'en' },
  { label: 'Português Cibernético', text: 'A pronúncia do português brasileiro é melódica e rica em frequências nasais.', lang: 'pt' },
  { label: 'Espanhol Cyber', text: 'El desarrollo de la inteligencia artificial transforma la comunicación.', lang: 'es' },
  { label: 'Francês Phonétique', text: 'La phonétique française est pleine de liaisons et de résonances.', lang: 'fr' }
];

export const PhoneticStudio: React.FC<PhoneticStudioProps> = ({ onSaveToPractice, onOpenSimulatorWithText }) => {
  const [inputText, setInputText] = useState('phonetic transcription');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhoneticResult | null>(() => getFallbackPhonetic('phonetic transcription', 'en', 'pt'));
  const [copiedIpa, setCopiedIpa] = useState(false);
  const [copiedTrans, setCopiedTrans] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.9);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleTranscribeAndTranslate = async (textToUse = inputText) => {
    const clean = textToUse.trim();
    if (!clean) return;

    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/phonetic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean,
          sourceLang,
          targetLang
        })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data: PhoneticResult = await res.json();
      setResult(data);
    } catch (err) {
      console.warn('Usando motor de contingência offline:', err);
      const fallbackData = getFallbackPhonetic(clean, sourceLang, targetLang);
      setResult(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'ipa' | 'trans') => {
    navigator.clipboard.writeText(text);
    if (type === 'ipa') {
      setCopiedIpa(true);
      setTimeout(() => setCopiedIpa(false), 2000);
    } else {
      setCopiedTrans(true);
      setTimeout(() => setCopiedTrans(false), 2000);
    }
  };

  const handlePlayAudio = async (text: string, speed = speechSpeed) => {
    setIsPlayingAudio(true);
    await playSpeech(text, sourceLang, speed);
    setIsPlayingAudio(false);
  };

  const handlePlayWord = async (word: WordToken, index: number) => {
    setActiveWordIndex(index);
    setIsPlayingAudio(true);
    await playSpeech(word.original, sourceLang, speechSpeed);
    setIsPlayingAudio(false);
  };

  const handleSaveCard = () => {
    if (!result) return;
    onSaveToPractice(result);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cyberpunk HUD Hero Banner */}
      <div className="relative bg-[#070b14] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Glowing cyber accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-16 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,1)]" />
        <div className="absolute top-0 left-0 h-16 w-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,1)]" />
        <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-pink-500 shadow-[0_0_8px_rgba(255,0,127,1)]" />
        <div className="absolute bottom-0 right-0 h-16 w-[2px] bg-pink-500 shadow-[0_0_8px_rgba(255,0,127,1)]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.3)] flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                NEURAL PROTOCOL // IPA MATRIX
              </span>
              <span className="text-[10px] font-mono text-pink-400/90 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/30">
                [V3 CHROME INJECTOR]
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-pink-300 tracking-tight">
              ESTÚDIO FONÉTICO // DECODIFICADOR NEURAL
            </h1>
            
            <p className="text-xs font-mono text-slate-300 max-w-2xl leading-relaxed">
              Tradução e decodificação acústica de alta precisão. Transcrição com <span className="text-cyan-400 font-bold">Alfabeto Fonético Internacional (IPA)</span>, divisões de frequência silábica e síntese vocal com modulação de velocidade.
            </p>
          </div>

          {/* Quick Presets HUD */}
          <div className="bg-[#050811]/90 border border-cyan-500/30 p-3.5 rounded-xl space-y-2 lg:max-w-xs shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase font-bold">
              <span>// PRESETS DE ENTRADA</span>
              <Activity className="w-3 h-3 text-pink-400 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(ex.text);
                    setSourceLang(ex.lang);
                    handleTranscribeAndTranslate(ex.text);
                  }}
                  className="text-[11px] font-mono bg-slate-900/90 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 px-2.5 py-1 rounded border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cyber Input Terminal */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#090e1a] border-2 border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] space-y-4 relative">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs font-black uppercase text-cyan-300 tracking-wider">
                  TERMINAL_INPUT // CONFIG
                </span>
              </div>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>

            {/* Language Matrix */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-mono font-bold text-cyan-400/90 uppercase mb-1">
                  ORIGEM [IN]
                </label>
                <select
                  id="select-source-lang"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full bg-black/80 border border-cyan-500/40 text-cyan-200 font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-500 focus:shadow-[0_0_10px_rgba(255,0,127,0.4)] transition-all"
                >
                  <option value="en">🇺🇸 INGLÊS (US - AMERICAN)</option>
                  <option value="en-gb">🇬🇧 INGLÊS (UK - BRITISH)</option>
                  <option value="pt">🇧🇷 PORTUGUÊS (BR)</option>
                  <option value="es">🇪🇸 ESPANHOL</option>
                  <option value="fr">🇫🇷 FRANCÊS</option>
                  <option value="de">🇩🇪 ALEMÃO</option>
                  <option value="it">🇮🇹 ITALIANO</option>
                  <option value="ja">🇯🇵 JAPONÊS (ROMAJI/IPA)</option>
                  <option value="zh">🇨🇳 MANDARIM (PINYIN/IPA)</option>
                </select>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  title="Inverter canais de idioma"
                  onClick={() => {
                    const temp = sourceLang;
                    setSourceLang(targetLang);
                    setTargetLang(temp);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <label className="block text-[11px] font-mono font-bold text-pink-400/90 uppercase mb-1">
                  DESTINO [OUT]
                </label>
                <select
                  id="select-target-lang"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full bg-black/80 border border-pink-500/40 text-pink-200 font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all"
                >
                  <option value="pt">🇧🇷 PORTUGUÊS (BRASIL)</option>
                  <option value="en">🇺🇸 INGLÊS</option>
                  <option value="es">🇪🇸 ESPANHOL</option>
                  <option value="fr">🇫🇷 FRANCÊS</option>
                </select>
              </div>
            </div>

            {/* Input Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                  <span>TEXTO_FONTE:</span>
                </label>
                <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  {inputText.length} BYTES
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="studio-input-textarea"
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Insira sequências de texto, palavras ou diálogos..."
                  className="w-full bg-black/90 border border-cyan-500/40 text-cyan-100 font-mono text-sm rounded-xl p-3.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] resize-none leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleTranscribeAndTranslate();
                    }
                  }}
                />
                {inputText && (
                  <button
                    onClick={() => setInputText('')}
                    className="absolute top-2.5 right-2.5 text-slate-500 hover:text-pink-400 font-mono text-xs p-1"
                    title="Limpar campo"
                  >
                    [CLEAR]
                  </button>
                )}
              </div>
            </div>

            {/* Cyberpunk Synthesizer Speed Slider / Rate buttons */}
            <div className="bg-black/70 rounded-xl p-3.5 border border-cyan-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5 uppercase">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> FREQUÊNCIA VOCAL:
                </span>
                <span className="font-bold text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/30 shadow-[0_0_8px_rgba(255,0,127,0.4)]">
                  {speechSpeed}x RATE
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { speed: 0.5, label: '0.5x SLOW' },
                  { speed: 0.7, label: '0.7x DECODE' },
                  { speed: 0.9, label: '0.9x NORM' },
                  { speed: 1.0, label: '1.0x FAST' },
                  { speed: 1.25, label: '1.25x HYPER' }
                ].map((item) => (
                  <button
                    key={item.speed}
                    onClick={() => setSpeechSpeed(item.speed)}
                    className={`flex-1 py-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      speechSpeed === item.speed
                        ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                        : 'bg-slate-900 text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="btn-analyze-studio"
                onClick={() => handleTranscribeAndTranslate()}
                disabled={loading || !inputText.trim()}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-black font-mono font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>DECODIFICANDO FREQUÊNCIAS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-black" />
                    <span>EXECUTAR TRANSCRIÇÃO NEURAL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handlePlayAudio(inputText)}
                disabled={!inputText.trim()}
                title="Sintetizar áudio"
                className={`p-3.5 rounded-xl border font-mono transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 ${
                  isPlayingAudio
                    ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.8)] animate-pulse'
                    : 'bg-slate-900 hover:bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-500 text-center">
              PRESSIONE <kbd className="px-1.5 py-0.5 bg-black border border-cyan-500/30 rounded text-cyan-300 font-mono">CTRL + ENTER</kbd> PARA DISPARAR
            </div>
          </div>
        </div>

        {/* Right Column: Cyber Phonetic Results HUD */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-[#090e1a] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,240,255,0.1)] space-y-5">
              {/* Header result row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)] rounded">
                    IPA_DECODED
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    {sourceLang.toUpperCase()} ➔ {targetLang.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center space-x-2 font-mono">
                  <button
                    onClick={() => handlePlayAudio(result.sourceText, speechSpeed)}
                    className="flex items-center space-x-1.5 text-xs bg-cyan-950/80 hover:bg-cyan-500 hover:text-black text-cyan-300 px-3 py-1.5 rounded border border-cyan-400/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] transition-all font-bold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>AUDIO ({speechSpeed}x)</span>
                  </button>

                  <button
                    onClick={() => handleCopy(result.sourceIpa, 'ipa')}
                    className="flex items-center space-x-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded border border-slate-700 transition-all font-bold cursor-pointer"
                  >
                    {copiedIpa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedIpa ? 'COPIADO' : 'COPIAR IPA'}</span>
                  </button>

                  <button
                    onClick={handleSaveCard}
                    className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded border font-bold transition-all cursor-pointer ${
                      savedSuccess
                        ? 'bg-pink-950/80 text-pink-300 border-pink-400 shadow-[0_0_12px_rgba(255,0,127,0.5)]'
                        : 'bg-slate-900 hover:bg-pink-950 text-slate-300 hover:text-pink-300 border-slate-700'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5 text-pink-400" />
                    <span>{savedSuccess ? 'SALVO NO RIG!' : '+ FLASHCARD'}</span>
                  </button>
                </div>
              </div>

              {/* Large Glowing IPA Display */}
              <div className="bg-gradient-to-br from-black via-[#080d18] to-cyan-950/30 border-2 border-cyan-400/60 rounded-2xl p-5 relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <div className="flex items-start justify-between font-mono">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                    TRANSCRIÇÃO FONÉTICA INTERNACIONAL (IPA):
                  </span>
                  <span className="text-[10px] text-slate-400">ˈ = TONICIDADE // ˌ = SECUNDÁRIO</span>
                </div>

                <div className="text-2xl sm:text-4xl font-black text-cyan-300 font-mono my-3 tracking-wider select-all neon-text-cyan">
                  {result.sourceIpa}
                </div>

                {result.simplifiedRespell && (
                  <div className="text-xs font-mono text-slate-300 flex items-center gap-2 pt-2 border-t border-cyan-500/20">
                    <span className="font-bold text-yellow-400 uppercase">RESPELLING SIMPLIFICADO:</span>
                    <span className="font-bold text-yellow-300 bg-yellow-950/50 px-2.5 py-0.5 rounded border border-yellow-500/40 shadow-[0_0_8px_rgba(255,230,0,0.3)]">
                      {result.simplifiedRespell}
                    </span>
                  </div>
                )}

                {result.syllableBreakdown && (
                  <div className="text-xs font-mono text-slate-300 flex items-center gap-2 mt-2">
                    <span className="font-bold text-cyan-400 uppercase">DIVISÃO SILÁBICA:</span>
                    <span className="font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                      {result.syllableBreakdown}
                    </span>
                  </div>
                )}
              </div>

              {/* Translation Card (Cyber Matrix) */}
              <div className="bg-black/70 rounded-xl p-4 border border-pink-500/40 flex items-start justify-between gap-3 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase text-pink-400 mb-1 flex items-center gap-1.5">
                    <span>// TRADUÇÃO DECODIFICADA:</span>
                  </div>
                  <div className="text-base text-slate-100 font-sans font-bold leading-relaxed">
                    {result.translatedText}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(result.translatedText, 'trans')}
                  className="p-1.5 text-slate-400 hover:text-pink-300 hover:bg-pink-950/40 rounded transition-colors"
                  title="Copiar Tradução"
                >
                  {copiedTrans ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Word-by-word Interactive Tokens Matrix */}
              {result.words && result.words.length > 0 && (
                <div className="space-y-2 font-mono">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" /> MATRIZ DE DECOMPOSIÇÃO POR TOKEN
                    </h3>
                    <span className="text-[10px] text-slate-400">CLIQUE PARA OUVIR FONEMA ISOLADO</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {result.words.map((token, idx) => (
                      <div
                        key={idx}
                        onClick={() => handlePlayWord(token, idx)}
                        className={`group bg-black/80 hover:bg-cyan-950/30 p-3 rounded-xl border transition-all cursor-pointer text-left relative ${
                          activeWordIndex === idx
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                            : 'border-slate-800 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {token.original}
                          </span>
                          <span className="text-slate-500 group-hover:text-cyan-300 transition-colors">
                            <Volume2 className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        <div className="text-xs text-cyan-300 font-bold mt-1 neon-text-cyan">
                          {token.ipa}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1 truncate">
                          ➔ {token.translation || '-'}
                        </div>

                        {token.notes && (
                          <div className="text-[10px] text-yellow-300 mt-1.5 bg-yellow-950/40 px-1.5 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 shrink-0 text-yellow-400" />
                            <span className="truncate">{token.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pronunciation & Linguistics Rules */}
              {result.pronunciationNotes && result.pronunciationNotes.length > 0 && (
                <div className="bg-black/60 rounded-xl p-4 border border-yellow-500/30 space-y-2 font-mono">
                  <div className="text-xs font-bold text-yellow-400 flex items-center gap-1.5 uppercase">
                    <ShieldAlert className="w-4 h-4 text-yellow-400" /> DIRETRIZES ACÚSTICAS & REGRAS FONÉTICAS:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.pronunciationNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-pink-400 font-black">»</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action: Jump to Chrome Simulator */}
              <div className="flex items-center justify-between pt-2 font-mono">
                <button
                  onClick={() => onOpenSimulatorWithText(result.sourceText)}
                  className="text-xs text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <span>TESTAR NO SIMULADOR DO PLUGIN HUD</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#090e1a] border-2 border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3 font-mono">
              <Cpu className="w-10 h-10 mx-auto text-cyan-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-400 uppercase">
                INSIRA O TEXTO NO TERMINAL PARA DECODIFICAR OS FONEMAS IPA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
