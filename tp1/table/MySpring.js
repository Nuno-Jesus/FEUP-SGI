import * as THREE from 'three';
import { MySpiralCurve } from '../utils/MySpiralCurve.js';

export class MySpring extends THREE.Group
{
	/**
	 * @param {number} x the x position of the spring
	 * @param {number} y the y position of the spring
	 * @param {number} z the z position of the spring
	 * @param {number} radius the radius of the spring
	 * @param {number} scale the scale of the spring
	 */
	constructor({x = 0, y = 0, z = 0, radius = 0.1, scale = 0.3})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.radius = radius;
		this.scaleFactor = scale;
		this.numberOfSamples = 200;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
		this.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
	}

	/**
	 * Assembles and adds the elements of the spring to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildSpringBody();
		this.buildSpringCaps();
	}

	/**
	 * Builds the spring spiral body
	 * @returns {void}
	 */
	buildSpringBody()
	{
		const springBody = new MySpiralCurve({ radius: this.radius,});
		const springGeometry = new THREE.TubeGeometry( springBody, 100, 0.05, 20, false );
		const spring = new THREE.Mesh( springGeometry, this.springMaterial );
		this.add(spring);
	}

	/**
	 * Builds the spring caps
	 * @returns {void}
	 */
	buildSpringCaps()
	{
		const circleGeometry = new THREE.CircleGeometry( 0.05, this.numberOfSamples );
		
		let circle = new THREE.Mesh( circleGeometry, this.springMaterial );
		circle.position.set(0.2, 0.0, 0.6);
		circle.rotation.x = Math.PI / 2.0 + 0.1;
		this.add(circle);
		
		circle = new THREE.Mesh( circleGeometry, this.springMaterial );
		circle.position.set(0.2, 0.0, 0.0);
		circle.rotation.x = Math.PI / 2.0 + 0.1;
		this.add(circle);
	}

	/**
	 * Creates the materials used in the spring
	 * @returns {void}
	 */
	materialize()
	{
		this.springMaterial = new THREE.MeshNormalMaterial({ 
			side: THREE.DoubleSide
		});
	}
}