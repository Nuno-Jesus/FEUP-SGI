import * as THREE from 'three'

/**
 * @constructor
 * @param {THREE.Scene} scene The scene to add the firework to
 */
export class MyFirework
{
    constructor(scene)
	{
        this.scene = scene

        this.done     = false 
        this.endings     = [] 
        
        this.spawnPositions = null
        this.colors   = null
        this.geometry = null
        this.points   = null
        
        this.material = new THREE.PointsMaterial({
            size: 0.1,
			color: Math.random() * 0xFFFFFF,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 20
        this.speed = 60

        this.launch() 

    }

    /**
     * @brief compute particle launch
     */
    launch() {
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
        let colors = [ color.r, color.g, color.b ]

        let x = THREE.MathUtils.randFloat( -10, 10 ) 
        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat( -10, 10 ) 
        this.endings.push( x - 10, y, z ) 
        let vertices = [-10, 0, 0]
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.scene.add( this.points );
    }

    /**
     * @brief compute explosion
     * @param {array} origin the starting point of the explosion
	 * @param {number} n number of particles
	 * @param {number} rangeBegin the minimum distance from origin
	 * @param {number} rangeEnd the maximum distance from origin 
     */
    explode(origin, n, rangeBegin, rangeEnd)
	{
		//Create n particles
		let spawns = []
		let colors = []
		let endings = []
		let color = new THREE.Color()
		
		this.scene.remove( this.points )
		for (let i = 0; i < n; i++)
		{
			//Random color
			color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
			colors.push(color.r, color.g, color.b)
			
			//Random position
			let x = THREE.MathUtils.randFloat( -1, 1 )
			let y = THREE.MathUtils.randFloat( -1, 1 )
			let z = THREE.MathUtils.randFloat( -1, 1 )
			let r = THREE.MathUtils.randFloat(rangeBegin, rangeEnd)
			endings.push(origin[0] + x * r, origin[1] + y * r, origin[2] + z * r)
			spawns.push(origin[0], origin[1], origin[2])
    	}

		this.geometry = new THREE.BufferGeometry()
		this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(spawns), 3 ) );
		this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
		this.points = new THREE.Points( this.geometry, this.material )

		this.scene.add( this.points )
		this.endings = endings
		this.spawnPositions = spawns
		this.colors = colors
	}
    
    /**
     * @brief removes a firework particle from the scene
     */
    reset() {
        this.scene.remove( this.points )  
        this.endings  = [] 
        this.spawnPositions = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    /**
     * @brief updates the firework particles
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let originsAttribute = this.geometry.getAttribute( 'position' )
            let spawnPosition = originsAttribute.array
            let count = originsAttribute.count

            // lerp particle positions 
            for( let i = 0; i < spawnPosition.length; i+=3 ) {
                spawnPosition[i  ] += ( this.endings[i  ] - spawnPosition[i  ] ) / this.speed
                spawnPosition[i+1] += ( this.endings[i+1] - spawnPosition[i+1] ) / this.speed
                spawnPosition[i+2] += ( this.endings[i+2] - spawnPosition[i+2] ) / this.speed
            }
            originsAttribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( spawnPosition[1] ) > ( this.endings[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(spawnPosition, 80, this.height * 0.05, this.height * 0.8) 
                    return 
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.015 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.reset() 
                this.done = true 
                return 
            }
        }
    }
}