import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));

const baseUrl = stripTrailingSlash(process.env.BASE_URL || manifest.defaultBaseUrl);
const runId = process.env.SMOKE_RUN_ID || new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const tenantId = process.env.TENANT_ID || `domain-rules-publication-smoke-${runId}`;
const environment = process.env.ENVIRONMENT || 'dev';
const origin = process.env.ORIGIN || 'https://praxisui-dev.web.app';
const serviceKey = process.env.SERVICE_KEY || 'praxis-api-quickstart';
const contextKey = process.env.CONTEXT_KEY || 'procurement';
const resourceKey = process.env.RESOURCE_KEY || 'procurement.suppliers';
const optionSourceKey = process.env.OPTION_SOURCE_KEY || 'supplier';
const blockedStatuses = parseJsonArray(process.env.BLOCKED_STATUSES_JSON || '["ACTIVE"]');
const ruleKey = process.env.RULE_KEY || `${resourceKey}.rule.selection-eligibility.publication.${runId}`;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Origin: origin,
  'X-Tenant-ID': tenantId,
  'X-Env': environment,
};

console.log('Verifying governed domain-rule publication on the published quickstart.');
console.log(`BASE_URL=${baseUrl}`);
console.log(`TENANT_ID=${tenantId}`);
console.log(`ENVIRONMENT=${environment}`);
console.log(`RULE_KEY=${ruleKey}`);
console.log(`OPTION_SOURCE_KEY=${optionSourceKey}`);
console.log(`BLOCKED_STATUSES_JSON=${JSON.stringify(blockedStatuses)}`);

const simulation = await postJson('/api/praxis/config/domain-rules/simulations', {
  ruleKey,
  ruleType: 'selection_eligibility',
  contextKey,
  resourceKey,
  serviceKey,
  definition: {
    summary: 'Publication smoke for governed supplier selection eligibility.',
    recommendedAuthoringFlow: 'shared_rule_authoring',
  },
  parameters: {
    optionSourceKey,
    validationMessageTemplate: 'Supplier is not selectable for this governed proof.',
  },
  condition: {
    in: [
      { var: 'status' },
      blockedStatuses,
    ],
  },
  governance: {
    requiredApprovals: [],
  },
});

assertText(simulation.result, 'simulation.result');
assertText(simulation.explainability?.summary, 'simulation.explainability.summary');
assertText(simulation.explainability?.publicationReadiness, 'simulation.explainability.publicationReadiness');
console.log(`simulation: ${simulation.result} readiness=${simulation.explainability.publicationReadiness}`);

const definition = await postJson('/api/praxis/config/domain-rules/definitions', {
  ruleKey,
  ruleType: 'selection_eligibility',
  status: 'approved',
  contextKey,
  resourceKey,
  serviceKey,
  semanticOwner: 'procurement-owner',
  steward: 'procurement-owner',
  definition: {
    summary: 'Publication-ready supplier selection eligibility proof.',
    recommendedAuthoringFlow: 'shared_rule_authoring',
  },
  parameters: {
    optionSourceKey,
    validationMessageTemplate: 'Supplier is not selectable for this governed proof.',
  },
  condition: {
    in: [
      { var: 'status' },
      blockedStatuses,
    ],
  },
  governance: {
    requiredApprovals: [],
  },
  createdByType: 'llm',
  createdBy: 'praxis-http-examples',
});

assertText(definition.id, 'definition.id');
console.log(`definition: ${definition.id} status=${definition.status}`);

const publication = await postJson('/api/praxis/config/domain-rules/publications', {
  ruleDefinitionId: definition.id,
  materializationIds: [],
  applyEligibleMaterializations: true,
  publishedByType: 'human',
  publishedBy: 'praxis-http-examples',
  publicationNotes: {
    smokeRunId: runId,
    proof: 'governed-domain-rule-publication',
  },
});

if (publication.publicationStatus !== 'published') {
  throw new Error(`Expected publicationStatus=published, got ${publication.publicationStatus}`);
}
if (publication.publicationReadiness !== 'ready_to_publish') {
  throw new Error(`Expected publicationReadiness=ready_to_publish, got ${publication.publicationReadiness}`);
}

const publicationMaterialization = (publication.materializations || []).find(
  (item) =>
    item.targetLayer === 'option_source' &&
    item.targetArtifactType === 'resource-option-source' &&
    item.targetArtifactKey === optionSourceKey &&
    item.status === 'applied',
);
if (!publicationMaterialization) {
  throw new Error('Publication did not return an applied option_source materialization for the supplier lookup.');
}
if (publicationMaterialization.materializedPayload?.kind !== 'lookup_selection_policy') {
  throw new Error(`Expected lookup_selection_policy materialization, got ${publicationMaterialization.materializedPayload?.kind}`);
}
console.log(`publication: ${publication.publicationId} materialization=${publicationMaterialization.id}`);

const materializationQuery = new URLSearchParams({
  targetLayer: 'option_source',
  targetArtifactType: 'resource-option-source',
  targetArtifactKey: optionSourceKey,
  status: 'applied',
});
const materializations = await getJson(`/api/praxis/config/domain-rules/materializations?${materializationQuery}`);
const listedMaterialization = materializations.find((item) => item.id === publicationMaterialization.id);
if (!listedMaterialization) {
  throw new Error('Applied materialization was not returned by the materializations readback endpoint.');
}
console.log(`materializations: readback matched ${listedMaterialization.id}`);

const options = await postJson(
  `/api/procurement/suppliers/option-sources/${optionSourceKey}/options/filter?page=0&size=25`,
  {},
);
const blockedOption = (options.content || []).find((option) => {
  const status = option.extra?.status;
  return blockedStatuses.includes(status);
});
if (!blockedOption) {
  throw new Error(`Supplier lookup did not return an option with status in ${JSON.stringify(blockedStatuses)}.`);
}
if (blockedOption.extra?.selectable !== false) {
  throw new Error(`Expected governed lookup option to be selectable=false, got ${blockedOption.extra?.selectable}.`);
}

console.log(JSON.stringify({
  status: 'domain-rules-publication-runtime-ready',
  tenantId,
  environment,
  ruleKey,
  publicationId: publication.publicationId,
  materializationId: publicationMaterialization.id,
  optionSourceKey,
  supplierId: blockedOption.id,
  supplierStatus: blockedOption.extra?.status,
  selectable: blockedOption.extra?.selectable,
}, null, 2));

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function parseJsonArray(raw) {
  const value = JSON.parse(raw);
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error('BLOCKED_STATUSES_JSON must be a JSON array of strings.');
  }
  return value;
}

async function postJson(pathname, body) {
  return requestJson('POST', pathname, body);
}

async function getJson(pathname) {
  return requestJson('GET', pathname);
}

async function requestJson(method, pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  console.log(`${method} ${pathname}: ${response.status}`);
  if (!response.ok) {
    throw new Error(`${method} ${pathname} failed with ${response.status}: ${text}`);
  }
  return payload;
}

function assertText(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing ${fieldName}.`);
  }
}
