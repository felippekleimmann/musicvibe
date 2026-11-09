# Evidências da N2-P2

Responsável: @felippekleimmann. Preparação iniciada em 09/11/2026.

O [plano de GCS](../PLANO_GCS.md) está versionado neste repositório. Esta pasta
concentra os registros reais de verificação; não substitui revisão por outra pessoa.

## Par de revisão — pendente

O colega correto ainda precisa ser identificado. O convite para a conta
`ricardomacedo` foi cancelado a pedido do usuário após informar que a conta
estava incorreta. Nenhum convite está ativo e essa conta não recebeu escrita.
[Registro do cancelamento](par-revisao.json). Para concluir:

1. Escolher o usuário GitHub do par.
2. Acessar **Settings → Collaborators → Add people** e convidá-lo com acesso de escrita.
3. Solicitar ao colega que aceite o convite.
4. Confirmar a permissão de escrita e registrar a verificação por PR.
5. O colega revisa o PR de evidências e, se estiver correto, aprova para squash merge.

O convite sem aceite não atende ao critério de acesso de escrita.

## Registros reais de 09/11/2026

- [Recusa de push direto na main](recusa-push-main.txt): tentativa feita com a conta administradora; rejeitada por `GH006` e `protected branch hook declined`, código de saída 1. SHA da main igual antes e depois.
- [Verificação das configurações pela API](verificacao-github.json): proteção, regras de merge, environments, colaboradores e acesso público sem autenticação.
- [Plano publicado na main](https://github.com/felippekleimmann/musicvibe/blob/main/docs/PLANO_GCS.md).
- [PR inicial de preparação, integrado antes da proteção](https://github.com/felippekleimmann/musicvibe/pull/1).
- [CI aprovado na main](https://github.com/felippekleimmann/musicvibe/actions/runs/42691037456).

| Critério da atividade | Situação verificada |
|---|---|
| Organização e plano como item de configuração | Plano publicado na main; templates, CODEOWNERS, lockfile e .gitattributes presentes |
| Repositório acessível | Público; repositório e plano retornaram HTTP 200 sem autenticação |
| Evidência de recusa de push na main | Recusa real registrada no arquivo de texto acima |
| Par de revisão com escrita | **Pendente: colega correto a definir; convite incorreto cancelado** |
| staging e production com o líder como revisor de produção | Configurados; somente branches protegidas e revisão obrigatória por @felippekleimmann em production |

Validação local: `npm ci` e `npm run test:coverage`; 16 arquivos e 183 testes
passaram, cobertura de linhas de 89,01%. O CI do GitHub também passou.

Estes registros foram produzidos após a ativação da proteção e estão sujeitos
a PR com uma aprovação. Enquanto o par não aprovar o PR, consulte os arquivos
na branch do PR; eles ainda não estão integrados à main.
