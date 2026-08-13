import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const byId = new Map((manifest.examples ?? []).map((example) => [example.id, example]));
const localBaseUrl = 'http://localhost:8088';
const errors = [];

const metadataExpectations = new Map([
  ['reactive-determination-address-create-schema', {
    path: '/api/human-resources/enderecos',
    operation: 'post',
  }],
  ['reactive-determination-address-edit-schema', {
    path: '/api/human-resources/enderecos/{id}',
    operation: 'put',
  }],
  ['reactive-determination-payroll-create-schema', {
    path: '/api/human-resources/folhas-pagamento',
    operation: 'post',
  }],
  ['reactive-determination-payroll-edit-schema', {
    path: '/api/human-resources/folhas-pagamento/{id}',
    operation: 'put',
  }],
]);

const executionExpectations = new Map([
  ['reactive-determination-address-known-cep', {
    path: '/api/human-resources/enderecos/determinations/postal-address',
    payload: { cep: '01310-100' },
    expectedStatus: 200,
  }],
  ['reactive-determination-address-unknown-cep-422', {
    path: '/api/human-resources/enderecos/determinations/postal-address',
    payload: { cep: '99999-999' },
    expectedStatus: 422,
  }],
  ['reactive-determination-payroll-net-salary', {
    path: '/api/human-resources/folhas-pagamento/determinations/net-salary',
    payload: { salarioBruto: 10000, totalDescontos: 2450.35 },
    expectedStatus: 200,
  }],
  ['reactive-determination-payroll-payment-date', {
    path: '/api/human-resources/folhas-pagamento/determinations/payment-date',
    payload: { ano: 2026, mes: 4, salarioLiquido: 7549.65 },
    expectedStatus: 200,
  }],
  ['reactive-determination-payroll-invalid-discounts-422', {
    path: '/api/human-resources/folhas-pagamento/determinations/net-salary',
    payload: { salarioBruto: 1000, totalDescontos: 1000.01 },
    expectedStatus: 422,
  }],
]);

for (const [id, expectation] of metadataExpectations) {
  const example = requireExample(id);
  if (!example) continue;
  requirePublishedOperationalMetadata(example);
  requireFlags(example, {
    authRequired: false,
    sessionAuthRequired: false,
    tenantScopedHeadersRequired: false,
    expectedStatus: 200,
  });
  requireSources(example, [
    '../praxis-metadata-starter/docs/spec/reactive-determinations.md',
    '../praxis-api-quickstart/docs/REACTIVE-DETERMINATION-PILOT.md',
  ]);

  requireFrontmatterAlignment(example);
  const request = parseHttpExample(root, example, localBaseUrl);
  const url = new URL(request.url);
  requireEqual(request.method, 'GET', `${id} method`);
  requireEqual(url.pathname, '/schemas/filtered', `${id} endpoint`);
  requireEqual(url.searchParams.get('path'), expectation.path, `${id} schema path`);
  requireEqual(url.searchParams.get('operation'), expectation.operation, `${id} schema operation`);
  requireEqual(url.searchParams.get('schemaType'), 'request', `${id} schemaType`);
  requireEqual(JSON.stringify(request.headers), JSON.stringify({ Accept: 'application/json' }), `${id} headers`);

  const raw = fs.readFileSync(path.join(root, example.httpFile), 'utf8');
  if (/^(?:X-Tenant-ID|X-Env|X-User-ID|Cookie|Authorization|Origin):/im.test(raw)) {
    errors.push(`${id} metadata discovery must not send tenant, user, session, authorization, or Origin headers.`);
  }
}

