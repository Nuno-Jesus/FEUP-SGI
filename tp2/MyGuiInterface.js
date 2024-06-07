import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init()
	{
		const assembler = this.contents.assembler;
		const cameraFolder = this.datgui.addFolder('Cameras')
        cameraFolder.add(assembler, 'activeCameraID', Object.keys(assembler.cameras) ).name("Active Camera");
        // cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open();

		const lightFolder = this.datgui.addFolder('Lights')
		for (let key in assembler.lights)
			lightFolder.add(assembler.lights[key], 'intensity', 0, 100).name(assembler.lights[key].name + " intensity");
        lightFolder.open();
    }
}

export { MyGuiInterface };