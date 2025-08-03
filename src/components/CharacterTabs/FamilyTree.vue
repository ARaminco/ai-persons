<script setup>
const props = defineProps({
  formPart: Object,
  familyData: Object,
  schema: Array,
  isMarried: Boolean,
  t: Function,
  getAge: Function,
})
const emit = defineEmits([
  'update:formPart',
  'edit-spouse',
  'add-child',
  'edit-child',
  'remove-child',
])

const updateField = (key, value) => {
  emit('update:formPart', { ...props.formPart, [key]: value })
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h3 class="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">
        {{ t('parents') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
            t('father_name')
          }}</label>
          <input
            type="text"
            :value="familyData.father_name"
            @input="updateField('father_name', $event.target.value)"
            class="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
            t('father_status')
          }}</label>
          <select
            :value="familyData.father_status"
            @change="updateField('father_status', $event.target.value)"
            class="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="alive">{{ t('alive') }}</option>
            <option value="deceased">{{ t('deceased') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
            t('mother_name')
          }}</label>
          <input
            type="text"
            :value="familyData.mother_name"
            @input="updateField('mother_name', $event.target.value)"
            class="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{{
            t('mother_status')
          }}</label>
          <select
            :value="familyData.mother_status"
            @change="updateField('mother_status', $event.target.value)"
            class="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="alive">{{ t('alive') }}</option>
            <option value="deceased">{{ t('deceased') }}</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <div
        class="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-6"
      >
        <h3 class="text-lg font-bold">{{ t('spouse') }}</h3>
        <button
          v-if="isMarried"
          @click="$emit('edit-spouse')"
          class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          {{ familyData.spouse ? t('edit') : t('add') }}
        </button>
      </div>
      <div
        v-if="familyData.spouse"
        class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm"
      >
        <p>
          <strong>{{ t('name') }}:</strong> {{ familyData.spouse.name }}
        </p>
        <p>
          <strong>{{ t('dob') }}:</strong> {{ familyData.spouse.dob }} ({{ t('age') }}
          {{ getAge(familyData.spouse.dob) }})
        </p>
        <p>
          <strong>{{ t('status') }}:</strong> {{ t(familyData.spouse.status) }}
        </p>
      </div>
      <p v-else-if="isMarried" class="text-slate-500 text-sm">{{ t('no_spouse_data') }}</p>
    </div>

    <div>
      <div
        class="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-6"
      >
        <h3 class="text-lg font-bold">
          {{ t('children') }} ({{ familyData.children?.length || 0 }})
        </h3>
        <button
          v-if="isMarried"
          @click="$emit('add-child')"
          class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          {{ t('add_child') }}
        </button>
      </div>
      <div v-if="familyData.children?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(child, index) in familyData.children"
          :key="index"
          class="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg relative"
        >
          <h4 class="font-bold mb-2">{{ child.name }}</h4>
          <div class="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <p>
              <strong>{{ t('gender') }}:</strong> {{ t(child.gender) }}
            </p>
            <p>
              <strong>{{ t('dob') }}:</strong> {{ child.dob }} ({{ t('age') }}
              {{ getAge(child.dob) }})
            </p>
            <p>
              <strong>{{ t('status') }}:</strong> {{ t(child.status) }}
            </p>
          </div>
          <div class="absolute top-3 end-3 flex gap-2">
            <button
              @click="$emit('edit-child', child, index)"
              class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button
              @click="$emit('remove-child', index)"
              class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-slate-500 text-sm">{{ t('no_children_data') }}</p>
    </div>
  </div>
</template>
