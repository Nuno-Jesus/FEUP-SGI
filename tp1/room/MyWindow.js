import * as THREE from 'three';

export class MyWindow extends THREE.Group
{
	/**
	 * @param {number} x the x position of the window
	 * @param {number} y the y position of the window
	 * @param {number} z the z position of the window
	 * @param {number} color the color of the window
	 * @param {number} height the height of the window
	 * @param {number} width the width of the window
	 * @param {string} texture the texture file of the window
	 * @param {number} xRot the x rotation of the window
	 * @param {number} yRot the y rotation of the window
	 * @param {number} zRot the z rotation of the window
	 */
	constructor({x = 0, y = 0, z = 0, color = 0x999999, height = 2.7, width = 2,
		texture = 'textures/uv_grid_opengl.jpg', xRot = 0, yRot = Math.PI, zRot = 0})
	{
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.xRot = xRot;
		this.yRot = yRot;
		this.zRot = zRot;
		this.color = color;
		this.height = height;
		this.width = width;
		this.texture = texture;
		this.materialize();
		this.build();
		this.position.set(this.x, this.y, this.z);
		this.rotation.set(this.xRot, this.yRot, this.zRot);
	}

	/**
	 * Assembles and adds the elements of the window to the group
	 * @returns {void}
	 */
	build()
	{
		this.buildFrame();
		this.buildWindow();
	}

	/**
	 * Builds the frame of the window
	 * @returns {void}
	 */
	buildFrame()
	{
		const frameGeometry = new THREE.BoxGeometry(this.width, this.height, 0.05);
		const frame = new THREE.Mesh(frameGeometry, this.frameMaterial);

		const upperFrame = new THREE.BoxGeometry(this.width, 0.05, 0.15);
		const sideFrame = new THREE.BoxGeometry(0.05, this.height + 0.05, 0.15);
		const borders = [];

		borders[0] = new THREE.Mesh(upperFrame, this.frameMaterial);
		borders[0].position.set(0, this.height / 2, 0);
		
		borders[1] = new THREE.Mesh(upperFrame, this.frameMaterial);
		borders[1].position.set(0, -this.height / 2, 0);

		borders[2] = new THREE.Mesh(sideFrame, this.frameMaterial);
		borders[2].position.set(this.width / 2, 0, 0);

		borders[3] = new THREE.Mesh(sideFrame, this.frameMaterial);
		borders[3].position.set(-this.width / 2, 0, 0);

		borders[4] = new THREE.Mesh(sideFrame, this.frameMaterial);

		borders.forEach(border => this.add(border));
		this.add(frame);
	}

	/**
	 * Builds the window glass
	 * @returns {void}
	 */
	buildWindow()
	{
		const windowGeometry = new THREE.BoxGeometry(this.width - 0.15, this.height - 0.15, 0.01);
		const window = new THREE.Mesh(windowGeometry, this.windowMaterial);
		window.position.set(0, 0, 0.025);
		this.add(window);
	}

	/**
	 * Creates the materials of the window
	 * @returns {void}
	 */
	materialize()
	{
		this.frameMaterial = new THREE.MeshPhongMaterial({
			color: this.color,
		});
		this.windowMaterial = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(this.texture),
		});
	}
}
