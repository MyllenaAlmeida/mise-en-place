import type { ReaderSettings } from '../types';
import CuttingGame from './CuttingGame';

export default function KitchenGame({ theme }: { theme: ReaderSettings['theme'] }) {
  const surface = theme === 'dark' ? 'border-[#68434a] bg-[#332126]' : theme === 'sepia' ? 'border-amber-300 bg-[#f5ead8]' : 'border-[#e4d3bf] bg-[#fbf4eb]';

  return (
    <section className={`relative w-full min-w-0 overflow-hidden rounded-2xl border p-4 text-left shadow-elegant sm:rounded-3xl sm:p-6 lg:h-full lg:p-7 ${surface}`} aria-labelledby="kitchen-game-title">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-200/50" aria-hidden="true" />
      <div className="relative">
        <div className="mb-4">
          <div>
            <h2 id="kitchen-game-title" className={`font-display text-xl font-semibold leading-tight ${theme === 'dark' ? 'text-[#f0e5d3]' : 'text-[#45372a]'}`}>Bancada da chef Lorena</h2>
          </div>
        </div>

        <p className={`mb-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-[#c9baa5]' : 'text-charcoal-600'}`}>Arraste o mouse ou o dedo sobre o ingrediente, na direção indicada. No teclado, pressione Enter ou Espaço quando o ingrediente estiver selecionado.</p>
        <CuttingGame />
      </div>
    </section>
  );
}
