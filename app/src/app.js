/* ===== JRK Games — uygulama ===== */
const ADMIN_PASS='Kk1903';
/* --- SHA-256 (şifreler düz metin saklanmaz) --- */
function sha256(s){s=unescape(encodeURIComponent(s));const K=[],H=[];let p=2;const isP=n=>{for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
 for(let c=0;c<64;p++)if(isP(p)){if(c<8)H[c]=(Math.pow(p,.5)*4294967296)|0;K[c++]=(Math.pow(p,1/3)*4294967296)|0}
 const w=[],l=s.length*8;s+='\x80';while(s.length%64-56)s+='\x00';for(let i=0;i<s.length;i++)w[i>>2]|=s.charCodeAt(i)<<((3-i)%4)*8;w[w.length]=(l/4294967296)|0;w[w.length]=l;
 const r=(v,n)=>(v>>>n)|(v<<(32-n));const h=H.slice(0);
 for(let j=0;j<w.length;){const W=w.slice(j,j+=16),o=h.slice(0);for(let i=0;i<64;i++){const w15=W[i-15],w2=W[i-2];const a=h[0],e=h[4];
   const t1=h[7]+(r(e,6)^r(e,11)^r(e,25))+((e&h[5])^(~e&h[6]))+K[i]+(W[i]=i<16?W[i]:(W[i-16]+(r(w15,7)^r(w15,18)^(w15>>>3))+W[i-7]+(r(w2,17)^r(w2,19)^(w2>>>10)))|0);
   const t2=(r(a,2)^r(a,13)^r(a,22))+((a&h[1])^(a&h[2])^(h[1]&h[2]));h.unshift((t1+t2)|0);h[4]=(h[4]+t1)|0;h.length=8}for(let i=0;i<8;i++)h[i]=(h[i]+o[i])|0}
 return h.map(v=>('00000000'+(v>>>0).toString(16)).slice(-8)).join('')}
const salt=()=>Array.from({length:16},()=>Math.floor(Math.random()*36).toString(36)).join('');

/* --- hesaplar --- */
let USERS=ST.get('users',{}),ME=null;
const CFG=Object.assign({mult:1,announce:'',prices:{}},ST.get('cfg',{}));
const saveUsers=()=>ST.set('users',USERS),saveCfg=()=>ST.set('cfg',CFG);
const validEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function newUser(name,email,pass){const s=salt();return{name,email,salt:s,hash:sha256(s+pass),seg:null,coins:500,created:Date.now(),last:Date.now(),played:0,wins:0,prog:{},owned:['k_araba','a_spor'],car:{kid:'k_araba',adult:'a_spor'},paint:{kid:null,adult:null},banned:false}}
function login(email,remember){ME=USERS[email];ME.last=Date.now();saveUsers();if(remember)ST.set('session',email);else{ST.del('session');sessionStorage.setItem('jrk_session',email)}enterApp()}
function logout(){ME=null;ST.del('session');sessionStorage.removeItem('jrk_session');document.body.className=TOUCH?'touchdev':'';show('auth')}
function saveMe(){if(ME){USERS[ME.email]=ME;saveUsers();updCoins()}}
function addCoins(n){if(!ME)return;ME.coins=Math.max(0,Math.round(ME.coins+n));saveMe()}

/* --- ekranlar --- */
function show(id){$$('.screen').forEach(s=>s.classList.toggle('on',s.id===id));scrollTo(0,0)}
$$('[data-at]').forEach(b=>b.onclick=()=>{const t=b.dataset.at;$$('.tabs button').forEach(x=>x.classList.toggle('on',x.dataset.at===t));$('#loginForm').hidden=t!=='login';$('#regForm').hidden=t!=='reg';$('#liErr').textContent=$('#rgErr').textContent=''});
$$('[data-show]').forEach(b=>b.onclick=()=>{const i=$('#'+b.dataset.show);i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'Göster':'Gizle'});
$('#rgPass').oninput=e=>{const v=e.target.value;let sc=0;if(v.length>=6)sc++;if(v.length>=10)sc++;if(/[A-ZÇĞİÖŞÜ]/.test(v)&&/[a-zçğıöşü]/.test(v))sc++;if(/\d/.test(v))sc++;if(/[^\w]/.test(v))sc++;
 const m=$('#pwMeter');m.style.width=(sc/5*100)+'%';m.style.background=['#ef4444','#ef4444','#f59e0b','#f59e0b','#22c55e','#22c55e'][sc]};
$('#loginForm').onsubmit=e=>{e.preventDefault();const em=$('#liEmail').value.trim().toLowerCase(),pw=$('#liPass').value,er=$('#liErr');
 if(!validEmail(em)){er.textContent='Geçerli bir e-posta adresi gir.';return}if(!pw){er.textContent='Şifreni gir.';return}
 const u=USERS[em];if(!u||u.hash!==sha256(u.salt+pw)){er.textContent='E-posta veya şifre hatalı.';return}
 if(u.banned){er.textContent='Bu hesap yönetici tarafından askıya alındı.';return}
 $('#liPass').value='';login(em,$('#liRem').checked)};
$('#regForm').onsubmit=e=>{e.preventDefault();const nm=$('#rgName').value.trim(),em=$('#rgEmail').value.trim().toLowerCase(),p1=$('#rgPass').value,p2=$('#rgPass2').value,er=$('#rgErr');
 if(nm.length<2){er.textContent='Adın en az 2 harf olmalı.';return}if(!validEmail(em)){er.textContent='Geçerli bir e-posta adresi gir.';return}
 if(USERS[em]){er.textContent='Bu e-posta ile zaten bir hesap var. Giriş yap.';return}
 if(p1.length<6){er.textContent='Şifre en az 6 karakter olmalı.';return}if(!/\d/.test(p1)||!/\D/.test(p1)){er.textContent='Şifrede en az bir harf ve bir rakam olsun.';return}
 if(p1!==p2){er.textContent='Şifreler aynı değil.';return}if(!$('#rgTerms').checked){er.textContent='Devam etmek için şartları kabul etmelisin.';return}
 USERS[em]=newUser(nm,em,p1);saveUsers();['#rgPass','#rgPass2'].forEach(s=>$(s).value='');toast('Hesabın oluşturuldu, hoş geldin '+nm+'! 🎉');login(em,true)};
$('#forgot').onclick=async()=>{const em=await dlg('Şifremi unuttum','Hesabının e-posta adresini yaz.',{input:$('#liEmail').value,type:'email',yes:'Devam'});if(!em)return;
 const u=USERS[em.trim().toLowerCase()];await dlg(u?'Hesap bulundu':'Hesap bulunamadı',u?'Hesapların bu cihazda güvenle saklanıyor. Şifreni sıfırlamak için bir yetişkinden Yönetici Paneli → Kullanıcılar bölümünden yeni şifre belirlemesini iste.':'Bu e-posta ile kayıtlı bir hesap yok. Kayıt olabilirsin.',{no:null})};

function enterApp(){if(!ME.seg){show('segScreen');$('#segHi').textContent='Merhaba '+ME.name+'! Oyunları sana göre hazırlayalım.';return}applySeg();show('appScreen');go('home')}
$$('[data-seg]').forEach(b=>b.onclick=async()=>{const sg=b.dataset.seg;if(sg==='adult'&&ME.seg==='kid'&&!(await parentGate()))return;ME.seg=sg;saveMe();enterApp()});
async function parentGate(){const a=6+Math.floor(Math.random()*7),b=6+Math.floor(Math.random()*7);const v=await dlg('Ebeveyn doğrulaması','Büyük bölümüne geçmek için bir yetişkinin bu soruyu çözmesi gerekiyor: '+a+' × '+b+' + 17 = ?',{input:'',type:'number',yes:'Doğrula'});
 if(v===null)return false;if(+v===a*b+17)return true;toast('Yanlış cevap');return false}

/* --- katalog: 500 çocuk + 500 yetişkin oyunu --- */
const ENVN=['Çöl','Kutup','Orman','Gece Şehri','Volkan','Bozkır','Kanyon','Şehir','Bataklık','Gün Batımı','Sahil'];
const K_MODES=[
 {k:'yol',n:'Çarpım Yolu',i:'🚗',g:'#ff8a00,#ff3d7f',d:'Yolda giderken birden soru gelir! Doğru cevabın yazdığı şeride geç, yanlış kapıdan kaçın.'},
 {k:'yaris',n:'Soru Yarışı',i:'🏁',g:'#1fa5ff,#7b5cff',d:'Rakip arabalarla yarış. Her doğru cevap nitro verir, yanlış cevap yavaşlatır. Birinci ol!'},
 {k:'zaman',n:'Hızlı Hesap',i:'⏱️',g:'#22c55e,#0ea5e9',d:'Süre bitmeden hedef sayıda soruyu doğru cevapla. Hızlı düşün, hızlı sür!'},
 {k:'acik',n:'Kasaba Turu',i:'🗺️',g:'#f59e0b,#ef4444',d:'Açık dünya kasabasında serbestçe gez. Parlayan yıldızları bul ve sorularını çöz.'},
 {k:'hikaye',n:'Ali\'nin Yolculuğu',i:'📖',g:'#a855f7,#ec4899',d:'Ali ile 100 bölümlük bir yolculuğa çık. Her bölümde yeni bir görev ve yeni sorular!'}];
const K_TABLES=[2,3,4,5,6,7,8,9,10,0],K_WORLD=[2,7,10,1,5,0,9,6];
const tblName=t=>t?t+"'ler tablosu":'Karışık tablo';
const KIDS_F=['Ayşe','Mehmet','Zeynep','Can','Elif','Emre','Defne','Mert','Ece','Kerem'],KIDS_P=['Fırın','Okul','Park','Hayvanat Bahçesi','Kütüphane','Çiftlik','Sahil','Müze','Stadyum','Lunapark'],KIDS_I=['sıcak ekmekleri','kitapları','futbol topunu','meyve sepetini','çiçekleri','oyuncakları','doğum günü pastasını','dondurmaları','mektupları','balonları'];
const A_MODES=[
 {k:'yaris',n:'Pist Yarışı',i:'🏁',g:'#e11d48,#7f1d1d',d:'7 rakibe karşı 3 tur. İlk üçe girersen kupa senin.'},
 {k:'zaman',n:'Zamana Karşı',i:'⏱️',g:'#0ea5e9,#1e3a8a',d:'Pistte tek başına hedef süreyi geçmeye çalış.'},
 {k:'drift',n:'Drift Ustası',i:'💨',g:'#a855f7,#1e1b4b',d:'El frenini çek, virajlarda kayarak puan topla. Hedef puanı geç.'},
 {k:'polis',n:'Polis Kaçışı',i:'🚓',g:'#2563eb,#dc2626',d:'Peşindeki polis arabalarından kaç. Süre bitene kadar yakalanma!'},
 {k:'eleme',n:'Eleme Yarışı',i:'❌',g:'#f59e0b,#7c2d12',d:'Her turun sonunda sonuncu elenir. Sona kalan sen ol.'},
 {k:'acik',n:'Açık Şehir',i:'🌆',g:'#14b8a6,#0f172a',d:'Açık dünya şehrinde serbest sür. Kontrol noktalarını süre bitmeden topla.'},
 {k:'hikaye',n:'Sokak Efsanesi',i:'📖',g:'#f43f5e,#111827',d:'Sıfırdan sokak yarışlarının efsanesine: 54 bölümlük kariyer hikâyesi.'}];
const A_ENV=[0,1,2,3,5,6,7,9,10];
const TRACKS=['Kızıl Viraj','Altın Kum','Serap Hattı','Buz Tüneli','Kar Fırtınası','Kuzey Işığı','Yeşil Cehennem','Çam Yolu','Şelale Virajı','Neon Bulvar','Gece Yarısı','Işık Hızı','Rüzgâr Ovası','Bozkır Fırtınası','Sonsuz Düzlük','Kızıl Kanyon','Kayalık Geçit','Kartal Yuvası','Merkez Çevre','Köprü Hattı','Liman Yolu','Turuncu Ufuk','Akşam Kızıllığı','Son Işık','Mavi Kıyı','Palmiye Yolu','Martı Virajı'];
const RIVALS=['Kara Şimşek','Gölge','Turbo Kemal','Asi Zeynep','Baron','Neon Kraliçe','Demir Yumruk','Tilki','Kral Cobra'];
const GAMES=[];
for(let mi=0;mi<5;mi++)for(let ti=0;ti<10;ti++)for(let lv=1;lv<=10;lv++){const m=K_MODES[mi],t=K_TABLES[ti],w=K_WORLD[(ti+lv+mi)%8],n=GAMES.length+1,ch=ti*10+lv;
 const g={id:'c'+n,no:n,seg:'kid',mode:m.k,M:m,table:t,level:lv,env:w,veh:['araba','otobus','itfaiye','polis','traktor','dondurma','yaris'][(ti*3+lv+mi)%7],cat:m.k};
 if(m.k==='hikaye'){const f=KIDS_F[ch%10],p=KIDS_P[(ch*3)%10],it=KIDS_I[(ch*7)%10];g.ch=ch;g.name=`Ali'nin Yolculuğu ${ch}: ${p} Yolu`;
  g.intro=`Merhaba ben Ali! ${f} bize bir mesaj gönderdi: ${it} ${p.toLocaleLowerCase('tr')} tarafına götürmemiz lazım. Yolda ${tblName(t)} soruları çıkacak. Haydi yola çıkalım!`;g.outro=`Yaşasın! ${it.replace(/ı$|i$|u$|ü$/,'')} zamanında ulaştı. ${f} çok mutlu oldu. Teşekkürler, harika bir sürücüsün!`}
 else g.name=`${m.n}: ${tblName(t).replace(' tablosu','')} #${lv}`;
 g.desc=m.d;GAMES.push(g)}
for(let mi=0;mi<7;mi++)for(let ei=0;ei<9;ei++)for(let lv=1;lv<=6;lv++){const m=A_MODES[mi],n=GAMES.length+1,env=A_ENV[ei],tr=TRACKS[(ei*3+lv)%27],ch=ei*6+lv;
 const g={id:'a'+(n-500),no:n-500,seg:'adult',mode:m.k,M:m,env,level:lv,diff:Math.min(10,Math.ceil((lv*1.6+ei*.5))),seed:n*7919,car:['spor','kas','ralli','super','gt'][(ei+lv+mi)%5],cat:m.k,track:tr,desc:m.d};
 if(m.k==='hikaye'){const r=RIVALS[Math.floor((ch-1)/6)],sub=['yaris','drift','zaman','polis','eleme','yaris'][(ch-1)%6];g.ch=ch;g.sub=sub;g.rival=r;g.name=`Sokak Efsanesi ${ch}: ${r}`;
  g.intro=[`Şehrin yeraltı yarış dünyasına hoş geldin. ${r} bu bölgenin hâkimi. Onu yenmeden adını kimse duymaz.`,`${r} seni küçümsüyor: "O arabayla mı? Gülerim!" Göster ona kim olduğunu.`,`Bu gece büyük para var. ${r} da orada olacak. Kazanırsan bir sonraki lige yükselirsin.`,`Polis yarış yerini öğrendi! ${r} yine de yarıştan vazgeçmiyor. Dikkatli ol.`,`${r} ile hesaplaşma zamanı. Bu bölgenin son yarışı.`,`Bölgenin şampiyonu ${r}. Herkes seni izliyor.`][(ch-1)%6];
  g.outro=ch===54?'Tebrikler! Artık şehrin tartışmasız Sokak Efsanesi sensin. 🏆':`Harika sürüş! ${r} şaşkın. Adın sokaklarda konuşulmaya başladı.`}
 else g.name=`${tr} • ${m.n}`;
 GAMES.push(g)}
for(const w of WAR_LIST){const n=GAMES.length+1;GAMES.push({id:'w-'+w.id,no:n-500,seg:'adult',mode:w.camp?'savash':'savas',cat:w.camp?'savash':'savas',war:w.id,name:w.name,M:{i:w.icon,n:w.camp?'Savaş Hikâyesi':'Savaş: '+w.mode,g:w.camp?'#7f1d1d,#1f2937':'#4b5320,#1f2937'},desc:w.desc,obj:w.obj})}
const GBY={};GAMES.forEach(g=>GBY[g.id]=g);
const CATS={kid:[['all','Tümü','🎮'],...K_MODES.map(m=>[m.k,m.n,m.i])],adult:[['all','Tümü','🎮'],...A_MODES.map(m=>[m.k,m.n,m.i]),['savas','Savaş Oyunları','⚔️'],['savash','Savaş Hikâyesi','📖']]};
const segGames=()=>GAMES.filter(g=>g.seg===ME.seg).concat(uploadsFor(ME.seg));
function uploadsFor(seg){return ST.get('uploads',[]).filter(u=>u.seg===seg).map((u,i)=>({id:'u-'+u.id,no:'U'+(i+1),seg,mode:'yuk',cat:'yuk',upload:u,name:u.name,M:{i:u.icon||'🕹️',n:'Yüklenen oyun',g:'#334155,#0f172a'},desc:'Yönetici tarafından yüklenen oyun.'}))}
const isLocked=g=>{if(!g.ch||g.war)return false;if(g.ch===1)return false;const prev=GAMES.find(x=>x.seg===g.seg&&x.mode===g.mode&&x.ch===g.ch-1);return prev&&!(ME.prog[prev.id]>0)};

/* --- mağaza --- */
const ITEMS=[
 {id:'k_araba',seg:'kid',type:'car',val:'araba',name:'Kırmızı Araba',icon:'🚗',price:0,sp:3,hd:4},
 {id:'k_otobus',seg:'kid',type:'car',val:'otobus',name:'Okul Otobüsü',icon:'🚌',price:300,sp:2,hd:3},
 {id:'k_traktor',seg:'kid',type:'car',val:'traktor',name:'Çiftlik Traktörü',icon:'🚜',price:400,sp:2,hd:5},
 {id:'k_itfaiye',seg:'kid',type:'car',val:'itfaiye',name:'İtfaiye Aracı',icon:'🚒',price:600,sp:3,hd:3},
 {id:'k_polis',seg:'kid',type:'car',val:'polis',name:'Polis Arabası',icon:'🚓',price:600,sp:4,hd:4},
 {id:'k_dondurma',seg:'kid',type:'car',val:'dondurma',name:'Dondurma Kamyonu',icon:'🍦',price:800,sp:3,hd:3},
 {id:'k_yaris',seg:'kid',type:'car',val:'yaris',name:'Yarış Arabası',icon:'🏎️',price:1500,sp:5,hd:5},
 {id:'a_spor',seg:'adult',type:'car',val:'spor',name:'Spor Coupe',icon:'🚗',price:0,sp:3,hd:3},
 {id:'a_kas',seg:'adult',type:'car',val:'kas',name:'Kas Arabası V8',icon:'🚙',price:1500,sp:4,hd:2},
 {id:'a_ralli',seg:'adult',type:'car',val:'ralli',name:'Ralli Hatchback',icon:'🚘',price:2500,sp:3,hd:5},
 {id:'a_gt',seg:'adult',type:'car',val:'gt',name:'GT Yarış',icon:'🏁',price:4000,sp:4,hd:4},
 {id:'a_super',seg:'adult',type:'car',val:'super',name:'Süper Araba',icon:'🏎️',price:6000,sp:5,hd:4},
 ...[['Kiraz Kırmızısı','#c8102e',200],['Okyanus Mavisi','#1e5fbf',200],['Zümrüt Yeşili','#11823b',250],['Gün Sarısı','#f2b705',250],['Gece Siyahı','#141414',300],['İnci Beyazı','#eceff3',300],['Lav Turuncusu','#ff5a1f',400],['Neon Mor','#8b2be2',500],['Altın','#d4af37',1903]].flatMap(([n,c,p],i)=>[
  {id:'kp'+i,seg:'kid',type:'paint',val:c,name:n,icon:'🎨',price:Math.round(p*.6)},{id:'ap'+i,seg:'adult',type:'paint',val:c,name:n,icon:'🎨',price:p}])];
const price=it=>CFG.prices[it.id]??it.price;
function buy(id){const it=ITEMS.find(i=>i.id===id);if(!it)return;if(ME.owned.includes(id)){equip(id);return}const p=price(it);if(ME.coins<p){toast('Yetersiz bakiye: '+fmt(p-ME.coins)+' altın daha lazım');return}
 ME.coins-=p;ME.owned.push(id);equip(id);toast(it.name+' satın alındı! 🎉')}
function equip(id){const it=ITEMS.find(i=>i.id===id);if(it.type==='car')ME.car[it.seg]=id;else ME.paint[it.seg]=ME.paint[it.seg]===id?null:id;saveMe();if(VIEW==='shop')go('shop')}

/* --- uygulama kabuğu --- */
let VIEW='home',FILTER='all',SUB='',QUERY='',PAGE=1;
function applySeg(){document.body.classList.remove('seg-kid','seg-adult');document.body.classList.add('seg-'+ME.seg);
 const nav=ME.seg==='kid'?[['home','Ana Sayfa','🏠'],['games','Oyunlar','🎮'],['story','Hikâye','📖'],['open','Kasaba','🗺️'],['shop','Garaj','🚗']]:[['home','Ana Sayfa','🏠'],['games','Oyunlar','🎮'],['story','Hikâye','📖'],['open','Açık Dünya','🌆'],['shop','Garaj','🛒']];
 $('#mainnav').innerHTML=nav.map(n=>`<button data-go="${n[0]}">${n[1]}</button>`).join('');$('#tabbar').innerHTML=nav.map(n=>`<button data-go="${n[0]}"><b>${n[2]}</b>${n[1]}</button>`).join('');
 $('#avBtn').textContent=(ME.name[0]||'?').toLocaleUpperCase('tr');$('#mName').textContent=ME.name;$('#mMail').textContent=ME.email;
 const an=$('#announce');an.hidden=!CFG.announce;an.textContent=CFG.announce;updCoins()}
function updCoins(){if(ME)$('#coinVal').textContent=fmt(ME.coins)}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();$('#menu').classList.remove('on');go(g.dataset.go);return}
 const d=e.target.closest('[data-doc]');if(d){e.preventDefault();$('#menu').classList.remove('on');openDoc(d.dataset.doc);return}
 const c=e.target.closest('[data-g]');if(c){openGame(c.dataset.g);return}
 if(!e.target.closest('#menu,#avBtn'))$('#menu').classList.remove('on')});
