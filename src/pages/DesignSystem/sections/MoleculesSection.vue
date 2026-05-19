<template>
  <!-- Molecules group header -->
  <div class="ds-group__header">
    <span class="ds-group__pill ds-group__pill--molecules">Molecules</span>
    <p>Combinam 2+ átomos para formar um bloco funcional reutilizável.</p>
  </div>

  <!-- SearchBar -->
  <section
    id="search-bar"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">SearchBar</h1>
      <p class="ds-section__desc">
        Campo de busca com ícone integrado, botão de limpar e foco estilizado.
        Usa
        <code>v-model</code>
        e emite
        <code>search</code>
        ao pressionar Enter.
      </p>
    </div>
    <h3 class="ds-section__subsection-title">Padrão</h3>
    <div
      class="ds-showcase"
      style="max-width: 360px"
    >
      <SearchBar
        v-model="demoSearch"
        placeholder="Buscar ativo..."
      />
    </div>
    <h3 class="ds-section__subsection-title">Com texto (botão limpar visível)</h3>
    <div
      class="ds-showcase"
      style="max-width: 360px"
    >
      <SearchBar
        v-model="demoSearchFilled"
        placeholder="Buscar..."
      />
    </div>
    <h3 class="ds-section__subsection-title">Disabled</h3>
    <div
      class="ds-showcase"
      style="max-width: 360px"
    >
      <SearchBar
        v-model="demoSearch"
        placeholder="Desabilitado"
        :disabled="true"
      />
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>modelValue</code>
      String ·
      <code>placeholder</code>
      String ·
      <code>disabled</code>
      Boolean
      <br />
      <b>Emits:</b>
      <code>update:modelValue</code>
      ·
      <code>search</code>
      (value: String)
    </div>
  </section>

  <!-- FormField -->
  <section
    id="form-field"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">FormField</h1>
      <p class="ds-section__desc">
        Wrapper de campo de formulário com label, hint e mensagem de erro. O
        slot padrão recebe qualquer input ou select.
      </p>
    </div>
    <h3 class="ds-section__subsection-title">Variações</h3>
    <div
      class="ds-showcase ds-showcase--col"
      style="max-width: 360px"
    >
      <FormField
        label="Nome do ativo"
        field-id="demo-nome"
      >
        <BaseInput
          v-model="demoInput"
          placeholder="Ex: PETR4"
        />
      </FormField>

      <FormField
        label="Categoria"
        field-id="demo-cat"
        hint="Selecione a categoria do ativo"
      >
        <BaseSelect
          v-model="demoSelect"
          :options="selectOpts"
          placeholder="Selecione..."
        />
      </FormField>

      <FormField
        label="Ticker"
        field-id="demo-ticker"
        error="Ticker inválido — use apenas letras maiúsculas."
        required
      >
        <template #icon>
          <SvgIcon
            name="activity"
            size="14"
          />
        </template>
        <BaseInput
          v-model="demoInput"
          placeholder="PETR4"
        />
      </FormField>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>label</code>
      String ·
      <code>fieldId</code>
      String ·
      <code>hint</code>
      String ·
      <code>error</code>
      String ·
      <code>required</code>
      Boolean
      <br />
      <b>Slots:</b>
      <code>#icon</code>
      ·
      <code>default</code>
      (campo)
    </div>
  </section>

  <!-- StatsGrid -->
  <section
    id="stats-grid"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">StatsGrid</h1>
      <p class="ds-section__desc">
        Grid responsivo para agrupar
        <code>StatCard</code>
        s. Colunas auto-fit com
        <code>minWidth</code>
        ou número fixo via
        <code>cols</code>
        .
      </p>
    </div>
    <h3 class="ds-section__subsection-title">Auto-fit (padrão — minWidth 220px)</h3>
    <div class="ds-showcase">
      <StatsGrid>
        <StatCard
          label="Total investido"
          value="R$ 48.250"
          variant="primary"
        >
          <template #icon>
            <SvgIcon name="dollar" />
          </template>
        </StatCard>
        <StatCard
          label="Ativos"
          value="23"
          variant="success"
        >
          <template #icon>
            <SvgIcon name="activity" />
          </template>
        </StatCard>
        <StatCard
          label="Observando"
          value="7"
          variant="info"
        >
          <template #icon>
            <SvgIcon name="eye" />
          </template>
        </StatCard>
      </StatsGrid>
    </div>
    <h3 class="ds-section__subsection-title">2 colunas fixas</h3>
    <div class="ds-showcase">
      <StatsGrid :cols="2">
        <StatCard
          label="Rentabilidade"
          value="+12,4%"
          variant="warning"
        >
          <template #icon>
            <SvgIcon name="trending-up" />
          </template>
        </StatCard>
        <StatCard
          label="Categorias"
          value="5"
          variant="primary"
        >
          <template #icon>
            <SvgIcon name="grid" />
          </template>
        </StatCard>
      </StatsGrid>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>cols</code>
      Number (colunas fixas) ·
      <code>minWidth</code>
      String (default
      <code>'220px'</code>
      para auto-fit)
      <br />
      <b>Slots:</b>
      <code>default</code>
      (StatCards)
    </div>
  </section>

  <!-- PageHeader -->
  <section
    id="page-header"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">PageHeader</h1>
      <p class="ds-section__desc">
        Cabeçalho de página com título, subtítulo opcional e slot de ações.
        Responsivo — empilha em telas estreitas.
      </p>
    </div>
    <h3 class="ds-section__subsection-title">Somente título</h3>
    <div class="ds-showcase">
      <PageHeader title="Meus Ativos" />
    </div>
    <h3 class="ds-section__subsection-title">Com subtítulo e ações</h3>
    <div class="ds-showcase">
      <PageHeader
        title="Meus Ativos"
        subtitle="Gerencie sua carteira de investimentos"
      >
        <template #actions>
          <BaseButton
            variant="ghost"
            size="sm"
          >
            Exportar
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
          >
            Adicionar ativo
          </BaseButton>
        </template>
      </PageHeader>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>title</code>
      String (required) ·
      <code>subtitle</code>
      String
      <br />
      <b>Slots:</b>
      <code>#actions</code>
    </div>
  </section>

  <!-- TableActions -->
  <section
    id="table-actions"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">TableActions</h1>
      <p class="ds-section__desc">
        Container flex para agrupamento de
        <code>ActionButton</code>
        s em linhas de tabela. Alinhamento configurável.
      </p>
    </div>
    <h3 class="ds-section__subsection-title">Ações de linha (center)</h3>
    <div class="ds-showcase">
      <TableActions>
        <ActionButton
          variant="edit"
          title="Editar"
        >
          <SvgIcon
            name="edit"
            size="18"
          />
        </ActionButton>
        <ActionButton
          variant="observe"
          title="Observar"
        >
          <SvgIcon
            name="eye"
            size="18"
          />
        </ActionButton>
        <ActionButton
          variant="delete"
          title="Excluir"
        >
          <SvgIcon
            name="trash"
            size="18"
          />
        </ActionButton>
      </TableActions>
    </div>
    <h3 class="ds-section__subsection-title">Alinhado à direita (end)</h3>
    <div class="ds-showcase">
      <TableActions align="end">
        <ActionButton
          variant="info"
          title="Detalhes"
        >
          <SvgIcon
            name="info"
            size="18"
          />
        </ActionButton>
        <ActionButton
          variant="edit"
          title="Editar"
        >
          <SvgIcon
            name="edit"
            size="18"
          />
        </ActionButton>
      </TableActions>
    </div>
    <div class="ds-props">
      <b>Props:</b>
      <code>align</code>
      'start' | 'center' | 'end' (default
      <code>'center'</code>
      )
      <br />
      <b>Slots:</b>
      <code>default</code>
      (ActionButtons)
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import BaseButton from '@/components/atoms/BaseButton/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import ActionButton from '@/components/atoms/ActionButton/index.vue'
import StatCard from '@/components/atoms/StatCard/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

import SearchBar from '@/components/molecules/SearchBar/index.vue'
import FormField from '@/components/molecules/FormField/index.vue'
import StatsGrid from '@/components/molecules/StatsGrid/index.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import TableActions from '@/components/molecules/TableActions/index.vue'

const demoSearch = ref('')
const demoSearchFilled = ref('PETR4')
const demoInput = ref('Valor editável')
const demoSelect = ref('')

const selectOpts = [
  { value: 'acoes', label: 'Ações' },
  { value: 'fii', label: 'FII' },
  { value: 'bdr', label: 'BDR' },
  { value: 'cripto', label: 'Cripto' }
]
</script>
