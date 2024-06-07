import * as THREE from 'three';
import { MyTrack } from "./MyTrack.js";
import { MyVehicle } from "./MyVehicle.js";
import { MyFactory } from "./MyFactory.js";
import { MyShader } from '../MyShader.js';
import { MyFirework } from './fireworks/MyFirework.js';
import { MyOutdoor } from './MyOutdoor.js';
import { MyStateMachine } from './state-machine/MyStateMachine.js';
import { MyPark } from './MyPark.js';

import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { MyFinishLinePole } from './finish-line/MyFinishLinePole.js';

export class MyReader
{
	constructor(scene)
	{
		this.scene = scene;
		this.track = null;
		this.enemyPath = null;
		this.car = null;
		this.enemyCar = null;
		this.powerups = [];
		this.obstacles = [];
		this.fireworks = [];
		this.leftFinishLinePole = null;
		this.rightFinishLinePole = null;
		this.group = new THREE.Group();
		this.data = null;
		this.stateMachine = null;

		const floor = new THREE.TextureLoader().load('../images/floor.jpg' )

        const floorHeight = new THREE.TextureLoader().load('../images/floor_height.png' )

		this.shaders = [
			new MyShader(this.app, 'Test shader', "test texture shader", "../shaders/basRelief.vert", "../shaders/basRelief.frag", {
                rgbTexture: {type: 'sampler2D', value: floor },
                lgrayTexture: {type: 'sampler2D', value: floorHeight },
            }),

            new MyShader(this.app, 'Test2 shader', "test dimension shader", "../shaders/scaling.vert", "../shaders/flat.frag", {
                timeFactor: {type: 'f', value: 0.0 },
            }),

		];

		this.waitForShaders();
		this.clock = new THREE.Clock();

	}

	async init()
	{
		try {
			const response = await fetch('../maps/map.json');
			this.data = await response.json();
			this.render();
		} catch (error) {
			console.log(error);
		}
	}

	render()
	{
		this.renderTrack();
		this.renderCars();
		this.renderPowerUps();
		this.renderObstacles();
		this.renderOutdoor();
		this.renderFinishLine();
		this.renderParks();
	}

	waitForShaders() {
        for (let i=0; i<this.shaders.length; i++) {
            if (this.shaders[i].ready === false) {
                setTimeout(this.waitForShaders.bind(this), 100)
                return;
            }
        }
	}


	renderShaderObjects()
	{
		// Create a plane geometry
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// Create a mesh with the geometry and the shader material
		var mesh = new THREE.Mesh(geometry, this.shaders[1].material);

		// Add the mesh to the scene
		this.scene.add(mesh);
	}

	renderParks()
	{
		const parks = new MyPark({});

		this.scene.add(parks);
	}

	renderCars()
	{
		const { position } = this.data.car;
		this.car = new MyVehicle({
			position: new THREE.Vector3(...position),
			enemy: false,
		});

		this.scene.add(this.car);

		this.enemyCar = new MyVehicle({
			position: new THREE.Vector3(2, 0, 0),
			enemy: true,
		});

		this.enemyPath = this.data.enemy_path.positions.map((position) => {
			return (new THREE.Vector3(...position));
		});


		this.scene.add(this.enemyCar);
	}


	renderTrack()
	{
		const { positions, texture, width } = this.data.track;
		const points = positions.map((position) => {
			return (new THREE.Vector3(...position));
		});
		
		this.track = new MyTrack({
			points: points,
			texture: texture,
			width: width,
		});

		this.scene.add(this.track);
	}

	renderPowerUps()
	{
		let { positions } = this.data.power_ups;		
		positions = positions.map((position) => {
			return (new THREE.Vector3(...position));
		});
		positions.forEach((position) => {
			const powerUp = MyFactory.generatePowerUp(position, this.shaders[1]);
			this.powerups.push(powerUp);
			this.scene.add(powerUp);
		});
	}

	renderObstacles()
	{
		let { positions } = this.data.obstacles;
		positions = positions.map((position) => {
			return (new THREE.Vector3(...position));
		});

		positions.forEach((position) => {
			const obstacle = MyFactory.generateObstacle(position, this.shaders[1]);
			this.obstacles.push(obstacle);
			this.scene.add(obstacle);
		});
	}

	renderObstacle(position, number = null)
	{
		const obstacle = MyFactory.generateObstacle(position, this.shaders[1], number);
		this.obstacles.push(obstacle);
		this.scene.add(obstacle);
	}

	renderOutdoor()
	{
		const outdoor = new MyOutdoor({shader: this.shaders[0]});
		this.scene.add(outdoor);
	}
	
	renderFinishLine()
	{
		const { left_pole, right_pole } = this.data.finish_line;

		this.leftFinishLinePole = new MyFinishLinePole({ position: new THREE.Vector3(...left_pole) });
		this.rightFinishLinePole = new MyFinishLinePole({ position: new THREE.Vector3(...right_pole) });

		this.scene.add( this.leftFinishLinePole, this.rightFinishLinePole);
	}

	update()
	{
		if (this.car != null)
		{
			this.car.update(this.track, null);
			this.car.detectFinishLine(this.leftFinishLinePole, this.rightFinishLinePole);
			if (this.car.laps === 3)
			{
				this.stateMachine.state = MyStateMachine.GAME_OVER_STATE;
				this.car.laps = 0;
			}
		}

		if (this.enemyCar != null)
			this.enemyCar.update(this.track, this.enemyPath);

		this.updatePowerUps();
		this.updateObstacles();
		this.updateShaders();
	}

	updatePowerUps()
	{
		this.powerups.forEach((powerup) => {
			if (!powerup.touched && this.car.collides(powerup)){
				powerup.collide(this.scene, this);
				this.stateMachine.state = MyStateMachine.PAUSE_STATE;
			}
			powerup.update(this.scene, this);
		});
	}

	updateObstacles()
	{
		this.obstacles.forEach((obstacle) => {
			if (this.car.collides(obstacle))
				obstacle.collide(this.scene, this);
			obstacle.update(this.scene, this);
		});
	}

	updateShaders()
	{
		let t = this.clock.getElapsedTime()

		if (this.shaders[1] !== undefined && this.shaders[1] !== null) {
            if (this.shaders[1].hasUniform("timeFactor")) {
                this.shaders[1].updateUniformsValue("timeFactor", t  );
            }
        }
	}

	launchFireworks()
	{
		if (Math.random() < 0.05)
			this.fireworks.push(new MyFirework(this.scene));

		for (let i = 0; i < this.fireworks.length; i++)
		{
			if (this.fireworks[i].done)
			{
				this.fireworks[i];
				this.fireworks.splice(i, 1); 
				continue;
			}
			this.fireworks[i].update();
		}
	}

	debug()
	{
		console.log("CAR", this.car);
		console.log("TRACK", this.track);
		console.log("POWERUPS", this.powerups);
		console.log("OBSTACLES", this.obstacles);
	}
}