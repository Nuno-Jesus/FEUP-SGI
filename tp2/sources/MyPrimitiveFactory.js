import * as THREE from 'three';
import { MyUtils } from './MyUtils.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyTriangle } from './MyTriangle.js';

/**
 * @brief Static class that uses the Factory Pattern to assemble primitives 
 * of different types
 */
export class MyPrimitiveFactory
{
	/**
	 * @brief the function to call whenever a primitive is to be assembled. This function 
	 * will redirect the flow of the code according to the type of primitive the scene has 
	 * to build.
	 * @param {object} data the primitive object from MySceneData containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Object3D} a primitive (plane, triangle, box, cylinder, sphere, NURBS, skybox
	 * or polygon) or null if the type is not recognized.
	 */
	static assemble(data, properties)
	{
		if (data['subtype'] == 'rectangle')
			return (MyPrimitiveFactory.assemblePlane(data['representations'][0], properties));
		if (data['subtype'] == 'triangle')
			return (MyPrimitiveFactory.assembleTriangle(data['representations'][0], properties));
		if (data['subtype'] == 'box')
			return (MyPrimitiveFactory.assembleBox(data['representations'][0], properties));
		if (data['subtype'] == 'cylinder')
			return (MyPrimitiveFactory.assembleCylinder(data['representations'][0], properties));
		if (data['subtype'] == 'sphere')
			return (MyPrimitiveFactory.assembleSphere(data['representations'][0], properties));
		if (data['subtype'] == 'nurbs')
			return (MyPrimitiveFactory.assembleNURBS(data['representations'][0], properties));
		if (data['subtype'] == 'skybox')
			return (MyPrimitiveFactory.assembleSkyBox(data['representations'][0], properties));
		if (data['subtype'] == 'polygon')
			return (MyPrimitiveFactory.assemblePolygon(data['representations'][0], properties));
		return (null);
	}

	/**
	 * @brief Assembles a plane mesh
	 * @param {object} data primitive object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a plane mesh
	 * */
	static assemblePlane(data, properties)
	{
		const { xy1, xy2, parts_x, parts_y } = data;
		let { material, matrix, receiveShadow, castShadow } = properties;
		const width = Math.abs(xy1[0]) + Math.abs(xy2[0]);
		const height = Math.abs(xy1[1]) + Math.abs(xy2[1]);

		const geometry = new THREE.PlaneGeometry(width, height, parts_x, parts_y);
		if (material.map != null && material.map.generateMipmaps)
		{
			const repeatX = width / material.texlengthS;
			const repeatY = height / material.texlengthT;
			material = material.clone();
			material.map.repeat.set(repeatX, repeatY);
		}

		const mesh = new THREE.Mesh( geometry, material );
		const centerX = (xy1[0] + xy2[0]) / 2.0;
		const centerY = (xy1[1] + xy2[1]) / 2.0;
		mesh.position.set(centerX, centerY, 0.0);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;
		return (mesh);
	}

	/**
	 * @brief Assembles a triangle mesh using THREE.BufferGeometry
	 * @param {object} data primitive object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a triangle mesh
	 * */
	static assembleTriangle(data, properties)
	{
		const { xyz1, xyz2, xyz3, distance } = data;
		const { material, matrix, receiveShadow, castShadow } = properties;
		
		const p1 = MyUtils.toVector3(xyz1);
		const p2 = MyUtils.toVector3(xyz2);
		const p3 = MyUtils.toVector3(xyz3);
		
		const geometry = new MyTriangle(p1, p2, p3);
		const mesh = new THREE.Mesh(geometry, material);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;

		return (mesh);
	}

	/**
	 * @brief Assembles a box mesh
	 * @param {object} data primitive object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a box mesh
	 * */
	static assembleBox(data, properties)
	{
		const { xyz1, xyz2, parts_x, parts_y, parts_z, distance } = data;
		const { material, matrix, receiveShadow, castShadow } = properties;

		const width = Math.abs(xyz1[0]) + Math.abs(xyz2[0]);
		const height = Math.abs(xyz1[1]) + Math.abs(xyz2[1]);
		const depth = Math.abs(xyz1[2]) + Math.abs(xyz2[2]);

		const geometry = new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z);
		const mesh = new THREE.Mesh( geometry, material );

		const centerX = (xyz1[0] + xyz2[0]) / 2.0;
		const centerY = (xyz1[1] + xyz2[1]) / 2.0;
		const centerZ = (xyz1[2] + xyz2[2]) / 2.0;
		mesh.position.set(centerX, centerY, centerZ);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;

