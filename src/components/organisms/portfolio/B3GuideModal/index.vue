<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="info"
    :title="
      isDividends
        ? 'Como obter o relatório de proventos da B3'
        : 'Como obter o relatório da B3'
    "
    size="large"
    @close="$emit('close')"
  >
    <div class="b3-guide">
      <p class="b3-guide__intro">
        <template v-if="isDividends">
          Importe os proventos realmente creditados a partir do relatório de
          movimentação da B3. Eles servem de conferência dos meses anteriores e
          prevalecem sobre o valor calculado. Recomendamos importar
        </template>
        <template v-else>
          Importe suas compras e vendas a partir do relatório de movimentação da
          B3. Recomendamos importar
        </template>
        <strong>ano por ano</strong>
        .
      </p>

      <ol class="b3-guide__steps">
        <li class="b3-guide__step">
          <span class="b3-guide__number">1</span>
          <div class="b3-guide__content">
            <h4>Abra a movimentação</h4>
            <p>
              Na
              <strong>Área do Investidor</strong>
              da B3, vá em
              <strong>Extratos &rarr; Movimentação</strong>
              .
            </p>
            <img
              src="/img/b3/b3-extratos-movimentacao.png"
              alt="Área do Investidor da B3: Extratos, aba Movimentação, botões Filtrar e Baixar"
            />
          </div>
        </li>

        <li class="b3-guide__step">
          <span class="b3-guide__number">2</span>
          <div class="b3-guide__content">
            <h4>Filtre pelo ano</h4>
            <p>
              Clique em
              <strong>Filtrar</strong>
              , escolha o período do ano e
              <template v-if="isDividends">
                <strong>não</strong>
                marque “Compra e venda” (ou marque apenas os tipos de provento:
                Dividendo, Juros Sobre Capital Próprio e Rendimento).
              </template>
              <template v-else>
                marque o tipo de movimentação
                <strong>Compra e venda</strong>
                .
              </template>
            </p>
            <img
              v-if="!isDividends"
              class="b3-guide__image--narrow"
              src="/img/b3/b3-filtro-movimentacao.png"
              alt="Filtros da Movimentação na B3 com Compra e venda selecionado"
            />
          </div>
        </li>

        <li class="b3-guide__step">
          <span class="b3-guide__number">3</span>
          <div class="b3-guide__content">
            <h4>Baixe e envie</h4>
            <p>
              Clique em
              <strong>Baixar</strong>
              , escolha o formato Excel (.xlsx) e envie o arquivo nesta página.
            </p>
          </div>
        </li>
      </ol>
    </div>

    <template #footer>
      <button
        type="button"
        class="b3-guide__close"
        @click="$emit('close')"
      >
        Entendi
      </button>
    </template>
  </ConfirmationModal>
</template>

<script setup>
import { computed } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  variant: {
    type: String,
    default: 'portfolio',
    validator: value => ['portfolio', 'dividends'].includes(value)
  }
})

const isDividends = computed(() => props.variant === 'dividends')

defineEmits(['close'])
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
