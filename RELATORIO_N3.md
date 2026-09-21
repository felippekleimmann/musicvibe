# Relatório N3 — Evolução do Projeto com TDD (MusicVibe)

**Integrantes:** Felippe Kleimmann e Abner Baechtold
**Faixa de nota alvo:** 7,0

## 1. Ponto de partida

O projeto entregue na N2 (`musicvibe-tdd-sequelize-modulos`) já trazia o cadastro de usuário totalmente implementado e testado (34 testes entre `user.service.test.js` e `user.controller.test.js`), além de vários outros módulos **esqueletos**: `track`, `album`, `artist`, `genre`, `playlist`, `favorite`, `review`, `playback`, `auth`, `dashboard`, `permission`. Esses esqueletos continham apenas funções de validação/permissão puras (sem persistência) e um `controller.index` de "health-check", sem rotas REST reais.

Antes de começar a N3, rodamos `npx vitest run` na suíte herdada da N2: os **135 testes existentes passaram sem falhas**, então não havia bugs bloqueantes para corrigir antes de avançar.

## 2. Funcionalidade escolhida: Playlists

Para a N3 escolhemos evoluir o módulo **Playlist** (criação de playlists e gerenciamento de músicas dentro delas), um dos exemplos sugeridos no enunciado para o MusicVibe e diferente do cadastro de usuário usado na N2. Na N2 esse módulo era apenas um esqueleto (4 funções de validação, sem CRUD, sem rotas reais), então ele foi construído do zero seguindo TDD.

### Regras de negócio implementadas

- Toda playlist precisa de `name` (mínimo 3 caracteres) e de um `userId` (dono).
- Por padrão a playlist é criada como `private`; pode ser criada como `public`.
- Apenas o **dono** da playlist ou um usuário **admin** pode editá-la, excluí-la ou adicionar/remover músicas (`canEditPlaylist` / `canAddTrackToPlaylist`).
- Playlists `public` podem ser visualizadas por qualquer pessoa; playlists `private` só pelo dono ou admin (`canViewPlaylist`).
- Não é permitido adicionar a mesma música duas vezes na mesma playlist.
- Operações sobre playlist ou música inexistente retornam erro específico (`Playlist não encontrada` / `Música não encontrada`).

### Camadas implementadas

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Model | `src/models/Playlist.js`, `PlaylistTrack.js`, `Track.js` | Definição Sequelize (já existiam na N2, reaproveitados) |
| Service | `src/modules/playlist/playlist.service.js` | Regras de negócio, validação, permissões e acesso ao banco via Sequelize |
| Controller | `src/modules/playlist/playlist.controller.js` | Tradução de requisições HTTP em chamadas ao Service e mapeamento de erros para status codes |
| Routes | `src/routes/playlist.routes.js` | Definição dos endpoints e aplicação do middleware `isAuthenticated` |

### Endpoints criados

```
GET    /playlist                       -> lista playlists públicas
GET    /playlist/mine        (auth)    -> lista playlists do usuário logado
POST   /playlist             (auth)    -> cria uma playlist
GET    /playlist/:id                   -> detalhe de uma playlist (pública ou própria)
POST   /playlist/:id/tracks  (auth)    -> adiciona uma música à playlist
DELETE /playlist/:id/tracks/:trackId (auth) -> remove uma música da playlist
DELETE /playlist/:id         (auth)    -> exclui a playlist
```

## 3. Como o ciclo Red-Green-Refactor foi aplicado

Seguimos rigorosamente Red → Green → Refactor para cada função nova do Service e depois para o Controller.

### Exemplo real 1 — `addTrackToPlaylist`

**Red:** escrevemos o teste antes de qualquer implementação:

```js
it('deve lançar erro quando a música já está na playlist', async () => {
  Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
  Track.findByPk.mockResolvedValue({ id: 5 });
  PlaylistTrack.findOne.mockResolvedValue({ id: 10, PlaylistId: 1, TrackId: 5 });

  await expect(addTrackToPlaylist({ id: 1 }, 1, 5)).rejects.toThrow('Música já está na playlist');
  expect(PlaylistTrack.create).not.toHaveBeenCalled();
});
```

