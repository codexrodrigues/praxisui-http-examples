#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Analisar detalhadamente os exemplos HTTP existentes
function analyzeHttpExamples() {
  const httpDir = './http';
  const examples = {
    metadata: [],
    resources: {},
    views: {},
    config: [],
    expansionDetail: [],
    ai: [],
  };

  function scanDir(dir, category = null) {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Determine category based on directory name
        const newCategory = item;
        scanDir(fullPath, newCategory);
      } else if (item.endsWith('.http')) {
        const content = readFileSync(fullPath, 'utf-8');

        // Extract HTTP method and path
        const lines = content.split('\n');
        for (const line of lines) {
          const methodMatch = line.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(.+)/);
          if (methodMatch) {
            const [, method, path] = methodMatch;

            // Clean up path (remove query params and variables)
            const cleanPath = path.split('?')[0].trim();

            const example = {
              file: fullPath,
              method,
              path: cleanPath,
              category,
            };

            // Categorize
            if (category === 'metadata') {
              examples.metadata.push(example);
            } else if (category === 'config') {
              examples.config.push(example);
            } else if (category === 'expansion-detail') {
              examples.expansionDetail.push(example);
            } else if (category === 'ai') {
              examples.ai.push(example);
            } else if (category === 'resources') {
              // Extract resource name
              const resourceMatch = cleanPath.match(/\/api\/human-resources\/([a-z0-9-]+)/);
              if (resourceMatch) {
                const resource = resourceMatch[1];
                if (!examples.resources[resource]) {
                  examples.resources[resource] = [];
                }
                examples.resources[resource].push(example);
              }
            } else if (category === 'views') {
              // Extract view name
              const viewMatch = cleanPath.match(/\/api\/human-resources\/(vw-[a-z0-9-]+)/);
              if (viewMatch) {
                const view = viewMatch[1];
                if (!examples.views[view]) {
                  examples.views[view] = [];
                }
                examples.views[view].push(example);
              }
            }

            break; // Only process first HTTP request in file
          }
        }
      }
    }
  }

  scanDir(httpDir);
  return examples;
}

// Lista completa de controllers do backend (32 resources + 5 views)
const BACKEND_CONTROLLERS = {
  resources: [
    'funcionarios', 'cargos', 'departamentos', 'enderecos', 'dependentes',
    'folhas-pagamento', 'eventos-folha', 'ferias-afastamentos', 'habilidades',
    'ameacas', 'bases', 'equipes', 'indenizacoes', 'incidentes',
    'licencas-operacao', 'mencoes-midia', 'reputacoes', 'equipamentos',
    'veiculos', 'equipamento-alocacoes', 'veiculo-missao-usos',
    'identidades-secretas', 'historicos-salariais', 'historicos-cargos',
    'funcionario-habilidades', 'acordos-regulatorios', 'missoes',
    'base-acessos', 'equipe-membros', 'sinais-socorro', 'missao-eventos',
    'missao-participantes',
  ],
  views: [
    'vw-resumo-missoes', 'vw-ranking-reputacao', 'vw-perfil-heroi',
    'vw-indicadores-incidentes', 'vw-analytics-folha-pagamento',
  ],
};

// Operações CRUD padrão
const CRUD_OPERATIONS = {
  read: ['GET /{id}', 'GET /all', 'GET /by-ids', 'POST /filter', 'POST /filter/cursor', 'POST /locate'],
  write: ['POST (create)', 'PUT /{id}', 'DELETE /{id}', 'DELETE /batch'],
  options: ['POST /options/filter', 'GET /options/by-ids'],
};

const VIEW_OPERATIONS = {
  read: ['GET /{id}', 'GET /all', 'GET /by-ids', 'POST /filter', 'POST /filter/cursor', 'POST /locate'],
  options: ['POST /options/filter', 'GET /options/by-ids'],
};

console.log('=== RELATÓRIO DETALHADO DE COBERTURA ===\n');

const examples = analyzeHttpExamples();

// Metadata endpoints
console.log('📋 METADATA ENDPOINTS');
console.log('─'.repeat(60));
console.log(`Total: ${examples.metadata.length} exemplos`);
examples.metadata.forEach(e => {
  const fileName = e.file.split('/').pop();
  console.log(`  ✓ ${e.method.padEnd(6)} ${fileName}`);
});

// Config endpoints
console.log('\n📋 CONFIG ENDPOINTS');
console.log('─'.repeat(60));
console.log(`Total: ${examples.config.length} exemplos`);
examples.config.forEach(e => {
  const fileName = e.file.split('/').pop();
  console.log(`  ✓ ${e.method.padEnd(6)} ${fileName}`);
});

