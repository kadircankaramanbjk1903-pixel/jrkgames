/* JRK Games — paylaşılan grafik/ses kitaplığı (Savaş Arenası 3D motorundan) */
const rnd=(a,b)=>a+Math.random()*(b-a);
const r1=v=>Math.round(v*10)/10,r3=v=>Math.round(v*1000)/1000;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,sstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
const fwd=y=>new THREE.Vector3(Math.sin(y),0,Math.cos(y));
const lerpAng=(a,b,k)=>{let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*k};
const box=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
const cyl=(a,b,h,m,s=14)=>new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s),m);
const sph=(r,m)=>new THREE.Mesh(new THREE.SphereGeometry(r,18,12),m);
const cone=(r,h,m,s=14)=>new THREE.Mesh(new THREE.ConeGeometry(r,h,s),m);
const at=(o,x,y,z)=>{o.position.set(x,y,z);return o};
const rot=(o,x,y,z)=>{o.rotation.set(x,y,z);return o};
const LIN=c=>new THREE.Color(c).convertSRGBToLinear();
const MAT=(c,o={})=>{const m=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.62,metalness:.25},o));m.color.convertSRGBToLinear();if(o.emissive)m.emissive.convertSRGBToLinear();return m};
const BASIC=(c,o={})=>{const m=new THREE.MeshBasicMaterial(Object.assign({color:c},o));m.color.convertSRGBToLinear();return m};
const GFX={low:{px:1,sh:0,seg:90,dec:90,pc:900,aa:false},mid:{px:1.25,sh:1024,seg:140,dec:220,pc:2200,aa:true},high:{px:2,sh:2048,seg:200,dec:420,pc:4000,aa:true}};

/* --- gürültü ve prosedürel dokular --- */
const NZ=(()=>{let s=1903;const r=()=>(s=(s*16807)%2147483647)/2147483647;const p=new Uint8Array(512),g=new Float32Array(256);
 for(let i=0;i<256;i++){p[i]=i;g[i]=r()}for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1)),t=p[i];p[i]=p[j];p[j]=t}for(let i=0;i<256;i++)p[i+256]=p[i];
 const H=(a,b,per)=>{if(per){a=((a%per)+per)%per;b=((b%per)+per)%per}return g[p[(a&255)+p[b&255]]]};
 return (x,y,per)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=H(xi,yi,per),b=H(xi+1,yi,per),c=H(xi,yi+1,per),d=H(xi+1,yi+1,per);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}})();
function fbm(x,y,o=4){let v=0,a=.5,t=0;for(let i=0;i<o;i++){v+=a*NZ(x,y);t+=a;x*=2.03;y*=2.03;a*=.5}return v/t}
function fbmT(u,v,o,base){let s=0,a=.5,t=0,p=base;for(let i=0;i<o;i++){s+=a*NZ(u*p,v*p,p);t+=a;a*=.5;p*=2}return s/t}
const TEXC={};
function canvasTex(key,size,draw,srgb=true){if(TEXC[key])return TEXC[key];const c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d'),size);
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(srgb)t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return TEXC[key]=t}
function pixTex(key,size,fn,srgb=true){return canvasTex(key,size,(x,s)=>{const im=x.createImageData(s,s),d=im.data,o=[0,0,0,255];
 for(let j=0;j<s;j++)for(let i=0;i<s;i++){o[3]=255;fn(i/s,j/s,o);const k=(j*s+i)*4;d[k]=o[0];d[k+1]=o[1];d[k+2]=o[2];d[k+3]=o[3]}x.putImageData(im,0,0)},srgb)}
function normTex(key,size,hf,str){return canvasTex(key,size,(x,s)=>{const h=new Float32Array(s*s);for(let j=0;j<s;j++)for(let i=0;i<s;i++)h[j*s+i]=hf(i/s,j/s);
 const im=x.createImageData(s,s),d=im.data,H=(i,j)=>h[((j+s)%s)*s+((i+s)%s)];
 for(let j=0;j<s;j++)for(let i=0;i<s;i++){let nx=(H(i-1,j)-H(i+1,j))*str,ny=(H(i,j-1)-H(i,j+1))*str,l=Math.hypot(nx,ny,1);const k=(j*s+i)*4;
  d[k]=(nx/l*.5+.5)*255;d[k+1]=(ny/l*.5+.5)*255;d[k+2]=(1/l*.5+.5)*255;d[k+3]=255}x.putImageData(im,0,0)},false)}
const hex3=c=>{const n=new THREE.Color(c);return[n.r*255,n.g*255,n.b*255]};
function groundTex(th){const a=hex3(th.c[0]),b=hex3(th.c[1]),c=hex3(th.c[2]);
 return pixTex('g_'+th.n,512,(u,v,o)=>{const n=fbmT(u,v,5,4),m=sstep(.45,.75,fbmT(u+.37,v+.71,4,8)),gr=(Math.random()-.5)*14;
  for(let i=0;i<3;i++)o[i]=clamp(a[i]+(b[i]-a[i])*n*1.4+(c[i]-a[i])*m*.8+gr,0,255)})}
