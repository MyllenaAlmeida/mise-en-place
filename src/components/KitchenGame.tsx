import { useState } from 'react';
import { Check, ChefHat, RotateCcw } from 'lucide-react';
import type { ReaderSettings } from '../types';
import CuttingGame from './CuttingGame';

const questions = [
  {
    prompt: 'A cenoura precisa virar tiras de 3 mm por 5 cm. Qual corte a chef pediu?',
    options: ['Julienne', 'Brunoise', 'Rondelle'],
    answer: 'Julienne',
    detail: 'Isso: julienne forma tiras finas e compridas, como as que Lorena pediu para a cenoura.',
    hint: 'Pense em palitos finos e compridos.',
  },
  {
    prompt: 'Agora o aipo: Lorena quer cubinhos regulares de apenas 2 mm. Qual é o corte?',
    options: ['Macédoine', 'Brunoise', 'Julienne'],
    answer: 'Brunoise',
    detail: 'Perfeito. Brunoise são cubinhos pequenos; no teste, cada lado deveria ter 2 mm.',
    hint: 'É o menor dos cortes em cubos desta lista.',
  },
  {
    prompt: 'A prova também avalia o cuidado com os ingredientes. Para onde vão cascas e talos?',
    options: ['Para o lixo comum', 'Para a cuba de inox, para fazer fundo', 'Direto para o prato'],
    answer: 'Para a cuba de inox, para fazer fundo',
    detail: 'Aprovada na bancada! No Racine, as aparas viram base para outros preparos.',
    hint: 'Na cozinha do Racine, nada de bom vai para o lixo comum.',
  },
];

