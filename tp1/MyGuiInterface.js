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
    init() {

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras) ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open();
		
        const lightFolder = this.datgui.addFolder('Lights');
		lightFolder.add(this.contents, 'helpersOn', true).name("Light Helpers")
			.onChange((value) => this.contents.updateHelpers(value));
		lightFolder.add(this.contents.cakeSpotLight, 'intensity', 0, 150).name("Cake Spot Light Intensity");
		lightFolder.add(this.contents.windowLight, 'intensity', 0, 3).name("Window Light Intensity");
		lightFolder.add(this.contents.pointLight, 'intensity', 0, 3).name("Launge Point Light Intensity");
		lightFolder.add(this.contents.pointLight.position, 'x', -10, 10).name("Point Light X");
		lightFolder.add(this.contents.pointLight.position, 'y', -10, 10).name("Point Light Y");
		lightFolder.add(this.contents.pointLight.position, 'z', -10, 10).name("Point Light Z");
		lightFolder.addColor(this.contents.tvLED, 'color').name("TV LEDs Color")
			.onChange((value) => this.contents.updateTVLED(value));
		lightFolder.open();

		const roomFolder = this.datgui.addFolder('Room');
		roomFolder.add(this.contents.room.position, 'x', -5, 5).name("Room X");

		const tableFolder = this.datgui.addFolder('Table');
		tableFolder.add(this.contents.cakeTable.position, 'x', -5, 5).name("Cake Table X");
		tableFolder.add(this.contents.cakePlate.position, 'x', -5, 5).name("Cake Plate X");
		tableFolder.add(this.contents.cake.position, 'x', -5, 5).name("Cake X");
		tableFolder.add(this.contents.candle.position, 'x', -5, 5).name("Candle X");
    }
}

export { MyGuiInterface };