export interface IpaSymbol {
  symbol: string;
  name: string;
  type: 'vowel' | 'diphthong' | 'consonant';
  category: string;
  exampleWord: string;
  exampleIpa: string;
  exampleTranslation: string;
  descriptionPt: string;
}

export const IPA_SYMBOLS: IpaSymbol[] = [
  // Monophthongs (Vogais Puras)
  { symbol: 'iː', name: 'Vogal anterior fechada longa', type: 'vowel', category: 'Vogais Longas', exampleWord: 'sheep', exampleIpa: '/ʃiːp/', exampleTranslation: 'ovelha', descriptionPt: 'Som de "i" longo e tenso, como em "vi".' },
  { symbol: 'ɪ', name: 'Vogal quase fechada anterior', type: 'vowel', category: 'Vogais Curtas', exampleWord: 'ship', exampleIpa: '/ʃɪp/', exampleTranslation: 'navio', descriptionPt: 'Som entre "i" e "e" relaxado, inexistente no português.' },
  { symbol: 'e', name: 'Vogal média-fechada anterior', type: 'vowel', category: 'Vogais Curtas', exampleWord: 'bed', exampleIpa: '/bɛd/', exampleTranslation: 'cama', descriptionPt: 'Som de "é" aberto e curto, como em "pé".' },
  { symbol: 'æ', name: 'Vogal quase aberta anterior (Ash)', type: 'vowel', category: 'Vogais Curtas', exampleWord: 'cat', exampleIpa: '/kæt/', exampleTranslation: 'gato', descriptionPt: 'Boca bem aberta entre "a" e "é".' },
  { symbol: 'ɑː', name: 'Vogal posterior aberta longa', type: 'vowel', category: 'Vogais Longas', exampleWord: 'father', exampleIpa: '/ˈfɑːðər/', exampleTranslation: 'pai', descriptionPt: 'Som de "a" profundo e sustentado.' },
  { symbol: 'ɒ', name: 'Vogal posterior aberta arredondada', type: 'vowel', category: 'Vogais Curtas', exampleWord: 'not', exampleIpa: '/nɒt/', exampleTranslation: 'não', descriptionPt: 'Som de "ó" bem aberto (típico do inglês britânico).' },
  { symbol: 'ɔː', name: 'Vogal média-aberta posterior longa', type: 'vowel', category: 'Vogais Longas', exampleWord: 'door', exampleIpa: '/dɔːr/', exampleTranslation: 'porta', descriptionPt: 'Som de "ó" longo e arredondado.' },
  { symbol: 'ʊ', name: 'Vogal quase fechada posterior', type: 'vowel', category: 'Vogais Curtas', exampleWord: 'good', exampleIpa: '/ɡʊd/', exampleTranslation: 'bom', descriptionPt: 'Som de "u" relaxado e curto, como em "pudim".' },
  { symbol: 'uː', name: 'Vogal posterior fechada longa', type: 'vowel', category: 'Vogais Longas', exampleWord: 'moon', exampleIpa: '/muːn/', exampleTranslation: 'lua', descriptionPt: 'Som de "u" longo e arredondado.' },
  { symbol: 'ʌ', name: 'Vogal média-aberta central', type: 'vowel', category: 'Vogais Curtas', exampleWord: 'cup', exampleIpa: '/kʌp/', exampleTranslation: 'xícara', descriptionPt: 'Som de "a" curto e gutural na garganta.' },
  { symbol: 'ɜːr', name: 'Vogal central aberta rôdica', type: 'vowel', category: 'Vogais Longas', exampleWord: 'bird', exampleIpa: '/bɜːrd/', exampleTranslation: 'pássaro', descriptionPt: 'Vogal enrolada com a ponta da língua curvada.' },
  { symbol: 'ə', name: 'Schwa (Vogal neutra reduzida)', type: 'vowel', category: 'Vogais Reduzidas', exampleWord: 'about', exampleIpa: '/əˈbaʊt/', exampleTranslation: 'sobre', descriptionPt: 'O som mais comum do inglês: vogal neutra átona totalmente relaxada.' },

  // Diphthongs (Ditongos)
  { symbol: 'eɪ', name: 'Ditongo ei', type: 'diphthong', category: 'Ditongos', exampleWord: 'face', exampleIpa: '/feɪs/', exampleTranslation: 'rosto', descriptionPt: 'Desliza de "ê" para "i", como em "leite".' },
  { symbol: 'aɪ', name: 'Ditongo ai', type: 'diphthong', category: 'Ditongos', exampleWord: 'time', exampleIpa: '/taɪm/', exampleTranslation: 'tempo', descriptionPt: 'Desliza de "a" para "i", como em "pai".' },
  { symbol: 'ɔɪ', name: 'Ditongo oi', type: 'diphthong', category: 'Ditongos', exampleWord: 'boy', exampleIpa: '/bɔɪ/', exampleTranslation: 'menino', descriptionPt: 'Desliza de "ó" para "i", como em "boi".' },
  { symbol: 'aʊ', name: 'Ditongo au', type: 'diphthong', category: 'Ditongos', exampleWord: 'house', exampleIpa: '/haʊs/', exampleTranslation: 'casa', descriptionPt: 'Desliza de "a" para "u", como em "mau".' },
  { symbol: 'oʊ', name: 'Ditongo ou', type: 'diphthong', category: 'Ditongos', exampleWord: 'go', exampleIpa: '/ɡoʊ/', exampleTranslation: 'ir', descriptionPt: 'Desliza de "ô" para "u", como em "show".' },
  { symbol: 'ɪər', name: 'Ditongo ear', type: 'diphthong', category: 'Ditongos Rôdicos', exampleWord: 'near', exampleIpa: '/nɪər/', exampleTranslation: 'perto', descriptionPt: 'Transição de "i" para "er".' },
  { symbol: 'eər', name: 'Ditongo air', type: 'diphthong', category: 'Ditongos Rôdicos', exampleWord: 'hair', exampleIpa: '/heər/', exampleTranslation: 'cabelo', descriptionPt: 'Transição de "é" para "er".' },

  // Consonants (Consoantes Especiais)
  { symbol: 'θ', name: 'Fricativa dental surda (Theta)', type: 'consonant', category: 'Fricativas Dentais', exampleWord: 'think', exampleIpa: '/θɪŋk/', exampleTranslation: 'pensar', descriptionPt: 'Língua entre os dentes soprando sem vibrar as cordas vocais ("th" em think).' },
  { symbol: 'ð', name: 'Fricativa dental sonora (Eth)', type: 'consonant', category: 'Fricativas Dentais', exampleWord: 'this', exampleIpa: '/ðɪs/', exampleTranslation: 'isto', descriptionPt: 'Língua entre os dentes vibrando as cordas vocais ("th" em this/mother).' },
  { symbol: 'ʃ', name: 'Fricativa pós-alveolar surda (Esh)', type: 'consonant', category: 'Sibilantes', exampleWord: 'shine', exampleIpa: '/ʃaɪn/', exampleTranslation: 'brilhar', descriptionPt: 'Som do "ch" carioca ou "x" em "xícara".' },
  { symbol: 'ʒ', name: 'Fricativa pós-alveolar sonora (Ezh)', type: 'consonant', category: 'Sibilantes', exampleWord: 'vision', exampleIpa: '/ˈvɪʒən/', exampleTranslation: 'visão', descriptionPt: 'Som de "j" em "janela" ou "g" em "girafa".' },
  { symbol: 'tʃ', name: 'Africada pós-alveolar surda', type: 'consonant', category: 'Africadas', exampleWord: 'cheese', exampleIpa: '/tʃiːz/', exampleTranslation: 'queijo', descriptionPt: 'Som de "tch" em "tchau" ou "tchê".' },
  { symbol: 'dʒ', name: 'Africada pós-alveolar sonora', type: 'consonant', category: 'Africadas', exampleWord: 'judge', exampleIpa: '/dʒʌdʒ/', exampleTranslation: 'juiz', descriptionPt: 'Som de "dj" em "dia" no sotaque paulista/carioca.' },
  { symbol: 'ŋ', name: 'Nasal velar (Eng)', type: 'consonant', category: 'Nasais', exampleWord: 'sing', exampleIpa: '/sɪŋ/', exampleTranslation: 'cantar', descriptionPt: 'Som nasal no fundo da garganta, sem pronunciar o "g" final.' },
  { symbol: 'w', name: 'Aproximante labiovelar', type: 'consonant', category: 'Semivogais', exampleWord: 'water', exampleIpa: '/ˈwɔːtər/', exampleTranslation: 'água', descriptionPt: 'Som de "u" consonantal rápido, como em "web".' },
  { symbol: 'j', name: 'Aproximante palatal', type: 'consonant', category: 'Semivogais', exampleWord: 'yes', exampleIpa: '/jɛs/', exampleTranslation: 'sim', descriptionPt: 'Som de "i" consonantal rápido, como em "ioió".' },
  { symbol: 'r / ɹ', name: 'Aproximante alveolar', type: 'consonant', category: 'Líquidas', exampleWord: 'red', exampleIpa: '/rɛd/', exampleTranslation: 'vermelho', descriptionPt: 'Som de "r" enrolado americano (língua recuada).' }
];
