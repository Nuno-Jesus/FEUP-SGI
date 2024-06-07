import * as THREE from 'three';

export class MyStretchedCylinder extends THREE.Group
{
	/**
	 * @param {number} x the x position of the stretched cylinder
	 * @param {number} y the y position of the stretched cylinder
	 * @param {number} z the z position of the stretched cylinder
	 * @param {number} texture the texture of the stretched cylinder
	 * @param {number} color the color of the stretched cylinder
	 * @param {number} radius the radius of the stretched cylinder
	 * @param {number} distance the distance between the two ends of the stretched cylinder
	 * @param {number} width the width of the stretched cylinder
	 * @returns {void}
	 */
	constructor({x = 0, y = 0, z = 0, texture = 'textures/uv_grid_opengl.jpg', 
		color = 0xFFFFFF, radius = 0.06, distance = 0.5, width = 0.65})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.radius = radius;
		this.width = width;
		this.color = color;
		this.distance = distance;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the stretched cylinder to the group
	 * @returns {void}
	 */
	build()
	{
		const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.width, 32, 1, false, 0, Math.PI);
		const boxGeometry = new THREE.BoxGeometry(this.distance, 2 * this.radius, this.width);

		const front = new THREE.Mesh(cylinderGeometry, this.cylinderMaterial);
		front.castShadow = true;
		front.position.set(-this.distance / 2, 0, 0);
		front.rotation.set(Math.PI / 2, 0, Math.PI );

		const back = new THREE.Mesh(cylinderGeometry, this.cylinderMaterial);
		back.castShadow = true;
		back.position.set(this.distance / 2, 0, 0);
		back.rotation.set(Math.PI / 2, 0, 0 );

		const middle = new THREE.Mesh(boxGeometry, this.boxMaterial);
		middle.castShadow = true;
		middle.position.set(0, 0, 0);
		
		this.add(front);
		this.add(middle);
		this.add(back);
	}

	/**
	 * Creates the materials and loads the necessary textures to render the stretched cylinder
	 * @returns {void}
	 */
	materialize()
	{
		const boxTexture = new THREE.TextureLoader().load( this.texture );
		boxTexture.wrapS = THREE.RepeatWrapping;
		boxTexture.wrapT = THREE.RepeatWrapping;
		boxTexture.repeat.set(6, 4);

		const cylinderTexture = new THREE.TextureLoader().load( this.texture );
		cylinderTexture.wrapS = THREE.RepeatWrapping;
		cylinderTexture.wrapT = THREE.RepeatWrapping;
		cylinderTexture.repeat.set(6, 4);
		cylinderTexture.rotation = Math.PI / 2;

		this.boxMaterial = new THREE.MeshPhongMaterial({
			color: this.color,
			map: boxTexture,
		});
		this.cylinderMaterial = new THREE.MeshPhongMaterial({
			color: this.color,
			map: cylinderTexture,
		});
	}
}