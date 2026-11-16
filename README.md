# Praxis UI HTTP Examples

Exemplos HTTP executáveis e *fixtures* de payload para as superfícies públicas da [**Praxis Platform**](https://praxisui.dev/) — comprovando na prática como uma plataforma semanticamente orientada para aplicações corporativas *AI-native* descreve **recursos, regras, ações, dados e políticas uma única vez** para operar uniformemente por **interfaces tradicionais, interfaces generativas, agentes de IA e integrações HTTP**.

Este repositório não é a fonte canônica de verdade dos contratos da plataforma; ele atua como o corpus executável de provas e contrato de referência para LLMs e CI.

## Hierarquia Canônica no Ecossistema Praxis

| Projeto | Papel Canônico e Problema Resolvido |
| :--- | :--- |
| [`praxis-metadata-starter`](https://github.com/codexrodrigues/praxis-metadata-starter) | Vocabulário canônico de metadados (`@ApiResource`, `x-ui`, `/schemas/filtered`, `/schemas/domain`, `@WorkflowAction`, `@UiSurface`, stats e exportação). |
| [`praxis-config-starter`](https://github.com/codexrodrigues/praxis-config-starter) / [`praxis-config-contracts`](https://github.com/codexrodrigues/praxis-config-contracts) | Plano de controle (PAP): persistência de configuração de UI, `ai_registry`, grounding RAG, turnos agênticos e ciclo *maker-checker* de decisões (`/api/praxis/config/**`). |
| [`praxis-rules-engine`](https://github.com/codexrodrigues/praxis-rules-engine) | Motor determinístico de 5 estados em JSON Logic para **regras de negócio (`decisionKind = BUSINESS`)** avaliadas no Passo 12 sobre estado real sem mascaramento. |
| [`praxis-authz-contracts`](https://github.com/codexrodrigues/praxis-authz-contracts) · [`praxis-authz-enforcement-core`](https://github.com/codexrodrigues/praxis-authz-enforcement-core) · [`praxis-authz-opa`](https://github.com/codexrodrigues/praxis-authz-opa) · [`praxis-authz-starter`](https://github.com/codexrodrigues/praxis-authz-starter) (`0.1.0-beta.1`) | Família de **autorização e proteção de dados (`decisionKind = AUTHORIZATION`)**: PEP de 15 etapas, pushdown SQL Kleene 3VL (`DATA_SCOPE`), bloqueio pré-hidratação (`FIELD_WRITE`/`FIELD_USE`), mascaramento em 7 níveis, OPA Rego v1 e introspecção *Zero-Blueprint* (`PLAT-EVO-10`). |
| [`praxis-policy-studio`](https://github.com/codexrodrigues/praxis-policy-studio) | Workstation dual-lens (**Lente de Regras de Negócio** e **Lente de Acesso e Proteção de Dados**) para autoria, simulação e aprovação governada. |
| [`praxis-api-quickstart`](https://github.com/codexrodrigues/praxis-api-quickstart) & [`praxis-ui-angular`](https://github.com/codexrodrigues/praxis-ui-angular) | Backend operacional público implantado no Render e runtime oficial Angular `@praxisui/*`. |
| **`praxisui-http-examples`** *(este repositório)* | Requisições HTTP executáveis, payloads curados, manifesto de superfície LLM (`examples.manifest.json`) e smokes automatizados. |

### Valor para Grandes Sistemas, LLMs e Ganho em Tokens

Em integrações corporativas convencionais, agentes de IA desperdiçam milhares de tokens lendo controllers Java, DTOs, filtros SQL e configurações Spring para adivinhar headers, contratos de erro e formatos de resposta — e frequentemente erram contratos protegidos por falta de contexto mínimo. Com o corpus curado deste repositório (`llm_bootstrap.json`, `LLM_SURFACE.md`, `responseShapeHint` e matriz de pré-requisitos), uma LLM descobre **em uma única leitura compacta** quais rotas exigem sessão, ETag `If-Match` ou escopo de tenant, reduzindo alucinações, evitando loops de tentativas HTTP falhas e acelerando integrações automatizadas.

Alvos padrão:
- API pública: `https://praxis-api-quickstart.onrender.com`
- Host Angular local: `http://localhost:4003`, `http://127.0.0.1:4003`
- Host de landing local para validação Render: `http://localhost:4301`, `http://127.0.0.1:4301`

## Modelo de Status

Os exemplos são classificados em [`EXAMPLE_STATUS.md`](./EXAMPLE_STATUS.md) e em [`examples.manifest.json`](./examples.manifest.json).

Resumo operacional voltado para LLMs:
- [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md): guia canônico de entrada ("comece por aqui") para uma LLM sem contexto prévio
- [`llm_bootstrap.json`](./llm_bootstrap.json): bootstrap legível por máquina com trilhas seguras primeiro (*safe-first lanes*) e headers mínimos
- [`LLM_COMMON_QUESTIONS.md`](./LLM_COMMON_QUESTIONS.md): roteador curto para perguntas recorrentes apontando para a evidência exata
- [`LLM_SURFACE.md`](./LLM_SURFACE.md): resumo legível dos exemplos marcados com `llmOperational: true`
- [`OPENAPI_COVERAGE.md`](./OPENAPI_COVERAGE.md): auditoria gerada das bases OpenAPI publicadas cobertas pelo corpus HTTP

Runbooks locais de vitrine (*showcase*):
- [`BULK_OPERATIONS_RUNBOOK.md`](./BULK_OPERATIONS_RUNBOOK.md): referências protegidas do ciclo de lote P1/P2/P3, jornada preparatória `QUERY` e limites de evidência
- [`ENTITY_LOOKUP_PUBLICATION_RUNBOOK.md`](./ENTITY_LOOKUP_PUBLICATION_RUNBOOK.md): checklist de promoção para o piloto de *Entity Lookup* de compras após o backend Render publicar os endpoints do quickstart
- [`DOMAIN_RULES_PUBLICATION_RUNBOOK.md`](./DOMAIN_RULES_PUBLICATION_RUNBOOK.md): prova em runtime publicado de decisões semânticas governadas e materialização de elegibilidade de fornecedores
- [`DOMAIN_KNOWLEDGE_TIMELINE_RUNBOOK.md`](./DOMAIN_KNOWLEDGE_TIMELINE_RUNBOOK.md): prova protegida de timeline para *change sets* de Conhecimento de Domínio criados por IA

Rótulos principais:
- `runtime-confirmed`
- `recommended`
- `legacy`
- `illustrative-only`

Flags operacionais:
- `public`
- `session-auth-required`
- `tenant-scoped-headers-required`
- `auth-required` (alias obsoleto para `sessionAuthRequired || tenantScopedHeadersRequired`)
- `destructive`
- `requires-tenant-headers`
- `llmOperational`
- `protectedContract`
- `referenceOnly`
- `responseShapeHint`
- `runtimeRecordConfirmed`
- `selectorConfirmed`
- `publishedBackendConfirmed`
- `knownPublishedFailure`

## Estrutura de Pastas

- [`http/`](./http): exemplos de requisições executáveis
- [`http/resources/`](./http/resources): recursos de domínio com exemplos de consulta, filtro, ações e opções em `human-resources`, `operations` e `assets`
- [`http/config/`](./http/config): configuração remota de UI, contexto AI, `ai-registry`, sugestões AI e decisões de domínio governadas
- [`http/views/`](./http/views): controllers de projeções somente leitura como `VwPerfilHeroi`, `VwResumoMissoes`, `VwRankingReputacao` e `VwIndicadoresIncidentes`
- [`http/expansion-detail/`](./http/expansion-detail): schemas de detalhe contextual e exemplos de resolvedor de recursos
- [`payloads/`](./payloads): fixtures de corpo de requisição referenciadas pelos exemplos
- [`payloads/config/`](./payloads/config): payloads de config remota, contexto AI, templates de registry, sugestões e ciclo de vida de decisões de domínio
- [`http/operations/missao_participantes_bulk_query_journey.http`](./http/operations/missao_participantes_bulk_query_journey.http): referência preparatória autenticada de lote `QUERY`; a requisição exata não está confirmada no backend implantado
- [`payloads/views/`](./payloads/views): corpos de filtro e `locate` para controllers de visões agregadas
- [`env/`](./env): templates de ambiente
- [`smoke/`](./smoke): scripts de validação e smoke
- [`examples.manifest.json`](./examples.manifest.json): índice canônico de todos os exemplos
- [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md): ponto de entrada curto para bootstrap de LLM
- [`llm_bootstrap.json`](./llm_bootstrap.json): companheiro legível por máquina de `LLM_BOOTSTRAP.md`
- [`LLM_COMMON_QUESTIONS.md`](./LLM_COMMON_QUESTIONS.md): roteador rápido para dúvidas recorrentes de LLMs
- [`LLM_SURFACE.md`](./LLM_SURFACE.md): resumo curado da superfície operacional de LLM

## Modelo do Catálogo

O catálogo é organizado por **padrões de interação Praxis**, não apenas por entidades isoladas.

Grupos primários de controllers:
- descoberta de metadados e schemas filtrados (`/schemas/filtered`)
- superfícies de configuração remota e suporte de IA (`/api/praxis/config/**`)
- recursos de domínio com operações tipadas, padrões de filtro e *option sources*
- visões somente leitura agregadas com endpoints `filter`, `filter/cursor`, `locate`, `all`, `by-ids` e `options`
- controllers de detalhe expansível que retornam schemas dinâmicos de layout

Isso mantém os exemplos alinhados ao comportamento real em runtime de tabelas, detalhes, opções remotas e expansão orientada pelo host.

## Quick Start (Execução Local)

Instale as dependências:

```bash
npm install
```

Valide o catálogo e integridade do manifesto:

```bash
npm run verify:manifest
```

Regenere o relatório de cobertura OpenAPI publicada:

```bash
npm run generate:openapi-coverage
```

Execute os smokes públicos:

```bash
npm run smoke:public
```

Execute os smokes autenticados não destrutivos:

```bash
npm run smoke:auth
```

Execute a superfície operacional mais relevante para LLMs:

```bash
npm run smoke:llm-surface
```

Execute a prova de publicação de decisões semânticas governadas apenas contra um ambiente local isolado que forneça quatro sessões autenticadas distintas. Autor, revisor e publicador devem ser atores separados; `APPROVER_REF` identifica o requisito governado de aprovação, enquanto a autorização da revisão é decidida pela sessão do revisor:

```bash
BASE_URL=http://127.0.0.1:8088 \
ORIGIN=http://localhost:4003 \
TENANT_ID=domain-rules-local-proof \
ENVIRONMENT=local \
AUTHOR_USERNAME='<author>' AUTHOR_PASSWORD='<author-password>' \
REVIEWER_USERNAME='<reviewer>' REVIEWER_PASSWORD='<reviewer-password>' \
PUBLISHER_USERNAME='<publisher>' PUBLISHER_PASSWORD='<publisher-password>' \
READER_USERNAME='<reader>' READER_PASSWORD='<reader-password>' \
APPROVER_REF='<governed-approver-reference>' \
npm run smoke:domain-rules-publication
```

Esse smoke não registra credenciais nem cookies `SESSION` em log. Ele interrompe antes da primeira chamada HTTP se qualquer variável obrigatória faltar, cria um rascunho (`draft`), transita por `proposed` e `approved` com sessões separadas, publica e lê a materialização e a *option source* com a sessão de leitura. Trata-se de prova destrutiva de contrato protegido e não confirma superfície no backend público.

Os três arquivos HTTP de ciclo de vida permanecem operações separadas: a requisição de definição usa a `SESSION` do autor; a aprovação exige a definição já em `proposed` e usa a `SESSION` do revisor; a publicação exige a definição aprovada e usa a `SESSION` do publicador — não são um pacote único de copiar e colar. O smoke trata ainda a atualização de `XSRF-TOKEN` e o header `X-XSRF-TOKEN` exigido pelo `POST` protegido de *option-source* de fornecedores. A *fixture* de definição carrega `<reviewer-actor-ref>` como placeholder em `governance.requiredApprovals`; substitua-o pela referência do ator revisor do ambiente isolado antes de executar a requisição avulsa. As quatro entradas protegidas foram auditadas estruturalmente em 2026-09-13; sua data `lastVerified` não atesta execução HTTP nem altera `publishedBackendConfirmed: false`.

Valide o corpus local de determinações reativas sem iniciar backend:

```bash
npm run verify:reactive-determinations
```

Com o Quickstart rodando na porta local canônica e um cookie de sessão autenticado disponível, execute checagens de metadados de criação/edição, capacidades bem-sucedidas e casos `422`:

```bash
PRAXIS_SESSION_COOKIE=<session-value> REQUIRE_AUTH_EXECUTION=true npm run smoke:reactive-determinations
# Folha G4 é uma trilha separada derivada do código-fonte; consulte PAYROLL_G4_CONTRACT.md para pré-requisitos de host.
```

## Matriz de Pré-Requisitos de Endpoints

Consulte esta matriz antes de copiar headers de qualquer exemplo individual — ela é a visão canônica de pré-requisitos por classe para montar requisições válidas:

| Classe de Endpoint | Escopo Típico | Aceito Agora no Backend Publicado | Headers Recomendados Estáveis | Origin |
|---|---|---|---|---|
| Metadados públicos | `health`, `openapi-docs`, `schemas-catalog`, schemas filtrados | `Accept: application/json` | nenhum | não exigido |
| Recursos e visões auth-light | Leituras de `resources`, `views` e `expansion-detail` no backend publicado | `Accept: application/json`; adicione `Content-Type: application/json` para `POST` | `X-Tenant-ID: demo`, `X-Env: public`, `X-User-ID: example-user` | não exigido |
| Leitura protegida de decisão governada | Leitura local de materialização `domain-rules` protegida | `Accept: application/json`, `X-Tenant-ID`, `X-Env` | `SESSION` autenticada de leitor | exigido |
| Lookup histórico publicado governado | Prova histórica confirmada de *option-source* de fornecedores | `Accept: application/json`, `Content-Type: application/json` | seus headers versionados de tenant, ambiente e usuário | evidência histórica publicada; fora do smoke local |
| `config/ui` protegido | Contratos canônicos de config remota de UI | `Accept: application/json`, `X-Tenant-ID: demo`, `Origin: http://localhost:4301` | `X-User-ID: demo-user-1`, `X-Env: local`, `Content-Type: application/json` para `PUT` | exigido no backend publicado |
| `ai-context` / `ai-registry` protegido | Contratos canônicos de configuração de IA | `Accept: application/json`, `X-Tenant-ID: demo`, `Origin: http://localhost:4301` | `X-Env: local`, `Content-Type: application/json` para `POST` e `PUT` | exigido no backend publicado |
| Escritas protegidas em `domain-rules` | Entrada de decisões semânticas governadas, definição, aprovação e publicação | Escritas amparadas por contrato, fora da trilha segura padrão de LLM | Tenant isolado, `X-Env`, `Content-Type: application/json` e cookies `SESSION` específicos por papel | siga a política de config protegida antes de executar contra ambientes compartilhados |

Observações da matriz:
- Metadados públicos não devem incluir headers de tenant ou usuário salvo depuração específica.
- Recursos e visões *auth-light* são atualmente aceitos no backend publicado sem headers de tenant nos exemplos confirmados da superfície de LLM.
- Para uso *auth-light*, prefira o trio estável `X-Tenant-ID: demo`, `X-Env: public` e `X-User-ID: example-user` quando desejar comportamento determinístico por tenant.
- A leitura local de materialização usa o tenant isolado de prova de `smoke:domain-rules-publication`; utilize apenas para inspeção de evidência.
- Leituras de `config/ui` normalmente exigem `X-Tenant-ID`, `X-User-ID`, `X-Env` e `Origin` permitido, embora o exemplo versionado possa apontar para um seletor sem registro concreto confirmado no backend publicado.
- Leituras de `ai-context` e `ai-registry` exigem `Origin` permitido; os exemplos confirmados atualmente aceitam `X-Tenant-ID` como mínimo factual neste repositório.
- Em qualquer chamada `POST` ou `PUT` com corpo JSON, envie sempre `Content-Type: application/json`.

## Notas Operacionais e Contrato das Flags

- `smoke:public` cobre somente exemplos com `public: true`, `sessionAuthRequired: false`, `tenantScopedHeadersRequired: false` e `destructive: false`.
- `smoke:auth` utiliza uma *whitelist* curada de exemplos não destrutivos confirmados com sucesso no backend Render (subconjunto de `resources`, `views`, `options` e `expansion-detail`).
- `smoke:llm-surface` combina o corpus público com os exemplos *auth-light* úteis operacionalmente para descoberta guiada por LLMs no backend publicado.
- Exemplos de *Procurement Entity Lookup* já estão confirmados no Render e integram a superfície operacional de LLM (consulte [`ENTITY_LOOKUP_PUBLICATION_RUNBOOK.md`](./ENTITY_LOOKUP_PUBLICATION_RUNBOOK.md) antes de alterar `knownPublishedFailure`, `publishedBackendConfirmed` ou `llmOperational`).
- O CI executa atualmente `npm run verify:manifest`, `npm run smoke:llm-surface` e `npm run smoke:corpus-promises`. `smoke:public` e `smoke:auth` seguem disponíveis localmente.
- `smoke:bootstrap-minimums` valida contra o backend publicado os mínimos aceitos declarados em `llm_bootstrap.json`.
- `llmOperational: true` em [`examples.manifest.json`](./examples.manifest.json) marca os exemplos pertencentes à superfície operacional voltada a LLMs no backend publicado.
- `responseShapeHint` oferece uma resposta compacta sobre a forma do retorno (`array<option>`, `page<option>`, `restApiResponse<page<row>>`, `detail-schema`, `config-record`, `shadow-observation`).
- `runtimeRecordConfirmed: true` indica confirmação direta em runtime no modelo de evidências; `selectorConfirmed: true` indica que o caminho/seletor permanece útil mesmo se o registro concreto não estiver no Render; `publishedBackendConfirmed: true` indica confirmação real em `https://praxis-api-quickstart.onrender.com`; `knownPublishedFailure: true` marca falha conhecida (cenário negativo intencional ou instabilidade remota).
- Exemplos governados de lookup cujo id contenha `entity-lookup` ou `light-lookup` devem manter o *frontmatter* `.http` alinhado ao [`examples.manifest.json`](./examples.manifest.json) usando `illustrative-only` quando não confirmados no backend publicado.
- Schemas, prévias e comandos financeiros de Folha G4 são candidatos derivados do código-fonte sem confirmação no backend publicado; leia o [Contrato G4 de Folha (`PAYROLL_G4_CONTRACT.md`)](./PAYROLL_G4_CONTRACT.md) antes de referenciá-los (`npm run verify:manifest` executa o verificador G4 offline; `npm run smoke:payroll-g4` mira host provisionado).
- `sessionAuthRequired: true` exige sessão autenticada real; `tenantScopedHeadersRequired: true` indica uso estável de `X-Tenant-ID`, `X-User-ID` e `X-Env` (`authRequired` e `requiresTenantHeaders` são aliases legados mantidos apenas para compatibilidade).
- `protectedContract: true` destaca contratos estratégicos (como `/api/praxis/config/ui`, `ai-context` e `ai-registry`) fora da superfície operacional padrão; `referenceOnly: true` marca exemplos para ressalvas, fluxos protegidos, escritas ou troubleshooting (vencendo `recommended` na seleção padrão). `status: []` indica relevância de catálogo sem reivindicação forte de runtime.
- No backend Render publicado, `/api/praxis/config/**` exige header `Origin` permitido (`http://localhost:4003`, `http://127.0.0.1:4003`, `http://localhost:4301`, `http://127.0.0.1:4301`). Alguns exemplos protegidos de leitura já incluem `Origin: http://localhost:4301`; exemplos de escrita apenas documentam a exigência para evitar mutação acidental.
- `destructive: true` engloba remoções (`DELETE`) e escritas protegidas que mutam estado remoto no backend publicado; `lastVerified` registra apenas a data da última auditoria do item (avalie confiança pelos rótulos `status`, nunca apenas pela data).
- Exemplos *auth-light* confirmados como `funcionarios-filter-basic`, `veiculos-filter-basic`, `incidentes-filter-basic`, `vw-resumo-missoes-filter-basic`, `vw-indicadores-incidentes-filter-basic` e `cargos-options-by-ids` não exigem sessão autenticada; já `vw-perfil-heroi/**` e rotas analíticas de folha exigem autoridades de domínio em sessão autenticada (e `vw-resumo-missoes/options/by-ids` permanece excluído do `smoke:auth` por retornar `500` no Render).
- Os exemplos de escrita em `domain-rules` modelam a prova corporativa ponta a ponta (entrada, simulação, aprovação, publicação e leitura de materialização), em que permissões decorrem exclusivamente das sessões autenticadas.
- `acordos-regulatorios-governed-actions` documenta a execução manual protegida de um workflow versionado: leitura do ETag, suspensão idempotente, replay com o token original e reintegração de limpeza (fora da superfície LLM operacional antes da migration proprietária).
- `ui_get_table.http` continua como exemplo de contrato protegido (sem confirmação do `componentId` específico no backend publicado); para `config/ui`, prefira os exemplos confirmados de validação protegida (`missing-tenant`, `invalid-origin`, `legacy-component-type`).
- Não infira contratos canônicos de persistência a partir de exemplos `illustrative-only` ou `legacy`; em caso de conflito, o comportamento real do backend/runtime prevalece.

## Política de CI e publicação

Validação local durante desenvolvimento; Actions apenas no fechamento necessário de versões. Consulte [ACTIONS-RELEASE-POLICY.md](ACTIONS-RELEASE-POLICY.md) para gatilhos, gates e recuperação.

## Atualização versionada de funcionário

O exemplo `http/resources/funcionarios_update.http` exige sessão autenticada e, quando habilitado pelo host, token CSRF. Execute primeiro `funcionarios_get_by_id.http` no mesmo recurso e escopo. Preserve o ETag forte exato da resposta (inclusive aspas), prepare o payload com os campos declarados pelo schema de update e copie o token para `resourceEtag`. O payload estático é ilustrativo; não deve substituir dados de um registro compartilhado.

O `PUT` envia `If-Match`; `428` indica precondição ausente e `412` indica revisão obsoleta — nesse caso recarregue e reconcilie os dados antes de nova tentativa, sem obter um ETag novo para reenviar automaticamente um payload antigo. O `PUT` cadastral não deve enviar `ativo` (nem como `null` nem igual à leitura), usando `deactivate`/`reactivate` para transições de ciclo de vida. O exemplo permanece `referenceOnly` enquanto aguarda nova prova HTTP em Neon isolado.
