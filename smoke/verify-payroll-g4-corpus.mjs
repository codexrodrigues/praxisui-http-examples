import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const examples = new Map(manifest.examples.map((example) => [example.id, example]));
const failures = [];
// Explicit resource/operation bindings derived from the G4 host, not filename classification.
const contracts = [
  ['payroll-g4-detail', 'GET', '/api/human-resources/folhas-pagamento/42', false],
  ['payroll-g4-create', 'POST', '/api/human-resources/folhas-pagamento', true],
  ['payroll-g4-edit', 'PUT', '/api/human-resources/folhas-pagamento/42', true],
  ['payroll-g4-event-detail', 'GET', '/api/human-resources/eventos-folha/21', false],
  ['payroll-g4-event-create', 'POST', '/api/human-resources/eventos-folha', true],
  ['payroll-g4-event-move', 'PUT', '/api/human-resources/eventos-folha/21', true],
  ['payroll-g4-event-reject', 'POST', '/api/human-resources/eventos-folha/21/actions/reject', true],
  ['payroll-g4-schedule', 'PATCH', '/api/human-resources/folhas-pagamento/42/payment-schedule', true],
  ['payroll-g4-mark-paid', 'POST', '/api/human-resources/folhas-pagamento/42/actions/mark-paid', true],
  ['payroll-g4-redetermine', 'POST', '/api/human-resources/folhas-pagamento/42/actions/redetermine', true],
  ['payroll-g4-event-create-schema', 'GET', '/schemas/filtered', false],
  ['payroll-g4-event-edit-schema', 'GET', '/schemas/filtered', false],
  ['payroll-g4-bulk-publish', 'POST', '/api/human-resources/eventos-folha/actions/bulk-approve/publication/publish', true],
  ['payroll-g4-bulk-reconcile', 'POST', '/api/human-resources/eventos-folha/actions/bulk-approve/publication/reconcile', true],
  ['payroll-g4-bulk-suspend', 'POST', '/api/human-resources/eventos-folha/actions/bulk-approve/publication/suspend', true],
];
const versioned = new Set(['payroll-g4-edit', 'payroll-g4-event-move', 'payroll-g4-event-reject',
  'payroll-g4-schedule', 'payroll-g4-mark-paid', 'payroll-g4-redetermine']);
const idempotent = new Set(['payroll-g4-event-reject', 'payroll-g4-schedule', 'payroll-g4-mark-paid', 'payroll-g4-redetermine']);
const parentSets = new Map([
  ['payroll-g4-event-create', [42]], ['payroll-g4-event-move', [42, 43]], ['payroll-g4-event-reject', [42]],
]);