$('#avBtn').onclick=()=>$('#menu').classList.toggle('on');
$('#homeLogo').onclick=e=>{e.preventDefault();go('home')};
$('#mOut').onclick=()=>{$('#menu').classList.remove('on');logout();toast('Çıkış yapıldı')};
$('#mSeg').onclick=()=>{$('#menu').classList.remove('on');show('segScreen')};
$('#mAdmin').onclick=()=>{$('#menu').classList.remove('on');openAdmin()};
$('#adminLink').onclick=()=>openAdmin();
$('#q').oninput=e=>{QUERY=e.target.value.trim();if(VIEW!=='games'){FILTER='all';go('games',true)}else{PAGE=1;renderGames()}};
function go(v,keepQ){VIEW=v;if(!keepQ&&v!=='games'){QUERY='';$('#q').value=''}PAGE=1;$$('[data-go]').forEach(b=>b.classList.toggle('on',b.dataset.go===v));
 ({home:renderHome,games:renderGames,story:renderStory,open:renderOpen,shop:renderShop,profile:renderProfile})[v]();scrollTo(0,0)}
const stars=g=>{const s=ME.prog[g.id]||0;return s?'⭐'.repeat(s)+'<span style="opacity:.3">'+'⭐'.repeat(3-s)+'</span>':''};
const ENVG=['#e0a85a,#9a5a2a','#9cc6e8,#4a6f9a','#4f9a4a,#1f4a2a','#2a3a6a,#0a0f1f','#c2410c,#3a1a12','#a8b45a,#4a6a2a','#d9773a,#7a2f15','#7a8a9a,#2a3440','#5a7a4a,#1f2f1f','#ff9a5a,#5a3a8a','#4ec5e8,#e8cf8a'];
const VEHI={araba:'🚗',otobus:'🚌',itfaiye:'🚒',polis:'🚓',traktor:'🚜',dondurma:'🍦',yaris:'🏎️'},CARI={spor:'🚗',kas:'🚙',ralli:'🚘',gt:'🏁',super:'🏎️'};
const icon=g=>g.seg==='kid'&&g.veh&&g.mode!=='hikaye'&&g.mode!=='acik'?VEHI[g.veh]:g.seg==='adult'&&g.car&&['yaris','zaman','eleme','drift'].includes(g.mode)?CARI[g.car]:g.M.i;
const grad=g=>{const c=(g.env!=null&&!g.war?ENVG[g.env]:g.M.g||'#334155,#0f172a').split(',');return`linear-gradient(135deg,${c[0]},${c[1]})`};
function card(g){const lk=isLocked(g),tags=[];if(g.seg==='kid'&&g.mode!=='hikaye')tags.push(g.table?g.table+'×':'Karışık');if(g.env!=null)tags.push(ENVN[g.env]);if(g.level)tags.push('Sv. '+g.level);if(g.obj)tags.push(g.obj);
 return`<button class="gc" data-g="${g.id}" style="--g:${grad(g)}"><div class="th"><span class="bd">${esc(g.M.n)}</span><span class="no">#${g.no}</span><span class="ic">${lk?'🔒':icon(g)}</span><span class="stars">${stars(g)}</span></div>
 <div class="bd2"><div class="nm">${esc(g.name)}</div><div class="mt">${tags.slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></button>`}
