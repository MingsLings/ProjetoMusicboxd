# Musicboxd

Aplicativo mobile de diário musical inspirado em apps de registro e avaliação. A pessoa salva as músicas que já ouviu, dá uma nota de 1 a 5 estrelas, escolhe a data da audição e pode escrever um comentário. Desenvolvido com React Native, Expo e Firebase.

## Recursos

- Cadastro, login e logout com Firebase Authentication.
- Diário pessoal sincronizado em tempo real pelo Cloud Firestore.
- Registro de música, artista, nota, data ouvida e comentário opcional.
- Resumo de faixas registradas e nota média.
- Remoção de registros com confirmação.
- Área Descobrir com busca e registro rápido de faixas sugeridas.
- Modal reutilizado entre Diário e Descobrir, com DateTimePicker.
- Navegação por abas: Diário, Descobrir e Perfil.
- Alternância de tema claro/escuro com preferência salva localmente.

## Executar

```bash
npm install
npx expo start --go
```

Para abrir no celular, use o Expo Go compatível com o SDK do projeto e escaneie o QR code. Se a rede local bloquear a conexão, instale `@expo/ngrok` (já incluído nas dependências) e execute:

```bash
npx expo start --go --tunnel
```

Outros comandos: `npm run web`, `npm run android` e `npm run ios`.

## Firebase

Configure um projeto Firebase com Authentication por e-mail/senha e Cloud Firestore. Atualize as credenciais em `services/firebase.ts`.

Cada documento da coleção `musicLogs` contém:

- `userId`: proprietário do registro.
- `title`: título da música.
- `artist`: artista.
- `rating`: nota de 1 a 5.
- `listenedAt`: data selecionada da audição.
- `review`: comentário opcional.
- `createdAt`: data de gravação.

Exemplo de regras para permitir que cada conta acesse apenas os próprios registros:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /musicLogs/{logId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.title is string
        && request.resource.data.artist is string
        && request.resource.data.rating is int
        && request.resource.data.rating >= 1
        && request.resource.data.rating <= 5
        && request.resource.data.listenedAt is timestamp;
      allow read, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow update: if false;
    }
  }
}
```

## Estrutura principal

- `app/(auth)/`: login e cadastro.
- `app/(home)/`: diário, descoberta e perfil.
- `components/MusicLogModal.tsx`: formulário de avaliação e data.
- `services/musicDiary.ts`: gravação, observação e remoção de registros.
- `contexts/ThemeContext.tsx`: tema e persistência da preferência.
