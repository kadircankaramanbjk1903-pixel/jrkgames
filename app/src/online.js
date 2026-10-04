/* ===== Online lobi: oda, sohbet, sesli sohbet (PeerJS, eşler arası) ===== */
const ROOM={peer:null,role:null,code:null,conns:{},host:null,players:{},myId:null,name:'',calls:{},audios:{},stream:null,muted:false,cur:null,chat:[],unread:0,min:false,tries:0};
const rCode=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=a[Math.floor(Math.random()*a.length)];return s};
const rbc=(m,ex)=>{for(const id in ROOM.conns){const c=ROOM.conns[id];if(id!==ex&&c.open)try{c.send(m)}catch(e){}}};
const rsend=m=>{if(ROOM.host&&ROOM.host.open)try{ROOM.host.send(m)}catch(e){}};
const rlist=()=>Object.keys(ROOM.players).map(id=>({id,name:ROOM.players[id].name}));
function rErr(t){const e=$('#onErr');if(e)e.textContent=t;if(t&&!e)toast(t)}
function rPlayers(){rbc({t:'players',list:rlist()});onlineUI();voiceMesh()}
function rSys(t){rbc({t:'sys',text:t});chatAdd(null,t,true)}
function roomCreate(){if(typeof Peer==='undefined'){rErr('Online modül yüklenemedi. İnternet bağlantını kontrol et.');return}roomLeave(true);ROOM.name=($('#onNick')&&$('#onNick').value.trim())||ME.name;
 const code=rCode(),peer=new Peer('jrk-'+code,{debug:0});ROOM.peer=peer;rErr('Oda kuruluyor…');
 peer.on('open',id=>{if(ROOM.peer!==peer)return;Object.assign(ROOM,{role:'host',code,myId:id,players:{[id]:{name:ROOM.name}}});rErr('');chatAdd(null,'Oda kuruldu. Kodu arkadaşlarına gönder: '+code,true);onlineUI();toast('Oda kuruldu: '+code)});
 peer.on('connection',c=>{c.on('data',d=>hostIn(c,d));c.on('close',()=>rDrop(c.peer));c.on('error',()=>rDrop(c.peer))});
 peer.on('call',voiceAnswer);
 peer.on('error',e=>{if(ROOM.peer!==peer)return;if(e.type==='unavailable-id'){peer.destroy();ROOM.peer=null;roomCreate();return}if(e.type==='peer-unavailable')return;rNetErr(e)});
 peer.on('disconnected',()=>{if(ROOM.peer===peer&&!peer.destroyed)try{peer.reconnect()}catch(e){}})}
function roomJoin(){const code=($('#onCode').value||'').trim().toUpperCase();if(code.length!==5){rErr('Oda kodu 5 karakter olmalı.');return}if(typeof Peer==='undefined'){rErr('Online modül yüklenemedi.');return}
 roomLeave(true);ROOM.name=$('#onNick').value.trim()||ME.name;const peer=new Peer({debug:0});ROOM.peer=peer;rErr('Bağlanıyor…');
 peer.on('open',id=>{if(ROOM.peer!==peer)return;ROOM.myId=id;const c=peer.connect('jrk-'+code,{reliable:true});ROOM.host=c;
  c.on('open',()=>{ROOM.role='client';ROOM.code=code;rErr('');c.send({t:'hello',name:ROOM.name});onlineUI();toast(code+' odasına katıldın')});
  c.on('data',clientIn);c.on('close',()=>{if(ROOM.host===c&&ROOM.role){toast('Oda kapandı');roomLeave(true)}})});
 peer.on('call',voiceAnswer);
 peer.on('error',e=>{if(ROOM.peer!==peer)return;if(e.type==='peer-unavailable'){roomLeave(true);rErr('Bu kodla açık bir oda bulunamadı. Kodu kontrol et.');return}rNetErr(e)});
 setTimeout(()=>{if(ROOM.peer===peer&&!ROOM.role){roomLeave(true);rErr('Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.')}},15000)}
function rNetErr(e){rErr('Bağlantı hatası: '+(e.type||e.message||'bilinmiyor'));if(!ROOM.role)roomLeave(true)}
function roomLeave(silent){const was=ROOM.role;voiceOff(true);for(const id in ROOM.audios)ROOM.audios[id].remove();const p=ROOM.peer;
 Object.assign(ROOM,{peer:null,role:null,code:null,conns:{},host:null,players:{},myId:null,calls:{},audios:{},cur:null,chat:[],unread:0});try{p&&p.destroy()}catch(e){}onlineUI();if(!silent&&was)toast('Odadan çıktın')}
