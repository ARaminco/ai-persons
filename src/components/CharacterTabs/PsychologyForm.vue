<script setup>
import { ref } from 'vue'
import BaseInput from '../BaseInput.vue'

const props = defineProps({
  formPart: Object,
  schema: Object,
  t: Function,
})
const emit = defineEmits(['update:formPart'])

const customTrait = ref({ name: '', intensity: 50 })

const updateField = (key, value) => {
  emit('update:formPart', { ...props.formPart, [key]: value })
}

const toggleTrait = (traitName) => {
  const traits = [...(props.formPart.traits || [])] // Defensive check
  const index = traits.findIndex((t) => t.name === traitName)
  if (index > -1) {
    traits.splice(index, 1)
  } else {
    traits.push({ name: traitName, intensity: 60 })
  }
  updateField('traits', traits)
}

const addCustomTrait = () => {
  const name = customTrait.value.name.trim()
  if (!name) return

  const traits = [...(props.formPart.traits || [])] // Defensive check
  const index = traits.findIndex((t) => t.name === name)
  if (index > -1) {
    traits[index].intensity = customTrait.value.intensity
  } else {
    traits.push({ ...customTrait.value })
  }
  updateField('traits', traits)
  customTrait.value = { name: '', intensity: 50 }
}

const removeTrait = (index) => {
  const traits = [...(props.formPart.traits || [])] // Defensive check
  traits.splice(index, 1)
  updateField('traits', traits)
}

const updateTraitIntensity = (index, intensity) => {
  const traits = [...(props.formPart.traits || [])] // Defensive check
  traits[index].intensity = intensity
  updateField('traits', traits)
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('personality_type')
        }}</label>
        <select
          :value="formPart.personality_type"
          @change="updateField('personality_type', $event.target.value)"
          class="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="">—</option>
          <option v-for="opt in schema.personality_type.options" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">{{
          t('traits')
        }}</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="traitName in schema.traits.options"
            :key="traitName"
            @click="toggleTrait(traitName)"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="
              (formPart.traits || []).some((t) => t.name === traitName)
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            "
          >
            {{ t(traitName) }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{{
          t('add_custom_trait')
        }}</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            class="flex-grow bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            :placeholder="t('custom_trait_placeholder')"
            v-model="customTrait.name"
          />
          <div class="flex-shrink-0 flex items-center gap-2">
            <input
              class="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              type="range"
              min="0"
              max="100"
              step="5"
              v-model.number="customTrait.intensity"
            />
            <span class="text-xs font-mono text-slate-500 w-10 text-center"
              >{{ customTrait.intensity }}%</span
            >
            <button
              @click="addCustomTrait"
              class="flex-shrink-0 bg-indigo-500 text-white w-9 h-9 flex items-center justify-center rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div
          v-for="(trait, idx) in formPart.traits || []"
          :key="idx"
          class="flex items-center gap-4"
        >
          <strong class="w-28 text-sm font-semibold truncate">{{
            t(trait.name) || trait.name
          }}</strong>
          <input
            type="range"
            class="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
            min="0"
            max="100"
            step="5"
            :value="trait.intensity"
            @input="updateTraitIntensity(idx, Number($event.target.value))"
          />
          <span class="w-10 text-xs font-mono text-slate-500 text-end">{{ trait.intensity }}%</span>
          <button
            @click="removeTrait(idx)"
            class="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('values')
        }}</label>
        <BaseInput
          :field="{ type: 'array', label: 'add_value_placeholder' }"
          :model-value="formPart.values"
          :t="t"
          @update:modelValue="updateField('values', $event)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
          t('fears')
        }}</label>
        <BaseInput
          :field="{ type: 'array', label: 'add_fear_placeholder' }"
          :model-value="formPart.fears"
          :t="t"
          @update:modelValue="updateField('fears', $event)"
        />
      </div>
    </div>
  </div>
</template>
