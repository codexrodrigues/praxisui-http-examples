import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const bootstrap = JSON.parse(fs.readFileSync(path.join(root, 'llm_bootstrap.json'), 'utf8'));
const baseUrl = process.env.BASE_URL || manifest.defaultBaseUrl;

const errors = [];

function ensureJsonContentType(method, headers) {
  if (method === 'POST' || method === 'PUT') {
    return {
      ...headers,
      'Content-Type': 'application/json',
    };
  }
  return headers;
}

async function check(name, request) {
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  console.log(`${name}: ${response.status} ${request.method} ${request.url}`);
  return response;
}

const publicMinimumHeaders = bootstrap.safeFirst?.publicMetadata?.minimumHeaders ?? {};
for (const id of bootstrap.safeFirst?.publicMetadata?.exampleIds ?? []) {
  const example = (manifest.examples ?? []).find((entry) => entry.id === id);
  if (!example?.httpFile) continue;
  const request = minimalRequestForExample(example, publicMinimumHeaders);
  const response = await check(`${id} [public minimum]`, request);
  if (!response.ok) {
    errors.push(`Public bootstrap minimum failed for ${id} with status ${response.status}.`);
  }
}

const authLightMinimumHeaders = bootstrap.safeFirst?.authLightOperational?.minimumHeaders ?? {};
for (const id of bootstrap.safeFirst?.authLightOperational?.exampleIds ?? []) {
  const example = (manifest.examples ?? []).find((entry) => entry.id === id);
  if (!example?.httpFile) continue;
  const request = minimalRequestForExample(example, authLightMinimumHeaders);
  const response = await check(`${id} [auth-light minimum]`, request);
  if (!response.ok) {
    errors.push(`Auth-light bootstrap minimum failed for ${id} with status ${response.status}.`);
  }
}

for (const group of bootstrap.protectedContract?.groups ?? []) {
  for (const id of group.exampleIds ?? []) {
    const example = (manifest.examples ?? []).find((entry) => entry.id === id);
    if (!example?.httpFile) continue;
    if (
      example.destructive === true ||
      example.runtimeRecordConfirmed !== true ||
      example.publishedBackendConfirmed !== true ||
      example.knownPublishedFailure === true
    ) {
      continue;
    }
    const request = minimalRequestForExample(example, group.minimumHeaders ?? {});
    const response = await check(`${id} [${group.name} minimum]`, request);
    if (!response.ok) {
      errors.push(`Protected bootstrap minimum failed for ${id} with status ${response.status}.`);
    }
  }
}

if (errors.length) {
  console.error('Bootstrap minimum smoke failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Bootstrap minimums OK.');

function minimalRequestForExample(example, minimumHeaders) {
  const httpPath = path.join(root, example.httpFile);
  const raw = fs.readFileSync(httpPath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const vars = { baseUrl };
  let index = 0;

  for (; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line || line.startsWith('###')) continue;
    const varMatch = line.match(/^@([A-Za-z0-9_]+)\s*=\s*(.+)$/);
    if (!varMatch) break;
    vars[varMatch[1]] = stripQuotes(varMatch[2].trim());
  }

  while (index < lines.length && (!lines[index].trim() || lines[index].trim().startsWith('###'))) {
    index += 1;
  }

  const requestLine = lines[index]?.trim();
  const requestMatch = requestLine?.match(/^(GET|POST|PUT|DELETE)\s+(.+)$/);
  if (!requestMatch) {
    throw new Error(`No request line found in ${example.httpFile}`);
  }

  const method = requestMatch[1];
  const endpoint = interpolate(requestMatch[2], vars);
  index += 1;

  let body;
  for (; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed || trimmed.startsWith('###')) continue;
    if (trimmed.startsWith('< ')) {
      const relativePayloadPath = trimmed.slice(2).trim();
      const payloadPath = path.resolve(path.dirname(httpPath), relativePayloadPath);
      body = fs.readFileSync(payloadPath, 'utf8');
    }
  }

  return {
    method,
    url: endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`,
    headers: ensureJsonContentType(method, minimumHeaders),
    body,
  };
}

function interpolate(input, vars) {
  return input.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
