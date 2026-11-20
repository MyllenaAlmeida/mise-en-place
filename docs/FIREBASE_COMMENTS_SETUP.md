# Configurar comentários por capítulo

Cada capítulo tem uma seção de comentários após o texto. Os comentários ficam associados ao capítulo e são públicos para leitura; quem comenta usa uma identidade anônima do Firebase e informa o nome que aparecerá no comentário.

## Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e registre um app Web.
2. Em **Authentication → Sign-in method**, habilite **Anonymous**.
3. Crie o banco em **Firestore Database**.
4. Copie `.env.example` para `.env.local` e preencha os valores `apiKey`, `authDomain`, `projectId` e `appId` mostrados na configuração do app Web.
5. Publique as regras de `firestore.rules` em **Firestore Database → Rules**.
6. Crie o índice de grupo de coleção descrito em `firestore.indexes.json`; se uma consulta mostrar um link de criação de índice, abra-o e confirme a criação. Aguarde o status ficar **Ativado**.
7. Reinicie o servidor Vite após editar as variáveis.

O arquivo `.env.local` é ignorado pelo Git. Não coloque chaves de conta de serviço no frontend. As regras permitem criar comentários autenticados, ler comentários visíveis e apagar somente os próprios; edição não é permitida. Como os comentários são públicos e publicados imediatamente, adicione moderação antes de abrir o site a uma audiência ampla.

## Modelo de dados

```text
chapters/{chapterId}/comments/{commentId}
```

Cada documento contém `authorUid`, `authorName`, `body`, `createdAt`, `status` e `chapterId`. A lista de comentários atualiza em tempo real. Comentários antigos salvos em `chapters/{chapterId}/paragraphs/{paragraphId}/comments` continuam aparecendo na seção do capítulo e podem ser apagados por seus autores.
