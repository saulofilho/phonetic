import React, { useState } from 'react';
import { Volume2, Search, Sparkles, Filter, Radio, Cpu, Activity } from 'lucide-react';
import { IPA_SYMBOLS, IpaSymbol } from '../data/ipaData';
import { playSpeech } from '../utils/speech';

export const IpaChartModal: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'vowel' | 'diphthong' | 'consonant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSymbol, setActiveSymbol] = useState<IpaSymbol | null>(IPA_SYMBOLS[0]);

  const filteredSymbols = IPA_SYMBOLS.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.exampleWord.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.descriptionPt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePlaySound = (item: IpaSymbol) => {
    setActiveSymbol(item);
    playSpeech(item.exampleWord, 'en-US', 0.85);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono">
      {/* Cyberpunk Header */}
      <div className="bg-[#070b14] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              IPA FREQUENCY MATRIX // SPECTRUM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">MATRIZ DO ALFABETO FONÉTICO (IPA)</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Clique em qualquer fonema para sintetizar o som e analisar o posicionamento acústico do trato vocal.
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar fonema..."
              className="w-full bg-black border border-cyan-500/40 text-cyan-200 text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            />
          </div>

          <div className="flex bg-black p-1 rounded-xl border border-cyan-500/30 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              TODOS ({IPA_SYMBOLS.length})
            </button>
            <button
              onClick={() => setFilterType('vowel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'vowel' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              VOGAIS
            </button>
            <button
              onClick={() => setFilterType('diphthong')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'diphthong' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              DITONGOS
            </button>
            <button
              onClick={() => setFilterType('consonant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'consonant' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              CONSOANTES
            </button>
          </div>
        </div>
      </div>

      {/* Grid of IPA symbols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredSymbols.map((item) => (
          <div
            key={item.symbol}
            onClick={() => handlePlaySound(item)}
            className={`group p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              activeSymbol?.symbol === item.symbol
                ? 'bg-gradient-to-br from-cyan-950/80 via-black to-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                : 'bg-[#080d16] hover:bg-[#0c1424] border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl font-black text-cyan-300 group-hover:text-cyan-200 transition-colors neon-text-cyan">
                /{item.symbol}/
              </span>
              <button
                type="button"
                className="p-1 rounded-md text-slate-500 group-hover:text-cyan-300 hover:bg-cyan-950/60 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2 space-y-1">
              <div className="text-xs font-bold text-white group-hover:text-cyan-200 truncate">
                {item.exampleWord}
              </div>
              <div className="text-[11px] text-cyan-400 font-bold">
                {item.exampleIpa}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {item.exampleTranslation}
              </div>
            </div>

            <div className="text-[9px] font-bold uppercase tracking-wider text-pink-400 mt-2 pt-2 border-t border-slate-800 truncate">
              {item.category}
            </div>
          </div>
        ))}
      </div>

      {/* Active Symbol Deep Dive Inspector */}
      {activeSymbol && (
        <div className="bg-[#080d16] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-black border-2 border-cyan-400 flex items-center justify-center text-3xl font-black text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] neon-text-cyan">
              /{activeSymbol.symbol}/
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/40">
                {activeSymbol.category}
              </span>
              <h3 className="text-lg font-black text-white mt-1">{activeSymbol.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span>EXEMPLO: <strong className="text-cyan-300">{activeSymbol.exampleWord}</strong> ({activeSymbol.exampleIpa})</span>
                <span className="text-pink-400">➔ {activeSymbol.exampleTranslation}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md bg-black p-4 rounded-xl border border-cyan-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400">// ARTICULAÇÃO & DICA ACÚSTICA:</span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {activeSymbol.descriptionPt}
            </p>
          </div>

          <div>
            <button
              onClick={() => handlePlaySound(activeSymbol)}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black px-4 py-3 rounded-xl text-xs shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all cursor-pointer uppercase"
            >
              <Volume2 className="w-4 h-4" />
              <span>OUVIR "{activeSymbol.exampleWord}"</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
