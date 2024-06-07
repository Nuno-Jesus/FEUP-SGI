import * as THREE from 'three';
import { MyUtils } from './MyUtils.js'

/**
 * @brief Static class that uses the Factory Pattern to assemble cameras of 
 * different types
 */
export class MyCameraFactory
{
	/**
	 * @brief the function to call whenever a camera is to be assembled. This function 
	 * will redirect the flow of the code according to the type of camera the scene has
	 * to build.
	 * @param {object} cam_data the camera object from MySceneData containing all its properties
	 * @return {THREE.Camera} a THREE.PerspectiveCamera or THREE.OrthographicCamera. null if the type is not 
	 * recognized
	 */
	static assemble(cam_data)
	{
		if (cam_data['type'] == ['perspective'])
			return (this.assemblePerspectiveCamera(cam_data));
		if (cam_data['type'] == ['orthogonal'])
			return (this.assembleOrthogonalCamera(cam_data));
		return (null);
	}

	/**
	 * @brief Assembles a THREE.PerspectiveCamera
	 * @param {object} cam_data the camera object from MySceneData containing all its properties
	 * @return {THREE.PerspectiveCamera} a THREE.PerspectiveCamera
	 * */
	static assemblePerspectiveCamera(cam_data)
	{
		const { id, angle, near, far, location, target } = cam_data;
		const position = MyUtils.toVector3(location);
		const lookAt = MyUtils.toVector3(target);
		const aspect = window.innerWidth / window.innerHeight;
		
		const camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
		camera.name = id;
		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(lookAt);
		
		return (camera);
	}
	
	/**
	 * @brief Assembles a THREE.OrthographicCamera
	 * @param {object} cam_data the camera object from MySceneData containing all its properties
	 * @return {THREE.OrthographicCamera} a THREE.OrthographicCamera
	 * */
	static assembleOrthogonalCamera(cam_data)
	{		
		const { id, left, right, near, far, top, bottom, location, target } = cam_data;
		const position = MyUtils.toVector3(location);
		const lookAt = MyUtils.toVector3(target);
		
		const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
		camera.up = new THREE.Vector3(0,1,0);
		camera.name = id;
		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(lookAt);

		return (camera);
	}
}