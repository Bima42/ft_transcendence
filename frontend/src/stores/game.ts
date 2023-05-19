import { ref } from 'vue'
import { defineStore } from 'pinia';
import { io, Socket } from "socket.io-client"
import { getCookie } from 'typescript-cookie';
import type IGameSettings from '@/interfaces/game/IGameSettings';

export const useGameStore = defineStore('game', () => {
  const socket = ref<Socket>(io(`wss://${import.meta.env.VITE_APP_URL}/game`, {
    auth: { token: getCookie("access_token") },
    path: "/api/socket.io/",
  }));

  const currentGame = ref<IGameSettings | null>(null);

  const waitForInvitation = function () {

  }

  const stopWaitingForInvitation = function () {

  }

  const acceptInvitation = function () {

  }

  const declineInvitation = function () {

  }

  const resetStore = function () {

  }



  return {
	socket,
	currentGame,
	waitForInvitation,
	stopWaitingForInvitation,
	acceptInvitation,
	declineInvitation,
	resetStore,
  }
})
