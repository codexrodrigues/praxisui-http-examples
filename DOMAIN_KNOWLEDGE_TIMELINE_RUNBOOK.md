# Domain Knowledge Timeline Runbook

Operational evidence for safe observability of AI-authored Domain Knowledge change sets.

This repository is not the canonical source of truth for `/api/praxis/config/domain-knowledge/**`; the canonical contract remains in `praxis-config-starter`. This runbook records the published quickstart proof path and the matching protected HTTP example kept in this corpus.

## Protected Example

`domain-knowledge-change-set-timeline` is cataloged as `protectedContract`, not `llmOperational`.

It proves the protected read endpoint:

```http
GET /api/praxis/config/domain-knowledge/change-sets/{changeSetId}/timeline
```

Keep this endpoint outside the safe-first LLM lane because it is a tenant-scoped protected config read. LLM agents may use the manifest entry as contract evidence, but should not treat it as an unauthenticated operational action.

## rc.37 Timeline Promotion

The coordinated starter release published the Domain Knowledge change-set timeline as `praxis-config-starter:0.1.0-rc.37`.

The timeline example is:

- `llmOperational=false`
- `protectedContract=true`
- `publishedBackendConfirmed=true`
- `knownPublishedFailure=false`

Published proof:

- Quickstart commit: `688aea1`
- Quickstart host: `https://praxis-api-quickstart.onrender.com`
- Quickstart build time: `2026-05-01T03:40:15.468Z`
- Tenant/environment: `desenv` / `local`
- Change set: `01300db8-119c-4925-9d5f-1049c31cf4cc`
- Timeline response: `domain-knowledge-change-set-timeline-ready`, `eventCount=4`

Command used for the published proof:

```bash
BACKEND_URL=https://praxis-api-quickstart.onrender.com \
TENANT_ID=desenv \
ENVIRONMENT=local \
REQUIRE_CHANGE_SET_TIMELINE=true \
scripts/verify-domain-knowledge-change-set-runtime.sh
```

The proof confirmed creation, validation, approval, application, readback and safe timeline inspection for `human-resources.funcionarios.field.cpf`.

## Safety Rule

The timeline is a safe observability projection over persisted change-set state. It must not expose:

- raw patch payloads
- evidence body text
- `sourcePointer`
- `sourceUri`
- `patchHash`
- prompts
- chat history

Promotion to `llmOperational` is not allowed for this protected config endpoint. A future operational LLM lane must be a separate, intentionally safe runtime read with documented headers and repeatable fixture semantics.

## Minimum Local Validation

For corpus updates touching this example, prefer local validation before any GitHub Actions gate:

```bash
npm run verify:manifest
npm run smoke:corpus-promises
```

Do not use GitHub Actions as an iteration loop for this promotion. Use remote workflows only as a phase/release gate when local evidence is already clean.
