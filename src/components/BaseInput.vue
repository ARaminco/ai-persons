<script setup>
import { ref } from 'vue'

const props = defineProps({
  field: Object,
  modelValue: [String, Number, Boolean, Array],
  t: Function,
})
const emit = defineEmits(['update:modelValue'])

const baseClasses =
  'w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors'

const arrayInput = ref('')
const addArrayItem = () => {
  const value = arrayInput.value.trim()
  if (!value) return
  const currentArray = props.modelValue || []
  if (!currentArray.includes(value)) {
    emit('update:modelValue', [...currentArray, value])
  }
  arrayInput.value = ''
}
const removeArrayItem = (index) => {
  const currentArray = [...props.modelValue]
  currentArray.splice(index, 1)
  emit('update:modelValue', currentArray)
}
</script>

<template>
  <div>
    <div v-if="['string', 'date', 'number'].includes(field.type)" class="relative">
      <input
        :type="field.type === 'string' ? 'text' : field.type"
        :class="baseClasses"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>

    <textarea
      v-if="field.type === 'textarea'"
      :class="baseClasses"
      rows="4"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>

    <select
      v-if="field.type === 'enum'"
      :class="baseClasses"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ t('select_option') }}</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">{{ t(opt) }}</option>
    </select>

    <label v-if="field.type === 'boolean'" class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" class="sr-only peer">
        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
        <span class="ms-3 text-sm font-medium">{{ t(field.label) }}</span>
    </label>



    <div v-if="field.type === 'array'">
      <div class="flex gap-2">
        <input
          type="text"
          v-model="arrayInput"
          @keydown.enter.prevent="addArrayItem"
          :class="baseClasses"
          :placeholder="t(field.label) + '...'"
        />
        <button
          @click="addArrayItem"
          class="flex-shrink-0 bg-indigo-500 text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      <div v-if="modelValue?.length" class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="(item, idx) in modelValue"
          :key="idx"
          class="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-sm rounded-full px-3 py-1"
        >
          {{ item }}
          <button
            @click="removeArrayItem(idx)"
            class="w-4 h-4 flex items-center justify-center bg-slate-400 dark:bg-slate-500 text-white rounded-full text-xs hover:bg-slate-500 dark:hover:bg-slate-400"
          >
            &times;
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
