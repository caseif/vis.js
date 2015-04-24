// fragment shader for fleck particles so we don't have to create an entirely new system
uniform vec3 color;
varying float vAlpha;

void main() {
	gl_FragColor = vec4(color, 1);
}
