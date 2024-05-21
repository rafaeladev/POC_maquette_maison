uniform vec3 uDepthColor;
uniform float uOpacity;


void main()
{ 
     gl_FragColor = vec4(uDepthColor, uOpacity);
}