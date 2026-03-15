import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const outputPath = path.join(root, 'LLM_SURFACE.md');
const reviewedAt = new Date().toISOString().slice(0, 10);

const llmExamples = (manifest.examples ?? []).filter((example) => example.llmOperational === true);
const publicCore = llmExamples.filter(
  (example) => example.public === true && example.authRequired === false && example.destructive === false,
);
const authLight = llmExamples.filter(
  (example) => !(example.public === true && example.authRequired === false && example.destructive === false),
);

function row(example) {
  const purpose = (example.canonicalFor ?? []).join('; ') || 'See manifest';
  return `| \`${example.id}\` | \`${example.httpFile}\` | ${purpose} |`;
}

const markdown = `# LLM Surface

Operational surface for LLM-driven discovery against the published Praxis backend.

Last reviewed: \`${reviewedAt}\`

This file is generated from [\`examples.manifest.json\`](./examples.manifest.json).
The executable baseline is validated by:

- \`npm run smoke:public\`
- \`npm run smoke:auth\`
- \`npm run smoke:llm-surface\`

## Scope

This surface is intentionally limited to examples that are both:

- useful for LLM-driven discovery or parameter understanding
- currently operational against the published Render backend

Examples outside this list remain important, but they are classified as \`referenceOnly\`.

## Public Core

| Id | File | Purpose |
|---|---|---|
${publicCore.map(row).join('\n')}

## Auth-Light Operational Examples

These examples are not public, but they currently work on the published backend with lightweight tenant/user headers and no destructive mutation.

| Id | File | Purpose |
|---|---|---|
${authLight.map(row).join('\n')}

## Not In This Surface

The following remain outside the LLM operational surface for now:

- \`config/ui\`
- \`ai-context\`
- \`ai-registry\`
- \`ai/suggestions\`
- destructive writes
- unstable published examples

Those examples are still kept in the catalog as \`referenceOnly\` for contract understanding, troubleshooting, and future expansion.
`;

fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${path.relative(root, outputPath)}`);
