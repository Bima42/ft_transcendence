import PongScene from './PongScene'
import Phaser from 'phaser'
import type IGameSettings from '@/interfaces/game/IGameSettings';
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'

const gameStore = useGameStore();
const userStore = useUserStore();

export default class UiScene extends Phaser.Scene {
  private gameSettings: IGameSettings
  private scoreText: any;
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
    this.scoreText = this.add.text(0, 50, "0 - 0", { fontFamily: 'Arial', fontSize: "50px", color: "#00FF00" });
    this.startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Start game')
    this.countdownEvent = new Phaser.Time.TimerEvent({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1});
    this.waitingRoom();
  }

  update() {
    const pongScene = this.scene.get('PongScene') as PongScene;
    const scores = pongScene.scores;

    this.scoreText.setText(scores[0] + " - " + scores[1]);
    Phaser.Display.Align.In.Center(this.scoreText, this.add.zone(400, 30, 800, 400));

    this.startButton.updateText();
  }

  onPlayerDisconnect() {
      console.log("Player disconnected");
      this.startButton.setVisible(true)
      this.startButton.text = "Player disconnected"
  }

  startGame() {
    // this.countdown = 3;
    // this.startButton.setText("3");
    // this.countdownEvent.reset({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1 });
    // this.time.addEvent(this.countdownEvent);
  }

  waitingRoom() {
    this.isReady = false;
    this.startButton.setOrigin(0.5)
      .setVisible(true)
      .setText("Ready")
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.startButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => this.startButton.setStyle({ fill: '#FFF' }))
      .on('pointerdown', () => {
        this.isReady = true;
        this.startButton.setText("Waiting for opponent...")
          .setStyle({ fill: '#FFF' })
          .off('pointerover')
          .off('pointerout')
        gameStore.socket.emit("playerReady");
    })
  }

  private onCountdown() {
    this.countdown--;
    this.startButton.setText(String(this.countdown));
    if (this.countdown == 0) {
      this.startButton.setVisible(false);
      // this.ball.setVelocity(-this.ball.maxSpeed, 0);
    }
  }

}
