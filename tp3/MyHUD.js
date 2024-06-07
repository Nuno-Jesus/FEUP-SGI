import * as THREE from 'three';

export class MyHUD extends THREE.Group
{
	constructor(renderer)
	{
        
        super();
        
        this.renderer = renderer;

        console.log(this.renderer);

        this.clock = new THREE.Clock();

        this.lastUpdate = 0;
        this.updateInterval = 1; // Update every second

        this.timeSprites = [];
        this.lapSprites = [];

		this.spriteMap = new THREE.TextureLoader().load( '../images/Spritesheet.png' );

		this.spriteMap.repeat.set( 0.0625, 0.0625 );
		this.spriteMap.offset.set( 0, 0 );
        this.render()

    }
    
    render()
    {

        const aspect = window.innerWidth / window.innerHeight;

        this.cameraHUD = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        this.cameraHUD.position.set(-11,0,15)
        
        
        // Create also a custom scene for HUD.
        this.sceneHUD = new THREE.Scene();

    
        // // Create HUD text.    
        // var sprites1 = this.getSentenceSprites("Hello World", 0);
        // var sprites2 = this.getSentenceSprites("BYE WORLD", 1);

        // this.drawSprites(sprites1);
        // this.drawSprites(sprites2);


        this.sceneHUD.add(this.cameraHUD);
        this.renderer.render(this.sceneHUD, this.cameraHUD);
        
    }
    
    update(car)
	{
        const { laps } = car;

        var elapsedTime = this.clock.getElapsedTime();
        
        // Check if enough time has passed since the last update
        if (elapsedTime - this.lastUpdate > this.updateInterval) {
            
            var lapStr = "Lap " + laps + " / 3";

			for (var i = this.lapSprites.length - 1; i >= 0; i--) {
                this.sceneHUD.remove(this.lapSprites[i]);
            }

            this.lapSprites = this.getSentenceSprites(lapStr, 1);
            this.drawSprites(this.lapSprites);

            // update time
            this.lastUpdate = elapsedTime;
            var elapsedTimeStr = Math.floor(elapsedTime) + ' seconds';
            for (var i = this.timeSprites.length - 1; i >= 0; i--) {
                this.sceneHUD.remove(this.timeSprites[i]);
            }

            this.timeSprites = this.getSentenceSprites(elapsedTimeStr, 2);
            this.drawSprites(this.timeSprites);
        }


        this.renderer.render(this.sceneHUD, this.cameraHUD);

    }



    getSprite(asciiCode)
    {
        var length = 0.0625;
        var columns = 16;
        var offsetY = 15 * length;
        var spriteX = (asciiCode % columns) * length;
        var spriteY = Math.floor(asciiCode / columns) * length;

        // get selected sprite
		const spriteMapCopy = this.spriteMap.clone();
        spriteMapCopy.offset.set( spriteX, offsetY - spriteY );

        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMapCopy } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 1, 1, 1 );
        sprite.position.set(0, 5, 0);

        return sprite;
    }

    getSentenceSprites(sentence, lineNumber)
    {
        var sprites = [];
        var spriteWidth = 0.5; // Set this to the width of your sprite
        var spriteHeight = 1; // Set this to the height of your sprite
        var startY = 10; // Set this to the y position of the first line
    
        for (var i = 0; i < sentence.length; i++) {
            var sprite = this.getSprite(sentence.charCodeAt(i));
            sprite.position.x = i * spriteWidth; // This will position the sprites side by side
            sprite.position.y = startY - (lineNumber * spriteHeight); // This will position the sprites on different lines from top to bottom
            sprites.push(sprite);
        }
    
        return sprites;
    }

    drawSprites(sprites)
    {

        for(let i = 0; i < sprites.length; i++) {
            this.sceneHUD.add(sprites[i]);
        }

    }
}
