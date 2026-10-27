<template>
  <MainLayout
    page-title="Importar carteira B3"
    page-subtitle="Importe suas compras e vendas a partir do relatório de movimentação da B3"
  >
    <template #actions>
      <BaseButton
        variant="secondary"
        size="sm"
        @click="guideOpen = true"
      >
        <template #icon-left>
          <SvgIcon
            name="info"
            :size="16"
          />
        </template>
        Documentação
      </BaseButton>
    </template>

    <div class="import-b3-page">
      <section class="import-b3-page__card">
        <h2 class="import-b3-page__title">Enviar planilha</h2>
        <p class="import-b3-page__hint">
          Envie o arquivo .xlsx baixado em Extratos &rarr; Movimentação na B3.
          Não sabe como obter? Abra a
          <button
            type="button"
            class="import-b3-page__link"
            @click="guideOpen = true"
          >
            documentação
          </button>
          .
        </p>

        <input
          ref="fileInput"
          type="file"
          accept=".xlsx"
          class="import-b3-page__input"
          :disabled="importing"
          @change="onFileChange"
        />

        <div
          v-if="!file"
          :class="[
            'import-b3-page__dropzone',
            { 'import-b3-page__dropzone--active': dragging }
          ]"
          role="button"
          tabindex="0"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <SvgIcon
            name="upload"
            :size="32"
          />
          <strong>Arraste a planilha aqui ou clique para selecionar</strong>
          <span>Somente arquivos .xlsx, até 5 MB</span>
        </div>

        <div
          v-else
          class="import-b3-page__file"
        >
          <SvgIcon
            name="download"
            :size="24"
          />
          <div class="import-b3-page__file-info">
            <strong>{{ file.name }}</strong>
            <span>{{ formatSize(file.size) }}</span>
          </div>
          <button
            type="button"
            class="import-b3-page__remove"
            aria-label="Remover arquivo"
            :disabled="importing"
            @click="clearFile"
          >
            <SvgIcon
              name="close"
              :size="18"
            />
          </button>
        </div>

        <div class="import-b3-page__actions">
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
        </div>
      </section>

      <section
        v-if="result"
        class="import-b3-page__card"
      >
        <h2 class="import-b3-page__title">Resultado da importação</h2>

        <div class="import-b3-page__stats">
          <div class="import-b3-page__stat import-b3-page__stat--success">
            <strong>{{ result.imported }}</strong>
            <span>Transações importadas</span>
          </div>
          <div class="import-b3-page__stat">
            <strong>{{ result.skipped }}</strong>
            <span>Linhas ignoradas</span>
          </div>
          <div class="import-b3-page__stat">
            <strong>{{ result.created_assets?.length || 0 }}</strong>
            <span>Ativos adicionados</span>
          </div>
          <div
            :class="[
              'import-b3-page__stat',
              { 'import-b3-page__stat--danger': result.errors?.length }
            ]"
          >
            <strong>{{ result.errors?.length || 0 }}</strong>
            <span>Linhas com erro</span>
          </div>
        </div>

        <p
          v-if="result.created_assets?.length"
          class="import-b3-page__assets"
        >
          Ativos adicionados à sua carteira:
          <strong>{{ result.created_assets.join(', ') }}</strong>
        </p>

        <ul
          v-if="result.errors?.length"
          class="import-b3-page__errors"
        >
          <li
            v-for="error in result.errors"
            :key="error.line"
          >
            <strong>Linha {{ error.line }}:</strong>
            {{ error.message }}
          </li>
        </ul>

        <BaseButton
          variant="secondary"
          size="sm"
          @click="router.push('/portfolio')"
        >
          Ver carteira
        </BaseButton>
      </section>
    </div>

    <B3GuideModal
      :is-open="guideOpen"
      @close="guideOpen = false"
    />
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/templates/MainLayout.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import B3GuideModal from '@/components/organisms/portfolio/B3GuideModal/index.vue'
import { useToastStore } from '@/stores/toast'
import portfolioService from '@/services/portfolioService'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const router = useRouter()
const toastStore = useToastStore()

const fileInput = ref(null)
const file = ref(null)
const dragging = ref(false)
const importing = ref(false)
const result = ref(null)
const guideOpen = ref(false)

function openFilePicker() {
  fileInput.value?.click()
}

function selectFile(selected) {
  result.value = null

  if (!selected) return

  if (!selected.name.toLowerCase().endsWith('.xlsx')) {
    toastStore.error('Selecione uma planilha no formato .xlsx.')
    return
  }

  if (selected.size > MAX_FILE_SIZE) {
    toastStore.error('O arquivo deve ter no máximo 5 MB.')
    return
  }

  file.value = selected
}

function onFileChange(event) {
  selectFile(event.target.files[0])
}

function onDrop(event) {
  dragging.value = false
  selectFile(event.dataTransfer.files[0])
}

function clearFile() {
  file.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function handleImport() {
  if (!file.value) return

  importing.value = true
  result.value = null

  try {
    const { data } = await portfolioService.importB3(file.value)
    result.value = data
    toastStore.success('Planilha da B3 processada.')
    clearFile()
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
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.import-b3-page__title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.import-b3-page__hint {
  margin: 0 0 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.import-b3-page__link {
  background: none;
  border: none;
  padding: 0;
  color: var(--primary);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.import-b3-page__input {
  display: none;
}

.import-b3-page__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2.5rem 1rem;
  border: 2px dashed var(--border-default);
  border-radius: 12px;
  background: var(--bg-input);
  color: var(--text-secondary);
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.import-b3-page__dropzone strong {
  color: var(--text-primary);
}

.import-b3-page__dropzone:hover,
.import-b3-page__dropzone:focus-visible,
.import-b3-page__dropzone--active {
  border-color: var(--primary);
  background: var(--primary-muted);
  outline: none;
}

.import-b3-page__file {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-default);
  border-radius: 12px;
  background: var(--bg-input);
  color: var(--primary);
}

.import-b3-page__file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.import-b3-page__file-info strong {
  color: var(--text-primary);
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.import-b3-page__remove {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 0.4rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.import-b3-page__remove:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.import-b3-page__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
}

.import-b3-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.import-b3-page__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  border: 1px solid var(--border-default);
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.import-b3-page__stat strong {
  font-size: 1.6rem;
  color: var(--text-primary);
}

.import-b3-page__stat--success strong {
  color: var(--success);
}

.import-b3-page__stat--danger strong {
  color: var(--danger);
}

.import-b3-page__assets {
  margin: 0 0 1rem;
  color: var(--text-secondary);
}

.import-b3-page__assets strong {
  color: var(--text-primary);
}

.import-b3-page__errors {
  margin: 0 0 1rem;
  padding: 1rem 1rem 1rem 2rem;
  border-radius: 8px;
  background: var(--status-danger-bg);
  color: var(--text-primary);
  line-height: 1.6;
}
</style>
