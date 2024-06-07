import * as THREE from 'three';
import { MySpiralCurve } from '../utils/MySpiralCurve.js';
import { MyNurbsBuilder } from '../utils/MyNurbsBuilder.js';

export class MyFlower extends THREE.Group
{
	/**
	 * @param {number} x the x position of the flower
	 * @param {number} y the y position of the flower
	 * @param {number} z the z position of the flower
	 * @param {number} color the color of the flower
	 * @param {number} height the height of the flower
	 */
	constructor({x = 0, y = 0, z = 0, color = 0xFF0077, height = 1})
	{
		super();
		
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.height = height;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
		this.scale.set(0.3, 0.4, 0.3);
	}

	/**
	 * Assembles and adds the elements of the flower to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildStalk();
		this.buildPetals();
		this.buildPollen();
	}

	/**
	 * Builds the stalk of the flower
	 * @returns {void}
	 * */
	buildStalk()
	{
		const curve = new MySpiralCurve({height: this.height, numTurns: 1 });
		const stalkGeometry = new THREE.TubeGeometry( curve, 100, 0.05, 20, false );
		const stalk = new THREE.Mesh( stalkGeometry, this.stalkMaterial );
		stalk.castShadow = true;
		stalk.rotation.x = -Math.PI / 2;
		stalk.position.set(this.position.x, this.position.y, this.position.z );
		this.add(stalk);
	}

	/**
	 * Builds the petals of the flower
	 * @returns {void}
	 */
	buildPetals()
	{
		const points =
		[   // U = 0
			[ // V = 0..3
				[ -0.5,  1.0, 0.0, 1 ],
				[ -0.1,  0.5, 0.0, 1 ],
				[ -1.8, -0.5, 0.0, 1 ],
				[ -0.2, -1.0, 0.0, 	1 ],
			],
			// U = 1
			[ // V = 0..3
				[ -0.5,  1.0, 0.667, 1 ],
				[ -0.1,  0.5, 0.133, 1 ],
				[ -1.8, -0.5, 2.400, 1 ],
				[ -0.2, -1.0, 0.266, 1 ],
			],
			// U = 2			
			[ // V = 0..3
				[ 0.5,  1.0, 0.667, 1 ],
				[ 0.1,  0.5, 0.133, 1 ],
				[ 1.8, -0.5, 2.400, 1 ],
				[ 0.2, -1.0, 0.266, 1 ],
			],
			// U = 3
			[ // V = 0..3
				[ 0.5,  1.0, 0.0, 1 ],
				[ 0.1,  0.5, 0.0, 1 ],
				[ 1.8, -0.5, 0.0, 1 ],
				[ 0.2, -1.0, 0.0, 1 ],
			],
		];

		const geometry = MyNurbsBuilder.build(points, 3, 3, 32, 32);

		const leftHalf = new THREE.Mesh(geometry, this.petalMaterial);
		leftHalf.castShadow = true;
		leftHalf.scale.set(0.15, 0.15, 0.15);
		leftHalf.position.set(0.1, this.height, 0);

		const rightHalf = leftHalf.clone();
		rightHalf.rotation.set(0, Math.PI, 0);
		this.add(leftHalf, rightHalf);
	}

	/**
	 * Builds the pollen of the flower
	 * @returns {void}
	 */
	buildPollen()
	{
		const circleGeometry = new THREE.SphereGeometry( 0.06, 32, 32);
		const circle = new THREE.Mesh( circleGeometry, this.polenMaterial );
		circle.position.set(0.1, this.height, 0);
		circle.rotation.x = Math.PI / 3.0;
		this.add(circle);
	}

	/**
	 * Creates the flower materials
	 * @returns {void}
	 */
	materialize()
	{
		this.petalMaterial = new THREE.MeshPhongMaterial({
			color: this.color, 
			side: THREE.DoubleSide, 
		});
		this.petalMaterial2 = new THREE.MeshPhongMaterial({
			color: 0xFFFFFF, 
			side: THREE.DoubleSide, 
		});
		this.stalkMaterial = new THREE.MeshPhongMaterial({
			color: 0x00FF77, 
			side: THREE.DoubleSide, 
		});
		this.polenMaterial = new THREE.MeshPhongMaterial({
			color: 0xFFFF77, 
			side: THREE.DoubleSide, 
		});
	}
}