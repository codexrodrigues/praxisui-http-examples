import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const byId = new Map((manifest.examples ?? []).map((example) => [example.id, example]));
const baseUrl = process.env.BASE_URL || 'http://localhost:8088';
const sessionCookie = process.env.PRAXIS_SESSION_COOKIE;
const requireAuthExecution = process.env.REQUIRE_AUTH_EXECUTION === 'true';
const errors = [];

const schemas = [
  ['reactive-determination-address-create-schema', 'human-resources.address.by-postal-code', 'createAddress', 'create', 'determinePostalAddress', 1],
  ['reactive-determination-address-edit-schema', 'human-resources.address.by-postal-code', 'updateAddress', 'edit', 'determinePostalAddress', 1],
  ['reactive-determination-payroll-create-schema', 'human-resources.payroll.net-salary', 'createPayroll', 'create', 'determinePayrollNetSalary', 2],
  ['reactive-determination-payroll-create-schema', 'human-resources.payroll.payment-date', 'createPayroll', 'create', 'determinePayrollPaymentDate', 2],
  ['reactive-determination-payroll-edit-schema', 'human-resources.payroll.net-salary', 'updatePayroll', 'edit', 'determinePayrollNetSalary', 2],
  ['reactive-determination-payroll-edit-schema', 'human-resources.payroll.payment-date', 'updatePayroll', 'edit', 'determinePayrollPaymentDate', 2],
];

for (const [id, determinationId, schemaOperationId, formMode, capabilityOperationId, expectedCount] of schemas) {
  const { request, response, body } = await execute(id);
  console.log(`${id}: ${response.status} ${request.method} ${request.url}`);
  if (response.status !== 200) {
    errors.push(`${id} expected 200, received ${response.status}.`);
    continue;
  }
  const determinations = body?.['x-ui']?.reactiveDeterminations;
  if (!Array.isArray(determinations) || determinations.length !== expectedCount) {
    errors.push(`${id} must publish exactly ${expectedCount} x-ui.reactiveDeterminations entries.`);
    continue;
  }
  const determination = determinations.find((candidate) => candidate.id === determinationId);
  if (!determination) {
    errors.push(`${id} did not publish determination ${determinationId}.`);
    continue;
  }
  requireEqual(determination.id, determinationId, `${id} determination id`);
  requireEqual(determination.scope?.schemaOperationId, schemaOperationId, `${id} schema operationId`);
  requireEqual(determination.scope?.formMode, formMode, `${id} form mode`);
  requireEqual(determination.capability?.operationId, capabilityOperationId, `${id} capability operationId`);
  const serialized = JSON.stringify(determination).toLowerCase();
  if (serialized.includes('tenant') || serialized.includes('headers')) {
    errors.push(`${id} leaked tenant or header material into tenant-neutral metadata.`);
  }
}

const capabilityIds = [
  'reactive-determination-address-known-cep',
  'reactive-determination-address-unknown-cep-422',
  'reactive-determination-payroll-net-salary',
  'reactive-determination-payroll-payment-date',
  'reactive-determination-payroll-invalid-discounts-422',
];

if (!sessionCookie) {
  const message = 'Authenticated capability execution skipped: set PRAXIS_SESSION_COOKIE to a local Quickstart SESSION value.';
  if (requireAuthExecution) errors.push(message);
  else console.log(message);
} else {
  for (const id of capabilityIds) {
    const { request, response, body } = await execute(id, sessionCookie);
    const example = byId.get(id);
    console.log(`${id}: ${response.status} ${request.method} ${request.url}`);
    requireEqual(response.status, example.expectedStatus, `${id} HTTP status`);
    if (id === 'reactive-determination-address-known-cep' && response.status === 200) {
      requireEqual(body?.logradouro, 'Avenida Paulista', `${id} logradouro`);
      requireEqual(body?.decisionVersion, 'quickstart-postal-directory-v1', `${id} decisionVersion`);
    }
    if (id === 'reactive-determination-payroll-net-salary' && response.status === 200) {
      requireEqual(String(body?.salarioLiquido), '7549.65', `${id} salarioLiquido`);
      requireEqual(body?.decisionVersion, 'payroll-net-v1-half-even', `${id} decisionVersion`);
    }
    if (id === 'reactive-determination-payroll-payment-date' && response.status === 200) {
      requireEqual(body?.dataPagamento, '2026-05-07', `${id} dataPagamento`);
      requireEqual(body?.decisionVersion, 'payroll-calendar-v1-fifth-weekday', `${id} decisionVersion`);
    }
  }
}

async function execute(id, cookie) {
  const example = byId.get(id);
  if (!example) throw new Error(`Missing example ${id}`);
  const parsed = parseHttpExample(root, example, baseUrl);
  const committedUrl = new URL(parsed.url);
  const request = {
    ...parsed,
    url: new URL(`${committedUrl.pathname}${committedUrl.search}`, baseUrl).toString(),
    headers: { ...parsed.headers },
  };
  if (cookie) request.headers.Cookie = `SESSION=${cookie}`;
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { request, response, body };
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) errors.push(`${label}: expected ${expected}, received ${actual}`);
}

if (errors.length) {
  console.error('Reactive determination smoke failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Reactive determination smoke OK.');
