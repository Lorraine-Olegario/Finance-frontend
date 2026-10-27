<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="info"
    title="Como obter o relatório da B3"
    size="large"
    @close="$emit('close')"
  >
    <div class="b3-guide">
      <p class="b3-guide__intro">
        Importe suas compras e vendas a partir do relatório de movimentação da
        B3. Recomendamos importar
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
              , escolha o período do ano e marque o tipo de movimentação
              <strong>Compra e venda</strong>
              .
            </p>
            <img
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
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
