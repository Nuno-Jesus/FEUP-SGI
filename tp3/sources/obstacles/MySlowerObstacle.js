import * as THREE from 'three';
import { MyObstacle } from './MyObstacle.js';

export class MySlowerObstacle extends MyObstacle
{
	static DURATION = 1.2;
	static SLOWDOWN = 0.3;

	constructor({ position = new THREE.Vector3(), shader = null })
	{
		super({ position: position });		
		this.touched = false;
		// this.shader = shader;
		// console.log(this.shader);
		this.timer = new THREE.Clock();
	}

	render()
	{
		this.core = new THREE.Mesh(
			new THREE.DodecahedronGeometry(1),
			new THREE.MeshPhongMaterial({
				color: 0xFF0000,
				transparent: true,
				opacity: 0.8
			})
		);
		this.ring = new THREE.Mesh(
			new THREE.TorusGeometry(1.4, 0.05, 16, 100),
			new THREE.MeshPhongMaterial({})
		);

		this.core.rotation.x = Math.PI / 2;
		this.ring.rotation.x = Math.PI / 2;

		this.add(this.ring);
		this.add(this.core);
	}

	collide(scene, reader)
	{
		const { car } = reader;

		if (this.touched || car.invincible)
			// return ;	
		console.log("MySlowerObstacle: car max speed reduced to " + car.maxSpeed * MySlowerObstacle.SLOWDOWN);
		this.originalMaxSpeed = car.maxSpeed;
		car.maxSpeed *= MySlowerObstacle.SLOWDOWN;
		car.speed = car.speed > car.maxSpeed ? car.maxSpeed : car.speed;
		this.touched = true;
		this.timer.start();
		this.explode(scene, reader);
	}

	update(scene, reader)
	{
		const { car } = reader;
			
		this.core.rotation.x += 0.01;
		this.core.rotation.y += 0.01;

		if (!this.touched)
			return ;
		if (this.timer.getElapsedTime() < MySlowerObstacle.DURATION)
			return ;
		console.log("MySlowerObstacle: car speed is back to normal.");
		car.maxSpeed = this.originalMaxSpeed;
		this.removeFromReader(reader);
	}
}