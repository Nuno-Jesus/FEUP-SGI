import * as THREE from 'three';

export class MyRug extends THREE.Group
{
	/**
	 * @param {number} x the x position of the rug
	 * @param {number} y the y position of the rug 
	 * @param {number} z the z position of the rug
	 * @param {number} color the color of the rug
	 * @param {number} length the height of the rug
	 * @param {number} width the width of the rug
	 * @param {string} texture the texture file of the rug
	*/
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, length = 7, width = 5, texture = 'textures/rug.jpg'})
	{
		super();
		this.x = x;
		this.y = y; 
		this.z = z;
		this.color = color;
		this.length = length;
		this.width = width;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}
	
	/**
	 * Builds the rug
	 * @returns {void}
	 */
	build()
	{
		const rugGeometry = new THREE.BoxGeometry(this.width, this.length, 0.01);
		const rug = new THREE.Mesh(rugGeometry, this.rugMaterial);

		rug.rotation.x = Math.PI / 2;
		rug.receiveShadow = true;

		this.add(rug);
	}

	/**
	 * Assembles the rug's material and loads any necessary texture
	 * @returns {void}
	 */
	materialize()
	{
		const texture = new THREE.TextureLoader().load(this.texture);
		texture.wrapS = THREE.MirroredRepeatWrapping;
		texture.wrapT = THREE.MirroredRepeatWrapping;
		texture.repeat.set(2, 3);

		this.rugMaterial = new THREE.MeshLambertMaterial({
			color: this.color,
			map: texture,
		});
	}
}
