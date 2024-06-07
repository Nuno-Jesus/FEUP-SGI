import * as THREE from 'three';
import { MyJournalCurvedPage } from './MyJournalCurvedPage.js';

export class MyJournal extends THREE.Group
{
	/**
	 * @param {number} x the x position of the journal
	 * @param {number} y the y position of the journal
	 * @param {number} z the z position of the journal
	 * @param {string} texture the texture of the journal
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
	}

	/**
	 * Assembles and adds the elements of the journal to the group
	 * @returns {void}
	 */
	build()
	{	
		const planeGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.01);

		const flatPage1 = new THREE.Mesh(planeGeometry, this.material);
		flatPage1.rotation.set(-Math.PI / 2, 0, 0);
		flatPage1.position.set(-0.25, -0.14, 0);

		const flatPage2 = new THREE.Mesh(planeGeometry, this.material);
		flatPage2.rotation.set(-Math.PI / 2, 0, 0);
		flatPage2.position.set(0.25, -0.14, 0);

		const curvedPage1 = new MyJournalCurvedPage({y: 0.01});
		curvedPage1.rotation.set(Math.PI / 2, Math.PI / 1.3, 0);
		curvedPage1.position.set(-0.13, -0.1, 0);

		const curvedPage2 = new MyJournalCurvedPage({y: 0.01});
		curvedPage2.rotation.set(Math.PI / 2, Math.PI / 2.7, 0);
		curvedPage2.position.set(0.07, 0, 0);

		this.add(flatPage1, flatPage2, curvedPage1, curvedPage2);
	}

	/**
	 * Creates the materials and loads the necessary textures to render the journal
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