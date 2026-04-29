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

`domain-rules-supplier-eligibility-timeline` is cataloged as protected contract evidence for `GET /api/praxis/config/domain-rules/definitions/{definitionId}/timeline`. The published quickstart confirmed this endpoint on 2026-04-29 after the coordinated `praxis-config-starter:0.1.0-rc.36` release. Keep it outside `llmOperational` because it is a tenant-scoped protected config read, not a safe-first operational action for general LLM execution.

## rc.36 Timeline Promotion

The coordinated starter release published timeline v1 and v2 together as `praxis-config-starter:0.1.0-rc.36`.

The timeline example is now:

- `llmOperational=false`
- `protectedContract=true`
- `publishedBackendConfirmed=true`
- `knownPublishedFailure=false`

The published quickstart was redeployed with `0.1.0-rc.36`, then the runtime gate ran once:

```bash
gh workflow run domain-rules-runtime-smoke.yml \
  --repo codexrodrigues/praxis-api-quickstart \
  --ref main \
  -f backend_url=https://praxis-api-quickstart.onrender.com \
  -f tenant_id=default \
  -f environment=dev \
  -f require_timeline=true
```

Published proof:

- GitHub Actions run: `https://github.com/codexrodrigues/praxis-api-quickstart/actions/runs/25086775013`
- `PUBLICATION_TENANT_ID=domain-rules-publication-smoke-20260429014324`
- `definitionId=076df490-b8cd-4df1-9a2d-7f68b38ce6af`
- timeline response returned `eventCount=9`

Promotion was allowed because the published response proved:

- HTTP `200` for `GET /api/praxis/config/domain-rules/definitions/{definitionId}/timeline`;
- only `visibility=safe` events;
- no prompt, assistant message, condition, parameters or materialized payload;
- `form_config` governed path includes persisted `intake.received`, `simulation.requested`, `simulation.completed`, `approval.requested`, `approval.completed` and materialization events;
- published `option_source` path includes persisted `publication.requested`, `publication.completed` and materialization events.

The corpus promotion updates:

- timeline example `knownPublishedFailure=false`;
- timeline example `publishedBackendConfirmed=true`;
- timeline example `runtimeRecordConfirmed=true`;
- `lastVerified=2026-04-29`;
- `http/config/domain_rules_supplier_eligibility_timeline.http` headers and fixture identifiers match the published proof;
- write examples remain outside `llmOperational`;
- `LLM_SURFACE.md` is regenerated only to keep generated metadata current; no example was promoted to the operational LLM surface.

Minimum local validation for that corpus PR:

```bash
npm run verify:manifest
npm run smoke:domain-rules-publication
```

Do not use GitHub Actions as an iteration loop for this promotion. Use the published smoke once as the phase gate after the quickstart deploy.

## Published Runtime Proof

Last confirmed: `2026-04-29`

Command:

```bash
gh workflow run domain-rules-runtime-smoke.yml \
  --repo codexrodrigues/praxis-api-quickstart \
  --ref main \
  -f backend_url=https://praxis-api-quickstart.onrender.com \
  -f tenant_id=default \
  -f environment=dev \
  -f require_timeline=true
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
- governed timeline returned safe events for `form_config`, `option_source`, `backend_validation`, `workflow_action` and `approval_policy`;
- `domain-rules-supplier-eligibility-timeline` was rechecked directly against the published backend with HTTP `200`, `eventCount=9`, `visibility=safe` and no prompt, assistant, condition, parameters or materialized payload leakage.

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
