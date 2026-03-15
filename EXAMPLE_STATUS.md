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

### Empty `status` arrays
Used when an example remains catalog-relevant, but this repository is intentionally not making a strong runtime or recommendation claim for the committed request.

Use for:
- protected or reference examples with unresolved published-runtime evidence
- destructive flows not recently validated as committed
- contract-preserving examples that should stay discoverable without overstating executability

## Operational Flags

- `public`: can be exercised safely against the public Render deployment
- `session-auth-required`: requires a real authenticated session, login cookie, bearer token, or equivalent server-side auth context
- `tenant-scoped-headers-required`: requires lightweight scoping headers such as `X-Tenant-ID`, `X-User-ID`, and `X-Env`, but not a login session
- `auth-required`: deprecated compatibility alias for `sessionAuthRequired || tenantScopedHeadersRequired`
- `destructive`: mutates or deletes real data
- `requires-tenant-headers`: legacy compatibility hint; prefer `tenantScopedHeadersRequired`
- `runtimeRecordConfirmed`: the committed example record or behavior has direct runtime confirmation in the corpus evidence model
- `selectorConfirmed`: the selector, lookup shape, or contract path is still canonically useful even if the concrete record is not confirmed on the published backend
- `publishedBackendConfirmed`: the committed example is confirmed on `https://praxis-api-quickstart.onrender.com`
- `knownPublishedFailure`: the committed request is known to fail on the published backend, either intentionally or because the environment is currently unstable for it

## Precedence

- `llmOperational`: use this as the primary safe-first operational lane for humans and LLMs on the published backend
- `protectedContract`: keep for canonically important contracts that matter for understanding, but are not the default operational path
- `referenceOnly`: keep for caveats, destructive flows, unstable examples, troubleshooting, legacy behavior, or illustrative material

An example must declare exactly one of those three surface layers in the manifest.

## Decision Rule

Read flags in this order so selection stays deterministic:

1. `referenceOnly: true` wins over `recommended` for default selection.
2. `protectedContract: true` means "use for contract understanding", not "use as the default operational path", even when `recommended` is present.
3. `llmOperational: true` is the default operational lane, but only when `referenceOnly` and `protectedContract` are both false.
4. `destructive: true` removes the example from safe-first default selection unless the user explicitly asks for mutation or deletion behavior.
5. `runtime-confirmed` increases confidence in the record, but it does not override `referenceOnly`, `protectedContract`, or `destructive`.
6. `recommended` only means "prefer this within its own lane". It never overrides the surface layer declared by `llmOperational`, `protectedContract`, or `referenceOnly`.

Practical outcomes:

- `recommended` + `referenceOnly` => keep discoverable, but do not suggest by default
- `recommended` + `protectedContract` => use for canonical contract reading, not for the main operational path
- `recommended` + `llmOperational` => suggest by default when the user asks what works now
- `runtime-confirmed` + `referenceOnly` => runtime evidence exists, but the example is still not part of the default path
- `runtime-confirmed` + `protectedContract` => contract is grounded, but still not the main operational path

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