Rodando `npx vitest run`, o teste falhava com `TypeError: addTrackToPlaylist is not a function` — a função ainda não existia (35 testes do Service falharam de uma vez, pois nenhuma das 7 novas funções estava implementada).

**Green:** implementamos o mínimo necessário para o teste passar:

```js
export const addTrackToPlaylist = async (user, playlistId, trackId) => {
  const playlist = await Playlist.findByPk(playlistId);
  if (!playlist) throw new Error('Playlist não encontrada');
  if (!canAddTrackToPlaylist(user, playlist)) throw new Error('Sem permissão para editar esta playlist');
  const track = await Track.findByPk(trackId);
  if (!track) throw new Error('Música não encontrada');
  const existing = await PlaylistTrack.findOne({ where: { PlaylistId: playlistId, TrackId: trackId } });
  if (existing) throw new Error('Música já está na playlist');
  return PlaylistTrack.create({ PlaylistId: playlistId, TrackId: trackId });
};
```

Após essa implementação, os 35 testes do Service passaram.

**Refactor:** revisamos o controller para extrair a tradução "mensagem de erro → status HTTP" em uma função auxiliar (`mapErrorToStatus`), evitando duplicar `if/else` em cada handler, sem alterar nenhum teste.

### Exemplo real 2 — Bug encontrado e corrigido na N2

Ao migrar `canEditPlaylist` da N2 (`user?.id === playlist?.UserId || user?.id === playlist?.userId`) escrevemos o teste:

```js
it('deve negar edição quando não há usuário autenticado', () => {
  expect(canEditPlaylist(null, { userId: 1 })).toBe(false);
});
```

Esse teste **falhou** (Red) porque, com `user = null`, `user?.id` resulta em `undefined`, e como `playlist.UserId` também era `undefined` no cenário de teste, `undefined === undefined` retornava `true` — um bug real herdado da N2 (qualquer usuário não autenticado "editaria" uma playlist sem `UserId` definido). Corrigimos a função:

```js
export const canEditPlaylist = (user, playlist) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.id === playlist?.UserId || user.id === playlist?.userId;
};
```

Com isso o teste passou (Green) e o restante da suíte continuou verde — exatamente o cenário que o enunciado da N3 pede para revisar ("se a N2 foi entregue com bugs, este é o momento de corrigi-los").

### Exemplo real 3 — Controller / rota protegida

**Red:**

```js
it('deve retornar 401 quando o usuário não está autenticado', async () => {
  isAuthenticated.mockImplementation((req, res) => res.status(401).json({ error: 'Usuário não autenticado' }));
  const response = await request(app).post('/playlist').send({ name: 'Rock' });
  expect(response.status).toBe(401);
  expect(playlistService.createPlaylist).not.toHaveBeenCalled();
});
```

Antes de existir a rota `POST /playlist` protegida por `isAuthenticated`, esse teste falhava com 404 (rota inexistente). Implementamos a rota com o middleware (Green), depois revisamos os nomes dos handlers para seguir o mesmo padrão dos demais módulos do projeto (Refactor).

## 4. Testes unitários (Service) — 35 no total, mínimo de 10 atendido

Arquivo: `src/modules/playlist/__tests__/playlist.service.test.js`. Cobrem `validatePlaylistData`, `canEditPlaylist`, `canViewPlaylist`, `canAddTrackToPlaylist`, `createPlaylist`, `getPlaylistById`, `listPlaylistsByUser`, `listPublicPlaylists`, `addTrackToPlaylist`, `removeTrackFromPlaylist`, `deletePlaylist` e os atributos do model `Playlist`.

### Explicação de 3 testes unitários