function ChefQuiz() {
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [answered, setAnswered] = useState(false);
  const finished = questionIndex === questions.length;
  const question = questions[questionIndex];

  const startGame = () => {
    setQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setMessage('');
  };

  const chooseAnswer = (answer: string) => {
    if (!question || answered) return;
    if (answer === question.answer) {
      setScore((current) => current + 1);
      setAnswered(true);
      setMessage(question.detail);
    } else {
      setMessage(question.hint);
    }
  };

  const nextQuestion = () => {
    setQuestionIndex((current) => current + 1);
    setAnswered(false);
    setMessage('');
  };

  if (questionIndex < 0) {
    return (
      <div>
        <p className="text-sm leading-relaxed text-charcoal-600">Responda três situações do teste de Eduarda e mostre que conhece os cortes e o aproveitamento dos ingredientes.</p>
        <button onClick={startGame} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-burgundy-700 px-4 py-2.5 text-sm font-semibold text-ivory-50 transition hover:bg-burgundy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600"><ChefHat className="h-4 w-4" /> Começar prova</button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="rounded-xl bg-sage-100 p-4 text-sage-900">
        <div className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5" /> Serviço aprovado!</div>
        <p className="mt-1 text-sm">Você acertou {score} de {questions.length} etapas.</p>
        <button onClick={startGame} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900"><RotateCcw className="h-4 w-4" /> Refazer prova</button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal-500">
        <span>Etapa {questionIndex + 1} de {questions.length}</span>
        <span>{score} {score === 1 ? 'ponto' : 'pontos'}</span>
      </div>
      <div className="mb-4 flex gap-1.5" aria-label={`${questionIndex} de ${questions.length} etapas concluídas`}>
        {questions.map((item, index) => <span key={item.prompt} className={`h-1.5 flex-1 rounded-full ${index < questionIndex ? 'bg-sage-600' : index === questionIndex ? 'bg-burgundy-500' : 'bg-ivory-300'}`} />)}
      </div>
      <p className="text-sm font-semibold leading-relaxed text-charcoal-800">{question.prompt}</p>
      <div className="mt-3 grid gap-2">
        {question.options.map((option) => (
          <button key={option} onClick={() => chooseAnswer(option)} disabled={answered} className={`rounded-xl border px-4 py-2.5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 ${answered && option === question.answer ? 'border-sage-400 bg-sage-100 font-semibold text-sage-900' : 'border-ivory-300 bg-white text-charcoal-800 hover:border-burgundy-400 hover:bg-ivory-100 disabled:cursor-default disabled:hover:border-ivory-300 disabled:hover:bg-white'}`}>
            {option}
          </button>
        ))}
      </div>
      <p className={`mt-3 min-h-5 text-xs leading-relaxed ${answered ? 'text-sage-800' : 'text-charcoal-600'}`} aria-live="polite">{message}</p>
      {answered && (
        <button onClick={nextQuestion} className="mt-2 inline-flex min-h-10 items-center justify-center rounded-xl bg-burgundy-700 px-4 py-2 text-sm font-semibold text-ivory-50 transition hover:bg-burgundy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600">
          {questionIndex === questions.length - 1 ? 'Ver resultado' : 'Próxima etapa'} <span aria-hidden="true" className="ml-2">→</span>
        </button>
      )}
    </div>
  );
}

export default function KitchenGame({ theme }: { theme: ReaderSettings['theme'] }) {
  const [mode, setMode] = useState<'cuts' | 'quiz'>('cuts');
  const surface = theme === 'dark' ? 'border-[#5b4e40] bg-[#393128]' : theme === 'sepia' ? 'border-amber-300 bg-[#f5ead8]' : 'border-[#e4d3bf] bg-[#fbf4eb]';
  const softSurface = theme === 'dark' ? 'bg-[#312a23]' : theme === 'sepia' ? 'bg-[#eddfc9]' : 'bg-[#f1e6d9]';
  const selectedTab = theme === 'dark' ? 'bg-[#493e33] text-[#f0e5d3]' : theme === 'sepia' ? 'bg-[#fbf4eb] text-burgundy-800' : 'bg-[#fffaf3] text-burgundy-800';
  const inactiveTab = theme === 'dark' ? 'text-[#c9baa5] hover:text-[#f0e5d3]' : 'text-charcoal-600 hover:text-charcoal-900';

  return (
    <section className={`relative w-full min-w-0 overflow-hidden rounded-2xl border p-4 text-left shadow-elegant sm:rounded-3xl sm:p-6 lg:h-full lg:p-7 ${surface}`} aria-labelledby="kitchen-game-title">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-200/50" aria-hidden="true" />
      <div className="relative">
        <div className="mb-4">
          <div>
            <h2 id="kitchen-game-title" className={`font-display text-xl font-semibold leading-tight ${theme === 'dark' ? 'text-[#f0e5d3]' : 'text-[#45372a]'}`}>Bancada da chef Lorena</h2>
          </div>
        </div>

        <div className={`mb-4 grid grid-cols-2 gap-1 rounded-xl p-1 ${softSurface}`} role="tablist" aria-label="Modo do desafio">
          <button id="tab-cuts" role="tab" aria-selected={mode === 'cuts'} aria-controls="panel-cuts" onClick={() => setMode('cuts')} className={`rounded-lg px-2.5 py-2.5 text-left transition sm:px-3 ${mode === 'cuts' ? `${selectedTab} shadow-soft` : inactiveTab}`}>
            <span className="block text-sm font-semibold">Fazer os cortes</span>
            <span className="mt-1 block text-[0.68rem] font-normal leading-snug opacity-80">Arraste a faca para praticar julienne, brunoise e cubos.</span>
          </button>
          <button id="tab-quiz" role="tab" aria-selected={mode === 'quiz'} aria-controls="panel-quiz" onClick={() => setMode('quiz')} className={`rounded-lg px-2.5 py-2.5 text-left transition sm:px-3 ${mode === 'quiz' ? `${selectedTab} shadow-soft` : inactiveTab}`}>
            <span className="block text-sm font-semibold">Prova da chef</span>
            <span className="mt-1 block text-[0.68rem] font-normal leading-snug opacity-80">Responda a três situações e descubra sua pontuação.</span>
          </button>
        </div>

        <div id={`panel-${mode}`} role="tabpanel" aria-labelledby={`tab-${mode}`}>
          {mode === 'cuts' ? (
            <>
              <p className={`mb-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-[#c9baa5]' : 'text-charcoal-600'}`}>Arraste a faca sobre cada ingrediente para cortá-lo. Complete o preparo de cenoura, aipo e abóbora.</p>
              <CuttingGame />
            </>
          ) : <ChefQuiz />}
        </div>
      </div>
    </section>
  );
}
