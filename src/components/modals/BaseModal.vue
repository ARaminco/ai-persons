<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: String,
})
const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Close modal on escape key press
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onEscape)
    } else {
      window.removeEventListener('keydown', onEscape)
    }
  },
)

const onEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        @click="close"
        aria-hidden="true"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="w-full max-w-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl shadow-xl border-0"
          @click.stop
        >
          <div
            class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700"
          >
            <h5 class="font-bold text-lg">{{ title }}</h5>
            <button
              @click="close"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="p-6">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="p-4 border-t border-slate-200 dark:border-slate-700">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
