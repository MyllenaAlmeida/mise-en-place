import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import {
  addDoc,
  collection,
  collectionGroup,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { ChevronLeft, ChevronRight, LoaderCircle, MessageCircle, Send, Utensils } from 'lucide-react';
import { firebaseAuth, firebaseConfigured, firestore } from '../lib/firebase';

interface ChapterCommentsProps {
  chapterId: string;
  chapterNumber?: number;
  theme: 'light' | 'dark' | 'sepia';
  layout?: 'panel' | 'section';
}

interface ChapterComment {
  id: string;
  authorUid: string;
  authorName: string;
  body: string;
  createdAt: Timestamp | null;
  chapterId: string;
  paragraphId?: string;
}

function getFirebaseErrorMessage(reason: unknown, fallback: string) {
  const code = typeof reason === 'object' && reason !== null && 'code' in reason
    ? (reason as { code?: unknown }).code
    : undefined;
  if (code === 'permission-denied') {
    return 'O Firebase recusou o comentário. Publique as regras atualizadas de firestore.rules no projeto Firebase.';
  }
  if (code === 'failed-precondition') {
    return 'O Firebase precisa do índice atualizado em firestore.indexes.json para carregar os comentários.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'O login anônimo está desativado. Ative-o em Firebase → Authentication → Sign-in method.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Este domínio ainda não está autorizado no Firebase Authentication.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Não foi possível conectar ao Firebase. Confira sua conexão e tente novamente.';
  }
  return reason instanceof Error ? reason.message : fallback;
}

export default function ChapterComments({ chapterId, chapterNumber, theme, layout = 'section' }: ChapterCommentsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<ChapterComment[]>([]);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const pendingAuthRef = useRef<Promise<User> | null>(null);
  const dark = theme === 'dark';
  const panelLayout = layout === 'panel';
  const panel = dark ? 'border-[#68434a] bg-[#2a1b1f] text-[#f0e5d3]' : theme === 'sepia' ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-ivory-300 bg-white text-charcoal-800';
  const field = dark ? 'border-[#68434a] bg-[#211719] text-[#f0e5d3] placeholder:text-[#bba9a6]' : 'border-ivory-300 bg-white text-charcoal-800 placeholder:text-charcoal-400';

  const ensureAnonymousUser = () => {
    if (!firebaseAuth) return Promise.reject(new Error('Firebase Authentication não está configurado.'));
    if (firebaseAuth.currentUser) {
      setUser(firebaseAuth.currentUser);
      return Promise.resolve(firebaseAuth.currentUser);
    }
    if (!pendingAuthRef.current) {
      pendingAuthRef.current = signInAnonymously(firebaseAuth)
        .then((credential) => credential.user)
        .finally(() => { pendingAuthRef.current = null; });
    }
    return pendingAuthRef.current.then((currentUser) => {
      setUser(currentUser);
      return currentUser;
    });
  };

  useEffect(() => {
    const auth = firebaseAuth;
    if (!auth) return;
    return onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setError('');
      } else void ensureAnonymousUser().catch((reason: unknown) => {
        setError(getFirebaseErrorMessage(reason, 'Não foi possível iniciar uma sessão de comentários.'));
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    if (!firestore || !firebaseConfigured || !user) return;
    setLoading(true);
    const commentsQuery = query(
      collectionGroup(firestore, 'comments'),
      where('chapterId', '==', chapterId),
      where('status', '==', 'visible'),
      limit(500),
    );
    return onSnapshot(commentsQuery, (snapshot) => {
      const loadedComments = snapshot.docs.map((commentDoc) => ({ id: commentDoc.id, ...commentDoc.data() }) as ChapterComment);
      loadedComments.sort((first, second) => (second.createdAt?.toMillis() ?? 0) - (first.createdAt?.toMillis() ?? 0));
      setComments(loadedComments);
      setLoading(false);
    }, (reason: unknown) => {
      setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os comentários.');
      setLoading(false);
    });
  }, [chapterId, user]);

  const postComment = async () => {
    if (!firestore || !firebaseConfigured || !firebaseAuth) {
      setError('Comentários não estão conectados ao Firebase neste site.');
      return;
    }
    const cleanName = name.trim().slice(0, 40);
    const cleanBody = body.trim();
    if (!cleanName || !cleanBody) {
      setError('Preencha seu nome e comentário antes de enviar.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const author = user ?? await ensureAnonymousUser();
      await addDoc(collection(firestore, 'chapters', chapterId, 'comments'), {
        authorUid: author.uid,
        chapterId,
        authorName: cleanName,
        body: cleanBody,
        createdAt: serverTimestamp(),
        status: 'visible',
      });
      setName('');
      setBody('');
      setCurrentPage(1);
    } catch (reason) {
      setError(getFirebaseErrorMessage(reason, 'Não foi possível publicar o comentário.'));
    } finally {
      setSending(false);
    }
  };

  const formattedDate = (timestamp: Timestamp | null) => timestamp?.toDate().toLocaleString('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }) ?? 'agora';
  const orderedComments = comments;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(orderedComments.length / pageSize));
  const visibleComments = orderedComments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <section className={`${panelLayout ? 'flex h-full min-h-0 w-full max-w-none flex-col rounded-none border-0 shadow-none' : 'mx-auto my-8 w-full max-w-3xl rounded-2xl border shadow-sm'} ${panel}`} aria-label="Comentários do capítulo">
      <header className="shrink-0 border-b border-current/10 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold"><MessageCircle className="h-5 w-5" />Comentários</h2>
          {chapterNumber !== undefined && <span className="rounded-full border border-current/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider opacity-65">Cap. {String(chapterNumber).padStart(2, '0')}</span>}
        </div>
        <p className="mt-1 text-sm opacity-70">Compartilhe suas impressões sobre este capítulo.</p>
      </header>

      {!firebaseConfigured ? (
        <div className="p-5 text-sm">Comentários ainda não estão configurados. Adicione as credenciais do Firebase seguindo <code>docs/FIREBASE_COMMENTS_SETUP.md</code>.</div>
      ) : (
        <>
          <form aria-label="Publicar comentário" className="shrink-0 space-y-2 border-b border-current/10 p-4 sm:space-y-3 sm:p-5" onSubmit={(event) => { event.preventDefault(); void postComment(); }}>
            <label className="sr-only" htmlFor={`comment-author-name-${chapterId}`}>Seu nome</label>
            <input id={`comment-author-name-${chapterId}`} value={name} onChange={(event) => setName(event.currentTarget.value.slice(0, 40))} maxLength={40} autoComplete="name" required className={`h-11 w-full rounded-lg border px-3 text-base outline-none focus:ring-2 focus:ring-burgundy-500/40 sm:text-sm ${field}`} placeholder="Seu nome" />
            <div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-end">
              <label className="sr-only" htmlFor={`comment-body-${chapterId}`}>Seu comentário</label>
              <textarea id={`comment-body-${chapterId}`} value={body} onChange={(event) => setBody(event.currentTarget.value.slice(0, 2000))} maxLength={2000} rows={3} className={`min-h-24 min-w-0 w-full flex-1 resize-y rounded-xl border px-3 py-2 text-base outline-none focus:ring-2 focus:ring-burgundy-500/40 sm:text-sm ${field}`} placeholder="Seu comentário" />
              <button type="submit" disabled={sending} className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-burgundy-700 px-4 text-sm font-semibold text-white transition hover:bg-burgundy-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto" aria-label="Publicar comentário">{sending ? <><LoaderCircle className="h-4 w-4 animate-spin" />Enviando</> : <><Send className="h-4 w-4" />Enviar</>}</button>
            </div>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          </form>
          <div className="flex items-center gap-3 border-b border-current/10 px-4 py-3 sm:px-5">
            <h3 className="font-serif text-lg font-semibold">Comentários deste capítulo <span className="text-sm font-normal opacity-60">({comments.length})</span></h3>
          </div>
          <div className="min-h-24 space-y-3 p-4 sm:p-5" aria-live="polite">
            {loading && <p className="flex items-center gap-2 text-sm opacity-70"><LoaderCircle className="h-4 w-4 animate-spin" /> Carregando comentários…</p>}
            {!loading && comments.length === 0 && <p className="py-4 text-center text-sm opacity-70">Ainda não há comentários. Seja a primeira pessoa a comentar.</p>}
            {visibleComments.map((comment) => (
              <article key={comment.id} className="rounded-xl border border-current/10 bg-current/[0.03] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="flex items-center gap-1.5 truncate text-sm font-semibold"><Utensils className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />{comment.authorName}</p><time className="text-xs opacity-60">{formattedDate(comment.createdAt)}</time></div>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{comment.body}</p>
              </article>
            ))}
          </div>
          {totalPages > 1 && <nav className="flex items-center justify-between gap-3 border-t border-current/10 px-4 py-3 sm:px-5" aria-label="Paginação dos comentários">
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="inline-flex h-9 items-center gap-1 rounded-lg border border-current/15 px-3 text-xs font-medium transition hover:bg-current/5 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Anterior</button>
            <span className="text-xs opacity-70" aria-live="polite">Página {currentPage} de {totalPages}</span>
            <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="inline-flex h-9 items-center gap-1 rounded-lg border border-current/15 px-3 text-xs font-medium transition hover:bg-current/5 disabled:cursor-not-allowed disabled:opacity-40">Próxima<ChevronRight className="h-4 w-4" /></button>
          </nav>}
        </>
      )}
    </section>
  );
}