function rDrop(id){if(!ROOM.players[id])return;const n=ROOM.players[id].name;delete ROOM.players[id];delete ROOM.conns[id];voiceClose(id);rPlayers();rSys(n+' odadan ayrıldı')}
function hostIn(c,d){const id=c.peer;if(!d||typeof d!=='object')return;
 if(d.t==='hello'){ROOM.conns[id]=c;ROOM.players[id]={name:String(d.name||'Oyuncu').slice(0,20)};rPlayers();rSys(ROOM.players[id].name+' odaya katıldı');if(ROOM.cur)c.send(ROOM.cur)}
 if(d.t==='gift'&&ROOM.players[id]){giftRoute({to:d.to,n:d.n,from:'👑 '+ROOM.players[id].name})}
 if(d.t==='chat'&&ROOM.players[id]){const m={t:'chat',name:ROOM.players[id].name,text:String(d.text||'').slice(0,300)};if(!m.text)return;rbc(m);chatAdd(m.name,m.text)}}
function clientIn(d){if(!d||typeof d!=='object')return;
 if(d.t==='players'){ROOM.players={};d.list.forEach(p=>ROOM.players[p.id]={name:p.name});onlineUI();voiceMesh()}
 if(d.t==='gift'&&d.to===ROOM.myId)giftGet(d.n,d.from);
 if(d.t==='chat')chatAdd(d.name,d.text);if(d.t==='sys')chatAdd(null,d.text,true);
 if(d.t==='play'){const g=GBY[d.gid];if(!g)return;if(Drive.running)Drive.stop();closeWarQuiet();toast('🎮 Oda kurucusu oyunu başlattı: '+g.name);launchWar(g.war,g,{role:'client',code:d.gcode,name:ROOM.name})}
 if(d.t==='endplay'){ROOM.cur=null;if($('#warWrap').classList.contains('on')){closeWar();toast('Oda kurucusu menüye döndü')}}}
function roomPlay(g){const gcode=rCode();ROOM.cur={t:'play',gid:g.id,gcode};rbc(ROOM.cur);rSys('Oyun başladı: '+g.name);launchWar(g.war,g,{role:'host',code:gcode,name:ROOM.name})}
/* --- odada altın gönderme (yönetici / yardımcı) --- */
function giftGet(n,from){n=Math.floor(+n||0);if(n<=0||n>1e7)return;addCoins(n);toast('🎁 '+from+' sana '+fmt(n)+' altın gönderdi!');chatAdd(null,'🎁 '+from+' sana '+fmt(n)+' altın gönderdi',true);if(VIEW==='online')onlineUI()}
function giftRoute(m){if(m.to===ROOM.myId){giftGet(m.n,m.from);return}const c=ROOM.conns[m.to];if(c&&c.open)c.send({t:'gift',to:m.to,n:m.n,from:m.from})}
async function roomGift(id){if(!isStaff())return;const p=ROOM.players[id];if(!p)return;const cap=isAdm()?1e7:HELPER_MAX;
 const v=await dlg('Altın gönder',p.name+' oyuncusuna kaç altın gönderilsin?'+(isAdm()?'':' (en fazla '+fmt(HELPER_MAX)+')'),{input:'1000',type:'number',yes:'Gönder'});if(v===null)return;const n=Math.floor(+v||0);if(n<=0||n>cap){toast('Geçerli bir miktar gir');return}
 const m={to:id,n,from:(isAdm()?'👑 ':'🛡️ ')+ROOM.name};if(ROOM.role==='host')giftRoute(m);else rsend({t:'gift',to:id,n});toast(fmt(n)+' altın '+p.name+' oyuncusuna gönderildi');chatAdd(null,'💰 '+p.name+' oyuncusuna '+fmt(n)+' altın gönderdin',true)}
