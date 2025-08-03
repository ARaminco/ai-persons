<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import AIPortrait from './AIPortrait.vue'
import OutputJson from './OutputJson.vue'

defineProps({
  ai: Object,
  output: String,
  copyStatus: String,
  t: Function,
})

const emit = defineEmits(['open-ai-modal', 'update:copy-status'])

const copyJSON = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    emit('update:copy-status', 'copied')
    setTimeout(() => {
      emit('update:copy-status', 'copy')
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const downloadJSON = (text, filename) => {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="app-title">
        <i class="bi bi-person-bounding-box text-primary"></i>
        <span class="ms-2">{{ t('app_title') }}</span>
      </h1>
    </div>

    <div class="sidebar-content">
      <AIPortrait v-if="ai.enabled" :ai="ai" :t="t" @open-settings="emit('open-ai-modal')" />

      <OutputJson
        :output-text="output"
        :copy-status="copyStatus"
        :t="t"
        @copy="copyJSON(output)"
        @download="downloadJSON(output, 'character')"
      />
    </div>
  </aside>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
