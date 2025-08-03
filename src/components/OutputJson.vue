<script setup>
defineProps({
  outputText: String,
  copyStatus: String,
  t: Function,
})

const emit = defineEmits(['copy', 'download'])
</script>

<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h2 class="fs-6 m-0">{{ t('output_json') }}</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="emit('copy')">
          <i class="bi bi-clipboard me-1"></i>
          <span>{{ t(copyStatus) }}</span>
        </button>
        <button class="btn btn-success btn-sm" @click="emit('download')">
          <i class="bi bi-download me-1"></i>
          <span>{{ t('download') }}</span>
        </button>
      </div>
    </div>
    <div class="card-body p-0">
      <pre>{{ outputText }}</pre>
    </div>
  </div>
</template>

<style scoped>
/* No specific styles needed here as they are handled globally */
</style>