**1) `deve lançar erro quando o nome é muito curto`**
```js
it('deve lançar erro quando o nome é muito curto', () => {
  expect(() => validatePlaylistData({ name: 'ab', userId: 1 })).toThrow('Nome da playlist é obrigatório');
});
```
*O que verifica:* que a regra de negócio "nome mínimo de 3 caracteres" é respeitada. *Mock:* nenhum — é uma função pura, sem dependência externa. *Asserção:* `expect().toThrow()` valida que uma exceção com a mensagem exata é lançada.

**2) `deve adicionar música quando playlist e música existem e usuário tem permissão`**
```js
it('deve adicionar música quando playlist e música existem e usuário tem permissão', async () => {
  Playlist.findByPk.mockResolvedValue({ id: 1, userId: 1 });
  Track.findByPk.mockResolvedValue({ id: 5, title: 'Música Teste' });
  PlaylistTrack.findOne.mockResolvedValue(null);
  PlaylistTrack.create.mockResolvedValue({ id: 10, PlaylistId: 1, TrackId: 5 });

  const result = await addTrackToPlaylist({ id: 1 }, 1, 5);

  expect(PlaylistTrack.create).toHaveBeenCalledWith({ PlaylistId: 1, TrackId: 5 });
  expect(result).toHaveProperty('id', 10);
});
```
*O que verifica:* o fluxo de sucesso completo do caso de uso principal do módulo. *Mock:* `vi.mock` substitui os models Sequelize `Playlist`, `Track` e `PlaylistTrack` por `vi.fn()`, isolando o Service do banco de dados real. *Asserção:* `toHaveBeenCalledWith` garante que o model foi chamado com os parâmetros corretos; `toHaveProperty` valida o formato do retorno.

**3) `deve lançar erro quando a playlist não existe` (em `deletePlaylist`)**
```js
it('deve lançar erro quando a playlist não existe', async () => {
  Playlist.findByPk.mockResolvedValue(null);
  await expect(deletePlaylist({ id: 1 }, 999)).rejects.toThrow('Playlist não encontrada');
});
```
*O que verifica:* cenário de falha (playlist inexistente) impedindo a exclusão. *Mock:* `Playlist.findByPk` mockado para resolver `null`, simulando "não encontrado" sem precisar de um banco real. *Asserção:* `rejects.toThrow()` valida que a Promise é rejeitada com a mensagem esperada.

## 5. Testes de integração (Controller via Supertest) — 19 no total, mínimo de 10 atendido

Arquivo: `src/modules/playlist/__tests__/playlist.controller.test.js`. O `playlist.service.js` inteiro é mockado com `vi.mock`, assim como o middleware `isAuthenticated`, para que os testes validem apenas a camada HTTP (rota → controller → status code), sem depender de banco de dados ou sessão real.

### Explicação de 2 testes de integração

**1) `POST /playlist` → 201 ao criar com sucesso**
```js
it('deve criar a playlist e retornar 201 quando os dados são válidos', async () => {
  playlistService.createPlaylist.mockResolvedValue({ id: 3, name: 'Pop Hits', UserId: 1 });
  const response = await request(app).post('/playlist').send({ name: 'Pop Hits' });
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('message', 'Playlist criada com sucesso');
  expect(playlistService.createPlaylist).toHaveBeenCalledWith({ name: 'Pop Hits', userId: 1 });
});
```
*O que verifica:* que a rota `POST /playlist` chama o Service com os dados corretos (incluindo o `userId` extraído da sessão simulada) e devolve `201` com o corpo esperado. *Mock:* `playlistService.createPlaylist` mockado via `vi.mock('../playlist.service.js')`; o middleware `isAuthenticated` mockado para injetar `req.session.user = { id: 1 }`. *Asserção:* `toBe(201)` (status HTTP), `toHaveProperty` (corpo da resposta) e `toHaveBeenCalledWith` (interação com o Service mockado).

