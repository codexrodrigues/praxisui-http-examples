# LLM Bootstrap

Canonical safe-first entry point for a cold LLM using the published Praxis backend.

Last reviewed: `2026-04-26`

Use this file to answer: "what can I use right now?" without opening the full manifest.

## Comece Por Aqui

1. Start with public metadata. No tenant headers, no login, no mutation.
2. If you need real business data, move to the auth-light lane.
   The loosest accepted request on the published backend is lighter than the stable scoped form; add `X-Tenant-ID`, `X-Env`, and `X-User-ID` when you want deterministic tenant-aware behavior.
3. If you need governed semantic decision proof, use the read-only governed decision lane.
4. Use protected config endpoints only when you need canonical contract understanding for `config/ui`, `ai-context`, or `ai-registry`.
5. Avoid destructive, unstable, cursor-heavy, or troubleshooting examples by default.

## Safe-First Endpoints

### Public metadata

Use these first when you need discovery, request shape, or response shape:

- `health` -> `http/metadata/health.http`
- `openapi-docs` -> `http/metadata/openapi_docs.http`
- `schemas-catalog` -> `http/metadata/schemas_catalog.http`
- `filtered-schema-request-funcionarios` -> `http/metadata/filtered_schema_request_funcionarios.http`
- `filtered-schema-response-funcionarios` -> `http/metadata/filtered_schema_response_funcionarios.http`

Headers:
- `Accept: application/json`

### Auth-light operational lane

Use these when public metadata is not enough and you need operational reads on the published backend.
These do not require login cookies, bearer tokens, or a server-side session bootstrap.

- `cargos-options-by-ids` -> `http/resources/cargos_options_by_ids.http`
- `funcionarios-filter-basic` -> `http/resources/funcionarios_filter_basic.http`
- `funcionarios-options-filter` -> `http/resources/funcionarios_options_filter.http`
- `veiculos-filter-basic` -> `http/resources/veiculos_filter_basic.http`
- `incidentes-filter-basic` -> `http/resources/incidentes_filter_basic.http`
- `vw-perfil-heroi-filter-basic` -> `http/views/vw_perfil_heroi_filter_basic.http`
- `vw-perfil-heroi-by-ids` -> `http/views/vw_perfil_heroi_by_ids.http`
- `vw-perfil-heroi-options-filter` -> `http/views/vw_perfil_heroi_options_filter.http`
- `vw-ranking-reputacao-filter-basic` -> `http/views/vw_ranking_reputacao_filter_basic.http`
- `vw-ranking-reputacao-options-filter` -> `http/views/vw_ranking_reputacao_options_filter.http`
- `vw-resumo-missoes-filter-basic` -> `http/views/vw_resumo_missoes_filter_basic.http`
- `vw-resumo-missoes-stats-status` -> `http/views/vw_resumo_missoes_stats_status.http`
- `missao-participantes-stats-papel` -> `http/operations/missao_participantes_stats_papel.http`
- `missao-eventos-stats-ocorrido-em-day` -> `http/operations/missao_eventos_stats_ocorrido_em_day.http`
- `vw-indicadores-incidentes-filter-basic` -> `http/views/vw_indicadores_incidentes_filter_basic.http`

Accepted now on the published backend:
- `Accept: application/json`
- `Content-Type: application/json` for `POST` bodies

Default recommended stable scoped headers:
- `X-Tenant-ID: demo`
- `X-Env: public`
- `X-User-ID: example-user`

### Governed decision read-only lane

Use these when the task is to inspect published semantic-decision proof without executing domain-rule writes:

- `domain-rules-supplier-eligibility-materializations-confirmed` -> `http/config/domain_rules_supplier_eligibility_materializations_confirmed.http`
- `procurement-suppliers-governed-domain-rules-lookup` -> `http/resources/procurement_suppliers_governed_domain_rules_lookup.http`

Accepted now on the published backend:
- `Accept: application/json`
- `Origin: http://localhost:4301`
- `X-Tenant-ID: domain-rules-publication-smoke-enterprise-proof-http-examples-script-20260426`
- `X-Env: dev`
- `X-User-ID: example-user`
- `Content-Type: application/json` for the supplier lookup `POST`

Notes:
- `Origin` is required by the protected config materialization read.
- Supplier lookup is an auth-light runtime read, but it uses the same tenant as the confirmed materialization so the governed policy is visible.
- Do not use this lane to create, approve, or publish new domain rules.

## Protected Contract Endpoints

Use these for canonical contract reading, not as the default operational path.
On the published backend, `/api/praxis/config/**` also needs an allowed `Origin` header.

### UI config

Start with confirmed protected validation examples:

- `ui-get-table-config-missing-tenant`
- `ui-get-invalid-origin`
- `ui-get-table-config-legacy-component-type`

Use selector-only contract examples after that:

- `ui-get-table-config`
- `ui-get-table-config-if-none-match`

Keep protected writes out of the default path:

- `ui-put-table-config`
- `ui-put-form-config`
- `ui-put-tabs-config`
- `ui-put-global-config`
- `ui-delete-tabs-config`
- `ui-delete-tabs-config-not-found`

