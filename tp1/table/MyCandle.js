import * as THREE from 'three';

export class MyCandle extends THREE.Group
{
	/**
	 * @param {number} x the x position of the candle group
	 * @param {number} y the y position of the candle group 
	 * @param {number} z the z position of the candle group
	 * @param {number} color the color of the candle
	 * @param {number} height the height of the candle body
	*/	
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, height = 0.01})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.height = height;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the candle to the group
	 * @returns {void}
	 */
	build()
	{
		const cylinderGeometry = new THREE.CylinderGeometry(0.005, 0.005, this.height);
		const mesh = new THREE.Mesh(cylinderGeometry, this.candleMaterial);
		this.add(mesh);
	}

	/**
	 * Creates the material of the candle
	 * @returns {void}
	 */
	materialize()
	{
		this.candleMaterial = new THREE.MeshPhongMaterial({
			color: this.color, 
		});
	}
}