<script setup>
import BaseInput from '../BaseInput.vue'

const props = defineProps({
  formPart: Object,
  schema: Array,
  t: Function,
})

const emit = defineEmits(['update:formPart'])

const updateField = (key, value) => {
  // Use a temporary object to ensure reactivity on nested properties
  const updatedPart = { ...props.formPart, [key]: value }
  emit('update:formPart', updatedPart)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="field in schema"
      :key="field.key"
      :class="{ 'md:col-span-2 lg:col-span-3': field.type === 'textarea' }"
    >
      <label
        class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400"
        :for="field.key"
      >
        {{ t(field.label) }}
      </label>
      <BaseInput
        :id="field.key"
        :field="field"
        :model-value="formPart[field.key]"
        :t="t"
        @update:modelValue="updateField(field.key, $event)"
      />
    </div>
  </div>
</template>
