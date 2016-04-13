/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.MAX_SPEED = 350; // pixels/second
        this.ACCELERATION = 250; // aceleración
        this.FUERZA_ROZAMIENTO = 100; // Aceleración negativa
        this.DRAG = 100;
        this.BOUNCE = 0.4;
        this.ANGULAR_DRAG = this.DRAG * 1.3;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //this.load.image('ufo', 'assets/assets2/personatgeGran.png');
        //this.load.image('ufo', 'assets/coches/cocheAzul.png');
        this.load.image('ufo', 'assets/coches/cocheRojo.png');
        this.load.image('pickup', 'assets/PickupLow.png');
        //this.load.image('background', 'assets/BackgroundLow.png'    );
        //cargar JSON
        this.load.tilemap('tilemap', 'assets/coches/circuit.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/coches/circuito1.jpg');
        // Declaramos el motor de físicas que vamos a usar
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.createWalls();
        this.createPlayer();
        this.createPickupObjects();
        //var background;
        //var background = this.add.sprite(0, 0, 'tilemap');
    };
    mainState.prototype.createPickupObjects = function () {
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
        var pickup = new Pickup(this.game, 300, 95, 'pickup');
        this.add.existing(pickup);
        pickup.scale.setTo(0, 0);
        this.add.tween(pickup.scale).to({ x: 1, y: 1 }, 300).start();
        this.pickups.add(pickup);
        //        }
    };
    mainState.prototype.getPickup = function (ufo, pickup) {
        var tween = this.add.tween(pickup.scale).to({ x: 0, y: 0 }, 50);
        tween.onComplete.add(function () {
            pickup.kill();
        });
        tween.start();
    };
    mainState.prototype.createPlayer = function () {
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
        this.ufo.body.collideWorldBounds = true; //colisionar con los bordes del mundo
        //this.ufo.body.bounce.setTo(2);
        //para que haga los rebotes como dios manda
        this.ufo.body.bounce.set(this.BOUNCE);
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ufo.body.angularDrag = this.ANGULAR_DRAG;
    };
    mainState.prototype.createWalls = function () {
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('circuito1', 'tiles'); //nombre en json
        var background = this.map.createLayer('Pista'); //el nombre de la capa
        this.walls = this.map.createLayer('Fuera'); //el nombre de la capa
        this.map.setCollisionBetween(1, 100, true, 'Fuera');
    };
    ;
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.physics.arcade.collide(this.ufo, this.walls); //para que colisione con las paredes
        this.physics.arcade.overlap(this.ufo, this.pickups, this.getPickup, null, this); //colisiona con el pickUp
        // Velocidad en el instante 0 del objeto
        // Movimientos en el eje X
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
        }
        else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;
        }
        else if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
        }
        else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
        }
        else {
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }
    };
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(768, 561, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
var Pickup = (function (_super) {
    __extends(Pickup, _super);
    function Pickup(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.anchor.setTo(0.5, 0.5);
    }
    Pickup.prototype.update = function () {
        _super.prototype.update.call(this);
        this.angle += 1;
    };
    return Pickup;
})(Phaser.Sprite);
//# sourceMappingURL=main.js.map