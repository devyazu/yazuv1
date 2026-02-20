# Yazu — Deploy Adımları (Vercel + GitHub + Supabase)

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

## Özet (her deploy’da)

| Adım | Ne zaman? |
|------|-----------|
| 1. `git add` → `commit` → `push` | Her kod değişikliğinde |
| 2. Vercel’de Ready bekle | Push sonrası her zaman |
| 3. Env değişkenleri | Sadece ilk kez veya değişince |
| 4. `db:push` / `seed` | Şema veya seed değişince |
| 5. Canlıda test | Her deploy sonrası |

---

**Domain:** yazu.digital kullanacaksan Vercel’de domain ekleyip `NEXTAUTH_URL` ve Stripe callback URL’lerini buna göre güncelle.
