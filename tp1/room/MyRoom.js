import * as THREE from 'three';

export class MyRoom extends THREE.Group
{
	/**
	 * @param {number} x the x position of the room
	 * @param {number} y the y position of the room
	 * @param {number} z the z position of the room
	 * @param {number} color the color of the room
	 * @param {number} width the width of the room
	 * @param {number} depth the depth of the room
	 * @param {number} height the height of the room
	 * @param {string} floorTexture the texture file of the room floor
	*/	
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, width = 10, depth = 10, height = 4, floorTexture = 'textures/wooden_floor.jpg'})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.depth = depth;
		this.height = height;
		this.color = color;
		this.floorTexture = floorTexture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the room to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildWalls();
		this.buildFloor();
	}

	/**
	 * Builds the walls of the room
	 * @returns {void}
	 */
	buildWalls()
	{
		const wallWidthGeometry = new THREE.PlaneGeometry(this.width, this.height);
		const wallDepthGeometry = new THREE.PlaneGeometry(this.depth, this.height);
		
		const wallLeft = new THREE.Mesh(wallWidthGeometry, this.wallMaterial);
		wallLeft.rotation.y = Math.PI;
		wallLeft.position.set(0, this.height / 2, this.depth / 2);
		
		const wallRight = new THREE.Mesh(wallWidthGeometry, this.wallMaterial);
		wallRight.position.set(0, this.height / 2, -this.depth / 2);
		
		const wallBack = new THREE.Mesh(wallDepthGeometry, this.wallMaterial);
		wallBack.rotation.y = Math.PI / 2;
		wallBack.position.set(-this.width / 2, this.height / 2, 0);
		
		const wallFront = new THREE.Mesh(wallDepthGeometry, this.wallMaterial);
		wallFront.rotation.y = -Math.PI / 2;
		wallFront.position.set(this.width / 2, this.height / 2, 0);
		
		this.add(wallLeft, wallRight, wallBack, wallFront);
	}
	
	/**
	 * Builds the floor of the room
	 * @returns {void}
	 */
	buildFloor()
	{
		const floorGeometry = new THREE.PlaneGeometry(this.width, this.depth);

		const floor = new THREE.Mesh(floorGeometry, this.floorMaterial);
		floor.receiveShadow = true;
		floor.rotation.set(-Math.PI / 2, 0, 0);
		floor.position.set(0, 0, 0);
		this.add(floor);
	}

	/**
	 * Creates the materials of the room and loads any needed external texture files
	 * @returns {void}
	 */
	materialize()
	{
		const texture = new THREE.TextureLoader().load( this.floorTexture );

		this.wallMaterial = new THREE.MeshPhongMaterial({
			color: this.color, 
			specular: "0x000000",
			// map: new THREE.TextureLoader().load('textures/brick.jpg')
		});
		this.floorMaterial = new THREE.MeshPhongMaterial({
			map: texture,
			color: 0xFFFFFF, 
			specular: "0x000000",
		});
	}
}