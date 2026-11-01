import { useRef, useState } from 'react';
import { Check, ChefHat, MoveHorizontal, MoveVertical, RotateCcw, Sparkles } from 'lucide-react';
import PumpkinIcon from './PumpkinIcon';

type CutDirection = 'horizontal' | 'vertical';

const stations: Array<{
  ingredient: string;
  cut: string;
  instruction: string;
  hint: string;
  passesRequired: number;
  axis: CutDirection | 'grid';
}> = [
  {
    ingredient: 'Cenoura',
    cut: 'Julienne',
    instruction: 'Faça 2 passadas na horizontal: arraste da esquerda para a direita (← →).',
    hint: 'Arraste de um lado ao outro sobre a cenoura.',
    passesRequired: 2,
    axis: 'horizontal',
  },
  {
    ingredient: 'Aipo',
    cut: 'Brunoise',
    instruction: 'Faça 2 passadas na horizontal (← →) e depois 2 na vertical, de cima para baixo (↑ ↓).',
    hint: 'Faça duas passadas de um lado ao outro; depois, duas de cima para baixo.',
    passesRequired: 4,
    axis: 'grid',
  },
  {
    ingredient: 'Abóbora',
    cut: 'Cubos de 2 cm',
    instruction: 'Faça 2 passadas na horizontal (← →) e depois 2 na vertical, de cima para baixo (↑ ↓).',
    hint: 'Faça duas passadas de um lado ao outro; depois, duas de cima para baixo.',
    passesRequired: 4,
    axis: 'grid',
  },
];

