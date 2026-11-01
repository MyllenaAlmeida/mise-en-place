# Mise en Place Reader 📚

Um leitor de e-books elegante e confortável em React, projetado especificamente para a fanfic de romance "Mise en Place" de littleslightlymad. O design combina a atmosfera aconchegante de uma cozinha gastronômica com o romantismo da história.

## 🎨 Identidade Visual

### Paleta de Cores
- **Wine (Vinho/Bordô)**: Tons quentes e sofisticados para acentos e botões
- **Cream (Creme/Marfim)**: Fundo suave e acolhedor
- **Copper (Cobre/Terracota)**: Detalhes e destaques
- **Sage (Sálvia/Verde)**: Toques sutis de natureza

### Tipografia
- **Merriweather**: Fonte serifada clássica para o corpo do texto de leitura
- **Playfair Display**: Fonte display elegante para títulos
- **Inter**: Fonte sans-serif moderna para interface e menus

### Elementos Visuais
- Sidebar organizada como "Carte du Jour" (menu de restaurante)
- Ícones sutis de utensílios de cozinha
- Divisores de capítulo minimalistas em estilo culinário

## ✨ Funcionalidades

### Leitor de Capítulos
- ✅ Capítulos pré-extraídos e organizados do EPUB original
- ✅ Renderização limpa do texto com suporte a temas
- ✅ Três temas de leitura: Claro/Creme, Sepia e Noturno (Jantar à Luz de Velas)
- ✅ Ajustes de leitura personalizáveis:
  - Tamanho da fonte (12px - 24px)
  - Espaçamento entre linhas (1.2 - 2.0)
  - Largura do contêiner (400px - 900px)

### Navegação & Organização
- ✅ Sidebar retrátil com lista dos Chapters 1-13
- ✅ Indicador de progresso de leitura (barra de progresso superior)
- ✅ Persistência do último capítulo lido via `localStorage`
- ✅ Navegação por teclado (setas ← → e Espaço)

### Experiência de Leitura
- ✅ Interface responsiva (mobile-first)
- ✅ Design totalmente adaptável para desktop e dispositivos móveis
- ✅ Acessibilidade básica (contrastes, ARIA, navegação por teclado)

## 📚 Conteúdo

A fanfic "Mise en Place" contém:
- **Preface**: Introdução
- **Chapters 1-13**: História principal
  - Chapter 1: Raízes e Memórias
  - Chapter 2: O fio da faca
  - Chapter 3: Recomeço
  - Chapter 4: Fogo Brando
  - Chapter 5: Confraternizar
  - Chapter 6: Fora do Menu
  - Chapter 7: Bala Juquinha
  - Chapter 8: Respiração Quadrada
  - Chapter 9: Habeas Copos
  - Chapter 10: After
  - Chapter 11: Um Dia de Cada Vez
  - Chapter 12: Pensamentos
  - Chapter 13: Tulipas Brancas
- **Afterword**: Conclusão

## 🛠️ Tecnologias

- **React 18** com TypeScript (Modo Estrito)
- **Vite** como build tool
- **Tailwind CSS** para estilização
- **Google Fonts** (Merriweather, Playfair Display, Inter)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. **Clone o repositório** (se aplicável) ou navegue até a pasta do projeto:
```bash
cd mise-en-place-reader
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

4. **Abra o navegador**:
A aplicação estará disponível em `http://localhost:5173`

## 📖 Como Usar

### Leitura da Fanfic

1. Abra a aplicação no navegador
2. A fanfic "Mise en Place" já está carregada automaticamente
3. **Sidebar**: Clique no menu (☰) no canto superior esquerdo para ver a lista de capítulos
4. **Capítulos**: Clique em qualquer capítulo na sidebar para navegar
5. **Setas do Teclado**: Use ← e → para navegar entre capítulos
6. **Barra de Espaço**: Avança para o próximo capítulo
7. **Botões de Navegação**: Use as setas na parte inferior da tela

### Configurações de Leitura

