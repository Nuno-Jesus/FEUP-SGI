import * as THREE from 'three';

/**
 * @constructor
 * @param {THREE.Vector3} p1 the coordinates of the first point
 * @param {THREE.Vector3} p2 the coordinates of the second point
 * @param {THREE.Vector3} p3 the coordinates of the third point
 */
export class MyTriangle extends THREE.BufferGeometry
{
	constructor(p1, p2, p3)
	{
		super();

		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.initBuffers();
	}

	/**
	 * @brief Initializes the normals, colors and indexes of the buffer gemoetry
	 * to assemble a triangle
	 */
	initBuffers()
	{

		//CALCULATING NORMALS 
		var vectorAx = this.p2.x - this.p1.x
		var vectorAy = this.p2.y - this.p1.y
		var vectorAz = this.p2.z - this.p1.z

		var vectorBx = this.p3.x - this.p1.x
		var vectorBy = this.p3.y - this.p1.y
		var vectorBz = this.p3.z - this.p1.z

		var crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		var crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		var crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy

		var normal = new THREE.Vector3(crossProductX, crossProductY, crossProductZ)
		normal.normalize()

		//TEXTURE COORDINATES
		let a = this.p1.distanceTo(this.p2);
		let b = this.p2.distanceTo(this.p3);
		let c = this.p1.distanceTo(this.p3);


		let cos_ac = (a * a - b * b + c * c) / (2 * a * c)
		let sin_ac = Math.sqrt(1 - cos_ac * cos_ac)

		const vertices = new Float32Array([
			...this.p1.toArray(),	//0
			...this.p2.toArray(),	//1
			...this.p3.toArray(),	//2

		]);

		const indices = [
			0, 1, 2
		];

		const normals = [
			...normal.toArray(),
			...normal.toArray(),
			...normal.toArray(),
		];

		const uvs = [
			0, 0,
			a , 0,
			c * cos_ac, c * sin_ac
		]

		this.setIndex(indices);
		this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
		this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	}
}