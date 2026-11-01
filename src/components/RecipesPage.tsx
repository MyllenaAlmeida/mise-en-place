import { useState } from 'react';
import { BookOpen, ChefHat, ChevronDown, Clock3, CookingPot, Utensils } from 'lucide-react';
import type { BookMetadata } from '../hooks/useChapters';
import type { ReaderSettings } from '../types';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

type RecipeCategory = 'Entrada' | 'Principal' | 'Sobremesa';
type Recipe = {
  title: string;
  category: RecipeCategory;
  time: string;
  serves: string;
  chapter: string;
  chapterId: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

const recipes: Recipe[] = [
  {
    title: 'Eryngii dourado com redução de xerez', category: 'Entrada', time: '35 min', serves: '2 porções', chapter: 'Capítulo 02 · O fio da faca', chapterId: 'chapter-2',
    description: 'Cogumelos caramelizados, alho negro e limão-siciliano, inspirados no prato que conquista a aprovação de Lorena.',
    ingredients: ['2 cogumelos eryngii grandes', '150 g de shiitake e Paris', '2 dentes de alho negro amassados', '1 ramo de alecrim', '⅓ de xícara de vinho xerez', 'Raspas e algumas gotas de limão-siciliano', 'Azeite, sal e pimenta-do-reino'],
    steps: ['Limpe os cogumelos e reserve aparas e talos para um caldo rápido. Seque bem as peças principais.', 'Doure o eryngii em uma frigideira quente com azeite, sem mexer até formar uma crosta. Vire e doure o outro lado.', 'Acrescente shiitake e Paris fatiados. Tempere com sal, pimenta, alecrim e alho negro; salteie até ficarem macios e dourados.', 'Retire os cogumelos. Deglaceie a frigideira com o xerez e reduza até ficar levemente xaroposo. Finalize com limão e sirva sobre os cogumelos.'],
  },
  {
    title: 'Wellington de cogumelos e alho-poró', category: 'Principal', time: '1 h 20 min', serves: '4 porções', chapter: 'Capítulo 07 · Bala Juquinha', chapterId: 'chapter-7',
    description: 'A massa folhada crocante envolve um recheio concentrado de cogumelos. A história descreve a versão vegana servida no Racine.',
    ingredients: ['500 g de cogumelos variados bem picados', '1 alho-poró fatiado', '2 dentes de alho picados', '1 colher (sopa) de tomilho', '1 colher (sopa) de mostarda', '1 pacote de massa folhada vegana, descongelada', 'Azeite, sal e pimenta', 'Leite vegetal para pincelar'],
    steps: ['Salteie o alho-poró e o alho em um fio de azeite até amaciarem. Junte os cogumelos e cozinhe até toda a água evaporar.', 'Tempere com tomilho, mostarda, sal e pimenta. Espalhe o recheio em uma travessa e deixe esfriar completamente.', 'Abra a massa folhada, coloque o recheio no centro e feche como um pacote, pressionando as emendas.', 'Pincele com leite vegetal e asse a 200 °C por 30 a 40 minutos, até ficar bem dourado. Descanse por 10 minutos antes de fatiar.'],
  },
  {
    title: 'Bobó de King Oyster com banana-da-terra', category: 'Principal', time: '55 min', serves: '4 porções', chapter: 'Capítulo 11 · Um Dia de Cada Vez', chapterId: 'chapter-11',
    description: 'Uma leitura vegetal do bobó citado no menu do Racine, com cogumelos grelhados e banana-da-terra.',
    ingredients: ['400 g de cogumelo King Oyster em fatias grossas', '500 g de mandioca descascada', '1 banana-da-terra madura, em rodelas', '200 ml de leite de coco', '1 cebola picada', '1 tomate picado', '½ pimentão vermelho picado', 'Coentro, azeite de dendê, sal e limão'],
    steps: ['Cozinhe a mandioca em água com sal até ficar muito macia. Bata com o leite de coco e um pouco da água do cozimento até formar um creme.', 'Refogue cebola, tomate e pimentão em um fio de dendê. Junte o creme de mandioca e cozinhe em fogo baixo por 10 minutos.', 'Faça cortes superficiais nas fatias de King Oyster e grelhe em frigideira bem quente até dourarem dos dois lados. Grelhe também a banana-da-terra.', 'Incorpore os cogumelos ao bobó, ajuste o sal e finalize com coentro e algumas gotas de limão. Sirva com a banana grelhada.'],
  },
  {
    title: 'Carpaccio de beterraba e creme de castanhas', category: 'Entrada', time: '1 h', serves: '4 porções', chapter: 'Capítulo 07 · Bala Juquinha', chapterId: 'chapter-7',
    description: 'Beterraba assada e levemente defumada, com creme de castanhas e alcaparras — a entrada favorita de Eduarda.',
    ingredients: ['3 beterrabas médias', '¾ de xícara de castanha-de-caju demolhada', '¼ de xícara de água', '1 colher (sopa) de suco de limão', '2 colheres (sopa) de alcaparras', 'Azeite, sal e pimenta-do-reino', 'Endro ou folhas de erva fresca'],
    steps: ['Asse as beterrabas inteiras, embrulhadas em papel-alumínio, a 200 °C por 45 a 60 minutos. Deixe esfriar, descasque e corte em lâminas finas.', 'Bata as castanhas com água, limão e uma pitada de sal até obter um creme liso. Ajuste a água aos poucos.', 'Disponha as lâminas em um prato, tempere com azeite e pimenta e espalhe pequenas porções do creme.', 'Finalize com alcaparras e ervas. Para uma nota defumada, passe rapidamente as beterrabas por fumaça culinária ou grelhe as fatias antes de montar.'],
  },
  {
    title: 'Tartare de cogumelos e castanhas', category: 'Entrada', time: '25 min', serves: '2 a 3 porções', chapter: 'Capítulo 11 · Um Dia de Cada Vez', chapterId: 'chapter-11',
    description: 'Shiitake e cogumelo-de-Paris cortados na ponta da faca, com cebola roxa em brunoise.',
    ingredients: ['200 g de shiitake fresco', '200 g de cogumelo-de-Paris fresco', '¼ de cebola roxa em cubinhos', '⅓ de xícara de castanhas tostadas e picadas', '1 colher (sopa) de alcaparras picadas', '1 colher (sopa) de azeite', 'Suco de ½ limão-siciliano', 'Salsinha, sal e pimenta'],
    steps: ['Limpe os cogumelos com um pano úmido e pique-os bem pequenos com a faca. Não use processador para preservar a textura.', 'Misture os cogumelos com a cebola, as castanhas e as alcaparras.', 'Tempere com azeite, limão, salsinha, sal e pimenta. Prove e ajuste a acidez.', 'Sirva imediatamente, moldado com um aro, acompanhado de pão rústico tostado.'],
  },
  {
    title: 'Ganache de cacau e cupuaçu', category: 'Sobremesa', time: '30 min + geladeira', serves: '4 porções', chapter: 'Capítulo 07 · Bala Juquinha', chapterId: 'chapter-7',
    description: 'Cacau intenso, cupuaçu, praliné de avelãs tostadas e redução de frutas vermelhas, como a sobremesa do menu do Racine.',
    ingredients: ['200 g de chocolate amargo vegano (70%)', '180 ml de creme de coco', '100 g de polpa de cupuaçu', '½ xícara de avelãs tostadas', '⅓ de xícara de açúcar', '1 xícara de frutas vermelhas', '1 colher (chá) de suco de limão'],
    steps: ['Aqueça o creme de coco até começar a soltar vapor. Despeje sobre o chocolate picado, espere 2 minutos e mexa até ficar brilhante.', 'Incorpore a polpa de cupuaçu e divida a ganache em copinhos. Leve à geladeira por pelo menos 2 horas.', 'Para o praliné, derreta o açúcar em uma panela até formar caramelo âmbar, junte as avelãs e espalhe sobre papel-manteiga. Depois de frio, quebre em pedaços.', 'Ferva as frutas vermelhas com o limão por 6 a 8 minutos, até formar uma calda. Sirva a ganache com a redução e o praliné.'],
  },
];

interface RecipesPageProps {
  bookInfo: BookMetadata | null;
  theme: ReaderSettings['theme'];
  onGoHome: () => void;
  onGoToChapters: () => void;
  onOpenCharacters: () => void;
  onOpenKitchen: () => void;
  onOpenRecipes: () => void;
  onOpenSettings: () => void;
  onOpenChapter: (chapterId: string) => void;
}

export default function RecipesPage({ bookInfo, theme, onGoHome, onGoToChapters, onOpenCharacters, onOpenKitchen, onOpenRecipes, onOpenSettings, onOpenChapter }: RecipesPageProps) {
  const [category, setCategory] = useState<'Todas' | RecipeCategory>('Todas');
  const [expanded, setExpanded] = useState<string | null>(null);
  const dark = theme === 'dark';
  const sepia = theme === 'sepia';
  const page = dark ? 'bg-[#2b2520]' : sepia ? 'bg-[#f3e5cc]' : 'bg-[#f6eee3]';
  const card = dark ? 'border-[#5b4e40] bg-[#393128]' : sepia ? 'border-amber-300 bg-[#f5ead8]' : 'border-[#e4d3bf] bg-[#fbf4eb]';
  const detail = dark ? 'border-[#6b5638] bg-[#46382d] text-[#f0e5d3]' : sepia ? 'border-amber-300 bg-[#efe0c9] text-amber-950' : 'border-[#ead7c5] bg-[#f3e6da] text-charcoal-800';
  const title = dark ? 'text-[#f0e5d3]' : sepia ? 'text-amber-950' : 'text-charcoal-900';
  const muted = dark ? 'text-[#c9baa5]' : sepia ? 'text-amber-900/75' : 'text-charcoal-600';
  const visibleRecipes = recipes.filter((recipe) => category === 'Todas' || recipe.category === category);
  const filters: Array<'Todas' | RecipeCategory> = ['Todas', 'Entrada', 'Principal', 'Sobremesa'];

  return (
    <div className={`min-h-dvh ${page}`}>
      <SiteHeader title={bookInfo?.title || 'Mise en Place'} theme={theme} activePage="recipes" brandLabel="Voltar à página inicial" onBrandClick={onGoHome} onBackHome={onGoHome} backHomeLabel="Voltar à home" onGoToChapters={onGoToChapters} onOpenCharacters={onOpenCharacters} onOpenKitchen={onOpenKitchen} onOpenRecipes={onOpenRecipes} onOpenSettings={onOpenSettings} />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-8 sm:pb-16 sm:pt-8">
        <section className="story-hero relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-[#68231f] p-6 text-ivory-50 shadow-elegant sm:p-9" aria-labelledby="recipes-title">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-ivory-50/15" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory-50/25 bg-ivory-50/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory-100"><CookingPot className="h-3.5 w-3.5" /> Caderno do Racine</span>
            <h1 id="recipes-title" className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">Receitas da história</h1>
            <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-ivory-100/90 sm:text-lg">Pratos que aparecem na história para você fazer.</p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2 text-xs font-semibold text-ivory-100/90">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory-50/10 px-3 py-1.5"><ChefHat className="h-3.5 w-3.5" /> Cozinha vegetal</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory-50/10 px-3 py-1.5"><Utensils className="h-3.5 w-3.5" /> 6 receitas inspiradas no enredo</span>
          </div>
        </section>

        <section className="pt-7 sm:pt-9" aria-label="Receitas">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className={`font-display text-2xl font-semibold ${title}`}>Escolha algo para preparar</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar receitas por tipo">
              {filters.map((item) => <button key={item} onClick={() => { setCategory(item); setExpanded(null); }} aria-pressed={category === item} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 ${category === item ? 'border-burgundy-700 bg-burgundy-700 text-ivory-50' : `${card} ${title} hover:border-burgundy-300`}`}>{item}</button>)}
            </div>
          </div>

          <div className="grid items-start gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {visibleRecipes.map((recipe) => {
              const isExpanded = expanded === recipe.title;
              const detailId = `recipe-detail-${recipes.indexOf(recipe)}`;
              return (
                <article key={recipe.title} className={`overflow-hidden rounded-2xl border shadow-soft transition-all duration-200 ${card} ${isExpanded ? 'border-gold-400 shadow-elegant' : 'hover:-translate-y-0.5 hover:border-burgundy-200 hover:shadow-elegant'}`}>
                  <button onClick={() => setExpanded(isExpanded ? null : recipe.title)} className="flex h-[15.5rem] w-full flex-col p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-burgundy-600 sm:h-[14.5rem] sm:p-5" aria-expanded={isExpanded} aria-controls={detailId}>
                    <span className="flex min-h-[4.5rem] items-start gap-3">
                      <span className="min-w-0 flex-1">
                        <span className={`line-clamp-2 block font-display text-lg font-semibold leading-tight ${dark ? 'text-[#f0e5d3]' : 'text-burgundy-800'}`}>{recipe.title}</span>
                        <span className={`mt-1 line-clamp-2 block text-[0.65rem] font-semibold uppercase leading-snug tracking-[0.12em] ${muted}`}>{recipe.category} · {recipe.chapter}</span>
                      </span>
                      <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-burgundy-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </span>
                    <span className={`mt-3 line-clamp-3 min-h-[3.75rem] text-left font-serif text-sm leading-5 ${muted}`}>{recipe.description}</span>
                    <span className={`mt-auto flex w-full items-center gap-4 pt-3 text-xs font-semibold ${dark ? 'text-[#e8c986]' : 'text-burgundy-700'}`}><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 shrink-0" />{recipe.time}</span><span>{recipe.serves}</span><span className="ml-auto">{isExpanded ? 'Fechar' : 'Ver receita'}</span></span>
                  </button>
                  <div id={detailId} hidden={!isExpanded} className={`border-t px-4 py-4 sm:px-5 ${detail}`} role="region" aria-label={`Receita: ${recipe.title}`}>
                    <h3 className="font-display text-base font-semibold">Ingredientes</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed">{recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
                    <h3 className="mt-5 font-display text-base font-semibold">Preparo</h3>
                    <ol className="mt-2 list-inside list-decimal space-y-2 text-sm leading-relaxed">{recipe.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                    <button onClick={() => onOpenChapter(recipe.chapterId)} className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg border border-burgundy-300 px-3 py-2 text-xs font-semibold text-burgundy-800 transition hover:bg-burgundy-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600"><BookOpen className="h-3.5 w-3.5" />Ler capítulo citado</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter theme={theme} />
    </div>
  );
}
