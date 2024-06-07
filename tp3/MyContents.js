import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyReader } from "./sources/MyReader.js";
import { MyStateMachine } from "./sources/state-machine/MyStateMachine.js";
import { MyMainMenu } from "./sources/menu/MyMainMenu.js";

/**
 *  This class contains the contents of out application
 */
export class MyContents {
	/**
		 constructs the object
		 @param {MyApp} app The application object
	  */
	constructor(app)
	{
		this.app = app;
		this.axis = null;
		this.reader = null;
		this.stateMachine = null;
		this.mainMenu = null;

	}
	/**
	 * initializes the contents
	 */
	async init()
	{
		// create once
		if (this.axis === null) {
			// create and attach the axis to the scene
			this.axis = new MyAxis(this);
			this.app.scene.add(this.axis);
		}

		this.initLights();

		this.reader = new MyReader(this.app.scene);
		await this.reader.init();
		this.stateMachine = new MyStateMachine(MyStateMachine.MAIN_MENU_STATE, this, this.reader);

		this.mainMenu = new MyMainMenu({ position: new THREE.Vector3(20, 5, 0), stateMachine: this.stateMachine });
		this.app.scene.add(this.mainMenu);

		const grid = new THREE.GridHelper(300, 50, 0xFFCC00, 0xFFCC00);
		this.app.scene.add(grid);
	}

	initLights()
	{
		const sun = new THREE.DirectionalLight(0xffffff, 10);
		sun.position.set(0, 100, 0);
		this.app.scene.add(sun);

		const sunHelper = new THREE.DirectionalLightHelper(sun, 100);
		this.app.scene.add(sunHelper);

		// add an ambient light
		const ambientLight = new THREE.AmbientLight(0x555555);
		this.app.scene.add(ambientLight);

		const pointLight = new THREE.PointLight(0xffffff, 10, 100);
		pointLight.position.set(25, 10, 0);

		this.app.scene.add(new THREE.PointLightHelper(pointLight, 1));
	}

	/**
	 * updates the contents
	 * this method is called from the render method of the app
	 */
	update()
	{
		if (this.stateMachine != null)
			this.stateMachine.update();
	}
}
