import * as THREE from 'three';
import { MyMenuButton } from './MyMenuButton.js';

/**
 * @constructor
 * @param {THREE.Vector3} position The position of the menu
 */
export class MyMainMenu extends THREE.Group
{
	constructor({ position = new THREE.Vector3() })
	{
		super();

		this.render();
		this.position.set(position.x, position.y, position.z);
	}

	/**
	 * @brief Render the main menu
	 */
	render()
	{
		this.renderTitle();
		this.renderButtons();

		this.rotation.y = Math.PI / 2;
	}

	/**
	 * @brief Render the title
	 */
	renderTitle()
	{
		const geometry = new THREE.PlaneGeometry(13, 8);
		const titleTexture = new THREE.TextureLoader().load('../../images/title.png');

		const material = new THREE.MeshBasicMaterial({
			color: 0xFFFFFF,
			transparent: true,
			opacity: 1,
			map: titleTexture
		});

		// Sub background to contain the title
		this.background = new THREE.Mesh(geometry, material);
		this.add(this.background);
	}

	/**
	 * @brief Render the buttons
	 */
	renderButtons()
	{
		const playButton = new MyMenuButton({
			position: new THREE.Vector3(-2.2, -3.5, 0.3),
			text: "Play",
			texpath: '../../images/play.png'
		});

		const quitButton = new MyMenuButton({
			position: new THREE.Vector3(2.2, -3.5, 0.3),
			text: "Quit",
			texpath: '../../images/quit.png'
		});

		this.add(playButton);
		this.add(quitButton);
	}
}