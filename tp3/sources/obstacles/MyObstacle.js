import * as THREE from 'three';

export class MyObstacle extends THREE.Group
{
	constructor({ position = new THREE.Vector3() })
	{
		super();

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

	explode(scene, reader)
	{
		scene.remove(this);
	}
	
	removeFromReader(reader)
	{
		const index = reader.obstacles.indexOf(this);
		reader.obstacles.splice(index, 1);
	}

	render()
	{
		
	}

	collide(scene, reader)
	{
		
	}

	update(scene, reader)
	{
		
	}
}