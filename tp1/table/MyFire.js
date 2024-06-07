import * as THREE from 'three';

export class MyFire extends THREE.Group
{
	/**
	 * @param {number} x the x position of the fire
	 * @param {number} y the y position of the fire 
	 * @param {number} z the z position of the fire
	 * @param {number} color the color of the fire
	*/	
	constructor({x = 0, y = 0, z = 0, color = 0xFDA50F})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the fire to the group
	 * @returns {void}
	 */
	build()
	{
		const coneGeometry = new THREE.ConeGeometry(0.005, 0.01, 32);
		const mesh = new THREE.Mesh(coneGeometry, this.fireMaterial);
		this.add(mesh);
	}

	/**
	 * Creates the material of the fire
	 * @returns {void}
	 */
	materialize()
	{
		this.fireMaterial = new THREE.MeshPhongMaterial({
			color: this.color, 
			emissive: 0xFFAA00,
		});
	}

}