Accepted now on the published backend:
- `Origin: http://localhost:4301`
- `X-Tenant-ID: demo`

Recommended stable headers:
- `X-User-ID: demo-user-1`
- `X-Env: local`

Routing rule:

- If you need a confirmed published-backend protected example, start with the validation examples above.
- If you need selector shape or contract lookup semantics, use `ui-get-table-config` only after checking that `publishedBackendConfirmed` is false and `selectorConfirmed` is true.

### AI config

- `ai-context-get-table`
- `ai-context-post-table`
- `ai-registry-template-get-table`
- `ai-registry-template-put-table`
- `ai-registry-template-delete-table`

Accepted now on the published backend:
- `Origin: http://localhost:4301`
- `X-Tenant-ID: demo`

Recommended stable headers:
- `X-Env: local`

## Avoid By Default

Avoid these classes unless the user explicitly asks for them:

- destructive writes and deletes
- `referenceOnly` examples
- cursor pagination examples
- troubleshooting and negative-path examples
- protected config writes
- examples already noted as unstable on the published backend

## Endpoint Prerequisites Matrix

Use this matrix before borrowing headers from a random `.http` file.
It is the shortest reliable path for building valid requests by class.

| Endpoint class | Accepted now on published backend | Recommended stable headers | Origin |
|---|---|---|---|
| Public metadata | `Accept: application/json` | none | not required |
| Auth-light resources/views | `Accept: application/json`; add `Content-Type: application/json` for `POST` bodies | `X-Tenant-ID: demo`, `X-Env: public`, `X-User-ID: example-user` | not required |
| Governed decision read-only | `Accept: application/json`, `X-Tenant-ID: domain-rules-publication-smoke-enterprise-proof-http-examples-script-20260426`, `X-Env: dev`; add `Origin: http://localhost:4301` for materialization reads and `Content-Type: application/json` for `POST` bodies | add `X-User-ID: example-user` | required for protected config materialization read |
| Protected `config/ui` | `Accept: application/json`, `X-Tenant-ID: demo`, `Origin: http://localhost:4301` | `X-User-ID: demo-user-1`, `X-Env: local`, `Content-Type: application/json` for `PUT` bodies | required on the published backend |
| Protected `ai-context` and `ai-registry` | `Accept: application/json`, `X-Tenant-ID: demo`, `Origin: http://localhost:4301` | `X-Env: local`, `Content-Type: application/json` for `POST` and `PUT` bodies | required on the published backend |

Rules of thumb:

- Public metadata does not need tenant-scoping headers.
- Auth-light resources/views are currently accepted by the published backend without tenant-scoping headers on the confirmed LLM surface examples.
- `X-Tenant-ID`, `X-Env`, and `X-User-ID` are the default recommended stable scoped headers for this lane, not the loosest accepted request.
- Protected `config/ui` commonly needs `X-Tenant-ID`, `X-User-ID`, `X-Env`, and allowed `Origin`.
- Protected `ai-context` and `ai-registry` always need allowed `Origin`; the confirmed read examples currently accept `X-Tenant-ID` as the factual minimum in this repo.
- For any JSON body request, include `Content-Type: application/json` even when the row marks it as optional.

## Minimum Headers By Endpoint Class

| Class | Default use | Accepted now and recommended stable |
|---|---|---|
| Public metadata | Discovery, schemas, health | accepted: `Accept: application/json`; stable: same |
| Auth-light resources/views/expansion-detail | Safe-first operational reads | accepted: `Accept: application/json` plus `Content-Type: application/json` on `POST`; stable scoped: `X-Tenant-ID: demo`, `X-Env: public`, `X-User-ID: example-user` |
| Governed decision read-only | Published semantic-decision proof without writes | accepted and stable: `X-Tenant-ID: domain-rules-publication-smoke-enterprise-proof-http-examples-script-20260426`, `X-Env: dev`; add `Origin: http://localhost:4301` for config reads and `Content-Type: application/json` on `POST` |
| Protected `config/ui` | Canonical UI contract understanding | accepted: `Accept: application/json`, `Origin: http://localhost:4301`, `X-Tenant-ID: demo`; stable: add `X-User-ID: demo-user-1`, `X-Env: local` |
| Protected `ai-context` and `ai-registry` | Canonical AI contract understanding | accepted: `Accept: application/json`, `Origin: http://localhost:4301`, `X-Tenant-ID: demo`; stable: add `X-Env: local` when environment selection matters |

## Short Answer Template

If asked "what can I use now?", answer in this order:

1. Public metadata first.
2. Then auth-light operational reads with the loosest accepted request shape for the published backend.
   Add `X-Tenant-ID`, `X-Env`, and `X-User-ID` when you want the default recommended stable scoped header set.
3. Use the governed decision read-only lane when the question is about semantic-decision publication proof.
4. Treat `config/ui`, `ai-context`, `ai-registry`, and domain-rule writes as protected contract endpoints.
5. Avoid destructive or `referenceOnly` examples unless explicitly requested.
