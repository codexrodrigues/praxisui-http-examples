import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'examples.manifest.json');
const outputPath = path.join(root, 'OPENAPI_COVERAGE.md');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const baseUrl = process.env.BASE_URL || manifest.defaultBaseUrl;

const openApi = await fetch(`${baseUrl}/v3/api-docs`, {
  headers: { Accept: 'application/json' },
}).then(async (response) => {
  if (!response.ok) {
    throw new Error(`OpenAPI fetch failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
});

function normalizeOpenApiPath(value) {
  return value.replace(/\{[^}]+}/g, '{}');
}

function controllerBase(value) {
  const parts = value.split('/').filter(Boolean);
  if (parts[0] === 'api' && parts[1] === 'praxis' && parts[2] === 'config') {
    if (parts[3] === 'ui' && parts.length >= 6) return '/api/praxis/config/ui/{componentType}';
    if (parts[3] === 'ai-context') return '/api/praxis/config/ai-context/{componentId}';
    if (parts[3] === 'ai-registry' && parts[4] === 'templates') return '/api/praxis/config/ai-registry/templates';
    if (parts[3] === 'domain-knowledge' && parts[4] === 'change-sets') {
      return '/api/praxis/config/domain-knowledge/change-sets';
    }
    if (parts[3] === 'domain-rules') return `/api/praxis/config/domain-rules/${parts[4] ?? ''}`;
    if (parts[3] === 'domain-catalog') return `/api/praxis/config/domain-catalog/${parts[4] ?? ''}`;
    if (parts[3] === 'domain-federation') return `/api/praxis/config/domain-federation/${parts[4] ?? ''}`;
    if (parts[3] === 'ai') return `/api/praxis/config/ai/${parts[4] ?? ''}`;
    return '/' + parts.slice(0, 5).join('/');
  }
  if (parts[0] === 'schemas') return '/schemas/' + (parts[1] || '');
  if (parts[0] === 'auth') return '/auth';
  if (parts[0] === 'actuator') return '/actuator';
  if (parts[0] === 'v3') return '/v3/api-docs';
  if (parts[0] === 'api') return '/' + parts.slice(0, 3).join('/');
  return '/' + parts.slice(0, 2).join('/');
}

function readRequest(httpFile) {
  const raw = fs.readFileSync(path.join(root, httpFile), 'utf8');
  const match = raw.match(/^(GET|POST|PUT|PATCH|DELETE)\s+\{\{baseUrl\}\}([^\s]+)$/m);
  if (!match) return null;
  const endpoint = match[2].split('?')[0];
  return {
    method: match[1].toUpperCase(),
    path: normalizeOpenApiPath(endpoint),
    base: controllerBase(endpoint),
  };
}

const coveredByBase = new Map();
const coveredEndpointKeys = new Set();
for (const example of manifest.examples ?? []) {
  if (!example.httpFile) continue;
  const request = readRequest(example.httpFile);
  if (!request) continue;
  coveredEndpointKeys.add(`${request.method} ${request.path}`);
  if (!coveredByBase.has(request.base)) coveredByBase.set(request.base, []);
  coveredByBase.get(request.base).push(example.id);
}

const openApiByBase = new Map();
let totalEndpoints = 0;
for (const [openApiPath, operations] of Object.entries(openApi.paths ?? {})) {
  const base = controllerBase(openApiPath);
  if (!openApiByBase.has(base)) {
    openApiByBase.set(base, { endpointCount: 0, tags: new Set(), examples: [], samples: [] });
  }
  for (const [method, operation] of Object.entries(operations)) {
    if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
    totalEndpoints += 1;
    const row = openApiByBase.get(base);
    row.endpointCount += 1;
    for (const tag of operation.tags ?? []) row.tags.add(tag);
    if (row.samples.length < 5) row.samples.push(`${method.toUpperCase()} ${openApiPath}`);
  }
}

const rows = [...openApiByBase.entries()]
  .map(([base, value]) => {
    const examples = coveredByBase.get(base) ?? [];
    return {
      base,
      endpointCount: value.endpointCount,
      tags: [...value.tags].sort(),
      examples,
      covered: examples.length > 0,
      samples: value.samples,
    };
  })
  .sort((a, b) => a.base.localeCompare(b.base));

const uncovered = rows.filter((row) => !row.covered);
const generatedAt = new Date().toISOString().slice(0, 10);

function mdCell(value) {
  return String(value).replaceAll('|', '\\|').replace(/\r?\n/g, '<br>');
}

function rowLine(row) {
  const examples = row.examples.length ? row.examples.map((id) => `\`${id}\``).join(', ') : '_none_';
  return `| \`${mdCell(row.base)}\` | ${row.endpointCount} | ${row.covered ? 'yes' : 'no'} | ${examples} |`;
}

const markdown = `# OpenAPI Coverage

Generated from the published backend OpenAPI document.

- Base URL: \`${baseUrl}\`
- Generated at: \`${generatedAt}\`
- OpenAPI endpoints: \`${totalEndpoints}\`
- Resource/controller bases: \`${rows.length}\`
- Bases with at least one catalog example: \`${rows.length - uncovered.length}\`
- Bases without catalog examples: \`${uncovered.length}\`

This report is an audit aid. The HTTP example corpus is intentionally curated:
it should cover every important published surface at least once, while avoiding
hundreds of repetitive CRUD examples that add little operational value.

## Coverage By Base

| Published base | Endpoint count | Covered | Example ids |
|---|---:|---|---|
${rows.map(rowLine).join('\n')}

## Uncovered Bases

${uncovered.length ? uncovered.map((row) => `- \`${row.base}\` (${row.endpointCount} endpoints): ${row.samples.map((sample) => `\`${sample}\``).join(', ')}`).join('\n') : 'No uncovered bases.'}
`;

fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${path.relative(root, outputPath)} (${rows.length - uncovered.length}/${rows.length} bases covered)`);
