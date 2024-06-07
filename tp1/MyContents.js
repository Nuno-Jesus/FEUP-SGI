import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyPlate } from './table/MyPlate.js';
import { MyTable } from './table/MyTable.js';
import { MyCake } from './table/MyCake.js';
import { MyRoom } from './room/MyRoom.js';
import { MyCandle } from './table/MyCandle.js';
import { MyFire } from './table/MyFire.js';
import { MyRug } from './launge/MyRug.js';
import { MyPicture } from './room/MyPicture.js';
import { MyWindow } from './room/MyWindow.js';
import { MyCarDrawing } from './room/MyCarDrawing.js';
import { MySpring } from './table/MySpring.js';
import { MyJournal } from './table/MyJournal.js';
import { MyJar } from './launge/MyJar.js';
import { MyFlowerJar } from './table/MyFlowerJar.js';
import { MyChair } from './table/MyChair.js';
import { MySofa } from './launge/MySofa.js';
import { MyTV } from './launge/MyTV.js';
import { MyDoor } from './room/MyDoor.js';
import { MyTVCabinet } from './launge/MyTVCabinet.js';


/**
 *  This class contains the contents of out application
 */
export class MyContents
{

	/**
	   constructs the object
	   @param {MyApp} app The application object
	*/
	constructor(app)
	{
		this.app = app
		this.axis = null

		// shadow related attributes
		this.mapSize = 4096;
	}

	/**
	 * initializes the contents
	 */
	init()
	{
		// create once 
		if (this.axis === null) {
			// create and attach the axis to the scene
			this.axis = new MyAxis(this);
			this.app.scene.add(this.axis);
		}
		
		// Light helpers
		this.helpers = [];
		this.helpersOn = false;

		// Objects
		this.jars = [];
		this.windows = [];
		this.plates = [];
		this.chairs = [];

		this.build();
		this.illuminate();
	}

	/**
	 * Adds all the lights to the scene
	 * @returns {void}
	 */
	illuminate()
	{
		// add an ambient light
		this.ambientLight = new THREE.AmbientLight(0x555555);
		this.app.scene.add(this.ambientLight);

		// Create a spot light to the cake
		this.cakeSpotLight = new THREE.SpotLight(0xFFFFFF, 150, 4, Math.PI / 24, 1);
		this.cakeSpotLight.target.position.set(0, 1, 1.5);
		this.cakeSpotLight.position.set(-1, 4, 2.5);
		this.cakeSpotLight.castShadow = true;
		this.cakeSpotLight.shadow.mapSize.width = this.mapSize;
        this.cakeSpotLight.shadow.mapSize.height = this.mapSize;
        this.cakeSpotLight.shadow.camera.near = 0.5;
        this.cakeSpotLight.shadow.camera.far = 10;
		
		// Create window light
		this.windowLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
		this.windowLight.position.set(2.5, 4, 8);
		this.windowLight.target.position.set(2.5, 1, 0);
        this.windowLight.castShadow = true;
        this.windowLight.shadow.mapSize.width = this.mapSize;
        this.windowLight.shadow.mapSize.height = this.mapSize;
        this.windowLight.shadow.camera.near = 0.5;
        this.windowLight.shadow.camera.far = 15;
        this.windowLight.shadow.camera.left = -10;
        this.windowLight.shadow.camera.right = 10;
        this.windowLight.shadow.camera.bottom = -10;
        this.windowLight.shadow.camera.top = 10;	

		// Create a point light on top of the model
		this.pointLight = new THREE.PointLight(0xFFFFFF, 5, 5);
		this.pointLight.position.set(5, 3.3, 0);
		
		// Create a point light to simulate LED lighting on the TV
		this.tvLED = new THREE.PointLight(0xFF0000, 20, 2.2);
		this.tvLED.position.set(8.45, 2, 0.8);

		this.tvLED2 = new THREE.PointLight(0xFF0000, 20, 2.2);
		this.tvLED2.position.set(8.45, 2, -0.8);

		// Create a spotlight to point at Nuno's picture
		this.nunoSpotLight = new THREE.SpotLight(0xFFFFFF, 150, 8, Math.PI / 18, 1);
		this.nunoSpotLight.position.set(1.5, 5, this.nuno.position.z);
		this.nunoSpotLight.target.position.set(
			this.nuno.position.x, 
			this.nuno.position.y - 1.5, 
			this.nuno.position.z);
			
		// Create a spotlight to point at Fredericos's picture
		this.fredSpotLight = new THREE.SpotLight(0xFFFFFF, 150, 8, Math.PI / 18, 1);
		this.fredSpotLight.position.set(1.5, 5, this.fred.position.z);
		this.fredSpotLight.target.position.set(
			this.fred.position.x, 
			this.fred.position.y - 1.5, 
			this.fred.position.z);
				
		// Create a spotlight to point at the Car's Drawing
		this.carSpotLight = new THREE.SpotLight(0xFFFFFF, 150, 8, Math.PI / 12, 1);
		this.carSpotLight.position.set(1.5, 5, this.car.position.z);
		this.carSpotLight.target.position.set(
			this.car.position.x, 
			this.car.position.y - 1.5, 
			this.car.position.z);
		
		// Add every light to the scene
		this.app.scene.add(this.cakeSpotLight, this.windowLight, this.pointLight, 
			this.nunoSpotLight, this.fredSpotLight, this.carSpotLight, 
			this.tvLED, this.tvLED2);

		// Add helpers for each light (this array is used to remove the helpers later)
		this.helpers.push(
			new THREE.SpotLightHelper(this.cakeSpotLight),
			new THREE.SpotLightHelper(this.nunoSpotLight),
			new THREE.SpotLightHelper(this.fredSpotLight),
			new THREE.SpotLightHelper(this.carSpotLight),
			new THREE.DirectionalLightHelper(this.windowLight),
			new THREE.PointLightHelper(this.pointLight, 0.5),
			new THREE.PointLightHelper(this.tvLED, 0.5),
			new THREE.PointLightHelper(this.tvLED2, 0.5),
		);
	}

