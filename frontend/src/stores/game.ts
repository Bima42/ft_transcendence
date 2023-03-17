import { ref } from 'vue'
import { defineStore } from 'pinia';
import io from 'socket.io-client';

export const useGameStore = defineStore('game', () => {
  const socket = ref(io('http://localhost:3080/game'));



  return { socket }
})
