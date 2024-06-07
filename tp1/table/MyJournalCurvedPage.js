import * as THREE from 'three';
import { MyNurbsBuilder } from '../utils/MyNurbsBuilder.js';

export class MyJournalCurvedPage extends THREE.Object3D
{
	/**
	 * @param {number} x the x position of the journal page
	 * @param {number} y the y position of the journal page
	 * @param {number} z the z position of the journal page
	 * @param {string} texture the texture of the journal page
	 */
	constructor({x = 0, y = 0, z = 0, texture = 'textures/journal.jpg'})
	{
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
		this.scale.set(0.2, 0.2, 0.2);
	}

	/**
	 * Assembles and adds the elements of the journal page to the group
	 * @returns {void}
	 */
	build()
	{
		// 3 points in U to describe an parabolic curve
		// 2 points in V to connect 2 parabolic curves with straight lines
		const controlPoints =
		[   // U = 0
			[ // V = 0..1
				[ -0.7, -2.0, 0.0, 1 ],
				[ -0.7,  2.0, 0.0, 1 ]
			],
			// U = 1
			[ // V = 0..1
				[ -0.7, -2.0, 0.93, 1 ],
				[ -0.7,  2.0, 0.93, 1 ]
			],
			// U = 2
			[ // V = 0..1
				[ 0.7, -2.0, 0.93, 1 ],
				[ 0.7,  2.0, 0.93, 1 ]
			],
			// U = 3
			[ // V = 0..1
				[ 0.7, -2.0, 0.0, 1 ],
				[ 0.7,  2.0, 0.0, 1 ]
			]
		];

		const geometry = MyNurbsBuilder.build(controlPoints, 3, 1, 32, 32);
		const mesh = new THREE.Mesh(geometry, this.material);
		this.add(mesh);
	}

	/**
	 * Creates the materials and loads the necessary textures to render the journal page
	 * @returns {void}
	 */
	materialize()
	{
		const map = new THREE.TextureLoader().load( this.texture );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({ 
			map: map,
			side: THREE.DoubleSide,
			opacity: 0.90 
		});
	}
}