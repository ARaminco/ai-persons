<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

// Import Layout Components
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

// Import Tab Components
import IdentityForm from './components/CharacterTabs/IdentityForm.vue'
import FamilyTree from './components/CharacterTabs/FamilyTree.vue'
import PhysicalForm from './components/CharacterTabs/PhysicalForm.vue'
import PsychologyForm from './components/CharacterTabs/PsychologyForm.vue'
import VoiceForm from './components/CharacterTabs/VoiceForm.vue'
import MovementForm from './components/CharacterTabs/MovementForm.vue'
import HealthForm from './components/CharacterTabs/HealthForm.vue'

// Import Modal Components
import ApiKeyModal from './components/modals/ApiKeyModal.vue'
import SpouseModal from './components/modals/SpouseModal.vue'
import ChildModal from './components/modals/ChildModal.vue'

// Import Services and Data
import { i18n } from './services/locales/fa.json'
import { schema } from './services/characterGenerator.js'
import { randomizeCharacter, generateBio } from './services/characterGenerator.js'
import { generateImage } from './services/aiService.js'
import { Faker, en, fa } from '@faker-js/faker'

// --- Reactive State ---
const locale = ref('fa')
const activeTab = ref('identity')
const fakers = reactive({})
const form = ref({})
const output = ref('')
const copyStatus = ref('copy')

const ai = reactive({
  enabled: false,
  provider: 'openai',
  key: null,
  generating: false,
  imageUrl: '',
  error: null,
})

const temp = reactive({
  editingSpouse: null,
  editingChild: null,
  editingChildIndex: null,
})

// --- Modals ---
let aiApiModal = null
let spouseModal = null
let childModal = null

// --- Lifecycle Hooks ---
onMounted(() => {
  aiApiModal = new bootstrap.Modal(document.getElementById('aiApiModal'))
  spouseModal = new bootstrap.Modal(document.getElementById('spouseModal'))
  childModal = new bootstrap.Modal(document.getElementById('childModal'))

  ai.key = localStorage.getItem('ai_api_key')
  ai.provider = localStorage.getItem('ai_provider') || 'openai'
  ai.enabled = !!ai.key

  fakers.en = new Faker({ locale: en })
  fakers.fa = new Faker({ locale: [fa, en] })

  generateNewCharacter(false)
})

// --- Methods ---
const t = (key) => {
  const translation = i18n[locale.value] && i18n[locale.value][key]
  return translation || key.replace(/_hair|_eye/g, '')
}

const buildOutput = () => {
  try {
    const cleanForm = JSON.parse(JSON.stringify(form.value))
    if (cleanForm.identity && cleanForm.identity.is_alive) {
      cleanForm.identity.dod = null
    }
    output.value = JSON.stringify(cleanForm, null, 2)
  } catch (error) {
    console.error('Failed to build JSON output:', error)
    output.value = 'Error generating JSON.'
  }
}

const generateNewCharacter = async (generateWithAi = true) => {
  if (ai.generating) return
  if (ai.enabled && !ai.key) {
    aiApiModal.show()
    return
  }

  ai.generating = ai.enabled && generateWithAi
  ai.imageUrl = ''
  ai.error = null

  form.value = randomizeCharacter(fakers, schema, locale.value)

  const bio = generateBio(form.value, locale.value, t)
  form.value.identity.description = bio
  form.value.health.bio = bio

  buildOutput()

  if (ai.enabled && ai.key && generateWithAi) {
    try {
      ai.imageUrl = await generateImage(ai.key, ai.provider, form.value, locale.value, t)
    } catch (error) {
      console.error(error)
      ai.error = error.message
    }
  }
  ai.generating = false
}

const toggleAi = () => {
  if (ai.enabled && !ai.key) {
    aiApiModal.show()
  }
  if (!ai.enabled) {
    ai.imageUrl = ''
    ai.error = null
  }
}

const saveApiKey = (newKey) => {
  if (newKey) {
    ai.key = newKey
    localStorage.setItem('ai_api_key', ai.key)
    localStorage.setItem('ai_provider', ai.provider)
    ai.enabled = true
    aiApiModal.hide()
    ai.error = null
  }
}

