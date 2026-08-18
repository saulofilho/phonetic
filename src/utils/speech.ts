export function playSpeech(
  text: string,
  lang: string = 'en-US',
  rate: number = 0.9,
  pitch: number = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis não suportado neste navegador.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Normalize language codes
    let langCode = 'en-US';
    if (lang === 'en-gb' || lang === 'en-uk') langCode = 'en-GB';
    else if (lang.startsWith('en')) langCode = 'en-US';
    else if (lang.startsWith('pt')) langCode = 'pt-BR';
    else if (lang.startsWith('es')) langCode = 'es-ES';
    else if (lang.startsWith('fr')) langCode = 'fr-FR';
    else if (lang.startsWith('de')) langCode = 'de-DE';
    else if (lang.startsWith('it')) langCode = 'it-IT';
    else if (lang.startsWith('ja')) langCode = 'ja-JP';
    else if (lang.startsWith('zh')) langCode = 'zh-CN';

    utterance.lang = langCode;
    utterance.rate = Math.max(0.4, Math.min(rate, 2.0));
    utterance.pitch = Math.max(0.5, Math.min(pitch, 1.5));

    // Try finding natural voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode.slice(0, 2)) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
