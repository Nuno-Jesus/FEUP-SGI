import * as THREE from 'three';
import { MyCabinet } from '../utils/MyCabinet.js';

export class MyTVCabinet extends THREE.Group
{
	/**
	 * @param {number} x the x position of the TV cabinet
	 * @param {number} y the y position of the TV cabinet
	 * @param {number} z the z position of the TV cabinet
	 * @param {string} topTexture the texture file of the top material of the TV cabinet
	 * */
	constructor({x = 0, y = 0, z = 0, topTexture = 'textures/wood.jpg'})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.topTexture = topTexture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Builds the TV cabinet
	 * @returns {void}
	 */
	build()
	{
		const cabinets = [];

		cabinets[0] = new MyCabinet({ z: -0.4, height: 0.4, width: 0.8, topMaterial: this.material });
		cabinets[1] = new MyCabinet({ z: 0.4, height: 0.4, width: 0.8, topMaterial: this.material });
		cabinets[2] = new MyCabinet({ z: 1.2, height: 0.4, width: 0.8, topMaterial: this.material });
		cabinets[3] = new MyCabinet({ z: -1.2, height: 0.4, width: 0.8, topMaterial: this.material });
		cabinets[4] = new MyCabinet({ z: -2.0, height: 0.4, width: 0.8, topMaterial: this.material });
		cabinets[5] = new MyCabinet({ z: 2.0, height: 0.4, width: 0.8, topMaterial: this.material });
		cabinets.forEach(cabinet => cabinet.rotation.set(0, Math.PI / 2, 0));
		cabinets.forEach(cabinet => this.add(cabinet));
	}

	/**
	 * Assembles the TV cabinet's material and loads any necessary texture
	 * @returns {void}
	 */
	materialize()
	{
		this.material = new THREE.MeshPhongMaterial({ 
			color: 0xFFFFFF,
			specular: 0xFFFFFF,
			shininess: 30,
			map: new THREE.TextureLoader().load( this.topTexture ),
		});
	}
}