let heroI=0,heroT=null;
function renderHome(){const all=segGames(),kid=ME.seg==='kid',played=all.filter(g=>ME.prog[g.id]).length,starsN=all.reduce((a,g)=>a+(ME.prog[g.id]||0),0);
 const slides=kid?[{k:'Yeni',h:'Çarpım Yolu',p:'Arabanla yolda giderken birden soru gelir! Doğru şeride geç, yıldızları topla.',g:'#ff8a00,#ff3d7f',i:'🚗',go:'c1'},{k:'Hikâye',h:"Ali'nin Yolculuğu",p:'100 bölümlük macera. Ali ile arkadaşlarına yardım et.',g:'#a855f7,#ec4899',i:'📖',go:'c401'},{k:'Açık Dünya',h:'Kasaba Turu',p:'Kasabada serbestçe gez, gizli yıldız sorularını bul.',g:'#f59e0b,#ef4444',i:'🗺️',go:'c301'}]
  :[{k:'Öne çıkan',h:'Pist Yarışı',p:'Gerçekçi ışık, gölge ve fizik. 7 rakibe karşı kupayı kazan.',g:'#e11d48,#111827',i:'🏁',go:'a1'},{k:'Hikâye',h:'Sokak Efsanesi',p:'54 bölümlük kariyer. Rakiplerini tek tek yen.',g:'#f43f5e,#1e1b4b',i:'📖',go:'a325'},{k:'Savaş',h:'Kara Akrep Savaşı',p:'20 bölümlük savaş hikâyesi, tanklar, uçaklar ve fazlası.',g:'#4b5320,#111827',i:'🦂',go:'w-k1'},{k:'Açık Dünya',h:'Açık Şehir',p:'Şehirde serbest sür, kontrol noktalarını topla.',g:'#14b8a6,#0f172a',i:'🌆',go:'a271'}];
 const rows=CATS[ME.seg].slice(1).map(([k,n,i])=>{const list=all.filter(g=>g.cat===k).slice(0,10);return list.length?`<div class="sec-h"><h2>${i} ${esc(n)}</h2><button data-cat="${k}">Tümünü gör →</button></div><div class="row">${list.map(card).join('')}</div>`:''}).join('');
 const last=(ME.recent||[]).map(id=>GBY[id]).filter(Boolean).slice(0,10);
 $('#view').innerHTML=`<div class="hero" id="hero"><div class="bgart" id="heroBg"></div><div class="txt"><span class="kick" id="hK"></span><h1 id="hH"></h1><p id="hP"></p><button class="btn big" id="hGo">▶ Hemen oyna</button></div><div class="dots" id="hD">${slides.map((_,i)=>`<button data-hi="${i}" aria-label="Slayt ${i+1}"></button>`).join('')}</div></div>
 <div class="stats"><div class="stat"><b>${all.length}</b><span>Oyun</span></div><div class="stat"><b>${played}</b><span>Oynadığın</span></div><div class="stat"><b>${starsN} ⭐</b><span>Toplam yıldız</span></div><div class="stat"><b>🪙 ${fmt(ME.coins)}</b><span>Altın</span></div></div>
 ${last.length?`<div class="sec-h"><h2>⏯️ Kaldığın yerden devam et</h2></div><div class="row">${last.map(card).join('')}</div>`:''}${rows}`;
 const setH=i=>{heroI=(i+slides.length)%slides.length;const s=slides[heroI];$('#hero').style.background=`radial-gradient(circle at 80% 40%,#fff3,transparent 50%),linear-gradient(120deg,${s.g.split(',')[0]},${s.g.split(',')[1]})`;
  $('#heroBg').innerHTML=`<div style="position:absolute;right:6%;top:50%;translate:0 -50%;font-size:min(30vw,220px);filter:drop-shadow(0 20px 30px #0006)">${s.i}</div>`;$('#hK').textContent=s.k;$('#hH').textContent=s.h;$('#hP').textContent=s.p;$('#hGo').onclick=()=>openGame(s.go);
  $$('#hD button').forEach((b,j)=>b.classList.toggle('on',j===heroI))};setH(heroI);clearInterval(heroT);heroT=setInterval(()=>{if(VIEW==='home'&&$('#hero'))setH(heroI+1)},6000);
 $$('#hD button').forEach(b=>b.onclick=()=>setH(+b.dataset.hi));$$('[data-cat]').forEach(b=>b.onclick=()=>{FILTER=b.dataset.cat;SUB='';go('games')})}
