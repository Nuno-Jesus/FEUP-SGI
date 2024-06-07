import * as THREE from 'three';

export class MyCake extends THREE.Group
{
	/**
	 * @param {number} color the color of the cake
	 * @param {number} x the x position of the cake group
	 * @param {number} y the y position of the cake group 
	 * @param {number} z the z position of the cake group
	 * @param {number} height the height of the cake group
	 * @param {number} thetaLength the ammount of radians that the cake should extend to
	*/	
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, height = 0.1, thetaLength = 2 * Math.PI})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.height = height;
		this.thetaLength = thetaLength;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
	}

	/**
	 * Assembles and adds the elements of the cake to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildOutter();
		this.buildInner();
	}

	/**
	 * Builds the cake inner walls with planes
	 * @returns {void}
	 */
	buildInner()
	{
		const cakeInnerWallGeometry = new THREE.PlaneGeometry(0.30, this.height);
				
		const cakeInnerWall1 = new THREE.Mesh(cakeInnerWallGeometry, this.innerMaterial);
		cakeInnerWall1.rotation.set(0, -Math.PI / 2, 0);

		const cakeInnerWall2 = new THREE.Mesh(cakeInnerWallGeometry, this.innerMaterial);
		cakeInnerWall2.rotation.set(0, Math.PI / 2 + this.thetaLength, 0);

		this.add(cakeInnerWall1, cakeInnerWall2);
	}

	/**
	 * Builds the cake outter walls with a cylinder
	 * @returns {void}
	 */
	buildOutter()
	{
		const cylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, this.height, 32, 32, 
			false, 0, this.thetaLength);
		const cakeSideMesh = new THREE.Mesh(cylinderGeometry, this.outterMaterial);
		cakeSideMesh.castShadow = true;
		this.add(cakeSideMesh);
	}

	/**
	 * Creates the cake materials
	 * @returns {void}
	 */
	materialize()
	{
		this.outterMaterial = new THREE.MeshPhongMaterial({
			color: this.color
		});
		this.innerMaterial = new THREE.MeshPhongMaterial({
			color: 0xFFAA00
		});
	}
}