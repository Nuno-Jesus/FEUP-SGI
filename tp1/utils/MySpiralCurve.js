import * as THREE from 'three';

// Define your custom curve class
export class MySpiralCurve extends THREE.Curve
{
	/**
	 * @param {number} radius the radius of the spiral
	 * @param {number} height the height of the spiral
	 * @param {number} numTurns the number of turns of the spiral
	 * @param {number} scale the scale of the spiral
	 */
	constructor({radius = 0.1, height = 0.6, numTurns = 5, scale = 1})
	{
	  super();
  
	  this.radius = radius;
	  this.height = height;
	  this.numTurns = numTurns;
	  this.scale = scale;
	}
  
	/**
	 * Returns the point in the spiral curve at a given t value (used by the TubeGeometry class)
	 * @param {number} t the t value
	 * @returns {THREE.Vector3} the point in the spiral curve at a given t value
	 */
	getPoint(t)
	{
	  const x = this.radius * Math.cos(this.numTurns * 2 * Math.PI * t);
	  const y = this.radius * Math.sin(this.numTurns * 2 * Math.PI * t);
	  const z = t * this.height;
  
	  return new THREE.Vector3(x, y, z).multiplyScalar(this.scale);
	}
}