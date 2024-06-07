import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

export class MyVehicle extends THREE.Group
{
	static ACCELERATION = 0.005;
	static MAX_SPEED = 0.3;
	static MAX_ENEMY_SPEED = 0.2;
	static SPEED_LOSS = 0.001;
	static MAX_WHEEL_ROTATION = 0.5;

	constructor({ position = new THREE.Vector3(), enemy = false})
	{
		super();

		this.render();
		this.calculateBoundingSphere();
		this.position.set(position.x, position.y, position.z);

		this.laps = 0;
		this.speed = 0;
		this.maxSpeed = MyVehicle.MAX_SPEED;
		this.maxEnemySpeed = MyVehicle.MAX_ENEMY_SPEED;
		this.speedLoss = MyVehicle.SPEED_LOSS;
		this.acceleration = MyVehicle.ACCELERATION;
		this.maxWheelRotation = MyVehicle.MAX_WHEEL_ROTATION;

		this.enemy = enemy;
		this.currentTargetIndex = 0;

		this.direction = new THREE.Vector3();
		this.keys = {
			up: false,
			down: false,
			left: false,
			right: false
		};

		this.invincible = false;
		this.outOfTrack = false;
		this.touchedFinishLine = false;
		this.leftRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0.1);
		this.rightRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0.1);
		this.lowerRaycaster = new THREE.Raycaster();

		// Bind the key events
		document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
		document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
	}

	render()
	{
		var body = null;
		var wheel = null;

		const loader = new OBJLoader();
		loader.load(
			'../models/car.obj',
			(object) => {
				body = object;
				if (this.enemy)
					body.children[0].material[0] = new THREE.MeshNormalMaterial();
				else
					body.children[0].material[0] = new THREE.MeshPhongMaterial({color: 0x00FF55});
				body.rotation.y = Math.PI / 2;
				body.position.set(0, 1.8, 1);
			},
		)
		loader.load(
			'../models/tire.obj',
			(object) => {
				wheel = object;
				console.log(wheel);

				wheel.children[0].material[0] = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
				wheel.children[0].material[1] = new THREE.MeshPhongMaterial({color: 0x363636});
				wheel.children[0].material[2] = new THREE.MeshPhongMaterial({color: 0x68B4E7});
				wheel.children[0].material[3] = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
				wheel.children[0].material[4] = new THREE.MeshPhongMaterial({color: 0x363636});
				wheel.children[0].material[5] = new THREE.MeshPhongMaterial({color: 0x68B4E7});
				
				const leftUpperWheel = wheel.clone();
				const rightUpperWheel = wheel.clone();
				const leftDownWheel = wheel.clone();
				const rightDownWheel = wheel.clone();

				leftDownWheel.rotation.y = Math.PI / 2;
				rightDownWheel.rotation.y = Math.PI / 2;
				if (this.enemy)
				{
					leftUpperWheel.rotation.y = Math.PI / 2;
					rightUpperWheel.rotation.y = Math.PI / 2;
				}

				leftUpperWheel.position.set(1.4, 0.8, 3.1);
				leftDownWheel.position.set(1.4, 0.8, -1.6);
				rightUpperWheel.position.set(-1.4, 0.8, 3.1);
				rightDownWheel.position.set(-1.4, 0.8, -1.6);

				this.wheels = [leftUpperWheel, rightUpperWheel, leftDownWheel, rightDownWheel];
				this.frontWheels = [leftUpperWheel, rightUpperWheel];

				this.add(body);
				this.add(leftUpperWheel);
				this.add(rightUpperWheel);
				this.add(leftDownWheel);
				this.add(rightDownWheel);
			},
		)
	}

	onKeyDown(event)
	{
		var key = event.which || event.keyCode;
		switch (key)
		{
			case 87: // W
				this.keys.up = true;
				break;
			case 83: // S
				this.keys.down = true;
				break;
			case 65: // A
				this.keys.left = true;
				break;
			case 68: // D
				this.keys.right = true;
				break;
		}
	}
	
	onKeyUp(event)
	{
		var key = event.which || event.keyCode;
		switch (key)
		{
			case 87: // W
				this.keys.up = false;
				break;
			case 83: // S
				this.keys.down = false;
				break;
			case 65: // A
				this.keys.left = false;
				break;
			case 68: // D
				this.keys.right = false;
				break;
		}
	}
	
	calculateBoundingSphere()
	{
		const boundingBox = new THREE.Box3().setFromObject(this);
		const center = boundingBox.getCenter(new THREE.Vector3());
		this.boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere(center));
	}


	/** 
	 * @brief asserts if the car is colliding with an object, by calculating
	 * the distance between their bounding spheres.
	 * @param {THREE.Object3D} obj The object to check collision with
	 * @return true if the car collides, false otherwise
	*/
	collides(obj)
	{		
		if (this.boundingSphere === undefined || obj.boundingSphere === undefined)
			return (false);

		const distance = this.position.distanceTo(obj.position);
		const radiusSum = this.boundingSphere.radius + obj.boundingSphere.radius;

		return (distance <= radiusSum);
	}

	update(track, enemyPath)
	{
		this.updateSpeed();

		if (!this.enemy)
			this.updatePosition();
		else if (this.enemy)
			this.updateEnemyDirection(enemyPath, track);

		this.updateWheels();
		if (!this.invincible)
			this.detectOutOfTrack(track);
	}

	updateSpeed()
	{
		if (( Math.abs(this.speed) < Math.abs(this.maxSpeed) ) && !this.enemy) {
			if (this.keys.up) this.speed += this.acceleration;
			if (this.keys.down) this.speed -= this.acceleration;
		}

		else if ( (Math.abs(this.speed) < Math.abs(this.maxEnemySpeed)) && this.enemy) {
			this.speed += this.acceleration;
		}
		
		if (this.speed > 0)
			this.speed -= this.speedLoss;
		else if (this.speed < 0)
			this.speed += this.speedLoss;
		if (Math.abs(this.speed) < this.speedLoss)
			this.speed = 0;
	}

	updatePosition()
	{
		if (this.keys.left) this.rotation.y += 0.05;
		if (this.keys.right) this.rotation.y -= 0.05;
	
		this.direction.set(
			Math.sin(this.rotation.y),
			0,
			Math.cos(this.rotation.y)
		);
	
		this.position.addScaledVector(this.direction, this.speed);

	}

	updateWheels()
	{
		this.wheels.forEach(wheel => {
			wheel.rotation.z += this.speed;
		});

		if (this.enemy)
			return;

		if (this.keys.left) {
			this.frontWheels.forEach(wheel => {
				if (wheel.rotation.y < this.maxWheelRotation) {
					wheel.rotation.y += 0.01;
				}
			});
		}
		if (this.keys.right) {
			this.frontWheels.forEach(wheel => {
				if (wheel.rotation.y > -this.maxWheelRotation) {
					wheel.rotation.y -= 0.01;
				}
			});
		}

		if (!this.keys.left && !this.keys.right) {
			this.frontWheels.forEach(wheel => {
				wheel.rotation.y = Math.PI / 2;
			});
		}
	}

	updateEnemyDirection(path) {
		let targetPoint = path[this.currentTargetIndex];

	
		let direction = new THREE.Vector3();
		direction.subVectors(targetPoint, this.position);
		direction.normalize();
	
	
		// move the car in the direction of the target point
		this.position.add(direction.multiplyScalar(this.speed));

		this.lookAt(targetPoint);
	
		if (this.position.distanceTo(targetPoint) < this.speed) {
			this.currentTargetIndex = (this.currentTargetIndex + 1) % path.length;
		}
	}

	detectOutOfTrack(track)
	{
		this.lowerRaycaster.set(this.position, new THREE.Vector3(0, -1, 0));
		const intersections = this.lowerRaycaster.intersectObject(track);
		
		if (intersections.length === 0 && !this.outOfTrack)
		{
			this.maxSpeed *= 0.3;
			this.speed = Math.min(this.speed, this.maxSpeed);
			this.outOfTrack = true;
		}
		else if (intersections.length !== 0)
		{
			this.outOfTrack = false;
			this.maxSpeed = MyVehicle.MAX_SPEED;
		}
	}

	detectFinishLine(leftFinishLinePole, rightFinishLinePole)
	{
		this.leftRaycaster.set(this.position, new THREE.Vector3(-1, 0, 0));
		this.rightRaycaster.set(this.position, new THREE.Vector3(1, 0, 0));

		const leftIntersections = this.leftRaycaster.intersectObject(leftFinishLinePole).length;
		const rightIntersections = this.rightRaycaster.intersectObject(rightFinishLinePole).length;
		
		if (leftIntersections !== 0 && rightIntersections !== 0 && !this.touchedFinishLine)
		{
			this.touchedFinishLine = true;
			this.laps++;
		}
		else if (leftIntersections === 0 || rightIntersections === 0)
			this.touchedFinishLine = false;

		return (leftIntersections.length !== 0 && rightIntersections.length !== 0)
	}
}
