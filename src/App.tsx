/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PhoneticStudio } from './components/PhoneticStudio';
import { ChromeSimulator } from './components/ChromeSimulator';
import { ExtensionExporter } from './components/ExtensionExporter';
import { IpaChartModal } from './components/IpaChartModal';
import { FlashcardTrainer } from './components/FlashcardTrainer';
import { PhoneticResult } from './types';
import { downloadExtensionZip } from './utils/extensionCodeGenerator';
import { Download, Cpu, Radio, Shield, Terminal, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'simulator' | 'code' | 'ipa-chart' | 'practice'>('studio');
  const [savedCards, setSavedCards] = useState<PhoneticResult[]>(() => {
    try {
      const stored = localStorage.getItem('pt_saved_cards');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [simText, setSimText] = useState<string>('phonetic transcription');

  useEffect(() => {
    try {
      localStorage.setItem('pt_saved_cards', JSON.stringify(savedCards));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [savedCards]);

  const handleSaveToPractice = (item: PhoneticResult) => {
    setSavedCards(prev => {
      if (prev.some(c => c.sourceText.toLowerCase() === item.sourceText.toLowerCase())) {
        return prev;
      }
      return [item, ...prev];
    });
  };

  const handleOpenSimulatorWithText = (text: string) => {
    setSimText(text);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black cyber-grid-bg relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedCards.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'studio' && (
          <PhoneticStudio
            onSaveToPractice={handleSaveToPractice}
            onOpenSimulatorWithText={handleOpenSimulatorWithText}
          />
        )}

        {activeTab === 'simulator' && (
          <ChromeSimulator initialSelectionText={simText} />
        )}

        {activeTab === 'code' && (
          <ExtensionExporter />
        )}

        {activeTab === 'ipa-chart' && (
          <IpaChartModal />
        )}

        {activeTab === 'practice' && (
          <FlashcardTrainer savedCards={savedCards} />
        )}
      </main>

      {/* Bottom Sticky Utility Bar on Studio (Cyber HUD style) */}
      {activeTab === 'studio' && (
        <div className="bg-[#050811]/95 backdrop-blur-md border-t border-cyan-500/30 py-3 px-4 sticky bottom-0 z-30 font-mono shadow-[0_-5px_20px_rgba(0,240,255,0.1)]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block shadow-[0_0_8px_rgba(0,240,255,1)]" />
              <span className="text-cyan-300 font-bold">MANIFEST V3 PACKET:</span>
              <span className="text-slate-400">PRONTO PARA INJEÇÃO NO CHROME // EDGE // BRAVE</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('simulator')}
                className="text-slate-300 hover:text-cyan-300 hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <span>[HUD SIMULADOR]</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className="text-slate-300 hover:text-pink-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <span>[CÓDIGO .ZIP]</span>
              </button>
              <button
                onClick={() => downloadExtensionZip()}
                className="bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-yellow-300" />
                <span>DOWNLOAD .ZIP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Footer (Cyberpunk Telemetry) */}
      <footer className="border-t border-cyan-500/20 bg-[#05070f] py-6 text-slate-500 text-xs mt-auto font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-black text-cyan-400">PHONETIC//CYBER V3</span>
            <span>•</span>
            <span className="text-slate-400">NEURAL IPA TRANSLATION MATRIX</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('ipa-chart')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              TABELA IPA
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              CÓDIGO FONTE
            </button>
            <button
              onClick={() => downloadExtensionZip()}
              className="text-pink-400 hover:text-pink-300 font-bold cursor-pointer"
            >
              DOWNLOAD ZIP
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
