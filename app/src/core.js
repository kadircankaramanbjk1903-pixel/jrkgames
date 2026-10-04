/* depolama (her şeyden önce yüklenir) */
const ST={get(k,d){try{const v=localStorage.getItem('jrk_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('jrk_'+k,JSON.stringify(v))}catch(e){typeof toast==='function'&&toast('Depolama dolu')}},del(k){try{localStorage.removeItem('jrk_'+k)}catch(e){}}};
const DB={get:(k,d)=>ST.get(k,d),set:(k,v)=>ST.set(k,v)};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.floor(n).toLocaleString('tr-TR');
const TOUCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;if(TOUCH)document.body.classList.add('touchdev');
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;$('#toasts').appendChild(d);setTimeout(()=>d.remove(),2800)}
function dlg(title,text,{input=null,yes='Tamam',no='Vazgeç',type='text'}={}){return new Promise(res=>{const I=$('#dlgI');$('#dlgT').textContent=title;$('#dlgP').textContent=text;I.hidden=input===null;I.type=type;I.value=input||'';
 $('#dlgYes').textContent=yes;$('#dlgNo').textContent=no;$('#dlgNo').hidden=!no;$('#dlg').classList.add('on');setTimeout(()=>(input!==null?I:$('#dlgYes')).focus(),30);
 const done=v=>{$('#dlg').classList.remove('on');$('#dlgYes').onclick=$('#dlgNo').onclick=I.onkeydown=null;res(v)};
 $('#dlgYes').onclick=()=>done(input!==null?I.value:true);$('#dlgNo').onclick=()=>done(input!==null?null:false);I.onkeydown=e=>{if(e.key==='Enter')$('#dlgYes').click()}})}

