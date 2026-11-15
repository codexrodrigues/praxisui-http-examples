# Chefia e Substituições — Runbook de Corpus HTTP de Domínio Corporativo

This runbook documents the source-derived HTTP corpus for the **Chefia e Substituições** cluster (`administracao-pessoal.funcoes`, `administracao-pessoal.vagas-funcao`, `administracao-pessoal.designacoes`, `administracao-pessoal.substituicoes`, and `administracao-pessoal.radar-chefias-substituicoes`) owned by a reference corporate HR host (`corporate-hr-service`).

## Boundary and Classification

- **Canonical Owner:** Reference corporate HR host (`http://localhost:8080`).
- **Public Corpus Separation:** The default public target of `praxisui-http-examples` is `https://praxis-api-quickstart.onrender.com` (`praxis-api-quickstart`). Because this cluster belongs to a separate corporate showcase host with its own isolated database project (`<neon-project-id>`) and separate Domain/Config database boundaries, these local-host examples are cataloged with:
  - `llmOperational: false`
  - `publishedBackendConfirmed: false`
  - `runtimeRecordConfirmed: false`
  - `selectorConfirmed: true`
  - `status: ["illustrative-only"]`
  - `protectedContract: true` for non-destructive read/filter/preview contracts
  - `referenceOnly: true` and `destructive: true` for write/command contracts

## Security and Header Prerequisites (Corporate HR Host)

1. **Authenticated Session (`SESSION`) and Scope Selection (`X-Tenant`):**
   - Domain endpoints under `/api/hr/**` require an authenticated principal (`HR_READ` for queries/previews, `HR_WRITE` for mutations) and an explicit organization header `X-Tenant: <empCodigo>` matching a granted `HR_DOMAIN_SCOPE:<empCodigo>:<environment>`.
2. **CSRF Protection on Non-GET Session Requests (`X-XSRF-TOKEN`):**
   - When using a browser session (`SESSION`), `POST`, `PUT`, `PATCH`, and `DELETE` requests require the `XSRF-TOKEN` cookie and matching `X-XSRF-TOKEN` request header.

## Covered Scenarios and Corporate Domain Contracts

| Scenario | Method & Path | Layer | Domain Responsibility & Praxis Contract |
|---|---|---|---|
| Leadership coverage hierarchy filter | `POST /api/hr/radar-chefias-substituicoes/filter` | `protectedContract` | Filters leadership coverage by parent sector (`setorPai`) and hierarchical path prefix (`caminhoHierarquicoPrefixo`), projecting both `titularNome` (titular resolution) and `chefeEmExercicioNome` / `substitutoNome` (acting holder resolution). |
| Leadership coverage 360° detail | `GET /api/hr/radar-chefias-substituicoes/30/detail` | `protectedContract` | Reads the 360° item projection (`SurfaceKind.READ_PROJECTION`) of a leadership coverage row with `titularNome`, `substitutoNome`, `substitutoPessoaId`, and `chefeEmExercicioNome`. |
| Substitution reactive determination preview | `POST /api/hr/substituicoes/determinations/previa` | `protectedContract` | Non-persisting reactive determination preview (`previaSubstituicao`) for `SubstituicaoFuncao`, returning inclusive duration (`diasSubstituicaoPrevistos`), minimum paid days (`minimoRemuneradoPrevisto`), remuneration eligibility (`remuneravelPrevisto`), and proportional daily value (`valorSubstituicaoPrevisto`). |
| Interim substitution create (`AUSENCIA_EVENTUAL`) | `POST /api/hr/substituicoes` | `referenceOnly` | Creates an interim substitution for `motivo: "AUSENCIA_EVENTUAL"` using composite wire identity `substitutoId: "202:1"` without requiring `afastamentoId` or `feriasGozoId`. |
| Substitution audit filter | `POST /api/hr/substituicoes/filter` | `protectedContract` | Filters interim substitutions by hierarchical sector (`setorPai`, `caminhoHierarquicoPrefixo`), `motivo: "AUSENCIA_EVENTUAL"`, and legal-basis completeness (`semDocumentoLegal: true`). |
| Leadership assignments hierarchy filter | `POST /api/hr/designacoes/filter` | `protectedContract` | Filters leadership assignments (`DesignacaoFuncao`) by parent sector (`setorPai`) and hierarchical path prefix (`caminhoHierarquicoPrefixo`). |
| Numbered leadership vacancies filter | `POST /api/hr/vagas-funcao/filter` | `protectedContract` | Filters numbered leadership positions (`VagaFuncao`) by parent sector (`setorPai`) and hierarchical path prefix (`caminhoHierarquicoPrefixo`). |
| Batch leadership approval evaluation | `POST /api/hr/designacoes/bulk/homologar-designacoes-lote/evaluation` | `referenceOnly` | Two-phase governed collection domain command evaluation (`HOMOLOGAR_LOTE_EVALUATION`) checking target versions and vacancy availability before confirmation. |

## 20-Pillar Capabilities Covered by `ChefiaHttpCorpusContractTest`

- **Reactive Determinations (`POST .../determinations/previa`):**
  - `POST /api/hr/vagas-funcao/determinations/previa` (`previaVaga`)
  - `POST /api/hr/designacoes/determinations/previa` (`previaDesignacao`)
  - `POST /api/hr/substituicoes/determinations/previa` (`previaSubstituicao`)
- **Partial Maintenance Intents (`@ResourceIntent` — `PATCH` + `If-Match`):**
  - `PATCH /api/hr/funcoes/{id}/politica-funcao` (`atualizar-politica-funcao`)
  - `PATCH /api/hr/vagas-funcao/{id}/realocar-vaga` (`realocar-vaga-funcao`)
  - `PATCH /api/hr/designacoes/{id}/substitutos-remuneracao` (`atualizar-substitutos-remuneracao`)
  - `PATCH /api/hr/substituicoes/{id}/apuracao-folha` (`apurar-folha-substituicao`)
- **Lifecycle Workflow Actions (`@WorkflowAction` — `POST .../actions/{action}` + `If-Match` + `Idempotency-Key`):**
  - `FuncaoConfianca`: `extinguir-funcao`, `reativar-funcao`
  - `VagaFuncao`: `bloquear-vaga`, `liberar-vaga`, `extinguir-vaga`
  - `DesignacaoFuncao`: `homologar-exercicio-designacao`, `dispensar-designacao`
  - `SubstituicaoFuncao`: `iniciar-exercicio-substituicao`, `liquidar-substituicao`, `cancelar-substituicao`
- **360° Master-Detail Child Surfaces (`relatedChildResourceKey`):**
  - `administracao-pessoal.funcoes` -> `vagas-da-funcao`, `designacoes-da-funcao`
  - `administracao-pessoal.vagas-funcao` -> `designacoes-da-vaga`
  - `administracao-pessoal.designacoes` -> `substituicoes-da-designacao`

## Verification Commands

Offline corpus and manifest verification in `praxisui-http-examples`:

```bash
npm run generate:llm-surface
npm run verify:manifest
```

Java MVC and contract verification in the corporate HR host:

```powershell
mvn "-Dtest=ChefiaHttpCorpusContractTest" test
```
