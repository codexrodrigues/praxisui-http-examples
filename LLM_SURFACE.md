# LLM Surface

Operational surface for LLM-driven discovery against the published Praxis backend.

Last reviewed: `2026-04-29`

This file is generated from [`examples.manifest.json`](./examples.manifest.json).
Current validation commands:

- `npm run smoke:public`
- `npm run smoke:auth`
- `npm run smoke:llm-surface`

Current CI baseline:

- `npm run verify:manifest`
- `npm run smoke:llm-surface`
- `npm run smoke:corpus-promises`
- `npm run smoke:bootstrap-minimums`

## Scope

This surface is intentionally limited to examples that are both:

- useful for LLM-driven discovery or parameter understanding
- currently operational against the published Render backend

Examples outside this list remain important, but they are classified as `protectedContract` or `referenceOnly`.

## Safe-First Operational Playbook

Prefer this path over browsing the raw OpenAPI document in isolation.
The steps are ordered from safest and broadest discovery to more contextual operational reads.

Public lane:
- Start with `health`, `openapi-docs`, `schemas-catalog`, and filtered schemas.
- These do not require tenant-scoped headers.

Auth-light lane:
- Then move to options, views, and expansion detail with the loosest accepted request shape for the published backend.
- Add `X-Tenant-ID: demo`, `X-Env: public`, and `X-User-ID: example-user` as the default recommended stable scoped headers for this lane.
- These examples do not require login cookies, bearer tokens, or a server-side session bootstrap.

### Step 1. Check Service Health

Confirm that the published backend is reachable before doing any schema or data discovery.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `health` | `http/metadata/health.http` | Public | none | service availability check |

### Step 2. Read OpenAPI Docs

Use OpenAPI for broad route discovery, but do not stop here when the corpus already provides a safer curated example.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `openapi-docs` | `http/metadata/openapi_docs.http` | Public | none | public endpoint discovery; request and response shapes |

### Step 3. Read Schemas Catalog

Use the lightweight schemas catalog to discover available resources and views without parsing the full OpenAPI document.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `schemas-catalog` | `http/metadata/schemas_catalog.http` | Public | none | lightweight metadata discovery |

### Step 4. Read Filtered Schemas

Use filtered schemas to ground request and response fields before composing operational requests.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `filtered-schema-request-funcionarios` | `http/metadata/filtered_schema_request_funcionarios.http` | Public | none | request-side filtered schema |
| `filtered-schema-response-funcionarios` | `http/metadata/filtered_schema_response_funcionarios.http` | Public | none | response-side filtered schema |

### Step 5. Start With Options Filter

When you need label/value choices from a dataset, begin with an options filter example before wider row retrieval.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `funcionarios-options-filter` | `http/resources/funcionarios_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | remote options lookup; form select hydration |
| `departamentos-options-filter` | `http/resources/departamentos_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | department remote options lookup; form select hydration; inline filter async select hydration |
| `vw-perfil-heroi-options-filter` | `http/views/vw_perfil_heroi_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | lookup options from aggregated hero profiles |
| `vw-ranking-reputacao-options-filter` | `http/views/vw_ranking_reputacao_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | lookup options from ranking views |

### Step 6. Rehydrate With Options By Ids

After selecting ids, use by-ids examples to rehydrate option labels deterministically.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `cargos-options-by-ids` | `http/resources/cargos_options_by_ids.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | options rehydration by ids |
| `vw-perfil-heroi-by-ids` | `http/views/vw_perfil_heroi_by_ids.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | rehydrating aggregated hero profiles by id |

### Step 7. Move To Views Filter

