# Example Status

## Labels

### `runtime-confirmed`
Observed in a public endpoint, executable contract, runtime behavior, or code-backed API surface.

Use for:
- current behavior
- integration-safe examples

### `recommended`
Preferred path for new integrations.

Use for:
- examples that should be suggested by default

### `legacy`
Still supported or historically relevant, but not the preferred path for new work.

Use for:
- compatibility examples
- naming ambiguity cases

### `illustrative-only`
Helpful for explanation, multi-turn reasoning, or edge cases, but not the canonical path.

Use for:
- AI clarification flows
- lab-like payloads
- examples with known ambiguity

## Operational Flags

- `public`: can be exercised safely against the public Render deployment
- `auth-required`: requires login/session/headers beyond public metadata access
- `destructive`: mutates or deletes real data
- `requires-tenant-headers`: needs `X-Tenant-ID` and related headers for meaningful execution

## Grouping Guidance

Organize examples by controller-driven interaction pattern:

- `metadata`: discovery and filtered schema endpoints
- `resources`: CRUD resources, filters, and options for editable entities
- `views`: aggregated read-only controllers with rich filtering and lookup support
- `expansion-detail`: contextual layout schemas and resource resolver endpoints
- `ai`: non-canonical or explanatory AI-oriented flows

When a controller exposes both list and lookup behavior, prefer preserving the full runtime pattern:
- `filter`
- `filter/cursor`
- `locate`
- `all`
- `by-ids`
- `options/filter`
- `options/by-ids`
