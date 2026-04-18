# Helpdesk Showcase Runbook

Operational recipe for the local Praxis helpdesk showcase.

This file is intentionally outside the public `llmOperational` corpus.

Why:

- the canonical public HTTP corpus in this repository targets `praxis-api-quickstart`
- the helpdesk showcase is a separate local pilot centered on `praxis-helpdesk-service`
- the goal here is to document the semantic validation flow without pretending that the helpdesk service is part of the public Render-backed surface

## Scope

Use this runbook when you want to validate the current pilot flow:

- backend: `../praxis-helpdesk-service`
- frontend: `../praxis-helpdesk-ui`
- pilot resource: `helpdesk.chamados`

This is the current exemplar flow for:

- `/schemas/filtered`
- `/schemas/surfaces`
- `/schemas/actions`
- collection and item `/capabilities`
- Angular runtime consumption of semantic discovery and governed openings

## Canonical ownership

Read the ownership chain in this order:

1. `../praxis-metadata-starter`
2. `../praxis-helpdesk-service`
3. `../praxis-helpdesk-ui`

The HTTP examples repository is not the source of truth for this showcase.
It only carries this runbook as a derived operational aid.

## Backend validation lane

The backend pilot should expose at least:

- `GET /schemas/filtered`
- `GET /schemas/surfaces?resource=helpdesk.chamados`
- `GET /schemas/actions?resource=helpdesk.chamados`
- `GET /api/helpdesk/chamados/capabilities`
- `GET /api/helpdesk/chamados/{id}/capabilities`

And the item payload should expose `_links` for:

- `surfaces`
- `actions`
- `capabilities`

For the exact HTTP walkthrough, read:

- [`../praxis-helpdesk-service/README.md`](../praxis-helpdesk-service/README.md)

## Frontend validation lane

The Angular consumer is split intentionally into two validation layers.

### 1. Structural browser smoke

Run in `../praxis-helpdesk-ui`:

```bash
cmd.exe /c npm run showcase:e2e
```

This proves, in a real browser:

- queue workspace
- operational workspaces
- catalog workspace
- administration workspace
- insights workspace
- dashboard workspace

### 2. Deterministic semantic handoffs

Run in `../praxis-helpdesk-ui`:

```bash
cmd.exe /c npm run showcase:handoffs
```

This proves the high-value semantic shortcuts through focused Angular specs:

- `operacao -> chamados`
- `catalogo -> chamados`
- `administracao -> chamados`
- `insights -> detalhe do chamado`

This split is intentional.

For this showcase, browser smoke proves runtime integrity, while focused specs prove semantic navigation more reliably than a fragile CLI click harness.

## What this repository should not claim

Do not mark helpdesk-local flows here as:

- `llmOperational`
- published Render examples
- canonical public examples for the quickstart backend

If helpdesk-specific `.http` files are ever added here, they should be treated as local showcase or `referenceOnly` material unless the publication boundary changes explicitly.

## Related sources

- [`README.md`](./README.md)
- [`LLM_SURFACE.md`](./LLM_SURFACE.md)
- [`../praxis-helpdesk-service/README.md`](../praxis-helpdesk-service/README.md)
- [`../praxis-helpdesk-ui/README.md`](../praxis-helpdesk-ui/README.md)
- [`../praxis-ui-landing-page/src/app/data/guides/helpdesk-showcase-runbook.md`](../praxis-ui-landing-page/src/app/data/guides/helpdesk-showcase-runbook.md)
