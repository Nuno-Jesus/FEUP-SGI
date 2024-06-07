import * as THREE from 'three';
import { MyStateMachine } from './sources/state-machine/MyStateMachine.js';
export class MyPicker extends THREE.Group {
    constructor(renderer = null, camera = null, scene = null) {
        super();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer = renderer;
        this.camera = camera; 
        this.scene = scene;
        this.clickPosition = new THREE.Vector2(); 
        this.selectedObject = null; 
        this.selectedObstacle = null;
        this.obstacleNumber = null;

        this.stateMachine = null;

        // flag to move objects
        this.moveObjects = false;   

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);

        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('click', this.onClick, false);
    }

    onMouseMove(event) {
        // Normalized device coordinates
        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    }

    onClick(event) {
        this.clickPosition.x = event.clientX;
        this.clickPosition.y = event.clientY;

        this.pickObject();
    }

    pickObject() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            if(this.stateMachine.state === MyStateMachine.PAUSE_STATE) {
                if(this.selectedObstacle) {
                    console.log("Adding obstacle to scene")
                    let pos = intersects[0].point;
                    pos.y = 1.2;
                    this.stateMachine.reader.renderObstacle(pos, this.obstacleNumber);
                    this.stateMachine.state = MyStateMachine.GAME_STATE;
                    this.selectedObstacle = null;
                    this.obstacleNumber = null;
                }
                else if(this.selectedObstacle === null) {
                    console.log("Selecting obstacle", intersects[0].object.material.color)

                    this.selectedObstacle = intersects[0].object;

                    if(this.selectedObstacle.material.color.r === 1 && this.selectedObstacle.material.color.g === 0 && this.selectedObstacle.material.color.b === 0) {
                        this.obstacleNumber = 0;
                    }
                    else if (this.selectedObstacle.material.color.r === 0 && this.selectedObstacle.material.color.g === 1 && this.selectedObstacle.material.color.b === 0.7230551289161951 ) {
                        this.obstacleNumber = 1;
                    }
                    else{
                        console.log("Invalid obstacle")
                        this.selectedObstacle = null;
                    }
                    //this.selectedObject.
                }
            }
			else if (this.stateMachine.state == MyStateMachine.MAIN_MENU_STATE || 
				this.stateMachine.state == MyStateMachine.GAME_OVER_STATE)
            {
				this.handleMainMenu(intersects[0].object);
            }

            // flag to move objects
            if(this.moveObjects) {
                if (this.selectedObject) {
                    console.log("Moving object: ", this.selectedObject)
                    this.moveObject(intersects[0].point);
                }
                else if (this.selectedObject === null) {
                    this.selectedObject = intersects[0].object;
                    if (this.selectedObject.parent.isGroup) {
                        console.log("Moving group: ", this.selectedObject.parent)
                        this.selectedObject = this.selectedObject.parent;
                    }
                }
            }
        }
    }

    moveObject(position) {

        if (this.selectedObject.isGroup) {
            let bb = new THREE.Box3().setFromObject(this.selectedObject);
            let size = bb.getSize(new THREE.Vector3());

            var offset = new THREE.Vector3();
            offset.subVectors(position, this.selectedObject.children[0].position);
            offset.y += size.y / 2;
    
            for (var i = 0; i < this.selectedObject.children.length; i++) {
                this.selectedObject.children[i].position.add(offset);
            }
        } else {
            this.selectedObject.position.copy(position);
            //this.selectedObject.position.y = 0.6;
        }

        this.selectedObject = null;

    }

	handleMainMenu(object)
	{
		if (object.name == "Play") 
		{
			this.stateMachine.state = MyStateMachine.GAME_STATE;
			this.camera.position.set(25, 30, -15);
		}
		else if (object.name == "Quit")
			this.stateMachine.state = MyStateMachine.GAME_OVER_STATE;
	}
}
