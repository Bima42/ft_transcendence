import 'phaser'
import { get } from '../../utils'
import { useGameStore } from '@/stores/game'
import BootScene from '@/game/scenes/BootScene'
import PongScene from '@/game/scenes/PongScene'
import GameoverScene from '@/game/scenes/GameoverScene'
import UiScene from './scenes/UiScene'
import type IGameSettings from '@/interfaces/game/IGameSettings'

const gameStore = useGameStore();

async function launch(containerId: any) {

	// Get the current game from the server and put it into the store
	const settings = await get('game/current', "Cannot get game config")
		.then((gameSettings: IGameSettings) => {
			gameStore.currentGame = gameSettings;
			return gameSettings
		})
		.catch((e: Error) => {
			console.error(e)
			gameStore.currentGame = null
			return undefined
		})

	const config = {
		type: Phaser.AUTO,
		scale: { // See doc here: https://newdocs.phaser.io/docs/3.55.2/Phaser.Scale.ScaleManager
			width: 800,
			height: 600,
			parent: "gameContainer",
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			zoom: Phaser.Scale.MAX_ZOOM,
		},
		physics: {
			default: 'matter',
			matter: {
				gravity: {
					y: 0
				},
			},
			debug: false,
		},
		scene: [BootScene]
	}
	const game = new Phaser.Game(config);
	game.scene.add('PongScene', PongScene, false, settings);
	game.scene.add('UiScene', UiScene, false, settings);
	game.scene.add('GameoverScene', GameoverScene, false, settings);

	return game;
}

export default launch
export { launch }
