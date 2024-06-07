import * as THREE from 'three';
import { MyUtils } from './MyUtils.js';
import { MyCameraFactory } from './MyCameraFactory.js';
import { MyMaterialAssembler } from './MyMaterialAssembler.js';
import { MyTextureFactory } from './MyTextureFactory.js';
import { MySceneGraphAssembler } from './MySceneGraphAssembler.js';

/**
 * @brief Assemble all of the scene entities that are possible within the XML
 * syntax scope.
 * */
export class MySceneAssembler
{
	/**
	 * @param {object} data MySceneData intermediate data structure
	 * */
	constructor(data)
	{
		this.data = data;

		this.ambientLight = null;
		this.backgroundColor = null;
		this.fog = null;
		
		this.lastCameraID = null;	
		this.activeCameraID = this.data.activeCameraId;
		this.rootID = this.data.rootId;

		this.cameras = {};
		this.textures = {};
		this.materials = {};
		this.tree = null;
		this.lights = null;
	}

	/**
	 * @brief the function to call to assemble a whole scene
	 * */
	assemble()
	{
		this.assembleGlobals(this.data.options);
		this.assembleFog(this.data.fog);
		this.assembleCameras(this.data.cameras);
		this.assembleTextures(this.data.textures);
		this.assembleMaterials(this.data.materials);
		this.assembleSceneGraph(this.data.nodes);
		// this.print();
	}

	/**
	 * @brief tasked with assembling the scene global elements, such as 
	 * the ambient and background color
	 * @param {object} ambient the ambient color
	 * @param {object} background the background color
	 * */
	assembleGlobals({ ambient, background })
	{		
		this.ambientLight = new THREE.AmbientLight(MyUtils.toColor(ambient));
		this.backgroundColor = MyUtils.toColor(background);
	}

	/**
	 * @brief tasked with assembling the scene's fog element
	 * @param {object} fog the background color
	 * */
	assembleFog(fog)
	{
		let { color, near, far } = fog;

		color = MyUtils.toColor(fog.color);
		this.fog = new THREE.Fog(color, near, far);
	}

	/**
	 * @brief tasked with assembling the scene's cameras
	 * @param {object} camsData an object with each camera's data
	 */
	assembleCameras(camsData)
	{
		for (let key in camsData)
			this.cameras[key] = MyCameraFactory.assemble(camsData[key]);
	}

	/**
	 * @brief tasked with assembling the scene's textures
	 * @param {object} texsData an object with each texture's data
	 */
	assembleTextures(texsData)
	{
		for (let key in texsData)
			this.textures[key] = MyTextureFactory.assemble(texsData[key]);
	}

	/**
	 * @brief tasked with assembling the scene's materials
	 * @param {object} matsData an object with each material's data
	 */
	assembleMaterials(matsData)
	{
		for (let key in matsData)
			this.materials[key] = MyMaterialAssembler.assemble(matsData[key], this.textures);
	}

	/**
	 * @brief tasked with assembling the scene graph
	 * @param {object} camsData an object with each node's data
	 */
	assembleSceneGraph(nodesData)
	{
		const factory = new MySceneGraphAssembler(nodesData[this.rootID], this.materials);
		factory.assemble();
		this.tree = factory.tree;
		this.lights = factory.lights;
	}
	
	/**
	 * @brief Uses its stored assembled entities to render the entire scene. Creates
	 * new entities to adds the already assembled ones to a scene.
	 * @param {THREE.Scene} scene the scene to add the entities to
	 */
	render(scene)
	{
		scene.background = this.backgroundColor;
		scene.fog = this.fog;
		scene.add(this.ambientLight);
		scene.add(this.cameras[this.activeCameraID]);
		scene.add(this.tree);
		
		for (let key in this.lights)
		{
			const light = this.lights[key];
			if (light['type'] == 'PointLight')
				scene.add(light, new THREE.PointLightHelper(light, 1));
			else if (light['type'] == 'SpotLight')
				scene.add(light, new THREE.SpotLightHelper(light));
			else if (light['type'] == 'DirectionalLight')
				scene.add(light, new THREE.DirectionalLightHelper(light, 1));
		}
	}
	
	/**
	 * @note This function was used to debugging purposes only
	 * @brief Prints all the information parsed after the assembly of the scene, 
	 * which include every ThreeJS entity
	 */
	print()
	{
		console.log('\n\t================ AMBIENT ================\n\n');
		console.log(this.ambientLight);
		console.log('\n\t================ BACKGROUND ================\n\n');
		console.log(this.backgroundColor);
		console.log('\n\t================ FOG ================\n\n');
		console.log(this.fog);
		console.log('\n\t================ CAMERAS ================\n\n');
		console.log(this.cameras);
		console.log('\n\t================ TEXTURES ================\n\n');
		console.log(this.textures);
		console.log('\n\t================ MATERIALS ================\n\n');
		console.log(this.materials);
		console.log('\n\t================ TREE ================\n\n');
		console.log(this.tree);
		console.log('\n\t================ LIGHTS ================\n\n');
		console.log(this.lights);
		console.log('\n\t================ OTHERS ================\n\n');
		console.log('Active camera ID: ' + this.activeCameraID);
		console.log('Root node ID: ' + this.rootID);
	}
}