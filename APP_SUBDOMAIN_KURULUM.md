# app.yazu.digital — Subdomain ile uygulama (Vercel)

**Yapı:**
- **yazu.digital** → SiteGround (WordPress, ana site, SEO)
- **app.yazu.digital** → Vercel (Next.js uygulaması: giriş, dashboard, araçlar)

Reverse proxy yok; subdomain doğrudan Vercel’e gider.

---

## 1. DNS: app.yazu.digital’i Vercel’e yönlendir

Domain’i yönettiğiniz yerde (SiteGround Domain Manager, Cloudflare, vs.):

**Önce:** `app` subdomain’i için **zaten bir kayıt varsa** (A, AAAA veya eski CNAME), onu **silin**. Aynı host için hem A hem CNAME olamaz; “You cannot create a CNAME record for a hostname that already has a DNS record” hatası bu yüzden çıkar.

**Sonra** CNAME ekleyin:

| Tip   | Name / Host | Value / Hedef |
|-------|-------------|----------------|
| CNAME | `app`       | Vercel’in verdiği adres (aşağıya bakın) |

- **Name:** `app` (bazı panellerde `app.yazu.digital` veya sadece `app`)
- **Value:** Vercel → Domains → app.yazu.digital sayfasında yazan **Value** (örn. `cname.vercel-dns.com` veya `fd6b4978586641a0.vercel-dns-017.com` gibi). Vercel’de ne yazıyorsa onu kopyalayın.

Kaydedin. Yayılması birkaç dakika ile birkaç saat sürebilir.

---

## 2. Vercel’e domain ekle

1. **Vercel** → Projeniz → **Settings** → **Domains**
2. **Add** → `app.yazu.digital` yazın → **Add**
3. Vercel, DNS’i kontrol eder; CNAME doğruysa kısa sürede **Verified** olur.

---

## 3. Vercel ortam değişkeni

1. **Settings** → **Environment Variables**
2. **NEXTAUTH_URL** değerini **`https://app.yazu.digital`** yapın (sonunda slash yok). Kaydedin.

---

## 4. Redeploy

**Deployments** → son deploy → **⋯** → **Redeploy**. Bittikten sonra **https://app.yazu.digital** çalışır.

---

## 5. SiteGround .htaccess (proxy’yi kaldırın)

Daha önce **/app** için reverse proxy eklediyseniz, o bloğu kaldırın. Dosyada şunlar kalsın:

- SGS XMLRPC blok
- # BEGIN WordPress … # END WordPress
- SGO Unset Vary

Şu blok **silinsin**:

```apache
# /app ve altını Vercel'e yönlendir ...
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteCond %{REQUEST_URI} ^/app ...
	RewriteRule ...
</IfModule>
```

---

## 6. Diğer ayarlar

- **Stripe webhook:** Dashboard’da endpoint URL = **https://app.yazu.digital/api/stripe/webhook**
- **E-posta doğrulama linkleri:** NEXTAUTH_URL sayesinde otomatik **https://app.yazu.digital/...** olur.
- **WordPress’te “Uygulamaya git”:** Buton/link adresi **https://app.yazu.digital** olsun.

---

## Özet

| Adım | Ne yapılır |
|------|------------|
| 1 | DNS: CNAME `app` → `cname.vercel-dns.com` |
| 2 | Vercel Domains’e `app.yazu.digital` ekle |
| 3 | NEXTAUTH_URL = `https://app.yazu.digital` |
| 4 | Redeploy |
| 5 | .htaccess’ten /app proxy bloğunu sil |
| 6 | Stripe / e-posta ayarlarını app.yazu.digital ile güncelle |

Bu adımlarla uygulama **app.yazu.digital** adresinde çalışır; ana site **yazu.digital** WordPress’te kalır.
