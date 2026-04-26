import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const bootstrap = JSON.parse(fs.readFileSync(path.join(root, 'llm_bootstrap.json'), 'utf8'));
const baseUrl = process.env.BASE_URL || manifest.defaultBaseUrl;

const errors = [];
const llmOperationalExamples = (manifest.examples ?? []).filter((example) => example.llmOperational === true);
const operationalBootstrapIds = new Set([
  ...(bootstrap.safeFirst?.publicMetadata?.exampleIds ?? []),
  ...(bootstrap.safeFirst?.authLightOperational?.exampleIds ?? []),
  ...(bootstrap.safeFirst?.governedDecisionReadOnly?.exampleIds ?? []),
]);

for (const example of llmOperationalExamples) {
  if (example.knownPublishedFailure === true) {
    errors.push(`Example ${example.id} cannot be llmOperational while knownPublishedFailure is true.`);
    continue;
  }

  const request = parseHttpExample(root, example, baseUrl);
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  console.log(`${example.id}: ${response.status} ${request.method} ${request.url}`);
  if (!response.ok) {
    errors.push(`llmOperational example ${example.id} failed on the published backend with status ${response.status}.`);
  }
}

for (const example of manifest.examples ?? []) {
  if (example.protectedContract === true && operationalBootstrapIds.has(example.id)) {
    errors.push(`Protected contract example ${example.id} cannot appear in the operational bootstrap lanes.`);
  }
}

const protectedPublishedChecks = (manifest.examples ?? [])
  .filter(
    (example) =>
      example.protectedContract === true &&
      example.runtimeRecordConfirmed === true &&
      example.destructive === false &&
      example.httpFile,
  )
  .map((example) => ({
    example,
    request: parseHttpExample(root, example, baseUrl),
  }));

for (const { example, request } of protectedPublishedChecks) {
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  console.log(`${example.id}: ${response.status} ${request.method} ${request.url}`);

  if (example.knownPublishedFailure === true) {
    if (example.publishedBackendConfirmed !== true) {
      errors.push(`Protected example ${example.id} has knownPublishedFailure true and must also set publishedBackendConfirmed true when the failure is confirmed on the published backend.`);
    }
    if (response.ok) {
      errors.push(`Protected example ${example.id} is marked knownPublishedFailure but returned success on the published backend.`);
    }
    continue;
  }

  if (response.ok && example.publishedBackendConfirmed !== true) {
    errors.push(`Protected example ${example.id} returned success on the published backend but publishedBackendConfirmed is false.`);
  }

  if (!response.ok && example.publishedBackendConfirmed === true) {
    errors.push(`Protected example ${example.id} is marked publishedBackendConfirmed but returned ${response.status} on the published backend.`);
  }
}

if (errors.length) {
  console.error('Corpus promises smoke failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Corpus promises OK: ${llmOperationalExamples.length} llmOperational examples, ${operationalBootstrapIds.size} operational bootstrap ids.`);
