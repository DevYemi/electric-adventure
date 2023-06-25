varying vec2 vUv;
uniform sampler2D uFloorTexture;

void main() {
    vec3 textureColor = texture(uFloorTexture, vUv).rgb;
    gl_FragColor = vec4(0.0, 0.0, 0.0, textureColor);
}