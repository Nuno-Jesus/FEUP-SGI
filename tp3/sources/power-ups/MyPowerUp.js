import * as THREE from 'three';

export class MyPowerUp extends THREE.Group
{
	constructor({ position = new THREE.Vector3(), shader = null })
	{
		super();

		this.shader = shader;

		this.render();
		this.calculateBoundingSphere();
		this.position.set(position.x, position.y, position.z);
	}

	calculateBoundingSphere()
	{
		const boundingBox = new THREE.Box3().setFromObject(this);
		const center = boundingBox.getCenter(new THREE.Vector3());
		this.boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere(center));
	}

	/**
	 * @brief this function is called at the end of the collide function. It
	 * removes the power up from the scene and from the MyReader array of powerups.
	 * @param {THREE.Scene} scene The THREE.Scene object
	 * @param {MyReader} reader Where all the game information is contained
	 * */
	explode(scene, reader)
	{
		scene.remove(this);
	}
	
	removeFromReader(reader)
	{
		const index = reader.powerups.indexOf(this);
		reader.powerups.splice(index, 1);
	}

	render()
	{
		
	}

	/**
	 * @brief collides the power-up's action. This functions's behavior is
	 * overriden by the power-up's derived classes. This function also removes the 
	 * power-up from the scene.
	 * @param {THREE.Scene} scene The THREE.Scene object
	 * @param {MyReader} reader Where all the game information is contained
	 */
	collide(scene, reader)
	{

	}

	update(scene, reader)
	{
		
	}
}