// Expansion Detail endpoints
console.log('\n📋 EXPANSION DETAIL ENDPOINTS');
console.log('─'.repeat(60));
console.log(`Total: ${examples.expansionDetail.length} exemplos`);
examples.expansionDetail.forEach(e => {
  const fileName = e.file.split('/').pop();
  console.log(`  ✓ ${e.method.padEnd(6)} ${fileName}`);
});

// AI endpoints
console.log('\n📋 AI ENDPOINTS');
console.log('─'.repeat(60));
console.log(`Total: ${examples.ai.length} exemplos`);
examples.ai.forEach(e => {
  const fileName = e.file.split('/').pop();
  console.log(`  ✓ ${e.method.padEnd(6)} ${fileName}`);
});

// Resources (CRUD)
console.log('\n\n📊 RECURSOS CRUD');
console.log('─'.repeat(60));
console.log(`Total de recursos no backend: ${BACKEND_CONTROLLERS.resources.length}`);
console.log(`Recursos com exemplos: ${Object.keys(examples.resources).length}`);

const coveredResources = Object.keys(examples.resources).sort();
const missingResources = BACKEND_CONTROLLERS.resources.filter(r => !coveredResources.includes(r));

console.log('\n✅ RECURSOS COM EXEMPLOS:');
coveredResources.forEach(resource => {
  const count = examples.resources[resource].length;
  const operations = examples.resources[resource].map(e => e.method).join(', ');
  console.log(`  ${resource} (${count} exemplos): ${operations}`);
});

console.log(`\n⚠️  RECURSOS SEM EXEMPLOS (${missingResources.length}):`);
missingResources.forEach(r => console.log(`  ✗ ${r}`));

// Views (Read-only)
console.log('\n\n📊 VIEWS (Read-only)');
console.log('─'.repeat(60));
console.log(`Total de views no backend: ${BACKEND_CONTROLLERS.views.length}`);
console.log(`Views com exemplos: ${Object.keys(examples.views).length}`);

const coveredViews = Object.keys(examples.views).sort();
const missingViews = BACKEND_CONTROLLERS.views.filter(v => !coveredViews.includes(v));

console.log('\n✅ VIEWS COM EXEMPLOS:');
coveredViews.forEach(view => {
  const count = examples.views[view].length;
  const operations = examples.views[view].map(e => e.method).join(', ');
  console.log(`  ${view} (${count} exemplos): ${operations}`);
});

console.log(`\n⚠️  VIEWS SEM EXEMPLOS (${missingViews.length}):`);
missingViews.forEach(v => console.log(`  ✗ ${v}`));

// Summary
console.log('\n\n📈 RESUMO GERAL');
console.log('─'.repeat(60));
const totalBackendEndpoints = BACKEND_CONTROLLERS.resources.length + BACKEND_CONTROLLERS.views.length;
const totalCoveredEndpoints = coveredResources.length + coveredViews.length;
const coveragePercent = Math.round((totalCoveredEndpoints / totalBackendEndpoints) * 100);

console.log(`Total de recursos/views no backend: ${totalBackendEndpoints}`);
console.log(`Total coberto por exemplos: ${totalCoveredEndpoints}`);
console.log(`Taxa de cobertura: ${coveragePercent}%`);
console.log(`\nExemplos de metadata: ${examples.metadata.length}`);
console.log(`Exemplos de config: ${examples.config.length}`);
console.log(`Exemplos de expansion-detail: ${examples.expansionDetail.length}`);
console.log(`Exemplos de AI: ${examples.ai.length}`);
console.log(`Total de arquivos .http: ${
  examples.metadata.length +
  examples.config.length +
  examples.expansionDetail.length +
  examples.ai.length +
  Object.values(examples.resources).flat().length +
  Object.values(examples.views).flat().length
}`);

console.log('\n\n💡 RECOMENDAÇÕES:');
console.log('─'.repeat(60));
if (missingResources.length > 0) {
  console.log(`1. Adicionar exemplos HTTP para ${missingResources.length} recursos CRUD faltantes`);
  console.log(`   Priorizar: ${missingResources.slice(0, 5).join(', ')}...`);
}
if (missingViews.length > 0) {
  console.log(`2. Adicionar exemplos HTTP para ${missingViews.length} views faltantes`);
  console.log(`   Faltando: ${missingViews.join(', ')}`);
}
console.log('3. Considerar adicionar mais operações para recursos existentes (CRUD completo)');
console.log('4. Validar se exemplos obsoletos devem ser marcados como "legacy" no manifest');
