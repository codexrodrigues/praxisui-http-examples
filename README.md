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
- [`LLM_SURFACE.md`](./LLM_SURFACE.md): human-readable summary of the examples marked `llmOperational: true`

Core labels:
- `runtime-confirmed`
- `recommended`
- `legacy`
- `illustrative-only`

Operational flags:
- `public`
- `auth-required`
- `destructive`
- `requires-tenant-headers`
- `llmOperational`
- `referenceOnly`

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

## Notes

- Public smoke only covers examples marked `public: true`, `authRequired: false`, and `destructive: false`.
- Auth smoke uses a curated whitelist of non-destructive examples that currently return success on the Render backend.
- The current whitelist covers a subset of `resources`, `views`, `options`, and `expansion-detail` examples verified against Render.
- `smoke:llm-surface` combines the public corpus with the auth-light examples that are operationally useful to LLM-driven discovery against the published backend.
- `llmOperational: true` in [`examples.manifest.json`](./examples.manifest.json) marks the examples that belong to that LLM-facing operational surface.
- `referenceOnly: true` marks examples that remain important for contract understanding, caveats, protected flows, writes, or troubleshooting, but should not be treated as the primary operational surface for the published LLM backend.
- Some authenticated examples are intentionally excluded when the published environment is unstable for them. At this stage, `vw-resumo-missoes/options/by-ids` returned `500` and is not part of the auth smoke whitelist.
- `config/ui`, `ai-context`, and other protected config surfaces are intentionally excluded from `smoke:auth` until a stable execution profile is confirmed for the published environment.
- Do not infer canonical persistence contracts from `illustrative-only` or `legacy` examples.
- When an example conflicts with runtime behavior, the backend/runtime wins.
