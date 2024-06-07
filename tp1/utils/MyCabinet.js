import * as THREE from 'three';

export class MyCabinet extends THREE.Group
{
	/**
	 * @param {number} x the x position of the cabinet group
	 * @param {number} y the y position of the cabinet group
	 * @param {number} z the z position of the cabinet group
	 * @param {number} height the height of the cabinet
	 * @param {number} width the width of the cabinet
	 * @param {number} depth the depth of the cabinet
	 * @param {number} topMaterial the material of the cabinet top
	 * @param {number} color the color of the cabinet
	 */
	constructor({x = 0, y = 0, z = 0, height = 0.5, width = 0.3, depth = 0.3, 
		topMaterial = new THREE.MeshBasicMaterial(), color = 0xFFFFFF})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.height = height;
		this.width = width;
		this.depth = depth;
		this.topMaterial = topMaterial;
		this.color = color;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the cabinet to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildBottom();
		this.buildTop();
		this.buildHandle();
	}

	/**
	 * Builds the handle of the cabinet
	 * @returns {void}
	 */
	buildHandle()
	{
		const handleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 32);
		const handle = new THREE.Mesh(handleGeometry, this.handleMaterial);
		handle.position.set(this.width * 0.35, 0, -this.depth / 2);
		this.add(handle);
	}

	/**
	 * Builds the bottom of the cabinet
	 * @returns {void}
	 */
	buildBottom()
	{
		const boxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
		const box = new THREE.Mesh(boxGeometry, this.bottomMaterial);
		this.add(box);
	}

	/**
	 * Builds the top of the cabinet
	 * @returns {void}
	 */
	buildTop()
	{
		const boxGeometry = new THREE.BoxGeometry(this.width, 0.02, this.depth);
		const box = new THREE.Mesh(boxGeometry, this.topMaterial);
		box.receiveShadow = true;
		box.position.set(0, this.height / 2 + 0.02 / 2, 0);
		this.add(box);
	}

	/**
	 * Creates the materials for the cabinet
	 * @returns {void}
	 */
	materialize()
	{
		this.bottomMaterial = new THREE.MeshPhongMaterial({ 
			color: this.color,
		});
		this.handleMaterial = new THREE.MeshPhongMaterial({ 
			color: 0x333333,
			specular: 0xFFFFFF,
			shininess: 90,
		});
	}
}