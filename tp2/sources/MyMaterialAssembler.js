import * as THREE from 'three';
import { MyUtils } from './MyUtils.js'

/**
 * @brief Static class that assembles THREE.MeshPhongMaterials and
 * assigns textures if they include so
 */
export class MyMaterialAssembler
{
	/**
	 * @brief the function to call whenever a material is to be assembled.
	 * @param mat_data the material object from MySceneData containing all its properties
	 * @param textures an object containing all textures already built in a previous step
	 * @return a THREE.MeshPhongMaterial
	*/
	static assemble(mat_data, textures)
	{
		return MyMaterialAssembler.assemblePhongMaterial(mat_data, textures);
	}

	/**
	 * @brief Assembles a THREE.MeshPhongMaterial
	 * @param mat_data the material object from MySceneData containing all its properties
	 * @param textures an object containing all textures already built in a previous step
	 * @return a THREE.MeshPhongMaterial
	 * */
	static assemblePhongMaterial(mat_data, textures)
	{
		const { bumpref, bumpscale, color, custom, emissive, id, shading,
			shininess, specular, specularref, texlength_s, texlength_t,
			textureref, twosided, wireframe } = mat_data;

		let bumpTexture = null;
		if (bumpref != null)
		{
			bumpTexture = new THREE.TextureLoader().load(bumpref);
			// console.log(bumpref);
			// console.log(textureref);
			bumpTexture.generateMipmaps = false;
		}

		const material = new THREE.MeshPhongMaterial({
			color: MyUtils.toColor(color),
			emissive: MyUtils.toColor(emissive),
			specular: MyUtils.toColor(specular),
			side: twosided ? THREE.DoubleSide : THREE.FrontSide,
			shininess: shininess,
			flatShading: shading == 'flat',
			name: id,
			map: textureref == null ? null : textures[textureref],
			wireframe: wireframe,
			bumpMap: bumpTexture,
			bumpScale: bumpscale,
			specularMap: null
		});
		material['texlengthS'] = texlength_s;
		material['texlengthT'] = texlength_t;

		return (material);
	}
}