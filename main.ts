/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;

    private MAX_SPEED = 350;    // pixels/second
    private ACCELERATION = 250; // aceleración
    private FUERZA_ROZAMIENTO = 100; // Aceleración negativa
    private DRAG:number = 100;
    private BOUNCE:number = 0.4;
    private ANGULAR_DRAG:number = this.DRAG * 1.3;

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/UFOLow.png');
        this.load.image('pickup', 'assets/PickupLow.png');
        //this.load.image('background', 'assets/BackgroundLow.png'    );

        //cargar JSON
        this.load.tilemap('tilemap', 'assets/mapa.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/BackgroundLow.png');

        // Declaramos el motor de físicas que vamos a usar
        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void {
        super.create();
        //var background;

        //var background = this.add.sprite(0, 0, 'tilemap');

        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');

        // Para el movimiento del platillo con las teclas
        this.cursor = this.input.keyboard.createCursorKeys();

        // Activamos la fisica
        this.physics.enable(this.ufo);

        // Le damos una aceleración
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y

        // Fuerza de rozamiento
        this.ufo.body.drag.setTo(this.FUERZA_ROZAMIENTO, this.FUERZA_ROZAMIENTO); // x, y

        //velocidad maxima, colisiones y rebote
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ufo.body.collideWorldBounds = true;
        //this.ufo.body.bounce.setTo(2);

        //para que haga los rebotes como dios manda
        this.ufo.body.bounce.set(this.BOUNCE);
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ufo.body.angularDrag = this.ANGULAR_DRAG;

    }

    update():void {
        super.update();

        // Velocidad en el instante 0 del objeto

        // Movimientos en el eje X
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
        } else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;

        // Movimientos en el eje Y
        } else if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
        } else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
        } else {
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }

    }
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
