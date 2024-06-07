import * as THREE from 'three';

/**
 * @constructor
 * @param {THREE.Vector3} position The position of the button
 * @param {string} text The text of the button
 * @param {number} color The color of the button
 * @param {string} texpath The path to the texture of the button
 */
export class MyMenuButton extends THREE.Group
{
	constructor({ position = new THREE.Vector3(), text = "Button", color = 0xFFFFFF, texpath = null })
	{
		super();
		
		this.text = text;
		this.color = color;
		this.texpath = texpath;  
		this.render();
		this.position.set(position.x, position.y, position.z);
	}

	/**
	 * @brief Render the button
	 */
	render()
	{
		// Create a button
		const buttonGeometry = new THREE.PlaneGeometry(4, 2);
		const buttonTexture = new THREE.TextureLoader().load(this.texpath);
		const buttonMaterial = new THREE.MeshBasicMaterial({ 
			color: this.color,
			transparent: true,
			map: buttonTexture
		});
		const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);

		buttonMesh.name = this.text;
		this.add(buttonMesh);
	}
}