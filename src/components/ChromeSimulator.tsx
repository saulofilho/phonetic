import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  Copy, 
  Check, 
  RotateCw, 
  ShieldCheck, 
  Globe, 
  Sparkles,
  Info,
  Type,
  Cpu,
  Radio,
  Terminal
} from 'lucide-react';
import { playSpeech } from '../utils/speech';

interface ChromeSimulatorProps {
  initialSelectionText?: string;
}

const SAMPLE_ARTICLES = [
  {
    id: 'phonetics-wiki',
    title: 'Phonetics and Acoustic Cyber-Linguistics // Net-Matrix',
    url: 'https://matrix.net/linguistics/phonetics-core',
    content: `Phonetics is the computational science of acoustic frequencies produced by human vocal tracts and synthetic neural generators. In advanced speech systems, phonetic transcription decodes raw audio waves into unambiguous International Phonetic Alphabet symbols.

English learners and cyber-linguists encounter high phonological variance because orthography diverges drastically from phonemic sound waves. For instance, words like "through", "rough", "thought", and "algorithm" exhibit disparate vowel resonance frequencies despite identical morphological roots.

By utilizing neural phonetic transcription, users isolate primary syllable stress, silent consonants, and reduced vowels such as the fundamental schwa /ə/ with absolute clarity.`
  },
  {
    id: 'technology-news',
    title: 'Neural Speech Synthesis & Browser Extension HUD',
    url: 'https://cyberpulse.io/neural-speech-transcription',
    content: `Modern neural voice engines employ acoustic spectrogram analysis and real-time phonetic alignment to render authentic speech synthesis in under 10 milliseconds.

The integration of browser extensions that instantly annotate web pages with phonetic rubies empowers users to read, listen, and master complex multilingual terminology across any digital interface.`
  }
];

