import * as THREE from 'three';
import { MyJar } from '../launge/MyJar.js';
import { MyFlower } from './MyFlower.js';

export class MyFlowerJar extends THREE.Group
{
	/**
	 * @param {number} x the x position of the flower jar
	 * @param {number} y the y position of the flower jar
	 * @param {number} z the z position of the flower jar
	 */
	constructor({x = 0, y = 0, z = 0})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the flower jar to the group
	 * @returns {void}
	 */
	build()
	{
		const jar = new MyJar({ y: -0.03, opacity: 0.95 });
		jar.scale.set(0.21, 0.18, 0.22);
		
		const flowers = [];
		flowers[0] = new MyFlower({ y: -0.2, height: 1.0});
		flowers[1] = new MyFlower({ x: 0.035, y: -0.2, z: 0.025, height: 1.3 });
		flowers[2] = new MyFlower({ x: -0.03, y: -0.2, height: 1.6 });
		flowers[3] = new MyFlower({ x: -0.035, y: -0.2, z: 0.035, height: 1.15 });
		flowers[4] = new MyFlower({ x: 0, y: -0.2, z: -0.04, height: 1.35 });
		flowers[1].rotation.set(0, Math.PI / 3, 0);
		flowers[2].rotation.set(0, Math.PI, 0);
		flowers[3].rotation.set(0, -Math.PI, 0);
		flowers[4].rotation.set(0, -Math.PI - 0.2, 0);
		
		this.add(jar);
		flowers.forEach(flower => this.add(flower));
	}
}