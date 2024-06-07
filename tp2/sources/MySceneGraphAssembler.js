import * as THREE from 'three';
import { MyUtils } from './MyUtils.js'
import { MyPrimitiveFactory } from './MyPrimitiveFactory.js';
import { MyLightFactory } from './MyLightFactory.js';

/**
 * @brief Static class that assembles the overall scene graph by traversing
 * the intermediate data structure provided in MySceneData
 */
export class MySceneGraphAssembler
{
	/**
	 * @param {object} root the first object node to be traversed in the data structure
	 * @param {object} materials an object with all the assembled materials in a previous step
	 * */
	constructor(root, materials)
	{
		this.root = root;
		this.materials = materials;
		this.lights = {};
		this.availableLights = ['spotlight', 'pointlight', 'directionallight']
	}

	/**
	 * @brief the main function to call to assemble the scene graph. This function
	 * uses an object with properties to be changed as the code traverses the tree.
	 * Theses properties are initialized with default properties.
	 * @note the `properties` object contains the current material, the transformation
	 * matrix so far, and if the tree node should cast/receive shadows.
	 * */
	assemble()
	{		
		const properties = {
			'material': new THREE.MeshNormalMaterial(),
			'matrix': new THREE.Matrix4().identity(),
			'castShadow': this.root['castShadows'],
			'receiveShadow': this.root['receiveShadows'],
		};

		// this.print(this.root, 0);
		this.tree = this.traverse(this.root, properties);
	}

	/**
	 * @brief Does the traversal of the data structure to assemble the scenegraph.
	 * This a recursive function, but it depends on other helper functions to call
	 * itself. The function starts its execution with a group which is then filled
	 * with other primitives, groups and LODs.
	 * @param {object} root the node where we're at
	 * @param {object} properties the properties from the ancestor
	 * @return {THREE.Group} a group containing all the descendents
	 * */
	traverse(root, properties)
	{
		const group = new THREE.Group();

		root.children.forEach(child => {
			if (child['type'] == 'node' && child['loaded'])
				this.traverseNode(group, child, properties);
			else if (child['type'] == 'primitive')
				this.traversePrimitive(group, child, properties);
			else if (child['type'] == 'lod')
				this.traverseLOD(group, child, properties);			
			else if (this.availableLights.find(l => l == child['type']))
				this.traverseLight(group, child, properties);
		});

		return (group);
	}

	/**
	 * @brief a traversal helper function. If a node of type `node` is found
	 * this function is called to handle it.
	 * @param {THREE.Group} group the THREE.Group to add the new node to
	 * @param {object} nodeData the node data
	 * @param {object} properties the properties of its ancestor
	 * */
	traverseNode(group, nodeData, properties)
	{
		const new_properties = this.updateChildProperties(properties, nodeData);
		const res = this.traverse(nodeData, new_properties);
		group.add(res);
	}

	/**
	 * @brief a traversal helper function. If a node of type `primitive` is found
	 * this function is called to handle it.
	 * @param {THREE.Group} group the THREE.Group to add the new node to
	 * @param {object} primitiveData the primitive node data
	 * @param {object} properties the properties of its ancestor
	 * */
	traversePrimitive(group, primitiveData, properties)
	{
		const res = MyPrimitiveFactory.assemble(primitiveData, properties);
		group.add(res);
	}

	/**
	 * @brief a traversal helper function. If a node of type `lod` is found
	 * this function is called to handle it.
	 * @param {THREE.Group} group the THREE.Group to add the new node to
	 * @param {object} lodData the lod node data
	 * @param {object} properties the properties of its ancestor
	 * */
	traverseLOD(group, lodData, properties)
	{
		const lod = new THREE.LOD();

		lodData.children.forEach(lodNodeRef => {
			const { node, mindist } = lodNodeRef;
			const newProperties = this.updateChildProperties(properties, node);
			const lodnode = this.traverse(node, newProperties);
			lod.addLevel(lodnode, mindist);
		});

		group.add(lod);
	}

	/**
	 * @brief a traversal helper function. If a node of type `pointlight`,
	 * `spotlight` or `directionallight` is found this function is called 
	 * to handle it.
	 * @param {THREE.Group} group the THREE.Group to add the new node to
	 * @param {object} lightData the lod node data
	 * @param {object} properties the properties of its ancestor
	 * */
	traverseLight(group, lightData, properties)
	{
		const res = MyLightFactory.assemble(lightData, properties);
		group.add(res);
		this.lights[res.name] = res;
	}

	/**
	 * @brief Updates descendent nodes by blending ancestor and its own properties
	 * @param {object} properties the properties of its ancestor
	 * @param {object} child the current node data
	 * @return {object} the updated properties for the current node
	 */
	updateChildProperties(properties, child)
	{
		const { transformations, materialIds, castShadows, receiveShadows } = child;
		const childProperties =
		{
			'material': properties['material'].clone(),
			'matrix': properties['matrix'].clone(),
			'castShadow': castShadows ? true : properties['castShadow'],
			'receiveShadow': receiveShadows ? true : properties['receiveShadow'],
		};
		childProperties['material']['texlengthS'] = properties['material']['texlengthS'];
		childProperties['material']['texlengthT'] = properties['material']['texlengthT'];

		if (materialIds.length > 0)		
			childProperties['material'] = this.materials[materialIds[0]];

		const ascendingMatrix = properties['matrix'].clone()
		const localMatrix = MyUtils.assembleTransMatrix(transformations);
		childProperties['matrix'] = ascendingMatrix.multiply(localMatrix);

		return (childProperties);
	}

	/**
	 * @note This function was used for debugging purposes
	 * @brief Displays MySceneData intermediate structure in a tree like
	 * way to be more easily understandable
	 * @param {object} root the node to start at
	 * @param {number} depth the depth in the tree. Used to format the output 
	 * */
	print(root, depth)
	{
		root.children.forEach(child => {
			let spaces = '';
			for (let i = 0; i < depth + 2; i++)
				spaces += ' ';

			if (child['type'] == 'node' || child['type'] == 'lod')
				console.log(spaces + '-', child['id']);
			else if(child['type'] == 'primitive')
				console.log(spaces + '-', child['subtype']);
			else if(child['type'] == 'lodnoderef')
				console.log(spaces + '-', 'lodnoderef: ' + child['node']['id']);
			if (child['type'] == 'node' || child['type'] == 'lod')
				this.print(child, depth + 2);
		});
	}
}