/* --- yazılı sohbet --- */
function chatAdd(name,text,sys){ROOM.chat.push({name,text,sys});if(ROOM.chat.length>80)ROOM.chat.shift();if(ROOM.min&&!sys)ROOM.unread++;chatUI()}
function chatSend(){const i=$('#rcIn'),t=i.value.trim().slice(0,300);if(!t||!ROOM.role)return;i.value='';if(ROOM.role==='host'){const m={t:'chat',name:ROOM.name,text:t};rbc(m);chatAdd(m.name,t)}else rsend({t:'chat',text:t})}
function chatUI(){const d=$('#rchat');if(!d)return;d.hidden=!ROOM.role;d.classList.toggle('min',ROOM.min);$('#rcBadge').textContent=ROOM.unread?ROOM.unread:'';
 $('#rcCode').textContent=ROOM.code||'';$('#rcCount').textContent=Object.keys(ROOM.players).length+' kişi';$('#rcVoice').classList.toggle('live',!!ROOM.stream);$('#rcVoice').textContent=ROOM.stream?(ROOM.muted?'🔇':'🎤'):'🎤';
 const box=$('#rcMsgs');box.innerHTML=ROOM.chat.map(m=>m.sys?`<div class="s">${esc(m.text)}</div>`:`<div><b>${esc(m.name)}:</b> ${esc(m.text)}</div>`).join('');box.scrollTop=box.scrollHeight}
/* --- sesli sohbet --- */
async function voiceOn(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast('Bu tarayıcı mikrofonu desteklemiyor');return}
 try{ROOM.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});ROOM.muted=false}catch(e){toast('Mikrofon izni verilmedi');return}
 for(const id in ROOM.players)if(id!==ROOM.myId)voiceCall(id);rSysLocal('🎤 Sesli sohbete katıldın');onlineUI()}
function rSysLocal(t){chatAdd(null,t,true)}
function voiceOff(silent){if(ROOM.stream){ROOM.stream.getTracks().forEach(t=>t.stop());ROOM.stream=null}for(const id in ROOM.calls)voiceClose(id);if(!silent)rSysLocal('Sesli sohbetten ayrıldın');onlineUI()}
function voiceMute(){if(!ROOM.stream)return;ROOM.muted=!ROOM.muted;ROOM.stream.getAudioTracks().forEach(t=>t.enabled=!ROOM.muted);onlineUI()}
function voiceCall(id){if(!ROOM.peer||!ROOM.stream||id===ROOM.myId)return;voiceClose(id);const c=ROOM.peer.call(id,ROOM.stream);if(c)voiceHook(id,c)}
function voiceAnswer(c){voiceClose(c.peer);if(ROOM.stream)c.answer(ROOM.stream);else c.answer();voiceHook(c.peer,c)}
function voiceHook(id,c){ROOM.calls[id]=c;c.on('stream',st=>{let a=ROOM.audios[id];if(!a){a=document.createElement('audio');a.autoplay=true;a.playsInline=true;document.body.appendChild(a);ROOM.audios[id]=a}a.srcObject=st;a.play&&a.play().catch(()=>{});onlineUI()});
 c.on('close',()=>{if(ROOM.calls[id]===c){delete ROOM.calls[id];if(ROOM.audios[id]){ROOM.audios[id].remove();delete ROOM.audios[id]}onlineUI()}})}
function voiceClose(id){const c=ROOM.calls[id];delete ROOM.calls[id];try{c&&c.close()}catch(e){}if(ROOM.audios[id]){ROOM.audios[id].remove();delete ROOM.audios[id]}}
function voiceMesh(){if(!ROOM.stream)return;for(const id in ROOM.players)if(id!==ROOM.myId&&!ROOM.calls[id])voiceCall(id)}
/* --- arayüz --- */
function renderOnline(){if(ME.seg!=='adult'){$('#view').innerHTML=`<div class="panel" style="max-width:560px;margin:30px auto;text-align:center"><div style="font-size:52px">🔒</div><h3>Online sadece Büyük bölümünde</h3><p class="mut">Çocukların güvenliği için yabancılarla sesli ve yazılı sohbet çocuk bölümünde kapalıdır.</p></div>`;return}
 $('#view').innerHTML=`<div class="sec-h"><div><h2>🌐 Online</h2><p class="mut">Arkadaşlarınla aynı odaya gir, sesli ve yazılı sohbet et, savaş oyunlarını birlikte oyna.</p></div></div><div class="cols" id="onWrap"></div>`;onlineUI()}
