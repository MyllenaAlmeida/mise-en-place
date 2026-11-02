import { useState } from 'react';
import { ChevronDown, Utensils } from 'lucide-react';
import type { ReaderSettings } from '../types';
import type { BookMetadata } from '../hooks/useChapters';
import SiteHeader from './SiteHeader';

type Character = {
  name: string;
  nickname?: string;
  role: string;
  initials: string;
  image?: string;
  imagePosition?: string;
  groups: Array<'racine' | 'circle' | 'lorena'>;
  summary: string;
  detail: string;
};

const characters: Character[] = [
  {
    name: 'Lorena Esteves',
    role: 'Chef e sócia do Racine',
    initials: 'LO',
    image: '/lorena-face.png',
    groups: ['racine', 'lorena'],
    summary: 'Precisa, exigente e apaixonada pela cozinha que construiu.',
    detail: 'O Racine é seu projeto de vida e seu lugar de controle. A chegada de Eduarda começa a mexer com a rotina impecável — e com as defesas que Lorena ergueu para si.',
  },
  {
    name: 'Eduarda Fragoso',
    nickname: 'Eduarda · Juquinha',
    role: 'Estagiária de gastronomia',
    initials: 'ED',
    image: '/eduarda-face.png',
    imagePosition: '70% 30%',
    groups: ['racine', 'circle', 'lorena'],
    summary: 'Uma nova carreira, um caderno de receitas e um recomeço no horizonte.',
    detail: 'Afastada da polícia e estudante de gastronomia, Eduarda aposta na seleção do Racine para mudar de vida. Seu jeito intuitivo de cozinhar carrega os ensinamentos da mãe, Violeta.',
  },
  {
    name: 'Maggye Damatta',
    role: 'Sócia e melhor amiga de Lorena',
    initials: 'MA',
    image: '/maggye.png',
    imagePosition: '50% 35%',
    groups: ['racine', 'circle', 'lorena'],
    summary: 'Prática, afetuosa e especialista em perceber quando a amiga precisa de ajuda.',
    detail: 'Maggye ajuda a manter o restaurante em movimento e incentiva Lorena a dividir responsabilidades. Também conhece a chef o bastante para notar quando o assunto é mais pessoal do que profissional.',
  },
  {
    name: 'Lucélia Damatta',
    nickname: 'Lucy',
    role: 'Estagiária do Racine',
    initials: 'LU',
    image: '/lucelia.png',
    imagePosition: '50% 30%',
    groups: ['racine', 'lorena'],
    summary: 'Competitiva e tecnicamente preparada, gosta de mostrar do que é capaz.',
    detail: 'Colega de Eduarda na seleção e prima distante de Maggye, Lucélia chega ao Racine confiante em sua formação. A exigência de Lorena vai colocá-la diante de novos desafios.',
  },
  {
    name: 'Celina Martins',
    role: 'Chef confeiteira do Racine',
    initials: 'CE',
    image: '/celina.png',
    imagePosition: '50% 42%',
    groups: ['racine', 'lorena'],
    summary: 'Talentosa na confeitaria, expansiva e sem medo de flertar.',
    detail: 'Celina é uma presença leve e carismática na cozinha. Seu talento para sobremesas anda junto com um interesse por Lorena que a chef tenta manter fora do expediente.',
  },
  {
    name: 'Paulo Reitz',
    nickname: 'Paulinho',
    role: 'Melhor amigo e companheiro de casa de Eduarda',
    initials: 'PA',
    image: '/paulo.png',
    imagePosition: '50% 30%',
    groups: ['circle'],
    summary: 'Protetor, brincalhão e sempre pronto para apoiar a amiga.',
    detail: 'Paulinho é a família que Eduarda escolheu. Entre piadas e conversas francas, ele oferece apoio emocional e prático enquanto ela tenta reorganizar a vida.',
  },
  {
    name: 'Gerluce',
    role: 'Melhor amiga de Eduarda',
    initials: 'GE',
    image: '/gerluce.png',
    imagePosition: '50% 28%',
    groups: ['circle'],
    summary: 'Espontânea, carinhosa e sempre pronta para animar a amiga.',
    detail: 'Namorada de Paulo e uma das melhores amigas de Eduarda, Gerluce divide com eles a rotina e os momentos importantes. Afetuosa e bem-humorada, ajuda a organizar surpresas e não hesita em apoiar a amiga quando ela precisa.',
  },
  {
    name: 'Violeta Fragoso',
    role: 'Mãe de Eduarda',
    initials: 'VI',
    image: '/violeta.png',
    imagePosition: '50% 28%',
    groups: ['circle'],
    summary: 'Sua presença continua viva nas lembranças e nas receitas da filha.',
    detail: 'Mesmo ausente, Violeta acompanha o caminho de Eduarda por meio do caderno de receitas e dos gestos de cuidado que ensinou à filha na cozinha.',
  },
  {
    name: 'Henrique Fragoso',
    role: 'Pai de Eduarda',
    initials: 'HE',
    image: '/henrique.png',
    imagePosition: '50% 35%',
    groups: ['circle'],
    summary: 'Um pai amoroso que quer estar por perto quando a filha precisar.',
    detail: 'Henrique é médico e mantém com Eduarda um vínculo afetuoso, ainda que os dois estejam reaprendendo a conversar e a compartilhar as dificuldades.',
  },
];

