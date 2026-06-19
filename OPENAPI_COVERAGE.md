# OpenAPI Coverage

Generated from the published backend OpenAPI document.

- Base URL: `https://praxis-api-quickstart.onrender.com`
- Generated at: `2026-06-19`
- OpenAPI endpoints: `1106`
- Resource/controller bases: `79`
- Bases with at least one catalog example: `35`
- Bases without catalog examples: `44`

This report is an audit aid. The HTTP example corpus is intentionally curated:
it should cover every important published surface at least once, while avoiding
hundreds of repetitive CRUD examples that add little operational value.

## Coverage By Base

| Published base | Endpoint count | Covered | Example ids |
|---|---:|---|---|
| `/api/assets/equipamento-alocacoes` | 24 | yes | `equipamento-alocacoes-filter-status-danificado` |
| `/api/assets/equipamentos` | 24 | yes | `assets-equipamentos-entity-lookup-filter`, `assets-equipamentos-entity-lookup-by-ids`, `equipamentos-filter-status-manutencao` |
| `/api/assets/veiculo-missao-usos` | 24 | no | _none_ |
| `/api/assets/veiculos` | 24 | yes | `veiculos-filter-basic`, `assets-veiculos-entity-lookup-filter`, `assets-veiculos-entity-lookup-by-ids` |
| `/api/human-resources/cargos` | 24 | yes | `cargos-options-filter`, `cargos-options-by-ids`, `cargos-light-lookup-filter`, `cargos-light-lookup-by-ids` |
| `/api/human-resources/departamentos` | 24 | yes | `departamentos-options-filter`, `departamentos-light-lookup-filter`, `departamentos-light-lookup-by-ids` |
| `/api/human-resources/dependentes` | 24 | no | _none_ |
| `/api/human-resources/enderecos` | 24 | no | _none_ |
| `/api/human-resources/eventos-folha` | 25 | no | _none_ |
| `/api/human-resources/ferias-afastamentos` | 24 | no | _none_ |
| `/api/human-resources/folhas-pagamento` | 27 | no | _none_ |
| `/api/human-resources/funcionario-habilidades` | 24 | no | _none_ |
| `/api/human-resources/funcionarios` | 28 | yes | `funcionarios-get-by-id`, `funcionarios-filter-basic`, `funcionarios-filter-cursor`, `funcionarios-locate`, `funcionarios-options-filter`, `funcionarios-options-by-ids`, `funcionarios-create`, `funcionarios-update`, `funcionarios-delete`, `funcionarios-delete-batch`, `funcionarios-options-for-ranking` |
| `/api/human-resources/habilidades` | 24 | yes | `habilidades-light-lookup-filter`, `habilidades-light-lookup-by-ids` |
| `/api/human-resources/historicos-cargos` | 24 | no | _none_ |
| `/api/human-resources/historicos-salariais` | 24 | no | _none_ |
| `/api/human-resources/identidades-secretas` | 24 | no | _none_ |
| `/api/human-resources/indenizacoes` | 24 | no | _none_ |
| `/api/human-resources/mencoes-midia` | 24 | no | _none_ |
| `/api/human-resources/reputacoes` | 24 | no | _none_ |
| `/api/human-resources/vw-analytics-folha-pagamento` | 20 | yes | `vw-analytics-folha-payroll-profile-options-filter-cascade`, `vw-analytics-folha-pagamento-stats-payroll-profile` |
| `/api/human-resources/vw-perfil-heroi` | 20 | yes | `vw-perfil-heroi-filter-basic`, `vw-perfil-heroi-filter-ranges`, `vw-perfil-heroi-filter-cursor`, `vw-perfil-heroi-locate`, `vw-perfil-heroi-all`, `vw-perfil-heroi-by-ids`, `vw-perfil-heroi-options-filter`, `vw-perfil-heroi-options-by-ids` |
| `/api/human-resources/vw-ranking-reputacao` | 20 | yes | `vw-ranking-reputacao-filter-basic`, `vw-ranking-reputacao-filter-score-ranges`, `vw-ranking-reputacao-filter-cursor`, `vw-ranking-reputacao-locate`, `vw-ranking-reputacao-options-filter`, `vw-ranking-reputacao-options-by-ids` |
| `/api/operations/acordos-regulatorios` | 28 | no | _none_ |
| `/api/operations/base-acessos` | 27 | no | _none_ |
| `/api/operations/bases` | 25 | no | _none_ |
| `/api/operations/equipe-membros` | 24 | no | _none_ |
| `/api/operations/equipes` | 24 | no | _none_ |
| `/api/operations/incidentes` | 24 | yes | `incidentes-filter-basic` |
| `/api/operations/licencas-operacao` | 25 | yes | `licencas-operacao-filter-expiring` |
| `/api/operations/missao-eventos` | 24 | yes | `missao-eventos-stats-ocorrido-em-day` |
| `/api/operations/missao-participantes` | 24 | yes | `missao-participantes-stats-papel` |
| `/api/operations/missoes` | 34 | yes | `operations-missoes-item-capabilities`, `operations-missoes-entity-lookup-filter`, `operations-missoes-entity-lookup-by-ids`, `missoes-team-plan-patch`, `missoes-team-plan-patch-invalid-principal` |
| `/api/operations/sinais-socorro` | 24 | no | _none_ |
| `/api/operations/vw-resumo-missoes` | 20 | yes | `vw-resumo-missoes-filter-basic`, `vw-resumo-missoes-stats-status`, `vw-resumo-missoes-stats-prioridade` |
| `/api/praxis/config/ai-context/{componentId}` | 2 | yes | `ai-context-get-table`, `ai-context-post-table` |
| `/api/praxis/config/ai-registry/component-definitions` | 2 | no | _none_ |
| `/api/praxis/config/ai-registry/health` | 1 | no | _none_ |
| `/api/praxis/config/ai-registry/templates` | 5 | yes | `ai-registry-template-get-table`, `ai-registry-template-put-table`, `ai-registry-template-delete-table` |
| `/api/praxis/config/ai/authoring` | 19 | no | _none_ |
| `/api/praxis/config/ai/keys` | 2 | no | _none_ |
| `/api/praxis/config/ai/patch` | 5 | yes | `ai-clarification-filters-3step` |
| `/api/praxis/config/ai/providers` | 3 | no | _none_ |
| `/api/praxis/config/ai/status` | 1 | no | _none_ |
| `/api/praxis/config/ai/suggestions` | 1 | yes | `ai-suggestions-table` |
| `/api/praxis/config/ai/triage` | 4 | no | _none_ |
| `/api/praxis/config/api-catalog/ingest` | 1 | no | _none_ |
| `/api/praxis/config/api-catalog/search` | 1 | no | _none_ |
| `/api/praxis/config/domain-360` | 1 | no | _none_ |
| `/api/praxis/config/domain-catalog/context` | 1 | no | _none_ |
| `/api/praxis/config/domain-catalog/ingest` | 1 | no | _none_ |
| `/api/praxis/config/domain-catalog/items` | 2 | no | _none_ |
| `/api/praxis/config/domain-catalog/relationships` | 1 | no | _none_ |
| `/api/praxis/config/domain-catalog/releases` | 1 | no | _none_ |
| `/api/praxis/config/domain-federation/context` | 1 | no | _none_ |
| `/api/praxis/config/domain-federation/dry-run` | 1 | no | _none_ |
| `/api/praxis/config/domain-federation/ingest` | 1 | no | _none_ |
| `/api/praxis/config/domain-federation/releases` | 3 | no | _none_ |
| `/api/praxis/config/domain-knowledge/change-sets` | 7 | yes | `domain-knowledge-change-set-lifecycle`, `domain-knowledge-change-set-timeline` |
| `/api/praxis/config/domain-rules/definitions` | 4 | yes | `domain-rules-supplier-eligibility-definition`, `domain-rules-supplier-eligibility-approve`, `domain-rules-supplier-eligibility-timeline` |
| `/api/praxis/config/domain-rules/intake` | 1 | yes | `domain-rules-supplier-eligibility-intake` |
| `/api/praxis/config/domain-rules/materializations` | 3 | yes | `domain-rules-supplier-eligibility-materializations`, `domain-rules-supplier-eligibility-materializations-confirmed` |
| `/api/praxis/config/domain-rules/publications` | 1 | yes | `domain-rules-supplier-eligibility-publication` |
| `/api/praxis/config/domain-rules/simulations` | 1 | yes | `domain-rules-supplier-eligibility-simulation` |
| `/api/praxis/config/ui` | 3 | yes | `ui-get-table-config`, `ui-get-table-config-if-none-match`, `ui-put-table-config`, `ui-put-form-config`, `ui-put-tabs-config`, `ui-put-global-config`, `ui-delete-tabs-config`, `ui-get-table-config-missing-tenant`, `ui-delete-tabs-config-not-found`, `ui-get-table-config-legacy-component-type`, `ui-get-invalid-origin` |
| `/api/praxis/config/ui/{componentType}` | 3 | no | _none_ |
| `/api/procurement/companies` | 24 | no | _none_ |
| `/api/procurement/contracts` | 24 | yes | `procurement-contracts-entity-lookup-filter-cascade` |
| `/api/procurement/products` | 24 | no | _none_ |
| `/api/procurement/purchase-orders` | 24 | no | _none_ |
| `/api/procurement/suppliers` | 24 | yes | `procurement-suppliers-governed-domain-rules-lookup`, `procurement-suppliers-entity-lookup-filter`, `procurement-suppliers-entity-lookup-by-ids` |
| `/api/risk-intelligence/ameacas` | 24 | yes | `ameacas-filter-confronto` |
| `/api/risk-intelligence/vw-indicadores-incidentes` | 20 | yes | `vw-indicadores-incidentes-filter-basic` |
| `/auth` | 3 | no | _none_ |
| `/schemas/actions` | 1 | yes | `schemas-actions-operations-missoes` |
| `/schemas/catalog` | 1 | yes | `schemas-catalog` |
| `/schemas/domain` | 1 | no | _none_ |
| `/schemas/filtered` | 1 | yes | `filtered-schema-request-funcionarios`, `filtered-schema-response-funcionarios`, `filtered-schema-request-procurement-purchase-orders-entity-lookup`, `filtered-schema-request-missao-team-plan` |
| `/schemas/surfaces` | 1 | yes | `schemas-surfaces-operations-missoes`, `schemas-surfaces-human-resources-funcionarios` |

