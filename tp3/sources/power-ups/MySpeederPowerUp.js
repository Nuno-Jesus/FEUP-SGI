import * as THREE from 'three';
import { MyPowerUp } from './MyPowerUp.js';

export class MySpeederPowerUp extends MyPowerUp
{
	static DURATION = 5;

	constructor({ position = new THREE.Vector3(), shader = null })
	{
		super({ position: position, shader: shader });

		this.touched = false;
		this.timer = new THREE.Clock();
	}

	render()
	{
		this.core = new THREE.Mesh(
			new THREE.SphereGeometry(1),
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

		this.core.rotation.x = Math.PI / 2;
		this.ring.rotation.x = Math.PI / 2;

		this.add(this.ring);
		this.add(this.core);
	}

	collide(scene, reader)
	{
		const { car } = reader;

		if (this.touched)
			return ;
		console.log("MySpeederPowerUp: car max speed increased to " + car.maxSpeed * 2);
		car.maxSpeed *= 2;
		this.touched = true;
		this.timer.start();
		this.explode(scene, reader);
	}

	update(scene, reader)
	{
		const { car } = reader;

		this.core.rotation.y += 0.01;

		if (!this.touched)
			return ;
		if (this.timer.getElapsedTime() < MySpeederPowerUp.DURATION)
			return ;
		console.log("MySpeederPowerUp: car max speed back to " + car.maxSpeed / 2);
		car.maxSpeed /= 2;
		car.speed = car.speed > car.maxSpeed ? car.maxSpeed : car.speed;
		this.removeFromReader(reader);
	}
}