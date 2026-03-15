import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'examples.manifest.json'), 'utf8'));
const baseUrl = process.env.BASE_URL || manifest.defaultBaseUrl;

const publicExamples = (manifest.examples ?? []).filter(
  (example) => example.public === true && example.authRequired === false && example.destructive === false,
);

for (const example of publicExamples) {
  const httpPath = path.join(root, example.httpFile);
  const raw = fs.readFileSync(httpPath, 'utf8');
  const match = raw.match(/^(GET|POST|PUT|DELETE)\s+\{\{baseUrl\}\}([^\s]+)$/m);
  if (!match) {
    console.warn(`Skipping ${example.id}: no simple request line found.`);
    continue;
  }

  const [, method, endpoint] = match;
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
    },
  });

  console.log(`${example.id}: ${response.status} ${url}`);
  if (!response.ok) {
    process.exitCode = 1;
  }
}
