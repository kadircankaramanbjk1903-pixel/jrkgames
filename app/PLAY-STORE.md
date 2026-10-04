# JRK Games: Google Play'e yükleme rehberi

Bu klasör (`app/`) Play Store'a hazır bir **PWA**'dır (Progressive Web App). Google Play'e
web uygulamaları **TWA (Trusted Web Activity)** paketi olarak yüklenir. Adımlar:

## 1. Siteyi HTTPS ile yayınla
1. Bu dalı ana dala (main) birleştir.
2. GitHub → Settings → Pages: kaynak olarak ana dalı seç. `CNAME` zaten `jrkgames.com`.
3. Uygulama şu adreste açılmalı: **https://jrkgames.com/app/**
4. Telefonda Chrome ile aç, menüden "Ana ekrana ekle" ile çalıştığını gör.

## 2. Android paketini oluştur (ücretsiz)
1. https://www.pwabuilder.com adresine git, `https://jrkgames.com/app/` adresini yaz.
2. **Package for stores → Android → Google Play** seç.
3. Paket adı örn. `com.jrkgames.app`. **Signing key**: "Create new" seç ve verilen
   anahtar dosyasını (`.keystore`) ve şifresini **çok iyi sakla**. Kaybedersen uygulamayı güncelleyemezsin.
4. İndirilen zip içinde `app-release.aab` ve `assetlinks.json` olacak.

## 3. assetlinks.json dosyasını yayınla
- Dosyayı depoda `/.well-known/assetlinks.json` yoluna koy (sitenin köküne).
- GitHub Pages nokta ile başlayan klasörleri yayınlamaz; kök dizine boş bir **`.nojekyll`** dosyası ekle.
- https://jrkgames.com/.well-known/assetlinks.json adresinin açıldığını kontrol et
  (bu olmadan uygulamanın üstünde adres çubuğu görünür).

## 4. Google Play Console
1. https://play.google.com/console → geliştirici hesabı (tek seferlik 25 $).
2. **Uygulama oluştur** → `app-release.aab` dosyasını yükle (önce "Dahili test" kanalı önerilir).
3. Mağaza girişi:
   - Simge: `icons/icon-512.png`
   - Öne çıkan görsel: `store/feature-graphic-1024x500.png`
   - Ekran görüntüleri: telefonda oyundan en az 2 ekran görüntüsü al.
4. **Gizlilik politikası URL'si:** https://jrkgames.com/app/gizlilik.html
5. **Veri güvenliği formu:** hesap bilgileri cihazdan dışarı gönderilmiyor, bu yüzden "veri toplanmıyor" seçilebilir.
   Uygulama içinde hesap silme seçeneği var (Profil → Hesabımı sil).
6. **İçerik derecelendirmesi** anketini doldur: büyük bölümünde kurgusal savaş/şiddet var.

## ⚠️ Önemli: Çocuk + savaş oyunu aynı uygulamada
Hedef kitleye çocukları (13 yaş altı) eklersen Google'ın **Aileler (Families) politikası**
uygulanır. Şiddet içeren savaş oyunları bu politikayla sorun çıkarabilir.
Uygulamada yaş seçimi ve ebeveyn doğrulaması var, ama yine de reddedilme riski vardır.
En güvenli yol: **iki ayrı uygulama** yayınlamak (çocuk uygulaması ve yetişkin uygulaması).
İstersen bu klasörden iki ayrı sürüm üretebilirim.

## Bilmen gerekenler
- Hesaplar cihazda saklanır. Aynı hesapla başka cihazdan giriş için sunucu (örn. Firebase) gerekir.
- `destek@jrkgames.com` adresi örnek olarak yazıldı; gerçek e-posta adresinle değiştir
  (`app/src/app.js` ve `app/gizlilik.html`).
- Kodda değişiklik yaptıktan sonra `python3 app/build.py` çalıştır ve `app/sw.js` içindeki
  `CACHE='jrk-v1'` sürümünü artır (`jrk-v2` gibi), böylece kullanıcılar yeni sürümü alır.
