# LLM Common Questions

Short router for recurring questions a cold LLM may ask while using this corpus.

Last reviewed: `2026-03-15`

Use this file as an evidence router, not as a full contract source.
For each question, start with the listed evidence in order.

## 1. Which Endpoints Are Public?

Start here:

1. [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md) -> `Public metadata`
2. [`LLM_SURFACE.md`](./LLM_SURFACE.md) -> `Step 1` to `Step 4`
3. [`examples.manifest.json`](./examples.manifest.json) -> entries with `public: true`

Best examples:

- `health`
- `openapi-docs`
- `schemas-catalog`
- `filtered-schema-request-funcionarios`
- `filtered-schema-response-funcionarios`

Short answer pattern:

- Public means no tenant headers, no session auth, and no mutation.

## 2. How Do I Get A Filtered Schema?

Start here:

1. [`LLM_SURFACE.md`](./LLM_SURFACE.md) -> `Step 4. Read Filtered Schemas`
2. [`http/metadata/filtered_schema_request_funcionarios.http`](./http/metadata/filtered_schema_request_funcionarios.http)
3. [`http/metadata/filtered_schema_response_funcionarios.http`](./http/metadata/filtered_schema_response_funcionarios.http)
4. [`examples.manifest.json`](./examples.manifest.json) -> `responseShapeHint: filtered-schema`

Use when:

- the question is about request fields
- the question is about response fields
- OpenAPI is too broad

## 3. How Do I Read Remote Options?

Start here:

1. [`LLM_SURFACE.md`](./LLM_SURFACE.md) -> `Step 5. Start With Options Filter`
2. [`http/resources/funcionarios_options_filter.http`](./http/resources/funcionarios_options_filter.http)
3. [`http/resources/cargos_options_by_ids.http`](./http/resources/cargos_options_by_ids.http)
4. [`http/views/vw_perfil_heroi_options_filter.http`](./http/views/vw_perfil_heroi_options_filter.http)
5. [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md) -> `Auth-light operational lane`

Decision rule:

- use `options/filter` to search choices
- use `options/by-ids` to rehydrate known ids

Headers:

- accepted now: `Accept: application/json`, plus `Content-Type: application/json` for `POST`
- recommended stable scoped headers: `X-Tenant-ID: demo`, `X-Env: public`, `X-User-ID: example-user`

## 4. How Do I Read Expansion Detail?

Start here:

1. [`LLM_SURFACE.md`](./LLM_SURFACE.md) -> `Step 8. Read Expansion Detail`
2. [`http/expansion-detail/perfil_heroi_schema_advanced.http`](./http/expansion-detail/perfil_heroi_schema_advanced.http)
3. [`http/expansion-detail/resource_resolver_funcionario.http`](./http/expansion-detail/resource_resolver_funcionario.http)
4. [`examples.manifest.json`](./examples.manifest.json) -> `responseShapeHint: detail-schema`

Decision rule:

- use expansion detail only after you already know the row or resource context

## 5. How Do I Read Remote Config?

Start here:

1. [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md) -> `Protected Contract Endpoints`
2. [`examples.manifest.json`](./examples.manifest.json) -> `protectedContract: true`, `publishedBackendConfirmed`, `selectorConfirmed`, `knownPublishedFailure`
3. [`http/config/ui_get_table_missing_tenant.http`](./http/config/ui_get_table_missing_tenant.http)
4. [`http/config/ui_get_invalid_origin.http`](./http/config/ui_get_invalid_origin.http)
5. [`http/config/ui_get_table_legacy_component_type.http`](./http/config/ui_get_table_legacy_component_type.http)
6. [`http/config/ui_get_table.http`](./http/config/ui_get_table.http)
7. [`http/config/ui_get_table_if_none_match.http`](./http/config/ui_get_table_if_none_match.http)

Decision rule:

- treat remote config as protected contract evidence, not as the default operational lane
- start with confirmed protected validation examples before selector-only examples
- read runtime-usability fields before assuming the committed record exists on the published backend
- two different `config/ui` examples may both return `404` on the published backend; `ui-get-table-config-legacy-component-type` is a confirmed protected failure, while `ui-get-table-config` remains a selector-only contract example with `publishedBackendConfirmed: false`

Headers:

- `X-Tenant-ID: demo`
- `X-User-ID: demo-user-1`
- `X-Env: local`
- `Origin: http://localhost:4301`

## 6. How Do I Read AI Context?

Start here:

1. [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md) -> `AI config`
2. [`http/config/ai_context_get_table.http`](./http/config/ai_context_get_table.http)
3. [`http/config/ai_registry_template_get_table.http`](./http/config/ai_registry_template_get_table.http)
4. [`examples.manifest.json`](./examples.manifest.json) -> `protectedContract: true`

Decision rule:

- use `ai-context` for runtime-derived AI state
- use `ai-registry` for canonical template contract

Headers:

- `X-Tenant-ID: demo`
- `Origin: http://localhost:4301`

## 7. Which Examples Are Non-Destructive?

Start here:

1. [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md)
2. [`LLM_SURFACE.md`](./LLM_SURFACE.md)
3. [`examples.manifest.json`](./examples.manifest.json) -> `destructive: false`

Decision rule:

- prefer `llmOperational: true`
- avoid `knownPublishedFailure: true`
- avoid `referenceOnly: true` unless the user explicitly asks for caveats or troubleshooting

Good default examples:

- `health`
- `openapi-docs`
- `schemas-catalog`
- `funcionarios-options-filter`
- `cargos-options-by-ids`
- `funcionarios-filter-basic`
- `vw-perfil-heroi-by-ids`
- `vw-resumo-missoes-filter-basic`
- `expansion-detail-perfil-heroi-advanced`

## Fast Routing Rule

If the question is:

- "What can I use now?" -> start with [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md)
- "What is the safe operational path?" -> start with [`LLM_SURFACE.md`](./LLM_SURFACE.md)
- "What does this endpoint return?" -> check [`examples.manifest.json`](./examples.manifest.json) for `responseShapeHint`
- "Is this really confirmed on the published backend?" -> check `publishedBackendConfirmed` and `knownPublishedFailure`
- "Is this contract useful but not operational by default?" -> check `protectedContract`
