# Plano de Gerência de Configuração de Software — MusicVibe

| Controle do documento | Valor |
|---|---|
| Identificador | IC-DOC-PGCS-001 |
| Versão | 1.0 |
| Data | 09/11/2026 |
| Responsável | Felippe Kleimmann — @felippekleimmann |
| Repositório oficial | https://github.com/felippekleimmann/musicvibe |
| Atividade | N2-P2 — execução do plano de GCS, Aula 1 |
| Prazo da atividade | 16/11/2026 às 22:30, horário de Brasília |

## 1. Objetivo e escopo

Controlar a identificação, alteração, revisão e rastreabilidade dos itens de
configuração do MusicVibe, aplicação Node.js/Express com EJS, Sequelize, MySQL
e testes Vitest. O plano abrange código, testes, dependências, documentação,
modelos de colaboração e configurações do GitHub.

Este documento é um item de configuração versionado no próprio repositório.
Suas alterações seguem o mesmo fluxo de branch, Pull Request (PR) e revisão
aplicado ao código. A versão inicial é publicada durante a preparação do
repositório, antes da ativação da proteção, conforme a Aula 1.

Referência: [Aula 1 — Preparar o repositório do seu projeto](https://github.com/lzcamargo/ongconecta/blob/main/docs/aulas/aula-1-repositorio.md).

## 2. Papéis e responsabilidades

| Papel | Responsável | Responsabilidade |
|---|---|---|
| Desenvolvedor líder e gestor de configuração | @felippekleimmann | Manter este plano, permissões, proteção da main, ambientes e histórico |
| Autor da mudança | Desenvolvedor da branch | Descrever a alteração, seus riscos e sua validação no PR |
| Par de revisão | A definir; convite ainda não enviado | Aceitar acesso de escrita, revisar PRs e aprovar ou solicitar ajustes |
| Aprovador de produção | @felippekleimmann | Autorizar execuções que utilizem o environment production |

O par precisa ser outra pessoa: o GitHub não permite ao autor aprovar o
próprio PR. A definição do colega e o aceite do convite são pendências da
entrega; este plano não declara esse requisito como concluído.

## 3. Ferramentas, ambientes e branches

### 3.1 Ferramentas

Git mantém o histórico; GitHub hospeda o repositório público, PRs, Issues,
permissões e environments. GitHub Actions executa o workflow
`.github/workflows/ci.yml`. O arquivo `package-lock.json` fixa a resolução de
dependências para instalação com `npm ci`.

### 3.2 Ambientes

| Ambiente | Uso e política |
|---|---|
| Local | Desenvolvimento e testes; valores de conexão em `.env` não versionado |
| staging | Environment GitHub de homologação; permite somente branches protegidas |
| production | Environment GitHub com @felippekleimmann como revisor obrigatório; permite somente branches protegidas |

Em `production`, a opção de impedir autoaprovação de deployment fica desativada,
como determina a Aula 1, para o líder poder autorizar uma execução iniciada por
ele. O bypass de proteção do environment por administradores fica desativado.
Isso não permite aprovar o próprio PR: revisão de código e aprovação de
deployment são controles distintos.

Os environments configurados não significam que a aplicação esteja hospedada.
O escopo desta entrega é a preparação da Aula 1; não há workflow de deploy
implementado no MusicVibe nesta etapa. Quando houver, seus jobs deverão declarar
`environment: staging` ou `environment: production` para aplicar essas regras.

### 3.3 Branching e integração

- `main`: linha principal estável; nenhuma alteração por push direto, inclusive do administrador.
- `feature/<issue>-<descricao>`: funcionalidades.
- `fix/<issue>-<descricao>`: correções.
- `docs/<descricao>` e `chore/<descricao>`: documentação e manutenção.
- PR obrigatório para `main`, com pelo menos uma aprovação de outra pessoa.
- Novos commits invalidam aprovações anteriores; o revisor deve conferir novamente.
- Histórico linear, sem force push e sem exclusão da branch protegida.
- Apenas squash merge; mensagem formada pelo título e descrição do PR.
- Exclusão automática das branches após merge.
- Títulos seguem Conventional Commits: `feat:`, `fix:`, `docs:`, `test:` ou `chore:`.

O workflow de testes já existente continua executando em pushes e PRs para
`main`. A Aula 1 não exige status checks obrigatórios na proteção; essa exigência
fica para a etapa de integração contínua. Falhas devem ser analisadas antes do
merge, mesmo sem bloqueio automático por status check nesta etapa.

## 4. Identificação dos itens de configuração

### 4.1 Inventário

| Identificador | Caminho / item | Controle |
|---|---|---|
| IC-SRC-001 | `src/` | Código, modelos, rotas, páginas e recursos versionados |
| IC-TST-001 | `test/`, `src/modules/**/__tests__/`, `vitest.config.js` | Testes e configuração de cobertura |
| IC-DEP-001 | `package.json`, `package-lock.json` | Dependências e scripts de execução reproduzíveis |
| IC-CFG-001 | `.gitignore`, `.gitattributes`, `.env.example` | Exclusões, finais LF e exemplo de configuração |
| IC-CI-001 | `.github/workflows/ci.yml` | Pipeline de testes e cobertura |
| IC-COL-001 | `.github/CODEOWNERS`, templates de PR e Issues | Responsabilidades e solicitação de mudanças |
| IC-DOC-PGCS-001 | `docs/PLANO_GCS.md` | Este plano |
| IC-DOC-001 | `README.md`, relatórios e apresentações existentes | Instruções e documentação do projeto |
| IC-EVD-001 | `docs/evidencias/` | Evidências reais da execução e verificação |
| IC-GH-001 | Settings do GitHub | Proteção, merges, colaboradores e environments; registrados em evidências |

`.env`, `node_modules/` e `coverage/` ficam fora do controle de versão. O exemplo
de ambiente contém apenas valores locais ilustrativos e campos para preencher;
credenciais reais devem permanecer fora do repositório. Não publicar tokens,
senhas de serviços ou dados pessoais em Issues, logs ou evidências.

### 4.2 Solicitação de mudança

Registrar funcionalidades e defeitos em Issues usando os modelos do repositório.
Cada PR informa contexto, decisão, modo de verificar e Issue associada, quando
aplicável. Mudanças em autenticação, permissões, esquema do banco ou dados de
usuários exigem descrição de impacto e recuperação; o líder e o par devem
examinar esses riscos na revisão.

## 5. Controle de mudanças e verificação

1. Atualizar a cópia local da `main` e criar uma branch de trabalho.
2. Implementar a mudança e atualizar documentação e testes quando aplicável.
3. Executar `npm ci` e `npm run test:coverage` para mudanças que afetem código ou pipeline.
4. Fazer commit, enviar a branch e abrir PR para `main` com o template.
5. O par com acesso de escrita revisa o diff, a validação e os riscos.
6. Após aprovação e análise do CI, integrar por squash e excluir a branch.
7. Atualizar evidências quando a mudança alterar controles da entrega.

A verificação da proteção usa uma tentativa real de enviar um commit vazio
diretamente para `main`. Registrar comando, saída, código de retorno e SHA da
branch antes e depois. A evidência só atesta recusa se o servidor rejeitar o
push e a `main` permanecer no mesmo SHA. Não desativar a proteção para esse teste.

## 6. Baselines, liberação e recuperação

A primeira baseline desta atividade é o commit integrado que publica este
plano e os modelos, antes da proteção. Commits seguintes na `main` são rastreados
por SHA e PR. Releases futuras devem usar tags `vMAJOR.MINOR.PATCH` e documentar
as alterações; não se afirma a existência de uma release nesta entrega.

Não reescrever o histórico da `main`. Para recuperar uma mudança incorreta,
criar uma branch, aplicar `git revert <sha>`, validar e submeter um novo PR ao
par. Backups do banco e rollback de infraestrutura precisam ser definidos
antes de um deploy real; o repositório Git não substitui backup de dados.

## 7. Auditoria e critérios de aceite

O líder confere o repositório sem autenticação e registra as configurações
pela API ou interface do GitHub. As evidências devem distinguir configuração
aplicada, teste realizado e pendência humana.

| Critério N2-P2 | Evidência esperada |
|---|---|
| Organização e plano publicado | README, inventário e este arquivo acessíveis na main |
| Acesso ao repositório | Repositório público acessível sem autenticação |
| Recusa de push direto | Registro real em `docs/evidencias/` |
| Par com escrita | Permissão `push`/Write confirmada após o aceite; convite pendente não basta |
| staging e production | Configuração dos dois environments e revisão obrigatória por @felippekleimmann |

## 8. Histórico do plano

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 09/11/2026 | Plano inicial adaptado ao MusicVibe para N2-P2 / Aula 1 |
