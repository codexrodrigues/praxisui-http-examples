# Praxis UI HTTP Examples

Executable HTTP examples and payload fixtures for the public Praxis platform surfaces.

This repository is not the canonical source of truth for platform contracts.

Source-of-truth hierarchy:
- `praxis-metadata-starter`: canonical metadata vocabulary, x-ui schemas, backend-first contract rules
- `praxis-api-quickstart`: public operational backend deployed on Render
- `praxisui-http-examples`: executable requests, curated payloads, and smoke validation

Default targets:
- Public API: `https://praxis-api-quickstart.onrender.com`
- Local Angular host: `http://localhost:4003`, `http://127.0.0.1:4003`
- Local landing host for Render validation: `http://localhost:4301`, `http://127.0.0.1:4301`

## Status Model

Examples are classified in [`EXAMPLE_STATUS.md`](./EXAMPLE_STATUS.md) and in [`examples.manifest.json`](./examples.manifest.json).

Operational LLM-facing summary:
- [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md): canonical "start here" guide for a cold LLM
- [`llm_bootstrap.json`](./llm_bootstrap.json): machine-readable bootstrap with safe-first lanes and minimum headers
- [`LLM_COMMON_QUESTIONS.md`](./LLM_COMMON_QUESTIONS.md): short guide for routing common questions to the right evidence
- [`LLM_SURFACE.md`](./LLM_SURFACE.md): human-readable summary of the examples marked `llmOperational: true`

Core labels:
- `runtime-confirmed`
- `recommended`
- `legacy`
- `illustrative-only`

Operational flags:
- `public`
- `session-auth-required`
- `tenant-scoped-headers-required`
- `auth-required` (deprecated alias for `sessionAuthRequired || tenantScopedHeadersRequired`)
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

## Layout

- [`http/`](./http): executable request examples
- [`http/config/`](./http/config): remote UI config, AI context, AI registry, and AI suggestions examples
- [`http/views/`](./http/views): read-oriented view controllers such as `VwPerfilHeroi`, `VwResumoMissoes`, and `VwRankingReputacao`
- [`http/expansion-detail/`](./http/expansion-detail): contextual detail schemas and resource resolver examples
- [`payloads/`](./payloads): request body fixtures referenced by examples
- [`payloads/config/`](./payloads/config): payloads for remote config, AI context, registry templates, and suggestions
- [`payloads/views/`](./payloads/views): filter and locate bodies for aggregated view controllers
- [`env/`](./env): environment templates
- [`smoke/`](./smoke): validation and smoke scripts
- [`examples.manifest.json`](./examples.manifest.json): canonical index for all examples
- [`LLM_BOOTSTRAP.md`](./LLM_BOOTSTRAP.md): short canonical entry point for LLM bootstrap
- [`llm_bootstrap.json`](./llm_bootstrap.json): machine-readable bootstrap companion
- [`LLM_COMMON_QUESTIONS.md`](./LLM_COMMON_QUESTIONS.md): short router for recurring LLM questions
- [`LLM_SURFACE.md`](./LLM_SURFACE.md): curated summary of the operational LLM surface

## Catalog Model

The catalog is organized around Praxis interaction patterns, not only around entities.

Primary controller groups:
- metadata discovery and filtered schemas
- remote config and AI-support surfaces
- CRUD resources with filter/options patterns
- aggregated read-only views with `filter`, `filter/cursor`, `locate`, `all`, `by-ids`, and options endpoints
- expansion detail controllers that return dynamic layout schemas

This keeps the examples aligned with how Praxis tables, details, remote options, and host-driven expansion behave at runtime.

## Quick Start

Install dependencies:

```bash
npm install
```

Validate the catalog:

```bash
npm run verify:manifest
```

Run public smoke examples:

```bash
npm run smoke:public
```

Run authenticated non-destructive smoke examples:

```bash
npm run smoke:auth
```

Run the operational surface most relevant to LLMs:

