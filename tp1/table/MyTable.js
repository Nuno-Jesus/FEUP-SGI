import * as THREE from 'three';

export class MyTable extends THREE.Group
{
	/**
	 * @param {number} x the x position of the table group
	 * @param {number} y the y position of the table group 
	 * @param {number} z the z position of the table group
	 * @param {number} color the color of the table
	 * @param {number} width the width of the table
	 * @param {number} height the height of the table
	 * @param {number} depth the depth of the table
	*/
	constructor({x = 0, y = 0, z = 0, color = 0xF6E1C3, width = 4, height = 1, depth = 2,
		texture = 'textures/wood.jpg'})
	{
		super();
		this.x = x;
		this.y = y; 
		this.z = z;
		this.color = color;
		this.height = height;
		this.width = width;
		this.depth = depth;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the table to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildLegs();
		this.buildTableTop();
	}

	/**
	 * Builds the legs of the table
	 * @returns {void}
	 */
	buildLegs()
	{
		const legs = new Array(4);
		const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.05, this.height);

		for (let i = 0; i < 4; i++)
		{
			legs[i] = new THREE.Mesh(cylinderGeometry, this.legMaterial);
			legs[i].castShadow = true;
		}
				
		legs[0].position.set(0.3 * this.depth, this.height / 2, 0.4 * this.width);
		legs[1].position.set(-0.3 * this.depth, this.height / 2, 0.4 * this.width);
		legs[2].position.set(-0.3 * this.depth, this.height / 2, -0.4 * this.width);
		legs[3].position.set(0.3 * this.depth, this.height / 2, -0.4 * this.width);

		legs.forEach(leg => this.add(leg));
	}

	/**
	 * Builds the table top
	 * @returns {void}
	 */
	buildTableTop()
	{
		const boxGeometry = new THREE.BoxGeometry(this.width, 0.1, this.depth);
		const box = new THREE.Mesh(boxGeometry, this.tableMaterial);
		box.receiveShadow = true;
		box.castShadow = true;
		box.rotation.set(0, Math.PI / 2, 0);
		box.position.set(0, this.height, 0);
		this.add(box);
	}

	/**
	 * Creates the materials for the table
	 * @returns {void}
	 */
	materialize()
	{
		this.tableMaterial = new THREE.MeshPhongMaterial({
			color: this.color,
			map: new THREE.TextureLoader().load(this.texture),
		});
		this.legMaterial = new THREE.MeshPhongMaterial({
			color: 0x333333,
			specular: 0xAAAAAA,
			shininess: 30,
		});
	}
}
