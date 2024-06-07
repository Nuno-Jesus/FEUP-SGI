import { MySpeederPowerUp } from './power-ups/MySpeederPowerUp.js';
import { MyInvincibilityPowerUp } from './power-ups/MyInvincibilityPowerUp.js';
import { MyObstacleRemoverPowerUp } from './power-ups/MyObstacleRemoverPowerUp.js';
import { MySlowerObstacle } from './obstacles/MySlowerObstacle.js';
import { MyFoggyObstacle } from './obstacles/MyFoggyObstacle.js';

export class MyFactory
{
	/**
	 * @brief Generates a random new power up in a given position
	 * @param {THREE.Vector3} position the position to put the new object in 
	 * @param {object} shader the shader to use for the power up
	 * @returns a new power up  
	 */
	static generatePowerUp(position, shader)
	{
		const number = Math.floor(Math.random() * 3);
		switch (number) {
			case 0:
				return new MySpeederPowerUp({ position: position, shader: shader });
			case 1:
				return new MyInvincibilityPowerUp({ position: position, shader: shader });
			case 2:
				return new MyObstacleRemoverPowerUp({ position: position, shader: shader });
			default:
				throw new Error(`Invalid number (${number}) for power up generation`);
		}
	}

	/**
	 * @brief Generates a random new obstacle in a given position
	 * @param {THREE.Vector3} position the position to put the new object in 
	 * @returns a new obstacle
	 */
	static generateObstacle(position, shader, number = null)
	{
		if (number === null)
			number = Math.floor(Math.random() * 2);

		switch (number) {
			case 0:
				return new MySlowerObstacle({ position: position, shader: shader });
			case 1:
				return new MyFoggyObstacle({ position: position, shader: shader });
			default:
				throw new Error(`Invalid number (${number}) for obstacle generation`);
		}
	}
}