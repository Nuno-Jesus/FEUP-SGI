import * as THREE from 'three';
import { MyStretchedCylinder } from '../utils/MyStretchedCylinder.js';

export class MyChair extends THREE.Group
{
	/**
	 * @param {number} x the x position of the chair
	 * @param {number} y the y position of the chair
	 * @param {number} z the z position of the chair
	 * @param {number} color the color of the chair
	 * @param {string} texture the texture file of the chair
	 */
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, texture = 'textures/chair.jpg'})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembly and adds the elements of the chair to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildLegs();
		this.buildSeat();
		this.buildBack();
	}

	/**
	 * Builds the legs of the chair
	 * @returns {void}
	 */
	buildLegs()
	{
		const legs = [];
		const legGeometry = new THREE.CylinderGeometry(0.05, 0.03, 0.5);

		for (let i = 0; i < 4; i++)
		{
			legs[i] = new THREE.Mesh(legGeometry, this.legMaterial);
			legs[i].castShadow = true;
			legs[i].rotation.set(0, Math.PI / 4, 0);
		}
	
		legs[0].position.set(-0.25, 0, -0.25);
		legs[1].position.set(0.25, 0, -0.25);
		legs[2].position.set(0.25, 0, 0.25);
		legs[3].position.set(-0.25, 0, 0.25);

		this.add(legs[0], legs[1], legs[2], legs[3]);
	}

	/**
	 * Builds the seat of the chair
	 * @returns {void}
	 */
	buildSeat()
	{
		const seat = new MyStretchedCylinder({ y: 0.3, texture: this.texture, distance: 0.55 });
		this.add(seat);
	}

	/**
	 * Builds the back of the chair
	 * @returns {void}
	 */
	buildBack()
	{
		const back = new MyStretchedCylinder({ x: 0.35, y: 0.75, texture: this.texture, distance: 0.7 });
		back.rotation.set(0, 0, 0.45 * Math.PI);
		this.add(back);
	}

	/**
	 * Creates the materials of the chair and loads any needed external texture files
	 * @returns {void}
	 */
	materialize()
	{		
		this.legMaterial = new THREE.MeshPhongMaterial({
			color: 0x000000,
			specular: 0xAAAAAA,
			shininess: 10
		});
	}
}