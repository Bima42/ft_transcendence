import 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PongScene from '@/game/scenes/PongScene'
import GameoverScene from '@/game/scenes/GameoverScene'

function launch(containerId) {
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

  game.scene.add('PongScene', PongScene, false, {customPong: false});
  game.scene.add('GameoverScene', GameoverScene, false, {});

  return game;
}

export default launch
export { launch }
