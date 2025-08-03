<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  modelValue: Boolean,
  child: Object,
  isNew: Boolean,
  t: Function,
})

const emit = defineEmits(['update:modelValue', 'update:child', 'save'])

const close = () => {
  emit('update:modelValue', false)
}

const onSave = () => {
  emit('save')
  close()
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="isNew ? t('add_child') : t('edit_child')"
    @update:model-value="close"
  >
    <div class="space-y-4" v-if="child">
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('name')
        }}</label>
        <input
          type="text"
          :value="child.name"
          @input="$emit('update:child', { ...child, name: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('gender')
        }}</label>
        <select
          :value="child.gender"
          @input="$emit('update:child', { ...child, gender: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="male">{{ t('male') }}</option>
          <option value="female">{{ t('female') }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('dob')
        }}</label>
        <input
          type="date"
          :value="child.dob"
          @input="$emit('update:child', { ...child, dob: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('status')
        }}</label>
        <select
          :value="child.status"
          @input="$emit('update:child', { ...child, status: $event.target.value })"
          class="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="alive">{{ t('alive') }}</option>
          <option value="deceased">{{ t('deceased') }}</option>
        </select>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end items-center">
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