		return mesh;
	}

	/**
	 * @brief Assembles a cylinder mesh
	 * @param {object} data primitive object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a cylinder mesh
	 * */
	static assembleCylinder(data, properties)
	{
		const { top, base, height, slices, stacks, capsclose, thetastart, thetalength } = data;
		const { material, matrix, receiveShadow, castShadow } = properties;

		const geometry = new THREE.CylinderGeometry(top, base, height, slices, stacks, capsclose, thetastart, thetalength);
		const mesh = new THREE.Mesh( geometry, material );

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;
		
		return (mesh);
	}
	
	/**
	 * @brief Assembles a sphere mesh
	 * @param {object} data primitive object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a sphere mesh
	 * */
	static assembleSphere(data, properties)
	{
		const { distance, philength, phistart, radius, slices, 
			stacks, thetalength, thetastart } = data;
		const { material, matrix, receiveShadow, castShadow } = properties;

		const geometry = new THREE.SphereGeometry(radius, slices, stacks, phistart, philength, thetastart, thetalength);
		const mesh = new THREE.Mesh(geometry, material);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;

		return (mesh);
	}

	/**
	 * @brief Assembles a NURBS mesh
	 * @param {object} data NURBS object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a NURBS mesh
	 * */
	static assembleNURBS(data, properties)
	{
		const { controlpoints, degree_u, degree_v, parts_u, parts_v } = data;
		const { material, matrix, receiveShadow, castShadow } = properties;

		let finalControlPoints = [];
		let temp = [];

		controlpoints.forEach((point, i) =>
		{
			temp.push([point.xx, point.yy, point.zz, 1]);
			if ((i + 1) % (degree_v + 1) == 0)
			{
				finalControlPoints.push(temp);
				temp = [];
			}
		});

		const geometry = MyNurbsBuilder.build(finalControlPoints, degree_u,
			degree_v, parts_u, parts_v);
		const mesh = new THREE.Mesh(geometry, material);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;

		return mesh;
	}

	/**
	 * @brief Assembles a box mesh with textures all around to ressemble a skybox
	 * @param {object} data skybox object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a skybox (box mesh with textures all around)
	 * */
	static assembleSkyBox(data, properties)
	{
		let { size, center, emissive, intensity, up, down, back, left, front, right } = data;
		const { matrix, receiveShadow, castShadow } = properties;

		size = MyUtils.toVector3(size);
		center = MyUtils.toVector3(center);
		emissive = MyUtils.toColor(emissive);
		
		const loader = new THREE.TextureLoader();
		const materials = [
			new THREE.MeshPhongMaterial({ map: loader.load(back), side: THREE.BackSide, emissive: emissive, emissiveIntensity: intensity }),  // Back
			new THREE.MeshPhongMaterial({ map: loader.load(front), side: THREE.BackSide, emissive: emissive, emissiveIntensity: intensity }), // Front
			new THREE.MeshPhongMaterial({ map: loader.load(up), side: THREE.BackSide, emissive: emissive, emissiveIntensity: intensity }), // Top
			new THREE.MeshPhongMaterial({ map: loader.load(down), side: THREE.BackSide, emissive: emissive, emissiveIntensity: intensity }), // Down
			new THREE.MeshPhongMaterial({ map: loader.load(left), side: THREE.BackSide, emissive: emissive, emissiveIntensity: intensity }), // Left
			new THREE.MeshPhongMaterial({ map: loader.load(right), side: THREE.BackSide, emissive: emissive, emissiveIntensity: intensity }), // Right
		];
				
		const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		const mesh = new THREE.Mesh(geometry, materials);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;
		mesh.position.set(center.x, center.y, center.z);

		return (mesh);
	}

	/**
	 * @brief Assembles a circular mesh with THREE.BufferGeometry
	 * @param {object} data polygon object containing all its properties
	 * @param {object} properties the ancestor properties
	 * @return {THREE.Mesh} a polygon mesh
	 * */
	static assemblePolygon(data, properties)
	{
		const { radius, stacks, slices, color_c, color_p } = data;
		const { matrix, receiveShadow, castShadow } = properties;
	
		const geometry = new THREE.BufferGeometry();
	
		const positions = [];
		const colors = [];
		const indices = [];
	
		const colorCenter = new THREE.Color(color_c);
		const colorPeriphery = new THREE.Color(color_p);
	
		for (let i = 0; i <= stacks; i++) {
			// Calculate the current radius for this stack
			const stackRadius = radius * (i / stacks);
	
			for (let j = 0; j <= slices; j++) {
				// Calculate the angle for this slice
				const sliceAngle = (j / slices) * Math.PI * 2;
	
				// Calculate the x and y position
				const x = stackRadius * Math.cos(sliceAngle);
				const y = stackRadius * Math.sin(sliceAngle);
	
				positions.push(x, y, 0);
	
				// Interpolate the color for this vertex
				const color = colorCenter.clone().lerp(colorPeriphery, i / stacks);

				colors.push(color.r, color.g, color.b);
	
				// Add indices to form triangles if we're not in the first or last stack
				if (i > 0 && i < stacks && j < slices) {
					const lowerLeft = i * (slices + 1) + j;
					const lowerRight = lowerLeft + 1;
					const upperLeft = lowerLeft - (slices + 1);
					const upperRight = upperLeft + 1;
	
					indices.push(upperLeft, lowerLeft, lowerRight);	
					indices.push(upperLeft, lowerRight, upperRight);
				}
			}
		}
	
		// Add the positions, colors and indices to the geometry
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3, true));
		geometry.setIndex(indices);

		const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, vertexColors: true } );
		const mesh = new THREE.Mesh(geometry, material);

		mesh.applyMatrix4(matrix);
		mesh.receiveShadow = receiveShadow;
		mesh.castShadow = castShadow;
	
		return mesh;
	}
}