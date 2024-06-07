import * as THREE from 'three';
import { MyFactory } from './MyFactory.js';

export class MyPark extends THREE.Group
{
	constructor({ })
	{
		super();

		this.render();

	}

	render()
	{
		const texture = new THREE.TextureLoader().load('../images/track-1.jpg');
		const material = new THREE.MeshBasicMaterial({ map: texture });

		const park = new THREE.Mesh(
			new THREE.BoxGeometry(5, 0.1, 5),
			material,
		);

		const park1 = park.clone();
		const park2 = park.clone();


		park1.position.set(15, 0, 5);
		park2.position.set(15, 0, -5);

		this.add(park1);
		this.add(park2);

		const obstacle1 = MyFactory.generateObstacle(new THREE.Vector3(15, 1.2, 5), null, 0);
		const obstacle2 = MyFactory.generateObstacle(new THREE.Vector3(15, 1.2, -5), null, 1);

		this.add(obstacle1);
		this.add(obstacle2);


	}
}