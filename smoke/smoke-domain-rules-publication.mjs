const required = requiredEnvironment([
  'BASE_URL',
  'ORIGIN',
  'TENANT_ID',
  'ENVIRONMENT',
  'AUTHOR_USERNAME',
  'AUTHOR_PASSWORD',
  'REVIEWER_USERNAME',
  'REVIEWER_PASSWORD',
  'PUBLISHER_USERNAME',
  'PUBLISHER_PASSWORD',
  'READER_USERNAME',
  'READER_PASSWORD',
  'APPROVER_REF',
]);

assertDistinctPrincipals(required);

const baseUrl = resolveBaseUrl(required.BASE_URL);
const runId = process.env.SMOKE_RUN_ID || new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const tenantId = required.TENANT_ID;
const environment = required.ENVIRONMENT;
const origin = resolveOrigin(required.ORIGIN);
const serviceKey = process.env.SERVICE_KEY || 'praxis-api-quickstart';
const contextKey = process.env.CONTEXT_KEY || 'procurement';
const resourceKey = process.env.RESOURCE_KEY || 'procurement.suppliers';
const optionSourceKey = process.env.OPTION_SOURCE_KEY || 'supplier';
const blockedStatuses = parseJsonArray(process.env.BLOCKED_STATUSES_JSON || '["ACTIVE"]');
const ruleKey = process.env.RULE_KEY || `${resourceKey}.rule.selection-eligibility.publication.${runId}`;
const approverRef = required.APPROVER_REF;
const headers = {
  Accept: 'application/json',
  Origin: origin,
  'X-Tenant-ID': tenantId,
  'X-Env': environment,
};

console.log(`Running the governed domain-rule publication proof against ${baseUrl} for ${tenantId}/${environment}.`);

const authorSession = await authenticate('author', required.AUTHOR_USERNAME, required.AUTHOR_PASSWORD);
const reviewerSession = await authenticate('reviewer', required.REVIEWER_USERNAME, required.REVIEWER_PASSWORD);
const publisherSession = await authenticate('publisher', required.PUBLISHER_USERNAME, required.PUBLISHER_PASSWORD);
const readerSession = await authenticate('reader', required.READER_USERNAME, required.READER_PASSWORD);

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
  parameters: operationalParameters(optionSourceKey),
  condition: selectionCondition(blockedStatuses),
  governance: {
    requiredApprovals: [approverRef],
  },
}, authorSession);

assertText(simulation.result, 'simulation.result');
assertText(simulation.explainability?.summary, 'simulation.explainability.summary');
assertText(simulation.explainability?.publicationReadiness, 'simulation.explainability.publicationReadiness');

const definition = await postJson('/api/praxis/config/domain-rules/definitions', {
  ruleKey,
  ruleType: 'selection_eligibility',
  status: 'draft',
  contextKey,
  resourceKey,
  serviceKey,
  semanticOwner: 'procurement-owner',
  steward: 'procurement-owner',
  definition: {
    summary: 'Publication-ready supplier selection eligibility proof.',
    recommendedAuthoringFlow: 'shared_rule_authoring',
  },
  parameters: operationalParameters(optionSourceKey),
  condition: selectionCondition(blockedStatuses),
  governance: {
    requiredApprovals: [approverRef],
  },
}, authorSession);

assertText(definition.id, 'definition.id');
assertEqual(definition.status, 'draft', 'draft definition status');

const proposed = await patchJson(
  `/api/praxis/config/domain-rules/definitions/${encodeURIComponent(definition.id)}/status`,
  { status: 'proposed' },
  authorSession,
);
assertEqual(proposed.status, 'proposed', 'proposed definition status');

const approved = await patchJson(
  `/api/praxis/config/domain-rules/definitions/${encodeURIComponent(definition.id)}/status`,
  { status: 'approved', validationResult: { review: 'approved' } },
  reviewerSession,
);
assertEqual(approved.status, 'approved', 'approved definition status');

