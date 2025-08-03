<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { Faker, en, fa } from '@faker-js/faker'

// Import Services & Data
import { randomizeCharacter, schema } from './services/characterGenerator.js'
import { generateImage } from './services/aiService.js'
import faTranslations from './services/locales/fa.json'
import enTranslations from './services/locales/en.json'

// Import ALL refactored components
import IdentityForm from './components/CharacterTabs/IdentityForm.vue'
import FamilyTree from './components/CharacterTabs/FamilyTree.vue'
import PhysicalForm from './components/CharacterTabs/PhysicalForm.vue'
import PsychologyForm from './components/CharacterTabs/PsychologyForm.vue'
import VoiceForm from './components/CharacterTabs/VoiceForm.vue'
import MovementForm from './components/CharacterTabs/MovementForm.vue'
import HealthForm from './components/CharacterTabs/HealthForm.vue'
import ApiKeyModal from './components/modals/ApiKeyModal.vue'
import SpouseModal from './components/modals/SpouseModal.vue'
import ChildModal from './components/modals/ChildModal.vue'

// --- THEME & LANGUAGE ---
const locale = ref('en')
const theme = ref('light')

// --- HELPER FUNCTIONS ---
// Corrected and simplified function to initialize the form structure
function createEmptyForm() {
  const form = {}
  for (const sectionKey in schema) {
    form[sectionKey] = {}
    const sectionSchema = schema[sectionKey]
    if (Array.isArray(sectionSchema)) {
      // Handles sections like identity, physical, etc.
      sectionSchema.forEach((field) => {
        form[sectionKey][field.key] = field.default ?? (field.type === 'array' ? [] : '')
      })
    } else {
      // Handles sections with object structure like psychology
      for (const fieldKey in sectionSchema) {
        const field = sectionSchema[fieldKey]
        form[sectionKey][fieldKey] =
          field.default ?? (field.type === 'array' || field.type === 'traits' ? [] : '')
      }
    }
  }
  // Manually set complex data structures not covered by simple fields
  form.family.spouse = null
  form.family.children = []
  return form
}

// --- CORE STATE ---
const activeTab = ref('identity')
const form = ref(createEmptyForm())
const ai = reactive({ key: null, provider: 'openai', generating: false, imageUrl: '', error: null })
const copyStatus = ref('copy')
const temp = reactive({ editingSpouse: null, editingChild: null, editingChildIndex: null })

// --- MODAL STATE ---
const isApiKeyModalOpen = ref(false)
const isSpouseModalOpen = ref(false)
const isChildModalOpen = ref(false)

const fakers = { en: new Faker({ locale: en }), fa: new Faker({ locale: [fa, en] }) }
const i18n = { fa: faTranslations, en: enTranslations }