for (const [id, method, endpoint, write] of contracts) {
  const example = examples.get(id);
  check(Boolean(example), `${id}: missing manifest entry`);
  if (!example) continue;
  const schema = id === 'payroll-g4-event-create-schema' || id === 'payroll-g4-event-edit-schema';
  for (const [key, value] of Object.entries({ llmOperational: false, protectedContract: !write,
    referenceOnly: write, public: false, runtimeRecordConfirmed: false, publishedBackendConfirmed: false,
    selectorConfirmed: true, knownPublishedFailure: false, destructive: write,
    authRequired: !schema, sessionAuthRequired: !schema, tenantScopedHeadersRequired: false })) {
    check(example[key] === value, `${id}: ${key} must remain ${value}`);
  }
  check(JSON.stringify(example.status) === '["illustrative-only"]', `${id}: candidate status must stay illustrative-only`);
  check((example.sourceOfTruth ?? []).some((source) => source.startsWith('../praxis-api-quickstart/src/main/java/')),
    `${id}: missing canonical host source`);
  const raw = fs.readFileSync(path.join(root, example.httpFile), 'utf8');
  const requests = raw.match(/^(?:GET|POST|PUT|PATCH|DELETE)\s+/gm) ?? [];
  check(requests.length === 1, `${id}: parser requires one indexed request per file`);
  const request = parseHttpExample(root, example, 'http://localhost:8088');
  const url = new URL(request.url);
  check(request.method === method && url.pathname === endpoint, `${id}: canonical method/path mismatch`);
  check(url.origin === 'http://localhost:8088', `${id}: source-derived G4 examples must target the official local origin`);
  for (const name of ['X-Tenant-ID', 'X-Env', 'X-User-ID']) check(!(name in request.headers), `${id}: caller-authored ${name}`);
  check(request.headers.Accept === 'application/json', `${id}: missing Accept`);
  if (!schema) check(request.headers.Cookie?.includes('SESSION='), `${id}: missing authenticated session`);
  if (write) {
    check(request.headers.Cookie?.includes('XSRF-TOKEN=') && request.headers['X-XSRF-TOKEN'], `${id}: CSRF pair missing`);
    check((example.payloadFiles ?? []).length === 1 && request.body, `${id}: one indexed payload required`);
  }
  if (versioned.has(id)) check(/^"[^"\r\n]+"$/.test(request.headers['If-Match'] ?? ''), `${id}: singular strong If-Match required`);
  else check(!request.headers['If-Match'], `${id}: unexpected main resource precondition`);
  if (idempotent.has(id)) check(Boolean(request.headers['Idempotency-Key']), `${id}: idempotency key required`);
  for (const key of ['status', 'llmOperational', 'protectedContract', 'referenceOnly', 'publishedBackendConfirmed', 'runtimeRecordConfirmed']) {
    const expected = Array.isArray(example[key]) ? example[key].join(',') : String(example[key]);
    check(raw.includes(`### ${key}: ${expected}\n`), `${id}: ${key} frontmatter mismatch`);
  }
  if (schema) {
    check(url.searchParams.get('schemaType') === 'request', `${id}: request schema required`);
    const edit = id === 'payroll-g4-event-edit-schema';
    check(url.searchParams.get('path') === `/api/human-resources/eventos-folha${edit ? '/{id}' : ''}`
      && url.searchParams.get('operation') === (edit ? 'put' : 'post'), `${id}: operation-specific schema mismatch`);
  }
  if (!request.body) continue;
  const payload = JSON.parse(request.body);
  check(!('dataPagamento' in payload), `${id}: ambiguous public payment date is removed`);
  if (['payroll-g4-bulk-publish', 'payroll-g4-bulk-reconcile', 'payroll-g4-bulk-suspend'].includes(id)) {
    check(JSON.stringify(Object.keys(payload)) === '["expectedGeneration"]', `${id}: only exact control generation is caller input`);
    check(payload.expectedGeneration === (id === 'payroll-g4-bulk-publish' ? 0 : 1), `${id}: illustrative generation must remain explicit`);
    check(!request.headers['Idempotency-Key'], `${id}: administrative generation is the existing SDK precondition`);
    check((example.sourceOfTruth ?? []).some((source) => source.endsWith('/BulkPublicationAdministration.java')),
      `${id}: shared host admission source is required`);
  }
  if (id === 'payroll-g4-create' || id === 'payroll-g4-edit') {
    const keys = ['funcionarioId', 'ano', 'mes', 'salarioBruto', 'descontosBase', 'totalDescontos', 'salarioLiquido', 'dataPagamentoPrevista'];
    if (id === 'payroll-g4-edit') keys.push('id');
    check(JSON.stringify(Object.keys(payload).sort()) === JSON.stringify(keys.sort()), `${id}: command tuple must be exact`);
    if (id === 'payroll-g4-edit') check(payload.id === 42, `${id}: body id must equal route id`);
  }
  if (parentSets.has(id)) {
    const expected = parentSets.get(id);
    check(JSON.stringify(payload.precondicoesFolhas?.map((parent) => parent.folhaPagamentoId)) === JSON.stringify(expected),
      `${id}: exact affected parent set required`);
    for (const parent of payload.precondicoesFolhas ?? []) check(/^"[^"\r\n]+"$/.test(parent.resourceVersion), `${id}: opaque strong parent token required`);
    if ('tipo' in payload) check(['ADICIONAL', 'DESCONTO'].includes(payload.tipo), `${id}: unsupported writable event type`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Payroll G4 corpus OK: ${contracts.length} source-derived contracts; no runtime/publication claim.`);
function check(condition, message) { if (!condition) failures.push(message); }
