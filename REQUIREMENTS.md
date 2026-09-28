# Requisitos do Projeto

## Tema
Diário musical para registrar e avaliar músicas que a pessoa já ouviu.

## Autenticação
Firebase Authentication oferece cadastro, login e logout por e-mail e senha.

## Firestore
A coleção `musicLogs` armazena um documento por audição registrada. Cada documento contém pelo menos três informações: título da música, artista, nota, data escolhida da audição, comentário opcional e identificador do usuário.

O formulário impede salvar sem título, artista e nota. A data é selecionável por DateTimePicker.

## Telas e navegação
- Login e cadastro.
- Diário com histórico, nota média e remoção de registros.
- Descobrir com busca de faixas sugeridas e ação de registro rápido.
- Perfil com informações da conta, alternância de tema e logout.
- Stack Navigation pelo Expo Router e Bottom Tabs para as áreas autenticadas.

## Modal
O modal compartilhado entre Diário e Descobrir registra uma audição no Firestore. Ele inclui título, artista, avaliação de 1 a 5 estrelas, data selecionável e comentário opcional, com validação e feedback de erro.

## Interface
As telas apresentam títulos, campos identificados, botões compreensíveis, estado vazio, indicador de carregamento e mensagens de erro. A preferência entre tema claro e escuro é persistida no dispositivo.
