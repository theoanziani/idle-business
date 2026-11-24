// Réacteur 3D : anneaux segmentés en raymarching (WebGL 1) + nuée de particules, réactif à la voix.
(function () {
  const canvas = document.getElementById("reactor");
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true, alpha: true });
  const state = { level: 0, target: 0, energy: 0.35, energyTarget: 0.35, hue: 0 };
  window.reactor = {
    setLevel(v) { state.target = Math.max(0, Math.min(1, v)); },
    setMode(m) {
      state.energyTarget = { idle: 0.35, ecoute: 0.8, reflexion: 1.0, parole: 0.7 }[m] ?? 0.35;
      state.hue = m === "reflexion" ? 1 : 0;
    },
  };
  if (!gl) { console.warn("WebGL indisponible"); return; }

  const VS = `attribute vec2 p; varying vec2 uv; void main(){ uv=p; gl_Position=vec4(p,0.,1.); }`;
  const FS = `precision highp float;
  varying vec2 uv; uniform float t, lvl, nrg, hue;
  mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
  float torus(vec3 p, vec2 r){ return length(vec2(length(p.xz)-r.x, p.y))-r.y; }
  // anneau découpé en N segments (gaps lumineux façon réacteur)
  float seg(vec3 p, float n, float fill){ float a=atan(p.z,p.x)/6.2831853*n; return step(fract(a), fill); }
  vec3 ringCol(float k){ vec3 c=mix(vec3(.24,.86,1.), vec3(1.,.72,.3), hue); return c*k; }
  void main(){
    vec3 ro=vec3(0.,0.,3.2), rd=normalize(vec3(uv*0.92,-1.6));
    vec3 col=vec3(0.); float tt=0.;
    float pulse=1.+lvl*0.18;
    for(int i=0;i<72;i++){
      vec3 p=ro+rd*tt;
      vec3 p1=p; p1.yz*=rot(1.5708+0.25*sin(t*.3)); p1.xz*=rot(t*.35*(.5+nrg));
      vec3 p2=p; p2.xy*=rot(.9+t*.21); p2.yz*=rot(1.2+t*.17*(.5+nrg));
      vec3 p3=p; p3.yz*=rot(1.5708); p3.xz*=rot(-t*.6*(.4+nrg));
      vec3 p4=p; p4.yz*=rot(1.5708); p4.xz*=rot(t*.12);
      float d1=torus(p1, vec2(1.15*pulse,.018));
      float d2=torus(p2, vec2(.95*pulse,.014));
      float d3=torus(p3, vec2(.62*pulse,.05));
      float d4=torus(p4, vec2(1.42,.006));
      float core=length(p)-(.24+lvl*.12);
      float d=min(min(min(d1,d2),min(d3,d4)),core);
      col+=ringCol(.010/(abs(d1)+.012))*(.4+.6*seg(p1,48.,.8));
      col+=ringCol(.008/(abs(d2)+.012))*seg(p2,6.,.85);
      col+=ringCol(.018/(abs(d3)+.02))*(.25+.75*seg(p3,10.,.7))*(0.6+nrg*.6);
      col+=ringCol(.004/(abs(d4)+.01))*seg(p4,120.,.5);
      col+=vec3(.75,.95,1.)*(.016+.03*lvl+.01*nrg)/(abs(core)+.03);
      tt+=max(abs(d)*.6,.02);
      if(tt>6.) break;
    }
    col*=.042*(0.7+nrg*.5+lvl*.8);
    float r=length(uv);
    col+=vec3(.1,.5,.7)*.12/(r*r*8.+.4)*(.5+lvl);   // halo
    col=1.-exp(-col*1.6);                           // tonemapping
    float a=clamp(max(col.r,max(col.g,col.b))*1.4,0.,1.)*smoothstep(1.,.75,r);
    gl_FragColor=vec4(col,a);
  }`;

  // Particules : orbites pseudo-aléatoires calculées dans le shader.
  const PVS = `attribute vec3 s; uniform float t, lvl, nrg, asp;
  varying float a;
  void main(){
    float r=0.5+s.x*0.95+lvl*.15, sp=(.08+s.y*.25)*(.4+nrg), ph=s.z*6.2831;
    float an=ph+t*sp; float y=sin(ph*3.+t*.4)*.28*s.y;
    vec3 p=vec3(cos(an)*r, y, sin(an)*r);
    float c=cos(.45), si=sin(.45); p.yz=mat2(c,-si,si,c)*p.yz;
    float z=3.2-p.z; gl_Position=vec4(p.xy*1.6/z/0.92, 0., 1.);
    gl_PointSize=(1.2+2.6*s.y)*(1.+lvl)*(2.4/z)*${(window.devicePixelRatio || 1).toFixed(2)};
    a=(.25+.6*s.x)*(.5+nrg*.5)*smoothstep(4.4,2.4,z);
  }`;
  const PFS = `precision mediump float; varying float a; uniform float hue;
  void main(){ float d=length(gl_PointCoord-.5); vec3 c=mix(vec3(.5,.9,1.), vec3(1.,.8,.45), hue);
    gl_FragColor=vec4(c, a*smoothstep(.5,0.,d)); }`;

  function program(vs, fs) {
    const pr = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh));
      gl.attachShader(pr, sh);
    }
    gl.linkProgram(pr);
    return pr;
  }
  const ring = program(VS, FS), dust = program(PVS, PFS);
  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const N = 700, seeds = new Float32Array(N * 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  const pts = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pts); gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
  const U = (pr, n) => gl.getUniformLocation(pr, n);

  // Le raymarching est coûteux : rendu à résolution réduite, mis à l'échelle par CSS.
  const SCALE = 0.7;
  function resize() {
    const w = Math.round(canvas.clientWidth * SCALE * (window.devicePixelRatio || 1));
    if (canvas.width !== w) { canvas.width = canvas.height = w; gl.viewport(0, 0, w, w); }
  }

  const t0 = performance.now();
  let last = t0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (document.hidden) { requestAnimationFrame(frame); return; }
    resize();
    state.level += (state.target - state.level) * Math.min(1, dt * (state.target > state.level ? 18 : 6));
    state.energy += (state.energyTarget - state.energy) * Math.min(1, dt * 2.5);
    state.hueNow = (state.hueNow ?? 0) + (state.hue - (state.hueNow ?? 0)) * Math.min(1, dt * 3);
    const t = (now - t0) / 1000;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(ring);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    let loc = gl.getAttribLocation(ring, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(U(ring, "t"), t); gl.uniform1f(U(ring, "lvl"), state.level);
    gl.uniform1f(U(ring, "nrg"), state.energy); gl.uniform1f(U(ring, "hue"), state.hueNow);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(loc);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(dust);
    gl.bindBuffer(gl.ARRAY_BUFFER, pts);
    loc = gl.getAttribLocation(dust, "s"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
    gl.uniform1f(U(dust, "t"), t); gl.uniform1f(U(dust, "lvl"), state.level);
    gl.uniform1f(U(dust, "nrg"), state.energy); gl.uniform1f(U(dust, "hue"), state.hueNow);
    gl.drawArrays(gl.POINTS, 0, N);
    gl.disableVertexAttribArray(loc);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