// --- TRANSLATION & UTILITIES ---
const t = (key) => i18n[locale.value]?.[key] || key.replace(/_/g, ' ')
const getAge = (dob) => {
  if (!dob) return 0
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

// --- CORE LOGIC ---
const generateNewCharacter = () => {
  form.value = randomizeCharacter(fakers, schema, locale.value)
  ai.imageUrl = ''
  ai.error = null
}

const generateAiPortrait = async () => {
  if (!ai.key) {
    isApiKeyModalOpen.value = true
    return
  }
  ai.generating = true
  ai.error = null
  try {
    const imageUrl = await generateImage(ai.key, ai.provider, form.value, locale.value, t)
    ai.imageUrl = imageUrl
  } catch (error) {
    console.error(error)
    ai.error = error.message
  } finally {
    ai.generating = false
  }
}

const copyJSON = async () => {
  if (!navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(outputJson.value)
    copyStatus.value = 'copied'
    setTimeout(() => {
      copyStatus.value = 'copy'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy JSON: ', err)
  }
}

// --- MODAL HANDLERS ---
const saveApiKey = (newKey) => {
  ai.key = newKey
  localStorage.setItem('ai_api_key', ai.key)
}
const removeApiKey = () => {
  ai.key = null
  localStorage.removeItem('ai_api_key')
}
const openSpouseModal = () => {
  temp.editingSpouse = JSON.parse(
    JSON.stringify(form.value.family.spouse || { name: '', dob: '', status: 'alive' }),
  )
  isSpouseModalOpen.value = true
}
const saveSpouse = () => {
  form.value.family.spouse = { ...temp.editingSpouse }
}
const removeSpouse = () => {
  form.value.family.spouse = null
}
const openChildModal = (child = null, index = null) => {
  temp.editingChildIndex = index
  temp.editingChild = JSON.parse(
    JSON.stringify(child || { name: '', gender: 'male', dob: '', status: 'alive' }),
  )
  isChildModalOpen.value = true
}
const saveChild = () => {
  if (temp.editingChildIndex !== null) {
    form.value.family.children[temp.editingChildIndex] = { ...temp.editingChild }
  } else {
    form.value.family.children.push({ ...temp.editingChild })
  }
}
const removeChild = (index) => {
  form.value.family.children.splice(index, 1)
}

// --- LIFECYCLE & WATCHERS ---
const toggleTheme = () => (theme.value = theme.value === 'light' ? 'dark' : 'light')

watch(
  theme,
  (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  },
  { immediate: true },
)

watch(
  locale,
  (newLocale) => {
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === 'fa' ? 'rtl' : 'ltr'
    document.title = t('page_title')
  },
  { immediate: true },
)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) theme.value = savedTheme
  ai.key = localStorage.getItem('ai_api_key')
  generateNewCharacter()
})

const outputJson = computed(() => {
  try {
    const cleanForm = JSON.parse(JSON.stringify(form.value))
    if (cleanForm.identity?.is_alive) delete cleanForm.identity.dod
    return JSON.stringify(cleanForm, null, 2)
  } catch (e) {
    return 'Error generating JSON...'
  }
})
</script>

