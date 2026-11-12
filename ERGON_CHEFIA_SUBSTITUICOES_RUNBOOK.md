# Ergon Chefia e Substituições — Source-Derived HTTP Corpus Runbook

This runbook documents the source-derived HTTP corpus for the **Chefia e Substituições** cluster (`administracao-pessoal.funcoes`, `administracao-pessoal.vagas-funcao`, `administracao-pessoal.designacoes`, `administracao-pessoal.substituicoes`, and `administracao-pessoal.radar-chefias-substituicoes`) owned by `praxis-ergon-showcase`.

## Boundary and Classification

- **Canonical Owner:** `praxis-ergon-showcase` (`http://localhost:8080`).
- **Public Corpus Separation:** The default public target of `praxisui-http-examples` is `https://praxis-api-quickstart.onrender.com` (`praxis-api-quickstart`). Because `praxis-ergon-showcase` is a separate showcase host with its own Neon project (`holy-mouse-40140108`) and separate Domain/Config database boundaries, all `ergon-chefia-*` examples are cataloged with:
  - `llmOperational: false`
  - `publishedBackendConfirmed: false`
  - `runtimeRecordConfirmed: false`
  - `selectorConfirmed: true`
  - `status: ["illustrative-only"]`
  - `protectedContract: true` for non-destructive read/filter/preview contracts
  - `referenceOnly: true` and `destructive: true` for write/command contracts

## Security and Header Prerequisites (`praxis-ergon-showcase`)

1. **Authenticated Session (`ERGONSESSION`) and Scope Selection (`X-Tenant`):**
   - Domain endpoints under `/api/ergon/**` require an authenticated principal (`ERGON_READ` for queries/previews, `ERGON_WRITE` for mutations) and an explicit organization header `X-Tenant: <empCodigo>` matching a granted `ERGON_DOMAIN_SCOPE:<empCodigo>:<environment>`.
2. **CSRF Protection on Non-GET Session Requests (`X-XSRF-TOKEN`):**
   - When using a browser session (`ERGONSESSION`), `POST`, `PUT`, `PATCH`, and `DELETE` requests require the `XSRF-TOKEN` cookie and matching `X-XSRF-TOKEN` request header.

## Covered Scenarios and Legacy Ergon Lineage

| Example ID | Method & Path | Layer | Legacy Ergon Lineage & Praxis Contract |
|---|---|---|---|
| `ergon-chefia-radar-filter-hierarquia` | `POST /api/ergon/radar-chefias-substituicoes/filter` | `protectedContract` | Filters leadership coverage by parent sector (`setorPai`) and hierarchical path prefix (`caminhoHierarquicoPrefixo`), projecting both `titularNome` (`GET_CHF_TIT`) and `chefeEmExercicioNome` / `substitutoNome` (`GET_CHF_EXERC`, `ERGadm00480`). |
| `ergon-chefia-radar-detail` | `GET /api/ergon/radar-chefias-substituicoes/30/detail` | `protectedContract` | Reads the 360° item projection (`SurfaceKind.READ_PROJECTION`) of a leadership coverage row with `titularNome`, `substitutoNome`, `substitutoPessoaId`, and `chefeEmExercicioNome`. |
| `ergon-chefia-substituicoes-previa` | `POST /api/ergon/substituicoes/determinations/previa` | `protectedContract` | Non-persisting reactive determination preview (`previaSubstituicao`) for `SubstituicaoFuncao`, returning inclusive duration (`diasSubstituicaoPrevistos`), minimum paid days (`minimoRemuneradoPrevisto`), remuneration eligibility (`remuneravelPrevisto`), and proportional daily value (`valorSubstituicaoPrevisto`). |
| `ergon-chefia-substituicoes-create-ausencia-eventual` | `POST /api/ergon/substituicoes` | `referenceOnly` | Creates an interim substitution for `motivo: "AUSENCIA_EVENTUAL"` (`ERGadm00364` / `PCK_SUBST_AUSENC_EV` / `ERG-01311`) using composite wire identity `substitutoId: "202:1"` without requiring `afastamentoId` or `feriasGozoId`. |
| `ergon-chefia-substituicoes-filter-auditoria` | `POST /api/ergon/substituicoes/filter` | `protectedContract` | Filters interim substitutions by hierarchical sector (`setorPai`, `caminhoHierarquicoPrefixo`), `motivo: "AUSENCIA_EVENTUAL"`, and legal-basis completeness (`semDocumentoLegal: true`). |
| `ergon-chefia-designacoes-filter-hierarquia` | `POST /api/ergon/designacoes/filter` | `protectedContract` | Filters leadership assignments (`DesignacaoFuncao`, `ERGadm00127`) by parent sector (`setorPai`) and hierarchical path prefix (`caminhoHierarquicoPrefixo`). |
| `ergon-chefia-vagas-funcao-filter-hierarquia` | `POST /api/ergon/vagas-funcao/filter` | `protectedContract` | Filters numbered leadership positions (`VagaFuncao`, `ERGadm00163`) by parent sector (`setorPai`) and hierarchical path prefix (`caminhoHierarquicoPrefixo`). |
| `ergon-chefia-designacoes-homologar-lote-evaluation` | `POST /api/ergon/designacoes/bulk/homologar-designacoes-lote/evaluation` | `referenceOnly` | Two-phase governed collection domain command evaluation (`HOMOLOGAR_LOTE_EVALUATION`) checking target versions and vacancy availability before confirmation. |

## 20-Pillar Capabilities Covered by `ChefiaHttpCorpusContractTest`

- **Reactive Determinations (`POST .../determinations/previa`):**
  - `POST /api/ergon/vagas-funcao/determinations/previa` (`previaVaga`)
  - `POST /api/ergon/designacoes/determinations/previa` (`previaDesignacao`)
  - `POST /api/ergon/substituicoes/determinations/previa` (`previaSubstituicao`)
- **Partial Maintenance Intents (`@ResourceIntent` — `PATCH` + `If-Match`):**
  - `PATCH /api/ergon/funcoes/{id}/politica-funcao` (`atualizar-politica-funcao`)
  - `PATCH /api/ergon/vagas-funcao/{id}/realocar-vaga` (`realocar-vaga-funcao`)
  - `PATCH /api/ergon/designacoes/{id}/substitutos-remuneracao` (`atualizar-substitutos-remuneracao`)
  - `PATCH /api/ergon/substituicoes/{id}/apuracao-folha` (`apurar-folha-substituicao`)
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
npm run verify:ergon-chefia
npm run verify:manifest
```

Java MVC and contract verification in `praxis-ergon-showcase`:

```powershell
mvn "-Dtest=ChefiaHttpCorpusContractTest" test
```
