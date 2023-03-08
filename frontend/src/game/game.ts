import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PongScene from '@/game/scenes/PongScene'
import GameoverScene from '@/game/scenes/GameoverScene'

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    },
    scene: [BootScene, PongScene, GameoverScene]
  })
}

export default launch
export { launch }
