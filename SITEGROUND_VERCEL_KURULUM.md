# SiteGround (WordPress) + Vercel (Next.js /app) birlikte çalıştırma

**Hedef:**  
- **yazu.digital** → SiteGround’da WordPress (ana sayfa, blog, SEO).  
- **yazu.digital/app** → Vercel’de çalışan Next.js uygulaması (giriş, dashboard, araçlar).

Tarayıcıda tek domain görünecek; `/app` ve altı Vercel’e proxy ile gidecek.

---

## Genel akış

1. Ziyaretçi **yazu.digital** veya **yazu.digital/blog** → SiteGround (WordPress).
2. Ziyaretçi **yazu.digital/app** veya **yazu.digital/app/dashboard** → İstek SiteGround’a gelir, SiteGround bunu **Vercel**’e yönlendirir (reverse proxy), cevap yine yazu.digital üzerinden döner.

DNS’te domain’in A kaydı **SiteGround**’a bakıyor olmalı (şu an öyle olduğunu varsayıyoruz).

---

## Adım 1: Vercel tarafı (Next.js zaten hazır)

Kodda `basePath: "/app"` ve gerekli redirect’ler ayarlandı. Sizin yapacaklarınız:

### 1.1 Vercel Environment Variable

1. **Vercel** → Projeniz → **Settings** → **Environment Variables**
2. **NEXTAUTH_URL** değişkenini bulun (yoksa ekleyin).
3. Değeri tam olarak şu yapın: **`https://yazu.digital/app`**
4. **Save**

### 1.2 Vercel deployment URL’inizi not edin

- **Vercel** → Projeniz → **Settings** → **Domains** veya **Deployments**  
- Production deployment adresi şuna benzer: **`https://yazuv1.vercel.app`** (sizde farklı olabilir; kendi proje adınızı kullanın).

Bu adresi aşağıda “Vercel adresi” diye kullanacağız.

### 1.3 Deploy

- **Deployments** → son deploy → **⋯** → **Redeploy**  
- Böylece uygulama `/app` base path ile çalışır.  
- Test: **https://YOUR-PROJECT.vercel.app/app** açılmalı (örn. https://yazuv1.vercel.app/app).

---

## Adım 2: SiteGround’da reverse proxy (/app → Vercel)

SiteGround’da **yazu.digital** için gelen isteklerden **/app** ile başlayanları Vercel’e yollamamız gerekiyor. Bunu Apache **reverse proxy** ile yapıyoruz.

### 2.1 Gerekli modüller

Apache’de şunlar açık olmalı: **mod_proxy**, **mod_proxy_http**, **mod_proxy_ssl**, **mod_headers**.  
SiteGround’da genelde açıktır; açık değilse destek ile açtırabilirsiniz.

### 2.2 Nerede yazacağınız?