const groundNorm=()=>normTex('gn',256,(u,v)=>fbmT(u,v,5,8),9);
const rockTex=()=>pixTex('rock',256,(u,v,o)=>{const n=fbmT(u,v,6,4),cr=Math.abs(fbmT(u+.5,v,4,6)-.5)<.02?-50:0,l=clamp(95+n*120+cr+(Math.random()-.5)*16,0,255);o[0]=o[1]=o[2]=l});
const rockNorm=()=>normTex('rn',256,(u,v)=>fbmT(u,v,6,4),6);
const waterNorm=()=>normTex('wn',256,(u,v)=>fbmT(u,v,4,6)*.7+fbmT(u,v,3,18)*.3,5);
const softTex=()=>canvasTex('soft',64,(x,s)=>{const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'#fff');g.addColorStop(.25,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,s,s)},false);
const puffTex=()=>pixTex('puff',128,(u,v,o)=>{const d=Math.hypot(u-.5,v-.5)*2,n=fbmT(u,v,4,4),a=clamp((1-d)*1.6*(.45+n*.9),0,1);o[0]=o[1]=o[2]=200+n*55;o[3]=a*a*255},false);
const cloudTex=()=>pixTex('cloud',256,(u,v,o)=>{const d=Math.hypot(u-.5,(v-.5)*1.4)*2,n=fbmT(u,v,5,3),a=clamp((1-d)*1.3+(n-.5)*1.4,0,1);o[0]=o[1]=o[2]=215+n*40;o[3]=a*a*230},true);
const facadeTex=()=>canvasTex('facade',256,(x,s)=>{x.fillStyle='#8d8a84';x.fillRect(0,0,s,s);
 for(let i=0;i<1600;i++){const l=Math.random()*60|0;x.fillStyle=`rgba(${l},${l},${l},.08)`;x.fillRect(Math.random()*s,Math.random()*s,3+Math.random()*10,2+Math.random()*6)}
 for(let r=0;r<4;r++)for(let c=0;c<4;c++){const X=c*64+14,Y=r*64+12;x.fillStyle='#55524c';x.fillRect(X-3,Y-3,42,44);const g=x.createLinearGradient(X,Y,X+36,Y+38);
  const lit=Math.random()<.12;g.addColorStop(0,lit?'#e8c77a':'#2c3a48');g.addColorStop(1,lit?'#b08a40':'#141c24');x.fillStyle=g;x.fillRect(X,Y,36,38);x.fillStyle='#4a4842';x.fillRect(X+17,Y,2,38);x.fillRect(X,Y+18,36,2);x.fillStyle='#a19d95';x.fillRect(X-4,Y+40,44,4)}
 x.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<8;i++)x.fillRect(Math.random()*s,0,2+Math.random()*4,s)});
const crateTex=()=>canvasTex('crate',128,(x,s)=>{x.fillStyle='#8a6a3e';x.fillRect(0,0,s,s);for(let i=0;i<s;i+=16){x.fillStyle=i%32?'#7a5c34':'#94733f';x.fillRect(0,i,s,15);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,i+15,s,1)}
 x.strokeStyle='#5a4224';x.lineWidth=12;x.strokeRect(6,6,s-12,s-12);x.beginPath();x.moveTo(8,8);x.lineTo(s-8,s-8);x.stroke();x.fillStyle='#2a2a2a';x.font='bold 18px sans-serif';x.fillText('AMMO',38,72)});