for (const [id, expectation] of executionExpectations) {
  const example = requireExample(id);
  if (!example) continue;
  requirePublishedProtectedExecution(example);
  requireFlags(example, {
    authRequired: true,
    sessionAuthRequired: true,
    tenantScopedHeadersRequired: false,
    expectedStatus: expectation.expectedStatus,
  });
  requireSources(example, ['../praxis-api-quickstart/docs/REACTIVE-DETERMINATION-PILOT.md']);

  requireFrontmatterAlignment(example);
  const request = parseHttpExample(root, example, localBaseUrl);
  const url = new URL(request.url);
  requireEqual(request.method, 'POST', `${id} method`);
  requireEqual(url.pathname, expectation.path, `${id} endpoint`);
  requireEqual(request.headers.Accept, 'application/json', `${id} Accept header`);
  requireEqual(request.headers['Content-Type'], 'application/json', `${id} Content-Type header`);
  requireEqual(request.headers.Cookie, 'SESSION=replace-with-session-cookie-value', `${id} session header`);
  if ('X-Tenant-ID' in request.headers || 'X-Env' in request.headers || 'X-User-ID' in request.headers) {
    errors.push(`${id} execution must use the authenticated principal instead of caller-authored tenant identity headers.`);
  }

  if ((example.payloadFiles ?? []).length !== 1) {
    errors.push(`${id} must reference exactly one deterministic payload fixture.`);
  } else {
    const payload = JSON.parse(fs.readFileSync(path.join(root, example.payloadFiles[0]), 'utf8'));
    requireEqual(JSON.stringify(payload), JSON.stringify(expectation.payload), `${id} payload`);
  }
}

function requireExample(id) {
  const example = byId.get(id);
  if (!example) errors.push(`Missing reactive determination example: ${id}`);
  return example;
}

function requirePublishedProtectedExecution(example) {
  requireEqual(example.referenceOnly === true, false, `${example.id} referenceOnly`);
  requireEqual(example.llmOperational === true, false, `${example.id} llmOperational`);
  requireEqual(example.protectedContract, true, `${example.id} protectedContract`);
  requireEqual(example.publishedBackendConfirmed, true, `${example.id} publishedBackendConfirmed`);
  requireEqual(example.runtimeRecordConfirmed, true, `${example.id} runtimeRecordConfirmed`);
  requireEqual(example.selectorConfirmed, true, `${example.id} selectorConfirmed`);
  requireEqual(example.destructive, false, `${example.id} destructive`);
}

function requirePublishedOperationalMetadata(example) {
  requireEqual(example.referenceOnly === true, false, `${example.id} referenceOnly`);
  requireEqual(example.llmOperational, true, `${example.id} llmOperational`);
  requireEqual(example.protectedContract === true, false, `${example.id} protectedContract`);
  requireEqual(example.public, true, `${example.id} public`);
  requireEqual(example.publishedBackendConfirmed, true, `${example.id} publishedBackendConfirmed`);
  requireEqual(example.runtimeRecordConfirmed, true, `${example.id} runtimeRecordConfirmed`);
  requireEqual(example.selectorConfirmed, true, `${example.id} selectorConfirmed`);
  requireEqual(example.destructive, false, `${example.id} destructive`);
}

function requireFlags(example, expected) {
  for (const [field, value] of Object.entries(expected)) {
    requireEqual(example[field], value, `${example.id} ${field}`);
  }
}

function requireSources(example, requiredSources) {
  for (const source of requiredSources) {
    if (!(example.sourceOfTruth ?? []).includes(source)) {
      errors.push(`${example.id} must reference canonical source ${source}`);
    }
  }
}

function requireFrontmatterAlignment(example) {
  const raw = fs.readFileSync(path.join(root, example.httpFile), 'utf8');
  const frontmatter = new Map();
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^###\s+([A-Za-z][A-Za-z0-9]*):\s*(.+)$/);
    if (match) frontmatter.set(match[1], match[2].trim());
  }
  const manifestStatuses = example.status ?? [];
  const fileStatuses = (frontmatter.get('status') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  requireEqual(JSON.stringify(fileStatuses), JSON.stringify(manifestStatuses), `${example.id} status frontmatter`);

  for (const field of [
    'public',
    'authRequired',
    'sessionAuthRequired',
    'tenantScopedHeadersRequired',
    'destructive',
    'requiresTenantHeaders',
    'llmOperational',
    'protectedContract',
    'referenceOnly',
    'runtimeRecordConfirmed',
    'selectorConfirmed',
    'publishedBackendConfirmed',
    'knownPublishedFailure',
  ]) {
    const fileValue = frontmatter.get(field) === 'true';
    const manifestValue = example[field] === true;
    requireEqual(fileValue, manifestValue, `${example.id} ${field} frontmatter`);
  }
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) errors.push(`${label}: expected ${expected}, received ${actual}`);
}

if (errors.length) {
  console.error('Reactive determination corpus validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Reactive determination corpus OK: ${metadataExpectations.size} schemas and ${executionExpectations.size} capability cases.`);
