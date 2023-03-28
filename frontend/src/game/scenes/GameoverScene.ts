import { Scene } from 'phaser'

export default class GameoverScene extends Scene {

    constructor() {
        super({ key: 'GameoverScene' })
    }

    preload()
    {

    }

    create()
    {
		this.add.text(100, 100, "Gameover", { fontFamily: 'Arial', fontSize: "50px", color: '#00FF00', align: 'left' });

		this.add.text(100, 300, "Press space to restart custom", {});
		this.add.text(100, 400, "or c for classic mode", {});

		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
			.on('up', function(key, event) {
			this.scene.start('PongScene', { classic: true })
			}, this);

		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on('up', function(key, event) {
			this.scene.start('PongScene', { classic: false })
			}, this);
    }

	update()
	{


	}

}
