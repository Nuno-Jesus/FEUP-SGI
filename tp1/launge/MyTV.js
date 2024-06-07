import * as THREE from 'three';

export class MyTV extends THREE.Group
{
	/**
	 * @param {number} x the x position of the TV
	 * @param {number} y the y position of the TV
	 * @param {number} z the z position of the TV
	 * @param {number} height the height of the TV
	 * @param {number} width the width of the TV
	 * @param {number} depth the depth of the TV
	 * */
	constructor({x = 0, y = 0, z = 0, height = 1.8, width = 3.6, depth = 0.1})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.height = height;
		this.width = width;
		this.depth = depth;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the TV parts to the group
	 * @returns {void}
	 * */
	build()
	{
		this.buildFrame();
		this.buildScreen();
	}

	/**
	 * Assembles the TV's outter frame
	 * @returns {void}
	 * */
	buildFrame()
	{
		const boxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
		const boxMesh = new THREE.Mesh(boxGeometry, this.frameMaterial);
		this.add(boxMesh);
	}

	/**
	 * Assembles the TV's screen
	 * @returns {void}
	 * */
	buildScreen()
	{
		const boxGeometry = new THREE.BoxGeometry(this.width - 0.05, this.height - 0.05, 0.01);
		const boxMesh = new THREE.Mesh(boxGeometry, this.screenMaterial);
		boxMesh.position.set(0, 0, -0.05);
		this.add(boxMesh);
	}

	/**
	 * Assembles the TV's materials
	 * @returns {void}
	 * */
	materialize()
	{
		this.frameMaterial = new THREE.MeshPhongMaterial({ 
			color: 0x222222,
			specular: 0x777777,
			shininess: 20,
		});
		this.screenMaterial = new THREE.MeshPhongMaterial({ 
			color: 0x000000,
			specular: 0xCCCCCC,
			shininess: 20,
		});
	}
}