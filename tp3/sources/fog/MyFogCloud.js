import * as THREE from 'three';

/**
 * @constructor
 * @param {THREE.Vector3} position The position of the fog cloud
 * @param {THREE.Texture} texture The texture of the fog cloud 
 */
export class MyFogCloud extends THREE.Group
{
	constructor({ position = new THREE.Vector3(), texture })
	{
		super();

		this.texture = texture;
		this.render();
		this.position.set(...position.toArray());
	}

	/**
	 * @brief Render the fog cloud
	 */
	render()
	{
		const cloudGeo = new THREE.SphereGeometry( 8 );
		const cloudMaterial = new THREE.MeshPhongMaterial({
			map: this.texture,
			transparent: true,
			opacity: 0.65,
			side: THREE.DoubleSide,
			specular: 0x000000,
		});

		this.add(new THREE.Mesh(cloudGeo, cloudMaterial));
	}
}