const publication = await postJson('/api/praxis/config/domain-rules/publications', {
  ruleDefinitionId: definition.id,
  materializationIds: [],
  applyEligibleMaterializations: true,
  publicationNotes: {
    smokeRunId: runId,
    proof: 'governed-domain-rule-publication',
  },
}, publisherSession);

if (publication.publicationStatus !== 'published') {
  throw new Error(`Expected publicationStatus=published, got ${publication.publicationStatus}`);
}
if (publication.publicationReadiness !== 'ready_to_publish') {
  throw new Error(`Expected publicationReadiness=ready_to_publish, got ${publication.publicationReadiness}`);
}

const publicationMaterialization = (publication.materializations || []).find(
  (item) => item.targetLayer === 'option_source'
    && item.targetArtifactType === 'resource-option-source'
    && item.targetArtifactKey === optionSourceKey
    && item.status === 'applied',
);
if (!publicationMaterialization) {
  throw new Error('Publication did not return an applied option_source materialization for the supplier lookup.');
}
if (publicationMaterialization.materializedPayload?.kind !== 'lookup_selection_policy') {
  throw new Error(`Expected lookup_selection_policy materialization, got ${publicationMaterialization.materializedPayload?.kind}`);
}

const materializationQuery = new URLSearchParams({
  targetLayer: 'option_source',
  targetArtifactType: 'resource-option-source',
  targetArtifactKey: optionSourceKey,
  status: 'applied',
});
const materializations = await getJson(
  `/api/praxis/config/domain-rules/materializations?${materializationQuery}`,
  readerSession,
);
const listedMaterialization = materializations.find((item) => item.id === publicationMaterialization.id);
if (!listedMaterialization) {
  throw new Error('Applied materialization was not returned by the authenticated readback endpoint.');
}

const options = await postJson(
  `/api/procurement/suppliers/option-sources/${optionSourceKey}/options/filter?page=0&size=25`,
  {},
  readerSession,
);
const blockedOption = (options.content || []).find((option) => blockedStatuses.includes(option.extra?.status));
if (!blockedOption) {
  throw new Error('Supplier lookup did not return an option with the configured blocked status.');
}
if (blockedOption.extra?.selectable !== false) {
  throw new Error(`Expected governed lookup option to be selectable=false, got ${blockedOption.extra?.selectable}.`);
}

console.log('Governed domain-rule publication smoke completed. It remains a protected contract and does not confirm a published backend surface.');

function operationalParameters(optionSource) {
  return {
    optionSourceKey: optionSource,
    validationMessageTemplate: 'Supplier is not selectable for this governed proof.',
    validationPolicy: { effect: 'BLOCK' },
  };
}

function selectionCondition(statuses) {
  return {
    in: [
      { var: 'status' },
      statuses,
    ],
  };
}

async function authenticate(label, username, password) {
  const cookies = new Map();
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    redirect: 'error',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: origin,
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error(`Could not authenticate ${label} (HTTP ${response.status}).`);
  }
  updateCookies(cookies, response.headers);
  if (!cookies.has('SESSION')) {
    throw new Error(`The ${label} login response did not issue a SESSION cookie.`);
  }

  const refresh = await fetch(`${baseUrl}/auth/session`, {
    redirect: 'error',
    headers: {
      Accept: 'application/json',
      Origin: origin,
      Cookie: cookieHeader(cookies),
    },
  });
  updateCookies(cookies, refresh.headers);
  if (!refresh.ok) {
    throw new Error(`Could not refresh the ${label} session (HTTP ${refresh.status}).`);
  }
  if (!cookies.has('SESSION') || !cookies.has('XSRF-TOKEN')) {
    throw new Error(`The ${label} session refresh did not issue SESSION and XSRF-TOKEN cookies.`);
  }
  return cookies;
}

