import * as THREE from 'three';

export class MyPlate extends THREE.Group
{
	/**
	 * @param {number} x the x position of the plate group
	 * @param {number} y the y position of the plate group 
	 * @param {number} z the z position of the plate group
	 * @param {number} color the color of the plate
	*/
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF})
	{
		super();
		this.x = x;
		this.y = y; 
		this.z = z;
		this.color = color;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	build()
	{
		const plateGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.03);
		const mesh = new THREE.Mesh(plateGeometry, this.plateMaterial);
		mesh.castShadow = true;
		this.add(mesh);
	}

	materialize()
	{
		this.plateMaterial = new THREE.MeshPhongMaterial({ 
			color: this.color, 
			specular: 0xFFFFFF, 
			shininess: 300, 
			side: THREE.DoubleSide
		});
	}
}