- **Seçenek A:** SiteGround **Site Tools** içinde “Apache Configuration” / “.htaccess” veya “Custom Configuration” varsa orada.
- **Seçenek B:** FTP/Dosya Yöneticisi ile WordPress kurulu alanın **kök dizinindeki** `.htaccess` (genelde `public_html`).
- **Seçenek C:** Proxy’yi .htaccess’e yazamıyorsanız (bazı hostlar .htaccess’te ProxyPass’e izin vermez), SiteGround destek talebi açıp: “yazu.digital için /app ve /app/* path’lerini şu URL’e reverse proxy ile yönlendirmek istiyorum: https://YOUR-PROJECT.vercel.app” deyin; size uygun config’i yazabilirler.

Aşağıdaki kuralları **WordPress’in .htaccess’inin en üstüne** ekleyin (WordPress’in kendi kurallarının **üzerine**).  
**YOUR-PROJECT.vercel.app** kısmını kendi Vercel adresinizle değiştirin (örn. `yazuv1.vercel.app`).

### 2.3 Apache kuralları (ProxyPass)

Eğer sunucu **.htaccess** içinde `ProxyPass` kullanımına izin veriyorsa (SiteGround’da bazen özeldir, deneyerek veya destekle kontrol edin):

```apache
# /app ve altını Vercel'e yönlendir (Next.js uygulaması)
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/app [OR]
RewriteCond %{REQUEST_URI} ^/app/
RewriteRule ^(.*)$ https://YOUR-PROJECT.vercel.app/$1 [P,L]
```

`[P]` flag’i için `mod_proxy` ve `mod_rewrite` gerekir.  
**YOUR-PROJECT.vercel.app** yerine kendi Vercel domain’inizi yazın (örn. `yazuv1.vercel.app`).

Eğer **doğrudan ProxyPass** kullanabiliyorsanız (genelde vhost / main config’te, .htaccess’te her zaman olmayabilir):

```apache
ProxyPreserveHost On
ProxyPass /app https://YOUR-PROJECT.vercel.app/app
ProxyPassReverse /app https://YOUR-PROJECT.vercel.app/app
```

Yine **YOUR-PROJECT.vercel.app** kısmını kendi adresinizle değiştirin.

### 2.4 SSL (HTTPS)

Site zaten **https://yazu.digital** ise, proxy’ye giden istek de HTTPS olmalı (yukarıdaki `https://...vercel.app` kullanıldı). Ekstra bir şey yapmanız gerekmez.

### 2.5 Kaydettikten sonra

- .htaccess / config’i kaydedin.  
- Tarayıcıda **https://yazu.digital/app** açın.  
- WordPress’in ana sayfası değil, Next.js uygulamanız (giriş/dashboard arayüzü) gelmeli.

---

## Adım 3: Kontrol listesi

| Ne | Nerede | Durum |
|----|--------|--------|
| Domain A kaydı | DNS (SiteGround / domain sağlayıcı) | yazu.digital → SiteGround IP |
| WordPress | SiteGround (yazu.digital) | Ana sayfa, blog, sayfalar burada |
| NEXTAUTH_URL | Vercel → Environment Variables | `https://yazu.digital/app` |
| basePath | next.config.js (kodda) | `/app` (zaten ayarlı) |
| Reverse proxy | SiteGround .htaccess veya Apache config | /app → Vercel |
| Test | https://yazu.digital/app | Giriş/dashboard açılıyor mu? |

---

## Sık karşılaşılan durumlar

- **yazu.digital/app açılmıyor, WordPress 404 veriyor**  
  Proxy kuralları çalışmıyor veya yanlış yazılmış. .htaccess’in doğru sitede (yazu.digital’in kökü) olduğundan ve Vercel adresinin doğru olduğundan emin olun. Gerekirse SiteGround destek: “/app path’ini şu Vercel URL’ine proxy etmek istiyorum” deyin.

- **yazu.digital/app açılıyor ama CSS/JS kırık**  
  Next.js tarafında basePath: "/app" olduğu sürece asset’ler /app/_next/... altında gelir; proxy doğruysa kırık olmaz. Vercel’de Redeploy yaptığınızdan ve NEXTAUTH_URL’in `https://yazu.digital/app` olduğundan emin olun.

- **Giriş / callback çalışmıyor**  
  NEXTAUTH_URL mutlaka **https://yazu.digital/app** olmalı (sonunda slash yok). Sonra Redeploy.

- **Stripe / webhook**  
  Stripe Dashboard’da Webhook URL’i: **https://yazu.digital/app/api/stripe/webhook** olmalı.

---

## Özet

1. **Vercel:** NEXTAUTH_URL = `https://yazu.digital/app` → Redeploy.  
2. **SiteGround:** /app (ve /app/*) isteklerini Vercel deployment URL’inize reverse proxy ile yönlendirin (yukarıdaki Apache / .htaccess kuralları).  
3. **Test:** yazu.digital → WordPress, yazu.digital/app → Next.js uygulaması.

Bu adımlarla WordPress içerik ve SEO için ana sitede, uygulama ise yazu.digital/app altında Vercel’de çalışmaya devam eder.
