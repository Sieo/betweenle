<script setup lang="ts">
import { useStatistiqueStore } from '@/stores/scores'

const statsStore = useStatistiqueStore()

function closePopup() {
  statsStore.popupOpen = false
}
</script>
<template>
  <div id="myPopup" class="overlay">
    <div class="popup show">
      <h2>Statistiques</h2>
      <button class="close" v-on:click="closePopup()">Fermer</button>
      <p>
        Dernière partie effectuée le :
        {{ new Date(statsStore.stats.lastPlayed).toLocaleDateString() }}
      </p>
      <div>
        <p>Vos statistiques pour le moment :</p>
        <ul>
          <li v-for="(score, index) in statsStore.stats.attempts" class="flex">
            <div class="number-index">{{ index + 1 }}</div>
            <div :style="{ width: score * 10 + 'px' }" class="chart-bar"></div>
            <div>{{ score }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  gap: 8px;
  align-items: center;
}
.chart-bar {
  height: 20px;
  border: 1px solid black;
  background-color: orange;
}
.number-index {
  width: 15px;
  text-align: end;
}
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
  animation: fadeIn 1s;
}
.popup {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
  transition: all 5s ease-in-out;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid;
  transition: all 0.5s ease-in-out;
}
.close:hover {
  background-color: orange;
  transition: all 0.5s ease-in-out;
}
.popup .show {
  visibility: visible;
  opacity: 1;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
