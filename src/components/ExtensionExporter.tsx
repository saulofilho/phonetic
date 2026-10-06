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
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState('saulosilvaf');
  const [githubRepo, setGithubRepo] = useState('phonetic');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPath = (pathText: string) => {
    navigator.clipboard.writeText(pathText);
    setCopiedPath(pathText);
    setTimeout(() => setCopiedPath(null), 2000);
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

      {/* Icon URL Paths & Assets Matrix */}
      <div className="bg-[#080d16] border-2 border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,1)]" />
              <h3 className="text-lg font-black text-white tracking-wide">
                ICONS & ASSETS URL PATH MATRIX
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rotas relativas e URLs absolutas para Chrome Extension, Manifest V3, Web App Manifest e GitHub Pages.
            </p>
          </div>
          <span className="text-[10px] text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/40 font-mono">
            CYBERPUNK NEON PACK (128 / 48 / 32 / 16 / SVG)
          </span>
        </div>

        {/* Dynamic GitHub URL Generator */}
        <div className="bg-black/90 p-4 rounded-xl border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-yellow-300" /> GERADOR DE URL ABSOLUTA (GITHUB PAGES & CDN)
            </span>
            <span className="text-[10px] text-slate-400">Insira seu usuário e repositório para gerar os links:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono uppercase">Usuário GitHub:</label>
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                placeholder="ex: saulosilvaf"
                className="w-full bg-[#050811] border border-cyan-500/40 rounded-lg px-3 py-1.5 text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono uppercase">Nome do Repositório:</label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="ex: phonetic"
                className="w-full bg-[#050811] border border-cyan-500/40 rounded-lg px-3 py-1.5 text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-300"
              />
            </div>
          </div>
        </div>

        {/* Icons Grid with Real Previews and Copy Feedback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Icon 128px */}
          <div className="bg-black/80 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col items-center text-center space-y-2.5 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <div className="w-16 h-16 rounded-2xl bg-[#05070f] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)] relative overflow-hidden">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 font-mono">/ə/</span>
              <span className="absolute bottom-1 right-1 text-[8px] text-pink-400 font-bold">128</span>
            </div>
            <div className="space-y-1 w-full">
              <div className="font-bold text-xs text-white">128x128 (Store & PWA)</div>
              <code className="block text-[10px] text-cyan-300 bg-slate-900/90 px-2 py-1 rounded border border-cyan-500/30 truncate">
                icons/icon128.png
              </code>
            </div>
            <button
              onClick={() => handleCopyPath('icons/icon128.png')}
              className={`w-full text-[11px] py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                copiedPath === 'icons/icon128.png'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {copiedPath === 'icons/icon128.png' ? '✓ COPIADO!' : 'COPIAR PATH'}
            </button>
          </div>

          {/* Icon 48px */}
          <div className="bg-black/80 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col items-center text-center space-y-2.5">
            <div className="w-14 h-14 rounded-xl bg-[#05070f] border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)] relative">
              <span className="text-xl font-black text-cyan-300 font-mono">/ə/</span>
              <span className="absolute bottom-1 right-1 text-[8px] text-pink-400 font-bold">48</span>
            </div>
            <div className="space-y-1 w-full">
              <div className="font-bold text-xs text-white">48x48 (Gerenciador)</div>
              <code className="block text-[10px] text-cyan-300 bg-slate-900/90 px-2 py-1 rounded border border-cyan-500/30 truncate">
                icons/icon48.png
              </code>
            </div>
            <button
              onClick={() => handleCopyPath('icons/icon48.png')}
              className={`w-full text-[11px] py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                copiedPath === 'icons/icon48.png'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {copiedPath === 'icons/icon48.png' ? '✓ COPIADO!' : 'COPIAR PATH'}
            </button>
          </div>

          {/* Icon 32px */}
          <div className="bg-black/80 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-lg bg-[#05070f] border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)] relative">
              <span className="text-base font-black text-cyan-300 font-mono">ə</span>
              <span className="absolute bottom-0.5 right-1 text-[8px] text-pink-400 font-bold">32</span>
            </div>
            <div className="space-y-1 w-full">
              <div className="font-bold text-xs text-white">32x32 (Windows / Tab)</div>
              <code className="block text-[10px] text-cyan-300 bg-slate-900/90 px-2 py-1 rounded border border-cyan-500/30 truncate">
                icons/icon32.png
              </code>
            </div>
            <button
              onClick={() => handleCopyPath('icons/icon32.png')}
              className={`w-full text-[11px] py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                copiedPath === 'icons/icon32.png'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {copiedPath === 'icons/icon32.png' ? '✓ COPIADO!' : 'COPIAR PATH'}
            </button>
          </div>

          {/* Icon 16px */}
          <div className="bg-black/80 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col items-center text-center space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#05070f] border border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.4)] relative">
              <span className="text-xs font-black text-cyan-300 font-mono">ə</span>
              <span className="absolute bottom-0.5 right-0.5 text-[7px] text-pink-400 font-bold">16</span>
            </div>
            <div className="space-y-1 w-full">
              <div className="font-bold text-xs text-white">16x16 (Barra / Favicon)</div>
              <code className="block text-[10px] text-cyan-300 bg-slate-900/90 px-2 py-1 rounded border border-cyan-500/30 truncate">
                icons/icon16.png
              </code>
            </div>
            <button
              onClick={() => handleCopyPath('icons/icon16.png')}
              className={`w-full text-[11px] py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                copiedPath === 'icons/icon16.png'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {copiedPath === 'icons/icon16.png' ? '✓ COPIADO!' : 'COPIAR PATH'}
            </button>
          </div>

          {/* Vector SVG */}
          <div className="bg-black/80 border border-pink-500/40 rounded-xl p-3.5 flex flex-col items-center text-center space-y-2.5 shadow-[0_0_15px_rgba(255,0,127,0.1)]">
            <div className="w-12 h-12 rounded-xl bg-[#05070f] border-2 border-pink-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.4)] relative">
              <span className="text-lg">⚡</span>
              <span className="absolute bottom-0.5 right-1 text-[7px] text-cyan-300 font-bold">SVG</span>
            </div>
            <div className="space-y-1 w-full">
              <div className="font-bold text-xs text-pink-300">SVG Vetorial HUD</div>
              <code className="block text-[10px] text-pink-300 bg-slate-900/90 px-2 py-1 rounded border border-pink-500/30 truncate">
                public/favicon.svg
              </code>
            </div>
            <button
              onClick={() => handleCopyPath('./favicon.svg')}
              className={`w-full text-[11px] py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                copiedPath === './favicon.svg'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-pink-950/80 hover:bg-pink-900 text-pink-300 border-pink-500/40'
              }`}
            >
              {copiedPath === './favicon.svg' ? '✓ COPIADO!' : 'COPIAR PATH'}
            </button>
          </div>
        </div>

        {/* Computed Live Hosted URLs */}
        <div className="bg-black/80 p-4 rounded-xl border border-cyan-500/30 text-xs space-y-3 font-mono">
          <div className="text-cyan-300 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            ROTAS &amp; URLS COMPUTADAS PARA O REPOSITÓRIO:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            {/* GitHub Pages URL */}
            <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] font-bold">1. GitHub Pages Hosted Icon URL:</span>
                <button
                  onClick={() => handleCopyPath(`https://${githubUser}.github.io/${githubRepo}/icons/icon128.png`)}
                  className="text-[10px] text-cyan-400 hover:underline uppercase font-bold"
                >
                  {copiedPath === `https://${githubUser}.github.io/${githubRepo}/icons/icon128.png` ? '✓ Copiado' : 'Copiar URL'}
                </button>
              </div>
              <div className="text-cyan-300 truncate bg-black p-1.5 rounded border border-cyan-500/20 select-all">
                {`https://${githubUser}.github.io/${githubRepo}/icons/icon128.png`}
              </div>
            </div>

            {/* GitHub Raw URL */}
            <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] font-bold">2. GitHub Raw CDN Icon URL:</span>
                <button
                  onClick={() => handleCopyPath(`https://raw.githubusercontent.com/${githubUser}/${githubRepo}/main/public/icons/icon128.png`)}
                  className="text-[10px] text-pink-400 hover:underline uppercase font-bold"
                >
                  {copiedPath === `https://raw.githubusercontent.com/${githubUser}/${githubRepo}/main/public/icons/icon128.png` ? '✓ Copiado' : 'Copiar URL'}
                </button>
              </div>
              <div className="text-pink-300 truncate bg-black p-1.5 rounded border border-pink-500/20 select-all">
                {`https://raw.githubusercontent.com/${githubUser}/${githubRepo}/main/public/icons/icon128.png`}
              </div>
            </div>

            {/* Manifest Relative Path */}
            <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] font-bold">3. Chrome Manifest V3 Path (Local):</span>
                <button
                  onClick={() => handleCopyPath('icons/icon128.png')}
                  className="text-[10px] text-emerald-400 hover:underline uppercase font-bold"
                >
                  {copiedPath === 'icons/icon128.png' ? '✓ Copiado' : 'Copiar Path'}
                </button>
              </div>
              <div className="text-emerald-300 truncate bg-black p-1.5 rounded border border-emerald-500/20 select-all">
                icons/icon128.png
              </div>
            </div>

            {/* Web App Favicon Path */}
            <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] font-bold">4. Favicon Universal (SVG):</span>
                <button
                  onClick={() => handleCopyPath('./favicon.svg')}
                  className="text-[10px] text-yellow-400 hover:underline uppercase font-bold"
                >
                  {copiedPath === './favicon.svg' ? '✓ Copiado' : 'Copiar Path'}
                </button>
              </div>
              <div className="text-yellow-300 truncate bg-black p-1.5 rounded border border-yellow-500/20 select-all">
                ./favicon.svg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Pages Version & CI/CD Deployment Section */}
      <div className="bg-[#080d16] border-2 border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
            <h3 className="text-lg font-black text-white tracking-wide">
              VERSÃO GITHUB PAGES // DEPLOY ESTÁTICO
            </h3>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/40 font-mono">
            AUTOMATED WORKFLOW READY
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Esta aplicação foi estruturada com suporte nativo para ser hospedada gratuitamente no <strong>GitHub Pages</strong> (<code className="text-emerald-300">https://seu-usuario.github.io/seu-repositorio/</code>). O motor fonético híbrido e a síntese de voz (Web Speech API) funcionam 100% no navegador sem necessidade de backend!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/90 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> 1. DEPLOY AUTOMÁTICO (GITHUB ACTIONS)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              O arquivo de workflow <code className="text-cyan-300 font-mono">.github/workflows/deploy-pages.yml</code> já está configurado. Ao dar <code className="text-cyan-300 font-mono">git push</code> na branch <code className="text-cyan-300 font-mono">main</code>, o GitHub compila e publica seu site automaticamente!
            </p>
            <div className="text-[10px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
              Ative em: <strong>Settings &gt; Pages &gt; Source: GitHub Actions</strong>
            </div>
          </div>

          <div className="bg-black/90 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> 2. COMANDO DE BUILD LOCAL
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Para gerar os arquivos estáticos otimizados para qualquer subdiretório do GitHub Pages:
            </p>
            <div className="bg-slate-950 p-2.5 rounded border border-cyan-500/40 text-cyan-300 font-mono text-[11px] flex items-center justify-between">
              <code>npm run build:gh-pages</code>
              <button
                onClick={() => handleCopyPath('npm run build:gh-pages')}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 ml-2 uppercase font-bold cursor-pointer"
              >
                {copiedPath === 'npm run build:gh-pages' ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