export const ChromeSimulator: React.FC<ChromeSimulatorProps> = ({ initialSelectionText }) => {
  const [selectedArticleId, setSelectedArticleId] = useState('phonetics-wiki');
  const [url, setUrl] = useState('https://matrix.net/linguistics/phonetics-core');
  const [customText, setCustomText] = useState('');
  const [isEditingContent, setIsEditingContent] = useState(false);
  
  // Extension interactive states
  const [showPopupOverlay, setShowPopupOverlay] = useState(false);
  const [enableRubyMode, setEnableRubyMode] = useState(false);
  const [popupInput, setPopupInput] = useState('pronunciation');
  const [popupIpa, setPopupIpa] = useState('/prəˌnʌnsiˈeɪʃən/');
  const [popupTrans, setPopupTrans] = useState('pronúncia');
  
  // Floating tooltip on selection state
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    text: string;
    ipa: string;
    respell: string;
    trans: string;
    syllables: string;
    x: number;
    y: number;
  } | null>(null);

  const [copiedTooltip, setCopiedTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeArticle = SAMPLE_ARTICLES.find(a => a.id === selectedArticleId) || SAMPLE_ARTICLES[0];
  const articleContent = customText || activeArticle.content;

  const dictionary: Record<string, { ipa: string; respell: string; trans: string; syl: string }> = {
    'phonetics': { ipa: '/fəˈnɛtɪks/', respell: 'fuh-NET-iks', trans: 'fonética', syl: 'pho · net · ics' },
    'phonetic': { ipa: '/fəˈnɛtɪk/', respell: 'fuh-NET-ik', trans: 'fonético', syl: 'pho · net · ic' },
    'transcription': { ipa: '/trænˈskrɪpʃən/', respell: 'tran-SKRIP-shun', trans: 'transcrição', syl: 'tran · scrip · tion' },
    'pronunciation': { ipa: '/prəˌnʌnsiˈeɪʃən/', respell: 'pruh-nun-see-AY-shun', trans: 'pronúncia', syl: 'pro · nun · ci · a · tion' },
    'linguistics': { ipa: '/lɪŋˈɡwɪstɪks/', respell: 'ling-GWIS-tiks', trans: 'linguística', syl: 'lin · guis · tics' },
    'international': { ipa: '/ˌɪntərˈnæʃənəl/', respell: 'in-ter-NASH-uh-nul', trans: 'internacional', syl: 'in · ter · na · tion · al' },
    'alphabet': { ipa: '/ˈælfəbɛt/', respell: 'AL-fuh-bet', trans: 'alfabeto', syl: 'al · pha · bet' },
    'through': { ipa: '/θruː/', respell: 'THROO', trans: 'através de', syl: 'through' },
    'thought': { ipa: '/θɔːt/', respell: 'THAWT', trans: 'pensamento', syl: 'thought' },
    'rough': { ipa: '/rʌf/', respell: 'RUF', trans: 'áspero / duro', syl: 'rough' },
    'algorithm': { ipa: '/ˈælɡərɪðəm/', respell: 'AL-guh-rith-um', trans: 'algoritmo', syl: 'al · go · rith · m' },
    'schwa': { ipa: '/ʃwɑː/', respell: 'SHWAH', trans: 'vogal schwa [ə]', syl: 'schwa' },
    'syllable': { ipa: '/ˈsɪləbəl/', respell: 'SIL-uh-bul', trans: 'sílaba', syl: 'syl · la · ble' },
    'stress': { ipa: '/strɛs/', respell: 'STRES', trans: 'acento tônico', syl: 'stress' },
    'neural': { ipa: '/ˈnjʊərəl/', respell: 'NYOOR-ul', trans: 'neural', syl: 'neu · ral' },
    'frequencies': { ipa: '/ˈfriːkwənsiz/', respell: 'FREE-kwun-seez', trans: 'frequências', syl: 'fre · quen · cies' },
    'language': { ipa: '/ˈlæŋɡwɪdʒ/', respell: 'LANG-gwij', trans: 'idioma', syl: 'lan · guage' },
    'synthesis': { ipa: '/ˈsɪnθəsɪs/', respell: 'SIN-thuh-sis', trans: 'síntese', syl: 'syn · the · sis' },
    'cyber': { ipa: '/ˈsaɪbər/', respell: 'SY-ber', trans: 'cibernético', syl: 'cy · ber' }
  };

  const getWordIpa = (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    if (dictionary[clean]) return dictionary[clean].ipa;
    return '/' + clean.replace(/tion/g, 'ʃən').replace(/ph/g, 'f').replace(/th/g, 'θ') + '/';
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (text.length > 0 && text.length < 150) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

      const cleanLower = text.toLowerCase().replace(/[^a-z\s]/g, '');
      const match = dictionary[cleanLower];

      const ipa = match ? match.ipa : getWordIpa(cleanLower);
      const respell = match ? match.respell : cleanLower.toUpperCase();
      const trans = match ? match.trans : `Tradução: ${text}`;
      const syllables = match ? match.syl : text.split(' ').map(w => w.length > 4 ? w.slice(0, 3) + ' · ' + w.slice(3) : w).join(' ');

      const x = Math.max(20, Math.min(rect.left - containerRect.left, (containerRect.width || 600) - 340));
      const y = rect.bottom - containerRect.top + 8;

      setTooltipData({
        visible: true,
        text,
        ipa,
        respell,
        trans,
        syllables,
        x,
        y
      });
    }
  };

  const handlePlayAudio = (text: string, speed = 0.9) => {
    playSpeech(text, 'en-US', speed);
  };

  const handleCopyIpa = (ipa: string) => {
    navigator.clipboard.writeText(ipa);
    setCopiedTooltip(true);
    setTimeout(() => setCopiedTooltip(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top Banner / Explanation */}
      <div className="bg-[#090e1a] border-2 border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              HUD SIMULATOR // ONLINE
            </span>
            <h2 className="text-xl font-black text-white">SIMULADOR DO PLUGIN NO CHROME</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Arraste o cursor sobre as palavras do artigo para ver o <strong className="text-cyan-300">Balão Holográfico Cyberpunk</strong> surgir em tempo real!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setEnableRubyMode(!enableRubyMode)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              enableRubyMode
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>FONÉTICA RUBY: {enableRubyMode ? '[ATIVO]' : '[OFF]'}</span>
          </button>

          <button
            onClick={() => setShowPopupOverlay(!showPopupOverlay)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-pink-950/80 hover:bg-pink-600 text-pink-200 border border-pink-500/40 shadow-[0_0_10px_rgba(255,0,127,0.3)] transition-all cursor-pointer"
          >
            <span>⚡ POPUP DO CHROME</span>
          </button>
        </div>
      </div>

      {/* Cyberpunk Chrome Browser Window Frame */}
      <div className="bg-black border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden font-mono">
        {/* Browser Top Bar with Window Controls & Tabs */}
        <div className="bg-[#080d16] border-b border-cyan-500/30 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5 mr-3">
              <span className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(255,0,127,0.8)] inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(255,230,0,0.8)] inline-block" />
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.8)] inline-block" />
            </div>

            {/* Browser Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto max-w-md">
              {SAMPLE_ARTICLES.map(art => (
                <button
                  key={art.id}
                  onClick={() => {
                    setSelectedArticleId(art.id);
                    setUrl(art.url);
                    setCustomText('');
                    setTooltipData(null);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-t-lg text-xs font-bold transition-all max-w-[200px] truncate ${
                    selectedArticleId === art.id && !customText
                      ? 'bg-black text-cyan-300 border-t-2 border-x border-cyan-400'
                      : 'text-slate-500 hover:text-cyan-300 hover:bg-cyan-950/20'
                  }`}
                >
                  <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{art.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Extension Action Button in Chrome Toolbar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPopupOverlay(!showPopupOverlay)}
              title="PhoneticTranslate Plugin Action Icon"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                showPopupOverlay
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.8)]'
                  : 'bg-black hover:bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
              }`}
            >
              <span>⚡</span>
              <span className="hidden sm:inline">PHONETIC_V3</span>
            </button>
          </div>
        </div>

        {/* Address Bar Navigation */}
        <div className="bg-[#050810] border-b border-cyan-500/20 px-4 py-2 flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 text-cyan-400">
            <button className="hover:text-white">‹</button>
            <button className="hover:text-white">›</button>
            <button onClick={() => setTooltipData(null)} className="hover:text-white" title="Recarregar">
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 bg-black border border-cyan-500/40 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-cyan-300 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs truncate">{url}</span>
          </div>

          <button
            onClick={() => setIsEditingContent(!isEditingContent)}
            className="text-xs text-pink-400 hover:text-pink-300 font-bold whitespace-nowrap"
          >
            {isEditingContent ? '[VISUALIZAR ARTIGO]' : '[EDITAR CONTEÚDO]'}
          </button>
        </div>

        {/* Browser Content Area (Live Page Simulation) */}
        <div 
          ref={containerRef}
          onMouseUp={handleTextSelection}
          className="relative min-h-[480px] bg-[#04060d] text-slate-200 p-8 select-text cyber-grid-bg"
        >
          {/* Simulated Webpage Article Body */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-cyan-500/20 pb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-500/30">
                CYBER ARTICLE FEED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono tracking-tight">
                {activeArticle.title}
              </h1>
              <p className="text-xs text-cyan-400/80 mt-1 font-mono">// Ambiente de teste com injeção de script ativa.</p>
            </div>

            {isEditingContent ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-cyan-300">INSIRA TEXTO CUSTOMIZADO:</label>
                <textarea
                  rows={8}
                  value={articleContent}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-black border border-cyan-500/50 rounded-xl p-3 text-sm text-cyan-100 font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => setIsEditingContent(false)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-4 py-2 rounded-xl text-xs uppercase shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                >
                  SALVAR E TESTAR
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-sm sm:text-base leading-relaxed font-sans text-slate-300">
                {articleContent.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-8">
                    {enableRubyMode ? (
                      paragraph.split(' ').map((word, wIdx) => {
                        const clean = word.replace(/[^a-zA-Z]/g, '');
                        const ipa = clean ? getWordIpa(clean) : '';
                        return (
                          <ruby key={wIdx} className="inline-block mr-2 px-1 rounded hover:bg-cyan-950/60 border-b border-cyan-500/20">
                            <span className="text-white font-semibold">{word}</span>
                            <rt className="text-[10px] text-cyan-400 font-mono font-black leading-none select-none neon-text-cyan">
                              {ipa}
                            </rt>
                          </ruby>
                        );
                      })
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </div>
            )}

            {/* Cyber Instruction Callout */}
            <div className="bg-black/90 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300 font-mono shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 uppercase">COMO TESTAR:</strong> Selecione com o mouse palavras como <span className="text-pink-400 underline font-bold cursor-pointer" onClick={() => handlePlayAudio('phonetic transcription')}>"phonetic transcription"</span>, <span className="text-pink-400 underline font-bold cursor-pointer" onClick={() => handlePlayAudio('algorithm')}>"algorithm"</span> ou <span className="text-pink-400 underline font-bold cursor-pointer" onClick={() => handlePlayAudio('schwa')}>"schwa"</span> para acionar a HUD flutuante.
              </div>
            </div>
          </div>

          {/* Floating Cyberpunk Chrome Extension Tooltip (Injected) */}
          {tooltipData && tooltipData.visible && (
            <div
              className="absolute z-30 bg-black/95 border-2 border-cyan-400 rounded-xl p-3.5 shadow-[0_0_25px_rgba(0,240,255,0.5)] w-80 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150 font-mono"
              style={{
                left: `${tooltipData.x}px`,
                top: `${tooltipData.y}px`
              }}
            >
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="bg-cyan-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-[0_0_6px_rgba(0,240,255,0.8)]">IPA</span>
                  <span className="font-bold text-white truncate max-w-[170px]">{tooltipData.text}</span>
                </div>
                <button
                  onClick={() => setTooltipData(null)}
                  className="text-slate-400 hover:text-pink-400 p-0.5 text-sm leading-none"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-[#080d16] border border-cyan-500/40 rounded-lg p-2">
                  <span className="font-mono text-sm font-black text-cyan-300 select-all neon-text-cyan">
                    {tooltipData.ipa}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePlayAudio(tooltipData.text)}
                      className="bg-cyan-500 text-black px-2 py-1 rounded text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                      title="Ouvir pronúncia"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>OUVIR</span>
                    </button>

                    <button
                      onClick={() => handleCopyIpa(tooltipData.ipa)}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-medium transition-all"
                      title="Copiar símbolos IPA"
                    >
                      {copiedTooltip ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-pink-400 uppercase">TRADUÇÃO: </span>
                  <span className="text-slate-200 font-semibold">{tooltipData.trans}</span>
                </div>

                <div className="text-[10px] text-slate-500">
                  <span className="font-bold text-slate-400 uppercase">DIVISÃO: </span>
                  <span className="font-mono text-cyan-300">{tooltipData.syllables}</span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Cyber Chrome Extension Popup */}
          {showPopupOverlay && (
            <div className="absolute top-3 right-4 z-40 w-80 bg-black/95 border-2 border-pink-500 rounded-2xl p-4 shadow-[0_0_30px_rgba(255,0,127,0.4)] text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 font-mono">
              <div className="flex items-center justify-between border-b border-pink-500/30 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">⚡</span>
                  <div>
                    <h3 className="font-black text-white text-xs">PHONETIC_TRANSLATE POPUP</h3>
                    <p className="text-[9px] text-pink-400/90">[MANIFEST V3 HUD]</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPopupOverlay(false)}
                  className="text-slate-400 hover:text-pink-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={popupInput}
                  onChange={(e) => {
                    setPopupInput(e.target.value);
                    const clean = e.target.value.toLowerCase().trim();
                    if (dictionary[clean]) {
                      setPopupIpa(dictionary[clean].ipa);
                      setPopupTrans(dictionary[clean].trans);
                    } else {
                      setPopupIpa(getWordIpa(clean));
                      setPopupTrans(`Tradução de "${e.target.value}"`);
                    }
                  }}
                  placeholder="Digite para decodificar..."
                  className="w-full bg-[#080d16] border border-pink-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />

                <div className="bg-[#080d16] p-2.5 rounded-lg border border-pink-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-cyan-400 uppercase">IPA_OUT</span>
                    <button
                      onClick={() => handlePlayAudio(popupInput)}
                      className="text-[9px] bg-pink-600 hover:bg-pink-500 text-white px-2 py-0.5 rounded font-black shadow-[0_0_8px_rgba(255,0,127,0.7)]"
                    >
                      🔊 SINTETIZAR
                    </button>
                  </div>
                  <div className="font-mono text-sm font-black text-cyan-300 select-all neon-text-cyan">{popupIpa}</div>
                  <div className="text-[10px] text-slate-400">Tradução: <span className="text-white font-bold">{popupTrans}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
