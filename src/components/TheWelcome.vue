<script setup lang="ts">
import { ref } from 'vue'
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
const nombreDessais = ref(0)

function positionWord() {
  if (nombreDessais.value === 15) {
    tentative.value = wordToFind.value.split('')
    wordFound.value = true
    return
  }
  nombreDessais.value++
  // store.verifierExistenceMot(wordToTest.value)
  wordToTest.value = tentative.value.join('').toLowerCase()
  wordFound.value = foundWord()
  if (!isInRange(upperWord.value, underWord.value)) {
    formErrors.value = 'Le mot doit être compris entre les mots affichés'
  } else {
    formErrors.value = ''
    if (isGreater()) {
      upperWord.value = wordToTest.value.toLowerCase()
    } else {
      underWord.value = wordToTest.value.toLowerCase()
    }
  }
  wordToTest.value = ''
  tentative.value = ['', '', '', '', '']
  inputs.value[0].focus()
}

// Gestion des entrées
function onInput(index: number) {
  if (tentative.value[index].length > 1) {
    tentative.value[index] = tentative.value[index].slice(0, 1)
  }

  if (tentative.value[index] && index < 4) {
    inputs.value[index + 1].focus()
  }

  if (index === 4 && tentative.value[index]) {
    positionWord()
  }
}

function onBackspace(index: number) {
  console.log(index, tentative.value[index])
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
</script>

<template>
  <main class="main-content">
    <h1>Bonjour !</h1>
    <h2>Bienvenue dans le Beetweenle</h2>
    <p>
      Le but du jeu est de trouver le mot mystère compris entre les deux mots.
    </p>
    <p>Vous avez jusqu'a 15 tentatives pour trouver le mot mystère</p>
    <div class="nb-tentatives">Tentative : {{ nombreDessais }} / 15</div>
    <section class="tentatives">
      <div v-for="_ of nombreDessais">
        <div class="bubble"></div>
      </div>
    </section>
    <section>
      <div class="flex-column">
        Le mot est compris entre
        <div class="word">
          <div v-for="letter of upperWord" class="letter upper-word">
            {{ letter }}
          </div>
        </div>
        <div class="word">
          <input
            v-for="(char, i) in tentative"
            :key="i"
            v-model="tentative[i]"
            @input="onInput(i)"
            @keydown.backspace.prevent="onBackspace(i)"
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
      </div>
      <h2 v-if="wordFound && nombreDessais < 15" class="congrats">
        Félicitations ! Vous avez trouvé le mot !
      </h2>
      <h2 v-if="wordFound && nombreDessais === 15" class="failed">
        La prochaine fois sera la bonne !
      </h2>
    </section>
  </main>
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

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
