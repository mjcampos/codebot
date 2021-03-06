var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image("tiles", "assets/images/backgrounds/future_tiles.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");
    this.load.spritesheet('robot',
        'assets/images/sprites/daxbotsheet.png',
        { frameWidth: 64, frameHeight: 68 }
    );
}

let player;
let cursors;

function create() {
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("future", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("floor", tileset, 0, 0);
    const topLayer = map.createStaticLayer("walls", tileset, 0, 0);

    topLayer.setCollisionByProperty({ collides: true });

    //checking which tiles have collision detection
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // topLayer.renderDebug(debugGraphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    player = this.physics.add.sprite(160, 256, "robot").setSize(20, 15).setOffset(20, 40);;
    player.setDisplaySize(48, 51);

    // This will watch the player and worldLayer every frame to check for collisions
    this.physics.add.collider(player, topLayer);

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //idle animation
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'robot', frame: 0 }],
        frameRate: 20
    });

    //right animation
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    //up animation
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('robot', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
    });
}

function update() {


    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
        player.body.setVelocityY(0);
        
        //flipping sprite left
        if(!player.flipX) {
            player.flipX = true;
        }
        
        player.anims.play("right", true);
    } 
    else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
        player.body.setVelocityY(0);

        //flipping sprite right
        if(player.flipX) {
            player.flipX = false;
        }

        player.anims.play('right', true);
    }

    // Vertical movement
    else if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
        player.body.setVelocityX(0);
        player.anims.play("right", true);
    } 
    else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
        player.body.setVelocityX(0);
        player.anims.play("right", true);
    }

    else {
        // Stop any previous movement from the last frame
        player.body.setVelocity(0);
        player.anims.play("idle", true);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    // player.body.velocity.normalize().scale(speed);
}