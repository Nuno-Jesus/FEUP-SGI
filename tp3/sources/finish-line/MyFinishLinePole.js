import * as THREE from 'three';

/**
 * @constructor
 * @param {THREE.Vector3} position The position of the pole 
 */
export class MyFinishLinePole extends THREE.Group
{
	constructor({ position = new THREE.Vector3() })
	{
		super();
		this.render();
		this.position.copy(position);
	}

	/*
	 * Render the pole
	 */
	render()
	{
		const texture = new THREE.TextureLoader().load('../images/checkerboard.png');
		
		this.pole = new THREE.Mesh(
			new THREE.CylinderGeometry(1, 1, 8),
			new THREE.MeshBasicMaterial({ 
				color: 0xFFFFFF,
				map: texture
			})
		);

		this.top = new THREE.Mesh(
			new THREE.SphereGeometry(1, 32, 32),
			new THREE.MeshBasicMaterial({ 
				color: 0xFFFFFF,
				map: texture
			})
		);

		this.top.position.y = 4;

		this.add(this.pole);
		this.add(this.top);
	}
}