function renderGames(){const kid=ME.seg==='kid';let list=segGames();const ups=uploadsFor(ME.seg);
 const chips=[...CATS[ME.seg],...(ups.length?[['yuk','Yüklenen','📦']]:[])];
 if(FILTER!=='all')list=list.filter(g=>g.cat===FILTER);if(SUB){list=list.filter(g=>kid?String(g.table)===SUB:String(g.env)===SUB)}
 if(QUERY){const q=QUERY.toLocaleLowerCase('tr');list=list.filter(g=>(g.name+' '+g.M.n+' '+(g.env!=null?ENVN[g.env]:'')+' '+(g.table||'')).toLocaleLowerCase('tr').includes(q))}
 const per=40,shown=list.slice(0,PAGE*per);
 $('#view').innerHTML=`<div class="sec-h"><h2>🎮 ${kid?'Çocuk':'Büyük'} oyunları</h2><span class="cnt">${list.length} oyun</span></div>
 <div class="chips">${chips.map(c=>`<button class="chip ${FILTER===c[0]?'on':''}" data-f="${c[0]}">${c[2]} ${esc(c[1])}</button>`).join('')}</div>
 <div class="sub">${kid?`<select id="subSel" aria-label="Tablo"><option value="">Tüm tablolar</option>${K_TABLES.map(t=>`<option value="${t}" ${SUB===String(t)?'selected':''}>${t?t+"'ler tablosu":'Karışık'}</option>`).join('')}</select>`:`<select id="subSel" aria-label="Ortam"><option value="">Tüm ortamlar</option>${A_ENV.map(e=>`<option value="${e}" ${SUB===String(e)?'selected':''}>${ENVN[e]}</option>`).join('')}</select>`}
 ${QUERY?`<span class="cnt">"${esc(QUERY)}" araması</span>`:''}</div>
 <div class="grid">${shown.map(card).join('')||'<p class="empty">Bu filtreye uyan oyun yok.</p>'}</div>${list.length>shown.length?`<div class="more"><button class="btn sec big" id="moreB">Daha fazla göster (${list.length-shown.length})</button></div>`:''}`;
 $$('[data-f]').forEach(b=>b.onclick=()=>{FILTER=b.dataset.f;SUB='';PAGE=1;renderGames()});$('#subSel').onchange=e=>{SUB=e.target.value;PAGE=1;renderGames()};
 const mb=$('#moreB');if(mb)mb.onclick=()=>{PAGE++;const y=scrollY;renderGames();scrollTo(0,y)}}
