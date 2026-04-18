#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

// Lista de recursos (controllers) baseada em ApiPaths.java
const BACKEND_RESOURCES = [
  'funcionarios',
  'cargos',
  'departamentos',
  'enderecos',
  'dependentes',
  'folhas-pagamento',
  'eventos-folha',
  'ferias-afastamentos',
  'habilidades',
  'ameacas',
  'bases',
  'equipes',
  'indenizacoes',
  'incidentes',
  'licencas-operacao',
  'mencoes-midia',
  'reputacoes',
  'equipamentos',
  'veiculos',
  'equipamento-alocacoes',
  'veiculo-missao-usos',
  'identidades-secretas',
  'historicos-salariais',
  'historicos-cargos',
  'funcionario-habilidades',
  'acordos-regulatorios',
  'missoes',
  'base-acessos',
  'equipe-membros',
  'sinais-socorro',
  'missao-eventos',
  'missao-participantes',
];

const BACKEND_VIEWS = [
  'vw-resumo-missoes',
  'vw-ranking-reputacao',
  'vw-perfil-heroi',
  'vw-indicadores-incidentes',
  'vw-analytics-folha-pagamento',
];

const BACKEND_SPECIAL = [
  'expansion-detail',
  'expansion-demo-rows',
];

// Padrões de endpoint comuns
const COMMON_CRUD_ENDPOINTS = [
  'POST /filter',
  'POST /filter/cursor',
  'POST /locate',
  'GET /all',
  'GET /by-ids',
  'POST /options/filter',
  'GET /options/by-ids',
  'GET /{id}',
  'POST (create)',
  'PUT /{id}',
  'DELETE /{id}',
  'DELETE /batch',
];

const VIEW_ENDPOINTS = [
  'POST /filter',
  'POST /filter/cursor',
  'POST /locate',
  'GET /all',
  'GET /by-ids',
  'POST /options/filter',
  'GET /options/by-ids',
  'GET /{id}',
];

// Extrair recursos cobertos nos exemplos HTTP
function getHttpExamplesResources() {
  const httpDir = './http';
  const resources = new Set();
  const views = new Set();

  function scanDir(dir) {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.http')) {
        const content = readFileSync(fullPath, 'utf-8');

        // Extrair endpoint da requisição
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.match(/^(GET|POST|PUT|DELETE|PATCH)\s+/)) {
            const match = line.match(/\/api\/human-resources\/([a-z0-9-]+)/);
            if (match) {
              const resource = match[1];
              if (resource.startsWith('vw-')) {
                views.add(resource);
              } else if (!resource.startsWith('expansion-')) {
                resources.add(resource);
              }
            }
          }
        }
      }
    }
  }

  scanDir(httpDir);
  return { resources: Array.from(resources).sort(), views: Array.from(views).sort() };
}

// Análise
console.log('=== ANÁLISE DE COBERTURA: praxisui-http-examples vs praxis-api-quickstart ===\n');

const { resources: httpResources, views: httpViews } = getHttpExamplesResources();

console.log('📊 RECURSOS (CRUD)');
console.log('─────────────────────────────────────────────────────────');
console.log(`Total no backend: ${BACKEND_RESOURCES.length}`);
console.log(`Total com exemplos HTTP: ${httpResources.length}`);

const missingResources = BACKEND_RESOURCES.filter(r => !httpResources.includes(r));
const extraResources = httpResources.filter(r => !BACKEND_RESOURCES.includes(r));

if (missingResources.length > 0) {
  console.log(`\n⚠️  RECURSOS SEM EXEMPLOS (${missingResources.length}):`);
  missingResources.forEach(r => console.log(`   - ${r}`));
} else {
  console.log('\n✅ Todos os recursos têm exemplos!');
}

if (extraResources.length > 0) {
  console.log(`\n❓ EXEMPLOS PARA RECURSOS NÃO LISTADOS (${extraResources.length}):`);
  extraResources.forEach(r => console.log(`   - ${r}`));
}

console.log('\n\n📊 VIEWS (Read-only)');
console.log('─────────────────────────────────────────────────────────');
console.log(`Total no backend: ${BACKEND_VIEWS.length}`);
console.log(`Total com exemplos HTTP: ${httpViews.length}`);

const missingViews = BACKEND_VIEWS.filter(v => !httpViews.includes(v));
const extraViews = httpViews.filter(v => !BACKEND_VIEWS.includes(v));

if (missingViews.length > 0) {
  console.log(`\n⚠️  VIEWS SEM EXEMPLOS (${missingViews.length}):`);
  missingViews.forEach(v => console.log(`   - ${v}`));
} else {
  console.log('\n✅ Todas as views têm exemplos!');
}

if (extraViews.length > 0) {
  console.log(`\n❓ EXEMPLOS PARA VIEWS NÃO LISTADAS (${extraViews.length}):`);
  extraViews.forEach(v => console.log(`   - ${v}`));
}

console.log('\n\n📊 RECURSOS COM EXEMPLOS HTTP:');
console.log('─────────────────────────────────────────────────────────');
httpResources.forEach(r => console.log(`   ✓ ${r}`));

console.log('\n\n📊 VIEWS COM EXEMPLOS HTTP:');
console.log('─────────────────────────────────────────────────────────');
httpViews.forEach(v => console.log(`   ✓ ${v}`));

// Resumo
console.log('\n\n📈 RESUMO:');
console.log('─────────────────────────────────────────────────────────');
const totalBackend = BACKEND_RESOURCES.length + BACKEND_VIEWS.length;
const totalCovered = httpResources.length + httpViews.length;
const coveragePercent = Math.round((totalCovered / totalBackend) * 100);

console.log(`Total de endpoints no backend: ${totalBackend}`);
console.log(`Total coberto por exemplos: ${totalCovered}`);
console.log(`Taxa de cobertura: ${coveragePercent}%`);

if (missingResources.length > 0 || missingViews.length > 0) {
  console.log(`\n⚠️  Total faltando: ${missingResources.length + missingViews.length} endpoints`);
}
