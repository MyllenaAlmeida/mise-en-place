import { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Flower2, Heart, X } from 'lucide-react';
import type { ReaderSettings } from '../types';

const recipes = [
  {
    title: 'Bolo de fubá com erva-doce',
    note: 'O bolo que perfuma a casa inteira. Fica ainda melhor com café passado na hora.',
    time: '50 min',
    yield: '10 fatias',
    ingredients: ['2 xícaras de fubá', '1 xícara de farinha de trigo', '2 xícaras de açúcar', '3 ovos', '1 xícara de leite', '½ xícara de óleo', '1 colher (sopa) de fermento', '1 colher (chá) de erva-doce'],
    steps: ['Aqueça o forno a 180 °C e unte uma forma com manteiga e fubá.', 'Bata os ovos, o leite, o óleo e o açúcar. Junte o fubá e a farinha aos poucos.', 'Misture a erva-doce e, por último, incorpore o fermento sem bater demais.', 'Asse por 35 a 40 minutos, até dourar e o palito sair limpo. Espere amornar antes de desenformar.'],
    memory: 'Se quiser uma casquinha dourada, polvilhe um pouquinho de açúcar na forma.',
  },
  {
    title: 'Cogumelos cremosos da mamãe',
    note: 'Um prato quentinho para os dias em que o coração pede um abraço.',
    time: '30 min',
    yield: '4 porções',
    ingredients: ['400 g de cogumelos Paris e shiitake fatiados', '1 colher (sopa) de manteiga', '½ cebola picadinha', '1 dente de alho amassado', '½ xícara de creme de leite', '1 colher (chá) de mostarda', 'Salsinha, sal e pimenta-do-reino', 'Arroz branco para acompanhar'],
    steps: ['Derreta a manteiga numa frigideira e refogue a cebola até ficar macia. Junte o alho.', 'Acrescente os cogumelos e deixe dourar, mexendo só de vez em quando para não soltarem água demais.', 'Abaixe o fogo, misture a mostarda e o creme de leite. Tempere com sal e pimenta.', 'Desligue assim que o molho ficar cremoso. Salpique salsinha e sirva com arroz feito na hora.'],
    memory: 'Minha Duda, quando o dia pesar, lembra: sempre vai ter um prato quentinho e um lugar à mesa te esperando. Te amo, mãe.',
  },
  {
    title: 'Frango ensopado com batatas',
    note: 'Comida de domingo, feita sem pressa e com bastante molho para acompanhar o arroz.',
    time: '1 h',
    yield: '4 porções',
    ingredients: ['1 kg de frango em pedaços', '4 batatas médias em cubos grandes', '1 cebola picada', '2 dentes de alho amassados', '2 tomates maduros picados', '1 colher (sopa) de colorau', '2 xícaras de água quente', 'Cheiro-verde, sal e pimenta'],
    steps: ['Tempere o frango com sal e pimenta. Doure os pedaços numa panela com um fio de óleo.', 'Junte a cebola e o alho e refogue até ficarem macios. Acrescente o tomate e o colorau.', 'Adicione a água quente, tampe parcialmente e cozinhe em fogo baixo por 25 minutos.', 'Coloque as batatas e cozinhe por mais 20 minutos, até ficarem macias. Finalize com cheiro-verde.'],
    memory: 'A água deve quase cobrir o frango. Se o molho secar antes da hora, ponha mais um pouquinho.',
  },
  {
    title: 'Arroz de forno da família',
    note: 'A receita boa para aproveitar o arroz que sobrou e juntar todo mundo em volta da mesa.',
    time: '40 min',
    yield: '6 porções',
    ingredients: ['3 xícaras de arroz cozido', '1 cenoura ralada', '1 xícara de ervilhas', '150 g de presunto em cubinhos', '1 lata de milho escorrido', '1 copo de requeijão', '1 xícara de muçarela ralada', 'Azeitonas e cheiro-verde a gosto'],
    steps: ['Aqueça o forno a 200 °C. Numa tigela, misture o arroz, a cenoura, as ervilhas, o milho e o presunto.', 'Junte o requeijão e o cheiro-verde. Prove e acerte o sal.', 'Passe a mistura para um refratário untado e cubra com a muçarela e algumas azeitonas.', 'Leve ao forno por 20 minutos, até aquecer bem e gratinar por cima.'],
    memory: 'Milho, ervilha, frango desfiado: pode usar o que tiver na geladeira. Cozinha de casa é assim.',
  },
  {
    title: 'Bolinho de chuva com canela',
    note: 'Para tardes chuvosas, conversa comprida e uma travessa no meio da mesa.',
    time: '30 min',
    yield: 'cerca de 20',
    ingredients: ['2 ovos', '½ xícara de açúcar', '1 xícara de leite', '2½ xícaras de farinha de trigo', '1 colher (sopa) de fermento', 'Óleo para fritar', 'Açúcar e canela para passar'],
    steps: ['Misture os ovos e o açúcar. Acrescente o leite e, aos poucos, a farinha até formar uma massa espessa.', 'Incorpore o fermento delicadamente. A massa deve cair da colher sem ficar líquida.', 'Frite colheradas em óleo quente, poucas de cada vez, virando para dourar por igual.', 'Escorra em papel-toalha e passe ainda mornos na mistura de açúcar e canela.'],
    memory: 'O óleo não pode estar fumegando: bolinho dourado por fora e cru por dentro não vale.',
  },
];

