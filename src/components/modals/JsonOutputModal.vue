<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  modelValue: Boolean,
  t: Function,
  jsonString: String,
  copyStatus: String, // Add copyStatus to props
})

const emit = defineEmits(['update:modelValue', 'copy'])

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :model-value="modelValue" :title="t('output_json')" @update:model-value="close">
    <div class="relative h-96">
      <pre
        class="w-full h-full p-4 rounded-xl bg-slate-200 dark:bg-slate-900/50 overflow-auto text-xs font-mono"
        >{{ jsonString }}</pre
      >
    </div>

    <template #footer>
      <div class="flex justify-end items-center">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          @click="$emit('copy')"
        >
          <i class="bi" :class="copyStatus === 'copy' ? 'bi-clipboard' : 'bi-check-lg'"></i>
          {{ t(copyStatus) }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
