import PongScene from './PongScene'
import Phaser from 'phaser'
import type IGameSettings from '@/interfaces/game/IGameSettings';
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'

const gameStore = useGameStore();
const userStore = useUserStore();

export default class UiScene extends Phaser.Scene {
  private gameSettings: IGameSettings
  private startButtonText: string = ""
  private scoreLine: any;
  private startButton!: Phaser.GameObjects.Text;
  private isReady: boolean = false;
  private countdown: number = 0;
  private countdownEvent!: Phaser.Time.TimerEvent

  constructor() {
    super({ key: 'UiScene' })
  }

  preload() {

  }

  create(config: IGameSettings) {
    this.gameSettings = config;

    let text = '0 - 0'
    if (config)
      text = this.gameSettings.player1.username + " 0 - 0 " + this.gameSettings.player2.username;
    this.scoreLine = this.add.text(0, 50, text, { fontFamily: 'Arial', fontSize: "25px", color: "#00FF00" });
    this.startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, '')
    this.startButtonText = "I am Ready !"
    this.countdownEvent = new Phaser.Time.TimerEvent({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1});

    if (config)
      this.waitingRoom();
  }

  update() {
    const pongScene = this.scene.get('PongScene') as PongScene;
    const scores = pongScene.scores;

    if (this.gameSettings) {
      this.scoreLine.text = this.gameSettings.player1.username + " " + scores[0] + " - " + scores[1] + " " + this.gameSettings.player2.username;
    }
    Phaser.Display.Align.In.Center(this.scoreLine, this.add.zone(400, 30, 800, 400));

    this.startButton.setText(this.startButtonText);
  }

  onPlayerDisconnect() {
      console.log("Player disconnected");
      this.startButton.setVisible(true)
      this.startButtonText = "Player disconnected"
  }

  // At the start of the countdown
  startGame() {
    this.countdown = 3;
    this.startButtonText = "3"
    this.countdownEvent.reset({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1 });
    this.time.addEvent(this.countdownEvent);
  }

  waitingRoom() {
    this.isReady = false;
    this.startButton.setOrigin(0.5)
      .setVisible(true)
      .setText("I am Ready !")
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.startButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => this.startButton.setStyle({ fill: '#FFF' }))
      .on('pointerdown', () => {
        this.isReady = true;
        this.startButtonText = "Waiting for opponent..."
        this.startButton.setStyle({ fill: '#FFF' })
          .off('pointerover')
          .off('pointerout')
        gameStore.socket.emit("playerReady");
    })
  }

  private onCountdown() {
    this.countdown--;
    this.startButtonText = String(this.countdown);
    if (this.countdown == 0) {
      this.startButton.setVisible(false);
    }
  }

}
