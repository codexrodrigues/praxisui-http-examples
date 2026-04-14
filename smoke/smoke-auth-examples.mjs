import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const baseUrl = process.env.BASE_URL || manifest.defaultBaseUrl;

const defaultIds = [
  'cargos-options-by-ids',
  'funcionarios-filter-basic',
  'funcionarios-options-filter',
  'veiculos-filter-basic',
  'incidentes-filter-basic',
  'vw-perfil-heroi-by-ids',
  'vw-perfil-heroi-filter-basic',
  'vw-perfil-heroi-options-filter',
  'vw-indicadores-incidentes-filter-basic',
  'vw-ranking-reputacao-filter-basic',
  'vw-ranking-reputacao-options-filter',
  'vw-resumo-missoes-filter-basic',
];

const selectedIds = new Set(
  String(process.env.SMOKE_AUTH_IDS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

const targetIds = selectedIds.size ? selectedIds : new Set(defaultIds);

const selectedExamples = (manifest.examples ?? []).filter((example) => targetIds.has(example.id));

if (!selectedExamples.length) {
  console.error('No auth smoke examples matched the selected ids.');
  process.exit(1);
}

for (const example of selectedExamples) {
  const request = parseHttpExample(root, example, baseUrl);
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  console.log(`${example.id}: ${response.status} ${request.method} ${request.url}`);
  if (!response.ok) {
    process.exitCode = 1;
  }
}
