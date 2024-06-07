import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export class MyNurbsBuilder
{
	/**
	 * Builds a NURBS surface
	 * @param {Array} controlPoints the control points of the surface
	 * @param {number} degree1 the degree of the surface in the U direction
	 * @param {number} degree2 the degree of the surface in the V direction
	 * @param {number} samples1 the number of samples in the U direction
	 * @param {number} samples2 the number of samples in the V direction
	 * @returns {ParametricGeometry} the NURBS surface
	 */
	static build(controlPoints, degree1, degree2, samples1, samples2)
	{
		const knots1 = []
		const knots2 = []

		// build knots1 = [ 0, 0, 0, 1, 1, 1 ];
		for (var i = 0; i <= degree1; i++)
			knots1.push(0)

		for (var i = 0; i <= degree1; i++)
			knots1.push(1)

		// build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
		for (var i = 0; i <= degree2; i++)
			knots2.push(0)

		for (var i = 0; i <= degree2; i++)
			knots2.push(1)

		let stackedPoints = []
		// For each U coordinate, we have an array of V coordinates
		for (var i = 0; i < controlPoints.length; i++)
		{
			let Ucoords = controlPoints[i]
			let flattenVrow = []
			// For each V coordinate we have a row of 3D coordinates + the V point weight
			for (var j = 0; j < Ucoords.length; j++)
			{
				let Vcoords = Ucoords[j];
				flattenVrow.push(new THREE.Vector4( Vcoords[0], Vcoords[1], Vcoords[2], Vcoords[3] ));
			}
			// All the V points coordinates are added to the stackedPoints array
			stackedPoints[i] = flattenVrow;
		}

		const nurbsSurface = new NURBSSurface(degree1, degree2,
			knots1, knots2, stackedPoints);
		const geometry = new ParametricGeometry(getSurfacePoint,
			samples1, samples2, );

		return geometry;

		function getSurfacePoint(u, v, target) {
			return nurbsSurface.getPoint(u, v, target);
		}
	}
}