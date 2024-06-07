import * as THREE from 'three';

export class MyRoute extends THREE.Group
{
	constructor({ points = [] })
	{
		super();

		this.points = points;
	}
}