const corrTex=()=>canvasTex('corr',128,(x,s)=>{for(let i=0;i<s;i+=8){const g=x.createLinearGradient(i,0,i+8,0);g.addColorStop(0,'#c8c8c8');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#9a9a9a');x.fillStyle=g;x.fillRect(i,0,8,s)}
 for(let i=0;i<120;i++){x.fillStyle=`rgba(90,50,20,${Math.random()*.25})`;x.fillRect(Math.random()*s,Math.random()*s,2+Math.random()*6,2+Math.random()*12)}});
const concTex=()=>pixTex('conc',128,(u,v,o)=>{const l=clamp(150+fbmT(u,v,5,4)*70+(Math.random()-.5)*20,0,255);o[0]=l;o[1]=l*.98;o[2]=l*.94});

/* --- ses efektleri (Web Audio ile üretiliyor, dosya gerekmez) --- */
const SFX={ac:null,on:DB.get('snd',true)};
function sfxInit(){if(SFX.ac){if(SFX.ac.state==='suspended')SFX.ac.resume();return}try{const ac=new(window.AudioContext||window.webkitAudioContext)();SFX.ac=ac;
 const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;SFX.noise=b;
 SFX.master=ac.createGain();SFX.master.gain.value=.55;const comp=ac.createDynamicsCompressor();SFX.master.connect(comp).connect(ac.destination)}catch(e){}}
function sfx(type,dist=0){if(!SFX.on||!SFX.ac)return;const ac=SFX.ac,t=ac.currentTime,vol=Math.pow(Math.max(0,1-dist/260),1.6);if(vol<.03)return;
 const out=ac.createGain();out.gain.value=vol;out.connect(SFX.master);
 const nz=(dur,f,q,ty,g0)=>{const s=ac.createBufferSource();s.buffer=SFX.noise;const fl=ac.createBiquadFilter();fl.type=ty;fl.frequency.value=f;fl.Q.value=q;const g=ac.createGain();g.gain.setValueAtTime(g0,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(fl).connect(g).connect(out);s.start(t,Math.random()*1.4);s.stop(t+dur+.05)};
 const tn=(f0,f1,dur,g0,w='sine')=>{const o=ac.createOscillator();o.type=w;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=ac.createGain();g.gain.setValueAtTime(g0,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g).connect(out);o.start(t);o.stop(t+dur+.05)};
 if(type==='rifle'){nz(.11,1900,.9,'bandpass',1.3);nz(.3,500,.7,'lowpass',.7);tn(150,55,.08,.6)}
 else if(type==='cannon'){nz(1.1,650,.6,'lowpass',1.6);tn(85,28,.6,1.2);nz(.07,2600,1,'bandpass',.7)}
 else if(type==='mg'){nz(.06,2400,1.2,'bandpass',.9);tn(210,80,.05,.35)}
 else if(type==='sniper'){nz(.2,1600,.7,'bandpass',1.7);nz(.9,280,.5,'lowpass',1.1);tn(110,35,.25,.9)}
 else if(type==='rocket'){nz(.7,900,.4,'bandpass',1);nz(.3,300,.6,'lowpass',.8);tn(260,70,.45,.35,'sawtooth')}
 else if(type==='nuke'){nz(7,260,.4,'lowpass',2.4);nz(4,90,.6,'lowpass',2);nz(.6,2000,.5,'bandpass',1);tn(55,14,6,2.2);tn(90,25,3,1)}
 else if(type==='alarm'){tn(880,880,.18,.25,'square')}
 else if(type==='laser'){tn(1500,180,.16,.22,'sawtooth');tn(700,90,.12,.18,'square')}
 else if(type==='boom'){nz(2.2,420,.5,'lowpass',1.8);nz(.18,2800,.6,'bandpass',.6);tn(65,20,1.4,1.4)}
 else if(type==='small'){nz(.5,900,.6,'lowpass',.9);tn(120,40,.25,.5)}
 else if(type==='splash'){nz(.9,1200,.4,'lowpass',.9)}
 else if(type==='hit'){tn(1900,1300,.05,.18,'square')}
 else if(type==='hurt'){nz(.18,320,1,'lowpass',1)}}
function shadowify(g,cast=true){g.traverse(o=>{if(o.isMesh&&!o.material.isMeshBasicMaterial){o.castShadow=cast;o.receiveShadow=true}});return g}
const SKY_VS='varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
function skyDome(th,sunDir){const m=new THREE.ShaderMaterial({uniforms:{top:{value:LIN(th.top)},hor:{value:LIN(th.sky)},sunC:{value:LIN(th.sunC)},sd:{value:sunDir}},
 vertexShader:SKY_VS,fragmentShader:`uniform vec3 top,hor,sunC,sd;varying vec3 vW;void main(){vec3 d=normalize(vW-cameraPosition);float h=max(d.y,0.);vec3 c=mix(hor,top,pow(h,.5));
 float s=max(dot(d,sd),0.);c+=sunC*(pow(s,900.)*8.+pow(s,24.)*.5+pow(s,4.)*.12);if(d.y<0.)c=hor;gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <encodings_fragment>
 }`,side:THREE.BackSide,depthWrite:false,fog:false});
 const s=new THREE.Mesh(new THREE.SphereGeometry(1400,32,16),m);s.renderOrder=-1;s.frustumCulled=false;return s}
function nebulaDome(th){const m=new THREE.ShaderMaterial({uniforms:{c1:{value:new THREE.Color(th.neb[0])},c2:{value:new THREE.Color(th.neb[1])},c3:{value:new THREE.Color(th.neb[2])}},vertexShader:SKY_VS,
 fragmentShader:`uniform vec3 c1,c2,c3;varying vec3 vW;float hs(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float ns(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fb(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*ns(p);p*=2.03;a*=.5;}return v;}
 void main(){vec3 d=normalize(vW-cameraPosition);float n=fb(d*2.6+3.),n2=fb(d*5.+7.),n3=fb(d*1.7+11.);
 vec3 c=mix(c1,c2,n2)*pow(smoothstep(.4,.85,n),1.5)*1.9+c3*pow(smoothstep(.5,.9,n3),2.)*1.2;gl_FragColor=vec4(c,1.);}`,side:THREE.BackSide,depthWrite:false,fog:false});
 const s=new THREE.Mesh(new THREE.SphereGeometry(1400,32,16),m);s.renderOrder=-1;s.frustumCulled=false;return s}
function envCube(top,hor,gnd){const f=(a,b)=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,64);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,64,64);return c};
 const side=()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,64);g.addColorStop(0,top);g.addColorStop(.5,hor);g.addColorStop(.52,gnd);g.addColorStop(1,gnd);x.fillStyle=g;x.fillRect(0,0,64,64);return c};
 const t=new THREE.CubeTexture([side(),side(),f(top,top),f(gnd,gnd),side(),side()]);t.encoding=THREE.sRGBEncoding;t.needsUpdate=true;return t}