function Ingredient({
  stationIndex,
  cuts,
  cutEffect,
  done,
  onStart,
  onEnd,
  onCancel,
  onKeyDown,
}: {
  stationIndex: number;
  cuts: { horizontal: number; vertical: number };
  cutEffect: { id: number; direction: CutDirection } | null;
  done: boolean;
  onStart: (event: React.PointerEvent<HTMLDivElement>) => void;
  onEnd: (event: React.PointerEvent<HTMLDivElement>) => void;
  onCancel: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  const station = stations[stationIndex]!;
  const isPumpkin = station.ingredient === 'Abóbora';
  const isCelery = station.ingredient === 'Aipo';
  const totalCuts = cuts.horizontal + cuts.vertical;
  const pieceRows = station.axis === 'horizontal' ? cuts.horizontal + 1 : station.axis === 'grid' ? cuts.horizontal + 1 : 1;
  const pieceColumns = station.axis === 'vertical' ? cuts.vertical + 1 : station.axis === 'grid' ? cuts.vertical + 1 : 1;

  return (
    <div className={`relative flex h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-[#98794f] bg-[#d8c29b] shadow-inner sm:h-52 lg:h-56 ${done ? 'cut-board-complete' : ''}`} aria-label="Tábua de corte">
      <div className="pointer-events-none absolute inset-2 rounded-lg border border-[#aa8c61]/50" />
      <div
        key={`ingredient-${cutEffect?.id ?? 0}`}
        role="button"
        tabIndex={0}
        aria-label={`Arraste sobre a ${station.ingredient} para fazer o corte`}
        onPointerDown={onStart}
        onPointerUp={onEnd}
        onPointerCancel={onCancel}
        onKeyDown={onKeyDown}
        className={`relative z-10 flex touch-none select-none items-center justify-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-burgundy-600 ${cutEffect ? 'cut-ingredient-shake' : ''} ${done ? 'cut-ingredient-complete' : ''} ${isPumpkin ? 'h-28 w-28 sm:h-36 sm:w-36' : 'h-14 w-[76%] sm:h-16 lg:h-[4.5rem]'} ${station.axis === 'horizontal' ? 'cursor-ew-resize' : station.axis === 'vertical' ? 'cursor-ns-resize' : 'cursor-crosshair'}`}
      >
        {cutEffect && <span key={`flash-${cutEffect.id}`} className="cut-flash pointer-events-none absolute inset-0 z-10 rounded-[inherit]" aria-hidden="true" />}
        {cutEffect && <span key={`knife-${cutEffect.id}`} className={`pointer-events-none absolute z-30 text-3xl drop-shadow-lg ${cutEffect.direction === 'horizontal' ? 'cut-knife-sweep-horizontal' : 'cut-knife-sweep-vertical'}`} aria-hidden="true">🔪</span>}
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${pieceRows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${pieceColumns}, minmax(0, 1fr))`,
            gap: totalCuts > 0 ? '4px' : '0px',
          }}
        >
          {Array.from({ length: pieceRows * pieceColumns }, (_, index) => (
            <span
              key={`${cutEffect?.id ?? 0}-${index}`}
              className={`cut-piece pointer-events-none block shadow-md ${cutEffect ? 'cut-piece-split' : ''} ${isPumpkin ? 'rounded-lg bg-gradient-to-br from-[#f5b34e] to-[#dc7a24]' : isCelery ? 'rounded-sm bg-gradient-to-br from-[#95ad70] to-[#68834f]' : 'rounded-full bg-gradient-to-br from-[#f9a342] to-[#e77820]'}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex justify-between text-[0.62rem] font-semibold uppercase tracking-wider text-[#755b3a]">
        <span>{station.ingredient}</span>
        <span>{Math.min(totalCuts, station.passesRequired)} {totalCuts === 1 ? 'passada' : 'passadas'}</span>
      </div>
      <div className="pointer-events-none absolute right-4 top-3 text-xs text-[#755b3a]/70" aria-hidden="true">✦</div>
      {done && <>
        <span className="cut-completion-spark pointer-events-none absolute left-[16%] top-[24%] z-30" aria-hidden="true">✦</span>
        <span className="cut-completion-spark cut-completion-spark-delay-1 pointer-events-none absolute right-[17%] top-[22%] z-30" aria-hidden="true">✧</span>
        <span className="cut-completion-spark cut-completion-spark-delay-2 pointer-events-none absolute bottom-[25%] left-[27%] z-30" aria-hidden="true">✧</span>
        <span className="cut-completion-spark cut-completion-spark-delay-3 pointer-events-none absolute bottom-[25%] right-[28%] z-30" aria-hidden="true">✦</span>
      </>}
    </div>
  );
}

export default function CuttingGame() {
  const [stationIndex, setStationIndex] = useState(0);
  const [cuts, setCuts] = useState({ horizontal: 0, vertical: 0 });
  const [cutEffect, setCutEffect] = useState<{ id: number; direction: CutDirection } | null>(null);
  const [message, setMessage] = useState('Arraste sobre o ingrediente para fazer o primeiro corte.');
  const [finished, setFinished] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const station = stations[stationIndex]!;
  const stationDone = station.axis === 'grid'
    ? cuts.horizontal >= 2 && cuts.vertical >= 2
    : cuts[station.axis] >= station.passesRequired;
  const assistedDirection: CutDirection = station.axis === 'vertical'
    ? 'vertical'
    : station.axis === 'grid' && cuts.horizontal >= 2 ? 'vertical' : 'horizontal';

  const registerCut = (direction: CutDirection) => {
    if (finished || stationDone) return;
    if (station.axis !== 'grid' && station.axis !== direction) {
      setMessage(station.hint);
      return;
    }

    const nextCuts = { ...cuts, [direction]: cuts[direction] + 1 };
    setCutEffect((current) => ({ id: (current?.id ?? 0) + 1, direction }));
    setCuts(nextCuts);
    const complete = station.axis === 'grid'
      ? nextCuts.horizontal >= 2 && nextCuts.vertical >= 2
      : nextCuts[station.axis] >= station.passesRequired;
    const totalNeeded = station.passesRequired;
    const totalMade = nextCuts.horizontal + nextCuts.vertical;
    setMessage(complete
      ? `✨ ${station.cut} pronto! Corte perfeito, chef!`
      : `Tchac! Mais uma passada — ${totalMade} de ${totalNeeded}.`);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (stationDone || finished) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) < 26) {
      setMessage('Arraste um pouco mais para registrar o corte.');
      return;
    }
    registerCut(Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      registerCut(assistedDirection);
    }
  };

  const resetGame = () => {
    setStationIndex(0);
    setCuts({ horizontal: 0, vertical: 0 });
    setCutEffect(null);
    setMessage('Arraste sobre o ingrediente para fazer o primeiro corte.');
    setFinished(false);
  };

  const advanceStation = () => {
    if (stationIndex === stations.length - 1) {
      setFinished(true);
      return;
    }
    setStationIndex((current) => current + 1);
    setCuts({ horizontal: 0, vertical: 0 });
    setCutEffect(null);
    setMessage('Arraste sobre o ingrediente para fazer o primeiro corte.');
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal-500">
        <span>{finished ? 'Bancada pronta' : `Ingrediente ${stationIndex + 1} de ${stations.length}`}</span>
        <span className="flex gap-1" aria-label={`${stationIndex} de ${stations.length} ingredientes cortados`}>
          {stations.map((item, index) => <span key={item.ingredient} className={`h-1.5 w-7 rounded-full ${index < stationIndex || finished ? 'bg-sage-600' : index === stationIndex ? 'bg-burgundy-500' : 'bg-ivory-300'}`} />)}
        </span>
      </div>

      {finished ? (
        <div className="mise-finale relative overflow-hidden rounded-2xl border border-gold-300 bg-gradient-to-br from-[#fffaf3] via-[#f5ead8] to-[#eee0c8] p-4 text-[#4a3928] shadow-soft" aria-live="polite">
          <Sparkles className="mise-finale-spark mise-finale-spark-left absolute left-4 top-5 h-5 w-5 text-gold-700" aria-hidden="true" />
          <Sparkles className="mise-finale-spark mise-finale-spark-right absolute right-4 top-8 h-4 w-4 text-gold-700" aria-hidden="true" />
          <div className="relative text-center">
            <div className="mise-finale-seal mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400 bg-gold-100 text-burgundy-800 shadow-inner">
              <ChefHat className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 font-display text-lg font-semibold text-burgundy-800"><Check className="h-5 w-5 text-gold-800" /> Mise en place concluído!</div>
            <p className="mt-1 text-sm">Sua bancada está pronta para o serviço.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['🥕 Julienne', '🌿 Brunoise', '🎃 Cubos'].map((item, index) => (
                <span key={item} style={{ animationDelay: `${index * 120}ms` }} className="mise-finale-item rounded-full border border-gold-300/80 bg-white/60 px-3 py-1.5 text-xs font-semibold text-charcoal-800 shadow-sm">{item}</span>
              ))}
            </div>
          </div>
          <button onClick={resetGame} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900"><RotateCcw className="h-4 w-4" /> Fazer de novo</button>
        </div>
      ) : (
        <>
          <p className="mb-3 flex items-center gap-1 text-sm font-semibold leading-relaxed text-charcoal-800"><span aria-hidden="true">{station.ingredient === 'Cenoura' ? '🥕' : station.ingredient === 'Aipo' ? '🌿' : <PumpkinIcon className="h-5 w-5" />}</span>{station.ingredient} · {station.cut}</p>
          <Ingredient
            stationIndex={stationIndex}
            cuts={cuts}
            cutEffect={cutEffect}
            done={stationDone}
            onStart={handlePointerDown}
            onEnd={handlePointerUp}
            onCancel={() => { pointerStart.current = null; }}
            onKeyDown={handleKeyDown}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="flex min-h-9 flex-1 items-center gap-2 rounded-lg bg-sage-100 px-2.5 py-2 text-xs font-semibold leading-snug text-sage-900" aria-live="polite">
              <Sparkles className="h-4 w-4 shrink-0 text-gold-700" />{message}
            </p>
            <span className="hidden shrink-0 items-center gap-1 text-charcoal-500 sm:flex" aria-hidden="true"><MoveHorizontal className="h-3.5 w-3.5" /><MoveVertical className="h-3.5 w-3.5" /></span>
          </div>
          <p className="mt-2 text-xs text-charcoal-500">{station.instruction}</p>
          {stationDone && (
            <button onClick={advanceStation} className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-burgundy-700 px-4 py-2.5 text-sm font-semibold text-ivory-50 transition hover:bg-burgundy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600">
              {stationIndex === stations.length - 1 ? 'Concluir preparo' : 'Próximo ingrediente'} <span aria-hidden="true" className="ml-2">→</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