```bash
npm run smoke:llm-surface
```

## Endpoint Prerequisites Matrix

Use this matrix before copying headers from any individual example.
It is the canonical per-class prerequisite view for building valid requests.

| Endpoint class | Typical scope | Accepted now on published backend | Recommended stable headers | Origin |
|---|---|---|---|---|
| Public metadata | `health`, `openapi-docs`, `schemas-catalog`, filtered schema endpoints | `Accept: application/json` | none | not required |
| Auth-light resources/views | `resources`, `views`, and operational `expansion-detail` reads on the published backend | `Accept: application/json`; add `Content-Type: application/json` for `POST` bodies | `X-Tenant-ID: demo`, `X-Env: public`, `X-User-ID: example-user` | not required |
| Protected `config/ui` | canonical remote UI config contracts | `Accept: application/json`, `X-Tenant-ID: demo`, `Origin: http://localhost:4301` | `X-User-ID: demo-user-1`, `X-Env: local`, `Content-Type: application/json` for `PUT` bodies | required on the published backend |
| Protected `ai-context` / `ai-registry` | canonical AI config contracts | `Accept: application/json`, `X-Tenant-ID: demo`, `Origin: http://localhost:4301` | `X-Env: local`, `Content-Type: application/json` for `POST` and `PUT` bodies | required on the published backend |

Notes:

- Public metadata should not include tenant or user headers unless a specific debugging task requires them.
- Auth-light resources/views are currently accepted by the published backend without tenant-scoping headers on the confirmed LLM surface examples.
- For auth-light usage, prefer the stable scoped trio `X-Tenant-ID: demo`, `X-Env: public`, and `X-User-ID: example-user` when you want deterministic tenant-aware behavior rather than the loosest accepted request.
- Protected `config/ui` reads usually need `X-Tenant-ID`, `X-User-ID`, `X-Env`, and an allowed `Origin` for stable behavior, but the committed request may still point to a selector whose concrete record is not confirmed on the published backend.
- Protected `ai-context` and `ai-registry` reads require an allowed `Origin`; the confirmed published examples currently accept `X-Tenant-ID` as the factual minimum in this repo.
- If the method is `POST` or `PUT` and the example sends a JSON body, add `Content-Type: application/json` even when the class row lists it under the accepted or recommended lane guidance.

## Notes

