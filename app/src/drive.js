/* ===== JRK Sürüş Motoru: çocuk soru yolu, gerçekçi yarış, açık dünya ===== */
const ENVS=[
 {n:'Çöl',sky:'#e9d3a6',top:'#3f7cc4',c:['#c9a46a','#a8834e','#dcc18e'],rock:'#a07a52',mtn:70,el:.75,az:.8,sunC:'#fff1d6',sun:3.2,hemi:.9,exp:.95,cloud:'#ffffff',deco:{cactus:3,rock:3,dead:1}},
 {n:'Kutup',sky:'#c9d8e6',top:'#5a8cc8',c:['#e6edf2','#c9d6e0','#ffffff'],rock:'#6a7078',mtn:120,snowcap:1,el:.35,az:2.2,sunC:'#ffe8d0',sun:2.6,hemi:1,exp:.85,cloud:'#f4f7fb',weather:'snow',deco:{snowpine:5,rock:2}},
 {n:'Orman',sky:'#bcd4c4',top:'#4a86cf',c:['#3f6a2c','#2f5222','#5a7f38'],rock:'#6b6a5e',mtn:90,snowcap:1,el:.9,az:1.2,sunC:'#fff4e0',sun:3,hemi:.95,exp:1,cloud:'#ffffff',deco:{pine:4,tree:4,bush:2,rock:1}},
 {n:'Gece Şehri',sky:'#18243a',top:'#03060f',c:['#2a3326','#1e261c','#38402f'],rock:'#4a4c50',mtn:80,el:.6,az:3.6,sunC:'#9fb4ff',sun:.7,hemi:.4,exp:1.3,cloud:'#3a4660',night:1,deco:{building:5,tree:1}},
 {n:'Volkan',sky:'#5a3024',top:'#1e0d0a',c:['#3a2a26','#2a1d1a','#4f3328'],rock:'#2e2522',mtn:130,el:.5,az:4.2,sunC:'#ffb080',sun:2,hemi:.6,exp:1.1,cloud:'#5a4a46',deco:{rock:5,dead:2}},
 {n:'Bozkır',sky:'#cfdbe6',top:'#4a84c8',c:['#8f9a4f','#73803f','#a8ab62'],rock:'#7a7464',mtn:60,el:1,az:5.1,sunC:'#fff4e2',sun:3.1,hemi:.95,exp:1,cloud:'#ffffff',deco:{tree:3,bush:3,rock:2,hay:1}},
 {n:'Kanyon',sky:'#eac0a0',top:'#4a7ab8',c:['#a3532f','#8a4325','#c06a3e'],rock:'#9a4a2a',mtn:150,el:.7,az:.3,sunC:'#ffe6c8',sun:3.2,hemi:.85,exp:.95,cloud:'#fff4ea',deco:{rock:6,cactus:1}},
 {n:'Şehir',sky:'#a9b3bd',top:'#5a7a9a',c:['#55595e','#45494d','#6a6d70'],rock:'#6a6a6a',mtn:50,el:.8,az:2.8,sunC:'#fff6ea',sun:2.6,hemi:1,exp:1,cloud:'#e8ecf0',deco:{building:6,tree:1}},
 {n:'Bataklık',sky:'#8a9a84',top:'#4a5e5a',c:['#4a5a35','#3a4828','#5a6a40'],rock:'#4e5244',mtn:55,el:.55,az:1.9,sunC:'#e8f0d0',sun:1.8,hemi:.9,exp:1.05,cloud:'#c0c8bc',deco:{dead:3,tree:2,bush:2}},
 {n:'Gün Batımı',sky:'#ff9e64',top:'#2e3c7a',c:['#7a5a40','#5e4430','#8e6c4c'],rock:'#5a4234',mtn:85,el:.12,az:4.7,sunC:'#ffb070',sun:2.6,hemi:.75,exp:1.05,cloud:'#ffc0a0',deco:{tree:2,rock:2,building:1,palm:1}},
 {n:'Sahil',sky:'#bfe3f5',top:'#3b8fd9',c:['#e3cf9b','#cdb47a','#efe0b5'],rock:'#a99070',mtn:55,el:.95,az:1.1,sunC:'#fff6e0',sun:3.1,hemi:1,exp:.95,cloud:'#ffffff',sea:1,deco:{palm:5,bush:1,rock:1}}];
const CARS={spor:{max:62,acc:13,turn:1.9,grip:7,col:'#c8102e'},kas:{max:66,acc:14,turn:1.6,grip:5.5,col:'#1b2a4a'},ralli:{max:58,acc:13.5,turn:2.25,grip:8,col:'#1e5fbf'},gt:{max:68,acc:15,turn:2,grip:7.5,col:'#f2b705'},super:{max:75,acc:17,turn:2.05,grip:7.2,col:'#ff5a1f'},
 araba:{col:'#e23b3b'},otobus:{col:'#f5b800'},itfaiye:{col:'#d42020'},polis:{col:'#f4f6f8'},traktor:{col:'#2f8a3a'},dondurma:{col:'#ff9ecf'},yaris:{col:'#1e88e5'},police:{max:64,acc:14,turn:1.9,grip:7,col:'#f4f6f8'}};
const AICOL=['#c8102e','#1e5fbf','#11823b','#f2b705','#141414','#eceff3','#8b2be2','#ff5a1f','#00a7a7','#7a4a2a'];
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* --- dokular --- */
const roadTex=lanes=>canvasTex('road'+lanes,512,(x,s)=>{x.fillStyle='#3b3c40';x.fillRect(0,0,s,s);
 for(let i=0;i<14000;i++){const l=35+Math.random()*60|0;x.fillStyle=`rgba(${l},${l},${l+4},.4)`;x.fillRect(Math.random()*s,Math.random()*s,2,2)}
 for(let i=0;i<30;i++){x.fillStyle=`rgba(0,0,0,${Math.random()*.12})`;x.fillRect(Math.random()*s,0,4+Math.random()*30,s)}
 x.fillStyle='#ececec';x.fillRect(s*.025,0,s*.022,s);x.fillRect(s*.953,0,s*.022,s);
 if(lanes===3){x.fillStyle='#f4f4f4';for(const u of[1/3,2/3])x.fillRect(s*u-s*.008,0,s*.016,s*.55)}else{x.fillStyle='#f2c230';x.fillRect(s*.492,0,s*.016,s*.55)}});
const curbTex=()=>canvasTex('curb',64,(x,s)=>{x.fillStyle='#d8262c';x.fillRect(0,0,s,s/2);x.fillStyle='#f2f2f2';x.fillRect(0,s/2,s,s/2)});
const checkTex=()=>canvasTex('check',128,(x,s)=>{for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#111':'#f4f4f4';x.fillRect(i*16,j*16,16,16)}});
const crowdTex=()=>canvasTex('crowd',256,(x,s)=>{x.fillStyle='#2a2d33';x.fillRect(0,0,s,s);for(let i=0;i<2600;i++){x.fillStyle=`hsl(${Math.random()*360},60%,${35+Math.random()*40}%)`;x.fillRect(Math.random()*s,Math.random()*s,4,5)}
 x.fillStyle='rgba(0,0,0,.35)';for(let j=0;j<s;j+=32)x.fillRect(0,j,s,6)});
const bannerTex=(txt,bg,fg)=>canvasTex('ban'+txt+bg,512,(x,s)=>{x.fillStyle=bg;x.fillRect(0,0,s,s);x.fillStyle=fg;x.font='bold 150px Rajdhani,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,s/2,s/2)},true);
const grassTex=()=>pixTex('grassP',256,(u,v,o)=>{const n=fbmT(u,v,5,6),g=(Math.random()-.5)*20;o[0]=60+n*40+g;o[1]=110+n*50+g;o[2]=45+n*25+g});
function numTex(n,col){const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,160);g.addColorStop(0,col);g.addColorStop(1,'#00000055');
 x.fillStyle=col;x.beginPath();x.roundRect?x.roundRect(6,6,244,148,26):x.rect(6,6,244,148);x.fill();x.fillStyle=g;x.fill();x.lineWidth=8;x.strokeStyle='#fff';x.stroke();
 x.fillStyle='#fff';x.font='bold 112px "Baloo 2",Nunito,Arial';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#0007';x.shadowBlur=8;x.fillText(n,128,86);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t}

/* --- geometri yardımcıları --- */
function mergeGeos(parts){let pos=[],nor=[],col=[];for(const[g0,c]of parts){const g=g0.index?g0.toNonIndexed():g0;const p=g.attributes.position.array,n=g.attributes.normal.array,lc=LIN(c);
  for(let i=0;i<p.length;i++){pos.push(p[i]);nor.push(n[i])}for(let i=0;i<p.length/3;i++)col.push(lc.r,lc.g,lc.b)}
 const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));m.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));m.setAttribute('color',new THREE.Float32BufferAttribute(col,3));return m}
function decoGeo(k){const T=(g,x,y,z)=>g.translate(x,y,z);
 if(k==='pine')return mergeGeos([[T(new THREE.CylinderGeometry(.22,.35,3,6),0,1.5,0),'#4a3424'],[T(new THREE.ConeGeometry(2.4,4.5,8),0,4,0),'#24452a'],[T(new THREE.ConeGeometry(1.8,3.6,8),0,6,0),'#2a5232'],[T(new THREE.ConeGeometry(1.1,2.6,8),0,7.8,0),'#2f5a36']]);
 if(k==='snowpine')return mergeGeos([[T(new THREE.CylinderGeometry(.22,.35,3,6),0,1.5,0),'#4a3424'],[T(new THREE.ConeGeometry(2.4,4.5,8),0,4,0),'#4f6f5f'],[T(new THREE.ConeGeometry(1.8,3.6,8),0,6,0),'#dfe8ee'],[T(new THREE.ConeGeometry(1.1,2.6,8),0,7.8,0),'#f4f7fa']]);
 if(k==='tree')return mergeGeos([[T(new THREE.CylinderGeometry(.25,.4,3.4,7),0,1.7,0),'#4a3424'],[T(new THREE.IcosahedronGeometry(2.4,1),0,4.6,0),'#3a6a2a'],[T(new THREE.IcosahedronGeometry(1.8,1),1.2,5.4,.4),'#467a32'],[T(new THREE.IcosahedronGeometry(1.6,1),-1,5,-.6),'#356326']]);
 if(k==='bush')return mergeGeos([[T(new THREE.IcosahedronGeometry(1.1,1),0,.8,0),'#3d6e2c'],[T(new THREE.IcosahedronGeometry(.8,1),.8,.6,.3),'#4a7d34']]);
 if(k==='palm'){const p=[[T(new THREE.CylinderGeometry(.18,.3,7,7),0,3.5,0),'#8a6a44']];for(let i=0;i<7;i++){const f=new THREE.BoxGeometry(.5,.08,3.6);f.translate(0,0,1.8);f.rotateX(.45);f.rotateY(i/7*Math.PI*2);f.translate(0,7,0);p.push([f,'#3f8a3a'])}return mergeGeos(p)}
 if(k==='cactus')return mergeGeos([[T(new THREE.CylinderGeometry(.35,.4,3.6,8),0,1.8,0),'#4a7a3a'],[T(new THREE.CylinderGeometry(.22,.24,1.3,8),.75,2.4,0),'#4a7a3a'],[T(new THREE.CylinderGeometry(.22,.22,.7,8).rotateZ(Math.PI/2),.45,1.8,0),'#4a7a3a'],[T(new THREE.CylinderGeometry(.2,.22,1.1,8),-.7,2.1,0),'#4a7a3a'],[T(new THREE.CylinderGeometry(.2,.2,.6,8).rotateZ(Math.PI/2),-.4,1.6,0),'#4a7a3a']]);
 if(k==='dead')return mergeGeos([[T(new THREE.CylinderGeometry(.14,.3,5,6),0,2.5,0),'#4a3a2c'],[T(new THREE.CylinderGeometry(.05,.12,2,5).rotateZ(.9),.6,3.4,0),'#4a3a2c'],[T(new THREE.CylinderGeometry(.05,.1,1.6,5).rotateZ(-1),-.5,4,0),'#4a3a2c']]);
 if(k==='hay')return mergeGeos([[new THREE.CylinderGeometry(.9,.9,1.4,14).rotateZ(Math.PI/2).translate(0,.9,0),'#d8b24a']]);
 if(k==='rock'){const g=new THREE.DodecahedronGeometry(1.6,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const s=.75+fbm(p.getX(i)*.9+3,p.getZ(i)*.9+p.getY(i),3)*.6;p.setXYZ(i,p.getX(i)*s,p.getY(i)*s*.7+.6,p.getZ(i)*s)}g.computeVertexNormals();return mergeGeos([[g,'#8a8378']])}
 return null}

