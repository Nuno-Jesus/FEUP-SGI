varying vec2 vUv;

uniform sampler2D rgbTexture;
uniform sampler2D lgrayTexture;

void main() {
    // Get the color from the RGB texture
    vec3 color = texture2D(rgbTexture, vUv).rgb;
    
    // Get the depth from the LGray texture
    float depth = texture2D(lgrayTexture, vUv).r + 0.5;
    
    // Use the depth to adjust the color
    gl_FragColor = vec4(color * depth, 1.0);
}
