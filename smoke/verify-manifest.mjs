import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'examples.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const allowedStatuses = new Set([
  'runtime-confirmed',
  'recommended',
  'legacy',
  'illustrative-only',
]);
const allowedResponseShapeHints = new Set([
  'health-status',
  'openapi-document',
  'array<schema-catalog-entry>',
  'filtered-schema',
  'page<option>',
  'array<option>',
  'restApiResponse<page<row>>',
  'stats-group-by',
  'stats-timeseries',
  'detail-schema',
  'config-record',
  'row',
  'array<row>',
  'mutation-result',
  'error-response',
  'array<suggestion>',
  'ai-clarification-response',
]);

const errors = [];
const seenIds = new Set();
const seenHttpFiles = new Set();
const referencedFiles = new Set();

function collectFiles(dir, bucket) {
  const dirPath = path.join(root, dir);
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectFiles(path.join(dir, entry.name), bucket);
    } else {
      bucket.push(path.relative(root, entryPath).replaceAll('\\', '/'));
    }
  }
}

for (const example of manifest.examples ?? []) {
  if (!example.id) errors.push('Example without id.');
  if (!example.httpFile) errors.push(`Example ${example.id} missing httpFile.`);
  if (seenIds.has(example.id)) {
    errors.push(`Duplicate example id: ${example.id}`);
  }
  seenIds.add(example.id);
  const declaredLayers = [
    example.llmOperational === true,
    example.protectedContract === true,
    example.referenceOnly === true,
  ].filter(Boolean).length;
  if (declaredLayers > 1) {
    errors.push(`Example ${example.id} cannot declare more than one surface layer.`);
  }
  if (declaredLayers === 0) {
    errors.push(`Example ${example.id} must declare one surface layer: llmOperational, protectedContract, or referenceOnly.`);
  }
  if (example.httpFile) {
    if (seenHttpFiles.has(example.httpFile)) {
      errors.push(`Duplicate httpFile reference: ${example.httpFile}`);
    }
    seenHttpFiles.add(example.httpFile);
    referencedFiles.add(example.httpFile);
  }

  const httpPath = path.join(root, example.httpFile ?? '');
  if (!fs.existsSync(httpPath)) {
    errors.push(`Missing http file for ${example.id}: ${example.httpFile}`);
  }

  for (const status of example.status ?? []) {
    if (!allowedStatuses.has(status)) {
      errors.push(`Invalid status "${status}" in ${example.id}`);
    }
  }

  if (typeof example.sessionAuthRequired !== 'boolean') {
    errors.push(`Example ${example.id} must declare sessionAuthRequired as boolean.`);
  }

  if (typeof example.tenantScopedHeadersRequired !== 'boolean') {
    errors.push(`Example ${example.id} must declare tenantScopedHeadersRequired as boolean.`);
  }

  if (
    typeof example.authRequired !== 'boolean' ||
    example.authRequired !==
      (example.sessionAuthRequired === true || example.tenantScopedHeadersRequired === true)
  ) {
    errors.push(
      `Example ${example.id} must keep deprecated authRequired aligned with sessionAuthRequired || tenantScopedHeadersRequired.`,
    );
  }

  if (
    example.requiresTenantHeaders === true &&
    example.tenantScopedHeadersRequired !== true
  ) {
    errors.push(`Example ${example.id} cannot keep requiresTenantHeaders true while tenantScopedHeadersRequired is false.`);
  }

  for (const field of [
    'runtimeRecordConfirmed',
    'selectorConfirmed',
    'publishedBackendConfirmed',
    'knownPublishedFailure',
  ]) {
    if (typeof example[field] !== 'boolean') {
      errors.push(`Example ${example.id} must declare ${field} as boolean.`);
    }
  }

  if (example.publishedBackendConfirmed === true && example.runtimeRecordConfirmed !== true) {
    errors.push(`Example ${example.id} cannot set publishedBackendConfirmed true while runtimeRecordConfirmed is false.`);
  }

  if (typeof example.responseShapeHint !== 'string' || !allowedResponseShapeHints.has(example.responseShapeHint)) {
    errors.push(`Example ${example.id} must declare a valid responseShapeHint.`);
  }

  for (const payloadFile of example.payloadFiles ?? []) {
    const payloadPath = path.join(root, payloadFile);
    if (!fs.existsSync(payloadPath)) {
      errors.push(`Missing payload file for ${example.id}: ${payloadFile}`);
    }
    referencedFiles.add(payloadFile);
  }
}

const repoFiles = [];
collectFiles('http', repoFiles);
collectFiles('payloads', repoFiles);

for (const file of repoFiles) {
  if (!referencedFiles.has(file)) {
    errors.push(`Unreferenced catalog file: ${file}`);
  }
}

const llmSurfacePath = path.join(root, 'LLM_SURFACE.md');
const llmSurfaceBefore = fs.existsSync(llmSurfacePath) ? fs.readFileSync(llmSurfacePath, 'utf8') : '';
const generateResult = spawnSync(process.execPath, [path.join(root, 'smoke', 'generate-llm-surface.mjs')], {
  cwd: root,
  encoding: 'utf8',
});

if (generateResult.status !== 0) {
  errors.push(`Failed to regenerate LLM_SURFACE.md: ${generateResult.stderr || generateResult.stdout}`);
} else {
  const llmSurfaceAfter = fs.existsSync(llmSurfacePath) ? fs.readFileSync(llmSurfacePath, 'utf8') : '';
  if (llmSurfaceBefore !== llmSurfaceAfter) {
    errors.push('LLM_SURFACE.md is out of date. Run `npm run generate:llm-surface` and commit the result.');
  }
}

if (errors.length) {
  console.error('Manifest validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Manifest OK: ${manifest.examples.length} examples validated.`);