function renderStory(){const kid=ME.seg==='kid';const sets=kid?[['hikaye',"📖 Ali'nin Yolculuğu","100 bölüm • Ali ile arkadaşlarına yardım et, yolda çarpım sorularını çöz."]]:[['hikaye','📖 Sokak Efsanesi','54 bölüm • Sokak yarışlarında sıfırdan efsaneye.'],['savash','🦂 Savaş Hikâyeleri','Kara Akrep Savaşı (20 bölüm) ve Nükleer Tehdit.']];
 $('#view').innerHTML=sets.map(([k,h,p])=>{const list=GAMES.filter(g=>g.seg===ME.seg&&g.cat===k),done=list.filter(g=>ME.prog[g.id]).length;
  return`<div class="sec-h"><div><h2>${h}</h2><p class="mut">${p}</p></div><span class="cnt">${done}/${list.length} tamamlandı</span></div><div class="grid" style="margin-bottom:30px">${list.map(card).join('')}</div>`}).join('')}
function renderOpen(){const list=segGames().filter(g=>g.cat==='acik');$('#view').innerHTML=`<div class="sec-h"><div><h2>${ME.seg==='kid'?'🗺️ Kasaba Turu':'🌆 Açık Dünya'}</h2><p class="mut">${ME.seg==='kid'?'Kasabada serbestçe gez, parlayan yıldızları bul, sorularını çöz.':'Şehirde serbest sür, trafiğe dikkat et, kontrol noktalarını süre bitmeden topla.'}</p></div><span class="cnt">${list.length} harita</span></div><div class="grid">${list.map(card).join('')}</div>`}
function renderShop(){const its=ITEMS.filter(i=>i.seg===ME.seg),car=ME.car[ME.seg],pn=ME.paint[ME.seg];
 const one=it=>{const own=ME.owned.includes(it.id),eq=it.id===car||it.id===pn;return`<div class="si ${own?'own':''}"><div class="pv" style="--c:${it.type==='paint'?it.val:'transparent'}">${it.icon}${it.type==='paint'?'<i></i>':''}</div><h4>${esc(it.name)}</h4>
  ${it.type==='car'?`<div class="bars"><div>Hız<em><i style="width:${it.sp*20}%"></i></em></div><div>Yol tutuş<em><i style="width:${it.hd*20}%"></i></em></div></div>`:'<p class="mut" style="font-size:13px">Aracının rengini değiştirir.</p>'}
  <button class="btn ${own?(eq?'sec':''):''} block" data-buy="${it.id}">${own?(eq?'✓ Kullanılıyor':'Kullan'):(price(it)?'🪙 '+fmt(price(it))+' • Satın al':'Ücretsiz')}</button></div>`};
 $('#view').innerHTML=`<div class="sec-h"><h2>🚗 Araçlar</h2><span class="cnt">🪙 ${fmt(ME.coins)}</span></div><div class="shopgrid">${its.filter(i=>i.type==='car').map(one).join('')}</div>
 <div class="sec-h" style="margin-top:30px"><h2>🎨 Boyalar</h2></div><div class="shopgrid">${its.filter(i=>i.type==='paint').map(one).join('')}</div>`;
 $$('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy))}
function renderProfile(){const all=segGames(),st=all.reduce((a,g)=>a+(ME.prog[g.id]||0),0);
 $('#view').innerHTML=`<div class="ph"><div class="avatar">${esc(ME.name[0].toLocaleUpperCase('tr'))}</div><div><h2>${esc(ME.name)}</h2><span class="mut">${esc(ME.email)} • <span class="pill ${ME.seg}">${ME.seg==='kid'?'Çocuk':'Büyük'}</span></span></div></div>
 <div class="stats"><div class="stat"><b>${ME.played}</b><span>Oynanan oyun</span></div><div class="stat"><b>${ME.wins}</b><span>Kazanılan</span></div><div class="stat"><b>${st} ⭐</b><span>Yıldız</span></div><div class="stat"><b>🪙 ${fmt(ME.coins)}</b><span>Altın</span></div></div>
 <div class="cols"><div class="panel"><h3>👤 Hesap</h3><label class="f">Adın<input id="pfName" type="text" maxlength="20" value="${esc(ME.name)}"></label><button class="btn" id="pfSave">Kaydet</button></div>
 <div class="panel"><h3>🔑 Şifre değiştir</h3><label class="f">Mevcut şifre<input id="pfOld" type="password" autocomplete="current-password"></label><label class="f">Yeni şifre<input id="pfNew" type="password" autocomplete="new-password"></label><button class="btn" id="pfPw">Şifreyi değiştir</button></div>
 <div class="panel"><h3>⚙️ Tercihler</h3><label class="f">Grafik kalitesi<select id="pfGfx"><option value="low">Düşük (eski telefonlar)</option><option value="mid">Orta</option><option value="high">Yüksek</option></select></label><label class="chk"><input type="checkbox" id="pfSnd" ${ST.get('snd',true)?'checked':''}> Ses efektleri</label><button class="btn sec" id="pfSeg">🔁 Çocuk / Büyük değiştir</button></div>
 <div class="panel"><h3>🗑️ Hesabı sil</h3><p class="mut" style="margin-bottom:14px">Hesabın, ilerlemen ve altınların bu cihazdan kalıcı olarak silinir.</p><button class="btn" style="background:var(--bad)" id="pfDel">Hesabımı sil</button><button class="btn ghost" id="pfOut" style="margin-left:8px">Çıkış yap</button></div></div>`;
 $('#pfGfx').value=ST.get('gfx',TOUCH?'low':'mid');$('#pfGfx').onchange=e=>{ST.set('gfx',e.target.value);toast('Grafik kalitesi kaydedildi')};$('#pfSnd').onchange=e=>{ST.set('snd',e.target.checked);SFX.on=e.target.checked};
 $('#pfSave').onclick=()=>{const v=$('#pfName').value.trim();if(v.length<2){toast('Ad en az 2 harf olmalı');return}ME.name=v;saveMe();applySeg();toast('Kaydedildi')};
 $('#pfPw').onclick=()=>{const o=$('#pfOld').value,n=$('#pfNew').value;if(ME.hash!==sha256(ME.salt+o)){toast('Mevcut şifre yanlış');return}if(n.length<6||!/\d/.test(n)){toast('Yeni şifre en az 6 karakter ve bir rakam içermeli');return}ME.salt=salt();ME.hash=sha256(ME.salt+n);saveMe();$('#pfOld').value=$('#pfNew').value='';toast('Şifren değiştirildi 🔒')};
 $('#pfSeg').onclick=()=>show('segScreen');$('#pfOut').onclick=()=>logout();
 $('#pfDel').onclick=async()=>{if(!(await dlg('Hesabı sil','Bu işlem geri alınamaz. Hesabın ve tüm ilerlemen silinsin mi?',{yes:'Evet, sil'})))return;delete USERS[ME.email];saveUsers();logout();toast('Hesabın silindi')}}

/* --- oyun detay / başlatma --- */
function openGame(id){const g=GBY[id]||uploadsFor(ME.seg).find(x=>x.id===id);if(!g)return;const lk=isLocked(g);
 const info=g.war?[['Tür',g.M.n],['Görev',g.obj||'Savaş'],['Mod','Tek / Online']]:g.upload?[['Tür','Yüklenen'],['Kaynak',g.upload.url?'Bağlantı':'HTML'],['','']]:g.seg==='kid'?[['Tablo',g.table?g.table+"'ler":'Karışık'],['Dünya',ENVN[g.env]],['Seviye',g.level+'/10']]:[['Pist',g.track],['Ortam',ENVN[g.env]],['Zorluk',g.diff+'/10']];
 $('#mbox').innerHTML=`<div class="mh" style="--g:${grad(g)}">${lk?'🔒':icon(g)}<button class="x" id="mX" aria-label="Kapat">✕</button></div><div class="mb"><span class="pill ${g.seg}">${esc(g.M.n)}</span><h3 style="margin-top:8px">${esc(g.name)}</h3><p class="mut">${esc(g.desc||'')}</p>
 <div class="kv">${info.filter(i=>i[0]).map(i=>`<div>${i[0]}<b>${esc(i[1])}</b></div>`).join('')}</div>
 ${ME.prog[g.id]?`<p style="margin-bottom:14px">En iyi sonucun: ${'⭐'.repeat(ME.prog[g.id])}</p>`:''}
 <div class="mrow">${lk?`<p class="mut">🔒 Bu bölümü açmak için önceki bölümü bitir.</p>`:`<button class="btn big" id="mPlay">▶ Oyna</button>`}<button class="btn ghost big" id="mClose">Kapat</button></div>
 ${g.seg==='kid'&&!g.war?`<p class="mut" style="font-size:13px;margin-top:14px">🎮 Kontroller: ◀ ▶ tuşları ya da ekrandaki oklarla şerit değiştir.${g.mode==='acik'?' Açık dünyada ▲ ile gaz ver.':''}</p>`:g.war?'':`<p class="mut" style="font-size:13px;margin-top:14px">🎮 W/↑ gaz • S/↓ fren • A/D direksiyon • Boşluk el freni • Shift nitro • C kamera</p>`}</div>`;
 $('#modal').classList.add('on');$('#mX').onclick=$('#mClose').onclick=()=>$('#modal').classList.remove('on');const p=$('#mPlay');if(p)p.onclick=()=>{$('#modal').classList.remove('on');playGame(g)}}
$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('on')};
function playGame(g){ME.recent=[g.id,...(ME.recent||[]).filter(x=>x!==g.id)].slice(0,12);saveMe();
 if(g.war)return launchWar(g.war,g);if(g.upload)return launchUpload(g.upload);
 const carIt=ITEMS.find(i=>i.id===ME.car[g.seg]),pnt=ITEMS.find(i=>i.id===ME.paint[g.seg]);
 Drive.start(g,{car:carIt?carIt.val:null,paint:pnt?pnt.val:null,gfx:ST.get('gfx',TOUCH?'low':'mid')},res=>gameDone(g,res))}
function nextOf(g){const list=GAMES.filter(x=>x.seg===g.seg&&x.cat===g.cat);const i=list.indexOf(g);return list[i+1]||null}
function gameDone(g,r){const earn=Math.round(r.coins*(CFG.mult||1));ME.played++;if(r.win){ME.wins++;ME.prog[g.id]=Math.max(ME.prog[g.id]||0,r.stars||1)}addCoins(earn);saveMe();r.earned=earn;r.next=r.win?nextOf(g):null;return r}
function backToMenu(){if(VIEW)go(VIEW)}

/* --- savaş oyunları (Savaş Arenası 3D motoru, gömülü) --- */
let warGame=null;
function launchWar(id,g){warGame=g;const three=$('#three-js').textContent,cfg={auto:id};
 const html=WAR_SRC.replace('<!--THREE-->',()=>'<script>'+three+'<\/script><script>window.__JRK='+JSON.stringify(cfg)+'<\/script>');
 const f=$('#warFrame');f.srcdoc=html;$('#warWrap').classList.add('on');document.body.classList.add('playing')}
function closeWar(){$('#warWrap').classList.remove('on');$('#warFrame').srcdoc='';document.body.classList.remove('playing');warGame=null;backToMenu()}
addEventListener('message',e=>{const d=e.data;if(!d||!d.jrk)return;if(e.source!==$('#warFrame').contentWindow&&e.source!==$('#upFrame')?.contentWindow)return;
 if(d.jrk==='earn'&&warGame&&ME){const n=Math.max(0,Math.min(+d.n||0,20000));gameDone(warGame,{win:!!d.win,stars:d.win?3:0,coins:n});toast('🪙 +'+fmt(Math.round(n*(CFG.mult||1)))+' altın')}
 if(d.jrk==='exit')closeWar()});
function launchUpload(u){const w=$('#warWrap'),f=$('#warFrame');if(u.url)f.removeAttribute('srcdoc'),f.src=u.url;else{f.removeAttribute('src');f.srcdoc=u.html}
 w.classList.add('on');document.body.classList.add('playing');let x=w.querySelector('.x');if(!x){x=document.createElement('button');x.className='btn x';x.textContent='✕ Kapat';w.appendChild(x)}x.style.display='inline-flex';
 x.onclick=()=>{x.style.display='none';f.removeAttribute('src');closeWar()}}

/* --- yasal metinler --- */
const DOCS={privacy:['Gizlilik Politikası',`<p>Son güncelleme: 2026. JRK Games ("biz") gizliliğine önem verir.</p><h4>Topladığımız bilgiler</h4><ul><li>Kayıt olurken girdiğin ad ve e-posta adresi.</li><li>Oyun ilerlemen, altınların ve tercihlerin.</li></ul><h4>Bilgiler nerede saklanır?</h4><p>Tüm hesap bilgileri yalnızca senin cihazında (tarayıcı depolaması) saklanır. Şifren düz metin olarak değil, tek yönlü şifrelenmiş (SHA-256 + tuz) olarak tutulur. Bilgilerin sunucularımıza gönderilmez, üçüncü taraflarla paylaşılmaz, reklam için kullanılmaz.</p><h4>Çocukların gizliliği</h4><p>Çocuk bölümünde reklam, uygulama içi gerçek para ile satın alma ve sohbet yoktur. Oyun içi altınlar yalnızca oynayarak kazanılır.</p><h4>Hesap silme</h4><p>Profil → Hesabı sil ile hesabını ve tüm verilerini istediğin an silebilirsin.</p><h4>İletişim</h4><p>destek@jrkgames.com</p>`],
 terms:['Kullanım Şartları',`<ul><li>JRK Games'i ücretsiz olarak kişisel eğlence amacıyla kullanabilirsin.</li><li>13 yaşından küçükler hesabı bir ebeveyn gözetiminde açmalıdır.</li><li>Oyun içi altınların gerçek para değeri yoktur ve satılamaz.</li><li>Başkalarının hesaplarını izinsiz kullanmak yasaktır.</li><li>Savaş oyunları kurgusaldır; gerçek kişi, kurum veya olaylarla ilgisi yoktur.</li></ul>`],
 kids:['Ebeveyn Bilgilendirmesi',`<p>Çocuk bölümü 6–12 yaş için tasarlanmıştır ve çarpım tablosu pratiği üzerine kuruludur.</p><ul><li>Şiddet içeren oyunlar çocuk bölümünde gösterilmez.</li><li>Büyük bölümüne geçiş bir ebeveyn doğrulama sorusuyla korunur.</li><li>Reklam, sohbet ve gerçek para ile satın alma yoktur.</li><li>Ekran süresini sınırlamak için cihazınızın ebeveyn denetimlerini kullanabilirsiniz.</li></ul>`],
 contact:['İletişim',`<p>Soru, öneri ve destek için:</p><p><b>E-posta:</b> destek@jrkgames.com<br><b>Web:</b> jrkgames.com</p>`]};
function openDoc(k){const d=DOCS[k];$('#mbox').innerHTML=`<div class="doc"><h3>${d[0]}</h3>${d[1]}<div class="mrow" style="margin-top:16px"><button class="btn" id="dOk">Kapat</button></div></div>`;$('#modal').classList.add('on');$('#dOk').onclick=()=>$('#modal').classList.remove('on')}

/* --- yönetici paneli --- */
let ADM=false,ADMT='gen';
function openAdmin(){$('#adminScreen').classList.add('on');renderAdmin()}
$('#admClose').onclick=()=>{$('#adminScreen').classList.remove('on');if(ME){applySeg();if($('#appScreen').classList.contains('on'))go(VIEW)}};
function renderAdmin(){const A=$('#admIn');$('#admWho').textContent=ADM?'Yönetici oturumu açık':'';
 if(!ADM){A.innerHTML=`<div class="adm-login"><div class="panel"><div style="font-size:46px">🔐</div><h3 style="margin:8px 0 16px">Yönetici girişi</h3><input id="admPw" type="password" placeholder="Yönetici şifresi" autocomplete="off"><p class="err" id="admErr" style="margin-top:8px"></p><button class="btn block big" id="admGo">Giriş</button></div></div>`;
  const f=()=>{if($('#admPw').value===ADMIN_PASS){ADM=true;renderAdmin();toast('Yönetici paneline hoş geldin')}else $('#admErr').textContent='Şifre yanlış.'};$('#admGo').onclick=f;$('#admPw').onkeydown=e=>{if(e.key==='Enter')f()};setTimeout(()=>$('#admPw').focus(),50);return}
 const T=[['gen','📊 Genel'],['users','👥 Kullanıcılar'],['money','💰 Para gönder'],['shop','🏷️ Mağaza fiyatları'],['up','📦 Oyun yükle']];
 let h=`<div class="adm-tabs">${T.map(t=>`<button data-at2="${t[0]}" class="${ADMT===t[0]?'on':''}">${t[1]}</button>`).join('')}<span style="flex:1"></span><button class="ibtn" id="admOut">Yönetici çıkışı</button></div>`;
 const us=Object.values(USERS);
 if(ADMT==='gen'){h+=`<div class="stats"><div class="stat"><b>${us.length}</b><span>Kayıtlı kullanıcı</span></div><div class="stat"><b>${us.filter(u=>u.seg==='kid').length} / ${us.filter(u=>u.seg==='adult').length}</b><span>Çocuk / Büyük</span></div><div class="stat"><b>${fmt(us.reduce((a,u)=>a+u.played,0))}</b><span>Oynanan oyun</span></div><div class="stat"><b>🪙 ${fmt(us.reduce((a,u)=>a+u.coins,0))}</b><span>Toplam altın</span></div></div>
  <div class="cols"><div class="panel"><h3>📣 Duyuru</h3><p class="mut" style="margin-bottom:10px">Tüm kullanıcılara sitenin üstünde gösterilir. Boş bırakırsan gizlenir.</p><input id="anIn" type="text" maxlength="140" value="${esc(CFG.announce)}" placeholder="Örn. Hafta sonu çift altın!"><button class="btn" id="anSave" style="margin-top:10px">Kaydet</button></div>
  <div class="panel"><h3>✨ Ödül çarpanı</h3><p class="mut" style="margin-bottom:10px">Oyunlardan kazanılan altın bu sayıyla çarpılır (1 = normal).</p><input id="muIn" type="number" step="0.5" min="0" max="20" value="${CFG.mult}"><button class="btn" id="muSave" style="margin-top:10px">Kaydet</button></div>
  <div class="panel"><h3>🎮 Katalog</h3><p>Çocuk oyunları: <b>${GAMES.filter(g=>g.seg==='kid').length}</b><br>Büyük oyunları: <b>${GAMES.filter(g=>g.seg==='adult').length}</b><br>Yüklenen: <b>${ST.get('uploads',[]).length}</b></p></div></div>`}
 if(ADMT==='users'){h+=`<div class="panel"><div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap"><input id="uq" type="search" placeholder="Kullanıcı ara (ad veya e-posta)" style="max-width:340px"></div><div class="tw"><table class="t"><thead><tr><th>Kullanıcı</th><th>Bölüm</th><th>Altın</th><th>Oyun</th><th>Kayıt</th><th>İşlemler</th></tr></thead><tbody id="ub"></tbody></table></div>${us.length?'':'<p class="empty">Henüz kayıtlı kullanıcı yok.</p>'}</div>`}
 if(ADMT==='money'){h+=`<div class="cols"><div class="panel"><h3>💰 Altın gönder</h3><label class="f">Kime<select id="mnTo">${us.map(u=>`<option value="${esc(u.email)}" ${ME&&u.email===ME.email?'selected':''}>${esc(u.name)} (${esc(u.email)})${ME&&u.email===ME.email?' • kendim':''}</option>`).join('')}</select></label>
  <label class="f">Miktar<input id="mnAmt" type="number" min="1" placeholder="Örn. 5000"></label><div class="mrow" style="margin-bottom:12px">${[1000,10000,100000,1000000].map(v=>`<button class="ibtn" data-q="${v}">+${fmt(v)}</button>`).join('')}</div><button class="btn" id="mnGo" ${us.length?'':'disabled'}>Gönder</button>${us.length?'':'<p class="mut" style="margin-top:10px">Önce bir kullanıcı kayıt olmalı.</p>'}</div></div>`}
 if(ADMT==='shop'){h+=`<div class="panel"><div class="tw"><table class="t"><thead><tr><th></th><th>Ürün</th><th>Bölüm</th><th>Tür</th><th>Fiyat</th></tr></thead><tbody>${ITEMS.map(it=>`<tr><td style="font-size:22px">${it.icon}</td><td>${esc(it.name)}</td><td><span class="pill ${it.seg}">${it.seg==='kid'?'Çocuk':'Büyük'}</span></td><td>${it.type==='car'?'Araç':'Boya'}</td><td><input type="number" min="0" data-pr="${it.id}" value="${price(it)}"></td></tr>`).join('')}</tbody></table></div><button class="btn" id="prSave" style="margin-top:14px">Fiyatları kaydet</button> <button class="ibtn" id="prReset">Varsayılana dön</button></div>`}
 if(ADMT==='up'){const ups=ST.get('uploads',[]);h+=`<div class="cols"><div class="panel"><h3>📦 Oyun yükle</h3><div style="display:flex;gap:8px"><input id="upIc" type="text" placeholder="🕹️" style="max-width:70px"><input id="upNm" type="text" placeholder="Oyun adı"></div>
  <label class="f" style="margin-top:12px">Bölüm<select id="upSg"><option value="kid">Çocuk</option><option value="adult">Büyük</option></select></label><label class="f">HTML dosyası<input id="upFl" type="file" accept=".html,.htm"></label><label class="f">…veya oyun bağlantısı (https://)<input id="upUr" type="text" placeholder="https://"></label><button class="btn" id="upGo">Yükle</button></div>
  <div class="panel"><h3>Yüklenen oyunlar</h3>${ups.length?`<table class="t"><tbody>${ups.map(u=>`<tr><td>${esc(u.icon||'🕹️')} ${esc(u.name)}</td><td><span class="pill ${u.seg}">${u.seg==='kid'?'Çocuk':'Büyük'}</span></td><td><button class="ibtn r" data-delup="${u.id}">Sil</button></td></tr>`).join('')}</tbody></table>`:'<p class="mut">Henüz yüklenen oyun yok.</p>'}</div></div>`}
 A.innerHTML=h;
 $$('[data-at2]').forEach(b=>b.onclick=()=>{ADMT=b.dataset.at2;renderAdmin()});$('#admOut').onclick=()=>{ADM=false;renderAdmin()};
 if(ADMT==='gen'){$('#anSave').onclick=()=>{CFG.announce=$('#anIn').value.trim();saveCfg();toast('Duyuru kaydedildi')};$('#muSave').onclick=()=>{CFG.mult=Math.max(0,+$('#muIn').value||1);saveCfg();toast('Çarpan kaydedildi')}}
 if(ADMT==='users'){const draw=()=>{const q=($('#uq').value||'').toLocaleLowerCase('tr');$('#ub').innerHTML=us.filter(u=>(u.name+u.email).toLocaleLowerCase('tr').includes(q)).sort((a,b)=>b.created-a.created).map(u=>`<tr><td><b>${esc(u.name)}</b>${u.banned?' <span class="pill none">askıda</span>':''}<br><span class="mut" style="font-size:12px">${esc(u.email)}</span></td><td><span class="pill ${u.seg||'none'}">${u.seg==='kid'?'Çocuk':u.seg==='adult'?'Büyük':'Seçmedi'}</span></td><td>🪙 ${fmt(u.coins)}</td><td>${u.played}</td><td style="font-size:12px">${new Date(u.created).toLocaleDateString('tr-TR')}</td>
   <td><button class="ibtn" data-ua="add" data-u="${esc(u.email)}">+1000</button><button class="ibtn" data-ua="set" data-u="${esc(u.email)}">Altın ayarla</button><button class="ibtn" data-ua="pw" data-u="${esc(u.email)}">Şifre sıfırla</button><button class="ibtn" data-ua="seg" data-u="${esc(u.email)}">Bölüm değiştir</button><button class="ibtn" data-ua="ban" data-u="${esc(u.email)}">${u.banned?'Askıyı kaldır':'Askıya al'}</button><button class="ibtn r" data-ua="del" data-u="${esc(u.email)}">Sil</button></td></tr>`).join('')};
  draw();$('#uq').oninput=draw;
  $('#ub').onclick=async e=>{const b=e.target.closest('[data-ua]');if(!b)return;const u=USERS[b.dataset.u],a=b.dataset.ua;if(!u)return;
   if(a==='add')u.coins+=1000;
   if(a==='set'){const v=await dlg('Altın ayarla',u.name+' için yeni altın miktarı:',{input:String(u.coins),type:'number',yes:'Kaydet'});if(v===null)return;u.coins=Math.max(0,Math.floor(+v||0))}
   if(a==='pw'){const v=await dlg('Şifre sıfırla',u.name+' için yeni şifre (en az 6 karakter):',{input:'',type:'text',yes:'Kaydet'});if(!v)return;if(v.length<6){toast('Şifre çok kısa');return}u.salt=salt();u.hash=sha256(u.salt+v);toast('Şifre güncellendi')}
   if(a==='seg')u.seg=u.seg==='kid'?'adult':'kid';
   if(a==='ban')u.banned=!u.banned;
   if(a==='del'){if(!(await dlg('Kullanıcıyı sil',u.email+' kalıcı olarak silinsin mi?',{yes:'Sil'})))return;delete USERS[u.email];if(ME&&ME.email===u.email){saveUsers();$('#adminScreen').classList.remove('on');logout();return}}
   if(ME&&USERS[ME.email])ME=USERS[ME.email];saveUsers();updCoins();renderAdmin()}}
 if(ADMT==='money'){$$('[data-q]').forEach(b=>b.onclick=()=>{$('#mnAmt').value=(+$('#mnAmt').value||0)+ +b.dataset.q});
  const g=$('#mnGo');if(g)g.onclick=()=>{const u=USERS[$('#mnTo').value],n=Math.floor(+$('#mnAmt').value||0);if(!u||n<=0){toast('Geçerli bir miktar gir');return}u.coins+=n;if(ME&&u.email===ME.email)ME=u;saveUsers();updCoins();toast(fmt(n)+' altın '+u.name+' hesabına gönderildi');$('#mnAmt').value=''}}
 if(ADMT==='shop'){$('#prSave').onclick=()=>{$$('[data-pr]').forEach(i=>{CFG.prices[i.dataset.pr]=Math.max(0,Math.floor(+i.value||0))});saveCfg();toast('Fiyatlar kaydedildi')};$('#prReset').onclick=()=>{CFG.prices={};saveCfg();renderAdmin();toast('Varsayılan fiyatlar')}}
 if(ADMT==='up'){$('#upGo').onclick=async()=>{const nm=$('#upNm').value.trim();if(!nm){toast('Oyun adı gir');return}const f=$('#upFl').files[0],url=$('#upUr').value.trim();let html='';
   if(f){if(f.size>3e6){toast('Dosya çok büyük (en fazla 3 MB)');return}html=await f.text()}else if(!/^https:\/\//.test(url)){toast('HTML dosyası seç ya da https:// ile başlayan bağlantı gir');return}
   const ups=ST.get('uploads',[]);ups.push({id:Date.now().toString(36),name:nm,icon:$('#upIc').value.trim()||'🕹️',seg:$('#upSg').value,html,url:html?'':url});ST.set('uploads',ups);toast(nm+' yüklendi');renderAdmin()};
  $$('[data-delup]').forEach(b=>b.onclick=async()=>{if(!(await dlg('Oyunu sil','Bu oyun silinsin mi?',{yes:'Sil'})))return;ST.set('uploads',ST.get('uploads',[]).filter(u=>u.id!==b.dataset.delup));renderAdmin()})}}

/* --- açılış --- */
(function boot(){const em=ST.get('session',null)||sessionStorage.getItem('jrk_session');setTimeout(()=>$('#splash').classList.add('out'),600);
 if(em&&USERS[em]&&!USERS[em].banned){ME=USERS[em];enterApp()}else show('auth');
 if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{})})();
