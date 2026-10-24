# Payroll G4 source-derived contract

This corpus describes the G4 candidate source in Quickstart. **G4 is not operationally admitted or confirmed on the published backend.** Examples use the existing official local origin `http://localhost:8088` and have `runtimeRecordConfirmed=false` / `publishedBackendConfirmed=false`. Offline verification proves file/manifest consistency only. It does not establish a published version, governed composition admission, data-plane identity, PostgreSQL privileges, HTTP execution, transactional CAS or UI behavior.

The canonical owners are Quickstart's `FolhasPagamentoService`, `EventosFolhaService`, their dedicated command DTOs and `PayrollFinancialEvaluationService` / `PayrollFinancialExecutors`, with Metadata's operation/schema/ETag contracts and Config's admitted governed composition. This repository is a derived example surface. Existing address examples retain their own contracts and evidence.

## Preconditions and authorized fixture

Use an exclusively assigned isolated Neon branch and the matching G4 stack/composition before any future runtime exercise. Follow the platform preflight for project/branch/endpoint, PostgreSQL version, TLS, owner/runtime/control-plane identities and effective grants. A session/JWT alone is insufficient: financial reads and writes recheck the operational binding, current `PAYROLL_APPROVE` grant and historical department coverage. Preview routes also require `ROLE_ADMIN` in the inspected G4 host; `PAYROLL_APPROVE` alone does not satisfy that route policy. Do not author alternate tenant/user/environment headers to select a scope.

The committed employee `31`, payrolls `42`/`43` and event `21` are illustrative identities, not provisioned records. Replace them consistently with authorized fixtures before using the requests; do not assume the published host owns these rows. Monetary JSON fixtures are examples of **declared** outputs from an admitted preview, never a client formula or authority. Keep exact BRL decimal values within `0..999999999999.99` with at most two semantic decimal places for new writes. Original history remains outside that write limit.

Every request is a separate indexed file because the shared parser executes one request per file. For session POST/PUT/PATCH, obtain the host's CSRF cookie through the existing health/session bootstrap and retain the raw cookie with the matching `X-XSRF-TOKEN` header. The examples show the cookie/header pair; if the assigned host explicitly disables CSRF, omit both CSRF parts together. Tokens and credentials must stay out of committed artifacts and logs.

## Preview and payroll commands

Administrative publication is a separate candidate surface:
`payroll-g4-bulk-publish`, `payroll-g4-bulk-reconcile` and `payroll-g4-bulk-suspend`.
They require a current `BULK_PUBLICATION_*` database grant, persisted active SESSION,
CSRF cookie/header and exact protected control generation. Their single input is
`expectedGeneration`; the committed values 0/1 are illustrative and must never be
refreshed through mutating retries. Namespace and operation are fixed by the host.
They affect the global deployment OpenAPI photograph, grant no financial access,
and do not approve events or establish G4 admission. An uncertain 503 requires
protected readback; do not infer rollback or rebase automatically. Payroll remains
SYNC; the ASYNC capacity coordinates used by mission are unrelated prerequisites.
See Quickstart's `docs/PAYROLL-BULK-PUBLICATION-OPERATIONS.md` for the canonical runbook.

| Step | Example | Meaning |
|---|---|---|
| Inspect create/edit request | `reactive-determination-payroll-create-schema`, `reactive-determination-payroll-edit-schema` | Operation-specific full tuple, separate edit identity, two reactive bindings; source-derived schema claims |
| Preview financial outputs | `reactive-determination-payroll-net-salary` | Send `funcionarioId`, `ano`, `mes`, `salarioBruto`, `descontosBase`; response is only `totalDescontos` + `salarioLiquido` |
| Preview expected date | `reactive-determination-payroll-payment-date` | Send the full tuple and the previous net for comparison; response is only `dataPagamentoPrevista` |
| Business rejection | `reactive-determination-payroll-invalid-discounts-422` | Excessive base discounts yield 422 only after a valid context and admitted composition; context/policy failures can precede it |
| Capture resource | `payroll-g4-detail` | Body and complete strong response ETag form one snapshot |
| Create / edit | `payroll-g4-create`, `payroll-g4-edit` | Submit the complete declared outputs; PUT also requires body `id` matching the route and the original resource `If-Match` |
| Explicit financial reapplication | `payroll-g4-redetermine` | Applies the current admitted composition with current authority and invalidates the agenda |
| Schedule / confirm payment | `payroll-g4-schedule`, `payroll-g4-mark-paid` | Separate explicit transitions, each with resource `If-Match` and stable `Idempotency-Key` |

For edit previews, add the captured payroll identity as `folhaPagamentoId` to **both** preview requests. It is absent on create. The host captures its approved events; clients never send additions/event-discount lists, invented source coordinates or a facts hash. Only APROVADO affects totals; PENDENTE/REJEITADO do not. Calendar eligibility and direct net-to-calendar dependency outputs belong to one engine evaluation. The date endpoint re-evaluates that single chain and compares the submitted net; it does not trust the client's net as the calendar authority. No parallel formula or HALF_EVEN rounding is taught by this corpus.

