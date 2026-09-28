# Guia de Uso

## Entrar

Crie uma conta com nome, e-mail e senha ou entre com uma conta existente. A autenticação é feita pelo Firebase. Para sair, abra a aba Perfil e use a opção de logout.

## Registrar uma audição

Na aba **Diário**, toque no botão `+` ou em **Registrar primeira audição**. Informe o título e o artista, selecione uma nota de 1 a 5 estrelas e escolha a data em que ouviu a faixa. O comentário é opcional. Toque em **Salvar no diário**.

Também é possível abrir a aba **Descobrir**, buscar uma sugestão e tocar no botão `+` ao lado dela. O formulário virá com título e artista preenchidos; você ainda pode editar os campos antes de salvar.

## Consultar o diário

Os registros aparecem em ordem da data ouvida, com artista, nota, data e comentário. O resumo mostra a quantidade de faixas e a média das notas. Os dados são sincronizados pelo Firestore.

Para remover um registro, toque no `x` correspondente e confirme a ação.

## Alterar o tema

Na aba **Perfil**, toque em **Tema** para alternar entre claro e escuro. A preferência é salva no dispositivo.

## Dados no Firestore

Os registros ficam na coleção `musicLogs`. Cada documento guarda proprietário, título, artista, nota, data ouvida, comentário e data de criação. A configuração Firebase do app fica em `services/firebase.ts`.