const removeApiKey = () => {
  localStorage.removeItem('ai_api_key')
  localStorage.removeItem('ai_provider')
  ai.key = null
  ai.enabled = false
  aiApiModal.hide()
}

const openSpouseModal = () => {
  temp.editingSpouse = JSON.parse(
    JSON.stringify(form.value.family.spouse || { name: '', dob: '', status: 'alive' }),
  )
  spouseModal.show()
}

const saveSpouse = () => {
  form.value.family.spouse = { ...temp.editingSpouse }
  spouseModal.hide()
  buildOutput()
}

const removeSpouse = () => {
  form.value.family.spouse = null
  spouseModal.hide()
  buildOutput()
}

const openChildModal = (child = null, index = null) => {
  temp.editingChildIndex = index
  temp.editingChild = JSON.parse(
    JSON.stringify(child || { name: '', gender: 'male', dob: '', status: 'alive' }),
  )
  childModal.show()
}

const saveChild = () => {
  if (temp.editingChildIndex !== null) {
    form.value.family.children[temp.editingChildIndex] = { ...temp.editingChild }
  } else {
    form.value.family.children.push({ ...temp.editingChild })
  }
  childModal.hide()
  buildOutput()
}

const removeChild = (index) => {
  form.value.family.children.splice(index, 1)
  buildOutput()
}

watch(locale, (newLocale) => {
  document.title = t('page_title')
  if (form.value.identity) {
    const bio = generateBio(form.value, newLocale, t)
    form.value.identity.description = bio
    form.value.health.bio = bio
  }
  buildOutput()
})

onMounted(() => {
  document.title = t('page_title')
})
</script>

<template>
  <div class="main-layout">
    <Sidebar
      :ai="ai"
      :output="output"
      :copy-status="copyStatus"
      :t="t"
      @open-ai-modal="aiApiModal.show()"
    />

    <div class="main-content">
      <Header
        v-model:locale="locale"
        :ai="ai"
        :t="t"
        @toggle-ai="toggleAi"
        @generate-new-character="generateNewCharacter"
      />

      <main>
        <ul class="nav nav-tabs" role="tablist">
          <li v-for="(tabSchema, tabKey) in schema" :key="tabKey" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === tabKey }"
              @click="activeTab = tabKey"
            >
              {{ t(tabKey) }}
            </button>
          </li>
        </ul>

        <div class="tab-content pt-4">
          <div v-show="activeTab === 'identity'">
            <IdentityForm
              v-if="form.identity"
              v-model:formPart="form.identity"
              :schema="schema.identity"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'family'">
            <FamilyTree
              v-if="form.family"
              v-model:familyData="form.family"
              :schema="schema.family"
              :t="t"
              @edit-spouse="openSpouseModal"
              @add-child="openChildModal(null, null)"
              @edit-child="openChildModal"
              @remove-child="removeChild"
            />
          </div>
          <div v-show="activeTab === 'physical'">
            <PhysicalForm
              v-if="form.physical"
              v-model:formPart="form.physical"
              :schema="schema.physical"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'psychology'">
            <PsychologyForm
              v-if="form.psychology"
              v-model:formPart="form.psychology"
              :schema="schema.psychology"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'voice'">
            <VoiceForm
              v-if="form.voice"
              v-model:formPart="form.voice"
              :schema="schema.voice"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'movement'">
            <MovementForm
              v-if="form.movement"
              v-model:formPart="form.movement"
              :schema="schema.movement"
              :t="t"
            />
          </div>
          <div v-show="activeTab === 'health'">
            <HealthForm
              v-if="form.health"
              v-model:formPart="form.health"
              :schema="schema.health"
              :t="t"
            />
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Modals -->
  <ApiKeyModal :ai="ai" :t="t" @save="saveApiKey" @remove="removeApiKey" />
  <SpouseModal
    v-if="temp.editingSpouse"
    v-model:spouse="temp.editingSpouse"
    :t="t"
    @save="saveSpouse"
    @remove="removeSpouse"
  />
  <ChildModal v-if="temp.editingChild" v-model:child="temp.editingChild" :t="t" @save="saveChild" />
</template>
