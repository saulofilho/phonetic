import React from 'react';
import { Download, Sparkles, Monitor, Code, BookOpen, Layers, Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { downloadExtensionZip } from '../utils/extensionCodeGenerator';

interface NavbarProps {
  activeTab: 'studio' | 'simulator' | 'code' | 'ipa-chart' | 'practice';
  setActiveTab: (tab: 'studio' | 'simulator' | 'code' | 'ipa-chart' | 'practice') => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadExtensionZip();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05070f]/95 backdrop-blur-md border-b border-cyan-500/30 text-slate-100 shadow-[0_4px_25px_rgba(0,240,255,0.15)]">
      {/* Cyber Top Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => setActiveTab('studio')}
        >
          <div className="relative w-10 h-10 rounded-lg bg-black border border-cyan-400/80 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:border-pink-500 group-hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all">
            <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-400 tracking-wider">
                PHONETIC//CYBER
              </span>
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                V3.0 MATRIX
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400/70">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                NEURAL IPA DECODER
              </span>
              <span>•</span>
              <span className="text-pink-400/80">CHROME PLUGIN</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Cyberpunk HUD Style) */}
        <nav className="hidden md:flex items-center space-x-1.5 bg-[#090d18] p-1 rounded-xl border border-cyan-500/20 shadow-inner">
          <button
            id="nav-studio-btn"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>ESTÚDIO.NEURAL</span>
          </button>

          <button
            id="nav-simulator-btn"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>HUD.SIMULADOR</span>
          </button>

          <button
            id="nav-code-btn"
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-pink-400" />
            <span>CÓDIGO.V3</span>
          </button>

          <button
            id="nav-ipa-btn"
            onClick={() => setActiveTab('ipa-chart')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ipa-chart'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
            <span>TABELA.IPA</span>
          </button>

          <button
            id="nav-practice-btn"
            onClick={() => setActiveTab('practice')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/30 text-pink-300 border border-pink-500 shadow-[0_0_12px_rgba(255,0,127,0.4)]'
                : 'text-slate-400 hover:text-pink-300 hover:bg-pink-950/30 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>TREINO.RIG</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] font-mono bg-pink-600 text-white rounded shadow-[0_0_8px_rgba(255,0,127,0.8)]">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Cyberpunk Neon Download CTA */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400/90 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SYS: READY</span>
          </div>

          <button
            id="btn-download-extension-zip"
            onClick={handleDownload}
            disabled={isDownloading}
            className="relative group overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-mono px-4 py-2 rounded-lg text-xs font-black shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-cyan-300/60 transition-all hover:scale-105 active:scale-95 disabled:opacity-75 cursor-pointer flex items-center space-x-2"
          >
            <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-yellow-300' : 'text-cyan-200'}`} />
            <span className="tracking-wider uppercase">
              {isDownloading ? 'GERANDO MATRIX...' : 'DOWNLOAD EXTENSÃO (.ZIP)'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden px-3 py-2 bg-[#090d16] border-t border-cyan-500/20 gap-1.5 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('studio')}
          className={`px-3 py-1 rounded text-xs whitespace-nowrap font-bold ${
            activeTab === 'studio' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400'
          }`}
        >
          ESTÚDIO
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1 rounded text-xs whitespace-nowrap font-bold ${
            activeTab === 'simulator' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400'
          }`}
        >
          HUD SIMULADOR
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1 rounded text-xs whitespace-nowrap font-bold ${
            activeTab === 'code' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400'
          }`}
        >
          CÓDIGO .ZIP
        </button>
        <button
          onClick={() => setActiveTab('ipa-chart')}
          className={`px-3 py-1 rounded text-xs whitespace-nowrap font-bold ${
            activeTab === 'ipa-chart' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400'
          }`}
        >
          TABELA IPA
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-3 py-1 rounded text-xs whitespace-nowrap font-bold ${
            activeTab === 'practice' ? 'bg-pink-600/30 text-pink-300 border border-pink-400' : 'text-slate-400'
          }`}
        >
          TREINO ({savedCount})
        </button>
      </div>
    </header>
  );
};