	/**
	 * Builds the contents of the scene
	 * @returns {void}
	 */
	build()
	{
		this.room = new MyRoom({ x: 2.5, width: 12, depth: 8, height: 3.3 });
		this.buildTableArea();
		this.buildLaungeArea();
		this.buildWallElements();
		this.connectSceneGraph();
	}
	
	/**
	 * Builds the table area, where the table will be placed with the cake and other additional props
	 * @returns {void}
	 */
	buildTableArea()
	{
		this.cakeTable 	= new MyTable({ x: -2.5 });
		this.cakePlate 	= new MyPlate({ y: 1.06, z: 1.5 });
		this.cake 		= new MyCake({ y: 0.05, color: 0xFF5555, thetaLength: 1.8 * Math.PI });
		this.candle 	= new MyCandle({ y: 0.085, height: 0.07 });
		this.fire 		= new MyFire({ y: 0.04, height: 0.1 });
		this.spring 	= new MySpring({ y: 1.12, z: 0.5, radius: 0.2 });
		this.journal 	= new MyJournal({ x: 0, y: 1.2, z: -1.55 });
		this.flowerJar 	= new MyFlowerJar({ y: 1.25 });
		this.buildChairs();
		this.buildPlates();
	}
	
	/**
	 * Builds the launge area, where the sofa, tv and other additional props will be placed
	 * @returns {void}
	 */
	buildLaungeArea()
	{
		this.jars[0]	= new MyJar({ x: 5.5, y: 0.7, z: 3.2, color: 0x798C68, opacity: 0.90});
		this.jars[1]	= new MyJar({ x: 5.5, y: 0.7, z: -3.2, color: 0x798C68, opacity: 0.90});
		this.tv			= new MyTV({ x: 5.90, y: 1.8, depth: 0.1 });
		this.sofa		= new MySofa({ x: -0.5, y: 0.15, z: 0, texture: 'textures/sofa.jpg'});
		this.rug		= new MyRug({ x: 2.7, length: 6, height: 4})
		this.cab		= new MyTVCabinet({ x: 6, y: 0.5 });
		this.table		= new MyTable({ x: 1.5, height: 0.4, width: 1.6, depth: 1.2 });

		this.tv.rotation.set(0, Math.PI / 2, 0);
		this.jars[0].scale.set(0.4, 0.7, 0.4);
		this.jars[1].scale.set(0.4, 0.7, 0.4);
	}

