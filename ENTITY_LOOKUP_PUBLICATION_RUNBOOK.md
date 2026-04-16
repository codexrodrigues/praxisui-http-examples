# Entity Lookup Publication Runbook

This runbook promotes the procurement Entity Lookup pilot from a protected contract
example to an operational published-backend example.

Canonical ownership:

- `praxis-metadata-starter` owns the `x-ui.optionSource` vocabulary and endpoint
  semantics.
- `praxis-api-quickstart` owns the reference operational host and the procurement
  pilot implementation.
- `praxisui-http-examples` owns executable examples, payload fixtures, manifest
  status, and LLM-facing derived corpus files.

Do not mark Entity Lookup examples as `publishedBackendConfirmed` or
`llmOperational` until the published quickstart backend returns the expected
responses for the committed requests.

## Publication Status

As of 2026-04-16, the published Render backend exposes the procurement Entity
Lookup endpoints and the corpus examples are promoted to published-backend
confirmed operational examples.

The confirmation probe is:

```bash
curl -i \
  "https://praxis-api-quickstart.onrender.com/api/procurement/suppliers/option-sources/supplier/options/by-ids?ids=11" \
  -H "Accept: application/json"
```

Expected: HTTP `200` with an array of `OptionDTO` items.

Confirmed: HTTP `200`, including blocked supplier rehydration with
`extra.selectable=false` and `extra.disabledReason`.

## Promotion Preconditions For Future Changes

Before editing `examples.manifest.json`, confirm all of these:

1. The quickstart deployment contains the procurement controllers.
2. Existing Neon databases have executed the quickstart patch
   `db/dump/patch_procurement_entity_lookup.sql`, or new databases have been
   created through the `db/init/35-procurement-entity-lookup.sql` seed flow.
3. `/schemas/filtered` returns `controlType: "entityLookup"` for purchase-order
   entity fields.
4. Supplier lookup `/filter` returns `OptionDTO.extra` with governed keys:
   `code`, `description`, `status`, `statusTone`, `selectable`,
   `disabledReason`, `detailHref`, `resourceKey`, and `entityKey`.
5. Supplier lookup `/by-ids` rehydrates saved IDs and still returns blocked
   entities with `selectable: false`.
6. Contract lookup `/filter` applies `companyId` and `supplierId` cascade
   filters from the request body.
7. The responses match the committed payload and request examples without local
   host-only assumptions.

## Required Published Backend Probes

Run these probes against Render after the quickstart deployment is updated.

```bash
curl -i \
  "https://praxis-api-quickstart.onrender.com/schemas/filtered?path=/api/procurement/purchase-orders&operation=post&schemaType=request" \
  -H "Accept: application/json"
```

```bash
curl -i -X POST \
  "https://praxis-api-quickstart.onrender.com/api/procurement/suppliers/option-sources/supplier/options/filter?search=ACME&page=0&size=10" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: demo" \
  -H "X-Env: public" \
  -H "X-User-ID: example-user" \
  --data @payloads/resources/procurement_supplier_entity_lookup_filter.json
```

```bash
curl -i \
  "https://praxis-api-quickstart.onrender.com/api/procurement/suppliers/option-sources/supplier/options/by-ids?ids=11" \
  -H "Accept: application/json" \
  -H "X-Tenant-ID: demo" \
  -H "X-Env: public" \
  -H "X-User-ID: example-user"
```

```bash
curl -i -X POST \
  "https://praxis-api-quickstart.onrender.com/api/procurement/contracts/option-sources/contract/options/filter?search=CTR&page=0&size=10" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: demo" \
  -H "X-Env: public" \
  -H "X-User-ID: example-user" \
  --data @payloads/resources/procurement_contract_entity_lookup_filter.json
```

## Manifest Promotion

The initial promotion was completed on 2026-04-16. Keep this section as the
checklist for future Entity Lookup examples or repromotions after backend
changes.

After the probes pass, update only the procurement Entity Lookup entries:

- set `knownPublishedFailure` to `false`;
- set `publishedBackendConfirmed` to `true`;
- set `llmOperational` to `true` only for the examples that should be part of the
  default LLM operational surface;
- keep `protectedContract: true` for schema and contract-reading examples that are
  strategically important but not default operational paths;
- update `lastVerified` to the confirmation date.

Then regenerate derived files and validate:

```bash
npm run generate:llm-surface
npm run verify:manifest
npm run smoke:llm-surface
```

On Windows PowerShell, if `npm.ps1` is blocked by execution policy, run the same
commands through `cmd.exe /c`.

## Do Not Promote When

- Render returns `404`, `401`, `403`, or `500` for the committed request shape.
- The endpoint only works locally.
- The response uses ad hoc keys outside the governed `OptionDTO.extra` contract.
- Cascade filters work only through frontend assumptions instead of backend
  request semantics.
- Rehydration cannot return inactive or blocked saved entities.
