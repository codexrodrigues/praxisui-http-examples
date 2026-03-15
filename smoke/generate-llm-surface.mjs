import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const outputPath = path.join(root, 'LLM_SURFACE.md');
const reviewedAt = new Date().toISOString().slice(0, 10);

const llmExamples = (manifest.examples ?? []).filter((example) => example.llmOperational === true);
const publicCore = llmExamples.filter(
  (example) =>
    example.public === true &&
    example.sessionAuthRequired === false &&
    example.tenantScopedHeadersRequired === false &&
    example.destructive === false,
);
const authLight = llmExamples.filter(
  (example) => !(publicCore.includes(example)),
);

const byId = new Map(llmExamples.map((example) => [example.id, example]));
const playbookSteps = [
  {
    title: 'Step 1. Check Service Health',
    description: 'Confirm that the published backend is reachable before doing any schema or data discovery.',
    ids: ['health'],
  },
  {
    title: 'Step 2. Read OpenAPI Docs',
    description: 'Use OpenAPI for broad route discovery, but do not stop here when the corpus already provides a safer curated example.',
    ids: ['openapi-docs'],
  },
  {
    title: 'Step 3. Read Schemas Catalog',
    description: 'Use the lightweight schemas catalog to discover available resources and views without parsing the full OpenAPI document.',
    ids: ['schemas-catalog'],
  },
  {
    title: 'Step 4. Read Filtered Schemas',
    description: 'Use filtered schemas to ground request and response fields before composing operational requests.',
    ids: ['filtered-schema-request-funcionarios', 'filtered-schema-response-funcionarios'],
  },
  {
    title: 'Step 5. Start With Options Filter',
    description: 'When you need label/value choices from a dataset, begin with an options filter example before wider row retrieval.',
    ids: ['funcionarios-options-filter', 'vw-perfil-heroi-options-filter', 'vw-ranking-reputacao-options-filter'],
  },
  {
    title: 'Step 6. Rehydrate With Options By Ids',
    description: 'After selecting ids, use by-ids examples to rehydrate option labels deterministically.',
    ids: ['cargos-options-by-ids', 'vw-perfil-heroi-by-ids'],
  },
  {
    title: 'Step 7. Move To Views Filter',
    description: 'Use filter endpoints for table-like operational reads after schema and option grounding are in place.',
    ids: ['funcionarios-filter-basic', 'vw-perfil-heroi-filter-basic', 'vw-ranking-reputacao-filter-basic', 'vw-resumo-missoes-filter-basic'],
  },
  {
    title: 'Step 8. Read Expansion Detail',
    description: 'Use expansion-detail only after you already know which row or resource context you need to inspect.',
    ids: ['expansion-detail-perfil-heroi-advanced', 'expansion-detail-resource-resolver-funcionario'],
  },
];

function row(example) {
  const purpose = (example.canonicalFor ?? []).join('; ') || 'See manifest';
  const method = detectMethod(example.httpFile);
  const accessMinimum = example.public
    ? 'Public'
    : example.sessionAuthRequired
      ? 'Session auth'
      : example.tenantScopedHeadersRequired
        ? method === 'POST' || method === 'PUT'
          ? '`Accept` + `Content-Type`'
          : '`Accept` only'
        : 'Non-public';
  const recommendedStable = example.public
    ? 'none'
    : example.sessionAuthRequired
      ? 'Session auth context'
      : example.tenantScopedHeadersRequired
        ? '`X-Tenant-ID`, `X-Env`, `X-User-ID`'
        : 'none';
  return `| \`${example.id}\` | \`${example.httpFile}\` | ${accessMinimum} | ${recommendedStable} | ${purpose} |`;
}

function detectMethod(httpFile) {
  const raw = fs.readFileSync(path.join(root, httpFile), 'utf8');
  const requestLine = raw.split(/\r?\n/).find((line) => /^(GET|POST|PUT|DELETE)\s+/.test(line.trim()));
  return requestLine?.trim().split(/\s+/, 1)[0] ?? 'GET';
}

function stepSection(step) {
  const examples = step.ids.map((id) => byId.get(id)).filter(Boolean);
  return `### ${step.title}

${step.description}

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
${examples.map(row).join('\n')}`;
}

const markdown = `# LLM Surface

Operational surface for LLM-driven discovery against the published Praxis backend.

Last reviewed: \`${reviewedAt}\`

This file is generated from [\`examples.manifest.json\`](./examples.manifest.json).
Current validation commands:

- \`npm run smoke:public\`
- \`npm run smoke:auth\`
- \`npm run smoke:llm-surface\`

Current CI baseline:

- \`npm run verify:manifest\`
- \`npm run smoke:llm-surface\`
- \`npm run smoke:corpus-promises\`
- \`npm run smoke:bootstrap-minimums\`

## Scope

This surface is intentionally limited to examples that are both:

- useful for LLM-driven discovery or parameter understanding
- currently operational against the published Render backend

Examples outside this list remain important, but they are classified as \`protectedContract\` or \`referenceOnly\`.

## Safe-First Operational Playbook

Prefer this path over browsing the raw OpenAPI document in isolation.
The steps are ordered from safest and broadest discovery to more contextual operational reads.

Public lane:
- Start with \`health\`, \`openapi-docs\`, \`schemas-catalog\`, and filtered schemas.
- These do not require tenant-scoped headers.

Auth-light lane:
- Then move to options, views, and expansion detail with the loosest accepted request shape for the published backend.
- Add \`X-Tenant-ID: demo\`, \`X-Env: public\`, and \`X-User-ID: example-user\` as the default recommended stable scoped headers for this lane.
- These examples do not require login cookies, bearer tokens, or a server-side session bootstrap.

${playbookSteps.map(stepSection).join('\n\n')}

## Full LLM Operational Set

### Public Core

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
${publicCore.map(row).join('\n')}

### Auth-Light Operational Examples

| Id | File | Access (minimum) | Recommended stable | Purpose |
|---|---|---|---|---|
${authLight.map(row).join('\n')}

## Not In This Surface

The following remain outside the LLM operational surface for now:

- \`config/ui\` as canonical remote layout storage
- \`ai-context\`
- \`ai-registry\`
- \`ai/suggestions\`
- destructive writes
- unstable published examples

Those examples are still kept in the catalog as \`protectedContract\` or \`referenceOnly\` for contract understanding, troubleshooting, and future expansion.
`;

fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${path.relative(root, outputPath)}`);
