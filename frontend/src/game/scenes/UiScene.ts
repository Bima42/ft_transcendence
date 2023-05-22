import Phaser from 'phaser'
import type IGameSettings from '@/interfaces/game/IGameSettings';
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import type IUser from '@/interfaces/user/IUser';
import type { IGameoverData, IPointWon } from '@/interfaces/game/IGameCommunication';
import * as pong from "../GameConsts"

const gameStore = useGameStore();
const userStore = useUserStore();

export default class UiScene extends Phaser.Scene {
	private gameSettings!: IGameSettings | null
	private scoreWidget: any;
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

	create() {
		// this.modal = new Modal("");
		this.gameSettings = gameStore.currentGame
		this.scoreWidget = this.add.text(0, 50, "Press W or S to move your paddle", { fontFamily: 'Arial', fontSize: `${pong.worldWidth * 0.03}px`, color: "#00FF00" });

		if (!this.gameSettings) {
			// TODO: show error message
			// this.scene.stop('UiScene');
			this.scoreWidget.setText("No game. Invite someone or get in the queue !");
			return;
		}
		// Are we player 1 or 2 ?
		if (userStore.user?.id == this.gameSettings.player1.id) {
			this.isPlayer1 = true;
			this.myPlayer = this.gameSettings.player1;
			this.otherPlayer = this.gameSettings.player2;
		} else {
			this.isPlayer1 = false;
			this.myPlayer = this.gameSettings.player2;
			this.otherPlayer = this.gameSettings.player1;
		}

		this.startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, "I am ready !", { fontFamily: 'Arial', fontSize: `${pong.worldWidth * 0.02}px`, color: "#FFFFFF" })
		this.countdownEvent = new Phaser.Time.TimerEvent({ delay: 1000, callback: () => this.onCountdown(), repeat: this.countdown - 1 });

		this.waitingRoom();

	}

	update() {
		Phaser.Display.Align.In.Center(this.scoreWidget, this.add.zone(pong.worldWidth / 2, 30, pong.worldWidth, 400));

	}

	onServerDisconnect() {
		try {
			this.startButton.setVisible(true)
			this.startButton.setText(`Server disconnected.`)
		}
		catch(e) {}
	}

	onPlayerDisconnect() {
		try {
			this.startButton.setVisible(true)
			this.startButton.setText(`${this.otherPlayer.username} disconnected.`)
		}
		catch(e) {}
	}

	onPlayerReconnect(username: string) {
		this.startButton.setVisible(true)
		this.startButton.setText(`${username} reconnected!`)
		setTimeout(() => {
			this.startButton.setVisible(false);
		}, pong.ReconnectBreakMs);
	}

	onAbortGame(reason: string) {
		this.startButton.setVisible(true)
					.off('pointerover')
					.off('pointerout')
					.off('pointerdown')
					.setText(`Game aborted: ${reason}\nYou can leave this page`)
	}

	updateScoreWidgetContent(score1: number, score2: number) {
		let printedScore = [];
		if (this.isPlayer1) {
			printedScore.push(score1);
			printedScore.push(score2);
		} else {
			printedScore.push(score2);
			printedScore.push(score1);
		}
		let text = String(printedScore[0]) + " - " + String(printedScore[1]);
		if (this.gameSettings) {
			text = this.myPlayer.username + " " + text;
			text = text + " " + this.otherPlayer.username;
		}
		this.scoreWidget.setText(text);

	}

	onPointEnd(score: IPointWon) {
		this.updateScoreWidgetContent(score.score1, score.score2);
		this.startButton.setVisible(true);
		this.startGame();
	}

	onGameover(_gameoverData: IGameoverData) {
		// Nothing to do, as we switch to GameoverScene
	}

	// At the start of the countdown
	startGame() {
		this.countdown = 3;
		this.startButton.setText("3")
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
				this.updateScoreWidgetContent(0, 0);
				this.startButton.setText("Waiting for opponent...")
					.setStyle({ fill: '#FFF' })
					.setInteractive({ useHandCursor: false })
					.off('pointerover')
					.off('pointerout')
					.off('pointerdown')
				gameStore.socket.emit("playerReady");
			})
	}

	private onCountdown() {
		this.countdown--;
		this.startButton.setText(String(this.countdown));
		if (this.countdown == 0) {
			this.startButton.setVisible(false);
		}
	}

}
