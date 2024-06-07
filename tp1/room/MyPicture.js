import * as THREE from 'three';

export class MyPicture extends THREE.Group
{
    /**
	 * @param {number} x the x position of the picture
	 * @param {number} y the y position of the picture 
	 * @param {number} z the z position of the picture
	 * @param {number} color the color of the picture
	 * @param {number} width the width of the picture
	 * @param {number} height the height of the picture
	 * @param {string} imageTexture the texture file of the picture
	 * @param {string} frameTexture the texture file of the picture frame
	 * @param {number} xRot the x rotation of the picture
	 * @param {number} yRot the y rotation of the picture
	 * @param {number} zRot the z rotation of the picture
	*/
	constructor({x = 0, y = 0, z = 0, width = 1.4, height = 1.6, imageTexture = 'textures/image.jpg', 
		frameTexture = 'textures/wood.jpg', color = 0xFFFFFF, xRot = 0, yRot = 0, zRot = 0})
	{
		super();
		this.x = x;
		this.y = y; 
		this.z = z;
		this.width = width;
		this.height = height;
		this.frameTexture = frameTexture;
		this.imageTexture = imageTexture;	
        this.xRot = xRot;
        this.yRot = yRot;
        this.zRot = zRot;
		this.color = color;
		this.materialize();
		this.build();
		this.rotation.set(this.xRot, this.yRot, this.zRot);
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the picture to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildFrame();
		this.buildImage();
	}

	/**
	 * Builds the frame of the picture
	 * @returns {void}
	 */
	buildFrame()
	{
		const frameGeometry = new THREE.BoxGeometry(this.width, this.height, 0.1);
		const frame = new THREE.Mesh(frameGeometry, this.frameMaterial);
		this.add(frame);
	}

	/**
	 * Builds the image of the picture
	 * @returns {void}
	 */
	buildImage()
	{
		const imageGeometry = new THREE.BoxGeometry(this.width * 0.92, this.height * 0.92, 0.2);
		const image = new THREE.Mesh(imageGeometry, this.imageMaterial);
		this.add(image);
	}

	/**
	 * Creates the material of the picture and picture frame by loading any external
	 * texture files
	 * @returns {void}
	 */
	materialize()
	{
		this.frameMaterial = new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load(this.frameTexture), // Apply the image texture to the frame
		});
        this.imageMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(this.imageTexture),
        });
	}
}
