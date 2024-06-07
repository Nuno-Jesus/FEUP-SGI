import * as THREE from 'three';
import { MyNurbsBuilder } from '../utils/MyNurbsBuilder.js';

export class MyJar extends THREE.Group
{
	/**
	 * 
	 * @param {x} number the x position of the jar
	 * @param {y} number the y position of the jar
	 * @param {z} number the z position of the jar
	 * @param {color} number the color of the jar
	 * @param {opacity} number the opacity of the jar 
	 */
	constructor({x = 0, y = 0, z = 0, color = 0xFFFFFF, opacity = 1.00})
	{
		super();
		
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
		this.opacity = opacity;
		this.jarMaterial = new THREE.MeshPhongMaterial({
			transparent: this.opacity < 1.00,
			opacity: this.opacity,
			color: this.color, 
			side: THREE.DoubleSide, 
			shininess: 100, 
			specular: 0xFFFFFF,
		});
		this.jarMaterial.castShadow = true;
		this.build();
		this.position.set(this.x, this.y, this.z);
		
	}

	/**
	 * Assembles and adds the jar parts to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildWalls();
		this.buildBottom();
	}

	/**
	 * Builds the jar walls using a NURBS surface
	 * @returns {void}
	*/
	buildWalls()
	{
		const controlPoints =
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

		const geometry = MyNurbsBuilder.build(controlPoints, 3, 3, 32, 32);
		
		const leftHalf = new THREE.Mesh(geometry, this.jarMaterial);
		leftHalf.castShadow = true;

		const rightHalf = new THREE.Mesh(geometry, this.jarMaterial);
		rightHalf.castShadow = true;
		rightHalf.rotation.set(0, Math.PI, 0);

		this.add(leftHalf, rightHalf);
	}

	/**
	 * Builds the jar bottom circular cap
	 * @returns {void}
	*/
	buildBottom()
	{	
		const bottomGeometry = new THREE.CircleGeometry(0.21, 32);
		const bottomCap = new THREE.Mesh(bottomGeometry, this.jarMaterial);

		bottomCap.rotation.set(Math.PI / 2, 0, 0);
		bottomCap.position.set(0, -1.0, 0);
		
		this.add(bottomCap);
	}
}