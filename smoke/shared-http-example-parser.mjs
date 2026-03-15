import fs from 'node:fs';
import path from 'node:path';

export function parseHttpExample(root, example, baseUrl) {
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

  const headers = {};
  let body = undefined;

  for (; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('###')) continue;
    if (trimmed.startsWith('< ')) {
      const relativePayloadPath = trimmed.slice(2).trim();
      const payloadPath = path.resolve(path.dirname(httpPath), relativePayloadPath);
      body = fs.readFileSync(payloadPath, 'utf8');
      continue;
    }
    const headerMatch = line.match(/^([^:]+):\s*(.+)$/);
    if (headerMatch) {
      headers[headerMatch[1].trim()] = interpolate(headerMatch[2].trim(), vars);
    }
  }

  return {
    method,
    url: endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`,
    headers,
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