Use filter endpoints for table-like operational reads after schema and option grounding are in place.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `funcionarios-filter-basic` | `http/resources/funcionarios_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | typed server-side filtering; table data loading |
| `veiculos-filter-basic` | `http/resources/veiculos_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | operational vehicle filtering; assets domain discovery |
| `incidentes-filter-basic` | `http/resources/incidentes_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | incident investigation filtering; operations domain discovery |
| `vw-perfil-heroi-filter-basic` | `http/views/vw_perfil_heroi_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | aggregated hero profile filtering |
| `vw-ranking-reputacao-filter-basic` | `http/views/vw_ranking_reputacao_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | aggregated reputation ranking filtering |
| `vw-resumo-missoes-filter-basic` | `http/views/vw_resumo_missoes_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | operational mission summary filtering |
| `vw-indicadores-incidentes-filter-basic` | `http/views/vw_indicadores_incidentes_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | risk incident analytics filtering |

### Step 8. Read Expansion Detail

Use expansion-detail only after you already know which row or resource context you need to inspect.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|


### Step 9. Add Analytics Surfaces

Use stats examples when a runtime page or chart needs backend-owned aggregate projections.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `vw-resumo-missoes-stats-status` | `http/views/vw_resumo_missoes_stats_status.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | analytics projection for mission status charts |

### Step 10. Inspect Surfaces, Actions And Capabilities

