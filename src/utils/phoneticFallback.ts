// Client-side rule & dictionary fallback for instant zero-latency transcription
import { PhoneticResult, WordToken } from '../types';

const COMMON_IPA_DICT: Record<string, { ipa: string; respell: string; transPt: string; syllables: string; stress: string }> = {
  // English words
  'hello': { ipa: '/həˈloʊ/', respell: 'huh-LOH', transPt: 'olá', syllables: 'hel · lo', stress: '2nd' },
  'world': { ipa: '/wɜːrld/', respell: 'WURLD', transPt: 'mundo', syllables: 'world', stress: '1st' },
  'phonetic': { ipa: '/fəˈnɛtɪk/', respell: 'fuh-NET-ik', transPt: 'fonético', syllables: 'pho · net · ic', stress: '2nd' },
  'transcription': { ipa: '/trænˈskrɪpʃən/', respell: 'tran-SKRIP-shun', transPt: 'transcrição', syllables: 'tran · scrip · tion', stress: '2nd' },
  'pronunciation': { ipa: '/prəˌnʌnsiˈeɪʃən/', respell: 'pruh-nun-see-AY-shun', transPt: 'pronúncia', syllables: 'pro · nun · ci · a · tion', stress: '4th' },
  'language': { ipa: '/ˈlæŋɡwɪdʒ/', respell: 'LANG-gwij', transPt: 'idioma / linguagem', syllables: 'lan · guage', stress: '1st' },
  'chrome': { ipa: '/kroʊm/', respell: 'KROHM', transPt: 'cromo / navegador Chrome', syllables: 'chrome', stress: '1st' },
  'extension': { ipa: '/ɪkˈstɛnʃən/', respell: 'ik-STEN-shun', transPt: 'extensão', syllables: 'ex · ten · sion', stress: '2nd' },
  'plugin': { ipa: '/ˈplʌɡɪn/', respell: 'PLUG-in', transPt: 'plugin / extensão', syllables: 'plug · in', stress: '1st' },
  'translation': { ipa: '/trænsˈleɪʃən/', respell: 'trans-LAY-shun', transPt: 'tradução', syllables: 'trans · la · tion', stress: '2nd' },
  'english': { ipa: '/ˈɪŋɡlɪʃ/', respell: 'ING-glish', transPt: 'inglês', syllables: 'eng · lish', stress: '1st' },
  'portuguese': { ipa: '/ˌpɔːrtʃəˈɡiːz/', respell: 'por-chuh-GEEZ', transPt: 'português', syllables: 'por · tu · guese', stress: '3rd' },
  'spanish': { ipa: '/ˈspænɪʃ/', respell: 'SPAN-ish', transPt: 'espanhol', syllables: 'span · ish', stress: '1st' },
  'french': { ipa: '/frɛntʃ/', respell: 'FRENCH', transPt: 'francês', syllables: 'french', stress: '1st' },
  'learning': { ipa: '/ˈlɜːrnɪŋ/', respell: 'LUR-ning', transPt: 'aprendizado', syllables: 'learn · ing', stress: '1st' },
  'speech': { ipa: '/spiːtʃ/', respell: 'SPEECH', transPt: 'fala / discurso', syllables: 'speech', stress: '1st' },
  'voice': { ipa: '/vɔɪs/', respell: 'VOYS', transPt: 'voz', syllables: 'voice', stress: '1st' },
  'listen': { ipa: '/ˈlɪsən/', respell: 'LIS-un', transPt: 'ouvir / escutar', syllables: 'lis · ten', stress: '1st' },
  'practice': { ipa: '/ˈpræktɪs/', respell: 'PRAK-tis', transPt: 'prática / praticar', syllables: 'prac · tice', stress: '1st' },
  'sound': { ipa: '/saʊnd/', respell: 'SOWND', transPt: 'som', syllables: 'sound', stress: '1st' },
  'accent': { ipa: '/ˈæksɛnt/', respell: 'AK-sent', transPt: 'sotaque / acento', syllables: 'ac · cent', stress: '1st' },
  'rhythm': { ipa: '/ˈrɪðəm/', respell: 'RITH-um', transPt: 'ritmo', syllables: 'rhyth · m', stress: '1st' },
  'vowel': { ipa: '/ˈvaʊəl/', respell: 'VOW-ul', transPt: 'vogal', syllables: 'vow · el', stress: '1st' },
  'consonant': { ipa: '/ˈkɒnsənənt/', respell: 'KON-suh-nunt', transPt: 'consoante', syllables: 'con · so · nant', stress: '1st' },
  'syllable': { ipa: '/ˈsɪləbəl/', respell: 'SIL-uh-bul', transPt: 'sílaba', syllables: 'syl · la · ble', stress: '1st' },
  'dictionary': { ipa: '/ˈdɪkʃənɛri/', respell: 'DIK-shuh-nair-ee', transPt: 'dicionário', syllables: 'dic · tion · ar · y', stress: '1st' },
  'knowledge': { ipa: '/ˈnɒlɪdʒ/', respell: 'NOL-ij', transPt: 'conhecimento', syllables: 'knowl · edge', stress: '1st' },
  'thought': { ipa: '/θɔːt/', respell: 'THAWT', transPt: 'pensamento', syllables: 'thought', stress: '1st' },
  'through': { ipa: '/θruː/', respell: 'THROO', transPt: 'através de', syllables: 'through', stress: '1st' },
  'comfortable': { ipa: '/ˈkʌmftəbəl/', respell: 'KUMF-tuh-bul', transPt: 'confortável', syllables: 'com · fort · a · ble', stress: '1st' },
  'schedule': { ipa: '/ˈskɛdʒuːl/', respell: 'SKED-jool', transPt: 'horário / cronograma', syllables: 'sched · ule', stress: '1st' },
  'water': { ipa: '/ˈwɔːtər/', respell: 'WAH-ter', transPt: 'água', syllables: 'wa · ter', stress: '1st' },
  'people': { ipa: '/ˈpiːpəl/', respell: 'PEE-pul', transPt: 'pessoas', syllables: 'peo · ple', stress: '1st' },
  'time': { ipa: '/taɪm/', respell: 'TYM', transPt: 'tempo / hora', syllables: 'time', stress: '1st' },
  'development': { ipa: '/dɪˈvɛləpmənt/', respell: 'dih-VEL-up-munt', transPt: 'desenvolvimento', syllables: 'de · vel · op · ment', stress: '2nd' },
};

