<script setup>
import { ref } from 'vue'

const props = defineProps({
  field: Object,
  modelValue: [String, Number, Boolean, Array],
  isAlive: {
    type: Boolean,
    default: true,
  },
  t: Function,
})

const emit = defineEmits(['update:modelValue'])

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

const onBooleanChange = (event) => {
  emit('update:modelValue', event.target.checked)
  // Logic to clear DOD is handled in App.vue watcher or method
}
</script>

<template>
  <div>
    <input
      v-if="field.type === 'string'"
      class="form-control"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <textarea
      v-if="field.type === 'textarea'"
      class="form-control"
      rows="4"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>

    <input
      v-if="field.type === 'date'"
      class="form-control"
      type="date"
      :value="modelValue"
      :disabled="field.key === 'dod' && isAlive"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <div v-if="field.type === 'boolean'" class="form-check form-switch pt-2">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        :checked="modelValue"
        @change="onBooleanChange"
      />
      <label class="form-check-label">{{ t(field.label) }}</label>
    </div>

    <select
      v-if="field.type === 'enum'"
      class="form-select"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ t('select_option') }}</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">{{ t(opt) }}</option>
    </select>

    <div v-if="field.type === 'number'" class="input-group">
      <input
        class="form-control"
        type="number"
        :value="modelValue"
        :min="field.min"
        :max="field.max"
        @input="$emit('update:modelValue', Number($event.target.value))"
      />
      <span v-if="field.suffix" class="input-group-text">{{ field.suffix }}</span>
    </div>

    <div v-if="field.type === 'array'">
      <div class="input-group mb-2">
        <input
          class="form-control"
          type="text"
          v-model="arrayInput"
          @keydown.enter.prevent="addArrayItem"
        />
        <button class="btn btn-outline-secondary" @click="addArrayItem">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      <div>
        <span v-for="(item, idx) in modelValue" :key="idx" class="tag-chip">
          <span>{{ item }}</span>
          <button type="button" class="btn-close" @click="removeArrayItem(idx)"></button>
        </span>
      </div>
    </div>
  </div>
</template>
