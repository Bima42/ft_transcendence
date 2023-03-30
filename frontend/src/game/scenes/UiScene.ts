import PongScene from './PongScene'
import Phaser from 'phaser'
import type IGameSettings from '@/interfaces/game/IGameSettings';
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import type IUser from '@/interfaces/user/IUser';
import type { IPointWon } from '@/interfaces/game/IGameCommunication';

const gameStore = useGameStore();
const userStore = useUserStore();

export default class UiScene extends Phaser.Scene {
  private gameSettings!: IGameSettings
  private startButtonText: string = ""
  private scoreWidget: any;
  private scoreWidgetContent: string = ''
  private startButton!: Phaser.GameObjects.Text;
  private countdown: number = 0;
  private countdownEvent!: Phaser.Time.TimerEvent
  private myPlayer!: IUser
  private otherPlayer!: IUser
  private isPlayer1: boolean = false;

  constructor() {
    super({ key: 'UiScene' })
  }

  preload() {

  }

  create(config: IGameSettings) {
    this.gameSettings = gameStore.currentGame;

    // Are we player 1 or 2 ?
    if(userStore.user?.id == this.gameSettings.player1.id) {
      this.isPlayer1 = true;
      this.myPlayer = this.gameSettings.player1;
      this.otherPlayer = this.gameSettings.player2;
    } else {
      this.isPlayer1 = false;
      this.myPlayer = this.gameSettings.player2;
      this.otherPlayer = this.gameSettings.player1;
    }

    this.updateScoreWidgetContent(0, 0);
    this.scoreWidget = this.add.text(0, 50, this.scoreWidgetContent, { fontFamily: 'Arial', fontSize: "25px", color: "#00FF00" });

    this.startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, '')
    this.startButtonText = "I am Ready !"
    this.countdownEvent = new Phaser.Time.TimerEvent({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1});

    if (config)
      this.waitingRoom();
  }

  update() {

    Phaser.Display.Align.In.Center(this.scoreWidget, this.add.zone(400, 30, 800, 400));

    this.scoreWidget.setText(this.scoreWidgetContent);
    this.startButton.setText(this.startButtonText);
  }

  onServerDisconnect() {
      console.log("Server disconnected");
      this.startButton.setVisible(true)
      this.startButtonText = `Server disconnected.`
  }

  onPlayerDisconnect() {
      console.log("Player disconnected");
      this.startButton.setVisible(true)
      this.startButtonText = `${this.otherPlayer.username} disconnected.`
  }

  updateScoreWidgetContent(score1: number, score2: number) {
    let printedScore = [];
    // Not sure why not the opposite, but ok
    if (! this.isPlayer1) {
      printedScore.push(score1);
      printedScore.push(score2);
    } else {
      printedScore.push(score2);
      printedScore.push(score1);
    }
    this.scoreWidgetContent = String(printedScore[0]) + " - " + String(printedScore[1]);
    if (this.gameSettings) {
      this.scoreWidgetContent = this.myPlayer.username + " " + this.scoreWidgetContent;
      this.scoreWidgetContent = this.scoreWidgetContent + " " + this.otherPlayer.username;
    }

  }

  onPointEnd(score: IPointWon) {
    this.updateScoreWidgetContent(score.score1, score.score2);
    this.startButton.setVisible(true);
    this.startGame();
  }

  onGameover(_score: IPointWon) {
    // Nothing to do, as we switch to GameoverScene
  }

  // At the start of the countdown
  startGame() {
    this.countdown = 3;
    this.startButtonText = "3"
    this.countdownEvent.reset({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1 });
    this.time.addEvent(this.countdownEvent);
  }

  waitingRoom() {
    this.startButton.setOrigin(0.5)
      .setVisible(true)
      .setText("I am Ready !")
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.startButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => this.startButton.setStyle({ fill: '#FFF' }))
      .on('pointerdown', () => {
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
