<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  modelValue: Boolean, // For v-model
  spouse: Object,
  t: Function,
})

const emit = defineEmits(['update:modelValue', 'update:spouse', 'save', 'remove'])

const close = () => {
  emit('update:modelValue', false)
}

const onSave = () => {
  emit('save')
  close()
}

const onRemove = () => {
  emit('remove')
  close()
}
</script>

<template>
  <BaseModal :model-value="modelValue" :title="t('edit_spouse')" @update:model-value="close">
    <div class="space-y-4" v-if="spouse">
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('name')
        }}</label>
        <input
          type="text"
          :value="spouse.name"
          @input="$emit('update:spouse', { ...spouse, name: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('dob')
        }}</label>
        <input
          type="date"
          :value="spouse.dob"
          @input="$emit('update:spouse', { ...spouse, dob: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('status')
        }}</label>
        <select
          :value="spouse.status"
          @input="$emit('update:spouse', { ...spouse, status: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="alive">{{ t('alive') }}</option>
          <option value="deceased">{{ t('deceased') }}</option>
        </select>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-400/20"
          @click="onRemove"
        >
          {{ t('delete') }}
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
            @click="onSave"
          >
            {{ t('save') }}
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