type Turn = { id: number; direction: 'next' | 'previous' } | null;

export default function VioletaNotebook({ theme }: { theme: ReaderSettings['theme'] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [mobileSide, setMobileSide] = useState<'ingredients' | 'method'>('ingredients');
  const [turn, setTurn] = useState<Turn>(null);
  const recipe = recipes[recipeIndex]!;
  const dark = theme === 'dark';
  const muted = dark ? 'text-[#6f5a45]' : 'text-[#80694e]';

  const flipTo = (direction: 'next' | 'previous', update: () => void) => {
    update();
    setTurn((current) => ({ id: (current?.id ?? 0) + 1, direction }));
  };

  const changeRecipe = (direction: 'next' | 'previous') => {
    const nextIndex = direction === 'next' ? recipeIndex + 1 : recipeIndex - 1;
    if (nextIndex < 0 || nextIndex >= recipes.length) return;
    flipTo(direction, () => {
      setRecipeIndex(nextIndex);
      setMobileSide('ingredients');
    });
  };

  const changeMobileSide = () => {
    flipTo('next', () => setMobileSide((side) => side === 'ingredients' ? 'method' : 'ingredients'));
  };

  const pageStyle = 'violeta-aged-paper violeta-ink bg-[#fffaf0]';

  return (
    <section className={`rounded-3xl border p-4 shadow-soft sm:p-6 ${dark ? 'border-[#5b4e40] bg-[#393128]' : theme === 'sepia' ? 'border-amber-300 bg-[#f5ead8]' : 'border-[#e4d3bf] bg-[#fbf4eb]'}`} aria-labelledby="violeta-notebook-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${dark ? 'text-[#e8c986]' : 'text-burgundy-700'}`}>Memórias à mesa</p>
          <h2 id="violeta-notebook-heading" className={`mt-1 font-display text-2xl font-semibold ${dark ? 'text-[#f0e5d3]' : 'text-charcoal-900'}`}>Caderno de receitas da Violeta</h2>
          <p className={`mt-1 max-w-2xl text-sm leading-relaxed ${dark ? 'text-[#c9baa5]' : 'text-charcoal-600'}`}>Receitas simples, anotações de mãe e lembranças que Eduarda carrega para a cozinha.</p>
        </div>
        {isOpen && (
          <button type="button" onClick={() => { setIsOpen(false); setTurn(null); }} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${dark ? 'border-[#80683d] text-[#e8c986] hover:bg-[#493e33]' : 'border-[#d7c1a1] text-burgundy-800 hover:bg-[#f3e6d9]'}`}>
            <X className="h-4 w-4" /> Fechar caderno
          </button>
        )}
      </div>

      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} aria-expanded="false" className="group mx-auto block w-full max-w-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-700">
          <div className="relative aspect-[1.32/1] rounded-[1.4rem] bg-gradient-to-br from-[#70452d] via-[#8a5936] to-[#51331f] p-3 shadow-[0_18px_35px_rgba(55,34,20,0.3)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
            <div className="absolute inset-y-3 left-2 w-7 rounded-l-lg border-r border-[#c5a66a]/70 bg-gradient-to-r from-[#39261d] via-[#60402a] to-[#855b3a] shadow-inner" aria-hidden="true" />
            <div className="relative ml-6 flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#d0b578]/80 bg-gradient-to-br from-[#875a39] via-[#75472e] to-[#613b29] px-5 text-center text-[#f2dfb6] shadow-inner">
              <div className="absolute inset-2 rounded-lg border border-[#d0b578]/35" aria-hidden="true" />
              <Flower2 className="relative h-7 w-7 text-[#d7bd83]" strokeWidth={1.2} aria-hidden="true" />
              <span className="violeta-handwriting relative mt-2 text-3xl leading-none sm:text-4xl">Receitas da Violeta</span>
              <span className="violeta-handwriting relative mt-2 text-xl text-[#e5d2ac]">com carinho, para Eduarda</span>
              <span className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-[#d0b578]/45 bg-black/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#f2dfb6] transition-colors group-hover:bg-black/20">
                <BookOpen className="h-3.5 w-3.5" /> Clique para abrir
              </span>
              <span className="violeta-scribble absolute bottom-3 right-4 text-sm">feito em casa ♡</span>
            </div>
          </div>
        </button>
      ) : (
        <div className="violeta-open-spread mx-auto max-w-5xl">
          <div className="mb-3 flex flex-wrap items-center justify-end gap-2 px-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>Receita {recipeIndex + 1} de {recipes.length}</span>
          </div>

          <div className="violeta-page-surface relative overflow-hidden rounded-xl shadow-[0_15px_35px_rgba(55,34,20,0.2)] ring-1 ring-[#bba27d]">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <article className={`${pageStyle} min-h-[24rem] p-4 sm:min-h-[25rem] sm:p-7 ${mobileSide === 'ingredients' ? 'block' : 'hidden sm:block'}`} aria-label={`Ingredientes de ${recipe.title}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="violeta-scribble text-sm">da cozinha da mamãe</p>
                    <h3 className="violeta-handwriting mt-1 text-2xl leading-6 text-[#51402e] sm:text-3xl sm:leading-tight">{recipe.title}</h3>
                  </div>
                  <Heart className="mt-1 h-5 w-5 shrink-0 text-[#b65b4e]" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="violeta-handwriting mt-3 text-base leading-6 text-[#80694e] sm:text-xl sm:leading-7">{recipe.note}</p>
                <div className="violeta-handwriting mt-3 flex flex-wrap gap-x-3 text-sm leading-6 text-[#8d302f] sm:mt-4 sm:text-lg sm:leading-7">
                  <span>{recipe.time}</span><span aria-hidden="true">·</span><span>{recipe.yield}</span>
                </div>
                <h4 className="violeta-handwriting mt-4 border-b border-[#bfa77e]/60 pb-1 text-xl leading-6 text-[#51402e] sm:mt-5 sm:text-2xl sm:leading-7">Você vai precisar</h4>
                <ul className="violeta-handwriting mt-2 space-y-0 text-base leading-6 text-[#51402e] sm:text-xl sm:leading-7">
                  {recipe.ingredients.map((ingredient) => <li key={ingredient} className="flex min-w-0 gap-2"><span className="shrink-0 text-[#a35445]" aria-hidden="true">·</span><span className="min-w-0">{ingredient}</span></li>)}
                </ul>
                <p className="violeta-scribble mt-5 text-base">Uma pitadinha de carinho, sempre.</p>
                <span className="absolute bottom-3 right-5 font-serif text-xs text-[#8d302f]/70">{recipeIndex * 2 + 1}</span>
              </article>

              <article className={`${pageStyle} min-h-[24rem] border-t border-[#bba27d]/70 p-4 sm:min-h-[25rem] sm:border-l sm:border-t-0 sm:p-7 ${mobileSide === 'method' ? 'block' : 'hidden sm:block'}`} aria-label={`Preparo de ${recipe.title}`}>
                <p className="violeta-scribble text-sm">Anotei para não esquecer</p>
                <h4 className="violeta-handwriting mt-1 border-b border-[#bfa77e]/60 pb-1 text-xl leading-6 text-[#51402e] sm:text-2xl sm:leading-7">Como fazer</h4>
                <ol className="violeta-handwriting mt-3 space-y-2 text-lg leading-6 text-[#51402e] sm:space-y-3 sm:text-2xl sm:leading-7">
                  {recipe.steps.map((step, index) => <li key={step} className="flex gap-2.5"><span className="mt-[-0.15rem] text-[#a35445]">{index + 1}.</span><span>{step}</span></li>)}
                </ol>
                <div className="violeta-scribble mt-5 rotate-[-1deg] border-l-2 border-[#b65b4e]/50 pl-3 text-base leading-snug">{recipe.memory}</div>
                <div className="absolute bottom-3 right-5 flex items-center gap-1 font-serif text-xs text-[#8d302f]/70"><Heart className="h-3 w-3" /> {recipeIndex * 2 + 2}</div>
              </article>
            </div>
            {turn && (
              <div
                key={turn.id}
                onAnimationEnd={() => setTurn(null)}
                className={`violeta-page-flip violeta-aged-paper bg-[#fffaf0] ${turn.direction === 'previous' ? 'violeta-page-flip-back' : ''}`}
                aria-hidden="true"
              />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={changeMobileSide} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d7c1a1] bg-[#fbf4eb] px-4 py-2 text-sm font-semibold text-burgundy-800 transition hover:bg-[#f3e6d9] sm:hidden">
              {mobileSide === 'ingredients' ? <>Virar para o preparo <ChevronRight className="h-4 w-4" /></> : <><ChevronLeft className="h-4 w-4" /> Voltar aos ingredientes</>}
            </button>
            <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
              <button type="button" onClick={() => changeRecipe('previous')} disabled={recipeIndex === 0} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-burgundy-800 transition hover:bg-[#f3e6d9] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <span className="font-serif text-sm italic text-[#80694e]">{recipeIndex + 1} / {recipes.length}</span>
              <button type="button" onClick={() => changeRecipe('next')} disabled={recipeIndex === recipes.length - 1} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-burgundy-800 transition hover:bg-[#f3e6d9] disabled:cursor-not-allowed disabled:opacity-40">
                Próxima receita <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