Create/relevant update execute the governed chain with fresh write authority and compare every declared result; 409 preserves the draft for explicit review. Irrelevant edit preserves the persisted results/authority even after a head change. Opening a form is not a redetermination. A payroll with approved events cannot change employee or competence in this pilot. Paid or historical-pending payrolls are read-only through these commands.

`dataPagamentoPrevista` is the governed prediction. `dataPagamentoAgendada` is an explicit schedule, today or later in `America/Sao_Paulo`; it can be invalidated by financial/event changes and does not prove payment. Confirmed `dataPagamentoEfetiva` is projected from its immutable payment transition. Neither the original legacy date nor the prediction is a payment fact. A zero net may have a calendar prediction, but cannot be scheduled or marked paid. Reconfirming an unchanged schedule has no new domain effect.

## Events: capture, create, edit, move and reject

| Operation | Example | Exact required capture |
|---|---|---|
| Inspect transport schema | `payroll-g4-event-create-schema`, `payroll-g4-event-edit-schema` | Typed `precondicoesFolhas` array, canonical hidden fields and `submitPolicy: include` |
| Capture event | `payroll-g4-event-detail` | Event body + response ETag + `precondicaoFolhaAtual` from the same joined snapshot |
| Create pending | `payroll-g4-event-create` | GET destination payroll first; list contains only destination id/ETag |
| Edit or move pending | `payroll-g4-event-move` | `If-Match` is the event ETag; list holds captured original parent plus separately captured destination when different |
| Reject pending | `payroll-g4-event-reject` | Event `If-Match`, exact current-parent entry and stable `Idempotency-Key` |

The move fixture uses origin `42` and destination `43`. A same-parent edit uses **one** entry with the original token. Returning to the origin keeps that original capture; never fetch it again just to refresh its version. Send each token exactly as captured, including its strong ETag quotes, in the correct place. The main resource ETag is singular in `If-Match`; the typed body list transports only affected payrolls. Do not replace tokens with numeric revisions or put multiple parent ETags in one header.

Missing preconditions yield 428; malformed/duplicate/extra/wrong-target shape is rejected, and stale scoped tokens yield 412. Preserve the draft for explicit reload/review. Never renew a token and automatically resend a stale command. Approved/rejected events are immutable. Only ADICIONAL/DESCONTO are writable; PROVENTO is the base salary, not a synthetic event. Creating, moving or changing a pending event invalidates the agenda on each affected payroll without adding it to totals. Rejecting the pending event does not resurrect an agenda or select new financial authority. Exact retry uses the retained receipt and rechecks current authorization. The service/kernel remain the security boundary; UI hidden fields are not authorization.

No payroll/event physical delete exists in this pilot, including batch paths. Use the explicit reject action for a pending event, with the same review/audit constraints. The individual examples are alternative isolated exercises, not an instruction to run all mutations in order against the same sample rows.

The existing `eventos-folha-bulk-journey` remains a reference. G4 proposals admit at most one event per payroll. Review each financial impact and all result pages before confirmation; a changed parent revision, facts, agenda or authority conflicts even if outputs under composition B equal A. No token/impact refresh is implicit. This proposal protocol does not take the CRUD parent's `precondicoesFolhas` shape.

## Historical reads

For HISTORICO_PENDENTE, normal operational money is omitted/null, never zero. Authorized exact originals are decimal **strings** in `valoresOriginais`; `dataPagamentoOriginal` is unclassified legacy data. Financial history requires both current access to the payroll and coverage of the audited original department. An unknown original department does not inherit the current employee department. Do not parse these strings to JavaScript numbers or display them as numeric currency inputs. Monetary filters/sorts/operational aggregates exclude pending history before data/count/pagination; no numeric historical filter is introduced here. GET never recalculates or repairs history.

## Local checks and future smoke

```sh
npm run generate:llm-surface
npm run verify:manifest
npm run verify:payroll-g4
node --check smoke/smoke-reactive-determinations.mjs
```

The published reactive smoke's existing lane excludes the unconfirmed G4 payroll contract. For a future **assigned, provisioned G4** host, the explicit `npm run smoke:payroll-g4` checks the G4 schema and non-persisting previews. Supply `BASE_URL`, `PRAXIS_SESSION_COOKIE`, `PRAXIS_XSRF_TOKEN` and `PAYROLL_FUNCIONARIO_ID` through the existing secret-safe process; absent required values fail before requests. It never submits the financial mutation references. A passing preview smoke does not admit G4, prove a cutover/rollback, establish published artifact adoption, test command concurrency/ACL, or replace the required Neon/HTTP/UI proofs. No network smoke was run for this source update.
