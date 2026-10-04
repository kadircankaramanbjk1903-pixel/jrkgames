#!/usr/bin/env python3
"""JRK Games derleyici: app/src/* + Savaş Arenası (../index.html) -> app/index.html (tek dosya)."""
import json, os, re, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
read = lambda p: open(p, encoding='utf-8').read()

war = read(os.path.join(ROOT, '..', 'index.html'))
m = re.search(r'<script>/\* three\.js r128[^\n]*\n(.*?)\n</script>', war, re.S)
assert m, 'three.js bulunamadı'
three = m.group(1)
war_src = war[:m.start()] + '<!--THREE-->' + war[m.end():]
pm = re.search(r'<script>(/\* PeerJS[^\n]*?\*/.*?)</script>', war, re.S)
assert pm, 'PeerJS bulunamadı'
peerjs = pm.group(1)

# Savaş oyunlarının listesini eski sitenin katalog kodundan çıkar
cat = war[war.index('/* ===== Oyun kataloğu'):war.index('/* ===== Sayfalar')]
camp = re.search(r'const CAMP=\[.*?\]\];', war, re.S).group(0)
js = cat + camp + r"""
const out=GAMES.map(g=>({id:g.id,name:g.name,mode:g.mode.name,icon:g.mode.icon,obj:g.obj.n,desc:g.obj.d,camp:g.ok==='story'?1:0}));
CAMP.forEach((c,i)=>out.push({id:'k'+(i+1),name:'Kara Akrep Savaşı '+(i+1)+': '+c[3],mode:'Hikâye',icon:'🦂',obj:'Bölüm '+(i+1)+'/20',desc:c[5],camp:1}));
process.stdout.write(JSON.stringify(out));"""
war_list = json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)
assert len(war_list) == 122, len(war_list)

def js_str(s):
    return json.dumps(s, ensure_ascii=False).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')

head = '''<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>JRK Games: Çocuk ve Büyük Oyunları</title>
<meta name="description" content="1000 oyun: çocuklar için çarpım tablosu sürüş oyunları, büyükler için gerçekçi araba yarışları ve savaş oyunları.">
<meta name="theme-color" content="#0b0d12">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Inter:wght@400;600;700;800&family=Nunito:wght@400;700;800&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
<style>
'''
html = (head + read(os.path.join(SRC, 'style.css')) + '</style>\n</head>\n<body>\n' + read(os.path.join(SRC, 'body.html')) +
        '\n<script>' + peerjs + '</script>\n<script id="three-js">/* three.js r128 — MIT License — https://threejs.org */\n' + three + '\n</script>\n<script>\n' +
        read(os.path.join(SRC, 'core.js')) + '\n' + read(os.path.join(SRC, 'lib.js')) + '\n' + read(os.path.join(SRC, 'drive.js')) + '\n' +
        'const WAR_SRC=' + js_str(war_src) + ';\nconst WAR_LIST=' + js_str(war_list) + ';\n' +
        read(os.path.join(SRC, 'online.js')) + '\n' + read(os.path.join(SRC, 'app.js')) + '\n</script>\n</body>\n</html>\n')
assert '</script' not in three
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(html)
print('app/index.html', round(len(html.encode()) / 1024), 'KB')
