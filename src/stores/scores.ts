import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatistiqueStore = defineStore('statistiques', () => {
  const STORAGE_KEY = 'game-stats'
  const popupOpen = ref<boolean>(false)

  function initStats() {
    const data = localStorage.getItem(STORAGE_KEY)
    return data
      ? JSON.parse(data)
      : {
          lastPlayed: null,
          attempts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
  }

  const stats = ref(initStats())

  function saveStats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
  }

  function hasPlayedToday() {
    return stats.value.lastPlayed === new Date().toDateString()
  }

  function addTodayScore(nbTest: number) {
    stats.value.attempts[nbTest]++
    const today = new Date().toDateString()
    if (stats.value.lastPlayed !== today) {
      stats.value.lastPlayed = today
      saveStats()
    }
  }

  function resetAttempts() {
    stats.value.attempts = []
    saveStats()
  }

  return {
    stats,
    popupOpen,
    addTodayScore,
    resetAttempts,
    hasPlayedToday,
  }
})