Use surfaces and actions discovery before executing or rendering workflow affordances, then check item capabilities for the selected row.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `schemas-surfaces-operations-missoes` | `http/metadata/schemas_surfaces_operations_missoes.http` | Public | none | runtime surface discovery for mission pages; modal surface previews |
| `schemas-surfaces-human-resources-funcionarios` | `http/metadata/schemas_surfaces_human_resources_funcionarios.http` | Public | none | runtime surface discovery for funcionarios pages; modal surface previews |
| `schemas-actions-operations-missoes` | `http/metadata/schemas_actions_operations_missoes.http` | Public | none | runtime action discovery for mission pages; workflow affordance discovery before capability checks |
| `operations-missoes-item-capabilities` | `http/operations/missoes_item_capabilities.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | selected mission capability snapshot; runtime action availability checks |

### Step 11. Inspect Governed Decision Materialization

Use these read-only examples when the task is to verify that a published semantic decision is governing a runtime lookup without executing domain-rule writes.

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `domain-rules-supplier-eligibility-materializations-confirmed` | `http/config/domain_rules_supplier_eligibility_materializations_confirmed.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | read-only inspection of a published governed semantic decision materialization; confirming option_source materializations are derived artifacts |
| `procurement-suppliers-governed-domain-rules-lookup` | `http/resources/procurement_suppliers_governed_domain_rules_lookup.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | runtime proof that a published domain-rule option_source materialization governs supplier lookup; read-only enterprise proof for supplier eligibility decisions |

## Full LLM Operational Set

### Public Core

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `health` | `http/metadata/health.http` | Public | none | service availability check |
| `openapi-docs` | `http/metadata/openapi_docs.http` | Public | none | public endpoint discovery; request and response shapes |
| `schemas-catalog` | `http/metadata/schemas_catalog.http` | Public | none | lightweight metadata discovery |
| `schemas-surfaces-operations-missoes` | `http/metadata/schemas_surfaces_operations_missoes.http` | Public | none | runtime surface discovery for mission pages; modal surface previews |
| `schemas-surfaces-human-resources-funcionarios` | `http/metadata/schemas_surfaces_human_resources_funcionarios.http` | Public | none | runtime surface discovery for funcionarios pages; modal surface previews |
| `schemas-actions-operations-missoes` | `http/metadata/schemas_actions_operations_missoes.http` | Public | none | runtime action discovery for mission pages; workflow affordance discovery before capability checks |
| `filtered-schema-request-funcionarios` | `http/metadata/filtered_schema_request_funcionarios.http` | Public | none | request-side filtered schema |
| `filtered-schema-response-funcionarios` | `http/metadata/filtered_schema_response_funcionarios.http` | Public | none | response-side filtered schema |
| `filtered-schema-request-procurement-purchase-orders-entity-lookup` | `http/metadata/filtered_schema_request_procurement_purchase_orders_entity_lookup.http` | Public | none | request-side filtered schema for procurement purchase orders; entityLookup controlType discovery; RESOURCE_ENTITY optionSource metadata |

### Auth-Light Operational Examples

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
| `departamentos-options-filter` | `http/resources/departamentos_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | department remote options lookup; form select hydration; inline filter async select hydration |
| `cargos-options-by-ids` | `http/resources/cargos_options_by_ids.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | options rehydration by ids |
| `funcionarios-filter-basic` | `http/resources/funcionarios_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | typed server-side filtering; table data loading |
| `funcionarios-options-filter` | `http/resources/funcionarios_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | remote options lookup; form select hydration |
| `vw-perfil-heroi-filter-basic` | `http/views/vw_perfil_heroi_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | aggregated hero profile filtering |
| `vw-perfil-heroi-by-ids` | `http/views/vw_perfil_heroi_by_ids.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | rehydrating aggregated hero profiles by id |
| `vw-perfil-heroi-options-filter` | `http/views/vw_perfil_heroi_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | lookup options from aggregated hero profiles |
| `vw-ranking-reputacao-filter-basic` | `http/views/vw_ranking_reputacao_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | aggregated reputation ranking filtering |
| `vw-ranking-reputacao-options-filter` | `http/views/vw_ranking_reputacao_options_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | lookup options from ranking views |
| `vw-resumo-missoes-filter-basic` | `http/views/vw_resumo_missoes_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | operational mission summary filtering |
| `vw-resumo-missoes-stats-status` | `http/views/vw_resumo_missoes_stats_status.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | analytics projection for mission status charts |
| `domain-rules-supplier-eligibility-materializations-confirmed` | `http/config/domain_rules_supplier_eligibility_materializations_confirmed.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | read-only inspection of a published governed semantic decision materialization; confirming option_source materializations are derived artifacts |
| `procurement-suppliers-governed-domain-rules-lookup` | `http/resources/procurement_suppliers_governed_domain_rules_lookup.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | runtime proof that a published domain-rule option_source materialization governs supplier lookup; read-only enterprise proof for supplier eligibility decisions |
| `veiculos-filter-basic` | `http/resources/veiculos_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | operational vehicle filtering; assets domain discovery |
| `incidentes-filter-basic` | `http/resources/incidentes_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | incident investigation filtering; operations domain discovery |
| `vw-indicadores-incidentes-filter-basic` | `http/views/vw_indicadores_incidentes_filter_basic.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | risk incident analytics filtering |
| `missao-participantes-stats-papel` | `http/operations/missao_participantes_stats_papel.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | analytics projection for mission team role charts |
| `operations-missoes-item-capabilities` | `http/operations/missoes_item_capabilities.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | selected mission capability snapshot; runtime action availability checks |
| `procurement-suppliers-entity-lookup-filter` | `http/resources/procurement_suppliers_entity_lookup_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | RESOURCE_ENTITY option-source filtering; supplier entity lookup with company dependency; governed OptionDTO.extra fields |
| `procurement-suppliers-entity-lookup-by-ids` | `http/resources/procurement_suppliers_entity_lookup_by_ids.http` | `Accept` only | `X-Tenant-ID`, `X-Env`, `X-User-ID` | entity lookup rehydration by ids; retained invalid value display; selectable=false disabledReason semantics |
| `procurement-contracts-entity-lookup-filter-cascade` | `http/resources/procurement_contracts_entity_lookup_filter.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | cascading Entity Lookup with multiple dependencies; contract lookup selection policy; dependencyFilterMap for companyId and supplierId |
| `missao-eventos-stats-ocorrido-em-day` | `http/operations/missao_eventos_stats_ocorrido_em_day.http` | `Accept` + `Content-Type` | `X-Tenant-ID`, `X-Env`, `X-User-ID` | analytics projection for mission event timeline charts |

## Not In This Surface

The following remain outside the LLM operational surface for now:

- `config/ui` as canonical remote layout storage
- `ai-context`
- `ai-registry`
- `domain-rules` writes
- `ai/suggestions`
- destructive writes
- unstable published examples

Those examples are still kept in the catalog as `protectedContract` or `referenceOnly` for contract understanding, troubleshooting, and future expansion.
