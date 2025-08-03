<script setup>
defineProps({
  ai: Object,
  t: Function,
})

const emit = defineEmits(['open-settings'])
</script>

<template>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="fs-6 m-0">{{ t('ai_generated_portrait') }}</h2>
      <button
        class="btn btn-sm btn-outline-secondary py-0 px-1"
        @click="emit('open-settings')"
        :title="t('ai_settings')"
      >
        <i class="bi bi-gear-fill"></i>
      </button>
    </div>
    <div class="card-body text-center p-2">
      <div v-if="ai.generating" class="image-placeholder">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted small mt-2 mb-0">{{ t('generating_image') }}</p>
      </div>

      <a v-else-if="!ai.generating && ai.imageUrl" :href="ai.imageUrl" target="_blank">
        <img :src="ai.imageUrl" class="img-fluid rounded shadow-sm" alt="AI Portrait" />
      </a>

      <div v-else class="image-placeholder text-muted">
        <i class="bi bi-image-alt fs-1"></i>
        <p class="mt-2 small">{{ ai.error ? ai.error : t('image_will_appear_here') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
