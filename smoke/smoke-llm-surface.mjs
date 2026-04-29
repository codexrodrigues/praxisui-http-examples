import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHttpExample } from './shared-http-example-parser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const baseUrl = process.env.BASE_URL || manifest.defaultBaseUrl;

const llmSurfaceExamples = (manifest.examples ?? []).filter((example) => example.llmOperational === true);

for (const example of llmSurfaceExamples) {
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

process.exit(process.exitCode ?? 0);
