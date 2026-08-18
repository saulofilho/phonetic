import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Phonetic Translation & Deep IPA Analysis Endpoint
app.post('/api/phonetic/analyze', async (req, res) => {
  try {
    const { text, sourceLang = 'en', targetLang = 'pt', notation = 'ipa' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Campo "text" obrigatório.' });
    }

    const trimmed = text.trim();
    if (trimmed.length > 2000) {
      return res.status(400).json({ error: 'Texto muito longo (máx. 2000 caracteres).' });
    }

    // Call Gemini 3.7 Flash with structured JSON output
    const prompt = `Você é um linguista e foneticista especialista.
Analise o texto fornecido ("${trimmed}"), transcreva a pronúncia exata no Alfabeto Fonético Internacional (IPA) padrão (por exemplo com marcações de acento primário ˈ e secundário ˌ, divisão silábica clara, vogais e consoantes exatas), faça a tradução para o idioma de destino (${targetLang}), decomponha palavra por palavra com fonética e tradução individual, explique as peculiaridades da pronúncia (letras mudas, vogais reduzidas como schwa /ə/, linking/liaison, aspiração) e liste palavras que rimam ou homófonos se houver.

Texto de Entrada: "${trimmed}"
Idioma de Origem: ${sourceLang}
Idioma de Destino: ${targetLang}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um motor de fonética e tradução multilíngue de alta precisão.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: {
              type: Type.STRING,
              description: 'Tradução completa e natural do texto de entrada.',
            },
            sourceIpa: {
              type: Type.STRING,
              description: 'Transcrição fonética IPA completa do texto de origem entre barras (ex: /fəˈnɛtɪk trænˈskrɪpʃən/).',
            },
            targetIpa: {
              type: Type.STRING,
              description: 'Transcrição fonética IPA do texto traduzido se aplicável.',
            },
            syllableBreakdown: {
              type: Type.STRING,
              description: 'Separação silábica visual com pontos ou traços (ex: pho · net · ic | tran · scrip · tion).',
            },
            simplifiedRespell: {
              type: Type.STRING,
              description: 'Transcrição fonética simplificada e intuitiva (ex: fuh-NET-ik tran-SKRIP-shun).',
            },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  ipa: { type: Type.STRING },
                  syllables: { type: Type.STRING },
                  stress: { type: Type.STRING, description: 'Posição do acento tônico (ex: 1ª sílaba, 2ª sílaba)' },
                  translation: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  notes: { type: Type.STRING, description: 'Dica específica desta palavra (ex: "th" desvozeado)' },
                },
                required: ['original', 'ipa', 'translation'],
              },
            },
            pronunciationNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de 2 a 4 dicas cruciais de pronúncia e fonética para falantes nativos de português.',
            },
            homophones: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Pares mínimos ou palavras de som idêntico/parecido.',
            },
          },
          required: ['translatedText', 'sourceIpa', 'words', 'pronunciationNotes'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      id: `res_${Date.now()}`,
      sourceText: trimmed,
      sourceLang,
      targetLang,
      translatedText: parsed.translatedText || '',
      sourceIpa: parsed.sourceIpa || '',
      targetIpa: parsed.targetIpa || '',
      syllableBreakdown: parsed.syllableBreakdown || '',
      simplifiedRespell: parsed.simplifiedRespell || '',
      words: parsed.words || [],
      pronunciationNotes: parsed.pronunciationNotes || [],
      homophones: parsed.homophones || [],
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Erro na transcrição Gemini:', error);
    // Fallback response with meaningful structured structure
    const fallbackText = req.body.text || '';
    const words = fallbackText.split(/\s+/).map((w: string) => ({
      original: w,
      ipa: `/${w.toLowerCase().replace(/tion/g, 'ʃən').replace(/ph/g, 'f')}/`,
      syllables: w,
      translation: `[${w}]`,
      stress: '1ª sílaba'
    }));

    return res.json({
      id: `res_fallback_${Date.now()}`,
      sourceText: fallbackText,
      sourceLang: req.body.sourceLang || 'en',
      targetLang: req.body.targetLang || 'pt',
      translatedText: `Tradução: ${fallbackText}`,
      sourceIpa: `/${words.map((w: any) => w.ipa.replace(/\//g, '')).join(' ')}/`,
      syllableBreakdown: words.map((w: any) => w.original).join(' · '),
      simplifiedRespell: fallbackText.toUpperCase(),
      words,
      pronunciationNotes: [
        'Acento tônico indicado por ˈ antes da sílaba com maior intensidade.',
        'Sons vocálicos em inglês usam símbolos específicos do IPA (ex: /æ/, /ɪ/, /ʊ/).'
      ],
      homophones: [],
      timestamp: Date.now(),
      isFallback: true
    });
  }
});

// Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhoneticTranslate Server running on port ${PORT}`);
  });
}

startServer();