export function getFallbackPhonetic(text: string, sourceLang = 'en', targetLang = 'pt'): PhoneticResult {
  const clean = text.trim();
  const words = clean.split(/\s+/).map(w => w.replace(/[.,!?;:"'()]/g, ''));
  
  const tokenList: WordToken[] = words.map(w => {
    const lower = w.toLowerCase();
    const match = COMMON_IPA_DICT[lower];
    if (match) {
      return {
        original: w,
        ipa: match.ipa,
        syllables: match.syllables,
        stress: match.stress,
        translation: match.transPt,
        notes: lower === 'schedule' ? 'US: /ˈskɛdʒuːl/, UK: /ˈʃɛdjuːl/' : (lower === 'thought' ? 'Som inicial "th" surdo [θ]' : undefined)
      };
    }
    // Simple heuristic estimate
    return {
      original: w,
      ipa: `/${lower.replace(/tion/g, 'ʃən').replace(/ph/g, 'f').replace(/th/g, 'θ').replace(/ch/g, 'tʃ')}/`,
      syllables: w.length > 4 ? `${w.slice(0, 3)} · ${w.slice(3)}` : w,
      translation: `[${w}]`
    };
  });

  const ipaFull = tokenList.map(t => t.ipa.replace(/^\/|\/$/g, '')).join(' ');
  const respellFull = tokenList.map(t => {
    const lower = t.original.toLowerCase();
    return COMMON_IPA_DICT[lower]?.respell || t.original.toUpperCase();
  }).join(' ');

  return {
    id: `res_${Date.now()}`,
    sourceText: clean,
    sourceLang,
    targetLang,
    translatedText: tokenList.map(t => t.translation || t.original).join(' '),
    sourceIpa: `/${ipaFull}/`,
    syllableBreakdown: tokenList.map(t => t.syllables || t.original).join(' | '),
    simplifiedRespell: respellFull,
    words: tokenList,
    pronunciationNotes: [
      'IPA (Alfabeto Fonético Internacional) mostra o som exato das vogais e consoantes.',
      'Símbolo ˈ indica a sílaba tônica (stress) a seguir.',
      'Símbolo ˌ indica sílaba com acentuação secundária.'
    ],
    homophones: [],
    timestamp: Date.now()
  };
}
