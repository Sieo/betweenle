<script setup lang="ts">
import { useStatistiqueStore } from '@/stores/scores'
import { onMounted, ref } from 'vue'
import Stats from '../components/Stats.vue'
import { useDictionnaireStore } from '../stores/dictionnaire.js'

const store = useDictionnaireStore()

const upperWord = ref('aaaaa')
const underWord = ref('zzzzz')
const wordToFind = ref(store.getMotRandom().toLowerCase())
const wordToTest = ref('')
const wordFound = ref(false)
const formErrors = ref('')

const tentative = ref(['', '', '', '', ''])
const inputs = ref<HTMLInputElement[]>([])
const mauvaisesTentatives = ref<string[]>([])
const nombreDessais = ref(0)
const index = ref(0)
const statsStore = useStatistiqueStore()

onMounted(() => {
  wordFound.value = statsStore.hasPlayedToday()
  if (wordFound.value) {
    tentative.value = wordToFind.value.split('')
    statsStore.popupOpen = true
  }
})

function positionWord() {
  if (nombreDessais.value === 15) {
    tentative.value = wordToFind.value.split('')
    wordFound.value = true
    statsStore.addTodayScore(nombreDessais.value)
    return
  }
  wordToTest.value = tentative.value.join('').toLowerCase()
  wordFound.value = foundWord()
  if (mauvaisesTentatives.value.findIndex(w => w === wordToTest.value) !== -1) {
    formErrors.value = 'Le mot a déjà été tenté !'
    reset()
    return
  }
  mauvaisesTentatives.value.push(wordToTest.value)
  if (wordFound.value) {
    tentative.value = wordToFind.value.split('')
    statsStore.addTodayScore(nombreDessais.value)
    displayStats()
    return
  }
  if (!isInRange(upperWord.value, underWord.value)) {
    formErrors.value = 'Le mot doit être compris entre les mots affichés'
  } else {
    nombreDessais.value++
    formErrors.value = ''
    if (isGreater()) {
      upperWord.value = wordToTest.value.toLowerCase()
    } else {
      underWord.value = wordToTest.value.toLowerCase()
    }
  }
  reset()
}

function reset() {
  wordToTest.value = ''
  tentative.value = ['', '', '', '', '']
  inputs.value[0].focus()
}

// Gestion des entrées
function onInput(index: number) {
  tentative.value[index] = tentative.value[index].slice(0, 1)

  if (tentative.value[index] && index < 4) {
    inputs.value[index + 1].focus()
    setIndex(index + 1)
  }

  if (tentative.value.every(c => c !== '')) {
    positionWord()
    setIndex(0)
  }
}

function onBackspace(index: number) {
  if (tentative.value[index]) {
    tentative.value[index] = ''
  }
  if (index > 0) {
    inputs.value[index - 1].focus()
  }
}

function foundWord() {
  return wordToFind.value === wordToTest.value
}

function isGreater() {
  return wordToTest.value.localeCompare(wordToFind.value, 'fr') < 0
}

function isInRange(a: string, b: string) {
  return (
    wordToTest.value.localeCompare(a, 'fr') > 0 &&
    wordToTest.value.localeCompare(b, 'fr') < 0
  )
}
function displayStats() {
  statsStore.popupOpen = true
}
function displayChars(letter: string) {
  if (upperWord.value[index.value] > underWord.value[index.value]) {
    return false
  }
  return (
    store.counter(letter.toLowerCase(), [
      upperWord.value[index.value],
      underWord.value[index.value],
    ]) !== 1
  )
}
function setIndex(i: number) {
  index.value = i
}
</script>

<template>
  <main class="main-content">
    <h1>Bonjour !</h1>
    <h2>Bienvenue dans le Beetweenle</h2>
    <p>
      Le but du jeu est de trouver le mot mystère compris entre les deux mots.
    </p>
    <p>Vous avez jusqu'a 15 tentatives pour trouver le mot mystère</p>
    <div class="nb-tentatives">Tentative : {{ nombreDessais + 1 }} / 15</div>
    <section class="tentatives">
      <div v-for="_ of nombreDessais">
        <div class="bubble"></div>
      </div>
    </section>
    <section>
      <div class="flex-column center">
        Le mot est compris entre
        <div class="word">
          <div v-for="letter of upperWord" class="letter upper-word">
            {{ letter }}
          </div>
        </div>
        <div class="word">
          <input
            v-for="(_, i) in tentative"
            :key="i"
            v-model="tentative[i]"
            @input="onInput(i)"
            @keydown.backspace.prevent="onBackspace(i)"
            v-on:click="setIndex(i)"
            maxlength="1"
            :disabled="wordFound"
            class="letter uppercase"
            ref="inputs"
          />
        </div>
        <div class="word">
          <div v-for="letter of underWord" class="letter under-word">
            {{ letter }}
          </div>
        </div>

        Lettres disponibles :
        <div class="word">
          <div
            v-for="letter of store.alphabet"
            class="letter alphabet"
            :class="{ disabled: displayChars(letter) }"
          >
            {{ letter }}
          </div>
        </div>
      </div>
    </section>
    <h2 v-if="formErrors" class="error">
      {{ formErrors }}
    </h2>
    <h2 v-if="wordFound && nombreDessais < 15" class="congrats">
      Félicitations ! Vous avez trouvé le mot !
    </h2>
    <h2 v-if="wordFound && nombreDessais === 15" class="failed">
      La prochaine fois sera la bonne !
    </h2>
    <button class="display" v-on:click="displayStats()">
      Afficher les statistiques
    </button>
  </main>
  <Stats v-if="statsStore.popupOpen" />
</template>

<style scoped>
.nb-tentatives {
  margin-top: 12px;
  margin-bottom: 12px;
  text-decoration: underline;
  font-weight: 600;
}
.tentatives {
  display: flex;
  gap: 6px;
  .bubble {
    height: 8px;
    width: 8px;
    border: 1px solid rgb(52, 52, 150);
    background-color: rgb(52, 52, 150);
    border-radius: 50%;
  }
}
.uppercase {
  text-transform: uppercase;
  font-weight: 600;
  padding-left: 5px;
  font-size: 1.5rem;
}

.letter {
  height: 38px;
  width: 32px;
  padding-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.word {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  margin-top: 8px;

  div {
    color: #fffcfc;
    font-size: 1.5em;
  }
  .find-word {
    border: 1px solid #084f6b;
    background-color: #114486;
  }
  .upper-word {
    border: 1px solid #086b1d;
    background-color: #118634;
  }
  .under-word {
    border: 1px solid #6b080d;
    background-color: #861111;
  }
  .alphabet {
    border: rgb(117, 112, 112);
    background-color: rgb(117, 112, 112);
  }
  .alphabet.disabled {
    opacity: 0.5;
  }
}

.upper-word {
  color: green;
  font-size: 1.5rem;
}

.under-word {
  color: rgb(177, 16, 16);
  font-size: 1.5rem;
}

.congrats {
  color: green;
  font-size: 2rem;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.center {
  align-items: center;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.display {
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid;
  transition: all 0.5s ease-in-out;
}
.display:hover {
  background-color: orange;
  transition: all 0.5s ease-in-out;
}
</style>