/* --- parçacık sistemi (ateş, duman, toz, köpük) --- */
const PS_VS=`attribute float size;attribute vec4 rgba;varying vec4 vC;uniform float scale,fogN,fogF;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vC=rgba;vC.a*=(1.-smoothstep(fogN,fogF,-mv.z))*smoothstep(.6,3.5,-mv.z);gl_PointSize=min(size*scale/max(-mv.z,.1),512.);gl_Position=projectionMatrix*mv;}`;
const PS_FS=`uniform sampler2D map;varying vec4 vC;void main(){vec4 t=texture2D(map,gl_PointCoord);gl_FragColor=vec4(vC.rgb*t.rgb,vC.a*t.a);}`;
function mkPS(scene,cap,add,map){const geo=new THREE.BufferGeometry(),pos=new Float32Array(cap*3),col=new Float32Array(cap*4),siz=new Float32Array(cap);
 const A=(n,a,s)=>{const b=new THREE.BufferAttribute(a,s);b.setUsage(THREE.DynamicDrawUsage);geo.setAttribute(n,b);return b};A('position',pos,3);A('rgba',col,4);A('size',siz,1);geo.setDrawRange(0,0);
 const mat=new THREE.ShaderMaterial({uniforms:{map:{value:map},scale:{value:600},fogN:{value:1e4},fogF:{value:2e4}},vertexShader:PS_VS,fragmentShader:PS_FS,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending});
 const pts=new THREE.Points(geo,mat);pts.frustumCulled=false;pts.renderOrder=add?3:2;scene.add(pts);return{pts,geo,pos,col,siz,cap,list:[],mat}}
function emit(ps,x,y,z,vx,vy,vz,life,s0,s1,c0,c1,a0,drag=0,g=0){if(ps.list.length>=ps.cap)return;ps.list.push({x,y,z,vx,vy,vz,t:0,life,s0,s1,c0,c1,a0,drag,g})}
function updPS(ps,dt){const L=ps.list;for(let i=L.length-1;i>=0;i--){L[i].t+=dt;if(L[i].t>=L[i].life){L[i]=L[L.length-1];L.pop()}}
 for(let i=0;i<L.length;i++){const p=L[i],k=p.t/p.life,dr=Math.max(0,1-p.drag*dt);p.vx*=dr;p.vz*=dr;p.vy=p.vy*dr+p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
  const o3=i*3,o4=i*4,e=1-(1-k)*(1-k);ps.pos[o3]=p.x;ps.pos[o3+1]=p.y;ps.pos[o3+2]=p.z;ps.siz[i]=p.s0+(p.s1-p.s0)*e;
  ps.col[o4]=p.c0[0]+(p.c1[0]-p.c0[0])*k;ps.col[o4+1]=p.c0[1]+(p.c1[1]-p.c0[1])*k;ps.col[o4+2]=p.c0[2]+(p.c1[2]-p.c0[2])*k;ps.col[o4+3]=p.a0*Math.min(1,k*12)*(1-k)}
 ps.geo.setDrawRange(0,L.length);const a=ps.geo.attributes;a.position.needsUpdate=a.rgba.needsUpdate=a.size.needsUpdate=true}
const C={fire0:[1,.85,.5],fire1:[.9,.25,.05],flash:[1,.95,.8],spark:[1,.8,.4],smk0:[.22,.2,.19],smk1:[.5,.49,.47],lsmk0:[.55,.54,.52],lsmk1:[.75,.74,.72],dust0:[.62,.54,.42],dust1:[.75,.68,.56],foam:[.92,.96,1],eng:[1,.6,.25],engB:[.45,.8,1],ember:[1,.45,.1],snow:[1,1,1]};

