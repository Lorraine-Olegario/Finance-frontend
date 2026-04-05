<template>
  <MainLayout page-title="Configurações de Cores">
    <div class="settings-page">
      <PageHeader
        title="Personalizar Cores das Categorias"
        subtitle="Escolha uma cor para cada tipo de ativo no seu dashboard"
      >
        <template
          v-if="hasChanges"
          #actions
        >
          <BaseButton
            variant="secondary"
            :disabled="saving"
            @click="resetColors"
          >
            Resetar
          </BaseButton>
          <BaseButton
            variant="primary"
            :loading="saving"
            :disabled="saving"
            @click="saveColors"
          >
            Salvar Cores
          </BaseButton>
        </template>
      </PageHeader>

      <AlertMessage
        v-if="message"
        :type="messageType"
        :message="message"
        dismissible
        class="settings-page__alert"
        @dismiss="message = ''"
      />

      <LoadingSpinner
        v-if="loading"
        message="Carregando configurações..."
      />

      <div
        v-else
        class="settings-page__grid"
      >
        <div
          v-for="(color, categoria) in categoryColors"
          :key="categoria"
          class="settings-page__color-card card"
        >
          <div class="settings-page__color-card-header">
            <span
              class="settings-page__color-dot"
              :style="{ background: color }"
            />
            <h3 class="settings-page__color-name">{{ categoria }}</h3>
          </div>

          <div class="settings-page__color-picker-row">
            <input
              v-model="categoryColors[categoria]"
              type="color"
              class="settings-page__color-input"
              @change="markAsChanged"
            />
            <span class="settings-page__color-value">
              {{ categoryColors[categoria] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'
import { useAuthStore } from '@/stores/auth'
import assetService from '@/services/assetService'

const authStore = useAuthStore()

const categoryColors = reactive({})
const originalColors = ref({})
const loading = ref(true)
const saving = ref(false)
const hasChanges = ref(false)
const message = ref('')
const messageType = ref('success')

const defaultColors = {
  Ações: '#FF8C00',
  FIIs: '#6200EE',
  Criptomoedas: '#03DAC6',
  BDRs: '#BB86FC',
  Stocks: '#3700B3',
  ETFs: '#018786'
}

async function fetchColors() {
  loading.value = true

  try {
    const userId = authStore.user?.id
    if (!userId) {
      showMessage('Usuário não identificado', 'error')
      return
    }

    const assetsResponse = await assetService.getAssets(userId)
    const ativosPorCategoria =
      assetsResponse.data?.ativos_por_categoria || {}

    const colorsResponse = await assetService.getCategoryColors(userId)
    const savedColors = colorsResponse.data?.colors || {}

    Object.keys(categoryColors).forEach(k => delete categoryColors[k])

    Object.keys(ativosPorCategoria).forEach(categoria => {
      categoryColors[categoria] =
        savedColors[categoria] || defaultColors[categoria] || '#CF6679'
    })

    originalColors.value = { ...categoryColors }
    hasChanges.value = false
  } catch (err) {
    console.error('Erro ao carregar cores:', err)
    showMessage('Erro ao carregar configurações', 'error')
  } finally {
    loading.value = false
  }
}

function markAsChanged() {
  hasChanges.value =
    JSON.stringify(categoryColors) !== JSON.stringify(originalColors.value)
}

async function saveColors() {
  saving.value = true

  try {
    const userId = authStore.user?.id
    if (!userId) {
      showMessage('Usuário não identificado', 'error')
      return
    }

    await assetService.updateCategoryColors(userId, { ...categoryColors })
    originalColors.value = { ...categoryColors }
    hasChanges.value = false
    showMessage('Cores salvas com sucesso!', 'success')
  } catch (err) {
    console.error('Erro ao salvar cores:', err)
    showMessage('Erro ao salvar cores', 'error')
  } finally {
    saving.value = false
  }
}

function resetColors() {
  Object.keys(categoryColors).forEach(k => {
    categoryColors[k] = originalColors.value[k]
  })
  hasChanges.value = false
  message.value = ''
}

function showMessage(text, type) {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(fetchColors)
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
}

.settings-page__alert {
  margin-bottom: 1.5rem;
}

.settings-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.settings-page__color-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-page__color-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-page__color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.settings-page__color-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-page__color-picker-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.settings-page__color-input {
  width: 72px;
  height: 44px;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  padding: 2px;
  background: var(--bg-primary);
  transition: transform 0.2s;
}

.settings-page__color-input:hover {
  transform: scale(1.05);
  border-color: var(--primary);
}

.settings-page__color-value {
  font-family: 'Courier New', monospace;
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>