1. Clique no ícone de engrenagem (⚙️) no canto superior direito
2. **Tema**: Escolha entre Claro, Sepia ou Noturno
3. **Tamanho da Fonte**: Ajuste o slider (12px - 24px)
4. **Espaçamento**: Ajuste o espaçamento entre linhas (1.2 - 2.0)
5. **Largura**: Ajuste a largura do contêiner de leitura (400px - 900px)
6. Clique em "Concluir" para salvar as configurações

### Progresso de Leitura

- A barra de progresso no topo mostra sua posição atual no livro
- O progresso é salvo automaticamente no `localStorage`
- Ao recarregar a página, você continuará de onde parou

## 🏗️ Estrutura do Projeto

```
mise-en-place-reader/
├── src/
│   ├── chapters/            # Capítulos extraídos do EPUB
│   │   ├── metadata.json   # Metadados do livro e capítulos
│   │   ├── 00-preface.html
│   │   ├── 01-chapter-1.html
│   │   ├── 02-chapter-2.html
│   │   └── ... (até 13-afterword.html)
│   ├── components/          # Componentes reutilizáveis de UI
│   │   ├── Button.tsx       # Botão reutilizável
│   │   ├── ChapterViewer.tsx # Visualizador de capítulos
│   │   ├── SettingsPanel.tsx # Painel de configurações
│   │   └── Sidebar.tsx      # Sidebar com lista de capítulos
│   ├── hooks/               # Custom hooks
│   │   ├── useChapters.ts   # Hook para carregar capítulos
│   │   ├── useLocalStorage.ts # Hook para localStorage
│   │   └── useTheme.ts      # Hook para gerenciamento de temas
│   ├── types/               # Interfaces TypeScript
│   │   └── index.ts         # Definições de tipos
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais + Tailwind
├── public/
│   └── chapters/           # Capítulos servidos estaticamente
├── scripts/                 # Scripts de extração
│   ├── extract-epub.cjs     # Script para extrair EPUB
│   └── organize-chapters.cjs # Script para organizar capítulos
├── index.html               # HTML template
├── package.json             # Dependências
├── tailwind.config.js       # Configuração do Tailwind
├── tsconfig.json            # Configuração do TypeScript
└── vite.config.ts           # Configuração do Vite
```

## 🎯 Padrões de Código

- **Componentes Funcionais**: Todos os componentes são funções com hooks
- **Responsabilidade Única**: Cada componente tem uma única responsabilidade
- **Custom Hooks**: Lógica de negócio separada da renderização
- **TypeScript Strict**: Tipagem rigorosa em todo o código
- **Mobile-First**: Design responsivo priorizando dispositivos móveis
- **Acessibilidade**: Suporte a navegação por teclado e marcas ARIA

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
```

## 📝 Notas de Desenvolvimento

### Temas de Leitura

- **Claro**: Fundo creme suave, texto vinho escuro - ideal para leitura diurna
- **Sepia**: Fundo âmbar, texto âmbar escuro - estética clássica de papel antigo
- **Noturno**: Fundo escuro, texto claro - confortável para leitura noturna

### Persistência de Dados

- Configurações de leitura são salvas em `localStorage` como `readerSettings`
- Progresso de leitura é salvo como `miseEnPlaceProgress`
- O tema também é persistido separadamente como `theme`

### Extração de Capítulos

Os capítulos foram extraídos do EPUB original usando os scripts em `scripts/`:
1. `extract-epub.cjs`: Extrai o conteúdo do EPUB para o diretório temporário
2. `organize-chapters.cjs`: Organiza os capítulos em HTML limpo e estruturado

## 🤝 Contribuindo

Este é um projeto pessoal para leitura da fanfic "Mise en Place". Sinta-se à vontade para forkar e adaptar para suas próprias necessidades de leitura.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🙏 Agradecimentos

- **Fanfic**: "Mise en Place" por littleslightlymad
- Desenvolvido com React, TypeScript e Tailwind CSS
- Inspirado na atmosfera gastronômica e romântica de "Mise en Place"

---

**Mise en Place Reader** - Leitura confortável, elegante e deliciosa. 🍷📖
