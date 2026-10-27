<template>
  <MainLayout
    page-title="Importar carteira B3"
    page-subtitle="Importe suas compras e vendas a partir do relatório de movimentação da B3"
  >
    <div class="import-b3-page">
      <section class="import-b3-page__card">
        <h2 class="import-b3-page__title">Como obter o relatório</h2>
        <ol class="import-b3-page__steps">
          <li>
            Na
            <strong>Área do Investidor</strong>
            da B3, vá em
            <strong>Extratos &rarr; Movimentação</strong>
            .
          </li>
          <li>
            Clique em
            <strong>Filtrar</strong>
            , escolha o
            <strong>ano</strong>
            (recomendado importar ano por ano) e marque
            <strong>Compra e venda</strong>
            .
          </li>
          <li>
            Clique em
            <strong>Baixar</strong>
            e escolha o formato Excel (.xlsx).
          </li>
        </ol>
        <div class="import-b3-page__images">
          <img
            src="/img/b3/b3-extratos-movimentacao.png"
            alt="Área do Investidor da B3: Extratos, aba Movimentação, botões Filtrar e Baixar"
          />
          <img
            class="import-b3-page__image--mobile"
            src="/img/b3/b3-filtro-movimentacao.png"
            alt="Filtros da Movimentação na B3 com Compra e venda selecionado"
          />
        </div>
      </section>

      <section class="import-b3-page__card">
        <h2 class="import-b3-page__title">Enviar planilha</h2>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx"
          class="import-b3-page__file"
          :disabled="importing"
          @change="onFileChange"
        />
        <BaseButton
          variant="primary"
          :loading="importing"
          :disabled="!file || importing"
          @click="handleImport"
        >
          <template #icon-left>
            <SvgIcon
              name="upload"
              :size="16"
            />
          </template>
          Importar
        </BaseButton>

        <AlertMessage
          v-if="result"
          type="success"
          class="import-b3-page__alert"
          :message="resultMessage"
        />
        <AlertMessage
          v-if="result?.errors?.length"
          type="warning"
          class="import-b3-page__alert"
          title="Linhas não importadas"
          :message="
            result.errors.map(e => `Linha ${e.line}: ${e.message}`).join(' | ')
          "
        />
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import { useToastStore } from '@/stores/toast'
import portfolioService from '@/services/portfolioService'

const toastStore = useToastStore()

const fileInput = ref(null)
const file = ref(null)
const importing = ref(false)
const result = ref(null)

const resultMessage = computed(() => {
  if (!result.value) return ''
  const { imported, skipped, created_assets: created = [] } = result.value
  const parts = [`${imported} transação(ões) importada(s)`]
  if (skipped) parts.push(`${skipped} linha(s) ignorada(s)`)
  if (created.length) parts.push(`ativos adicionados: ${created.join(', ')}`)
  return parts.join(' · ')
})

function onFileChange(event) {
  file.value = event.target.files[0] || null
  result.value = null
}

async function handleImport() {
  if (!file.value) return

  importing.value = true
  result.value = null

  try {
    const { data } = await portfolioService.importB3(file.value)
    result.value = data
    toastStore.success('Planilha da B3 processada.')
    file.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (err) {
    console.error('[ImportB3] Erro ao importar planilha:', err)
    const data = err.response?.data
    toastStore.error(
      data?.errors?.file?.[0] || data?.message || 'Erro ao importar a planilha.'
    )
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.import-b3-page {
  max-width: 900px;
}

.import-b3-page__card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.import-b3-page__title {
  font-size: 1.1rem;
  margin: 0 0 1rem;
}

.import-b3-page__steps {
  color: var(--text-secondary);
  padding-left: 1.25rem;
  line-height: 1.7;
}

.import-b3-page__images img {
  max-width: 100%;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  margin-top: 0.75rem;
}

.import-b3-page__images .import-b3-page__image--mobile {
  max-width: 320px;
  display: block;
}

.import-b3-page__file {
  display: block;
  margin-bottom: 1rem;
}

.import-b3-page__alert {
  margin-top: 1rem;
}
</style>
