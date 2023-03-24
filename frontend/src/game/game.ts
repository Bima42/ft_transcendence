import 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PongScene from '@/game/scenes/PongScene'
import GameoverScene from '@/game/scenes/GameoverScene'
import type IGame from '@/interfaces/game/IGame'

function launch(containerId: any, gameSettings: IGame) {
	const config = {
		type: Phaser.AUTO,
		width: 800,
		height: 600,
		parent: containerId,
		physics: {
			default: 'arcade',
			arcade: {
				debug: false
			}
		},
		scene: [BootScene]
  }
  const game = new Phaser.Game(config);

  game.scene.add('PongScene', PongScene, false, gameSettings);
  game.scene.add('GameoverScene', GameoverScene, false, {});

  return game;
}

export default launch
export { launch }