/* --- araç modelleri --- */
function profGeo(pts,w,bev=.08){const s=new THREE.Shape();s.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)s.lineTo(pts[i][0],pts[i][1]);
 const g=new THREE.ExtrudeGeometry(s,{depth:w-bev*2,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:3,curveSegments:4});g.translate(0,0,-(w-bev*2)/2);g.rotateY(-Math.PI/2);g.computeVertexNormals();return g}
function wheel(r,w,rimC){const g=new THREE.Group(),t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w,20),MAT('#151515',{roughness:.92,metalness:0}));t.rotation.z=Math.PI/2;g.add(t);
 const rim=new THREE.Mesh(new THREE.CylinderGeometry(r*.62,r*.62,w+.02,14),MAT(rimC||'#c9ccd1',{roughness:.25,metalness:.95}));rim.rotation.z=Math.PI/2;g.add(rim);
 for(let i=0;i<5;i++){const sp=box(w+.04,r*.12,r*1.1,MAT('#2a2a2a',{metalness:.6}));sp.rotation.x=i/5*Math.PI;g.add(sp)}return g}
function makeCar(type,color,opt={}){const g=new THREE.Group(),c=color||CARS[type].col,paint=MAT(c,{roughness:.22,metalness:.55,envMapIntensity:1.4}),dark=MAT('#18191b',{roughness:.6,metalness:.3}),
 glass=MAT('#0e1620',{roughness:.05,metalness:.9,envMapIntensity:1.6}),chrome=MAT('#d9dde2',{roughness:.15,metalness:1}),hl=BASIC('#fffbe6'),tl=BASIC('#ff2a2a');
 const ud=g.userData;ud.wheels=[];ud.front=[];let L=4.4,W=1.86,wr=.36,wz=[1.38,-1.38],wy=.36,wx=.82;
 const addW=(x,y,z,r,w,front)=>{const pv=at(new THREE.Group(),x,y,z),wh=wheel(r,w,opt.rim);pv.add(wh);g.add(pv);ud.wheels.push(wh);if(front)ud.front.push(pv)};
 if(['spor','gt','kas','super','ralli','police','polis'].includes(type)){
  const P={spor:[[-2.2,.32],[-2.24,.72],[-1.95,.9],[-.75,.98],[.95,.92],[1.95,.72],[2.22,.5],[2.2,.3]],gt:[[-2.25,.3],[-2.28,.7],[-1.95,.86],[-.7,.95],[1,.88],[2,.66],[2.28,.45],[2.25,.28]],
   kas:[[-2.4,.34],[-2.42,.82],[-2.1,.98],[-.8,1.02],[1.2,1],[2.28,.86],[2.42,.62],[2.4,.32]],super:[[-2.25,.28],[-2.3,.7],[-2,.84],[-.4,.86],[1.2,.7],[2.1,.5],[2.32,.36],[2.28,.25]],
   ralli:[[-1.95,.34],[-2,.86],[-1.8,1],[-.2,1.02],[1.1,.96],[1.85,.76],[2.02,.52],[2,.32]],police:[[-2.35,.33],[-2.38,.78],[-2.05,.95],[-.8,1],[1.1,.96],[2.15,.78],[2.38,.55],[2.35,.32]]}[type==='polis'?'police':type];
  const C={spor:[[-1.15,.9],[-.55,1.36],[.45,1.38],[1.05,.92]],gt:[[-1.1,.86],[-.5,1.28],[.45,1.3],[1.1,.88]],kas:[[-1.3,.98],[-.75,1.42],[.35,1.44],[.95,1]],super:[[-1.0,.82],[-.2,1.18],[.55,1.2],[1.35,.74]],
   ralli:[[-1.8,.98],[-1.55,1.5],[.3,1.52],[1.0,.98]],police:[[-1.25,.95],[-.7,1.42],[.5,1.44],[1.15,.98]]}[type==='polis'?'police':type];
  if(type==='kas')W=1.95;if(type==='super')W=2;if(type==='ralli'){L=4;W=1.8;wz=[1.25,-1.25]}
  g.add(new THREE.Mesh(profGeo(P,W),paint));const cab=new THREE.Mesh(profGeo(C,W*.82,.06),glass);g.add(cab);
  if(type!=='super')g.add(at(box(W*.74,.05,Math.abs(C[2][0]-C[1][0])*.92,paint),0,C[1][1]+.03,(C[1][0]+C[2][0])/2));
  for(const s of[-1,1]){g.add(at(box(.36,.13,.06,hl),s*W*.32,.62,P[P.length-2][0]+.04));g.add(at(box(.42,.12,.06,tl),s*W*.32,.7,P[1][0]-.04));g.add(at(box(.08,.08,.22,dark),s*(W/2+.02),.98,.75))}
  g.add(at(box(W*.5,.16,.05,dark),0,.42,P[P.length-1][0]+.06));g.add(at(box(W*.86,.12,.08,dark),0,.3,P[0][0]-.05));
  if(type==='gt'||type==='super'){const wg=box(W*.92,.06,.45,dark);g.add(at(wg,0,type==='gt'?1.18:1.0,-1.9));for(const s of[-1,1])g.add(at(box(.06,.3,.3,dark),s*W*.38,type==='gt'?1.02:.9,-1.9))}
  if(type==='kas')g.add(at(box(.6,.14,.8,dark),0,1.06,1.1));
  if(type==='ralli'){g.add(at(box(.5,.12,.6,dark),0,1.58,-.6));g.add(at(box(W+.02,.12,.5,BASIC('#ffffff')),0,.72,.2));for(const s of[-1,1])g.add(at(box(.3,.35,.04,dark),s*.7,.25,-1.6))}
  if(type==='police'||type==='polis'){g.add(at(box(W+.02,.32,1.6,MAT('#141414',{roughness:.4,metalness:.4})),0,.62,0));const lb=at(new THREE.Group(),0,1.5,-.1);lb.add(box(1.2,.08,.3,dark));
   const r=at(box(.5,.14,.28,BASIC('#ff1a1a')),-.32,.1,0),b=at(box(.5,.14,.28,BASIC('#1a5cff')),.32,.1,0);lb.add(r,b);g.add(lb);ud.siren=[r,b]}
  wr=type==='kas'?.38:type==='super'?.37:.35;wx=W/2-.12;wy=wr;wz=type==='ralli'?[1.25,-1.25]:[L*.32,-L*.31]}
 else if(type==='araba'){L=3.4;W=1.7;g.add(new THREE.Mesh(profGeo([[-1.6,.35],[-1.7,.85],[-1.3,1.05],[1.2,1.05],[1.65,.8],[1.7,.38]],W,.18),paint));
  const cab=new THREE.Mesh(new THREE.SphereGeometry(1,20,12,0,Math.PI*2,0,Math.PI/2),glass);cab.scale.set(.75,.62,1.05);g.add(at(cab,0,1.02,-.15));
  for(const s of[-1,1]){g.add(at(new THREE.Mesh(new THREE.SphereGeometry(.17,12,8),hl),s*.55,.75,1.66));g.add(at(box(.3,.14,.06,tl),s*.55,.8,-1.7))}wr=.38;wx=.75;wy=.38;wz=[1.05,-1.05]}
 else if(type==='otobus'){L=7;W=2.3;g.add(at(box(W,2.2,L,paint),0,1.55,0));g.add(at(box(W+.02,.7,L-1.4,glass),0,2.05,-.2));g.add(at(box(W*.86,.8,.05,glass),0,2,L/2+.01));
  g.add(at(box(W+.02,.16,L+.02,dark),0,.7,0));g.add(at(box(W+.04,.12,L-1.4,dark),0,1.68,-.2));for(const s of[-1,1]){g.add(at(box(.3,.2,.05,hl),s*.8,.95,L/2+.02));g.add(at(box(.3,.2,.05,tl),s*.8,1.1,-L/2-.02))}
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.4),new THREE.MeshBasicMaterial({map:bannerTex('OKUL','#f5b800','#111'),side:THREE.DoubleSide}));g.add(at(sg,0,2.85,L/2+.02));wr=.5;wx=W/2-.1;wy=.5;wz=[2.4,-2.2]}
 else if(type==='itfaiye'){L=6.4;W=2.2;g.add(at(box(W,1.6,2.2,paint),0,1.45,L/2-1.1));g.add(at(box(W*.9,.6,.05,glass),0,1.75,L/2+.01));g.add(at(box(W,1.25,L-2.4,paint),0,1.25,-1.2));
  g.add(at(box(W+.02,.14,L,chrome),0,.65,0));const lad=at(new THREE.Group(),0,2.05,-1);for(const s of[-1,1])lad.add(at(box(.08,.08,4.6,chrome),s*.45,0,0));for(let i=0;i<9;i++)lad.add(at(box(.9,.05,.05,chrome),0,0,-2.2+i*.55));lad.rotation.x=-.05;g.add(lad);
  const r=at(box(.45,.16,.3,BASIC('#ff1a1a')),-.4,2.33,L/2-1),b=at(box(.45,.16,.3,BASIC('#ff1a1a')),.4,2.33,L/2-1);g.add(r,b);ud.siren=[r,b];for(const s of[-1,1])g.add(at(box(.3,.2,.05,hl),s*.75,.95,L/2+.02));wr=.48;wx=W/2-.1;wy=.48;wz=[2.2,-2]}
 else if(type==='traktor'){L=3.6;W=1.8;g.add(at(box(1.1,.9,2.2,paint),0,1.1,.6));g.add(at(box(1.4,.25,2.8,dark),0,.65,.2));
  const cab=at(new THREE.Group(),0,1.55,-.8);for(const x of[-.6,.6])for(const z of[-.5,.5])cab.add(at(box(.07,1.5,.07,dark),x,.75,z));cab.add(at(box(1.4,.08,1.2,paint),0,1.5,0));cab.add(at(box(1.3,1.1,1.1,glass),0,.75,0));g.add(cab);
  g.add(at(cyl(.09,.09,1,chrome,8),.35,2,1.1));g.add(at(box(.25,.2,.05,hl),.3,1.25,1.71));g.add(at(box(.25,.2,.05,hl),-.3,1.25,1.71));
  addW(-.95,.85,-.9,.85,.55);addW(.95,.85,-.9,.85,.55);addW(-.75,.45,1.25,.45,.35,1);addW(.75,.45,1.25,.45,.35,1);ud.ownWheels=1;wr=.6}
 else if(type==='dondurma'){L=5;W=2.1;g.add(at(box(W,1.4,1.8,paint),0,1.25,L/2-.9));g.add(at(box(W*.9,.6,.05,glass),0,1.55,L/2+.01));g.add(at(box(W,2.1,L-1.8,BASIC('#fff6fb')),0,1.6,-.9));
  g.add(at(box(W+.02,.6,L-1.9,paint),0,.95,-.9));const cone=at(new THREE.Group(),0,3.1,-.9);cone.add(rot(at(new THREE.Mesh(new THREE.ConeGeometry(.45,1.2,14),MAT('#d9a35a')),0,0,0),Math.PI,0,0));cone.add(at(new THREE.Mesh(new THREE.SphereGeometry(.55,14,10),MAT('#ff8fc4')),0,.7,0));cone.add(at(new THREE.Mesh(new THREE.SphereGeometry(.45,14,10),MAT('#fff3d6')),0,1.15,0));g.add(cone);
  for(const s of[-1,1])g.add(at(box(.3,.2,.05,hl),s*.75,.95,L/2+.02));wr=.45;wx=W/2-.1;wy=.45;wz=[1.7,-1.7]}
 else if(type==='yaris'){L=4.6;W=1.6;g.add(new THREE.Mesh(profGeo([[-2,.3],[-2.05,.6],[-.6,.72],[.3,.85],[1.8,.5],[2.3,.35],[2.25,.25]],.9,.06),paint));
  g.add(at(box(1.9,.06,.6,paint),0,.3,2.15));g.add(at(box(1.7,.06,.5,dark),0,1.0,-1.95));for(const s of[-1,1])g.add(at(box(.06,.45,.4,dark),s*.7,.78,-1.95));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(.28,14,10),MAT('#ffd400',{roughness:.3})),0,.98,-.1));g.add(at(box(.9,.3,1.2,paint),0,.5,-.9));wr=.38;wx=.85;wy=.38;wz=[1.55,-1.45]}
 if(!ud.ownWheels){addW(-wx,wy,wz[0],wr,.3,1);addW(wx,wy,wz[0],wr,.3,1);addW(-wx,wy,wz[1],wr,.3);addW(wx,wy,wz[1],wr,.3)}
 ud.wr=wr;ud.len=L;ud.wid=W;return shadowify(g)}

