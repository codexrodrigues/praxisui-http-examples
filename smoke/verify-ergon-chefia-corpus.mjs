import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const examples = new Map((manifest.examples ?? []).map((example) => [example.id, example]));
const failures = [];

const contracts = [
  {
    id: 'ergon-chefia-radar-filter-hierarquia',
    httpFile: 'http/hr/ergon_chefia_radar_filter_hierarquia.http',
    payloadFiles: ['payloads/hr/ergon_chefia_radar_filter_hierarquia.json'],
    method: 'POST',
    endpoint: '/api/ergon/radar-chefias-substituicoes/filter',
    expectedStatus: 200,
    responseShapeHint: 'restApiResponse<page<row>>',
    protectedContract: true,
    referenceOnly: false,
    destructive: false,
    requireXsrf: true,
    requiredPayloadKeys: ['empCodigo', 'setorPai', 'caminhoHierarquicoPrefixo', 'situacao', 'substitutoNome'],
  },
  {
    id: 'ergon-chefia-radar-detail',
    httpFile: 'http/hr/ergon_chefia_radar_detail.http',
    payloadFiles: [],
    method: 'GET',
    endpoint: '/api/ergon/radar-chefias-substituicoes/30/detail',
    expectedStatus: 200,
    responseShapeHint: 'row',
    protectedContract: true,
    referenceOnly: false,
    destructive: false,
    requireXsrf: false,
  },
  {
    id: 'ergon-chefia-substituicoes-previa',
    httpFile: 'http/hr/ergon_chefia_substituicoes_previa.http',
    payloadFiles: ['payloads/hr/ergon_chefia_substituicoes_previa.json'],
    method: 'POST',
    endpoint: '/api/ergon/substituicoes/determinations/previa',
    expectedStatus: 200,
    responseShapeHint: 'reactive-determination-result',
    protectedContract: true,
    referenceOnly: false,
    destructive: false,
    requireXsrf: true,
    requiredPayloadKeys: ['designacaoId', 'dtini', 'dtfim'],
  },
  {
    id: 'ergon-chefia-substituicoes-create-ausencia-eventual',
    httpFile: 'http/hr/ergon_chefia_substituicoes_create_ausencia_eventual.http',
    payloadFiles: ['payloads/hr/ergon_chefia_substituicoes_create_ausencia_eventual.json'],
    method: 'POST',
    endpoint: '/api/ergon/substituicoes',
    expectedStatus: 201,
    responseShapeHint: 'mutation-result',
    protectedContract: false,
    referenceOnly: true,
    destructive: true,
    requireXsrf: true,
    requiredPayloadKeys: ['empCodigo', 'descricao', 'dtini', 'dtfim', 'situacao', 'designacaoId', 'substitutoId', 'motivo'],
  },
  {
    id: 'ergon-chefia-substituicoes-filter-auditoria',
    httpFile: 'http/hr/ergon_chefia_substituicoes_filter_auditoria.http',
    payloadFiles: ['payloads/hr/ergon_chefia_substituicoes_filter_auditoria.json'],
    method: 'POST',
    endpoint: '/api/ergon/substituicoes/filter',
    expectedStatus: 200,
    responseShapeHint: 'restApiResponse<page<row>>',
    protectedContract: true,
    referenceOnly: false,
    destructive: false,
    requireXsrf: true,
    requiredPayloadKeys: ['empCodigo', 'setorPai', 'caminhoHierarquicoPrefixo', 'semDocumentoLegal', 'motivo'],
  },
  {
    id: 'ergon-chefia-designacoes-filter-hierarquia',
    httpFile: 'http/hr/ergon_chefia_designacoes_filter_hierarquia.http',
    payloadFiles: ['payloads/hr/ergon_chefia_designacoes_filter_hierarquia.json'],
    method: 'POST',
    endpoint: '/api/ergon/designacoes/filter',
    expectedStatus: 200,
    responseShapeHint: 'restApiResponse<page<row>>',
    protectedContract: true,
    referenceOnly: false,
    destructive: false,
    requireXsrf: true,
    requiredPayloadKeys: ['empCodigo', 'setorPai', 'caminhoHierarquicoPrefixo', 'situacao'],
  },
  {
    id: 'ergon-chefia-vagas-funcao-filter-hierarquia',
    httpFile: 'http/hr/ergon_chefia_vagas_funcao_filter_hierarquia.http',
    payloadFiles: ['payloads/hr/ergon_chefia_vagas_funcao_filter_hierarquia.json'],
    method: 'POST',
    endpoint: '/api/ergon/vagas-funcao/filter',
    expectedStatus: 200,
    responseShapeHint: 'restApiResponse<page<row>>',
    protectedContract: true,
    referenceOnly: false,
    destructive: false,
    requireXsrf: true,
    requiredPayloadKeys: ['empCodigo', 'setorPai', 'caminhoHierarquicoPrefixo', 'situacao'],
  },
  {
    id: 'ergon-chefia-designacoes-homologar-lote-evaluation',
    httpFile: 'http/hr/ergon_chefia_designacoes_homologar_lote_evaluation.http',
    payloadFiles: ['payloads/hr/ergon_chefia_designacoes_homologar_lote_evaluation.json'],
    method: 'POST',
    endpoint: '/api/ergon/designacoes/bulk/homologar-designacoes-lote/evaluation',
    expectedStatus: 200,
    responseShapeHint: 'mutation-result',
    protectedContract: false,
    referenceOnly: true,
    destructive: true,
    requireXsrf: true,
    requiredPayloadKeys: ['executionMode', 'selection', 'input'],
  },
];

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const contract of contracts) {
  const example = examples.get(contract.id);
  check(Boolean(example), `${contract.id}: missing manifest entry`);
  if (!example) continue;

  check(example.httpFile === contract.httpFile, `${contract.id}: httpFile mismatch`);
  check(JSON.stringify(example.payloadFiles ?? []) === JSON.stringify(contract.payloadFiles), `${contract.id}: payloadFiles mismatch`);
  check(JSON.stringify(example.status) === '["illustrative-only"]', `${contract.id}: status must stay ["illustrative-only"]`);

  for (const [key, value] of Object.entries({
    llmOperational: false,
    protectedContract: contract.protectedContract,
    referenceOnly: contract.referenceOnly,
    public: false,
    authRequired: true,
    sessionAuthRequired: true,
    tenantScopedHeadersRequired: true,
    destructive: contract.destructive,
    requiresTenantHeaders: true,
    runtimeRecordConfirmed: false,
    selectorConfirmed: true,
    publishedBackendConfirmed: false,
    knownPublishedFailure: false,
    expectedStatus: contract.expectedStatus,
    responseShapeHint: contract.responseShapeHint,
  })) {
    check(example[key] === value, `${contract.id}: ${key} must remain ${value}`);
  }

  check(
    (example.sourceOfTruth ?? []).some((source) =>
      source.startsWith('../praxis-ergon-showcase/src/main/java/br/com/praxis/ergonshowcase/'),
    ),
    `${contract.id}: missing canonical praxis-ergon-showcase sourceOfTruth`,
  );

  for (const sourcePath of example.sourceOfTruth ?? []) {
    check(
      fs.existsSync(path.resolve(root, sourcePath)),
      `${contract.id}: sourceOfTruth path does not exist: ${sourcePath}`,
    );
  }

  const raw = fs.readFileSync(path.join(root, example.httpFile), 'utf8').replaceAll('\r\n', '\n');
  for (const key of [
    'status',
    'llmOperational',
    'protectedContract',
    'referenceOnly',
    'publishedBackendConfirmed',
    'runtimeRecordConfirmed',
  ]) {
    const expected = Array.isArray(example[key]) ? example[key].join(',') : String(example[key]);
    check(raw.includes(`### ${key}: ${expected}\n`), `${contract.id}: ${key} frontmatter mismatch`);
  }

  const request = parseHttpExample(root, example, 'http://localhost:8080');
  const url = new URL(request.url);
  check(
    request.method === contract.method && url.pathname === contract.endpoint,
    `${contract.id}: canonical method/path mismatch (${request.method} ${url.pathname} !== ${contract.method} ${contract.endpoint})`,
  );
  check(url.origin === 'http://localhost:8080', `${contract.id}: must target http://localhost:8080`);
  check(request.headers.Accept === 'application/json', `${contract.id}: missing Accept: application/json`);
  check(request.headers.Cookie?.includes('ERGONSESSION='), `${contract.id}: missing ERGONSESSION cookie`);
  check(Boolean(request.headers['X-Tenant']), `${contract.id}: missing X-Tenant header`);

  if (contract.requireXsrf) {
    check(
      request.headers.Cookie?.includes('XSRF-TOKEN=') && Boolean(request.headers['X-XSRF-TOKEN']),
      `${contract.id}: missing XSRF-TOKEN cookie/header pair`,
    );
  }

  if (contract.payloadFiles.length === 1) {
    check(Boolean(request.body), `${contract.id}: missing request body`);
    if (request.body) {
      const payload = JSON.parse(request.body);
      for (const requiredKey of contract.requiredPayloadKeys ?? []) {
        check(requiredKey in payload, `${contract.id}: payload missing key "${requiredKey}"`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Ergon Chefia e Substituições HTTP corpus verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Ergon Chefia e Substituições HTTP corpus OK: ${contracts.length} examples verified.`);
