import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * @brief Static class with utilitary functions only
 */
export class MyUtils
{
	/**
	 * @brief converts a color object into a ThreeJS color
	 * @param {number} r the red component 
	 * @param {number} g the green component 
	 * @param {number} b the blue component 
	 * @returns {THREE.Color} the final color
	 */
	static toColor({ r = 0, g = 0, b = 0})
	{
		return (new THREE.Color(r, g, b));
	}

	/**
	 * @brief converts 2 coordinates into a ThreeJS 2D vector 
	 * @param {number} x the x component
	 * @param {number} y the y component
	 * @returns {THREE.Vector2} the final position
	 */
	static toVector2([x = 0, y = 0])
	{
		return (new THREE.Vector2(x, y));
	}

	/**
	 * @brief converts 3 coordinates into a ThreeJS 3D vector 
	 * @param {number} x the x component
	 * @param {number} y the y component
	 * @param {number} z the z component
	 * @returns {THREE.Vector3} the final position
	 */
	static toVector3([x = 0, y = 0, z = 0])
	{
		return (new THREE.Vector3(x, y, z));
	}

	/**
	 * @brief converts degrees to radians 
	 * @param {number} degrees the angle in degrees
	 * @returns {number} the angle in radians
	 */
	static toRadians(degrees)
	{
		return (degrees * Math.PI / 180.0);
	}

	/**
	 * @brief assembles a transformation matrix, with translations, rotations
	 * and scale
	 * @param {Array} transformations array of objects with data about the transformations
	 * @returns {THREE.Matrix4} the final transformation matrix
	 */
	static assembleTransMatrix(transformations)
	{
		const translations = [];
		const rotations = [];
		const scales = [];

		transformations.forEach(operation => {
			if (operation['type'] == 'T')
				MyUtils.assembleTranslationMatrix(operation, translations);
			else if (operation['type'] == 'R')
				MyUtils.assembleRotationMatrix(operation, rotations);
			else if (operation['type'] == 'S')
				MyUtils.assembleScaleMatrix(operation, scales);
		});

		const transformationMatrix = new THREE.Matrix4();
		translations.forEach(t => transformationMatrix.multiply(t));
		rotations.forEach(r => transformationMatrix.multiply(r));
		scales.forEach(s => transformationMatrix.multiply(s));

		return (transformationMatrix);
	}

	/**
	 * @brief assembles a translation matrix and pushes it to the translation
	 * matrices array
	 * @param {object} operation the operation data (T)
	 * @param {Array} translations an array with all the translations
	 */
	static assembleTranslationMatrix(operation, translations)
	{
		const vec = MyUtils.toVector3(operation['translate']);
		translations.push(new THREE.Matrix4().makeTranslation(vec.x, vec.y, vec.z));
	}
	
	/**
	 * @brief assembles a rotation matrix and pushes it to the rotations
	 * matrices array
	 * @param {object} operation the operation data (R)
	 * @param {Array} rotations an array with all the rotations
	 */
	static assembleRotationMatrix(operation, rotations)
	{
		const vec = MyUtils.toVector3(operation['rotation']);
		vec.x = MyUtils.toRadians(vec.x);
		vec.y = MyUtils.toRadians(vec.y);
		vec.z = MyUtils.toRadians(vec.z);

		const quaternion = new THREE.Quaternion();
		quaternion.setFromEuler(new THREE.Euler(vec.x, vec.y, vec.z, 'XYZ'));
		rotations.push(new THREE.Matrix4().makeRotationFromQuaternion(quaternion));
	}

	/**
	 * @brief assembles a scale matrix and pushes it to the scales
	 * matrices array
	 * @param {object} operation the operation data (S)
	 * @param {Array} scales an array with all the scales
	 */
	static assembleScaleMatrix(operation, scales)
	{
		const vec = MyUtils.toVector3(operation['scale']);
		scales.push(new THREE.Matrix4().makeScale(vec.x, vec.y, vec.z));
	}

	/**
	 * @brief loads a mipmap
	 * @param {THREE.Texture} parentTexture the original texture
	 * @param {number} level the level to apply the mipmap to
	 * @param {string} path the file path to the mipmap
	 */
	static loadMipmap(parentTexture, level, path)
	{
		// load texture. On loaded call the function to create the mipmap for the specified level 
		new THREE.TextureLoader().load(path,
			function (mipmapTexture)  // onLoad callback
			{
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				ctx.scale(1, 1);

				// const fontSize = 48
				const img = mipmapTexture.image
				canvas.width = img.width;
				canvas.height = img.height

				// first draw the image
				ctx.drawImage(img, 0, 0)

				// set the mipmap image in the parent texture in the appropriate level
				parentTexture.mipmaps[level] = canvas
			},
			undefined, // onProgress callback currently not supported
			function (err) {
				console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
			}
		)
	}
}