/* --- pist üretimi --- */
function makeTrack(seed,size=1,lanes=2){const r=mulberry(seed),N=9+Math.floor(r()*6),R0=(200+r()*160)*size,pts=[];
 for(let i=0;i<N;i++){const a=i/N*Math.PI*2+(r()-.5)*.35,rr=R0*(.62+r()*.6);pts.push(new THREE.Vector3(Math.cos(a)*rr,0,Math.sin(a)*rr))}
 const curve=new THREE.CatmullRomCurve3(pts,true,'centripetal'),total=curve.getLength(),M=Math.max(300,Math.round(total/4)),sp=curve.getSpacedPoints(M);sp.pop();
 const X=new Float32Array(M),Z=new Float32Array(M),TX=new Float32Array(M),TZ=new Float32Array(M),K=new Float32Array(M),VC=new Float32Array(M);
 for(let i=0;i<M;i++){X[i]=sp[i].x;Z[i]=sp[i].z}
 for(let i=0;i<M;i++){const a=(i+1)%M,b=(i-1+M)%M;let tx=X[a]-X[b],tz=Z[a]-Z[b];const l=Math.hypot(tx,tz)||1;TX[i]=tx/l;TZ[i]=tz/l}
 const ds=total/M;for(let i=0;i<M;i++){const a=(i+1)%M;let d=Math.atan2(TX[a],TZ[a])-Math.atan2(TX[i],TZ[i]);while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;K[i]=Math.abs(d)/ds}
 for(let i=0;i<M;i++){let k=0;for(let j=0;j<12;j++)k=Math.max(k,K[(i+j)%M]);VC[i]=clamp(Math.sqrt(16/Math.max(k,1e-4)),14,90)}
 let rmax=0;for(let i=0;i<M;i++)rmax=Math.max(rmax,Math.hypot(X[i],Z[i]));
 const W=lanes===3?15:14,grid=new Map(),cell=24;for(let i=0;i<M;i++){const key=Math.floor(X[i]/cell)+','+Math.floor(Z[i]/cell);if(!grid.has(key))grid.set(key,[]);grid.get(key).push(i)}
 const T={M,X,Z,TX,TZ,VC,total,ds,W,rmax,lanes,grid,cell};
 T.at=s=>{s=((s%total)+total)%total;const f=s/ds,i=Math.floor(f)%M,j=(i+1)%M,t=f-Math.floor(f);return{x:X[i]+(X[j]-X[i])*t,z:Z[i]+(Z[j]-Z[i])*t,tx:TX[i]+(TX[j]-TX[i])*t,tz:TZ[i]+(TZ[j]-TZ[i])*t,i}};
 T.near=(x,z,hint)=>{let bi=0,bd=1e18;if(hint!=null){for(let k=-25;k<=25;k++){const i=(hint+k+M)%M,d=(X[i]-x)**2+(Z[i]-z)**2;if(d<bd){bd=d;bi=i}}if(bd<900)return bi}
  for(let i=0;i<M;i+=2){const d=(X[i]-x)**2+(Z[i]-z)**2;if(d<bd){bd=d;bi=i}}return bi};
 T.dist=(x,z)=>{const gx=Math.floor(x/cell),gz=Math.floor(z/cell);let bd=1e9;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=grid.get((gx+a)+','+(gz+b));if(l)for(const i of l)bd=Math.min(bd,(X[i]-x)**2+(Z[i]-z)**2)}return Math.sqrt(bd)};
 return T}
