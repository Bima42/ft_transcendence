import 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PongScene from '@/game/scenes/PongScene'
import GameoverScene from '@/game/scenes/GameoverScene'
import UiScene from './scenes/UiScene'
import type { Router } from 'vue-router'
import * as pong from "./GameConsts"

async function launch(containerId: any, router: Router) {



	const config = {
		type: Phaser.AUTO,
		scale: { // See doc here: https://newdocs.phaser.io/docs/3.55.2/Phaser.Scale.ScaleManager
			width: pong.worldWidth,
			height: pong.worldHeight,
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
		scene: [BootScene],
		backgroundColor: '#232423',
	}
	const game = new Phaser.Game(config);
	game.scene.add('PongScene', PongScene, false, router);
	game.scene.add('UiScene', UiScene, false);
	game.scene.add('GameoverScene', GameoverScene, false );

	return game;
}

export default launch
export { launch }