type Filter = 'all' | 'racine' | 'circle' | 'lorena';

interface CharactersPageProps {
  bookInfo: BookMetadata | null;
  settings: ReaderSettings;
  onGoHome: () => void;
  onGoToChapters: () => void;
  onOpenCharacters: () => void;
  onOpenKitchen: () => void;
  onToggleTheme: () => void;
}

export default function CharactersPage({ bookInfo, settings, onGoHome, onGoToChapters, onOpenCharacters, onOpenKitchen, onToggleTheme }: CharactersPageProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null);
  const visibleCharacters = characters.filter((character) => filter === 'all' || character.groups.includes(filter));
  const characterCardSurface = settings.theme === 'dark'
    ? 'border-[#68434a] bg-[#332126]'
    : settings.theme === 'sepia'
      ? 'border-amber-300 bg-[#f5ead8]'
      : 'border-ivory-300 bg-[#fbf4eb]';
  const characterDetailSurface = settings.theme === 'dark'
    ? 'border-[#68434a] bg-[#45272d] text-[#f0e5d3]'
    : settings.theme === 'sepia'
      ? 'border-amber-300 bg-[#efe0c9] text-amber-950'
      : 'border-[#ead7c5] bg-[#f3e6da] text-charcoal-800';
  const pageSurface = settings.theme === 'dark' ? 'bg-[#211719]' : settings.theme === 'sepia' ? 'bg-[#f3e5cc]' : 'bg-[#f6eee3]';
  const filterSurface = settings.theme === 'dark'
    ? 'border-[#68434a] bg-[#332126] text-[#f0e5d3] hover:bg-[#41252b]'
    : settings.theme === 'sepia'
      ? 'border-amber-300 bg-[#f5ead8] text-amber-950 hover:bg-[#efe0c9]'
      : 'border-[#e4d3bf] bg-[#fbf4eb] text-[#5d4b38] hover:bg-[#f3e6da]';

  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: 'Elenco completo' },
    { id: 'racine', label: 'Cozinha do Racine' },
    { id: 'circle', label: 'Círculo da Eduarda' },
    { id: 'lorena', label: 'Círculo da Lorena' },
  ];

  return (
    <div className={`min-h-dvh ${pageSurface}`}>
      <SiteHeader
        title={bookInfo?.title || 'Mise en Place'}
        theme={settings.theme}
        activePage="characters"
        brandLabel="Ficha técnica do elenco, início"
        onBrandClick={onGoHome}
        onBackHome={onGoHome}
        backHomeLabel="Voltar à home"
        onGoToChapters={onGoToChapters}
        onOpenCharacters={onOpenCharacters}
        onOpenKitchen={onOpenKitchen}
        onToggleTheme={onToggleTheme}
      />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-8 sm:pb-16 sm:pt-8">
        <section id="fichas-inicio" className="story-hero relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-[#68231f] p-6 text-ivory-50 shadow-elegant sm:p-9">
          <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border border-ivory-50/15" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory-50/25 bg-ivory-50/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory-100">
              <Utensils className="h-3.5 w-3.5" /> O elenco da casa
            </span>
            <h1 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">Ficha técnica do elenco</h1>
            <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-ivory-100/90 sm:text-lg">
              Conheça quem faz parte da história — da cozinha do Racine ao círculo de afeto de Eduarda. Abra uma ficha para ver mais detalhes.
            </p>
          </div>
        </section>

        <section className="pt-7 sm:pt-9" aria-label="Fichas de personagens">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-serif text-sm italic text-charcoal-600">Filtrar fichas por núcleo</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar personagens">
              {filters.map((item) => (
                <button key={item.id} onClick={() => { setFilter(item.id); setExpandedCharacter(null); }} aria-pressed={filter === item.id} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 ${filter === item.id ? 'border-burgundy-700 bg-burgundy-700 text-ivory-50' : filterSurface}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {visibleCharacters.map((character, index) => {
              const isExpanded = expandedCharacter === character.name;
              const detailId = `character-detail-${index}`;
              return (
                <article key={character.name} className={`overflow-hidden rounded-2xl border shadow-soft transition-all duration-200 ${characterCardSurface} ${isExpanded ? 'border-gold-400 shadow-elegant' : 'hover:-translate-y-0.5 hover:border-burgundy-200 hover:shadow-elegant'}`}>
                  <button onClick={() => setExpandedCharacter(isExpanded ? null : character.name)} className="w-full p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-burgundy-600 sm:p-5" aria-expanded={isExpanded} aria-controls={detailId}>
                    <span className="flex items-center gap-3">
                      {character.image ? (
                        <span className="group/portrait relative z-10 flex h-20 w-20 shrink-0 items-center justify-center">
                          <img src={character.image} alt={`Retrato de ${character.name}`} style={{ objectPosition: character.imagePosition ?? '50% 30%', transition: 'transform 850ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 650ms ease-out' }} className="relative z-0 h-20 w-20 origin-top-left rounded-full border-2 border-gold-300 object-cover shadow-sm transition-[transform,box-shadow] group-hover/portrait:z-30 group-hover/portrait:scale-[2.4] group-hover/portrait:shadow-2xl group-focus-within/portrait:z-30 group-focus-within/portrait:scale-[2.4] group-focus-within/portrait:shadow-2xl" />
                        </span>
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300 bg-gold-50 font-display text-sm font-semibold text-burgundy-800 shadow-inner">{character.initials}</span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-semibold leading-tight text-burgundy-800">{character.name}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-burgundy-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </span>
                    <span className="mt-4 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-gold-800">
                      <span>{character.role}</span><span className="flex-1 border-b border-dotted border-gold-400" aria-hidden="true" /><span>{String(index + 1).padStart(2, '0')}</span>
                    </span>
                    <span className="mt-3 block font-serif text-sm leading-relaxed text-charcoal-700">{character.summary}</span>
                    <span className="mt-3 block text-xs font-semibold text-burgundy-700">{isExpanded ? 'Fechar ficha' : 'Abrir ficha'}</span>
                  </button>
                  <div id={detailId} hidden={!isExpanded} className={`border-t px-4 py-3.5 text-sm leading-relaxed sm:px-5 ${characterDetailSurface}`} role="region" aria-label={`Sobre ${character.name}`}>
                      {character.detail}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