	/**
	 * Builds the wall elements, such as the windows, pictures and the car drawing
	 * @returns {void}
	 */
	buildWallElements()
	{
		this.windows[0] = new MyWindow({ x: 2.5, y: 1.5, z: 4, width: 4, height: 3, texture: 'textures/landscape_1.png'});
		this.windows[1] = new MyWindow({ x: -2.5, y: 1.5, z: 4, width: 4, height: 3, texture: 'textures/landscape_2.png'});
		this.nuno 		= new MyPicture({ x: -this.room.width / 2, y: 1.5, z: -2.6, yRot: Math.PI / 2, imageTexture: 'textures/nuno.jpg' });
		this.fred 		= new MyPicture({ x: -this.room.width / 2, y: 1.5, z: 2.6, yRot: Math.PI / 2, imageTexture: 'textures/frederico.jpg' });
		this.car 		= new MyCarDrawing({ x: -this.room.width /2, y: 1.5, yRot: Math.PI / 2 });
		this.door		= new MyDoor({ y: 1.3, z: -3.95, width: 2.5, texture: 'textures/door.jpg'});
	}

	/**
	 * Builds the plates that will be placed on the table
	 * @returns {void}
	 */
	buildPlates()
	{
		this.plates[0] = new MyPlate({ x: 0.7, y: 1.06, z: 0.8 });
		this.plates[1] = new MyPlate({ x: -0.7, y: 1.06, z: 0.8 });
		this.plates[2] = new MyPlate({ x: 0.7, y: 1.06, z: -0.8 });
		this.plates[3] = new MyPlate({ x: -0.7, y: 1.06, z: -0.8 });
	}

	/**
	 * Builds the chairs that will be placed with the table
	 * @returns {void}
	 */
	buildChairs()
	{
		this.chairs[0] = new MyChair({ x: -1.6, y: 0.25, z: 0.8 });
		this.chairs[1] = new MyChair({ x: -1.6, y: 0.25, z: -0.8 });
		this.chairs[2] = new MyChair({ x: -3.4, y: 0.25, z: 0.8 });
		this.chairs[3] = new MyChair({ x: -3.4, y: 0.25, z: -0.8 });
		this.chairs[4] = new MyChair({ x: -2.5, y: 0.25, z: -1.9 });

		this.chairs[2].rotation.set(0, Math.PI, 0);
		this.chairs[3].rotation.set(0, Math.PI, 0);
		this.chairs[4].rotation.set(0, Math.PI / 2, 0);
	}

	/**
	 * Connects the scene graph by creating hierarchies between the objects
	 * @returns {void}
	 */
	connectSceneGraph()
	{
		// cake scenegraph
		this.candle.add(this.fire);
		this.cake.add(this.candle);
		this.cakePlate.add(this.cake);

		// table scenegraph
		this.cakeTable.add(this.cakePlate); 
		this.cakeTable.add(this.spring);
		this.cakeTable.add(this.journal);
		this.cakeTable.add(this.flowerJar);
		this.room.add(this.cakeTable);
		this.plates.forEach(plate => this.cakeTable.add(plate));
		this.chairs.forEach(chair => this.room.add(chair));

		// launge scenegraph
		this.rug.add(this.sofa);
		this.rug.add(this.table);
		this.jars.forEach(jar => this.room.add(jar));
		this.room.add(this.rug);
		this.room.add(this.cab);
		this.room.add(this.tv);

		// walls scenegraph
		this.room.add(this.nuno);
		this.room.add(this.fred);
		this.room.add(this.car);
		this.room.add(this.door);
		this.windows.forEach(window => this.room.add(window));
		
		this.app.scene.add(this.room);
	}

	/**
	 * Used by the GUI, it either turns on or off the light helpers
	 * @returns {void}
	 */
	updateHelpers(turnOn)
	{
		if (turnOn)
			this.helpers.forEach(helper => this.app.scene.add(helper));
		else
			this.helpers.forEach(helper => this.app.scene.remove(helper));
	}

	/**
	 * Used by the GUI, changes the color of the TV LEDs
	 * @param {number} color the new color of the TV LEDs 
	 */
	updateTVLED(color)
	{
		this.tvLED.color.set(color);
		this.tvLED2.color.set(color);
	}

	update()
	{
		
	}
}