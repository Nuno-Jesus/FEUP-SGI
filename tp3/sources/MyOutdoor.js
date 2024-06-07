import * as THREE from 'three';

export class MyOutdoor extends THREE.Group
{
	constructor({shader = null})
	{
		super();

        this.shader = shader;

        this.render();

	}

    render()
    {
        const leg = new THREE.Mesh(
            new THREE.BoxGeometry(1, 10, 1),
            new THREE.MeshPhongMaterial( {color: 0x1F51FF} ),
        );

        leg.position.set(0, 0, 0);

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 1),
            new THREE.MeshPhongMaterial({color: 0x1F51FF }),
        );

        box.position.set(0, 10, 0);

        const image = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            this.shader.material,
        );

        image.position.set(0, 10, 0.51);


        this.add(leg);
        this.add(box);
        this.add(image);

        this.position.set(-35, 5, 10);
        this.rotation.y = Math.PI / 2;


    }
}