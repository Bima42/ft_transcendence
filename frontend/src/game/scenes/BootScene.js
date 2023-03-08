import { Scene } from 'phaser'
import thudMp3 from '@/game/assets/thud.mp3'
import thudOgg from '@/game/assets/thud.ogg'
import breakoutJson from '@/game/assets/breakout.json'
import breakoutPng from '@/game/assets/breakout.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.audio('thud', [thudMp3, thudOgg])

    // this.load.atlas('assets', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
    this.load.atlas('assets', breakoutPng, breakoutJson);
  }

  create () {
    this.scene.start('BreakoutScene')
  }
}
