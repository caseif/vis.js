uniform vec3 color;
varying float vAlpha;

void main() {
    gl_FragColor = vec4( color, vAlpha );
}
