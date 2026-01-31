<template>
  <div class="filter-section">
    <label class="filter-label">
      <slot name="icon" />
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script>
  export default {
    name: "FilterSection",
    props: {
      label: { type: String, required: true },
    },
  };
</script>

<style scoped>
  .filter-section {
    margin-bottom: 1.25rem;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-label :deep(svg) {
    width: 14px;
    height: 14px;
    color: var(--primary);
  }
</style>
