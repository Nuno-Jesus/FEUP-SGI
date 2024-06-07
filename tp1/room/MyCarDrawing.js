import * as THREE from 'three';

export class MyCarDrawing extends THREE.Group
{
    /**
	 * @param {number} x the x position of the car drawing picture
	 * @param {number} y the y position of the car drawing picture 
	 * @param {number} z the z position of the car drawing picture
	 * @param {number} color the color of the car drawing picture
	 * @param {number} width the width of the car drawing picture
	 * @param {number} height the height of the car drawing picture
	 * @param {string} frameTexture the texture file of the car drawing picture frame
	 * @param {number} xRot the x rotation of the car drawing picture
	 * @param {number} yRot the y rotation of the car drawing picture
	 * @param {number} zRot the z rotation of the car drawing picture
	*/
	constructor({ x = 0, y = 0, z = 0, color = 0x000000, width = 2.4, height = 1.6, 
		frameTexture = 'textures/wood.jpg', xRot = 0, yRot = 0, zRot = 0})
	{
		super();
		this.x = x;
		this.y = y; 
		this.z = z;
		this.width = width;
		this.height = height;
		this.frameTexture = frameTexture;
        this.xRot = xRot;
        this.yRot = yRot;
        this.zRot = zRot;
		this.color = color;
		this.numberOfSamples = 20;
		this.materialize();
		this.build();
        this.rotation.set(this.xRot, this.yRot, this.zRot);
        this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the car drawing picture to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildFrame();
		this.buildImage();
	}
	
	/**
	 * Builds the frame of the car drawing picture
	 * @returns {void}
	 */
	buildFrame()
	{
		const frameGeometry = new THREE.BoxGeometry(this.width, this.height, 0.1);
        const frame = new THREE.Mesh(frameGeometry, this.frameMaterial);
		this.add(frame);
	}

	/**
	 * Builds the image of the car drawing picture
	 * @returns {void}
	 */
	buildImage()
	{
		const imageGeometry = new THREE.BoxGeometry(this.width * 0.92, this.height * 0.92, 0.2);
        const image = new THREE.Mesh(imageGeometry, this.canvasMaterial);  
        this.add(image);
		this.drawCar();
	}

	/**
	 * Draws the car on the canvas by drawing the different parts of the car first
	 * @returns {void}
	 */
	drawCar()
	{
		this.drawLeftRoof(new THREE.Vector3(-0.8, -0.5, 0.12));
		this.drawRightRoof(new THREE.Vector3(0.0, 0.0, 0.12));
		this.drawHood(new THREE.Vector3(0.3, -0.5, 0.12));
		this.drawWheel(new THREE.Vector3(-0.5, -0.5, 0.12));
		this.drawWheel(new THREE.Vector3(0.5, -0.5, 0.12));
	}
    
	/**
	 * Draws a wheel on the canvas, that follow the curve passed as parameter
	 * and is positioned at the position passed as parameter
	 * @param {THREE.Vector3} position the position of the wheel
	 * @returns {void}
	 */
	drawWheel(position)
	{
		let points = [
			new THREE.Vector3( -0.3, 0.0, 0.0 ), // lower left
			new THREE.Vector3( -0.3, 0.4, 0.0 ), // upper left
			new THREE.Vector3(  0.3, 0.4, 0.0 ), // upper right
			new THREE.Vector3(  0.3, 0.0, 0.0 )  // lower right
		];
		
		const curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3] );
		this.drawLine(curve, position);
	}
	
	/**
	 * Draws the hood of the car on the canvas, that follow the curve passed as parameter
	 * and is positioned at the position passed as parameter
	 * @param {THREE.Vector3} position the position of the hood
	 * @returns {void}
	 */
	drawHood(position)
	{
		let points = [
			new THREE.Vector3(  0.0, 0.5, 0.0 ), // upper left
			new THREE.Vector3(  0.5, 0.5, 0.0 ), // upper right
			new THREE.Vector3(  0.5, 0.0, 0.0 )  // lower right
		];
		
		const curve = new THREE.QuadraticBezierCurve3( points[0], points[1], points[2] );
		this.drawLine(curve, position);
	}

	/**
	 * Draws the left roof of the car on the canvas, that follow the curve passed as parameter
	 * and is positioned at the position passed as parameter
	 * @param {THREE.Vector3} position the position of the left roof
	 * @returns {void}
	 */
	drawLeftRoof(position)
	{
		let points = [
			new THREE.Vector3(  0.0, 0.0, 0.0 ),
			new THREE.Vector3(  0.0, 0.8, 0.0 ),
			new THREE.Vector3(  0.8, 0.8, 0.0 )
		];

		const curve = new THREE.QuadraticBezierCurve3( points[0], points[1], points[2] );
		this.drawLine(curve, position);
	}

	/**
	 * Draws the right roof of the car on the canvas, that follow the curve passed as parameter
	 * and is positioned at the position passed as parameter
	 * @param {THREE.Vector3} position the position of the right roof
	 * @returns {void}
	 */
	drawRightRoof(position)
	{
		let points = [
			new THREE.Vector3(  0.0, 0.3, 0.0 ),
			new THREE.Vector3(  0.3, 0.3, 0.0 ),
			new THREE.Vector3(  0.3, 0.0, 0.0 ) 
		];

		const curve = new THREE.QuadraticBezierCurve3( points[0], points[1], points[2] );
		this.drawLine(curve, position);
	}

	/**
	 * Draws a generic line on the canvas, that follow the curve passed as parameter
	 * and is positioned at the position passed as parameter
	 * @param {THREE.Curve} curve the curve that the line will follow
	 * @param {THREE.Vector3} position the position of the line
	 * @returns {void}
	 */
	drawLine(curve, position)
	{
		let sampledPoints = curve.getPoints( this.numberOfSamples );
		let lineGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints );
		let lineMaterial = new THREE.LineBasicMaterial( { color: this.color } );
		let line = new THREE.Line( lineGeometry, lineMaterial );
		line.position.set(position.x,position.y,position.z);
		this.add(line);
	}

	/**
	 * Creates the materials used for the car drawing picture and loads any 
	 * external texture files needed
	 * @returns {void}
	 */
	materialize()
	{
		const canvasTexture = new THREE.TextureLoader().load('textures/squared_paper.jpg');
		canvasTexture.wrapS = THREE.RepeatWrapping;
		canvasTexture.wrapT = THREE.RepeatWrapping;
		canvasTexture.repeat.set(2, 2);

		this.frameMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(this.frameTexture), // Apply the image texture to the frame
            shininess: 90,
		});

		this.canvasMaterial = new THREE.MeshPhongMaterial({ 
			map: canvasTexture
		});
	}
}
