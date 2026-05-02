# Padrão de Dashboard / Páginas de Métricas

Referência reutilizável para dashboards, relatórios, telas administrativas e qualquer
página que exiba métricas e gráficos.

---

## 1. Estrutura de pastas

Organismos específicos de uma área ficam dentro de uma subpasta com o nome do contexto:

```
src/components/organisms/
└── dashboard/
    ├── DashboardWelcome.vue      # Banner de boas-vindas
    ├── DashboardCharts.vue       # Gráfico + lista de categorias
```

> **Regra:** ao criar organismos para novas áreas (relatórios, admin, etc.),
> crie a subpasta correspondente — ex: `organisms/reports/`, `organisms/admin/`.

---

## 2. Responsabilidades por camada

| Camada     | Faz                                       | Não faz                                      |
|------------|-------------------------------------------|----------------------------------------------|
| **Atom**   | Renderiza uma unidade visual              | Lógica de domínio                            |
| **Molecule**| Combina 2+ atoms, bloco funcional simples| Chamadas de API                              |
| **Organism**| Seção completa, recebe props, emite eventos | Busca dados, estado global              |
| **Page**   | Orquestra tudo, chama API, gerencia estado | Lógica visual (delega aos organismos)    |

---

## 3. Busca de dados na página

Separe cada responsabilidade em uma função dedicada.
A função principal apenas orquestra.

```js
/** Busca resumo de ativos e cores de categoria */
async function fetchAssetsSummary() { ... }

/** Busca alertas configurados pelo usuário */
async function fetchAlerts() { ... }

/** Busca dados exclusivos de admin */
async function fetchAdminData() { ... }

/** Orquestra todas as chamadas do dashboard */
async function loadDashboard() {
  if (!authStore.user?.id) return
  loading.value = true
  try {
    await Promise.all([fetchAssetsSummary(), fetchAlerts(), fetchAdminData()])
  } catch (err) {
    console.error('[Dashboard] Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
```

**Regras:**
- Uma função por responsabilidade de busca
- Erros opcionais (alertas, cores) são tratados internamente com `try/catch` silencioso
- Erros críticos propagam para o `catch` do orquestrador
- Sempre verificar `authStore.user?.id` antes de iniciar a carga
- Nomear com o prefixo `fetch` para funções de chamada e `load` para o orquestrador

---

## 4. Ícones — nunca inline

SVGs nunca devem aparecer diretamente no template.

```html
<!-- ❌ Proibido -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M3 3v18h18" />
</svg>

<!-- ✅ Correto -->
<SvgIcon name="bar-chart" />
```

Use sempre `<SvgIcon name="...">` com ícones registrados em
`src/assets/icons/index.js`. Para adicionar um novo ícone, siga
`docs/naming-conventions.md §5`.

---

## 5. Gráficos com Chart.js em organismos

Quando um organismo gerencia um canvas Chart.js:

```js
// flush: 'post' garante que o canvas está no DOM antes de buildChart
watch(() => props.assetsByType, buildChart, { deep: true, flush: 'post' })

onMounted(buildChart)
onBeforeUnmount(() => chartInstance?.destroy())
```

- Use `flush: 'post'` para garantir que o DOM está atualizado antes de renderizar o gráfico
- Destrua a instância em `onBeforeUnmount` para evitar memory leak
- O organismo recebe os dados via props — nunca busca diretamente

---

## 6. Paleta de cores para gráficos

Definida em `docs/style-guide.md §4`. Valores para categorias:

| Categoria   | Cor       |
|-------------|-----------|
| Ações       | `#3b82f6` |
| FII         | `#10b981` |
| Cripto      | `#ec4899` |
| BDR         | `#8b5cf6` |
| Renda Fixa  | `#f59e0b` |
| ETF         | `#06b6d4` |

---

## 7. Naming conventions nesta estrutura

| Artefato                    | Padrão                        | Exemplo                           |
|-----------------------------|-------------------------------|-----------------------------------|
| Arquivo de organismo        | PascalCase                    | `DashboardCharts.vue`             |
| Pasta de contexto           | kebab-case                    | `organisms/dashboard/`            |
| Classes CSS do organismo    | BEM kebab-case                | `.dashboard-charts__canvas-wrapper` |
| Funções de busca            | `fetch` + descritivo          | `fetchAssetsSummary`              |
| Função orquestradora        | `load` + contexto             | `loadDashboard`                   |

---

## 8. Checklist para novas páginas de métricas

- [ ] Organismos em `organisms/{contexto}/`
- [ ] Zero SVG inline — usar `<SvgIcon name="...">`
- [ ] Busca separada em funções menores + orquestrador
- [ ] Organismos recebem dados via props (sem chamadas de API internamente)
- [ ] Classes CSS seguindo BEM kebab-case
- [ ] `flush: 'post'` nos watchers de Chart.js
- [ ] `authStore.user?.id` verificado antes de iniciar a carga
- [ ] Erros opcionais com `try/catch` silencioso
- [ ] Erros críticos logados com prefixo `[NomeDaPágina]`
