import * as THREE from 'three';

export class MyTrack extends THREE.Group
{
	constructor({ points = [], texture = "./images/uvmapping.jpg", segments = 300, width = 1, 
		wireframe = false })
	{
		super();

		this.path = new THREE.CatmullRomCurve3(points);
		this.startingPosition = points[0];
		this.texture = texture;
		this.numSegments = segments;
		this.width = width;
		this.showWireframe = wireframe;
		this.loadTextures();
		this.render();
	}

	loadTextures()
	{
		const texture = new THREE.TextureLoader().load(this.texture);
		texture.repeat.set(7, 3);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		this.material = new THREE.MeshBasicMaterial({ map: texture });
		this.wireframeMaterial = new THREE.MeshBasicMaterial({
			color: 0x00FF00,
			opacity: 0.3,
			wireframe: true,
			transparent: true,
		});

		this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
	}

	render()
	{
		let points = this.path.getPoints(this.numSegments);
		let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		this.lineMesh = new THREE.Line(lineGeometry, this.lineMaterial);
		
		let trackGeometry = new THREE.TubeGeometry(this.path, this.numSegments, this.width, 3);
		this.trackMesh = new THREE.Mesh(trackGeometry, this.material);
		this.wireMesh = new THREE.Mesh(trackGeometry, this.wireframeMaterial);

		this.add(this.trackMesh);
		this.add(this.lineMesh);

		this.rotateZ(Math.PI);
		this.scale.set(5, 0.3, 5);
	}
}