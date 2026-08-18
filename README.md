# ⚡ PHONETIC//CYBER — Transcrição Fonética IPA & Extensão Chrome Manifest V3

<div align="center">

![Cyberpunk IPA Decoder](https://img.shields.io/badge/PHONETIC%2F%2FCYBER-V3.0_MANIFEST_V3-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=black)
![React 19](https://img.shields.io/badge/React_19-05070F?style=for-the-badge&logo=react&logoColor=00f0ff)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite 6](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-ff007f?style=for-the-badge)

<p align="center">
  <strong>Estúdio Interativo de Pronúncia e Transcrição Fonética Internacional (IPA) com Geração Automatizada de Extensão para Google Chrome (Manifest V3).</strong>
</p>

</div>

---

## 🌌 Visão Geral

**PHONETIC//CYBER** é uma aplicação completa e moderna projetada para estudantes de idiomas, linguistas e poliglotas. Ela combina:
1. Um **Estúdio Web Interativo** com interface *Cyberpunk HUD* de alta precisão para decomposição fonética (IPA), divisão silábica, respelling fonético simplificado e tradução multilíngue.
2. Um **Gerador de Extensão Manifest V3 para Google Chrome**, permitindo exportar diretamente um pacote `.zip` pronto para carregar no navegador e traduzir textos com fonética flutuante em qualquer site.
3. Um **Simulador Virtual de Navegador**, permitindo testar a extensão em tempo real com modos de balão flutuante (*Tooltip*) e anotações fonéticas sobrepostas (*Ruby/Furigana*).
4. Uma **Tabela IPA Interativa** categorizada por vogais, ditongos e consoantes com áudio e guias articulatórios.
5. Um **Treinador de Flashcards de Pronúncia** com síntese de voz em câmera lenta e cálculo de retenção.

---

## ✨ Recursos Principais

### 🗣️ 1. Estúdio de Transcrição Fonética
- **Decomposição Token por Token**: Análise individual de cada palavra com seu respectivo IPA, respelling fonético e contagem de sílabas.
- **Múltiplos Idiomas Suportados**: Inglês Americano (US), Inglês Britânico (UK), Português (BR), Espanhol (ES), Francês (FR), Japonês (Romaji/Hiragana) e Mandarim (Pinyin).
- **Dicionário Offline & Heurística Fonética**: Algoritmo híbrido com base léxica de alta frequência e fallback fonológico para transcrição instantânea sem latência.
- **Síntese de Áudio com Modulação de Velocidade**:
  - `0.5x SLOW` — Para dissecar fonemas difíceis
  - `0.7x DECODE` — Para estudo articulatório detalhado
  - `1.0x NORM` — Velocidade de conversação natural
  - `1.25x HYPER` — Para treino de fluência e listening avançado

### 🧩 2. Extensão Chrome Manifest V3 Integrada
- **Geração e Download em 1 Clique (`.zip`)**: Cria o pacote completo da extensão contendo `manifest.json`, `background.js`, `content.js`, `content.css`, `popup.html`, `popup.js`, `popup.css`, `options.html` e ícones em alta resolução.
- **Tooltip Flutuante ao Selecionar Texto**: Selecione qualquer palavra ou frase em qualquer página da web para exibir instantaneamente o IPA, respelling, tradução e botão de reprodução de voz.
- **Popup Rápido e Página de Opções**: Permite definir idiomas padrão, tamanho de fonte, velocidade de áudio e modo de exibição.

### 🖥️ 3. Simulador de Navegador em Tempo Real
- Teste a experiência da extensão diretamente na aplicação web.
- Alternância dinâmica entre páginas simuladas (Artigo da Wikipedia, Notícia de Tecnologia, Tutorial de Idiomas).
- Modos de visualização:
  - **Balão Flutuante (Tooltip)**: Exibido próximo à seleção do mouse.
  - **Anotação Ruby / Interlinear**: Exibe o IPA diretamente acima de cada palavra no texto da página.

### 📊 4. Tabela IPA Interativa
- Mapeamento completo dos sons da língua inglesa e internacional:
  - Vogais curtas e longas (`/iː/`, `/ɪ/`, `/æ/`, `/ɑː/`, `/ɔː/`, etc.)
  - Ditongos (`/aɪ/`, `/eɪ/`, `/aʊ/`, `/ɔɪ/`, etc.)
  - Consoantes Oclusivas, Fricativas, Africadas e Nasais (`/θ/`, `/ð/`, `/ʃ/`, `/ʒ/`, `/ŋ/`, etc.)
- Exemplo prático de palavras e guia articulatório (posição da língua e lábios) com reprodução de áudio.

### 🧠 5. Treinador de Flashcards
- Salve qualquer palavra do estúdio para a sua biblioteca de prática.
- Teste a pronúncia e compare com o gabarito fonético.
- Acompanhamento de pontuação e métricas de desempenho em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com paleta Cyberpunk Dark/Neon
- **Animações & Ícones**: [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)
- **Manipulação de Arquivos & Zip**: [JSZip](https://stuk.github.io/jszip/)
- **Síntese de Voz**: Web Speech API (`speechSynthesis`)
- **Backend / Dev Server**: [Express](https://expressjs.com/), [Vite](https://vitejs.dev/), [TSX](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/)
- **Extensão**: Padrão Google Chrome **Manifest V3**

---

## 📂 Estrutura do Projeto

```text
├── public/                     # Assets estáticos e ícones
├── src/
│   ├── components/             # Componentes modulares da interface
│   │   ├── ChromeSimulator.tsx # Simulador visual do Chrome com injeção de Tooltip
│   │   ├── ExtensionExporter.tsx# Visualizador de arquivos da extensão e download .zip
│   │   ├── FlashcardTrainer.tsx# Sistema de treino de pronúncia com repetição
│   │   ├── IpaChartModal.tsx   # Tabela periódica interativa de fonemas IPA
│   │   ├── Navbar.tsx          # Barra de navegação Cyberpunk com status HUD
│   │   └── PhoneticStudio.tsx  # Estúdio principal de transcrição e áudio
│   ├── data/
│   │   └── ipaDictionary.ts    # Base léxica de palavras, IPA, respelling e fonemas
│   ├── utils/
│   │   ├── extensionCodeGenerator.ts # Gerador do código-fonte do Manifest V3 e empacotador ZIP
│   │   └── phoneticEngine.ts   # Motor de transcrição fonética e síntese de voz
│   ├── types.ts                # Definições de tipos TypeScript
│   ├── App.tsx                 # Componente raiz da aplicação
│   ├── main.tsx                # Ponto de entrada do React
│   └── index.css               # Estilos globais e utilitários Cyberpunk
├── metadata.json               # Metadados da aplicação
├── package.json                # Dependências e scripts npm
├── server.ts                   # Servidor Express com integração Vite
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configuração do Vite e plugins
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18.0 ou superior
- Gerenciador de pacotes `npm` ou `yarn`

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/phonetic-translate-cyber.git
   cd phonetic-translate-cyber
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no seu navegador em `http://localhost:3000`.

4. **Para gerar o build de produção:**
   ```bash
   npm run build
   ```

5. **Para iniciar a versão de produção:**
   ```bash
   npm start
   ```

---

## 📦 Como Instalar a Extensão no Google Chrome / Edge / Brave

1. Abra a aplicação web e clique no botão **`DOWNLOAD .ZIP`** (ou acesse a aba **Código da Extensão** e clique em *Baixar Pacote .ZIP Completo*).
2. Descompacte o arquivo `.zip` baixado em uma pasta no seu computador (por exemplo: `Downloads/phonetic-translate-extension`).
3. Abra seu navegador baseado em Chromium (Google Chrome, Microsoft Edge, Brave, Opera):
   - No Chrome: acesse `chrome://extensions/`
   - No Edge: acesse `edge://extensions/`
   - No Brave: acesse `brave://extensions/`
4. No canto superior direito, ative a opção **Modo do desenvolvedor** (*Developer mode*).
5. Clique no botão **Carregar sem compactação** (*Load unpacked*).
6. Selecione a pasta descompactada que contém o arquivo `manifest.json`.
7. **Pronto!** O ícone da extensão aparecerá na sua barra de extensões. Agora você pode:
   - Clicar no ícone para abrir o popup e transcrever qualquer palavra.
   - Selecionar qualquer texto em qualquer página da web para ver o balão com a transcrição fonética IPA e ouvir a pronúncia correta.

---

## 📄 Licença

Este projeto é distribuído sob a licença **Apache 2.0**. Consulte o arquivo de licença para mais detalhes.

---

<div align="center">
  <sub>Construído com foco em precisão linguística, alta performance e design futurista.</sub>
</div>