<template>
  <div
    class="font-vazir bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen"
  >
    <div class="flex flex-col lg:flex-row">
      <aside
        class="w-full lg:w-[480px] lg:h-screen lg:sticky top-0 p-6 sm:p-8 flex flex-col gap-8 border-b lg:border-b-0 lg:border-e dark:lg:border-s border-slate-200 dark:border-slate-800"
      >
        <div class="flex-shrink-0 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            <span class="text-indigo-500">AI</span> Persons
          </h1>
          <div class="flex items-center gap-4">
            <select
              v-model="locale"
              class="bg-transparent text-sm font-semibold rounded-md focus:ring-2 focus:ring-indigo-500 border-none cursor-pointer"
            >
              <option value="fa">🇮🇷 FA</option>
              <option value="en">🇬🇧 EN</option>
            </select>
            <button
              @click="toggleTheme"
              aria-label="Toggle theme"
              class="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <i
                class="bi text-lg"
                :class="theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'"
              ></i>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold">{{ t('ai_generated_portrait') }}</h2>
            <button
              @click="isApiKeyModalOpen = true"
              class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {{ t('ai_settings') }}
            </button>
          </div>
          <div
            class="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden relative shadow-inner"
          >
            <div v-if="ai.generating" class="flex flex-col items-center gap-2 text-slate-500">
              <svg
                class="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ t('generating_image') }}</span>
            </div>
            <img
              v-else-if="ai.imageUrl"
              :src="ai.imageUrl"
              class="w-full h-full object-cover"
              alt="AI Portrait"
            />
            <div v-else class="text-center text-slate-500 dark:text-slate-400 p-4">
              <i class="bi bi-image-alt text-4xl"></i>
              <p class="mt-2 text-sm">{{ ai.error || t('image_will_appear_here') }}</p>
            </div>
          </div>
          <button
            @click="generateAiPortrait"
            :disabled="!form.identity?.name || ai.generating"
            class="w-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/80 dark:disabled:bg-slate-700 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <i class="bi bi-stars"></i>
            <span>{{ t('generate_portrait') }}</span>
          </button>
        </div>

        <div class="flex-grow flex flex-col min-h-0">
          <h2 class="text-lg font-bold mb-4">{{ t('output_json') }}</h2>
          <div class="relative flex-grow">
            <pre
              class="w-full h-full p-4 rounded-xl bg-slate-200 dark:bg-slate-800/50 overflow-auto text-xs font-mono"
              >{{ outputJson }}</pre
            >
            <button
              @click="copyJSON"
              class="absolute top-2 end-2 text-slate-500 hover:text-indigo-500 p-2 rounded-md transition-colors"
              aria-label="Copy JSON"
            >
              <i class="bi" :class="copyStatus === 'copy' ? 'bi-clipboard' : 'bi-check-lg'"></i>
            </button>
          </div>
        </div>
      </aside>

      <main class="flex-1 p-6 sm:p-8">
        <header
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
            {{ t('character_sheet') }}
          </h2>
          <button
            @click="generateNewCharacter"
            class="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <i class="bi bi-shuffle"></i>
            <span>{{ t('randomize') }}</span>
          </button>
        </header>

        <div class="border-b border-slate-200 dark:border-slate-700">
          <nav class="flex -mb-px gap-x-6 overflow-x-auto" aria-label="Tabs">
            <button
              v-for="(_, tabKey) in schema"
              :key="tabKey"
              @click="activeTab = tabKey"
              :class="[
                activeTab === tabKey
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-200 dark:hover:border-slate-600',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none',
              ]"
            >
              {{ t(tabKey) }}
            </button>
          </nav>
        </div>

        <div class="py-8">
          <div v-show="activeTab === 'identity'">
            <IdentityForm
              v-if="form.identity"
              v-model:form-part="form.identity"
              :schema="schema.identity"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'family'">
            <FamilyTree
              v-if="form.family"
              v-model:formPart="form.family"
              :familyData="form.family"
              :schema="schema.family"
              :is-married="form.identity?.marital_status !== 'single'"
              :t="t"
              :getAge="getAge"
              @edit-spouse="openSpouseModal"
              @add-child="openChildModal(null, null)"
              @edit-child="openChildModal"
              @remove-child="removeChild"
            />
          </div>
          <div v-show="activeTab === 'physical'">
            <PhysicalForm
              v-if="form.physical"
              v-model:form-part="form.physical"
              :schema="schema.physical"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'psychology'">
            <PsychologyForm
              v-if="form.psychology"
              v-model:form-part="form.psychology"
              :schema="schema.psychology"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'voice'">
            <VoiceForm
              v-if="form.voice"
              v-model:form-part="form.voice"
              :schema="schema.voice"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'movement'">
            <MovementForm
              v-if="form.movement"
              v-model:form-part="form.movement"
              :schema="schema.movement"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'health'">
            <HealthForm
              v-if="form.health"
              v-model:form-part="form.health"
              :schema="schema.health"
              :t="t"
            />
          </div>
        </div>
      </main>
    </div>

    <ApiKeyModal
      v-model="isApiKeyModalOpen"
      :ai="ai"
      :t="t"
      @save="saveApiKey"
      @remove="removeApiKey"
    />
    <SpouseModal
      v-model="isSpouseModalOpen"
      v-if="temp.editingSpouse"
      v-model:spouse="temp.editingSpouse"
      :t="t"
      @save="saveSpouse"
      @remove="removeSpouse"
    />
    <ChildModal
      v-model="isChildModalOpen"
      v-if="temp.editingChild"
      v-model:child="temp.editingChild"
      :is-new="temp.editingChildIndex === null"
      :t="t"
      @save="saveChild"
    />
  </div>
</template>

<style>
/* Custom non-utility styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