function onlineUI(){chatUI();const w=$('#onWrap');if(!w||VIEW!=='online')return;const R=ROOM,me=R.myId;
 if(!R.role){w.innerHTML=`<div class="panel"><h3>🎮 Oda kur veya katıl</h3><label class="f">Oyundaki adın<input id="onNick" type="text" maxlength="20" value="${esc(ME.name)}"></label>
  <button class="btn block big" id="onMk">➕ Oda kur</button><p class="mut" style="text-align:center;margin:14px 0">ya da arkadaşının odasına katıl</p>
  <div style="display:flex;gap:8px"><input id="onCode" type="text" maxlength="5" placeholder="Oda kodu" style="text-transform:uppercase;letter-spacing:3px;font-weight:800"><button class="btn" id="onJoin">Katıl</button></div><p class="err" id="onErr" style="margin-top:10px"></p></div>
  <div class="panel"><h3>📖 Nasıl oynanır?</h3><ol style="padding-left:20px;line-height:1.9;color:var(--mut)"><li><b>Oda kur</b> ve çıkan 5 harfli kodu arkadaşlarına gönder.</li><li>Arkadaşların bu sayfada kodu yazıp <b>Katıl</b>'a bassın.</li><li><b>🎤 Sesli sohbet</b> butonuyla konuşun, sağ alttan yazışın.</li><li>Oda kurucusu <b>Oyunlar</b> sayfasından bir savaş oyunu seçer, herkes aynı haritada başlar.</li></ol><p class="mut" style="font-size:13px;margin-top:8px">Bağlantı oyuncular arasında doğrudan kurulur. Sohbet kaydedilmez.</p></div>`;
  $('#onMk').onclick=roomCreate;$('#onJoin').onclick=roomJoin;$('#onCode').onkeydown=e=>{if(e.key==='Enter')roomJoin()};return}
 const hostId='jrk-'+R.code,list=rlist();
 w.innerHTML=`<div class="panel"><p class="mut">Oda kodu</p><div style="display:flex;align-items:center;gap:12px;margin-bottom:6px"><div style="font-family:var(--hf);font-size:46px;letter-spacing:8px;color:var(--acc2)">${R.code}</div><button class="btn sec" id="onCopy">📋 Kopyala</button></div>
  <p class="mut">${R.role==='host'?'Oda kurucususun. Oyunlar sayfasından bir savaş oyunu seçtiğinde odadaki herkes için başlar.':'Oda kurucusunun oyunu başlatmasını bekle. Başlayınca otomatik katılırsın.'}</p>
  <div class="mrow" style="margin:14px 0"><button class="btn ${R.stream?'sec':''}" id="onVoice">${R.stream?'🎤 Sesliden ayrıl':'🎤 Sesli sohbete katıl'}</button>${R.stream?`<button class="btn ghost" id="onMute">${R.muted?'🔈 Mikrofonu aç':'🔇 Mikrofonu kapat'}</button>`:''}</div>
  ${R.role==='host'?`<button class="btn block" id="onGames">⚔️ Savaş oyunu seç</button>`:''}<button class="btn ghost block" id="onLeave" style="margin-top:10px">🚪 Odadan çık</button></div>
  <div class="panel"><h3>👥 Oyuncular (${list.length})</h3>${list.map(p=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)"><span>${p.id===hostId?'👑 ':''}<b>${esc(p.name)}</b>${p.id===me?' <span class="mut">(sen)</span>':''}</span><span>${p.id===me?(R.stream?(R.muted?'🔇':'🎤'):''):(R.audios[p.id]?'🔊':'')} ${isStaff()?`<button class="ibtn" data-gift="${esc(p.id)}">💰 Altın gönder</button>`:''}</span></div>`).join('')}${isStaff()?'':'<p class="mut" style="font-size:13px;margin-top:10px">Yönetici odadaysa buradan sana altın gönderebilir.</p>'}</div>`;
 $$('[data-gift]').forEach(b=>b.onclick=()=>roomGift(b.dataset.gift));
 $('#onCopy').onclick=()=>{try{navigator.clipboard.writeText(R.code);toast('Kod kopyalandı')}catch(e){toast(R.code)}};$('#onVoice').onclick=()=>R.stream?voiceOff():voiceOn();if($('#onMute'))$('#onMute').onclick=voiceMute;
 $('#onLeave').onclick=()=>roomLeave();if($('#onGames'))$('#onGames').onclick=()=>{FILTER='savash';SUB='';go('games')}}
$('#rcSend').onclick=chatSend;$('#rcIn').onkeydown=e=>{if(e.key==='Enter'){e.stopPropagation();chatSend()}};$('#rcIn').onkeyup=e=>e.stopPropagation();
$('#rcMin').onclick=()=>{ROOM.min=true;chatUI()};$('#rcOpen').onclick=()=>{ROOM.min=false;ROOM.unread=0;chatUI()};$('#rcVoice').onclick=()=>{if(!ROOM.stream)voiceOn();else voiceMute()};
addEventListener('beforeunload',()=>{try{ROOM.peer&&ROOM.peer.destroy()}catch(e){}});