## Uncovered Bases

- `/api/assets/veiculo-missao-usos` (24 endpoints): `GET /api/assets/veiculo-missao-usos/{id}`, `PUT /api/assets/veiculo-missao-usos/{id}`, `DELETE /api/assets/veiculo-missao-usos/{id}`, `POST /api/assets/veiculo-missao-usos`, `POST /api/assets/veiculo-missao-usos/stats/timeseries`
- `/api/human-resources/dependentes` (24 endpoints): `GET /api/human-resources/dependentes/{id}`, `PUT /api/human-resources/dependentes/{id}`, `DELETE /api/human-resources/dependentes/{id}`, `POST /api/human-resources/dependentes`, `POST /api/human-resources/dependentes/stats/timeseries`
- `/api/human-resources/enderecos` (24 endpoints): `GET /api/human-resources/enderecos/{id}`, `PUT /api/human-resources/enderecos/{id}`, `DELETE /api/human-resources/enderecos/{id}`, `POST /api/human-resources/enderecos`, `POST /api/human-resources/enderecos/stats/timeseries`
- `/api/human-resources/eventos-folha` (25 endpoints): `GET /api/human-resources/eventos-folha/{id}`, `PUT /api/human-resources/eventos-folha/{id}`, `DELETE /api/human-resources/eventos-folha/{id}`, `POST /api/human-resources/eventos-folha`, `POST /api/human-resources/eventos-folha/stats/timeseries`
- `/api/human-resources/ferias-afastamentos` (24 endpoints): `GET /api/human-resources/ferias-afastamentos/{id}`, `PUT /api/human-resources/ferias-afastamentos/{id}`, `DELETE /api/human-resources/ferias-afastamentos/{id}`, `POST /api/human-resources/ferias-afastamentos`, `POST /api/human-resources/ferias-afastamentos/stats/timeseries`
- `/api/human-resources/folhas-pagamento` (27 endpoints): `GET /api/human-resources/folhas-pagamento/{id}`, `PUT /api/human-resources/folhas-pagamento/{id}`, `DELETE /api/human-resources/folhas-pagamento/{id}`, `POST /api/human-resources/folhas-pagamento`, `POST /api/human-resources/folhas-pagamento/{id}/actions/mark-paid`
- `/api/human-resources/funcionario-habilidades` (24 endpoints): `GET /api/human-resources/funcionario-habilidades/{id}`, `PUT /api/human-resources/funcionario-habilidades/{id}`, `DELETE /api/human-resources/funcionario-habilidades/{id}`, `POST /api/human-resources/funcionario-habilidades`, `POST /api/human-resources/funcionario-habilidades/stats/timeseries`
- `/api/human-resources/historicos-cargos` (24 endpoints): `GET /api/human-resources/historicos-cargos/{id}`, `PUT /api/human-resources/historicos-cargos/{id}`, `DELETE /api/human-resources/historicos-cargos/{id}`, `POST /api/human-resources/historicos-cargos`, `POST /api/human-resources/historicos-cargos/stats/timeseries`
- `/api/human-resources/historicos-salariais` (24 endpoints): `GET /api/human-resources/historicos-salariais/{id}`, `PUT /api/human-resources/historicos-salariais/{id}`, `DELETE /api/human-resources/historicos-salariais/{id}`, `POST /api/human-resources/historicos-salariais`, `POST /api/human-resources/historicos-salariais/stats/timeseries`
- `/api/human-resources/identidades-secretas` (24 endpoints): `GET /api/human-resources/identidades-secretas/{id}`, `PUT /api/human-resources/identidades-secretas/{id}`, `DELETE /api/human-resources/identidades-secretas/{id}`, `POST /api/human-resources/identidades-secretas`, `POST /api/human-resources/identidades-secretas/stats/timeseries`
- `/api/human-resources/indenizacoes` (24 endpoints): `GET /api/human-resources/indenizacoes/{id}`, `PUT /api/human-resources/indenizacoes/{id}`, `DELETE /api/human-resources/indenizacoes/{id}`, `POST /api/human-resources/indenizacoes`, `POST /api/human-resources/indenizacoes/stats/timeseries`
- `/api/human-resources/mencoes-midia` (24 endpoints): `GET /api/human-resources/mencoes-midia/{id}`, `PUT /api/human-resources/mencoes-midia/{id}`, `DELETE /api/human-resources/mencoes-midia/{id}`, `POST /api/human-resources/mencoes-midia`, `POST /api/human-resources/mencoes-midia/stats/timeseries`
- `/api/human-resources/reputacoes` (24 endpoints): `GET /api/human-resources/reputacoes/{id}`, `PUT /api/human-resources/reputacoes/{id}`, `DELETE /api/human-resources/reputacoes/{id}`, `POST /api/human-resources/reputacoes`, `POST /api/human-resources/reputacoes/stats/timeseries`
- `/api/operations/acordos-regulatorios` (28 endpoints): `GET /api/operations/acordos-regulatorios/{id}`, `PUT /api/operations/acordos-regulatorios/{id}`, `DELETE /api/operations/acordos-regulatorios/{id}`, `POST /api/operations/acordos-regulatorios`, `POST /api/operations/acordos-regulatorios/{id}/actions/suspend`
- `/api/operations/base-acessos` (27 endpoints): `GET /api/operations/base-acessos/{id}`, `PUT /api/operations/base-acessos/{id}`, `DELETE /api/operations/base-acessos/{id}`, `POST /api/operations/base-acessos`, `POST /api/operations/base-acessos/{id}/actions/deactivate`
- `/api/operations/bases` (25 endpoints): `GET /api/operations/bases/{id}`, `PUT /api/operations/bases/{id}`, `DELETE /api/operations/bases/{id}`, `POST /api/operations/bases`, `POST /api/operations/bases/stats/timeseries`
- `/api/operations/equipe-membros` (24 endpoints): `GET /api/operations/equipe-membros/{id}`, `PUT /api/operations/equipe-membros/{id}`, `DELETE /api/operations/equipe-membros/{id}`, `POST /api/operations/equipe-membros`, `POST /api/operations/equipe-membros/stats/timeseries`
- `/api/operations/equipes` (24 endpoints): `GET /api/operations/equipes/{id}`, `PUT /api/operations/equipes/{id}`, `DELETE /api/operations/equipes/{id}`, `POST /api/operations/equipes`, `POST /api/operations/equipes/stats/timeseries`
- `/api/operations/sinais-socorro` (24 endpoints): `GET /api/operations/sinais-socorro/{id}`, `PUT /api/operations/sinais-socorro/{id}`, `DELETE /api/operations/sinais-socorro/{id}`, `POST /api/operations/sinais-socorro`, `POST /api/operations/sinais-socorro/stats/timeseries`
- `/api/praxis/config/ai-registry/component-definitions` (2 endpoints): `POST /api/praxis/config/ai-registry/component-definitions`, `GET /api/praxis/config/ai-registry/component-definitions/search`
- `/api/praxis/config/ai-registry/health` (1 endpoints): `GET /api/praxis/config/ai-registry/health`
- `/api/praxis/config/ai/authoring` (19 endpoints): `POST /api/praxis/config/ai/authoring/turn/stream/{streamId}/cancel`, `POST /api/praxis/config/ai/authoring/turn/stream/start`, `POST /api/praxis/config/ai/authoring/resource-candidates`, `POST /api/praxis/config/ai/authoring/page-preview`, `POST /api/praxis/config/ai/authoring/page-apply`
- `/api/praxis/config/ai/keys` (2 endpoints): `POST /api/praxis/config/ai/keys/rotate`, `POST /api/praxis/config/ai/keys/clear`
- `/api/praxis/config/ai/providers` (3 endpoints): `POST /api/praxis/config/ai/providers/test`, `POST /api/praxis/config/ai/providers/models`, `GET /api/praxis/config/ai/providers/catalog`
- `/api/praxis/config/ai/status` (1 endpoints): `GET /api/praxis/config/ai/status`
- `/api/praxis/config/ai/triage` (4 endpoints): `POST /api/praxis/config/ai/triage/observations/{observationId}/feedback`, `GET /api/praxis/config/ai/triage/summary`, `GET /api/praxis/config/ai/triage/observations`, `GET /api/praxis/config/ai/triage/observations/{observationId}`
- `/api/praxis/config/api-catalog/ingest` (1 endpoints): `POST /api/praxis/config/api-catalog/ingest`
- `/api/praxis/config/api-catalog/search` (1 endpoints): `GET /api/praxis/config/api-catalog/search`
- `/api/praxis/config/domain-360` (1 endpoints): `GET /api/praxis/config/domain-360`
- `/api/praxis/config/domain-catalog/context` (1 endpoints): `GET /api/praxis/config/domain-catalog/context`
- `/api/praxis/config/domain-catalog/ingest` (1 endpoints): `POST /api/praxis/config/domain-catalog/ingest`
- `/api/praxis/config/domain-catalog/items` (2 endpoints): `GET /api/praxis/config/domain-catalog/items`, `GET /api/praxis/config/domain-catalog/items/latest`
- `/api/praxis/config/domain-catalog/relationships` (1 endpoints): `GET /api/praxis/config/domain-catalog/relationships/latest`
- `/api/praxis/config/domain-catalog/releases` (1 endpoints): `GET /api/praxis/config/domain-catalog/releases`
- `/api/praxis/config/domain-federation/context` (1 endpoints): `GET /api/praxis/config/domain-federation/context`
- `/api/praxis/config/domain-federation/dry-run` (1 endpoints): `POST /api/praxis/config/domain-federation/dry-run`
- `/api/praxis/config/domain-federation/ingest` (1 endpoints): `POST /api/praxis/config/domain-federation/ingest`
- `/api/praxis/config/domain-federation/releases` (3 endpoints): `POST /api/praxis/config/domain-federation/releases/{releaseKey}/activate`, `GET /api/praxis/config/domain-federation/releases`, `GET /api/praxis/config/domain-federation/releases/{releaseKey}/validation`
- `/api/praxis/config/ui/{componentType}` (3 endpoints): `GET /api/praxis/config/ui/{componentType}/{componentId}`, `PUT /api/praxis/config/ui/{componentType}/{componentId}`, `DELETE /api/praxis/config/ui/{componentType}/{componentId}`
- `/api/procurement/companies` (24 endpoints): `GET /api/procurement/companies/{id}`, `PUT /api/procurement/companies/{id}`, `DELETE /api/procurement/companies/{id}`, `POST /api/procurement/companies`, `POST /api/procurement/companies/stats/timeseries`
- `/api/procurement/products` (24 endpoints): `GET /api/procurement/products/{id}`, `PUT /api/procurement/products/{id}`, `DELETE /api/procurement/products/{id}`, `POST /api/procurement/products`, `POST /api/procurement/products/stats/timeseries`
- `/api/procurement/purchase-orders` (24 endpoints): `GET /api/procurement/purchase-orders/{id}`, `PUT /api/procurement/purchase-orders/{id}`, `DELETE /api/procurement/purchase-orders/{id}`, `POST /api/procurement/purchase-orders`, `POST /api/procurement/purchase-orders/stats/timeseries`
- `/auth` (3 endpoints): `POST /auth/logout`, `POST /auth/login`, `GET /auth/session`
- `/schemas/domain` (1 endpoints): `GET /schemas/domain`
