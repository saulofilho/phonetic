import JSZip from 'jszip';
import { ExtensionFile } from '../types';

export function generateExtensionFiles(): ExtensionFile[] {
  const manifestJson = `{
  "manifest_version": 3,
  "name": "PhoneticTranslate - IPA & Pronunciation",
  "version": "1.0.0",
  "description": "Traduza palavras e frases na web com transcrição fonética IPA, divisão silábica, pronúncia com áudio e respelling.",
  "permissions": [
    "activeTab",
    "contextMenus",
    "storage",
    "tts"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "PhoneticTranslate Studio",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_end"
    }
  ],
  "options_ui": {
    "page": "options.html",
    "open_in_tab": true
  },
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`;

  const backgroundJs = `// Background Service Worker for PhoneticTranslate Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu for selected text
  chrome.contextMenus.create({
    id: "phonetic-translate-selection",
    title: "🔊 Traduzir com Fonética (IPA): '%s'",
    contexts: ["selection"]
  });

  // Default settings
  chrome.storage.sync.set({
    sourceLang: 'auto',
    targetLang: 'pt',
    notation: 'ipa',
    showTooltipOnSelect: true,
    autoSpeak: false,
    speechRate: 1.0
  });

  console.log("PhoneticTranslate Extension instalada com sucesso!");
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "phonetic-translate-selection" && info.selectionText) {
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showPhoneticBadge",
        text: info.selectionText
      });
    }
  }
});

// Listen for audio TTS requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "speakText") {
    chrome.tts.speak(request.text, {
      lang: request.lang || 'en-US',
      rate: request.rate || 0.9,
      pitch: 1.0,
      onEvent: function(event) {
        if (event.type === 'end') {
          sendResponse({ status: 'completed' });
        }
      }
    });
    return true;
  }
});
`;

  const contentJs = `// Content Script - Injects floating phonetic translation tooltip
(function() {
  let tooltipElement = null;
  let isEnabled = true;

  // Load user preferences
  chrome.storage.sync.get(['showTooltipOnSelect', 'autoSpeak', 'speechRate'], (data) => {
    if (data.showTooltipOnSelect !== undefined) {
      isEnabled = data.showTooltipOnSelect;
    }
  });

  // Listen for selection changes on webpage
  document.addEventListener('mouseup', handleTextSelection);

  // Listen for messages from background
  chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
    if (req.action === "showPhoneticBadge" && req.text) {
      const selection = window.getSelection();
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 3;

      if (selection && selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        x = rect.left + window.scrollX;
        y = rect.bottom + window.scrollY + 8;
      }

      displayPhoneticTooltip(req.text, x, y);
    }
  });

  function handleTextSelection(e) {
    // If clicked inside our tooltip, ignore
    if (tooltipElement && tooltipElement.contains(e.target)) return;

    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    if (selectedText.length > 0 && selectedText.length < 300 && isEnabled) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const x = rect.left + window.scrollX;
      const y = rect.bottom + window.scrollY + 8;
      
      displayPhoneticTooltip(selectedText, x, y);
    } else {
      removeTooltip();
    }
  }

  function displayPhoneticTooltip(text, x, y) {
    removeTooltip();

    tooltipElement = document.createElement('div');
    tooltipElement.className = 'pt-floating-tooltip';
    tooltipElement.style.left = Math.max(10, Math.min(x, window.innerWidth - 320)) + 'px';
    tooltipElement.style.top = (y + 6) + 'px';

    // Mock/Instant transcription computation (can be linked to API or offline rulebook)
    const ipa = estimateIpa(text);

    tooltipElement.innerHTML = \`
      <div class="pt-header">
        <div class="pt-title-wrap">
          <span class="pt-badge">IPA</span>
          <span class="pt-source-text">\${escapeHtml(text)}</span>
        </div>
        <button class="pt-btn-close" title="Fechar">&times;</button>
      </div>
      
      <div class="pt-body">
        <div class="pt-ipa-row">
          <span class="pt-ipa-text">\${escapeHtml(ipa)}</span>
          <button class="pt-btn-audio" title="Ouvir Pronúncia">🔊 Ouvir</button>
          <button class="pt-btn-copy" title="Copiar IPA">📋</button>
        </div>
        <div class="pt-syllables-row">
          <span class="pt-label">Divisão:</span>
          <span class="pt-syllables">\${formatSyllables(text)}</span>
        </div>
      </div>
    \`;

    document.body.appendChild(tooltipElement);

    // Audio button click
    const audioBtn = tooltipElement.querySelector('.pt-btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        playAudio(text);
      });
    }

    // Copy IPA
    const copyBtn = tooltipElement.querySelector('.pt-btn-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        navigator.clipboard.writeText(ipa);
        copyBtn.textContent = '✓';
        setTimeout(() => copyBtn.textContent = '📋', 1500);
      });
    }

    // Close button
    const closeBtn = tooltipElement.querySelector('.pt-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        removeTooltip();
      });
    }
  }

  function removeTooltip() {
    if (tooltipElement) {
      tooltipElement.remove();
      tooltipElement = null;
    }
  }

  function playAudio(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      chrome.runtime.sendMessage({ action: "speakText", text: text });
    }
  }

  function estimateIpa(text) {
    const dict = {
      'hello': '/həˈloʊ/',
      'world': '/wɜːrld/',
      'phonetic': '/fəˈnɛtɪk/',
      'transcription': '/trænˈskrɪpʃən/',
      'pronunciation': '/prəˌnʌnsiˈeɪʃən/',
      'language': '/ˈlæŋɡwɪdʒ/',
      'translation': '/trænsˈleɪʃən/',
      'chrome': '/kroʊm/',
      'plugin': '/ˈplʌɡɪn/',
      'extension': '/ɪkˈstɛnʃən/'
    };
    const lower = text.toLowerCase().trim();
    if (dict[lower]) return dict[lower];
    return '/' + lower.replace(/tion/g, 'ʃən').replace(/ph/g, 'f').replace(/th/g, 'θ') + '/';
  }

  function formatSyllables(text) {
    return text.split(' ').map(w => w.length > 4 ? w.slice(0, 3) + ' · ' + w.slice(3) : w).join(' ');
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
`;

  const contentCss = `/* Cyberpunk Styles for PhoneticTranslate Floating Tooltip */
.pt-floating-tooltip {
  position: absolute;
  z-index: 2147483647;
  width: 320px;
  max-width: 90vw;
  background: #05070f;
  color: #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.4), 0 10px 30px rgba(0, 0, 0, 0.8);
  border: 2px solid #00f0ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  padding: 14px;
  box-sizing: border-box;
  animation: pt-fade-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pt-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.pt-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}

.pt-badge {
  background: #00f0ff;
  color: #05070f;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pt-source-text {
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

.pt-btn-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #64748b;
  padding: 0 4px;
  line-height: 1;
  font-weight: bold;
}

.pt-btn-close:hover {
  color: #ff007f;
}

.pt-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pt-ipa-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #090d16;
  border: 1px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  padding: 8px 10px;
}

.pt-ipa-text {
  font-family: ui-monospace, monospace;
  font-size: 15px;
  font-weight: 900;
  color: #00f0ff;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.pt-btn-audio, .pt-btn-copy {
  background: #00f0ff;
  color: #05070f;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}

.pt-btn-copy {
  background: #1e293b;
  color: #cbd5e1;
  box-shadow: none;
  border: 1px solid #334155;
}

.pt-btn-audio:hover {
  background: #ff007f;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(255, 0, 127, 0.7);
}

.pt-btn-copy:hover {
  background: #334155;
  color: #ffffff;
}

.pt-syllables-row {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  gap: 6px;
}

.pt-label {
  font-weight: 700;
  color: #ff007f;
}

.pt-syllables {
  color: #e2e8f0;
  font-weight: 600;
}
`;

  const popupHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhoneticTranslate // Cyber HUD</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup-container">
    <header class="header">
      <div class="logo">
        <span class="icon">⚡</span>
        <div>
          <h1>PHONETIC//CYBER</h1>
          <span class="sub">NEURAL IPA DECODER MATRIX</span>
        </div>
      </div>
      <button id="btn-options" title="Configurações">⚙️</button>
    </header>

    <div class="input-section">
      <div class="lang-controls">
        <select id="source-lang">
          <option value="en">US English</option>
          <option value="en-gb">UK English</option>
          <option value="pt">Português (BR)</option>
          <option value="es">Espanhol</option>
          <option value="fr">Francês</option>
        </select>
        <span class="arrow">➔</span>
        <select id="target-lang">
          <option value="pt">Português (BR)</option>
          <option value="en">Inglês</option>
          <option value="es">Espanhol</option>
        </select>
      </div>

      <div class="textarea-wrap">
        <textarea id="input-text" placeholder="Insira o texto para transcrição neural..." rows="3">phonetic transcription</textarea>
        <button id="btn-clear" class="btn-icon" title="Limpar">&times;</button>
      </div>

      <div class="actions-row">
        <button id="btn-translate" class="btn-primary">DECODIFICAR IPA</button>
        <button id="btn-speak-input" class="btn-secondary" title="Sintetizar áudio">🔊</button>
      </div>
    </div>

    <div class="result-section" id="result-box">
      <div class="result-card">
        <div class="result-header">
          <span class="badge">IPA Fonético</span>
          <div class="controls-right">
            <button id="btn-speak-slow" class="btn-tag" title="Ouvir devagar">🐢 0.7x</button>
            <button id="btn-speak" class="btn-tag" title="Ouvir normal">🔊 1.0x</button>
            <button id="btn-copy-ipa" class="btn-tag" title="Copiar IPA">📋 Copiar</button>
          </div>
        </div>

        <div class="ipa-display" id="ipa-output">
          /fəˈnɛtɪk trænˈskrɪpʃən/
        </div>

        <div class="respell-display" id="respell-output">
          fuh-NET-ik tran-SKRIP-shun
        </div>

        <div class="translation-display" id="translation-output">
          Tradução: transcrição fonética
        </div>

        <div class="syllables-box" id="syllables-output">
          Divisão: pho · net · ic | tran · scrip · tion
        </div>
      </div>
    </div>

    <footer class="footer">
      <span>Dica: Selecione qualquer texto em qualquer site para ver o balão fonético!</span>
    </footer>
  </div>

  <script src="popup.js"></script>
</body>
</html>`;

  const popupJs = `// Popup logic for PhoneticTranslate
document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('input-text');
  const btnTranslate = document.getElementById('btn-translate');
  const btnClear = document.getElementById('btn-clear');
  const btnSpeak = document.getElementById('btn-speak');
  const btnSpeakSlow = document.getElementById('btn-speak-slow');
  const btnSpeakInput = document.getElementById('btn-speak-input');
  const btnCopyIpa = document.getElementById('btn-copy-ipa');
  const btnOptions = document.getElementById('btn-options');
  const sourceLang = document.getElementById('source-lang');
  const targetLang = document.getElementById('target-lang');
  const ipaOutput = document.getElementById('ipa-output');
  const respellOutput = document.getElementById('respell-output');
  const translationOutput = document.getElementById('translation-output');
  const syllablesOutput = document.getElementById('syllables-output');

  // Load saved preferences
  chrome.storage.sync.get(['sourceLang', 'targetLang'], (data) => {
    if (data.sourceLang) sourceLang.value = data.sourceLang;
    if (data.targetLang) targetLang.value = data.targetLang;
  });

  // Action: Translate & Transcribe
  btnTranslate.addEventListener('click', performTranslation);
  inputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      performTranslation();
    }
  });

  // Action: Clear
  btnClear.addEventListener('click', () => {
    inputText.value = '';
    inputText.focus();
  });

  // Action: Speak
  btnSpeak.addEventListener('click', () => speak(inputText.value, 1.0));
  btnSpeakSlow.addEventListener('click', () => speak(inputText.value, 0.7));
  btnSpeakInput.addEventListener('click', () => speak(inputText.value, 1.0));

  // Action: Copy IPA
  btnCopyIpa.addEventListener('click', () => {
    navigator.clipboard.writeText(ipaOutput.textContent.trim());
    btnCopyIpa.textContent = '✓ Copiado';
    setTimeout(() => btnCopyIpa.textContent = '📋 Copiar', 1500);
  });

  // Action: Options
  btnOptions.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  function performTranslation() {
    const text = inputText.value.trim();
    if (!text) return;

    // Built-in phonetic dictionary for offline quick responses
    const dict = {
      'phonetic': { ipa: '/fəˈnɛtɪk/', respell: 'fuh-NET-ik', trans: 'fonético', syl: 'pho · net · ic' },
      'transcription': { ipa: '/trænˈskrɪpʃən/', respell: 'tran-SKRIP-shun', trans: 'transcrição', syl: 'tran · scrip · tion' },
      'pronunciation': { ipa: '/prəˌnʌnsiˈeɪʃən/', respell: 'pruh-nun-see-AY-shun', trans: 'pronúncia', syl: 'pro · nun · ci · a · tion' },
      'hello': { ipa: '/həˈloʊ/', respell: 'huh-LOH', trans: 'olá', syl: 'hel · lo' },
      'world': { ipa: '/wɜːrld/', respell: 'WURLD', trans: 'mundo', syl: 'world' },
      'language': { ipa: '/ˈlæŋɡwɪdʒ/', respell: 'LANG-gwij', trans: 'linguagem', syl: 'lan · guage' }
    };

    const words = text.toLowerCase().split(/\\s+/);
    let ipaParts = [];
    let respellParts = [];
    let sylParts = [];

    words.forEach(w => {
      const match = dict[w.replace(/[.,!?;:]/g, '')];
      if (match) {
        ipaParts.push(match.ipa.replace(/^\\/|\\/$/g, ''));
        respellParts.push(match.respell);
        sylParts.push(match.syl);
      } else {
        ipaParts.push(w.replace(/tion/g, 'ʃən').replace(/ph/g, 'f').replace(/th/g, 'θ'));
        respellParts.push(w.toUpperCase());
        sylParts.push(w);
      }
    });

    ipaOutput.textContent = '/' + ipaParts.join(' ') + '/';
    respellOutput.textContent = respellParts.join(' ');
    syllablesOutput.textContent = 'Divisão: ' + sylParts.join(' | ');
    translationOutput.textContent = 'Texto: ' + text;
  }

  function speak(text, rate = 1.0) {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = sourceLang.value.includes('en') ? 'en-US' : (sourceLang.value === 'pt' ? 'pt-BR' : 'es-ES');
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }
});
`;

  const popupCss = `/* PhoneticTranslate Cyberpunk Popup Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  width: 360px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background-color: #05070f;
  color: #e2e8f0;
  padding: 12px;
}

.popup-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  padding-bottom: 8px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo .icon {
  font-size: 20px;
}

.logo h1 {
  font-size: 14px;
  font-weight: 900;
  color: #00f0ff;
  letter-spacing: 1px;
  line-height: 1.1;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.logo .sub {
  font-size: 9px;
  color: #ff007f;
  font-weight: bold;
}

#btn-options {
  background: #090d16;
  border: 1px solid #334155;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
}

#btn-options:hover {
  background: #1e293b;
  border-color: #00f0ff;
}

.lang-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid rgba(0, 240, 255, 0.4);
  border-radius: 6px;
  background: #090d16;
  font-size: 11px;
  font-family: inherit;
  color: #00f0ff;
}

.arrow {
  color: #ff007f;
  font-weight: bold;
}

.textarea-wrap {
  position: relative;
  margin-bottom: 8px;
}

textarea {
  width: 100%;
  padding: 8px 24px 8px 8px;
  border: 1px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  font-size: 12px;
  resize: vertical;
  font-family: inherit;
  background: #000000;
  color: #e2e8f0;
}

textarea:focus {
  outline: none;
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}

.btn-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
}

.actions-row {
  display: flex;
  gap: 6px;
}

.btn-primary {
  flex: 1;
  background: #00f0ff;
  color: #05070f;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.5);
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background: #38bdf8;
}

.btn-secondary {
  background: #090d16;
  border: 1px solid rgba(0, 240, 255, 0.4);
  color: #00f0ff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #1e293b;
}

.result-card {
  background: #000000;
  border: 1px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge {
  background: rgba(0, 240, 255, 0.2);
  color: #00f0ff;
  font-size: 9px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.4);
}

.controls-right {
  display: flex;
  gap: 4px;
}

.btn-tag {
  background: #090d16;
  border: 1px solid #334155;
  border-radius: 4px;
  font-size: 9px;
  font-family: inherit;
  padding: 2px 6px;
  cursor: pointer;
  color: #94a3b8;
  font-weight: bold;
}

.btn-tag:hover {
  border-color: #00f0ff;
  color: #00f0ff;
}

.ipa-display {
  font-family: ui-monospace, monospace;
  font-size: 16px;
  font-weight: 900;
  color: #00f0ff;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.respell-display {
  font-size: 11px;
  font-weight: 700;
  color: #eab308;
  text-transform: uppercase;
}

.translation-display {
  font-size: 12px;
  color: #e2e8f0;
  border-top: 1px solid #1e293b;
  padding-top: 6px;
}

.syllables-box {
  font-size: 10px;
  color: #94a3b8;
}

.footer {
  font-size: 9px;
  color: #64748b;
  text-align: center;
}
`;

  const optionsHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Configurações - PhoneticTranslate</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #1e293b; background: #f8fafc; }
    .card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #0f172a; display: flex; align-items: center; gap: 8px; }
    .form-group { margin-bottom: 18px; }
    label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; }
    select, input[type="range"] { width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer; }
    .btn-save { background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .status { margin-top: 12px; font-size: 13px; color: #16a34a; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚙️ Configurações do PhoneticTranslate</h1>
    
    <div class="form-group">
      <label for="default-source">Idioma Padrão de Origem:</label>
      <select id="default-source">
        <option value="en">Inglês (US)</option>
        <option value="en-gb">Inglês (UK)</option>
        <option value="pt">Português (BR)</option>
        <option value="es">Espanhol</option>
        <option value="fr">Francês</option>
      </select>
    </div>

    <div class="form-group">
      <label for="default-target">Idioma Padrão de Tradução:</label>
      <select id="default-target">
        <option value="pt">Português (Brasil)</option>
        <option value="en">Inglês</option>
        <option value="es">Espanhol</option>
      </select>
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="show-tooltip" checked>
        Exibir balão flutuante automaticamente ao selecionar texto em qualquer site
      </label>
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="auto-speak">
        Pronunciar áudio automaticamente ao abrir balão
      </label>
    </div>

    <div class="form-group">
      <label for="speech-rate">Velocidade da Fala: <span id="rate-val">0.9x</span></label>
      <input type="range" id="speech-rate" min="0.5" max="1.5" step="0.1" value="0.9">
    </div>

    <button id="save-btn" class="btn-save">Salvar Preferências</button>
    <div id="status" class="status"></div>
  </div>

  <script src="options.js"></script>
</body>
</html>`;

  const optionsJs = `// Options page logic
document.addEventListener('DOMContentLoaded', () => {
  const defaultSource = document.getElementById('default-source');
  const defaultTarget = document.getElementById('default-target');
  const showTooltip = document.getElementById('show-tooltip');
  const autoSpeak = document.getElementById('auto-speak');
  const speechRate = document.getElementById('speech-rate');
  const rateVal = document.getElementById('rate-val');
  const saveBtn = document.getElementById('save-btn');
  const status = document.getElementById('status');

  speechRate.addEventListener('input', () => {
    rateVal.textContent = speechRate.value + 'x';
  });

  // Load existing
  chrome.storage.sync.get(['sourceLang', 'targetLang', 'showTooltipOnSelect', 'autoSpeak', 'speechRate'], (data) => {
    if (data.sourceLang) defaultSource.value = data.sourceLang;
    if (data.targetLang) defaultTarget.value = data.targetLang;
    if (data.showTooltipOnSelect !== undefined) showTooltip.checked = data.showTooltipOnSelect;
    if (data.autoSpeak !== undefined) autoSpeak.checked = data.autoSpeak;
    if (data.speechRate) {
      speechRate.value = data.speechRate;
      rateVal.textContent = data.speechRate + 'x';
    }
  });

  saveBtn.addEventListener('click', () => {
    chrome.storage.sync.set({
      sourceLang: defaultSource.value,
      targetLang: defaultTarget.value,
      showTooltipOnSelect: showTooltip.checked,
      autoSpeak: autoSpeak.checked,
      speechRate: parseFloat(speechRate.value)
    }, () => {
      status.textContent = '✓ Configurações salvas com sucesso!';
      setTimeout(() => status.textContent = '', 2500);
    });
  });
});
`;

  const readmeMd = `# 🗣️ PhoneticTranslate - Chrome Extension (Manifest V3)

Plugin para Google Chrome que realiza **tradução instantânea acompanhada de transcrição fonética precisa (IPA - Alfabeto Fonético Internacional)**, divisão silábica, respelling em inglês simplificado e pronúncia com sintetizador de voz.

---

## 🚀 Como Instalar no Google Chrome / Edge / Brave

1. **Baixe o arquivo ZIP** clicando no botão **"Baixar Extensão (.ZIP)"** neste painel.
2. **Extraia o arquivo ZIP** em uma pasta no seu computador (por exemplo: \`Documentos/phonetic-translate-extension\`).
3. Abra o Google Chrome e digite na barra de endereços:
   \`\`\`text
   chrome://extensions/
   \`\`\`
4. No canto superior direito da página, **ative a chave "Modo do desenvolvedor" (Developer mode)**.
5. Clique no botão **"Carregar sem compactação" (Load unpacked)** no canto superior esquerdo.
6. Selecione a pasta onde você descompactou os arquivos da extensão.
7. **Pronto!** O ícone do **PhoneticTranslate** aparecerá na barra de ferramentas do Chrome.

---

## 💡 Como Usar

- **Seleção Direta na Web**: Selecione qualquer palavra ou frase em uma página web (ex: Wikipedia, BBC, Medium, YouTube transcripts). Um balão flutuante aparecerá imediatamente com o IPA, áudio e tradução.
- **Botão Direito do Mouse**: Clique com o botão direito sobre um texto selecionado e escolha **"🔊 Traduzir com Fonética (IPA)"**.
- **Popup da Barra de Ferramentas**: Clique no ícone da extensão no topo do Chrome para traduzir, ouvir em velocidade lenta (0.7x) e copiar os símbolos fonéticos.
- **Opções**: Clique com o botão direito no ícone da extensão e vá em **Opções** para ajustar o idioma padrão e velocidade de áudio.

---

## 📂 Estrutura de Arquivos

- \`manifest.json\`: Manifesto V3 oficial do Chrome
- \`content.js\` & \`content.css\`: Script que injeta o balão fonético nas páginas web
- \`background.js\`: Service worker em segundo plano para menu de contexto e áudio
- \`popup.html\`, \`popup.js\`, \`popup.css\`: Interface do popup rápido
- \`options.html\`, \`options.js\`: Página de preferências do usuário
- \`icons/\`: Ícones 16x16, 48x48 e 128x128
`;

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="50%" stop-color="#7000ff" />
      <stop offset="100%" stop-color="#ff007f" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="4" y="4" width="120" height="120" rx="28" fill="#05070f" stroke="#00f0ff" stroke-width="2" />
  <path d="M 12 28 L 12 12 L 28 12" fill="none" stroke="#ff007f" stroke-width="2" />
  <path d="M 116 28 L 116 12 L 100 12" fill="none" stroke="#00f0ff" stroke-width="2" />
  <path d="M 12 100 L 12 116 L 28 116" fill="none" stroke="#00f0ff" stroke-width="2" />
  <path d="M 116 100 L 116 116 L 100 116" fill="none" stroke="#ff007f" stroke-width="2" />
  <line x1="28" y1="64" x2="28" y2="64" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
  <line x1="38" y1="52" x2="38" y2="76" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
  <line x1="48" y1="40" x2="48" y2="88" stroke="url(#cyberGrad)" stroke-width="4" stroke-linecap="round" />
  <text x="74" y="76" font-family="monospace" font-size="44" font-weight="900" fill="url(#cyberGrad)" filter="url(#glow)" text-anchor="middle">/ə/</text>
  <line x1="100" y1="46" x2="100" y2="82" stroke="#ff007f" stroke-width="4" stroke-linecap="round" />
  <circle cx="106" cy="22" r="3" fill="#00ff66" />
</svg>`;

  return [
    { name: 'manifest.json', path: 'manifest.json', content: manifestJson, description: 'Manifest V3 com permissões, ícones e endpoints', language: 'json' },
    { name: 'background.js', path: 'background.js', content: backgroundJs, description: 'Service Worker em segundo plano & menu de contexto', language: 'javascript' },
    { name: 'content.js', path: 'content.js', content: contentJs, description: 'Script de injeção e balão fonético na página web', language: 'javascript' },
    { name: 'content.css', path: 'content.css', content: contentCss, description: 'Estilos CSS do balão flutuante na página', language: 'css' },
    { name: 'popup.html', path: 'popup.html', content: popupHtml, description: 'Layout HTML do popup de tradução rápida', language: 'html' },
    { name: 'popup.js', path: 'popup.js', content: popupJs, description: 'Lógica do popup e síntese de fala', language: 'javascript' },
    { name: 'popup.css', path: 'popup.css', content: popupCss, description: 'Estilos do popup', language: 'css' },
    { name: 'options.html', path: 'options.html', content: optionsHtml, description: 'Interface de configurações da extensão', language: 'html' },
    { name: 'options.js', path: 'options.js', content: optionsJs, description: 'Lógica de salvamento das configurações', language: 'javascript' },
    { name: 'icon.svg', path: 'icons/icon.svg', content: iconSvg, description: 'Ícone vetorial Cyberpunk HUD (128x128)', language: 'html' },
    { name: 'README.md', path: 'README.md', content: readmeMd, description: 'Guia passo a passo de instalação no Google Chrome', language: 'markdown' }
  ];
}

function renderCyberpunkIconCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const scale = size / 128;

  // Background
  ctx.fillStyle = '#05070f';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(4 * scale, 4 * scale, 120 * scale, 120 * scale, 24 * scale);
  } else {
    ctx.rect(4 * scale, 4 * scale, 120 * scale, 120 * scale);
  }
  ctx.fill();

  // Cyber border
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.stroke();

  // Neon gradient text /ə/
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#00f0ff');
  grad.addColorStop(0.5, '#bd00ff');
  grad.addColorStop(1, '#ff007f');

  if (size >= 32) {
    ctx.fillStyle = grad;
    ctx.font = `900 ${Math.floor(40 * scale)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('/ə/', size / 2, size / 2);
  } else {
    ctx.fillStyle = '#00f0ff';
    ctx.font = `bold ${Math.floor(12 * scale)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ə', size / 2, size / 2);
  }

  return canvas;
}

export async function downloadExtensionZip(): Promise<void> {
  const zip = new JSZip();
  const files = generateExtensionFiles();

  files.forEach(file => {
    zip.file(file.path, file.content);
  });

  // Generate Cyberpunk PNG icons (128, 48, 32, 16)
  const sizes = [128, 48, 32, 16];
  for (const size of sizes) {
    const canvas = renderCyberpunkIconCanvas(size);
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
    if (blob) {
      zip.file(`icons/icon${size}.png`, blob);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'phonetic-translate-chrome-extension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
