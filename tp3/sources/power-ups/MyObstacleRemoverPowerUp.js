import * as THREE from 'three';
import { MyPowerUp } from './MyPowerUp.js';

export class MyObstacleRemoverPowerUp extends MyPowerUp
{
	constructor({ position = new THREE.Vector3(), shader})
	{
		super({ position: position, shader: shader });

	}

	render()
	{
		this.core = new THREE.Mesh(
			new THREE.OctahedronGeometry(1),
			new THREE.MeshPhongMaterial({
				color: 0x00FF88,
				transparent: true,
				opacity: 0.8
			})
		);

		this.ring = new THREE.Mesh(
			new THREE.TorusGeometry(1.4, 0.05, 16, 100),
			this.shader.material
		);

		this.ring.rotation.x = Math.PI / 2;

		this.add(this.ring);
		this.add(this.core);
	}

	collide(scene, reader)
	{
		const rnd = Math.floor(Math.random() * (reader.obstacles.length - 1));
		scene.remove(reader.obstacles[rnd]);
		reader.obstacles.splice(rnd, 1);
		
		this.explode(scene, reader);
		this.removeFromReader(reader);
		console.log("MyObstacleRemoverPowerUp: removed obstacle #" + rnd);
	}

	update(scene, reader)
	{
		this.core.rotation.y += 0.01;
		this.core.rotation.x += 0.01;
	}

}