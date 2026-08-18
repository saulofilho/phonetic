import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Folder, 
  Terminal, 
  Zap,
  Cpu,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { generateExtensionFiles, downloadExtensionZip } from '../utils/extensionCodeGenerator';
import { ExtensionFile } from '../types';

export const ExtensionExporter: React.FC = () => {
  const files = generateExtensionFiles();
  const [selectedFile, setSelectedFile] = useState<ExtensionFile>(files[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadExtensionZip();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono">
      {/* Cyberpunk Header & Download Card */}
      <div className="bg-[#070b14] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              MANIFEST V3 // EXPORT MATRIX
            </span>
            <span className="text-[10px] text-pink-400 font-bold">[CHROME / EDGE / BRAVE COMPATIBLE]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PACOTE DA EXTENSÃO PARA GOOGLE CHROME</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Código-fonte pronto para injeção imediata em <code className="bg-black text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono">chrome://extensions</code> ou publicação na Web Store.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="relative z-10 flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white px-6 py-4 rounded-xl font-black text-xs shadow-[0_0_20px_rgba(0,240,255,0.5)] border border-cyan-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 cursor-pointer uppercase tracking-wider"
        >
          <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-yellow-300' : 'text-cyan-200'}`} />
          <span>{isDownloading ? 'COMPACTANDO MATRIX...' : 'BAIXAR PLUGIN COMPLETO (.ZIP)'}</span>
        </button>
      </div>

      {/* Code Inspector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cyber File Tree */}
        <div className="lg:col-span-4 bg-[#080d16] border-2 border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" /> ARQUIVOS DO PLUGIN ({files.length})
            </span>
            <span className="text-[10px] text-pink-400/90 font-mono">/matrix-root/</span>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  selectedFile.path === file.path
                    ? 'bg-cyan-950/70 text-cyan-200 border-2 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-[#0b1220] border border-slate-800'
                }`}
              >
                <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${
                  selectedFile.path === file.path ? 'text-cyan-400' : 'text-slate-500'
                }`} />
                <div className="truncate flex-1">
                  <div className="font-mono text-xs font-bold text-slate-100 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{file.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Guide Card */}
          <div className="bg-black/90 border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-400 space-y-2 mt-4">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> DICA DE CARREGAMENTO:
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Descompacte o ZIP, abra <strong className="text-cyan-300 font-mono">chrome://extensions</strong>, ative o <strong>Modo do Desenvolvedor</strong> e clique em <strong>Carregar sem compactação</strong>.
            </p>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-black border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="bg-[#080d16] border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white">{selectedFile.path}</span>
              <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 text-xs bg-slate-900 hover:bg-cyan-950 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/40 transition-all font-bold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIADO!' : 'COPIAR CÓDIGO'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto font-mono text-xs text-cyan-100 leading-relaxed max-h-[500px] overflow-y-auto select-all">
            <pre className="text-slate-200">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Visual Step-by-Step Installation Protocol */}
      <div className="bg-[#080d16] border-2 border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-pink-400" />
          PROTOCOLO DE INSTALAÇÃO NO GOOGLE CHROME / EDGE / BRAVE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/90 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-black text-xs shadow-[0_0_8px_rgba(0,240,255,0.7)]">
              01
            </div>
            <h4 className="font-bold text-sm text-white">EXTRAIR ARQUIVO ZIP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clique em <strong>"BAIXAR PLUGIN COMPLETO (.ZIP)"</strong> e descompacte o arquivo numa pasta local.
            </p>
          </div>

          <div className="bg-black/90 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-black text-xs shadow-[0_0_8px_rgba(0,240,255,0.7)]">
              02
            </div>
            <h4 className="font-bold text-sm text-white">ACESSAR EXTENSÕES</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Acesse <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">chrome://extensions</code> e ative o <strong>Modo do Desenvolvedor</strong>.
            </p>
          </div>

          <div className="bg-black/90 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-black text-xs shadow-[0_0_8px_rgba(0,240,255,0.7)]">
              03
            </div>
            <h4 className="font-bold text-sm text-white">CARREGAR SEM COMPACTAÇÃO</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clique em <strong>"Carregar sem compactação"</strong> e selecione a pasta descompactada. O plugin estará 100% ativo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
