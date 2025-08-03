<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names
<script setup>
defineProps({
  locale: String,
  ai: Object,
  t: Function,
})

const emit = defineEmits(['update:locale', 'toggle-ai', 'generate-new-character'])

const onLocaleChange = (event) => {
  emit('update:locale', event.target.value)
}

const onGenerateClick = () => {
  emit('generate-new-character', true)
}

const onToggleAi = () => {
  // Emit event to be handled in App.vue
  emit('toggle-ai')
}
</script>

<template>
  <header class="content-header">
    <div class="d-flex flex-wrap align-items-center gap-3">
      <div class="form-check form-switch" :title="t('ai_generated_portrait')">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="aiToggle"
          :checked="ai.enabled"
          @change="onToggleAi"
        />
        <label class="form-check-label" for="aiToggle">AI</label>
      </div>
      <select
        class="form-select form-select-sm"
        :value="locale"
        @change="onLocaleChange"
        style="width: 140px"
      >
        <option value="fa">🇮🇷 فارسی</option>
        <option value="en">🇬🇧 English</option>
      </select>
    </div>
    <button class="btn btn-primary btn-lg" @click="onGenerateClick" :disabled="ai.generating">
      <span v-if="ai.generating" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <i v-else class="bi bi-stars"></i>
      <span class="ms-2">{{ ai.enabled ? t('generate_new_character') : t('randomize') }}</span>
    </button>
  </header>
</template>

<style scoped>
/* No specific styles needed here as they are handled globally */
</style>
