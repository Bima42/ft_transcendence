import type { IGameoverData } from '@/interfaces/game/IGameCommunication';
import { Scene } from 'phaser'
import {useUserStore } from '@/stores/user'
import * as pong from "../GameConsts"

export default class GameoverScene extends Scene {

  constructor() {
    super({ key: 'GameoverScene' })
  }

  preload() {

  }

  create(data: IGameoverData) {

    const userStore = useUserStore()
    let text = "You won ! :D"
    let scoreText = data.score1 + " - " + data.score2
    if (data.winnerId != userStore.user?.id) {
      text = "You lost :("
    }

    const label1 = this.add.text(100, 100, text, { fontFamily: 'Arial', fontSize: "50px", color: '#00FF00', align: 'left' });
    Phaser.Display.Align.In.Center(label1 as Phaser.GameObjects.Text, this.add.zone(pong.worldWidth / 2, pong.worldHeight * 2 / 5, pong.worldWidth, 400));

    const label2 = this.add.text(100, 200, scoreText, { fontFamily: 'Arial', fontSize: "50px", color: '#00FF00', align: 'left' });
    Phaser.Display.Align.In.Center(label2 as Phaser.GameObjects.Text, this.add.zone(pong.worldWidth / 2, pong.worldHeight * 3 / 5, pong.worldWidth, 400));

    const label3 = this.add.text(100, 300, "Press enter to exit", {});
    Phaser.Display.Align.In.Center(label3 as Phaser.GameObjects.Text, this.add.zone(pong.worldWidth / 2, pong.worldHeight * 4 / 5, pong.worldWidth, 400));

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      .on('up', (_key: any, _event: any) => {
        console.log("EXIT GAME")
        // TODO: event to leave page to 'joinQueue'
      }, this);

  }

  update() {
  }

}