function ribbon(T,o0,o1,y,vScale,mat,yb){const M=T.M,pos=new Float32Array((M+1)*2*3),uv=new Float32Array((M+1)*4),idx=[];let acc=0;
 for(let k=0;k<=M;k++){const i=k%M,lx=T.TZ[i],lz=-T.TX[i];if(k>0)acc+=T.ds;
  pos.set([T.X[i]+lx*o0,(yb??y),T.Z[i]+lz*o0,T.X[i]+lx*o1,y,T.Z[i]+lz*o1],k*6);uv.set([0,acc/vScale,1,acc/vScale],k*4);if(k<M){const a=k*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const m=new THREE.Mesh(g,mat);m.receiveShadow=true;return m}
function wallRibbon(T,off,h,mat){const M=T.M,pos=[],uv=[],idx=[];let acc=0;for(let k=0;k<=M;k++){const i=k%M,lx=T.TZ[i],lz=-T.TX[i],x=T.X[i]+lx*off,z=T.Z[i]+lz*off;if(k>0)acc+=T.ds;pos.push(x,0,z,x,h,z);uv.push(acc/4,0,acc/4,1);if(k<M){const a=k*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;return m}

const Drive=(()=>{
 let R=null,REN=null;const K={};
 const KEYS={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',Space:'hb',ShiftLeft:'nitro',ShiftRight:'nitro',KeyN:'nitro'};
 addEventListener('keydown',e=>{if(!R||R.done)return;if(e.target.matches&&e.target.matches('input,textarea'))return;const k=KEYS[e.code];
  if(k){if(!K[k]&&R.rail&&!R.paused&&(k==='left'||k==='right'))laneMove(k==='left'?1:-1);K[k]=true;e.preventDefault()}
  if(e.code==='KeyC')R.camMode=(R.camMode+1)%2;if(e.code==='KeyR'&&!R.rail&&!R.city)respawn();if(e.code==='KeyM')toggleSnd();if(e.code==='Escape')askExit()});
 addEventListener('keyup',e=>{const k=KEYS[e.code];if(k)K[k]=false});
 addEventListener('resize',()=>{if(!R)return;R.cam.aspect=innerWidth/innerHeight;R.cam.updateProjectionMatrix();R.renderer.setSize(innerWidth,innerHeight);R.onRes();rotHint()});
 function rotHint(){$('#rotate').style.display=TOUCH&&innerHeight>innerWidth&&innerWidth<620&&!sessionStorage.getItem('jrk_rot')?'flex':'none'}
 $('#rotate').onclick=()=>{sessionStorage.setItem('jrk_rot','1');$('#rotate').style.display='none'};
 function toggleSnd(){SFX.on=!SFX.on;ST.set('snd',SFX.on);$('#gSnd').textContent=SFX.on?'🔊':'🔇';if(R&&R.eng&&!SFX.on){R.eng.g.gain.value=0;R.eng.n.gain.value=0}}
 $('#gSnd').onclick=toggleSnd;$('#gCam').onclick=()=>{if(R)R.camMode=(R.camMode+1)%2};$('#gExit').onclick=()=>askExit();
 async function askExit(){if(!R||R.done)return;const wp=R.paused;R.paused=true;const ok=await dlg('Oyundan çık','Oyundan çıkmak istiyor musun? Bu oyundaki ilerlemen kaydedilmez.',{yes:'Çık'});if(!R)return;if(ok)stop(true);else R.paused=wp}

 /* --- ses --- */
 function tone(f0,f1,d,g=.3,w='sine',delay=0){if(!SFX.on||!SFX.ac)return;const ac=SFX.ac,t=ac.currentTime+delay,o=ac.createOscillator(),G=ac.createGain();o.type=w;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);G.gain.setValueAtTime(g,t);G.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(G).connect(SFX.master);o.start(t);o.stop(t+d+.05)}
 const S2={ok(){tone(660,880,.12,.25,'triangle');tone(880,1320,.18,.25,'triangle',.1);tone(1320,1760,.25,.2,'triangle',.22)},bad(){tone(220,110,.35,.3,'square')},q(){tone(990,990,.08,.2,'square');tone(1320,1320,.12,.2,'square',.1)},
  beep(h){tone(h?1200:600,h?1200:600,h?.5:.18,.3,'square')},crash(){sfx('small')},coin(){tone(1200,1800,.1,.2,'triangle');tone(1800,2400,.12,.15,'triangle',.07)},nitro(){sfx('rocket')}};
 function engineStart(){if(!SFX.ac)return null;const ac=SFX.ac,o=ac.createOscillator(),o2=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),s=ac.createBufferSource(),f2=ac.createBiquadFilter(),n=ac.createGain();
  o.type='sawtooth';o2.type='square';o.frequency.value=40;o2.frequency.value=20;f.type='lowpass';f.frequency.value=900;g.gain.value=0;o.connect(f);o2.connect(f);f.connect(g).connect(SFX.master);
  s.buffer=SFX.noise;s.loop=true;f2.type='bandpass';f2.frequency.value=2200;f2.Q.value=1.4;n.gain.value=0;s.connect(f2).connect(n).connect(SFX.master);o.start();o2.start();s.start();
  return{o,o2,f,g,n,stop(){try{o.stop();o2.stop();s.stop()}catch(e){}}}}

 /* --- başlat --- */
 function start(game,opt,cb){if(R)stop(true);sfxInit();SFX.on=ST.get('snd',true);$('#gSnd').textContent=SFX.on?'🔊':'🔇';
  const kid=game.seg==='kid',mode=game.mode==='hikaye'&&!kid?game.sub:game.mode,env=ENVS[game.env]||ENVS[2],q=GFX[opt.gfx]||GFX.mid;
  const rail=kid&&mode!=='acik',city=mode==='acik';
  document.body.classList.add('playing');$('#game').classList.add('on');$('#gEnd').classList.remove('on');['#qcard','#qpop','#story2','#cdown'].forEach(s=>$(s).classList.remove('on'));
  if(!REN||REN.aa!==q.aa){if(REN){REN.r.dispose();REN.r.forceContextLoss()}REN={r:new THREE.WebGLRenderer({antialias:q.aa,powerPreference:'high-performance'}),aa:q.aa}}const renderer=REN.r;renderer.setPixelRatio(Math.min(devicePixelRatio||1,q.px));renderer.setSize(innerWidth,innerHeight);
  renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=env.exp||1;renderer.shadowMap.enabled=!!q.sh;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.needsUpdate=true;renderer.info.reset();
  $('#gcv').appendChild(renderer.domElement);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,3500);
  R={game,opt,cb,kid,mode,env,q,rail,city,renderer,scene,cam,ai:[],gates:[],fxo:[],emitters:[],t:0,last:performance.now(),paused:true,done:false,camMode:0,shake:0,lvl:game.level||1,diff:game.diff||game.level||1,
   correct:0,wrong:0,hearts:3,nitro:1,score:0,combo:1,lap:0,msgT:0,coinsC:0};
  const sunDir=new THREE.Vector3().setFromSphericalCoords(1,Math.PI/2-env.el,env.az);R.sunDir=sunDir;
  scene.add(new THREE.HemisphereLight(LIN(env.top),LIN(env.c[1]),env.hemi*1.7));const sun=new THREE.DirectionalLight(LIN(env.sunC),env.sun);scene.add(sun,sun.target);R.sun=sun;
  if(q.sh){sun.castShadow=true;sun.shadow.mapSize.set(q.sh,q.sh);const c=sun.shadow.camera;c.left=c.bottom=-60;c.right=c.top=60;c.near=10;c.far=500;sun.shadow.bias=-.0004;sun.shadow.normalBias=.03}
  scene.add(R.sky=skyDome(env,sunDir));scene.environment=envCube(env.top,env.sky,env.c[1]);scene.fog=new THREE.Fog(LIN(env.sky),120,city?700:1100);
  R.fire=mkPS(scene,q.pc,true,softTex());R.smoke=mkPS(scene,q.pc,false,puffTex());for(const ps of[R.fire,R.smoke]){ps.mat.uniforms.fogN.value=120;ps.mat.uniforms.fogF.value=1100}
  if(env.night){const pos=[];for(let i=0;i<1400;i++){const v=new THREE.Vector3(rnd(-1,1),rnd(.05,1),rnd(-1,1)).normalize().multiplyScalar(1300);pos.push(v.x,v.y,v.z)}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));R.starsP=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,fog:false}));R.starsP.frustumCulled=false;scene.add(R.starsP)}
  if(city)buildCity();else buildTrackWorld(rail);
  const carType=kid?(opt.car||game.veh||'araba'):(opt.car||game.car||'spor'),ct=CARS[carType]||CARS.spor;
  R.carType=carType;R.cp=kid?{max:city?15:20,acc:8,turn:2.3,grip:11}:{max:ct.max,acc:ct.acc,turn:ct.turn,grip:ct.grip};
  const P=R.P={obj:makeCar(carType,opt.paint||null),x:0,z:0,yaw:0,vx:0,vz:0,vF:0,vL:0,steer:0,ti:0,lap:0,prog:0,s:0,lane:0,lat:0,v:0,boost:0,wrongT:0};scene.add(P.obj);
  if(env.night){const hl=new THREE.SpotLight(0xfff1d0,6,90,.55,.5,1.2);hl.position.set(0,1.1,1.5);hl.target.position.set(0,0,20);P.obj.add(hl,hl.target);R.lamp=hl}
  setupMode();
  const onRes=()=>{const ps=innerHeight*renderer.getPixelRatio()/(2*Math.tan(cam.fov*Math.PI/360));R.fire.mat.uniforms.scale.value=R.smoke.mat.uniforms.scale.value=ps};onRes();R.onRes=onRes;
  touchUI();rotHint();R.eng=kid&&rail?null:engineStart();
  const go=()=>{if(!R)return;countdown(()=>{if(R){R.paused=false;R.started=true}})};
  if(game.intro)story(kid?'🧒':'😎',kid?'Ali':game.rival||'Rakip',game.intro,go);else go();
  R.raf=requestAnimationFrame(loop)}

 function stop(silent){if(!R)return;cancelAnimationFrame(R.raf);if(R.eng)R.eng.stop();
  R.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map&&!Object.values(TEXC).includes(m.map))m.map.dispose();m.dispose()})});
  for(const k in TEXC)TEXC[k].dispose();if(R.scene.environment)R.scene.environment.dispose();R.renderer.renderLists.dispose();R.renderer.domElement.remove();R=null;for(const k in K)K[k]=false;
  $('#game').classList.remove('on');document.body.classList.remove('playing');$$('.touch button').forEach(b=>b.classList.remove('p'));if(silent)backToMenu()}

 /* --- dünya: pist --- */
 function buildTrackWorld(rail){const {scene,env,q,game}=R,T=R.T=makeTrack((game.seed||game.no*7919+game.env*101)|0,rail?.85:1,rail?3:2),W=T.W;
  const rt=roadTex(rail?3:2);rt.repeat.set(1,1);const gn=groundNorm();
  scene.add(ribbon(T,W/2,-W/2,.03,10,new THREE.MeshStandardMaterial({map:rt,roughness:.85,metalness:0,envMapIntensity:.3})));
  const cm=new THREE.MeshStandardMaterial({map:curbTex(),roughness:.7});for(const s of[1,-1])scene.add(ribbon(T,s*(W/2+1.4),s*W/2,.06,3,cm,.04));
  const shoulder=new THREE.MeshStandardMaterial({color:LIN(env.c[1]),roughness:1});for(const s of[1,-1])scene.add(ribbon(T,s*(W/2+7),s*(W/2+1.4),.025,10,shoulder));
  const rail1=MAT('#b9bec4',{metalness:.85,roughness:.35});for(const s of[1,-1]){scene.add(wallRibbon(T,s*(W/2+7.2),.9,rail1))}
  const Rm=T.rmax+60,base=env.sea?-8:0;
  const th=Object.assign({},env,{n:'d'+env.n});const seg=q.seg,tg=new THREE.PlaneGeometry(3200,3200,seg,seg);tg.rotateX(-Math.PI/2);const tp=tg.attributes.position,cols=[];
  for(let i=0;i<tp.count;i++){const x=tp.getX(i),z=tp.getZ(i),r=Math.hypot(x,z),e=sstep(Rm,Rm+260,r);let h=e*(.25+fbm(x/170+7,z/170+3,5)*1.1)*env.mtn;if(env.sea){const side=sstep(-200,200,x+z*.3);h=r<Rm-20?0:h*(1-side)+(-12)*side}tp.setY(i,h-(r>Rm-10&&env.sea?0:0));
   const mac=.84+fbm(x/90,z/90,3)*.32,hk=clamp(h/env.mtn,0,1);let cr=mac,cg=mac,cb=mac;if(hk>.6&&env.snowcap){cr=cg=cb=1.5}cols.push(cr,cg,cb)}
  tg.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));tg.computeVertexNormals();const gt=groundTex(th);gt.repeat.set(220,220);gn.repeat.set(220,220);
  const gr=new THREE.Mesh(tg,new THREE.MeshStandardMaterial({map:gt,normalMap:gn,normalScale:new THREE.Vector2(.7,.7),vertexColors:true,roughness:.97,metalness:0,envMapIntensity:.35}));gr.position.y=-.02;gr.receiveShadow=true;scene.add(gr);
  if(env.sea){const wn=waterNorm();wn.repeat.set(80,80);const w=new THREE.Mesh(new THREE.PlaneGeometry(3200,3200),new THREE.MeshStandardMaterial({color:LIN('#1f6f9a'),normalMap:wn,normalScale:new THREE.Vector2(.5,.5),roughness:.08,metalness:.1,envMapIntensity:1.2,transparent:true,opacity:.92}));w.rotation.x=-Math.PI/2;w.position.y=-1.2;scene.add(w);R.water=wn}
  // start / bitiş
  const p0=T.at(0),ang=Math.atan2(p0.tx,p0.tz);const sl=new THREE.Mesh(new THREE.PlaneGeometry(W,2.2),new THREE.MeshStandardMaterial({map:checkTex(),roughness:.8}));sl.rotation.set(-Math.PI/2,0,ang);sl.position.set(p0.x,.05,p0.z);scene.add(sl);
  const gan=new THREE.Group(),gm=MAT('#30343a',{metalness:.7,roughness:.4});for(const s of[-1,1])gan.add(at(box(.6,7.5,.6,gm),s*(W/2+2),3.75,0));
  const bn=new THREE.Mesh(new THREE.BoxGeometry(W+5,1.8,.4),[gm,gm,gm,gm,new THREE.MeshBasicMaterial({map:bannerTex(rail?'FİNİŞ':'JRK GAMES','#e11d48','#fff')}),new THREE.MeshBasicMaterial({map:bannerTex(rail?'FİNİŞ':'JRK GAMES','#e11d48','#fff')})]);gan.add(at(bn,0,7,0));
  gan.position.set(p0.x,0,p0.z);gan.rotation.y=ang;scene.add(shadowify(gan));
  // tribün
  const crowd=new THREE.MeshStandardMaterial({map:crowdTex(),roughness:.9}),con=MAT('#8a8a86',{roughness:.95});
  for(const s of[1,-1]){const st=new THREE.Group();for(let i=0;i<5;i++){st.add(at(box(36,1,3,con),0,i*1+.5,-i*2.4));const c=at(new THREE.Mesh(new THREE.PlaneGeometry(36,1.1),crowd),0,i+1.4,-i*2.4+1.2);st.add(c)}
   st.add(at(box(38,.4,14,MAT('#2a3a5a')),0,6.8,-5));for(const x of[-18,18])st.add(at(box(.5,6.8,.5,gm),x,3.4,-11));
   const p=T.at(T.total*(s>0?.03:.97));const a2=Math.atan2(p.tx,p.tz);st.rotation.y=a2+(s>0?Math.PI/2:-Math.PI/2);let ok=false;const v=new THREE.Vector3();
   for(let off=18;off<=60&&!ok;off+=6){st.position.set(p.x+p.tz*s*off,0,p.z-p.tx*s*off);st.updateMatrixWorld(true);ok=true;
    for(const x of[-19,-9,0,9,19])for(const z of[2.5,-5,-12.5]){v.set(x,0,z).applyMatrix4(st.matrixWorld);if(T.dist(v.x,v.z)<W/2+8){ok=false;break}}}
   if(ok)scene.add(shadowify(st))}
  // dekor
  const kinds=Object.keys(env.deco),tot=kinds.reduce((a,k)=>a+env.deco[k],0),N=q.dec*2,mt=new THREE.Matrix4(),qq=new THREE.Quaternion(),sc=new THREE.Vector3(),pp=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),buckets={};
  for(let i=0,tries=0;i<N&&tries<N*6;tries++){const x=rnd(-T.rmax-160,T.rmax+160),z=rnd(-T.rmax-160,T.rmax+160),d=T.dist(x,z);if(d<W/2+12)continue;if(Math.hypot(x,z)>Rm+40)continue;
   let rr=Math.random()*tot,k=kinds[0];for(const kk of kinds){rr-=env.deco[kk];if(rr<=0){k=kk;break}}(buckets[k]=buckets[k]||[]).push([x,z]);i++}
  const dm=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,metalness:0});
  for(const k in buckets){const L=buckets[k];if(k==='building'){const ft=facadeTex(),bm=MAT('#ffffff',{map:ft,roughness:.9,metalness:0}),geo=uvBox(new THREE.BoxGeometry(12,1,12),12,24,12,4).translate(0,.5,0);
    const im=new THREE.InstancedMesh(geo,bm,L.length);L.forEach(([x,z],i)=>{qq.setFromAxisAngle(up,Math.random()*6.3);sc.set(rnd(.7,1.4),rnd(10,45),rnd(.7,1.4));pp.set(x,0,z);mt.compose(pp,qq,sc);im.setMatrixAt(i,mt)});im.castShadow=im.receiveShadow=true;scene.add(im);continue}
   const geo=decoGeo(k);if(!geo)continue;const im=new THREE.InstancedMesh(geo,dm,L.length);L.forEach(([x,z],i)=>{qq.setFromAxisAngle(up,Math.random()*6.3);const s=rnd(.75,1.4);sc.set(s,s,s);pp.set(x,0,z);mt.compose(pp,qq,sc);im.setMatrixAt(i,mt)});im.castShadow=true;im.receiveShadow=true;scene.add(im)}
  if(env.night)lamps(T);clouds();
  R.mini=miniPath(T)}
 function uvBox(geo,w,h,d,s){const uv=geo.attributes.uv,dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*dims[f][0]/s,uv.getY(i)*dims[f][1]/s)}return geo}
 function lamps(T){const N=Math.floor(T.M/12),pole=new THREE.InstancedMesh(new THREE.CylinderGeometry(.1,.14,7,6).translate(0,3.5,0),MAT('#555a60',{metalness:.7}),N),head=new THREE.InstancedMesh(new THREE.BoxGeometry(.5,.2,1.4),BASIC('#ffe8b0'),N),mt=new THREE.Matrix4();
  for(let k=0;k<N;k++){const i=k*12,s=k%2?1:-1,lx=T.TZ[i]*s,lz=-T.TX[i]*s,x=T.X[i]+lx*(T.W/2+3),z=T.Z[i]+lz*(T.W/2+3);mt.makeTranslation(x,0,z);pole.setMatrixAt(k,mt);mt.makeTranslation(x-lx*1,7,z-lz*1);head.setMatrixAt(k,mt);
   if(k%3===0)emitGlow(x-lx,6.8,z-lz)}R.scene.add(pole,head)}
 function emitGlow(x,y,z){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex(),color:0xffd890,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.55}));s.scale.set(7,7,1);s.position.set(x,y,z);R.scene.add(s)}
 function clouds(){const cm=new THREE.SpriteMaterial({map:cloudTex(),color:LIN(R.env.cloud),transparent:true,depthWrite:false,fog:true,opacity:.9});for(let i=0;i<34;i++){const cx=rnd(-900,900),cz=rnd(-900,900),cy=rnd(160,240);for(let k=0;k<5;k++){const s=new THREE.Sprite(cm),w=rnd(50,110);s.scale.set(w,w*.5,1);s.position.set(cx+rnd(-50,50),cy+rnd(-8,8),cz+rnd(-40,40));R.scene.add(s)}}}
 function miniPath(T){let mx=0;for(let i=0;i<T.M;i++)mx=Math.max(mx,Math.abs(T.X[i]),Math.abs(T.Z[i]));return{sc:66/mx}}

 /* --- dünya: şehir (açık dünya) --- */
 function buildCity(){const {scene,env,q,game,kid}=R,rg=mulberry((game.no*131+game.env*17)|0),n=kid?6:8,B=60,RW=16,C=B+RW,S=n*C,o=-S/2;
  const city=R.C={n,B,RW,C,S,o,boxes:[],inter:[]};
  const gt=groundTex(Object.assign({},env,{n:'c'+env.n,c:kid?['#5fa04a','#4f8a3c','#78b45a']:env.c}));gt.repeat.set(200,200);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),new THREE.MeshStandardMaterial({map:gt,roughness:1,metalness:0}));g.rotation.x=-Math.PI/2;g.position.y=-.03;g.receiveShadow=true;scene.add(g);
  const rt=roadTex(2),rm=new THREE.MeshStandardMaterial({map:rt,roughness:.85,metalness:0});
  for(let k=0;k<=n;k++){const c=o+k*C;for(const vert of[0,1]){const geo=new THREE.PlaneGeometry(RW,S+RW);const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*(S+RW)/10);const m=new THREE.Mesh(geo,rm);m.rotation.x=-Math.PI/2;if(vert){m.rotation.z=Math.PI/2;m.position.set(0,.02+k*.0002,c)}else m.position.set(c,.025,0);m.receiveShadow=true;scene.add(m)}}
  for(let a=0;a<=n;a++)for(let b=0;b<=n;b++)city.inter.push([o+a*C,o+b*C]);
  const side=MAT('#a9a69e',{map:concTex(),roughness:.95,metalness:0}),ft=facadeTex(),park=new THREE.MeshStandardMaterial({color:LIN('#4f8a3c'),roughness:1}),dm=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9}),treeG=decoGeo(kid?'tree':'tree'),trees=[];
  const kidCols=['#ff8a8a','#ffd36b','#8fd3ff','#b9f28a','#d9a7ff','#ffb27a'];
  for(let a=0;a<n;a++)for(let b=0;b<n;b++){const x0=o+a*C+RW/2,z0=o+b*C+RW/2,cx=x0+B/2,cz=z0+B/2;
   if(rg()<.18){const p=new THREE.Mesh(new THREE.BoxGeometry(B,.2,B),park);p.position.set(cx,.1,cz);p.receiveShadow=true;scene.add(p);for(let i=0;i<6;i++)trees.push([cx+rnd(-B/2+4,B/2-4),cz+rnd(-B/2+4,B/2-4)]);continue}
   const sw=new THREE.Mesh(new THREE.BoxGeometry(B,.3,B),side);sw.position.set(cx,.15,cz);sw.receiveShadow=true;scene.add(sw);city.boxes.push([x0-.5,z0-.5,x0+B+.5,z0+B+.5]);
   const cnt=1+Math.floor(rg()*4),parts=cnt===1?[[0,0,B-8,B-8]]:cnt===2?[[-B/4,0,B/2-6,B-8],[B/4,0,B/2-6,B-8]]:[[-B/4,-B/4,B/2-6,B/2-6],[B/4,-B/4,B/2-6,B/2-6],[-B/4,B/4,B/2-6,B/2-6],[B/4,B/4,B/2-6,B/2-6]].slice(0,cnt);
   for(const[dx,dz,w,d]of parts){const h=kid?rnd(6,16):rnd(10,rg()<.15?90:42),geo=uvBox(new THREE.BoxGeometry(w,h,d),w,h,d,4),m=new THREE.Mesh(geo,MAT(kid?kidCols[Math.floor(rg()*6)]:(rg()<.5?'#ffffff':'#d8d2c8'),{map:ft,roughness:.85,metalness:0}));m.position.set(cx+dx,h/2+.3,cz+dz);m.castShadow=m.receiveShadow=true;scene.add(m);
    if(kid){const roof=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.72,4,4),MAT('#c0392b',{roughness:.8}));roof.rotation.y=Math.PI/4;roof.position.set(cx+dx,h+2.3,cz+dz);roof.castShadow=true;scene.add(roof)}}}
  if(trees.length){const im=new THREE.InstancedMesh(treeG,dm,trees.length),mt=new THREE.Matrix4();trees.forEach(([x,z],i)=>{mt.makeTranslation(x,.2,z);im.setMatrixAt(i,mt)});im.castShadow=true;scene.add(im)}
  const wall=MAT('#7a7f86',{map:concTex(),roughness:.9});for(const[x,z,w,d]of[[0,o-RW,S+RW*3,2],[0,-o+RW,S+RW*3,2],[o-RW,0,2,S+RW*3],[-o+RW,0,2,S+RW*3]]){const m=box(w,3,d,wall);m.position.set(x,1.5,z);m.castShadow=true;scene.add(m)}
  if(env.night){for(const[x,z]of city.inter){const p=box(.2,7,.2,MAT('#555'));p.position.set(x+RW/2+.5,3.5,z+RW/2+.5);scene.add(p);emitGlow(x+RW/2,7,z+RW/2)}}
  clouds();
  // trafik
  const tc=kid?6:14;for(let i=0;i<tc;i++){const axis=i%2,line=Math.floor(rg()*(n+1)),dir=rg()<.5?1:-1,car=makeCar(kid?['araba','otobus','dondurma','traktor'][i%4]:['spor','kas','ralli','gt'][i%4],AICOL[i%AICOL.length]);scene.add(car);
   R.ai.push({obj:car,traffic:1,axis,line:o+line*C+dir*RW/4,dir,u:rnd(o,-o),v:rnd(6,kid?7:13)})}
  R.mini={sc:66/(S/2+RW)}}

 /* --- mod kurulumu --- */
 function setupMode(){const {mode,kid,game,P,T}=R;
  if(R.city){const c=R.C;P.x=c.o;P.z=c.o+c.C*Math.floor(c.n/2);P.yaw=Math.PI/2;
   const picks=[];const rg=mulberry(game.no*977);const cand=c.inter.slice().sort(()=>rg()-.5);
   if(kid){R.goal=8;for(let i=0;i<R.goal;i++){const[x,z]=cand[i+1];picks.push({x,z,obj:starObj(x,z)})}R.starsLeft=picks}
   else{const nR=6+Math.min(8,Math.floor(R.diff*.8));let px=P.x,pz=P.z,tsum=0;for(let i=0;i<nR;i++){const[x,z]=cand[i+1];tsum+=Math.hypot(x-px,z-pz)/(16+R.diff*.6)+3;px=x;pz=z;picks.push({x,z})}
    R.rings=picks;R.ringI=0;R.timeLeft=Math.round(tsum*1.15+12);R.ringObj=ringObj();placeRing()}
   P.obj.position.set(P.x,0,P.z);return}
  const p0=T.at(0);P.yaw=Math.atan2(p0.tx,p0.tz);
  if(R.rail){const back=-6;P.s=back;P.lane=0;P.lat=0;P.v=0;R.baseV=11+R.lvl*.7;
   if(mode==='yol'||mode==='hikaye'){R.qTotal=mode==='hikaye'?6+Math.floor(R.lvl/2):8+R.lvl;R.qDone=0;R.nextQ=45}
   if(mode==='zaman'){R.timeLeft=60+R.lvl*4;R.target=5+Math.floor(R.lvl*.6);R.nextQ=35}
   if(mode==='yaris'){R.laps=1;R.nextQ=50;for(let i=0;i<3;i++)addAI({s:-14-i*9,lane:[1,-1,0][i],vmax:R.baseV*(.93+i*.035+R.lvl*.004)})}
   placeRail();return}
  // yetişkin pist modları
  P.ti=0;P.prog=0;P.lap=0;const grid=(n,fn)=>{for(let i=0;i<n;i++){const row=Math.floor(i/2)+1,lat=(i%2?-1:1)*3.2;fn(-row*9,lat,i)}};
  let px=-4,pl=-3.2;
  if(mode==='yaris'||mode==='eleme'){const n=mode==='yaris'?7:6;R.laps=mode==='yaris'?(R.T.total>2600?2:3):5;px=-(Math.floor(n/2)+1)*9-9;pl=n%2?-3.2:3.2;
   grid(n,(s,lat,i)=>addAI({s,lat,vmax:R.cp.max*(.6+R.diff*.028-(mode==='eleme'?.04:0)+i*(mode==='eleme'?.016:.007))}))}
  if(mode==='zaman'){R.laps=2;R.target=Math.round(R.T.total*2/(22+R.diff*1.7))}
  if(mode==='drift'){R.timeLeft=90;R.target=2500+R.diff*900}
  if(mode==='polis'){R.timeLeft=45+R.diff*6;R.bust=0;for(let i=0;i<Math.min(4,2+Math.floor(R.diff/4));i++)addAI({s:-55-i*14,lat:(i%2?-1:1)*3,vmax:R.cp.max*1.02,police:1})}
  const s0=T.at(px);P.x=s0.x+s0.tz*pl;P.z=s0.z-s0.tx*pl;P.yaw=Math.atan2(s0.tx,s0.tz);P.ti=T.near(P.x,P.z);P.lap=px<0?-1:0;P.prog=px;
  P.obj.position.set(P.x,0,P.z);P.obj.rotation.y=P.yaw}
 function addAI(o){const col=o.police?null:AICOL[(R.ai.length*3+R.game.no)%AICOL.length],type=o.police?'police':R.kid?['araba','yaris','polis','otobus'][R.ai.length%4]:['spor','kas','ralli','gt','super'][R.ai.length%5];
  const obj=makeCar(type,col);R.scene.add(obj);const a=Object.assign({obj,s:0,lat:0,v:0,vmax:30,tlat:o.lat||0,lane:0,elim:false,name:RIVN[R.ai.length%RIVN.length]},o);if(R.kid)a.lat=a.tlat=(o.lane||0)*R.T.W/3;R.ai.push(a);return a}
 const RIVN=['Kara Şimşek','Gölge','Turbo','Asi','Baron','Neon','Tilki','Cobra'];
 function starObj(x,z){const s=new THREE.Shape();for(let i=0;i<10;i++){const r=i%2?1:2.2,a=i/10*Math.PI*2+Math.PI/2;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}
  const g=new THREE.Group(),m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.5,bevelEnabled:true,bevelSize:.15,bevelThickness:.15,bevelSegments:2}),new THREE.MeshStandardMaterial({color:LIN('#ffd23a'),emissive:LIN('#ffb000'),emissiveIntensity:.6,metalness:.6,roughness:.3}));m.geometry.center();g.add(m);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,60,24,1,true),new THREE.MeshBasicMaterial({color:LIN('#ffd23a'),transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=27;g.add(beam);
  g.position.set(x,3,z);R.scene.add(g);g.userData.spin=m;return g}
 function ringObj(){const g=new THREE.Group(),t=new THREE.Mesh(new THREE.TorusGeometry(6,.45,12,48),new THREE.MeshStandardMaterial({color:LIN('#22d3ee'),emissive:LIN('#06b6d4'),emissiveIntensity:1.2,metalness:.5,roughness:.3}));t.position.y=6.5;g.add(t);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(6,6,120,32,1,true),new THREE.MeshBasicMaterial({color:LIN('#22d3ee'),transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=60;g.add(beam);R.scene.add(g);g.userData.t=t;return g}
 function placeRing(){const r=R.rings[R.ringI];if(!r)return;R.ringObj.position.set(r.x,0,r.z);const P=R.P;R.ringObj.userData.t.rotation.y=Math.abs(r.x-P.x)>Math.abs(r.z-P.z)?Math.PI/2:0}

 /* --- soru sistemi (çocuk) --- */
 function makeQ(){const t=R.game.table||2+Math.floor(Math.random()*9),lv=R.lvl,mx=lv<=3?5:10,mn=lv>=8?2:1,b=mn+Math.floor(Math.random()*(mx-mn+1)),c=t*b;
  const cand=[c+t,c-t,c+1,c-1,c+2,c-2,(t+1)*b,(t-1)*b,t*(b+1),t*(b-1),c+10,c-10].filter(v=>v>0&&v!==c);const uniq=[...new Set(cand)].sort(()=>Math.random()-.5).slice(0,2);
  const ans=[c,...uniq].sort(()=>Math.random()-.5);const sw=Math.random()<.5;return{a:sw?t:b,b:sw?b:t,c,ans,ci:ans.indexOf(c)}}
 function spawnGate(s){const q=makeQ(),T=R.T,W=T.W,lw=W/3,g={s,q,objs:[],passed:false};R.curQ=q;$('#qText').textContent=`${q.a} × ${q.b} = ?`;$('#qcard').classList.remove('on');void $('#qcard').offsetWidth;$('#qcard').classList.add('on');S2.q();
  $('#qHint').textContent=R.mode==='zaman'?'Hızlı! Doğru şeride geç!':'Doğru cevabın olduğu şeride geç!';
  const p=T.at(s),ang=Math.atan2(p.tx,p.tz),cols=['#1fa5ff','#22c55e','#a855f7'];
  for(let k=0;k<3;k++){const lane=1-k,lat=lane*lw,x=p.x+p.tz*lat,z=p.z-p.tx*lat,grp=new THREE.Group();
   const pm=MAT('#ffffff',{roughness:.4,metalness:.3});grp.add(at(cyl(.15,.15,5.2,pm,8),-lw/2+.5,2.6,0));grp.add(at(cyl(.15,.15,5.2,pm,8),lw/2-.5,2.6,0));
   const board=new THREE.Mesh(new THREE.PlaneGeometry(lw-.8,(lw-.8)*.62),new THREE.MeshBasicMaterial({map:numTex(q.ans[k],cols[k]),side:THREE.DoubleSide,transparent:true}));board.position.set(0,5.2,0);board.rotation.y=Math.PI;grp.add(board);
   grp.position.set(x,0,z);grp.rotation.y=ang;R.scene.add(grp);g.objs.push(grp)}
  R.gates.push(g)}
 function laneMove(d){const P=R.P;if(R.city)return;P.lane=clamp(P.lane+d,-1,1)}
 function judgeGate(g){const P=R.P,k=1-P.lane,ok=k===g.q.ci;g.passed=true;$('#qcard').classList.remove('on');
  const p=g.objs[k].position;if(ok){R.correct++;S2.ok();P.boost=R.mode==='yaris'?2.6:1.2;burst(p.x,4,p.z,true);banner(['Harika! 🎉','Süper! ⭐','Doğru! 👏','Muhteşem! 🚀'][R.correct%4],'#22c55e');R.coinsC+=10}
  else{R.wrong++;S2.bad();P.boost=-1.4;R.shake=.5;flash('#ff0033');banner('Doğrusu: '+g.q.c,'#ef4444');if(R.mode==='yol'||R.mode==='hikaye')R.hearts--}
  setTimeout(()=>{if(R)g.objs.forEach(o=>R.scene.remove(o))},1500);
  if(R.mode==='yol'||R.mode==='hikaye'){R.qDone++;if(R.hearts<=0){setTimeout(()=>finish(false,'Kalpler bitti'),900);return}}
  if(R.mode==='zaman'&&R.correct>=R.target){setTimeout(()=>finish(true),700);return}
  R.nextQ=P.s+(R.mode==='zaman'?22:R.mode==='yaris'?45:40)}
 function burst(x,y,z,good){const cols=[[1,.3,.3],[1,.85,.2],[.3,.8,1],[.5,1,.4],[1,.5,1]];for(let i=0;i<50;i++){const c=cols[i%5];emit(R.fire,x,y,z,rnd(-8,8),rnd(4,14),rnd(-8,8),rnd(.8,1.6),.6,.3,c,c,1,.4,-14)}}
 function placeRail(){const P=R.P,T=R.T,p=T.at(P.s);P.x=p.x+p.tz*P.lat;P.z=p.z-p.tx*P.lat;P.yaw=Math.atan2(p.tx,p.tz);P.obj.position.set(P.x,0,P.z);P.obj.rotation.y=P.yaw}

 /* --- döngü --- */
 function loop(now){if(!R)return;R.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-R.last)/1000);R.last=now;
  if(!R.paused&&!R.done){R.t+=dt;if(R.rail)updRail(dt);else updCar(dt);updAI(dt);updMode(dt)}
  updFxAll(dt);updCam(dt);hud();R.renderer.render(R.scene,R.cam)}
 function updRail(dt){const P=R.P,T=R.T;const target=R.baseV*(R.mode==='zaman'?1.15:1)+(P.boost>0?7:P.boost<0?-6:0);P.boost=P.boost>0?Math.max(0,P.boost-dt):Math.min(0,P.boost+dt);
  P.v+=(target-P.v)*Math.min(1,dt*1.6);const lw=T.W/3,tl=P.lane*lw,old=P.lat;P.lat+=(tl-P.lat)*Math.min(1,dt*7);
  if(R.mode==='yaris')for(const a of R.ai){const ds=a.s-P.s;if(ds>0&&ds<5.5&&Math.abs(a.lat-P.lat)<2.2)P.v=Math.min(P.v,a.v*.95)}
  P.s+=P.v*dt;const p=T.at(P.s);P.x=p.x+p.tz*P.lat;P.z=p.z-p.tx*P.lat;P.yaw=Math.atan2(p.tx,p.tz)-(P.lat-old)/Math.max(dt,1e-3)*.025;P.vF=P.v;
  P.obj.position.set(P.x,0,P.z);P.obj.rotation.y=P.yaw;spinWheels(P.obj,P.v,dt,(P.lat-old)/Math.max(dt,1e-3)*.04);
  if(R.nextQ!=null&&P.s>=R.nextQ&&!R.gates.some(g=>!g.passed)){const more=R.mode==='zaman'||R.mode==='yaris'||(R.qDone+R.gates.filter(g=>!g.passed).length<R.qTotal);if(more)spawnGate(P.s+(R.mode==='zaman'?50:70));R.nextQ=null}
  for(const g of R.gates)if(!g.passed&&P.s>=g.s)judgeGate(g);
  if((R.mode==='yol'||R.mode==='hikaye')&&R.qDone>=R.qTotal&&!R.finishS){R.finishS=P.s+60;const p2=T.at(R.finishS);const fl=new THREE.Mesh(new THREE.PlaneGeometry(T.W,3),new THREE.MeshStandardMaterial({map:checkTex()}));fl.rotation.set(-Math.PI/2,0,Math.atan2(p2.tx,p2.tz));fl.position.set(p2.x,.06,p2.z);R.scene.add(fl);banner('Bitiş çizgisi! 🏁','#ffb020')}
  if(R.finishS&&P.s>=R.finishS)finish(true)}
 function updCar(dt){const P=R.P,cp=R.cp;let thr=K.up?1:0,brk=K.down?1:0,st=(K.left?1:0)-(K.right?1:0),hb=K.hb,nit=K.nitro&&R.nitro>0&&!R.kid;
  if(R.mode==='polis'&&R.t<.5)thr=1;
  const fx=Math.sin(P.yaw),fz=Math.cos(P.yaw),lx=Math.cos(P.yaw),lz=-Math.sin(P.yaw);let vF=P.vx*fx+P.vz*fz,vL=P.vx*lx+P.vz*lz;
  P.steer+=(st-P.steer)*Math.min(1,dt*(st?5:8));const sp=Math.abs(vF);
  let off=false,d=0;if(R.T){const T=R.T;P.ti=T.near(P.x,P.z,P.ti);const i=P.ti;d=(P.x-T.X[i])*T.TZ[i]-(P.z-T.Z[i])*T.TX[i];off=Math.abs(d)>T.W/2+1.4}
  const maxE=cp.max*(nit?1.22:1)*(off?.55:1);
  if(thr)vF+=cp.acc*(nit?1.7:1)*Math.max(0,1-(vF/maxE)**2)*dt;
  if(brk){if(vF>.5)vF-=26*dt;else vF=Math.max(-11,vF-cp.acc*.55*dt)}
  if(!thr&&!brk)vF-=vF*.35*dt;vF-=vF*(off?.9:.04)*dt;
  if(nit){R.nitro=Math.max(0,R.nitro-dt*.28);if(!R.nitS){R.nitS=1;S2.nitro()}}else{R.nitS=0;R.nitro=Math.min(1,R.nitro+dt*.035)}
  const grip=(hb?1.3:cp.grip)*(off?.55:1);vL-=vL*Math.min(1,grip*dt);if(hb)vF-=vF*.5*dt;
  const yr=P.steer*cp.turn*Math.min(1,sp/6)*(1-.42*Math.min(1,sp/cp.max))*Math.sign(vF||1)*(hb?1.45:1);P.yaw+=yr*dt;
  P.vx=fx*vF+lx*vL;P.vz=fz*vF+lz*vL;P.x+=P.vx*dt;P.z+=P.vz*dt;P.vF=vF;P.vL=vL;
  // pist duvarı
  if(R.T){const T=R.T,i=P.ti,lim=T.W/2+6.4;d=(P.x-T.X[i])*T.TZ[i]-(P.z-T.Z[i])*T.TX[i];if(Math.abs(d)>lim){const sg=Math.sign(d),nx=T.TZ[i]*sg,nz=-T.TX[i]*sg,pen=Math.abs(d)-lim;P.x-=nx*pen;P.z-=nz*pen;
   const vn=P.vx*nx+P.vz*nz;if(vn>0){P.vx-=nx*vn*1.4;P.vz-=nz*vn*1.4;if(vn>4){P.vx*=.86;P.vz*=.86}if(vn>6){hit(P.x+nx*1,P.z+nz*1,vn);R.combo=1}}}
   // tur sayımı
   const ni=P.ti;if(P.lastTi!=null){const dd=ni-P.lastTi;if(dd<-T.M/2){P.lap++;onLap()}else if(dd>T.M/2)P.lap--}P.lastTi=ni;P.prog=P.lap*T.total+ni*T.ds;
   const tdir=P.vx*T.TX[i]+P.vz*T.TZ[i];P.wrongT=tdir<-4?P.wrongT+dt:0}
  if(R.city)cityCollide(P);
  if(off&&sp>8&&Math.random()<.5)emit(R.smoke,P.x-fx*2,.4,P.z-fz*2,rnd(-1,1),rnd(.5,1.5),rnd(-1,1),rnd(1,1.8),1,4,C.dust0,C.dust1,.4,1);
  const drifting=Math.abs(vL)>1.8&&sp>9;R.drifting=drifting;
  if(drifting){for(const s of[-1,1])emit(R.smoke,P.x-fx*1.6+lx*s*.8,.3,P.z-fz*1.6+lz*s*.8,rnd(-.5,.5),rnd(.4,1),rnd(-.5,.5),rnd(1.2,2.2),.8,4.5,C.lsmk0,C.lsmk1,.45,1.2);
   if(R.mode==='drift'){R.combo=Math.min(8,R.combo+dt*.6);R.score+=Math.abs(vL)*sp*dt*2.2*R.combo}R.nitro=Math.min(1,R.nitro+dt*.05)}else if(R.mode==='drift')R.combo=Math.max(1,R.combo-dt*1.5);
  if(nit)for(const s of[-1,1])emit(R.fire,P.x-fx*2.3+lx*s*.4,.45,P.z-fz*2.3+lz*s*.4,-fx*4,0,-fz*4,.18,.9,.3,[.5,.7,1],[.6,.3,1],.9);
  P.obj.position.set(P.x,0,P.z);P.obj.rotation.set(0,P.yaw,0);P.obj.rotation.z=-P.steer*Math.min(1,sp/40)*.04;spinWheels(P.obj,vF,dt,P.steer*.5);
  if(R.eng&&SFX.on){const rpm=(sp%(cp.max/5))/(cp.max/5),gear=Math.floor(sp/(cp.max/5));R.eng.o.frequency.value=38+rpm*55+gear*8+(thr?6:0);R.eng.o2.frequency.value=R.eng.o.frequency.value/2;R.eng.g.gain.value=.05+(thr?.06:.02);R.eng.n.gain.value=drifting?.07:0}}
 function cityCollide(P){const c=R.C,r=2;for(const[x0,z0,x1,z1]of c.boxes){if(P.x>x0-r&&P.x<x1+r&&P.z>z0-r&&P.z<z1+r){const dl=P.x-(x0-r),dr=(x1+r)-P.x,dtp=P.z-(z0-r),db=(z1+r)-P.z,m=Math.min(dl,dr,dtp,db);let nx=0,nz=0;
   if(m===dl){P.x=x0-r;nx=-1}else if(m===dr){P.x=x1+r;nx=1}else if(m===dtp){P.z=z0-r;nz=-1}else{P.z=z1+r;nz=1}const vn=P.vx*nx+P.vz*nz;if(vn<0){P.vx-=nx*vn*1.3;P.vz-=nz*vn*1.3;if(vn<-4){P.vx*=.85;P.vz*=.85}if(vn<-6)hit(P.x-nx,P.z-nz,-vn)}}}
  const lim=-c.o+c.RW/2;P.x=clamp(P.x,-lim,lim);P.z=clamp(P.z,-lim,lim)}
 function hit(x,z,v){R.shake=Math.min(1,v/25);for(let i=0;i<14;i++)emit(R.fire,x,.8,z,rnd(-6,6),rnd(2,7),rnd(-6,6),rnd(.2,.5),.35,.1,C.spark,C.fire1,1,.5,-20);if(v>4)S2.crash()}
 function spinWheels(o,v,dt,steer){const u=o.userData;for(const w of u.wheels)w.rotation.x+=v*dt/(u.wr||.36);for(const f of u.front)f.rotation.y=clamp(steer,-.5,.5);if(u.siren){const on=Math.floor(R.t*6)%2;u.siren[0].visible=!!on;u.siren[1].visible=!on}}
 function respawn(){const P=R.P,T=R.T;if(!T)return;const p=T.at(P.ti*T.ds);P.x=p.x;P.z=p.z;P.yaw=Math.atan2(p.tx,p.tz);P.vx=P.vz=0;banner('Piste dönüldü','#38bdf8')}
 function updAI(dt){const P=R.P;
  for(const a of R.ai){if(a.elim)continue;
   if(a.traffic){const c=R.C;a.u+=a.dir*a.v*dt;const lim=-c.o;if(a.u>lim)a.u=-lim;if(a.u<-lim)a.u=lim;const x=a.axis?a.u:a.line,z=a.axis?a.line:a.u;
    const dx=P.x-x,dz=P.z-z,dd=Math.hypot(dx,dz);if(dd<3.2){const nx=dx/(dd||1),nz=dz/(dd||1);P.x=x+nx*3.2;P.z=z+nz*3.2;const vn=P.vx*nx+P.vz*nz;if(vn<0){P.vx-=nx*vn*1.5;P.vz-=nz*vn*1.5;if(vn<-5)hit(x+nx*1.5,z+nz*1.5,-vn)}}
    a.obj.position.set(x,0,z);a.obj.rotation.y=a.axis?(a.dir>0?Math.PI/2:-Math.PI/2):(a.dir>0?0:Math.PI);spinWheels(a.obj,a.v,dt,0);continue}
   const T=R.T,ahead=T.at(a.s+25),vc=T.VC[ahead.i]*(R.kid?1:a.police?1.02:.84+R.diff*.016);let tv=Math.min(a.vmax,R.kid?a.vmax:vc);
   if(!R.kid&&!a.police){const gap=a.s-P.prog;if(gap>140)tv*=.93;if(gap<-160)tv*=1.06}
   if(a.police){const gap=P.prog-a.s;tv=Math.min(vc*1.05,(R.P.vF||0)+clamp(gap*.25,-4,14));if(gap<-30)tv*=.7;a.tlat=clamp(P.lastD??0,-5,5)}
   if(R.kid&&a.boostT>0){a.boostT-=dt}
   a.v+=clamp(tv-a.v,-18*dt,(R.kid?6:9)*dt);
   if(!R.kid&&!a.police){for(const b of R.ai)if(b!==a&&!b.elim&&!b.traffic){const ds=b.s-a.s;if(ds>0&&ds<12&&Math.abs(b.lat-a.lat)<2.6){a.tlat=b.lat>0?-3.5:3.5;if(ds<6)a.v=Math.min(a.v,b.v)}}const pd=P.prog-a.s;if(pd>0&&pd<12&&Math.abs((P.lastD||0)-a.lat)<2.6)a.tlat=(P.lastD||0)>0?-3.5:3.5}
   a.s+=a.v*dt;const old=a.lat;a.lat+=(a.tlat-a.lat)*Math.min(1,dt*1.5);const p=T.at(a.s);a.x=p.x+p.tz*a.lat;a.z=p.z-p.tx*a.lat;
   a.obj.position.set(a.x,0,a.z);a.obj.rotation.y=Math.atan2(p.tx,p.tz)-(a.lat-old)/Math.max(dt,1e-3)*.03;spinWheels(a.obj,a.v,dt,0);
   if(!R.rail){const dx=P.x-a.x,dz=P.z-a.z,dd=Math.hypot(dx,dz);if(dd<2.6){const nx=dx/(dd||1),nz=dz/(dd||1),pen=2.6-dd;P.x+=nx*pen*.7;P.z+=nz*pen*.7;a.lat-=(nx*p.tz-nz*p.tx)*pen*.3;
     const vn=P.vx*nx+P.vz*nz;if(vn<0){P.vx-=nx*vn*.9;P.vz-=nz*vn*.9;a.v=Math.min(a.vmax*1.05,a.v-vn*.35);if(vn<-6)hit(a.x+nx*1.3,a.z+nz*1.3,-vn*.6)}}}}
  if(R.T&&!R.rail){const T=R.T,i=P.ti;P.lastD=(P.x-T.X[i])*T.TZ[i]-(P.z-T.Z[i])*T.TX[i]}}
 function rank(){const P=R.P,me=R.rail?P.s:P.prog;return 1+R.ai.filter(a=>!a.elim&&!a.traffic&&!a.police&&(a.fin?true:a.s>me)).length}
 function onLap(){const P=R.P;if(P.lap<=0)return;if(R.mode==='eleme'&&!R.done&&P.lap>=2){const alive=R.ai.filter(a=>!a.elim);const last=alive.reduce((m,a)=>!m||a.s<m.s?a:m,null);
   if(last&&last.s>P.prog){finish(false,'Sonuncu kaldın, elendin!');return}if(last){last.elim=true;R.scene.remove(last.obj);banner(last.name+' elendi!','#f59e0b')}}
  if(R.laps&&P.lap>=R.laps)finish(R.mode==='zaman'?R.t<=R.target:R.mode==='eleme'?rank()===1:rank()<=3);else if(R.laps)banner('Tur '+(P.lap+1)+'/'+R.laps,'#fff')}
 function updMode(dt){const P=R.P;
  if(R.timeLeft!=null){R.timeLeft-=dt;if(R.timeLeft<=0){R.timeLeft=0;
   if(R.mode==='zaman'&&R.rail)finish(R.correct>=R.target);else if(R.mode==='drift')finish(R.score>=R.target);else if(R.mode==='polis')finish(true);else if(R.city&&!R.kid)finish(false,'Süre doldu');}}
  if(R.rail&&R.mode==='yaris'&&P.s>=R.T.total*R.laps)finish(rank()<=3);
  if(R.rail&&R.mode==='yaris')for(const a of R.ai)if(!a.fin&&a.s>=R.T.total*R.laps)a.fin=1;
  if(!R.rail&&!R.city)for(const a of R.ai)if(!a.fin&&R.laps&&a.s>=R.T.total*R.laps)a.fin=1;
  if(R.mode==='polis'){let near=false;for(const a of R.ai){if(Math.hypot(a.x-P.x,a.z-P.z)<7){near=true;break}}R.bust=clamp(R.bust+(near?(Math.abs(P.vF)<14?.55:.18):-.15)*dt,0,1);if(R.bust>=1)finish(false,'Yakalandın! 🚓')}
  if(P.wrongT>1.5){R.msg='⚠️ Yanlış yön!';R.msgT=.2}
  if(!R.rail){R.stuckT=(K.up&&Math.abs(P.vF||0)<1.2)?(R.stuckT||0)+dt:0;if(R.stuckT>2){R.msg=TOUCH?'Sıkıştın! ⏬ ile geri git':'Sıkıştın! S ile geri git'+(R.T?' ya da R ile piste dön':'');R.msgT=.2}}
  if(R.city&&R.kid&&!R.qOpen){for(const st of R.starsLeft){if(Math.hypot(st.x-P.x,st.z-P.z)<5.5){openStarQ(st);break}}}
  if(R.city&&!R.kid){const r=R.rings[R.ringI];if(r&&Math.hypot(r.x-P.x,r.z-P.z)<7){R.ringI++;S2.coin();R.coinsC+=25;burst(r.x,6,r.z);const nx=R.rings[R.ringI];if(nx){R.timeLeft+=4;placeRing();banner('Kontrol noktası '+R.ringI+'/'+R.rings.length,'#22d3ee')}else{R.scene.remove(R.ringObj);finish(true)}}}}
 function openStarQ(st){R.qOpen=true;R.paused=true;const q=makeQ();$('#qpText').textContent=`${q.a} × ${q.b} = ?`;S2.q();const cols=['#1fa5ff','#22c55e','#a855f7'];
  $('#qpAns').innerHTML=q.ans.map((v,i)=>`<button style="background:${cols[i]}" data-a="${i}">${v}</button>`).join('');$('#qpop').classList.add('on');
  $('#qpAns').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const ok=+b.dataset.a===q.ci;$('#qpop').classList.remove('on');R.qOpen=false;R.paused=false;
   if(ok){R.correct++;S2.ok();burst(st.x,3,st.z,true);R.scene.remove(st.obj);R.starsLeft=R.starsLeft.filter(s=>s!==st);R.coinsC+=15;banner('Yıldız toplandı! ⭐ '+(R.goal-R.starsLeft.length)+'/'+R.goal,'#ffb020');if(!R.starsLeft.length)setTimeout(()=>finish(true),600)}
   else{R.wrong++;S2.bad();banner('Doğrusu: '+q.c+'. Tekrar dene!','#ef4444');const P=R.P;P.vx*=-.3;P.vz*=-.3;P.x+=(P.x-st.x)*.6;P.z+=(P.z-st.z)*.6}}}
 function updFxAll(dt){updPS(R.fire,dt);updPS(R.smoke,dt);if(R.water){R.water.offset.x+=dt*.01;R.water.offset.y+=dt*.006}
  if(R.starsLeft)for(const s of R.starsLeft){s.obj.userData.spin.rotation.y+=dt*2;s.obj.position.y=3+Math.sin(R.t*3+s.x)*.5}
  if(R.ringObj)R.ringObj.userData.t.rotation.z+=dt*.8;
  if(R.env.weather==='snow'){const c=R.cam.position;for(let i=0;i<(R.q.pc>1000?5:2);i++)emit(R.smoke,c.x+rnd(-40,40),c.y+rnd(8,22),c.z+rnd(-40,40),rnd(-1,1)+1,-rnd(2,3.5),rnd(-1,1),6,.25,.25,C.snow,C.snow,.9)}
  if(R.msgT>0)R.msgT-=dt}
 function updCam(dt){const P=R.P,cam=R.cam,fx=Math.sin(P.yaw),fz=Math.cos(P.yaw),sp=Math.abs(P.vF||0);R.shake=Math.max(0,R.shake-dt*2);const sh=R.shake*R.shake;
  if(R.camMode===1){cam.position.set(P.x+fx*.9,1.25,P.z+fz*.9);cam.lookAt(P.x+fx*20,1.1,P.z+fz*20)}
  else{const big=R.carType==='otobus'||R.carType==='itfaiye'?1.4:1,D=(R.kid?8.5:6.6+sp*.035)*big,H=(R.kid?3.6:2.3+sp*.012)*big,k=R.ci?1-Math.exp(-dt*(R.kid?5:7)):1;R.ci=1;
   const tx=P.x-fx*D,tz=P.z-fz*D;cam.position.x+=(tx-cam.position.x)*k;cam.position.z+=(tz-cam.position.z)*k;cam.position.y+=(H-cam.position.y)*k;cam.lookAt(P.x+fx*6,1.2,P.z+fz*6)}
  if(sh){cam.position.x+=rnd(-1,1)*sh*.6;cam.position.y+=rnd(-1,1)*sh*.4}
  const fov=(R.kid?64:60)+Math.min(16,sp*.22)+(K.nitro&&R.nitro>0&&!R.kid?6:0);if(Math.abs(cam.fov-fov)>.1){cam.fov+=(fov-cam.fov)*Math.min(1,dt*3);cam.updateProjectionMatrix();R.onRes()}
  R.sky.position.copy(cam.position);if(R.starsP)R.starsP.position.copy(cam.position);const sd=R.sunDir;R.sun.position.set(P.x+sd.x*200,sd.y*200,P.z+sd.z*200);R.sun.target.position.set(P.x,0,P.z)}

 /* --- HUD --- */
 const tm=s=>{s=Math.max(0,s);return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')+(s<60?'.'+Math.floor(s*10%10):'')};
 function hud(){if(!R)return;const P=R.P,m=R.mode;let tl='',top=R.msgT>0?R.msg:'';
  if(R.kid){const st=`⭐ ${R.correct}`;if(R.rail){if(m==='yol'||m==='hikaye')tl=`<div id="hearts">${'❤️'.repeat(Math.max(0,R.hearts))}${'🤍'.repeat(3-Math.max(0,R.hearts))}</div><div class="ln">${st} • Soru ${Math.min(R.qDone+1,R.qTotal)}/${R.qTotal}</div>`;
    if(m==='zaman')tl=`<div class="big">${tm(R.timeLeft)}</div><div class="ln">✅ ${R.correct}/${R.target} doğru</div>`;if(m==='yaris')tl=`<div class="big">${rank()}<small>/${R.ai.length+1}</small></div><div class="ln">${st} • %${Math.min(100,Math.floor(Math.max(0,P.s)/(R.T.total*R.laps)*100))}</div>`}
   else tl=`<div class="big">⭐ ${R.goal-R.starsLeft.length}<small>/${R.goal}</small></div><div class="ln">Yıldızları bul ve soruları çöz!</div>`}
  else if(R.city)tl=`<div class="big">${tm(R.timeLeft)}</div><div class="ln">🎯 Kontrol noktası ${R.ringI}/${R.rings.length}</div>`;
  else{if(m==='yaris'||m==='eleme')tl=`<div class="big">${rank()}<small>/${R.ai.filter(a=>!a.elim).length+1}</small></div><div class="ln">Tur ${clamp(P.lap+1,1,R.laps)}/${R.laps} • ${tm(R.t)}</div>${m==='eleme'?'<div class="ln">'+(P.lap<1?'1. tur ısınma, sonra her tur sonuncu elenir':'Turun sonunda sonuncu elenir')+'</div>':''}`;
   if(m==='zaman')tl=`<div class="big">${tm(R.t)}</div><div class="ln">Hedef ${tm(R.target)} • Tur ${clamp(P.lap+1,1,R.laps)}/${R.laps}</div>`;
   if(m==='drift')tl=`<div class="big">${fmt(R.score)}</div><div class="ln">Hedef ${fmt(R.target)} • x${R.combo.toFixed(1)} • ${tm(R.timeLeft)}</div>${R.drifting?'<div class="ln" style="color:#f59e0b">DRIFT! 💨</div>':''}`;
   if(m==='polis')tl=`<div class="big">${tm(R.timeLeft)}</div><div class="ln">Kaç! Yakalanma: <span style="display:inline-block;width:90px;height:9px;background:#0008;border-radius:5px;vertical-align:middle;overflow:hidden"><i style="display:block;height:100%;width:${R.bust*100}%;background:${R.bust>.6?'#ef4444':'#f59e0b'}"></i></span></div>`}
  if(tl!==R.hTL){R.hTL=tl;$('#hTL').innerHTML=tl}if(top!==R.hTop){R.hTop=top;$('#hTop').textContent=top}
  const nb=$('#nitroBar');nb.style.display=R.kid?'none':'';nb.firstChild.style.width=(R.nitro*100)+'%';
  const ar=$('#arrow3');if(R.city&&!R.kid&&R.rings[R.ringI]){const r=R.rings[R.ringI],a=Math.atan2(r.x-P.x,r.z-P.z)-P.yaw;ar.hidden=false;ar.style.rotate=(-a*180/Math.PI)+'deg'}else ar.hidden=true;
  speedo();minimap()}
 function speedo(){const c=$('#speedo'),x=c.getContext('2d'),kmh=Math.abs(R.P.vF||0)*3.6,mx=R.kid?100:300;x.clearRect(0,0,170,170);
  x.lineWidth=11;x.lineCap='round';x.strokeStyle='#0009';x.beginPath();x.arc(85,85,68,Math.PI*.75,Math.PI*2.25);x.stroke();
  const f=Math.min(1,kmh/mx),gr=x.createLinearGradient(0,170,170,0);gr.addColorStop(0,'#22c55e');gr.addColorStop(.6,'#f59e0b');gr.addColorStop(1,'#ef4444');x.strokeStyle=gr;x.beginPath();x.arc(85,85,68,Math.PI*.75,Math.PI*(.75+1.5*f));x.stroke();
  x.fillStyle='#fff';x.textAlign='center';x.font='bold 44px Rajdhani,Arial';x.fillText(Math.round(kmh),85,94);x.font='bold 15px Rajdhani,Arial';x.fillStyle='#cbd5e1';x.fillText('km/s',85,116)}
 function minimap(){const c=$('#minimap'),x=c.getContext('2d'),P=R.P,m=R.mini;x.clearRect(0,0,150,150);if(!m)return;const s=m.sc,tx=v=>75+v*s;x.save();
  if(R.T){const T=R.T;x.strokeStyle='#ffffffaa';x.lineWidth=4;x.beginPath();for(let i=0;i<=T.M;i+=3){const k=i%T.M;i?x.lineTo(tx(T.X[k]),tx(T.Z[k])):x.moveTo(tx(T.X[k]),tx(T.Z[k]))}x.closePath();x.stroke()}
  else{const c2=R.C;x.strokeStyle='#ffffff55';x.lineWidth=2;for(let k=0;k<=c2.n;k++){const v=c2.o+k*c2.C;x.beginPath();x.moveTo(tx(v),tx(c2.o));x.lineTo(tx(v),tx(-c2.o));x.stroke();x.beginPath();x.moveTo(tx(c2.o),tx(v));x.lineTo(tx(-c2.o),tx(v));x.stroke()}
   if(R.starsLeft)for(const st of R.starsLeft){x.fillStyle='#ffd23a';x.beginPath();x.arc(tx(st.x),tx(st.z),4.5,0,7);x.fill()}if(R.rings&&R.rings[R.ringI]){const r=R.rings[R.ringI];x.fillStyle='#22d3ee';x.beginPath();x.arc(tx(r.x),tx(r.z),5,0,7);x.fill()}}
  for(const a of R.ai){if(a.elim)continue;const ax=a.traffic?a.obj.position.x:a.x,az=a.traffic?a.obj.position.z:a.z;if(ax==null)continue;x.fillStyle=a.police?'#3b82f6':a.traffic?'#94a3b8':'#ef4444';x.beginPath();x.arc(tx(ax),tx(az),3.2,0,7);x.fill()}
  x.translate(tx(P.x),tx(P.z));x.rotate(-P.yaw+Math.PI);x.fillStyle='#22c55e';x.beginPath();x.moveTo(0,-6);x.lineTo(4.5,5);x.lineTo(-4.5,5);x.fill();x.restore()}
 function banner(t,col){const b=$('#banner');b.textContent=t;b.style.color=col||'#fff';b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
 function flash(col){const f=$('#flash');f.style.background=col;f.style.opacity=.35;setTimeout(()=>f.style.opacity=0,150)}
 function countdown(cb){if(R.kid&&R.rail&&R.mode!=='yaris'){banner('Hazır mısın? 🚗','#ffb020');setTimeout(cb,1200);return}const el=$('#cdown');let n=3;el.classList.add('on');
  const tick=()=>{if(!R){el.classList.remove('on');return}if(n>0){el.textContent=n;el.style.color='#fff';S2.beep(0);n--;setTimeout(tick,800)}else{el.textContent='BAŞLA!';el.style.color='#22c55e';S2.beep(1);setTimeout(()=>el.classList.remove('on'),600);cb()}};tick()}
 function story(face,who,txt,cb){const el=$('#story2');$('#sFace').textContent=face;$('#sWho').textContent=who;const p=$('#sTx');p.textContent='';el.classList.add('on');let i=0;const iv=setInterval(()=>{i+=2;p.textContent=txt.slice(0,i);if(i>=txt.length)clearInterval(iv)},24);
  $('#sGo').onclick=()=>{clearInterval(iv);el.classList.remove('on');cb()}}
 function touchUI(){const kid=R.kid,rail=R.rail,L=$('#tL'),Rr=$('#tR');
  L.innerHTML=`<button data-k="left" aria-label="Sol">◀</button><button data-k="right" aria-label="Sağ">▶</button>`;
  Rr.innerHTML=rail?'':kid?`<button class="brk" data-k="down" aria-label="Fren">⏬</button><button class="gas" data-k="up" aria-label="Gaz">⏫</button>`:`<div style="display:flex;flex-direction:column;gap:10px"><button class="sm" data-k="nitro" aria-label="Nitro">🔥</button><button class="sm" data-k="hb" aria-label="El freni">🅿️</button></div><button class="brk" data-k="down" aria-label="Fren">⏬</button><button class="gas" data-k="up" aria-label="Gaz">⏫</button>`;
  $$('.touch [data-k]').forEach(b=>{const k=b.dataset.k,on=e=>{e.preventDefault();sfxInit();if(R&&R.rail&&!R.paused&&(k==='left'||k==='right'))laneMove(k==='left'?1:-1);K[k]=true;b.classList.add('p')},off=e=>{e.preventDefault();K[k]=false;b.classList.remove('p')};
   b.addEventListener('touchstart',on,{passive:false});b.addEventListener('touchend',off);b.addEventListener('touchcancel',off);b.addEventListener('mousedown',on);b.addEventListener('mouseup',off);b.addEventListener('mouseleave',off)});
  const cv=R.renderer.domElement;let sx=null;cv.addEventListener('touchstart',e=>{sfxInit();sx=e.touches[0].clientX},{passive:true});cv.addEventListener('touchend',e=>{if(sx==null||!R||!R.rail)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)laneMove(dx<0?1:-1);sx=null},{passive:true})}

 /* --- bitiş --- */
 function finish(win,why){if(!R||R.done)return;R.done=true;$('#qcard').classList.remove('on');if(R.eng){R.eng.g.gain.value=0;R.eng.n.gain.value=0}
  const g=R.game,m=R.mode,kid=R.kid;let stars=0,coins=0,lines=[];
  if(kid){const tot=R.correct+R.wrong;stars=win?(R.wrong===0?3:R.wrong<=2?2:1):0;coins=R.correct*10+(win?50+stars*20:0);lines.push(`✅ Doğru: <b>${R.correct}</b> • ❌ Yanlış: <b>${R.wrong}</b>`);if(tot)lines.push(`Başarı: <b>%${Math.round(R.correct/tot*100)}</b>`);if(m==='yaris')lines.push(`Sıralama: <b>${rank()}.</b>`)}
  else if(R.city){stars=win?(R.timeLeft>15?3:R.timeLeft>6?2:1):0;coins=R.ringI*25+(win?150:0);lines.push(`Kontrol noktası: <b>${R.ringI}/${R.rings.length}</b>`)}
  else if(m==='yaris'||m==='eleme'){const r=rank();stars=win?(r===1?3:r===2?2:1):0;coins=win?[0,300,200,120][r]||60:40;coins+=R.diff*20;lines.push(`Sıralama: <b>${r}.</b> • Süre: <b>${tm(R.t)}</b>`)}
  else if(m==='zaman'){stars=win?(R.t<=R.target*.9?3:R.t<=R.target*.96?2:1):0;coins=win?250+R.diff*20:40;lines.push(`Süren: <b>${tm(R.t)}</b> • Hedef: <b>${tm(R.target)}</b>`)}
  else if(m==='drift'){stars=win?(R.score>=R.target*1.5?3:R.score>=R.target*1.2?2:1):0;coins=Math.round(R.score/60)+(win?150:0);lines.push(`Drift puanı: <b>${fmt(R.score)}</b> • Hedef: <b>${fmt(R.target)}</b>`)}
  else if(m==='polis'){stars=win?(R.bust<.2?3:R.bust<.5?2:1):0;coins=Math.round(R.t*4)+(win?200:0);lines.push(`Kaçış süresi: <b>${tm(R.t)}</b>`)}
  const res=R.cb({win,stars,coins});const after=()=>{if(!R)return;$('#eT').textContent=win?(kid?'Harika! 🎉':'Kazandın! 🏆'):'Tekrar dene 💪';$('#eS').innerHTML=win?'⭐'.repeat(stars)+'<span style="opacity:.25">'+'⭐'.repeat(3-stars)+'</span>':'';
   $('#eR').innerHTML=(why?`<b>${why}</b><br>`:'')+lines.join('<br>')+`<br>Kazanılan: <b>🪙 ${fmt(res.earned)}</b>`;const nx=res.next;$('#eNext').hidden=!nx;$('#eNext').onclick=()=>{stop();playGame(nx)};
   $('#eRetry').onclick=()=>{const gg=R.game,o=R.opt,cb=R.cb;stop();Drive.start(gg,o,cb)};$('#eMenu').onclick=()=>stop(true);$('#gEnd').classList.add('on');if(win){S2.ok();burst(R.P.x,3,R.P.z)}else S2.bad()};
  if(win&&g.outro)setTimeout(()=>{if(R)story(kid?'🧒':'😎',kid?'Ali':g.rival||'Rakip',g.outro,after)},700);else setTimeout(after,700)}
 function step(dt){if(!R)return;if(!R.paused&&!R.done){R.t+=dt;if(R.rail)updRail(dt);else updCar(dt);updAI(dt);updMode(dt)}updFxAll(dt);updCam(dt);hud()}
 return{start,stop,get running(){return !!R},_K:K,get _R(){return R},_step:step,_render(){if(R)R.renderer.render(R.scene,R.cam)},_lane:d=>laneMove(d)};
})();
