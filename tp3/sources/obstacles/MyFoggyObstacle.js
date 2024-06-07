import * as THREE from 'three';
import { MyObstacle } from './MyObstacle.js';
import { MyFogCloud } from '../fog/MyFogCloud.js';

export class MyFoggyObstacle extends MyObstacle
{
	static DURATION = 3;
	static CLOUDS = 400;
	static FOG_AREA = 150;

	constructor({ position = new THREE.Vector3() })
	{
		super({ position: position });

		this.touched = false;
		this.timer = new THREE.Clock();
		this.clouds = [];
		this.cloudTex = new THREE.TextureLoader().load( '../../textures/cloud.jpg' );
	}

	render()
	{
		this.core = new THREE.Mesh(
			new THREE.OctahedronGeometry(1),
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

		this.ring.rotation.x = Math.PI / 2;

		this.add(this.core);
		this.add(this.ring);
	}

	collide(scene, reader)
	{	
		const { car } = reader;

		if (this.touched || car.invincible)
			return ;	
		console.log("MyFoggyObstacle: activated fog.");
		this.touched = true;
		this.timer.start();
		this.generateFog(scene);
		this.explode(scene, reader);
	}

	generateFog(scene)
	{
		for (let p = 0; p < MyFoggyObstacle.CLOUDS; p++) {
			const position = new THREE.Vector3(
				Math.random() * MyFoggyObstacle.FOG_AREA - MyFoggyObstacle.FOG_AREA / 2, 
				0, 
				Math.random() * MyFoggyObstacle.FOG_AREA - MyFoggyObstacle.FOG_AREA / 2
			);
			const cloud = new MyFogCloud({ 
				position: position, 
				texture: this.cloudTex
			});
			this.clouds.push(cloud);
			scene.add(cloud);
		}
	}

	update(scene, reader)
	{	
		this.core.rotation.x += 0.01;
		this.core.rotation.z += 0.01;

		if (!this.touched)
			return ;
		if (this.timer.getElapsedTime() < MyFoggyObstacle.DURATION)
			return ;
		scene.fog = null;
		this.clouds.forEach((cloud) => scene.remove(cloud) );
		this.removeFromReader(reader);
		console.log("MyFoggyObstacle: fog cleared.");
	}
}