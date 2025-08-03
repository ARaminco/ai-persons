<script setup>
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  modelValue: Boolean, // Controls visibility
  ai: Object,
  t: Function,
})

const emit = defineEmits(['update:modelValue', 'save', 'remove'])

const localApiKey = ref('')

watch(
  () => props.ai.key,
  (newKey) => {
    localApiKey.value = newKey || ''
  },
  { immediate: true },
)

const saveKey = () => {
  emit('save', localApiKey.value)
  close()
}

const removeKey = () => {
  localApiKey.value = ''
  emit('remove')
}

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :model-value="modelValue" :title="t('ai_settings')" @update:model-value="close">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('service_provider')
        }}</label>
        <select
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3"
          disabled
        >
          <option value="openai">OpenAI (DALL-E 3)</option>
        </select>
      </div>
      <div>
        <label
          for="apiKeyInput"
          class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400"
          >API Key</label
        >
        <input
          id="apiKeyInput"
          type="password"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3"
          v-model="localApiKey"
          placeholder="sk-..."
        />
      </div>
      <p class="text-xs text-slate-500">{{ t('api_key_storage_notice') }}</p>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-400/20"
          @click="removeKey"
        >
          {{ t('remove_key') }}
        </button>
        <div class="flex gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            @click="close"
          >
            {{ t('cancel') }}
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
            @click="saveKey"
          >
            {{ t('save_key') }}
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