**2) `GET /playlist/:id` → 403 quando playlist privada e sem permissão**
```js
it('deve retornar 403 quando a playlist é privada e o usuário não tem permissão', async () => {
  playlistService.getPlaylistById.mockResolvedValue({ id: 1, name: 'Privada', visibility: 'private', userId: 2 });
  playlistService.canViewPlaylist.mockReturnValue(false);
  const response = await request(app).get('/playlist/1');
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty('error');
});
```
*O que verifica:* que o controller respeita a permissão calculada pelo Service e bloqueia o acesso com `403` quando `canViewPlaylist` retorna `false`. *Mock:* `getPlaylistById` e `canViewPlaylist` mockados de forma independente, simulando uma playlist privada de outro usuário. *Asserção:* `toBe(403)` e `toHaveProperty('error')`.

## 6. Resultado da suíte completa

```
npx vitest run

 Test Files  16 passed (16)
      Tests  183 passed (183)
```

Antes da N3: 15 arquivos / 135 testes. Depois da N3: 16 arquivos / 183 testes — incremento de **48 testes** (35 unitários + 19 de integração no módulo `playlist`, descontados os 6 testes-esqueleto substituídos).

## 7. Cobertura de código (Nota 7)

Configuramos o `vitest.config.js` para gerar relatório de cobertura via provider `v8`, com os reporters `text` e `html`, excluindo as pastas que o enunciado pede para não considerar:

```js
coverage: {
  provider: 'v8',
  reporter: ['text', 'html'],
  include: ['src/**/*.js'],
  exclude: [
    '**/node_modules/**', '**/test/**', '**/__tests__/**',
    'src/config/**', 'src/middlewares/**',
    'src/server.js', 'src/app.js',
    'src/views/**', 'src/public/**'
  ]
}
```

Rodando `npx vitest run --coverage`, os dois módulos exigidos (linhas e funções) ficaram assim:

| Módulo | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| `modules/user` | 100 | 100 | **100** | **100** |
| `modules/playlist` | 96.33 | 96.07 | **100** | **95.55** |

Meta da N3 para nota 7: linhas e funções ≥ 80% em cada módulo. Resultado: **user em 100%/100%** e **playlist em 95.55%/100%** — ambos folgadamente acima do mínimo. O relatório HTML completo está na pasta `coverage/` (gerado por `npx vitest run --coverage`, incluído nesta entrega).

### Aumento dos testes unitários (mínimo 20 no total)

Somando os dois módulos exigidos: `user.service.test.js` (22 testes) + `playlist.service.test.js` (35 testes) = **57 testes unitários**, muito acima do mínimo de 20 pedido para a nota 7.

## 8. Apresentação (Nota 7)

O arquivo `APRESENTACAO_TDD_N3_MusicVibe.pptx` (8 slides) contém: capa com nome do projeto/aluno; visão geral da funcionalidade Playlist e suas regras de negócio; dois slides com o ciclo Red-Green-Refactor usando trechos de código reais (teste falhando antes, implementação que fez passar depois); dois slides com 5 testes unitários explicados (o que cada um verifica e qual mock foi usado); um slide com o relatório de cobertura (tabela reproduzindo a saída do terminal) e explicação das métricas Stmts/Branch/Funcs/Lines; e um slide de conclusão com lições aprendidas.

## 9. Como rodar o projeto e os testes

```bash
# 1. instalar dependências
npm install

# 2. configurar variáveis de ambiente (copiar e ajustar)
cp .env.example .env

# 3. rodar toda a suíte de testes (unitários + integração)
npm test
# ou, em modo non-watch:
npm run test:run

# 4. rodar apenas os testes do módulo novo (playlist)
npx vitest run src/modules/playlist

# 5. gerar o relatório de cobertura (HTML em coverage/)
npx vitest run --coverage

# 6. subir o servidor (requer MySQL configurado conforme .env)
npm start
```

## 10. Observação sobre entrega

O enunciado pede a URL do repositório GitHub como "recomendado, mas não eliminatório" para as faixas de nota 6,0, 7,0 e 8,0. Este projeto está sendo entregue como `.zip`; caso seja necessário também o repositório no GitHub, basta criar um repositório novo a partir desta pasta (`git init`, `git add .`, `git commit`, `git push`) antes do envio.
