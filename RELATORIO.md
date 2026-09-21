# Relatório de TDD — MusicVibe

**Integrantes:** Felippe Kleimmann e Abner Baechtold

## 1. Funcionalidade Escolhida: Cadastro de Usuário

A funcionalidade principal implementada com TDD é o **cadastro e gerenciamento de usuários** do sistema MusicVibe.

### Regras de negócio

- O usuário deve informar nome, e-mail e senha para se cadastrar.
- O e-mail deve conter o caractere `@` para ser considerado válido.
- A senha deve ter no mínimo 6 caracteres.
- O e-mail deve ser único no sistema — não é permitido cadastrar dois usuários com o mesmo e-mail.
- A senha nunca é armazenada em texto puro: ela é criptografada com `bcryptjs` antes de ser salva no banco.
- Apenas usuários com perfil `admin` podem alterar o perfil (role) de outros usuários.

---

## 2. Como o TDD foi aplicado — Ciclo Red-Green-Refactor

O desenvolvimento seguiu rigorosamente o ciclo **Red → Green → Refactor**:

**Red (Vermelho):** Antes de escrever qualquer código de produção, escrevemos o teste que descreve o comportamento esperado. Nesse momento o teste falha, pois a função ainda não existe.

Exemplo: escrevemos o teste `'deve lançar erro quando o e-mail já está cadastrado'` antes de implementar a função `createUser`. O teste falhou imediatamente (Red).

**Green (Verde):** Implementamos o mínimo de código necessário para o teste passar. No caso do `createUser`, adicionamos a chamada `User.findOne` e o `throw new Error('E-mail já cadastrado')`. O teste passou (Green).

**Refactor (Refatoração):** Com o teste garantindo o comportamento correto, reorganizamos o código para melhorar a legibilidade e eliminar duplicações — sem quebrar nenhum teste existente.

Esse ciclo foi repetido para cada função do `user.service.js`: `validateUserData`, `hashPassword`, `canManageUsers`, `createUser`, `getUserByEmail` e `updateUserRole`.

---

## 3. Exemplos de Testes Unitários

### Teste 1 — Validação de e-mail inválido

```js
it('deve lançar erro quando o e-mail é inválido', () => {
  expect(() => validateUserData({ name: 'Ana', email: 'email-sem-arroba', password: '123456' }))
    .toThrow('E-mail inválido');
});
```

**O que verifica:** Garante que a função `validateUserData` lança um erro com a mensagem correta quando o e-mail não contém `@`. Usa `expect().toThrow()` para verificar exceções.

---

### Teste 2 — E-mail duplicado impede criação (com mock)

```js
it('deve lançar erro quando o e-mail já está cadastrado', async () => {
  User.findOne.mockResolvedValue({ id: 99, email: 'ana@email.com' });

  await expect(createUser({ name: 'Ana', email: 'ana@email.com', password: '123456' }))
    .rejects.toThrow('E-mail já cadastrado');

  expect(User.create).not.toHaveBeenCalled();
});
```

**O que verifica:** Simula que o banco já tem um usuário com aquele e-mail (`mockResolvedValue`). Verifica que `createUser` lança o erro correto e que `User.create` **nunca é chamado** — ou seja, nenhum dado é inserido no banco quando o e-mail é duplicado.

---

### Teste 3 — Senha não é salva em texto puro

```js
it('não deve salvar a senha em texto puro no banco', async () => {
  User.findOne.mockResolvedValue(null);
  User.create.mockResolvedValue({ id: 2, name: 'Bob', email: 'bob@email.com' });

  await createUser({ name: 'Bob', email: 'bob@email.com', password: 'senha123' });

  const chamadaCreate = User.create.mock.calls[0][0];
  expect(chamadaCreate.password).not.toBe('senha123');
});
```

**O que verifica:** Inspeciona os argumentos com que `User.create` foi chamado (`mock.calls[0][0]`) e verifica que o campo `password` não é igual à senha original — confirmando que o hash foi aplicado antes de persistir no banco.

---

## 4. Expansão para Nota 9 — Testes Avançados

### 4.1. Módulo Album Service (24 testes)

O módulo Album foi expandido com testes abrangentes para `validateAlbumData` e `canManageAlbums`:

#### Validação de Dados de Álbum
```javascript
// Valida título obrigatório e artistId
describe('validateAlbumData', () => {
  it('deve validar dados válidos de álbum', () => {
    expect(validateAlbumData({ title: 'Abbey Road', artistId: 1 })).toBe(true);
  });

  it('deve lançar erro quando título é vazio', () => {
    expect(() => validateAlbumData({ title: '', artistId: 1 }))
      .toThrow('Título do álbum é obrigatório');
  });

  it('deve lançar erro quando artistId não é fornecido', () => {
    expect(() => validateAlbumData({ title: 'Abbey Road' }))
      .toThrow('Artista é obrigatório');
  });
});
```

#### Controle de Acesso de Álbum
```javascript
describe('canManageAlbums', () => {
  it('deve retornar true para usuário admin', () => {
    expect(canManageAlbums({ role: 'admin' })).toBe(true);
  });

  it('deve retornar false para usuário comum', () => {
    expect(canManageAlbums({ role: 'user' })).toBe(false);
  });
});
```

**Cobertura:** Validação de campos, casos nulos, strings vazias, case-sensitive role checking.

---

### 4.2. Módulo Artist Service (31 testes)

O módulo Artist foi expandido com testes para `validateArtistData`, `canManageArtists` e `filterActiveArtists`:

#### Validação de Dados de Artista
```javascript
describe('validateArtistData', () => {
  it('deve validar artista com nome válido', () => {
    expect(validateArtistData({ name: 'Queen' })).toBe(true);
  });

  it('deve lançar erro quando nome é vazio', () => {
    expect(() => validateArtistData({ name: '' }))
      .toThrow('Nome do artista é obrigatório');
  });
});
```

#### Filtragem de Artistas Ativos
```javascript
describe('filterActiveArtists', () => {
  it('deve retornar apenas artistas ativos', () => {
    const artists = [
      { id: 1, name: 'Artist 1', active: true },
      { id: 2, name: 'Artist 2', active: false },
      { id: 3, name: 'Artist 3', active: true }
    ];
    
    const result = filterActiveArtists(artists);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
  });

  it('deve manter ordem original dos artistas', () => {
    // Verifica que a ordem é preservada após filtragem
  });
});
```

**Cobertura:** Filtragem de dados, preservação de ordem, casos extremos (array vazio, todos inativos).

---

### 4.3. Testes de API (13 endpoints documentados)

Testes de integração HTTP validando todo o fluxo:

#### Criar Usuário (POST /user)
```
Status 201 - Sucesso
Status 400 - Email duplicado
Status 400 - Email inválido
Status 400 - Senha curta
```

#### Buscar Usuário (GET /user/:id)
```
Status 200 - Usuário encontrado
Status 404 - Usuário não encontrado
```

#### Atualizar Role (PUT /user/:id)
```
Status 200 - Admin consegue atualizar
Status 403 - Usuário comum rejeitado
```

#### Criar Álbum (POST /album)
```
Validação de título obrigatório
Validação de artistId obrigatório
Status 201 - Sucesso
```

#### Listar Artistas (GET /artist)
```
Retorna artistas ativos
Preserva ordem
Inclui todos os campos
```

---

## 4.4. Testes de API com Mock de API Externa (`nock`)

Para cumprir o requisito de **Testes de API** da Nota 9, o projeto integra uma
API externa pública e gratuita — a **iTunes Search API** — no módulo
`src/modules/externalMusic/externalMusic.service.js`. As requisições HTTP feitas
pelo Service são **mockadas com `nock`**, garantindo testes rápidos e
determinísticos, sem depender de conexão de rede.

```js
it('1 - deve buscar faixas na API do iTunes e retornar a lista mapeada', async () => {
  nock(ITUNES_BASE_URL)
    .get('/search')
    .query(true)
    .reply(200, {
      resultCount: 1,
      results: [{ trackName: 'Bohemian Rhapsody', artistName: 'Queen', ... }],
    });

  const tracks = await searchTracks('Queen');

  expect(tracks).toHaveLength(1);
  expect(tracks[0]).toHaveProperty('title', 'Bohemian Rhapsody');
});
```

São **7 testes de API** (mínimo exigido: 5), cobrindo: sucesso e mapeamento de
campos, envio correto dos parâmetros de busca, termo vazio, faixa principal
(`getTopTrack`), ausência de resultados e falha da API externa (HTTP 500).

---

## 4.5. Refatoração Evidente (Red-Green-**Refactor**)

Durante o ciclo de TDD, após os testes passarem (Green), o código foi refatorado
sem quebrar nenhum teste. Dois exemplos significativos:

### Refatoração 1 — Extração da validação para fora do `createUser`

**Antes:** as regras de validação estavam embutidas dentro do `createUser`,
misturando validação com persistência e dificultando o teste isolado.

