<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="info"
    title="Importar proventos da B3"
    size="large"
    @close="handleClose"
  >
    <div class="dividends-import">
      <p class="dividends-import__hint">
        Envie o relatório
        <strong>Extratos &rarr; Movimentação</strong>
        da B3 sem o filtro “Compra e venda”. Não sabe como obter? Veja o
        <button
          type="button"
          class="dividends-import__link"
          @click="guideOpen = true"
        >
          passo a passo
        </button>
        .
      </p>

      <p class="dividends-import__notice">
        Reimportar o mesmo arquivo não duplica os proventos. O que vem da B3
        prevalece sobre o valor calculado.
      </p>

      <input
        ref="fileInput"
        type="file"
        accept=".xlsx"
        class="dividends-import__input"
        :disabled="importing"
        @change="handleFileChange"
      />

      <div
        v-if="!file"
        :class="[
          'dividends-import__dropzone',
          { 'dividends-import__dropzone--active': dragging }
        ]"
        role="button"
        tabindex="0"
        @click="openFilePicker"
        @keydown.enter.prevent="openFilePicker"
        @keydown.space.prevent="openFilePicker"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="handleDrop"
      >
        <SvgIcon
          name="upload"
          :size="28"
        />
        <strong>Arraste a planilha aqui ou clique para selecionar</strong>
        <span>Somente arquivos .xlsx, até 5 MB</span>
      </div>

      <div
        v-else
        class="dividends-import__file"
      >
        <SvgIcon
          name="download"
          :size="22"
        />
        <div class="dividends-import__file-info">
          <strong>{{ file.name }}</strong>
          <span>{{ formatSize(file.size) }}</span>
        </div>
        <button
          type="button"
          class="dividends-import__remove"
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

      <section
        v-if="result"
        class="dividends-import__result"
      >
        <h4 class="dividends-import__result-title">Resultado da importação</h4>

        <div class="dividends-import__stats">
          <div class="dividends-import__stat dividends-import__stat--success">
            <strong>{{ result.imported }}</strong>
            <span>Importados</span>
          </div>
          <div class="dividends-import__stat">
            <strong>{{ result.duplicated }}</strong>
            <span>Já existentes</span>
          </div>
          <div class="dividends-import__stat">
            <strong>{{ result.skipped }}</strong>
            <span>Ignorados</span>
          </div>
          <div
            :class="[
              'dividends-import__stat',
              { 'dividends-import__stat--warning': result.divergences.length }
            ]"
          >
            <strong>{{ result.divergences.length }}</strong>
            <span>Divergências</span>
          </div>
          <div
            :class="[
              'dividends-import__stat',
              { 'dividends-import__stat--danger': result.errors.length }
            ]"
          >
            <strong>{{ result.errors.length }}</strong>
            <span>Erros</span>
          </div>
        </div>

        <div v-if="result.divergences.length">
          <h5 class="dividends-import__list-title">
            Divergências em relação ao valor calculado
          </h5>
          <div class="dividends-import__scroll">
            <table class="dividends-import__table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Pagamento</th>
                  <th class="dividends-import__right">Valor B3</th>
                  <th class="dividends-import__right">Valor calculado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="divergence in result.divergences"
                  :key="`${divergence.line}-${divergence.asset}`"
                >
                  <td>{{ divergence.asset }}</td>
                  <td>{{ formatDate(divergence.payment_date) }}</td>
                  <td class="dividends-import__right">
                    {{ money(divergence.b3_total) }}
                  </td>
                  <td class="dividends-import__right">
                    {{ money(divergence.calculated_total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="result.errors.length">
          <h5 class="dividends-import__list-title">Erros por linha</h5>
          <ul class="dividends-import__errors">
            <li
              v-for="error in result.errors"
              :key="`${error.line}-${error.message}`"
            >
              <strong>Linha {{ error.line }}:</strong>
              {{ error.message }}
            </li>
          </ul>
        </div>

        <details
          v-if="result.skipped_lines.length"
          class="dividends-import__skipped"
        >
          <summary>
            Linhas ignoradas ({{ result.skipped_lines.length }})
          </summary>
          <ul>
            <li
              v-for="line in result.skipped_lines"
              :key="line.line"
            >
              Linha {{ line.line }}: {{ line.movement }}
            </li>
          </ul>
        </details>
      </section>
    </div>

    <template #footer>
      <button
        type="button"
        class="dividends-import__button dividends-import__button--secondary"
        :disabled="importing"
        @click="handleClose"
      >
        Fechar
      </button>
      <button
        type="button"
        class="dividends-import__button"
        :disabled="!file || importing"
        @click="handleImport"
      >
        {{ importing ? 'Importando...' : 'Importar' }}
      </button>
    </template>
  </ConfirmationModal>

  <B3GuideModal
    :is-open="guideOpen"
    variant="dividends"
    @close="guideOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import B3GuideModal from '@/components/organisms/portfolio/B3GuideModal/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { useToastStore } from '@/stores/toast'
import { useVisibilityStore } from '@/stores/visibility'
import dividendService from '@/services/dividendService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const MAX_FILE_SIZE = 5 * 1024 * 1024

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits<{
  close: []
  imported: []
}>()

const toastStore = useToastStore()
const visibilityStore = useVisibilityStore()

const fileInput = ref(null)
const file = ref(null)
const dragging = ref(false)
const importing = ref(false)
const result = ref(null)
const guideOpen = ref(false)

function money(value) {
  return formatCurrency(value, visibilityStore.valuesHidden)
}

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

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

function handleFileChange(event) {
  selectFile(event.target.files[0])
}

function handleDrop(event) {
  dragging.value = false
  selectFile(event.dataTransfer.files[0])
}

function clearFile() {
  file.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function handleClose() {
  if (importing.value) return

  clearFile()
  result.value = null
  emit('close')
}

async function handleImport() {
  if (!file.value) return

  importing.value = true
  result.value = null

  try {
    const { data } = await dividendService.importB3(file.value)
    result.value = data
    toastStore.success('Proventos da B3 processados.')
    clearFile()
    emit('imported')
  } catch (err) {
    console.error('[DividendsImportB3Modal] Erro ao importar proventos:', err)
    const data = err.response?.data
    toastStore.error(
      data?.errors?.file?.[0] || data?.message || 'Erro ao importar a planilha.'
    )
  } finally {
    importing.value = false
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
