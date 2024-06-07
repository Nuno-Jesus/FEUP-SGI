import * as THREE from 'three';

export class MyDoor extends THREE.Group
{
	/**
	 * @param {number} x the x position of the door
	 * @param {number} y the y position of the door
	 * @param {number} z the z position of the door
	 * @param {number} height the height of the door
	 * @param {number} width the width of the door
	 * @param {string} texture the texture file of the door
	 */
	constructor({x = 0, y = 0, z = 0, height = 2.6, width = 1.5, texture = 'textures/uv_grid_opengl.jpg'})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.height = height;
		this.width = width;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the door to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildDoorFrame();
		this.buildDoor();
		this.buildHandles();
	}

	/**
	 * Builds the door frame
	 * @returns {void}
	 */
	buildDoorFrame()
	{		
		const upperFrame = new THREE.BoxGeometry(this.width, 0.05, 0.06);
		const sideFrame = new THREE.BoxGeometry(0.05, this.height + 0.05, 0.06);
		const borders = [];

		borders[0] = new THREE.Mesh(upperFrame, this.frameMaterial);
		borders[0].position.set(0, this.height / 2, 0);

		borders[1] = new THREE.Mesh(sideFrame, this.frameMaterial);
		borders[1].position.set(this.width / 2, 0, 0);

		borders[2] = new THREE.Mesh(sideFrame, this.frameMaterial);
		borders[2].position.set(-this.width / 2, 0, 0);

		borders.forEach(border => this.add(border));
	}

	/**
	 * Builds the door
	 * @returns {void}
	 */
	buildDoor()
	{
		const boxGeometry = new THREE.PlaneGeometry(this.width, this.height);
		const door = new THREE.Mesh(boxGeometry, this.doorMaterial);
		this.add(door);
	}

	/**
	 * Builds the door handles
	 * @returns {void}
	 */
	buildHandles()
	{
		const handleGeometry = new THREE.CylinderGeometry(0.04, 0.04, this.height - 0.2, 32, 32, false, 1.5 * Math.PI, Math.PI);
		const handle = new THREE.Mesh(handleGeometry, this.handleMaterial);
		handle.position.set(-0.1, 0, 0);
		this.add(handle);
		
		const handle2 = handle.clone();
		handle2.position.set(0.1, 0, 0);
		this.add(handle2);
	}

	/**
	 * Creates the materials and loads any external file textures
	 * @returns {void}
	 */
	materialize()
	{
		const texture = new THREE.TextureLoader().load(this.texture);

		this.doorMaterial = new THREE.MeshPhongMaterial({ 
			map: texture, 
		});
		this.frameMaterial = new THREE.MeshPhongMaterial({ 
			color: 0x999999
		});
		this.handleMaterial = new THREE.MeshPhongMaterial({
			color: 0x999999,
			specular: 0xBBBBBB,
			shininess: 10,
			side: THREE.DoubleSide
		});
	}
}