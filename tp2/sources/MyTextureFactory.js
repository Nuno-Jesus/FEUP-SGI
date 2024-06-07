import * as THREE from 'three';
import { MyUtils } from './MyUtils.js'

/**
 * @brief Static class that uses the Factory Pattern to assemble textures 
 * of different types
 */
export class MyTextureFactory
{
	/**
	 * @brief the function to call whenever a texture is to be assembled. This function 
	 * will redirect the flow of the code according to the type of texture the scene has 
	 * to build.
	 * @param {object} tex_data the texture object from MySceneData containing all its properties
	 * @return {THREE.Texture} a texture 
	 */
	static assemble(tex_data)
	{
		if (tex_data['isVideo'])
			return (MyTextureFactory.assembleVideoTexture(tex_data));
		if (tex_data['mipmap0'] != undefined)
			return (MyTextureFactory.assembleMipMapTexture(tex_data));
		return (MyTextureFactory.assembleRegularTexture(tex_data));
	}

	/**
	 * @brief assembles a Video Texture
	 * @param {object} tex_data the texture object from MySceneData containing all its properties
	 * @return {THREE.VideoTexture} a video texture
	 */
	static assembleVideoTexture(tex_data)
	{
		const video = document.getElementById('video');
		const texture = new THREE.VideoTexture(video);
		
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.name = tex_data['id'];
		texture.isTexture = true;

		return (texture);
	}

	/**
	 * @brief assembles a Video Texture
	 * @param {object} tex_data the texture object from MySceneData containing all its properties
	 * @return {THREE.VideoTexture} a video texture
	 */
	static assembleMipMapTexture(tex_data)
	{
		const texture = new THREE.TextureLoader().load(tex_data['filepath']);
		texture.anisotropy = tex_data['anisotropy'];
		texture.generateMipmaps = false;

		MyUtils.loadMipmap(texture, 0, tex_data['mipmap0']);    // .1024
		MyUtils.loadMipmap(texture, 1, tex_data['mipmap1']);
		MyUtils.loadMipmap(texture, 2, tex_data['mipmap2']);
		MyUtils.loadMipmap(texture, 3, tex_data['mipmap3']);

		texture.needsUpdate = true;
		texture.name = tex_data['id'];
		texture.isTexture = true;


		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		return (texture);
	}

	/**
	 * @brief assembles a regular THREE.Texture
	 * @param {object} tex_data the texture object from MySceneData containing all its properties
	 * @return {THREE.Texture} a texture
	 */
	static assembleRegularTexture(tex_data)
	{
		const { anisotropy, custom, filepath, id, magFilter, 
			minFilter } = tex_data;

		const texture = new THREE.TextureLoader().load(filepath);
		texture.anisotropy = anisotropy;
		texture.magFilter = THREE[magFilter];
		texture.minFilter = THREE[minFilter];
		texture.name = id;
		texture.isTexture = true;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		return (texture);
	}
}