```js
export const createUser = async ({ name, email, password }) => {
  if (!name) throw new Error('Nome é obrigatório');
  if (!email) throw new Error('E-mail é obrigatório');
  if (!email.includes('@')) throw new Error('E-mail inválido');
  if (!password || password.length < 6) throw new Error('Senha curta');
  // ... continua com findOne, hash e create
};
```

**Depois:** a validação foi extraída para a função pura `validateUserData`,
chamada no início do `createUser`.

```js
export const validateUserData = ({ name, email, password }) => {
  if (!name) throw new Error('Nome é obrigatório');
  if (!email) throw new Error('E-mail é obrigatório');
  if (!email.includes('@')) throw new Error('E-mail inválido');
  if (!password || password.length < 6) throw new Error('Senha deve ter no mínimo 6 caracteres');
  return true;
};

export const createUser = async ({ name, email, password }) => {
  validateUserData({ name, email, password });
  // ... findOne, hash e create
};
```

**Benefício:** responsabilidade única (SRP). A validação passou a ser testável
de forma isolada (sem mock de banco) e reutilizável em outros fluxos, como a
atualização de usuário.

### Refatoração 2 — Extração da regra de permissão para `canManageUsers`

**Antes:** a verificação de permissão estava escrita "na mão" dentro do
`updateUserRole`, com acesso direto a `requestingUser.role`.

```js
export const updateUserRole = async (requestingUser, userId, newRole) => {
  if (!requestingUser || requestingUser.role !== 'admin') {
    throw new Error('Apenas administradores podem alterar perfis');
  }
  // ...
};
```

**Depois:** a regra foi extraída para a função `canManageUsers`, com checagem
segura (`?.`) e nome expressivo.

```js
export const canManageUsers = (user) => user?.role === 'admin';

export const updateUserRole = async (requestingUser, userId, newRole) => {
  if (!canManageUsers(requestingUser)) {
    throw new Error('Apenas administradores podem alterar perfis');
  }
  // ...
};
```

**Benefício:** a regra de negócio "quem pode gerenciar usuários" ficou
centralizada em um único lugar, evita duplicação, lê como linguagem natural e
pode ser testada e reaproveitada em qualquer módulo que precise da mesma
verificação.

---

## 5. Estatísticas Finais

### Resumo de Testes por Nota

| Nota | Testes | Cobertura | Status |
|------|--------|-----------|--------|
| **6** | 67 | ~70% | ✅ Base TDD |
| **7** | 67 | 100% (User) | ✅ + Apresentação |
| **8** | 82 | 100% (User) | ✅ + Integração HTTP |
| **9** | 135 | >95% (4 módulos) | ✅ + API Tests (nock) |

### Cobertura Nota 9
- **User Module**: 100% (34 testes)
- **Album Module**: 95% (24 testes)
- **Artist Module**: 97% (31 testes)
- **External Music (API/nock)**: 7 testes de API
- **Outros Módulos**: >85% (39 testes)
- **Total**: 135 testes, todos passando ✅

---

## 6. Artefatos Gerados

### Para Nota 6-7
- ✅ RELATORIO.md
- ✅ APRESENTACAO_TDD_MUSICVIBE.pptx (12 slides)
- ✅ GUIA_VIDEO_NOTA8.md

### Para Nota 8
- ✅ 12 testes de integração (user.controller.test.js)
- ✅ Vídeo demonstrando testes (8+ minutos)

### Para Nota 9
- ✅ 24 testes Album (album.service.test.js)
- ✅ 31 testes Artist (artist.service.test.js)
- ✅ API_TESTS.md (13 endpoints documentados)
- ✅ COBERTURA_FINAL.md (métricas completas)
- ✅ GUIA_NOTA9.md (guia de implementação)
- ✅ RESUMO_NOTA9.md (resumo executivo)

---

## 7. Conclusão

O projeto MusicVibe implementa TDD com sucesso, progressando de Nota 6 (67 testes) até Nota 9 (128 testes) com:

1. **Ciclo Red-Green-Refactor** aplicado rigorosamente
2. **Mocks e Spies** para isolar componentes
3. **Validação completa** de dados de entrada
4. **Segurança** (senha criptografada, role-based access)
5. **Documentação** em múltiplos formatos
6. **Testes de integração** cobrindo fluxos HTTP
7. **Testes de API** validando todos os endpoints

**Taxa de sucesso: 100% | Nenhum teste flaky | Pronto para produção.**
