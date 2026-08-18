import React, { useState } from 'react';
import { Volume2, RotateCcw, CheckCircle, XCircle, Sparkles, Layers, ArrowRight, ArrowLeft, Cpu, Zap, Activity } from 'lucide-react';
import { PhoneticResult } from '../types';
import { playSpeech } from '../utils/speech';

interface FlashcardTrainerProps {
  savedCards: PhoneticResult[];
  onRemoveCard?: (id: string) => void;
}

const DEFAULT_PRACTICE_ITEMS = [
  { word: 'phonetic', ipa: '/fəˈnɛtɪk/', respell: 'fuh-NET-ik', trans: 'fonético', note: 'Acento na 2ª sílaba. O primeiro "o" vira schwa /ə/.' },
  { word: 'schedule', ipa: '/ˈskɛdʒuːl/', respell: 'SKED-jool', trans: 'horário / cronograma', note: 'No inglês britânico é /ˈʃɛdjuːl/ (com som de "sh").' },
  { word: 'comfortable', ipa: '/ˈkʌmftəbəl/', respell: 'KUMF-tuh-bul', trans: 'confortável', note: 'O "or" é engolido na pronúncia rápida nativa.' },
  { word: 'through', ipa: '/θruː/', respell: 'THROO', trans: 'através de', note: 'Som inicial "th" com a ponta da língua entre os dentes sem vibrar.' },
  { word: 'thought', ipa: '/θɔːt/', respell: 'THAWT', trans: 'pensamento / pensou', note: 'O "gh" é totalmente mudo.' },
  { word: 'pronunciation', ipa: '/prəˌnʌnsiˈeɪʃən/', respell: 'pruh-nun-see-AY-shun', trans: 'pronúncia', note: 'Atenção: escreve-se "nun", não "noun"!' },
  { word: 'knowledge', ipa: '/ˈnɒlɪdʒ/', respell: 'NOL-ij', trans: 'conhecimento', note: 'O "k" inicial é silencioso.' },
  { word: 'algorithm', ipa: '/ˈælɡərɪðəm/', respell: 'AL-guh-rith-um', trans: 'algoritmo', note: 'O "th" final é suave com /ð/ sonoro.' }
];

export const FlashcardTrainer: React.FC<FlashcardTrainerProps> = ({ savedCards }) => {
  const allCards = [
    ...DEFAULT_PRACTICE_ITEMS.map((item, idx) => ({
      id: `default_${idx}`,
      word: item.word,
      ipa: item.ipa,
      respell: item.respell,
      trans: item.trans,
      note: item.note
    })),
    ...savedCards.map(c => ({
      id: c.id,
      word: c.sourceText,
      ipa: c.sourceIpa,
      respell: c.simplifiedRespell || '',
      trans: c.translatedText,
      note: c.pronunciationNotes?.[0] || 'Transcrição salva no Estúdio'
    }))
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 });

  const currentCard = allCards[currentIndex] || allCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % allCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
  };

  const handleMarkCorrect = () => {
    setScore(s => ({ ...s, correct: s.correct + 1 }));
    handleNext();
  };

  const handleMarkIncorrect = () => {
    setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
    handleNext();
  };

  const handlePlayAudio = (e: React.MouseEvent, speed = 0.85) => {
    e.stopPropagation();
    playSpeech(currentCard.word, 'en-US', speed);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono">
      {/* Cyberpunk Header */}
      <div className="bg-[#070b14] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-pink-950/80 text-pink-300 border border-pink-500/40 shadow-[0_0_8px_rgba(255,0,127,0.3)]">
              NEURAL MEMORY RIG // FLASHCARDS
            </span>
            <span className="text-xs text-slate-400 font-bold">TOTAL: {allCards.length} UNIDADES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">TREINO & RIG FONÉTICO</h2>
          <p className="text-xs text-slate-300 mt-1">
            Memorize padrões de IPA e domine a fonética de vocábulos complexos.
          </p>
        </div>

        {/* Cyber Score tracker */}
        <div className="flex items-center gap-3 bg-black px-4 py-2.5 rounded-xl border border-cyan-500/30 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>ACERTOS: {score.correct}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-xs text-pink-400 font-bold">
            <XCircle className="w-4 h-4" />
            <span>REVISAR: {score.incorrect}</span>
          </div>
        </div>
      </div>

      {/* Main Cyber Flashcard */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full max-w-lg min-h-[340px] rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer transition-all duration-300 transform select-none relative flex flex-col justify-between ${
            isFlipped
              ? 'bg-gradient-to-br from-black via-[#0a1120] to-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.3)]'
              : 'bg-[#080d16] border-2 border-pink-500/40 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(255,0,127,0.3)]'
          }`}
        >
          {/* Card Top Row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              CARD {currentIndex + 1} DE {allCards.length}
            </span>
            <button
              onClick={(e) => handlePlayAudio(e, 0.85)}
              className="p-2 rounded-xl bg-black hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/40 transition-all shadow-[0_0_8px_rgba(0,240,255,0.3)]"
              title="Ouvir áudio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Card Center Content */}
          <div className="text-center py-6 space-y-3">
            {!isFlipped ? (
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">// DESAFIO DE PRONÚNCIA:</span>
                <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wide mt-3">
                  {currentCard.word}
                </h3>
                <p className="text-xs text-pink-400 font-bold mt-4 animate-pulse">
                  [CLIQUE PARA VIRAR E DECODIFICAR O IPA]
                </p>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] font-black uppercase text-cyan-400">// IPA DECODIFICADO:</span>
                <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-wide select-all neon-text-cyan my-2">
                  {currentCard.ipa}
                </div>
                {currentCard.respell && (
                  <div className="text-xs text-yellow-400 font-bold">
                    RESPELLING: {currentCard.respell}
                  </div>
                )}
                <div className="text-sm text-slate-200 font-bold pt-2">
                  TRADUÇÃO: <strong className="text-pink-400">{currentCard.trans}</strong>
                </div>
                {currentCard.note && (
                  <div className="text-xs text-slate-300 bg-black/90 p-2.5 rounded-xl border border-cyan-500/30 mt-2 font-sans">
                    💡 {currentCard.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1 text-slate-400">
              <RotateCcw className="w-3 h-3 text-cyan-400" /> Clique para alternar face
            </span>
            <button
              onClick={(e) => handlePlayAudio(e, 0.6)}
              className="text-[11px] text-pink-400 hover:underline font-bold flex items-center gap-1"
            >
              🐢 ÁUDIO 0.6x SLOW
            </button>
          </div>
        </div>

        {/* Navigation and Feedback Buttons */}
        <div className="flex items-center justify-between w-full max-w-lg mt-6 gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ANTERIOR</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkIncorrect}
              className="flex items-center gap-1 px-4 py-2.5 bg-pink-950/80 hover:bg-pink-600 text-pink-200 border border-pink-500 rounded-xl text-xs font-black transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,127,0.3)]"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>REVISAR</span>
            </button>

            <button
              onClick={handleMarkCorrect}
              className="flex items-center gap-1 px-4 py-2.5 bg-cyan-950/80 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-400 rounded-xl text-xs font-black transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.4)]"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>ACERTEI!</span>
            </button>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all border border-slate-700 cursor-pointer"
          >
            <span>PRÓXIMO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
