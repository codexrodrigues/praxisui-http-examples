import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifestPath = path.join(root, 'examples.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const allowedStatuses = new Set([
  'runtime-confirmed',
  'recommended',
  'legacy',
  'illustrative-only',
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
  if (example.llmOperational === true && example.referenceOnly === true) {
    errors.push(`Example ${example.id} cannot be both llmOperational and referenceOnly.`);
  }
  if (example.llmOperational !== true && example.referenceOnly !== true) {
    errors.push(`Example ${example.id} must declare either llmOperational=true or referenceOnly=true.`);
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
