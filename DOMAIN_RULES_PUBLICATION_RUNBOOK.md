# Domain Rules Publication Runbook

Operational evidence for the governed semantic decision lifecycle behind the Praxis enterprise proof.

This repository is not the canonical source of truth for `/api/praxis/config/domain-rules/**`; the canonical contract remains in `praxis-config-starter`. This runbook records the public quickstart proof path and the matching protected HTTP examples kept in this corpus.

## Protected Example Bundle

The supplier eligibility bundle is cataloged as `protectedContract`, not `llmOperational`:

- `domain-rules-supplier-eligibility-intake`
- `domain-rules-supplier-eligibility-simulation`
- `domain-rules-supplier-eligibility-definition`
- `domain-rules-supplier-eligibility-approve`
- `domain-rules-supplier-eligibility-publication`
- `domain-rules-supplier-eligibility-materializations`
- `domain-rules-supplier-eligibility-timeline`

Keep write examples outside the safe-first LLM lane. The read-only evidence lane is available through:

- `domain-rules-supplier-eligibility-materializations-confirmed`
- `procurement-suppliers-governed-domain-rules-lookup`

`domain-rules-supplier-eligibility-materializations-confirmed` is still a protected config read and therefore includes an allowed `Origin` header. The supplier lookup proof is the auth-light runtime read that shows the materialized decision affecting operational options.

`domain-rules-supplier-eligibility-timeline` is intentionally cataloged as protected contract evidence until the published quickstart includes `GET /api/praxis/config/domain-rules/definitions/{definitionId}/timeline`. A local starter/quickstart cut has proven the endpoint, but the current published backend can still return `404`; do not promote it to `llmOperational` until the published proof is confirmed.

## rc.36 Timeline Promotion Prep

The next coordinated starter release is expected to publish timeline v1 and v2 together as `praxis-config-starter:0.1.0-rc.36`, if no newer `v0.1.0-rc.*` tag exists when the platform owner authorizes phase closure.

Until that Maven artifact is published, resolved by Maven Central, consumed by `praxis-api-quickstart`, and deployed to the public host, keep the timeline example as:

- `llmOperational=false`
- `protectedContract=true`
- `publishedBackendConfirmed=false`
- `knownPublishedFailure=true`

After the published quickstart is redeployed with `0.1.0-rc.36`, run the published runtime gate once:

```bash
BASE_URL=https://praxis-api-quickstart.onrender.com \
npm run smoke:domain-rules-publication
```

Then verify the timeline example against a definition created by that published proof. Promotion is allowed only when the published response proves:

- HTTP `200` for `GET /api/praxis/config/domain-rules/definitions/{definitionId}/timeline`;
- only `visibility=safe` events;
- no prompt, assistant message, condition, parameters or materialized payload;
- `form_config` governed path includes persisted `intake.received`, `simulation.requested`, `simulation.completed`, `approval.requested`, `approval.completed` and materialization events;
- published `option_source` path includes persisted `publication.requested`, `publication.completed` and materialization events.

When the published proof exists, update this corpus in one PR:

- set the timeline example `knownPublishedFailure=false`;
- set `publishedBackendConfirmed=true`;
- update `lastVerified`;
- update `http/config/domain_rules_supplier_eligibility_timeline.http` headers to match the same status;
- keep the write examples outside `llmOperational`;
- regenerate `LLM_SURFACE.md` only if an example is intentionally promoted to the operational LLM surface.

Minimum local validation for that corpus PR:

```bash
npm run verify:manifest
npm run smoke:domain-rules-publication
```

Do not use GitHub Actions as an iteration loop for this promotion. Use the published smoke once as the phase gate after the quickstart deploy.

## Published Runtime Proof

Last confirmed: `2026-04-26`

Command:

```bash
npm run smoke:domain-rules-publication
```

Observed result:

- simulation returned structured explainability for the governed rule lifecycle;
- definition and form materialization lifecycle completed for the LGPD guidance baseline;
- publication created an active `selection_eligibility` rule for `procurement.suppliers`;
- publication derived an applied `option_source` materialization with:
  - `targetArtifactType=resource-option-source`
  - `targetArtifactKey=supplier`
  - `materializedPayload.kind=lookup_selection_policy`
- supplier lookup runtime reflected the published policy and returned `selectable=false` for a supplier status covered by the decision.

## Promotion Rule

Do not promote the protected examples to `llmOperational` just because the smoke passed once. Promotion requires:

- committed example ids and payloads that can be run repeatedly, or a documented fixture generator such as `smoke:domain-rules-publication`;
- an isolated execution profile;
- `npm run verify:manifest`;
- `npm run smoke:domain-rules-publication` against the published backend.

## Deterministic Smoke

The corpus includes a deterministic smoke that uses a unique `ruleKey` and isolated tenant per run:

```bash
npm run smoke:domain-rules-publication
```

Useful overrides:

```bash
BASE_URL=https://praxis-api-quickstart.onrender.com \
SMOKE_RUN_ID=enterprise-proof-http-examples-20260426 \
TENANT_ID=domain-rules-publication-smoke-enterprise-proof-http-examples-20260426 \
ENVIRONMENT=dev \
BLOCKED_STATUSES_JSON='["ACTIVE"]' \
npm run smoke:domain-rules-publication
```

The default `BLOCKED_STATUSES_JSON=["ACTIVE"]` is intentional for the public runtime probe: the quickstart seed data currently contains an `ACTIVE` supplier, so blocking that status proves the published materialization is actually governing the lookup response.
