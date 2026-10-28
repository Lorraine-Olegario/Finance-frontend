<template>
  <ConfirmationModal
    :is-open="isOpen"
    size="small"
    type="primary"
    title="Classificar ativo"
    @close="$emit('close')"
  >
    <LoadingSpinner
      v-if="loadingAssets"
      message=""
      size="32px"
    />
    <div
      v-else
      class="net-worth-classify"
    >
      <div class="net-worth-classify__field">
        <label for="net-worth-classify-asset">Ativo</label>
        <BaseSelect
          id="net-worth-classify-asset"
          v-model="assetId"
          placeholder="Selecione o ativo"
          :options="assetOptions"
        />
      </div>

      <div
        v-if="availableViews.includes('sector')"
        class="net-worth-classify__field"
      >
        <label for="net-worth-classify-sector">Setor</label>
        <BaseInput
          id="net-worth-classify-sector"
          v-model="form.sector"
        />
      </div>

      <div
        v-if="availableViews.includes('segment')"
        class="net-worth-classify__field"
      >
        <label for="net-worth-classify-segment">Segmento</label>
        <BaseInput
          id="net-worth-classify-segment"
          v-model="form.segment"
        />
      </div>

      <div
        v-if="availableViews.includes('type')"
        class="net-worth-classify__field"
      >
        <label for="net-worth-classify-type">Tipo de fundo</label>
        <BaseInput
          id="net-worth-classify-type"
          v-model="form.fund_type"
        />
      </div>

      <AlertMessage
        v-if="formError"
        type="error"
        :message="formError"
      />
    </div>

    <template #footer>
      <BaseButton
        variant="secondary"
        :disabled="saving"
        @click="$emit('close')"
      >
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary"
        :loading="saving"
        :disabled="!assetId"
        @click="handleSubmit"
      >
        Salvar
      </BaseButton>
    </template>
  </ConfirmationModal>
</template>

<script setup lang="ts">
// ── Imports ──────────────────────────────────────────────────────────────────
import { ref, reactive, computed, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import netWorthService from '@/services/netWorthService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  categoryId: {
    type: [Number, String],
    required: true
  },
  availableViews: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

// ── State ────────────────────────────────────────────────────────────────────
const assets = ref([])
const assetId = ref('')
const form = reactive({ sector: '', segment: '', fund_type: '' })
const loadingAssets = ref(false)
const saving = ref(false)
const formError = ref('')

// ── Computed ─────────────────────────────────────────────────────────────────
const assetOptions = computed(() =>
  assets.value.map(asset => ({ value: String(asset.id), label: asset.label }))
)

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) loadAssets()
  }
)

// ── Functions ────────────────────────────────────────────────────────────────
async function fetchAssets() {
  const res = await netWorthService.getCategoryBreakdown(
    props.categoryId,
    'consolidated'
  )
  assets.value = res.data.items || []
}

async function loadAssets() {
  assetId.value = ''
  Object.assign(form, { sector: '', segment: '', fund_type: '' })
  formError.value = ''
  loadingAssets.value = true

  try {
    await fetchAssets()
  } catch (err) {
    console.error('[NetWorth] Erro ao carregar os ativos da categoria:', err)
    formError.value =
      err?.response?.data?.message || 'Erro ao carregar os ativos.'
  } finally {
    loadingAssets.value = false
  }
}

async function handleSubmit() {
  const payload = Object.fromEntries(
    Object.entries(form).filter(([, value]) => value.trim() !== '')
  )

  saving.value = true
  formError.value = ''

  try {
    await netWorthService.updateAssetClassification(assetId.value, payload)
    emit('saved')
  } catch (err) {
    console.error('[NetWorth] Erro ao classificar o ativo:', err)
    formError.value =
      err?.response?.data?.message || 'Erro ao salvar a classificação.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
