# Yazu — Deploy Adımları (Vercel + GitHub + Supabase)

**Kural:** Her kod güncellemesinden sonra, o güncellemenin canlıya yansıması için aşağıdaki adımlar **sırayla** yazılmalı ve uygulanmalıdır. Asistan her güncelleme yanıtının sonunda bu deploy adımlarını tekrarlar.

---

Her deploy’da aşağıdaki adımları sırayla uygula.

---

## 1. Kodu GitHub’a gönder

Proje klasöründe terminalde:

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu"
git add .
git status
git commit -m "Kısa açıklama: ne değişti?"
git push
```

- `git status` ile sadece istediğin dosyaların eklendiğinden emin ol.
- Commit mesajı örnek: `Light tema, ana sayfa hero, plan/checkout akışı`

---

## 2. Vercel deploy’un bitmesini bekle

- **Vercel Dashboard** → **yazuv1** (veya kullandığın proje) → **Deployments**
- En üstteki deployment’ın durumu **Ready** olana kadar bekle (1–3 dakika).
- Hata varsa **Building** veya **Error** log’una bak.

---

## 3. Ortam değişkenleri (sadece ilk kurulumda veya değiştiyse)

- **Vercel** → Proje → **Settings** → **Environment Variables**
- Şunlar tanımlı olmalı:
  - `DATABASE_URL` (Supabase **pooler** URL, port **6543**, sonunda `?pgbouncer=true`)
  - `DIRECT_DATABASE_URL` (port **5432**, sadece db:push için; Vercel’de gerekmez)
  - `NEXTAUTH_URL` → `https://yazuv1.vercel.app` (veya yazu.digital)
  - `NEXTAUTH_SECRET`
  - İleride: `GEMINI_API_KEY`, Stripe key’leri

Değişiklik yaptıysan **Redeploy** et.

---

## 4. Veritabanı (şema veya seed değiştiyse)

Sadece **Prisma şeması** veya **seed** güncellediysen, kendi bilgisayarında:

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu"
npm run db:push
node prisma/seed.js
```

- `db:push`: Tabloları/şemayı Supabase’e uygular.
- `seed.js`: Varsayılan planlar, kategoriler, toollar, admin kullanıcısı (varsa) ekler/günceller.

---

## 5. Canlıyı test et

- Site: **https://yazuv1.vercel.app** (veya kendi domain’in)
- Kontrol listesi:
  - [ ] Ana sayfa açılıyor mu?
  - [ ] Giriş / Kayıt çalışıyor mu?
  - [ ] Dashboard ve araçlar açılıyor mu?
  - [ ] Yeni eklediğin özellik beklendiği gibi çalışıyor mu?

---

## 6. Domain: yazu.digital’e geçiş

Siteyi **yazu.digital** adresinde yayına almak için:

### 6.1 Domain’i Vercel’e ekle

1. **Vercel Dashboard** → projeniz → **Settings** → **Domains**.
2. **Add** veya **Add domain** → `yazu.digital` yazın (www’siz).
3. İsterseniz `www.yazu.digital` de ekleyin; Vercel genelde otomatik yönlendirme önerir (www → ana domain).

### 6.2 DNS ayarlarını yap

Domain’i **nereden aldıysanız** (GoDaddy, Namecheap, Cloudflare, Getir, vs.) o panelde **DNS** bölümüne girin. Vercel, Domains sayfasında size ne eklemeniz gerektiğini gösterir:

- **A kaydı:**  
  - Name: `@` (veya `yazu.digital`)  
  - Value: `76.76.21.21` (Vercel’in IP’si; ekranda yazanı kullanın.)
- **CNAME (www için):**  
  - Name: `www`  
  - Value: `cname.vercel-dns.com`

(Vercel bazen **CNAME** ile `@` için de `cname.vercel-dns.com` önerir; ekrandaki talimatı takip edin.)

Kayıtları kaydettikten sonra **yayılması 5 dakika – 48 saat** sürebilir; genelde birkaç saat içinde çalışır.

### 6.3 NEXTAUTH_URL’i güncelle

1. **Vercel** → **Settings** → **Environment Variables**.
2. `NEXTAUTH_URL` değişkenini bulun (yoksa ekleyin).
3. Değeri **`https://yazu.digital`** yapın. **Save**.
4. **Deployments** → son deploy → **⋯** → **Redeploy**. (Yeni domain ve yeni URL’in kullanılması için gerekli.)

### 6.4 Stripe kullanıyorsanız

- **Stripe Dashboard** → **Developers** → **Webhooks** → ilgili webhook’un **Endpoint URL**’ini `https://yazu.digital/api/stripe/webhook` yapın.
- Stripe’da **Settings** → **Customer portal** veya checkout callback adresleri varsa `https://yazu.digital` ile güncelleyin.

### 6.5 Kontrol

- Tarayıcıda **https://yazu.digital** açın; site gelmeli.
- Giriş / çıkış ve doğrulama maillerindeki linkler `https://yazu.digital` ile açılmalı.

---

## Özet (her deploy’da)

| Adım | Ne zaman? |
|------|-----------|
| 1. `git add` → `commit` → `push` | Her kod değişikliğinde |
| 2. Vercel’de Ready bekle | Push sonrası her zaman |
| 3. Env değişkenleri | Sadece ilk kez veya değişince |
| 4. `db:push` / `seed` | Şema veya seed değişince |
| 5. Canlıda test | Her deploy sonrası |
| 6. Domain (yazu.digital) | İlk kez domain bağlarken; sonra sadece güncelleme gerekirse |
