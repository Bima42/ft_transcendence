import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import BreakoutScene from '@/game/scenes/BreakoutScene'

function launch(containerId) {
  return new Phaser.Game({
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
    scene: [BootScene, BreakoutScene]
  })
}

export default launch
export { launch }
