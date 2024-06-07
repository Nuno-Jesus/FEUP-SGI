import * as THREE from 'three';
import { MyUtils } from './MyUtils.js'

/**
 * @brief Static class that uses the Factory Pattern to assemble lights 
 * sources of different types
 */
export class MyLightFactory
{
	/**
	 * @brief the function to call whenever a light is to be assembled. This function 
	 * will redirect the flow of the code according to the type of light source the 
	 * scene has to build.
	 * @param {object} light_data the light object from MySceneData containing all its properties
	 * @return {THREE.Light} a THREE.PointLight, THREE.SpotLight or THREE.DirectionalLight. null if 
	 * the type is not recognized.
	 */
	static assemble(light_data)
	{
		if (light_data['type'] == 'pointlight')
			return (MyLightFactory.assemblePointLight(light_data));
		if (light_data['type'] == 'spotlight')
			return (MyLightFactory.assembleSpotLight(light_data));
		if (light_data['type'] == 'directionallight')
			return (MyLightFactory.assembleDirectionalLight(light_data));
		return (null);
	}

	/**
	 * @brief Assembles a THREE.PointLight
	 * @param {object} light_data the light object from MySceneData containing all its properties
	 * @return {THREE.Light} a THREE.PointLight
	 * */
	static assemblePointLight(light_data)
	{
		let { castshadow, color, decay, distance, enabled, id, 
			intensity, position, shadowfar, shadowmapsize } = light_data;

		color = MyUtils.toColor(color);
		position = MyUtils.toVector3(position);
		
		if (!enabled)
			intensity = 0.0;

		const light = new THREE.PointLight(color, intensity, distance, decay);
		light.name = id;
		light.castShadow = castshadow;
		light.shadow.camera.far = shadowfar;
		light.shadow.mapSize.width = shadowmapsize;
		light.shadow.mapSize.height = shadowmapsize;
		light.position.set(position.x, position.y, position.z);
		
		return (light);
	}

	/**
	 * @brief Assembles a THREE.SpotLight
	 * @param {object} light_data the light object from MySceneData containing all its properties
	 * @return {THREE.SpotLight} a THREE.SpotLight
	 * */
	static assembleSpotLight(light_data)
	{
		let { angle, castshadow, color, decay, distance, enabled, id, 
			intensity,penumbra, position, shadowfar, shadowmapsize, target } = light_data;
		
		color = MyUtils.toColor(color);
		position = MyUtils.toVector3(position);
		target = MyUtils.toVector3(target);
		
		if (!enabled)
			intensity = 0.0;

		const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
		light.name = id;
		light.castShadow = castshadow;
		light.shadow.camera.far = shadowfar;
		light.shadow.mapSize.width = shadowmapsize;
		light.shadow.mapSize.height = shadowmapsize;
		light.target.position.set(target.x, target.y, target.z);
		light.position.set(position.x, position.y, position.z);

		return (light);
	}

	/**
	 * @brief Assembles a THREE.DirectionalLight
	 * @param {object} light_data the light object from MySceneData containing all its properties
	 * @return {THREE.DirectionalLight} a THREE.DirectionalLight
	 * */
	static assembleDirectionalLight(light_data)
	{
		let { castshadow, color, enabled, id, intensity, position, shadowbottom,
			shadowfar, shadowleft, shadowmapsize, shadowright, shadowtop } = light_data;
		
		color = MyUtils.toColor(color);
		position = MyUtils.toVector3(position);

		if (!enabled)
			intensity = 0.0;

		const light = new THREE.DirectionalLight(color, intensity);
		light.name = id;
		light.castShadow = castshadow;
		light.shadow.camera.near = 0.5;
		light.shadow.camera.top = shadowtop;
		light.shadow.camera.far = shadowfar;
		light.shadow.camera.left = shadowleft;
		light.shadow.camera.right = shadowright;
		light.shadow.camera.bottom = shadowbottom;
		light.shadow.mapSize.width = shadowmapsize;
		light.shadow.mapSize.height = shadowmapsize;
		light.position.set(position.x, position.y, position.z);
		console.log(light.shadow.camera);
		return (light);
	}
}