function updateCookies(cookies, responseHeaders) {
  const setCookies = typeof responseHeaders.getSetCookie === 'function'
    ? responseHeaders.getSetCookie()
    : splitSetCookieHeader(responseHeaders.get('set-cookie'));
  for (const setCookie of setCookies) {
    const pair = setCookie.split(';', 1)[0];
    const separator = pair.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1);
    if (value) {
      cookies.set(name, value);
    } else {
      cookies.delete(name);
    }
  }
}

function splitSetCookieHeader(value) {
  return value ? value.split(/,(?=[^;,]+=)/) : [];
}

function cookieHeader(cookies) {
  return [...cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function postJson(pathname, body, session) {
  return requestJson('POST', pathname, body, session);
}

async function patchJson(pathname, body, session) {
  return requestJson('PATCH', pathname, body, session);
}

async function getJson(pathname, session) {
  return requestJson('GET', pathname, undefined, session);
}

async function requestJson(method, pathname, body, cookies) {
  const csrfRequired = requiresCsrf(method, pathname);
  const csrfToken = cookies.get('XSRF-TOKEN');
  if (csrfRequired && !csrfToken) {
    throw new Error(`${method} ${pathname} requires an XSRF-TOKEN cookie before any HTTP request.`);
  }
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    redirect: 'error',
    headers: {
      ...headers,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      Cookie: cookieHeader(cookies),
      ...(csrfRequired ? { 'X-XSRF-TOKEN': csrfToken } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  updateCookies(cookies, response.headers);
  const responseText = await response.text();
  let payload;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      throw new Error(`${method} ${pathname} returned non-JSON content (HTTP ${response.status}).`);
    }
  }
  console.log(`${method} ${pathname} -> ${response.status}`);
  if (!response.ok) {
    throw new Error(`${method} ${pathname} failed (HTTP ${response.status}).`);
  }
  return payload;
}

function requiresCsrf(method, pathname) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method)
    && !pathname.startsWith('/auth/')
    && !pathname.startsWith('/api/praxis/config/');
}

function requiredEnvironment(names) {
  const missing = names.filter((name) => typeof process.env[name] !== 'string' || process.env[name].length === 0);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. No HTTP request was sent.`);
  }
  return Object.fromEntries(names.map((name) => [name, process.env[name]]));
}

function assertDistinctPrincipals(environment) {
  const principals = [
    environment.AUTHOR_USERNAME,
    environment.REVIEWER_USERNAME,
    environment.PUBLISHER_USERNAME,
  ];
  if (new Set(principals).size !== principals.length) {
    throw new Error('AUTHOR_USERNAME, REVIEWER_USERNAME, and PUBLISHER_USERNAME must identify distinct principals. No HTTP request was sent.');
  }
}

function resolveBaseUrl(value) {
  const url = requireSafeHttpUrl('BASE_URL', value);
  if (url.search || url.hash) {
    throw new Error('BASE_URL cannot include a query string or fragment. No HTTP request was sent.');
  }
  return url.href.replace(/\/+$/, '');
}

function resolveOrigin(value) {
  const url = requireSafeHttpUrl('ORIGIN', value);
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('ORIGIN must be an HTTP(S) origin without a path, query string, or fragment. No HTTP request was sent.');
  }
  return url.origin;
}

function requireSafeHttpUrl(name, value) {
  if (value !== value.trim()) {
    throw new Error(`${name} cannot start or end with whitespace. No HTTP request was sent.`);
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTP(S) URL. No HTTP request was sent.`);
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error(`${name} must be an HTTP(S) URL without userinfo. No HTTP request was sent.`);
  }
  return url;
}

function parseJsonArray(raw) {
  const value = JSON.parse(raw);
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error('BLOCKED_STATUSES_JSON must be a JSON array of strings.');
  }
  return value;
}

function assertText(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing ${fieldName}.`);
  }
}

function assertEqual(actual, expected, fieldName) {
  if (actual !== expected) {
    throw new Error(`Expected ${fieldName} to be ${expected}; got ${String(actual)}.`);
  }
}
