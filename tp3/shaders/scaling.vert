uniform float timeFactor;
varying vec3 vNormal;

void main() {
    // Pulsating effect
    vNormal = normal;

    float radius = (0.1 * (sin(timeFactor * 4.0)) + 1.0);

    
    // Transform the position based on the model-view and projection matrices
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * radius, position.y, position.z * radius, 1.0);
}
