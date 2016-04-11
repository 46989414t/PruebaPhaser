/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;
class mainState extends Phaser.State {
    game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private walls:Phaser.TilemapLayer;
    private map:Phaser.Tilemap;

    private MAX_SPEED = 350;    // pixels/second
    private ACCELERATION = 250; // aceleración
    private FUERZA_ROZAMIENTO = 100; // Aceleración negativa
    private DRAG:number = 100;
    private BOUNCE:number = 0.4;
    private ANGULAR_DRAG:number = this.DRAG * 1.3;

    private pickups:Phaser.Group;//las moneditas

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/assets2/personatgeGran2.png');
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
        this.createWalls();
        this.createPlayer();
        this.createPickupObjects();
        //var background;

        //var background = this.add.sprite(0, 0, 'tilemap');



    }

    private createPickupObjects():void {
        this.pickups = this.add.group();
        this.pickups.enableBody = true;
/*        var positions:Point[] = [
         new Point(300, 95),
         new Point(190, 135), new Point(410, 135),
         new Point(120, 200), new Point(480, 200),
         new Point(95, 300), new Point(505, 300),
         new Point(120, 405), new Point(480, 405),
         new Point(190, 465), new Point(410, 465),
         new Point(300, 505),
         ];
*/
 //        for (var i = 0; i < positions.length; i++) {
 //        var position = positions[i];
         var pickup = new Pickup (this.game, 300, 95, 'pickup');
         this.add.existing(pickup);

         pickup.scale.setTo(0, 0);
         this.add.tween(pickup.scale).to({x: 1, y: 1}, 300).start();

         this.pickups.add(pickup);
 //        }
    }
    getPickup(ufo:Phaser.Sprite, pickup:Phaser.Sprite) {                  //las colisiones del pickUp
        var tween = this.add.tween(pickup.scale).to({x: 0, y: 0}, 50);
        tween.onComplete.add(function () {
            pickup.kill();
        });
        tween.start();
    }
    private createPlayer(){
        this.pickups = this.add.group();
        this.pickups.enableBody = true;

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
        this.ufo.body.collideWorldBounds = true;//colisionar con los bordes del mundo
        //this.ufo.body.bounce.setTo(2);

        //para que haga los rebotes como dios manda
        this.ufo.body.bounce.set(this.BOUNCE);
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ufo.body.angularDrag = this.ANGULAR_DRAG;
    }

    private createWalls() {
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('BackgroundLow', 'tiles');

        var background = this.map.createLayer('fondo');//el nombre de la capa
        this.walls = this.map.createLayer('paredes');//el nombre de la capa

        this.map.setCollisionBetween(1, 100, true, 'paredes');
    };

    update():void {
        super.update();
        this.physics.arcade.collide(this.ufo, this.walls);//para que colisione con las paredes
        this.physics.arcade.overlap(this.ufo, this.pickups, this.getPickup, null, this);//colisiona con el pickUp



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

class Pickup extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture) {
        super(game, x, y, key);

        this.anchor.setTo(0.5, 0.5);
    }

    update():void {
        super.update();
        this.angle += 1;
    }
}
