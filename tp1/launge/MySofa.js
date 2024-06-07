import * as THREE from 'three';
import { MyStretchedCylinder } from '../utils/MyStretchedCylinder.js';

export class MySofa extends THREE.Group
{
	/**
	 * @param {number} x the x position of the sofa
	 * @param {number} y the y position of the sofa
	 * @param {number} z the z position of the sofa
	 * @param {number} color the color of the sofa
	 * @param {number} width the width of the sofa
	 * @param {number} height the height of the sofa
	 * @param {string} texture the texture file of the sofa
	 */
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, width = 1.0, height = 0.3, texture = 'textures/uv_grid_opengl.jpg'})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.width = width;
		this.height = height;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the sofa parts to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildBottom();
		this.buildSeats();
		this.buildBackRests();
		this.buildSideRests();
	}

	/**
	 * Builds the sofa bottom, which sits on the floor
	 * @returns {void}
	 * */
	buildBottom()
	{
		const boxGeometry = new THREE.BoxGeometry(this.width, this.height, 4.2);
		const box = new THREE.Mesh(boxGeometry, this.sofaMaterial);
		this.add(box);
	}

	/**
	 * Builds the sofa seats, the part where people sit
	 * @returns {void}
	 * */
	buildSeats()
	{
		const seats = [];

		seats[0] = new MyStretchedCylinder({ y: 0.25, texture: this.texture, color: this.color, 
			radius: 0.1, distance: 1.2, width: this.width });
		seats[1] = new MyStretchedCylinder({ y: 0.25, z: 1.4, texture: this.texture, color: this.color, 
			radius: 0.1, distance: 1.2, width: this.width });
		seats[2] = new MyStretchedCylinder({ y: 0.25, z: -1.4, texture: this.texture, color: this.color, 
			radius: 0.1, distance: 1.2, width: this.width });
		seats.forEach(seat => seat.rotation.set(0, Math.PI / 2, 0));
		seats.forEach(seat => this.add(seat));
	}

	/**
	 * Builds the sofa back rests, the part where people lean on
	 * @returns {void}
	 * */
	buildBackRests()
	{
		const backRests = [];

		backRests[0] = new MyStretchedCylinder({ x: -0.6, y: 0.45, texture: this.texture, color: this.color, 
			radius: 0.1, distance: 1.2, width: 1.1 * this.width });
		backRests[1] = new MyStretchedCylinder({ x: -0.6, y: 0.45, z: 1.4, texture: this.texture, color: this.color, 
			radius: 0.1, distance: 1.2, width: 1.1 * this.width });
		backRests[2] = new MyStretchedCylinder({ x: -0.6, y: 0.45, z: -1.4, texture: this.texture, color: this.color, 
			radius: 0.1, distance: 1.2, width: 1.1 * this.width });
		backRests.forEach(seat => seat.rotation.set(0.5 * Math.PI, 0.2, Math.PI / 2));
		backRests.forEach(seat => this.add(seat));
	}

	/**
	 * Builds the sofa side rests, the part where people rest their arms on
	 * @returns {void}
	 * */
	buildSideRests()
	{
		const sideRests = [];

		sideRests[0] = new MyStretchedCylinder({ y: 0.2, z: 2.1, texture: this.texture, color: this.color, 
			radius: 0.1, distance: this.width, width: 0.95 });
		sideRests[1] = new MyStretchedCylinder({ y: 0.2, z: -2.1, texture: this.texture, color: this.color,
			radius: 0.1, distance: this.width, width: 0.95 });
		sideRests.forEach(rest => rest.rotation.set(Math.PI / 2, 0, 0));
		sideRests.forEach(rest => this.add(rest));
	}

	/**
	 * Assembles the sofa's material and loads any necessary texture
	 * @returns {void}
	 */
	materialize()
	{
		const texture = new THREE.TextureLoader().load(this.texture);
		texture.wrapS = THREE.MirroredRepeatWrapping;
		texture.wrapT = THREE.MirroredRepeatWrapping;
		texture.repeat.set(3, 1);

		this.sofaMaterial = new THREE.MeshPhongMaterial({
			color: this.color,
			side: THREE.DoubleSide,
			map: texture,
		});
	}
}