- Public smoke only covers examples marked `public: true`, `sessionAuthRequired: false`, `tenantScopedHeadersRequired: false`, and `destructive: false`.
- Auth smoke uses a curated whitelist of non-destructive examples that currently return success on the Render backend.
- The current whitelist covers a subset of `resources`, `views`, `options`, and `expansion-detail` examples verified against Render.
- `smoke:llm-surface` combines the public corpus with the auth-light examples that are operationally useful to LLM-driven discovery against the published backend.
- CI currently runs `npm run verify:manifest`, `npm run smoke:llm-surface`, and `npm run smoke:corpus-promises`. `smoke:public` and `smoke:auth` remain available as local verification commands, but they are not part of the current GitHub Actions workflow.
- `smoke:bootstrap-minimums` validates the accepted-now minima declared in `llm_bootstrap.json` against the published backend so bootstrap guidance stays grounded in runtime behavior.
- `llmOperational: true` in [`examples.manifest.json`](./examples.manifest.json) marks the examples that belong to the LLM-facing operational surface on the published backend.
- `responseShapeHint` gives a compact, non-executed answer to "what does this endpoint return?" with values such as `array<option>`, `page<option>`, `restApiResponse<page<row>>`, `detail-schema`, and `config-record`.
- `runtimeRecordConfirmed: true` means the committed example shape or behavior has direct runtime confirmation somewhere in the corpus evidence model.
- `selectorConfirmed: true` means the selector, path, or lookup shape used by the example remains canonically useful even if the concrete record is not confirmed on the published backend.
- `publishedBackendConfirmed: true` means the example as committed is confirmed against `https://praxis-api-quickstart.onrender.com`, not only from code-backed contract evidence.
- `knownPublishedFailure: true` means the committed request is known to fail on the published backend, either because it is a deliberate negative-path example or because the published environment is currently unstable for it.
- `sessionAuthRequired: true` means the example depends on a real authenticated session or equivalent server-side login context.
- `tenantScopedHeadersRequired: true` means the example has a stable tenant-scoped request form using lightweight headers such as `X-Tenant-ID`, `X-User-ID`, and `X-Env`; this is not the same as login, and it does not imply those headers are the loosest published-backend minimum.
- `authRequired` remains in the manifest as a deprecated compatibility alias and must be read as `sessionAuthRequired || tenantScopedHeadersRequired`.
- `requiresTenantHeaders` remains as a legacy compatibility hint; prefer `tenantScopedHeadersRequired` for new tooling and docs.
- `protectedContract: true` marks examples that are strategically important and canonically relevant, but not part of the main operational LLM surface. This is the right place for `/api/praxis/config/ui`, `ai-context`, and `ai-registry` template contracts.
- `referenceOnly: true` marks examples that remain important for caveats, protected flows, writes, troubleshooting, destructive behavior, or illustrative/legacy understanding, but should not be treated as the primary operational surface.
- When flags appear to conflict, the surface layer wins: `referenceOnly` overrides `recommended` for default selection, and `protectedContract` means contract-reading rather than the default operational path.
- `status: []` means the example remains catalog-relevant, but this repo is intentionally not making a strong runtime-confirmed or recommended claim for the committed request.
- On the published Render backend, `/api/praxis/config/**` also requires an allowed `Origin` header. Valid local origins for this repo are `http://localhost:4003`, `http://127.0.0.1:4003`, `http://localhost:4301`, and `http://127.0.0.1:4301`.
- Some protected config examples now include `Origin: http://localhost:4301` directly when that makes the committed request executable on Render without mutating remote state. For protected writes, the examples only document the required `Origin` so they do not become more immediately actionable by accident.
- `destructive: true` should be read conservatively in this catalog: it covers deletes and also protected writes that mutate remote state on the published backend.
- `lastVerified` records the last audit date for the example entry and its current claim set. Trust the `status` labels, not the date alone, when judging runtime confidence.
- Safe-first LLM examples such as `funcionarios-filter-basic`, `funcionarios-options-filter`, and `vw-resumo-missoes-filter-basic` are auth-light, not session-authenticated. On 2026-03-15, the published backend still accepted the confirmed examples in this repo with just `Accept: application/json` plus `Content-Type: application/json` on `POST` bodies, while the default recommended stable scoped trio remains `X-Tenant-ID: demo`, `X-Env: public`, and `X-User-ID: example-user`.
- Confirmed auth-light operational examples also include `cargos-options-by-ids` and `vw-perfil-heroi-by-ids`; these are not session-authenticated and should be read as header-scoped published-backend examples.
- Some authenticated examples are intentionally excluded when the published environment is unstable for them. At this stage, `vw-resumo-missoes/options/by-ids` returned `500` and is not part of the auth smoke whitelist.
- `config/ui`, `ai-context`, and other protected config surfaces are intentionally excluded from `smoke:auth` until a stable execution profile is confirmed for the published environment as committed, including any required allowed-origin behavior.
- `ui_get_table.http` remains a protected contract example for selector shape and lookup semantics, but the specific `componentId` currently checked in this repo is not confirmed on the published backend and should not be treated as runtime-confirmed.
- Read runtime-usability fields together: `selectorConfirmed: true` with `publishedBackendConfirmed: false` means the contract or selector is still useful, but the concrete committed record should not be treated as confirmed on the published backend.
- Do not infer canonical persistence contracts from `illustrative-only` or `legacy` examples.
- When an example conflicts with runtime behavior, the backend/runtime wins.
