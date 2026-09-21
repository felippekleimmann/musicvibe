# MusicVibe - Plataforma de Streaming de Música

Projeto desenvolvido para a N2 seguindo o roteiro e o manual da Aula 01 de TDD. A aplicação foi criada do zero com Node.js, Express, EJS, Sequelize, MySQL e Vitest.

## Visão geral

O MusicVibe é uma plataforma de streaming de música onde usuários podem ouvir faixas, criar playlists, explorar artistas e favoritar músicas/artistas. Administradores gerenciam o catálogo musical, gêneros, usuários e permissões.

## Tecnologias

- Node.js
- Express
- EJS com layouts
- Sequelize
- MySQL/MariaDB
- Vitest
- Supertest
- Nodemon
- Dotenv
- Bcryptjs

## Como rodar

```bash
npm install
copy .env.example .env
npm test
npm run dev
```

Banco de dados:

```sql
CREATE DATABASE musicvibe_db_tdd;
```

## Scripts

```bash
npm run dev
npm test
npm run test:run
npm run test:coverage
npm run db:test
```

## Módulos e regras de negócio

### 1. Health
- Deve informar se a aplicação está saudável.
- Deve retornar status OK, versão e timestamp.

### 2. Usuário
- Usuário deve ter nome, e-mail e senha.
- E-mail deve ser válido e único.
- Senha deve ter no mínimo 6 caracteres.
- Senha deve ser criptografada.
- Usuário pode ter perfil `user` ou `admin`.

### 3. Autenticação
- Login exige e-mail e senha.
- Senha incorreta bloqueia o acesso.
- Rotas protegidas exigem sessão ativa.
- Rotas administrativas exigem perfil admin.

### 4. Permissões
- Administradores podem executar qualquer ação.
- Usuários autenticados podem visualizar recursos públicos.
- Somente donos podem alterar ou excluir seus próprios recursos.

### 5. Gêneros
- Gênero deve ter nome com no mínimo 3 caracteres.
- Nome do gênero deve ser único.
- Apenas administradores podem criar, editar ou remover gêneros.
- Apenas gêneros ativos aparecem na exploração pública.

### 6. Artistas
- Artista deve ter nome válido.
- Artista pode ter biografia e imagem.
- Usuários podem favoritar artistas.
- Apenas administradores podem gerenciar artistas.

### 7. Álbuns
- Álbum deve ter título e artista vinculado.
- Álbum pode ter capa e ano de lançamento.
- Um artista pode possuir vários álbuns.
- Apenas administradores podem gerenciar álbuns.

### 8. Músicas/Faixas
- Música deve ter título, gênero, artista e arquivo de áudio.
- Música pode pertencer a um álbum.
- Música deve registrar quantidade de reproduções.
- Apenas faixas ativas aparecem no catálogo público.
- Apenas administradores podem cadastrar, editar ou excluir músicas.

### 9. Playlists
- Playlist deve ter nome e usuário dono.
- Usuário pode criar playlists públicas ou privadas.
- Apenas o dono ou admin pode editar a playlist.
- Playlist pode conter várias músicas.
- Usuário pode adicionar ou remover faixas da própria playlist.

### 10. Favoritos
- Usuário autenticado pode favoritar músicas.
- Usuário autenticado pode favoritar artistas.
- A mesma música não pode ser favoritada duas vezes pelo mesmo usuário.
- O mesmo artista não pode ser favoritado duas vezes pelo mesmo usuário.

### 11. Avaliações e comentários
- Usuário autenticado pode avaliar uma música.
- Nota deve estar entre 1 e 5.
- Comentário pode ser associado à avaliação.
- Usuário pode excluir sua própria avaliação.
- Admin pode excluir qualquer avaliação inadequada.
- O sistema pode calcular a média das avaliações.

### 12. Reprodução
- Reprodução deve estar vinculada a usuário e música.
- Progresso não pode ser negativo.
- Progresso não pode ultrapassar a duração da música.
- Sistema deve identificar quando a faixa foi finalizada.
- Cada reprodução pode atualizar o contador de plays da música.

### 13. Dashboard administrativo
- Apenas administradores podem acessar o dashboard.
- Deve exibir total de usuários.
- Deve exibir total de músicas.
- Deve exibir total de artistas.
- Deve exibir total de playlists.
- Deve exibir total de reproduções.

## Estrutura principal

```text
src/
  config/
  middlewares/
  models/
  modules/
    auth/
    user/
    track/
    artist/
    album/
    genre/
    playlist/
    favorite/
    review/
    playback/
    dashboard/
    permission/
    health/
  routes/
  views/
  public/
test/
```

## Testes

Os testes ficam dentro das pastas `__tests__` de cada módulo, seguindo o padrão da Aula 01 e do Vitest.

```bash
npm test
```
