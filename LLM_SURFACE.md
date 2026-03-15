# LLM Surface

Operational surface for LLM-driven discovery against the published Praxis backend.

Last reviewed: `2026-03-15`

This file is generated from [`examples.manifest.json`](./examples.manifest.json).
The executable baseline is validated by:

- `npm run smoke:public`
- `npm run smoke:auth`
- `npm run smoke:llm-surface`

## Scope

This surface is intentionally limited to examples that are both:

- useful for LLM-driven discovery or parameter understanding
- currently operational against the published Render backend

Examples outside this list remain important, but they are classified as `referenceOnly`.

## Public Core

| Id | File | Purpose |
|---|---|---|
| `health` | `http/metadata/health.http` | service availability check |
| `openapi-docs` | `http/metadata/openapi_docs.http` | public endpoint discovery; request and response shapes |
| `schemas-catalog` | `http/metadata/schemas_catalog.http` | lightweight metadata discovery |
| `filtered-schema-request-funcionarios` | `http/metadata/filtered_schema_request_funcionarios.http` | request-side filtered schema |
| `filtered-schema-response-funcionarios` | `http/metadata/filtered_schema_response_funcionarios.http` | response-side filtered schema |

## Auth-Light Operational Examples

These examples are not public, but they currently work on the published backend with lightweight tenant/user headers and no destructive mutation.

| Id | File | Purpose |
|---|---|---|
| `cargos-options-by-ids` | `http/resources/cargos_options_by_ids.http` | options rehydration by ids |
| `expansion-detail-perfil-heroi-advanced` | `http/expansion-detail/perfil_heroi_schema_advanced.http` | advanced contextual detail schema; tabs-based expansion detail |
| `expansion-detail-resource-resolver-funcionario` | `http/expansion-detail/resource_resolver_funcionario.http` | resourceId-based expansion resolution |
| `funcionarios-filter-basic` | `http/resources/funcionarios_filter_basic.http` | typed server-side filtering; table data loading |
| `funcionarios-options-filter` | `http/resources/funcionarios_options_filter.http` | remote options lookup; form select hydration |
| `vw-perfil-heroi-filter-basic` | `http/views/vw_perfil_heroi_filter_basic.http` | aggregated hero profile filtering |
| `vw-perfil-heroi-by-ids` | `http/views/vw_perfil_heroi_by_ids.http` | rehydrating aggregated hero profiles by id |
| `vw-perfil-heroi-options-filter` | `http/views/vw_perfil_heroi_options_filter.http` | lookup options from aggregated hero profiles |
| `vw-ranking-reputacao-filter-basic` | `http/views/vw_ranking_reputacao_filter_basic.http` | aggregated reputation ranking filtering |
| `vw-ranking-reputacao-options-filter` | `http/views/vw_ranking_reputacao_options_filter.http` | lookup options from ranking views |
| `vw-resumo-missoes-filter-basic` | `http/views/vw_resumo_missoes_filter_basic.http` | operational mission summary filtering |

## Not In This Surface

The following remain outside the LLM operational surface for now:

- `config/ui`
- `ai-context`
- `ai-registry`
- `ai/suggestions`
- destructive writes
- unstable published examples

Those examples are still kept in the catalog as `referenceOnly` for contract understanding, troubleshooting, and future expansion.
