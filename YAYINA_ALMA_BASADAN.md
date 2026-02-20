# Yazu — Sıfırdan yayına alma rehberi

Bu rehber, **Supabase, Vercel ve GitHub hesaplarınız açık** olduğu varsayılarak yazılmıştır. Adımları **sırayla** uygulayın.

---

## A. Hazırlık (bilgisayarınızda — bir kere)

### A1. Node.js

- https://nodejs.org → **LTS** indirip kurun.
- Terminal’de `node -v` yazın; sürüm çıkmalı.

### A2. Git yazar bilgisi (Vercel için gerekli)

Terminal’de (e‑postayı kendi GitHub e‑postanızla değiştirin):

```bash
git config --global user.name "Adınız Soyadınız"
git config --global user.email "github@email.com"
```

Böylece commit’ler doğru yazar ile atılır; Vercel “commit author is required” demez.

---

## B. Veritabanı (Supabase)

### B1. Yeni proje

- https://supabase.com → giriş → **New project**
- **Name:** Yazu  
- **Database password:** Güçlü bir şifre belirleyin, not alın.  
- **Region:** Size yakın (ör. Frankfurt)  
- **Create new project** → 1–2 dakika bekleyin.

### B2. DATABASE_URL alın

- Projede **Connect** (veya **Project Settings** → **Database**) → **URI** / **Connection string** kopyalayın.
- Metinde **PASSWORD** veya `[YOUR-PASSWORD]` geçen yeri, B1’de yazdığınız şifreyle değiştirin.
- Bu son metni saklayın; buna **DATABASE_URL** diyeceğiz.

---

## C. Projeyi GitHub’a atmak

### C1. GitHub’da repo oluşturun

- https://github.com → **+** → **New repository**
- **Repository name:** `yazu`
- **Public** veya **Private** (Private ise sonra Vercel’e bu repo erişimi vereceksiniz).
- **Create repository** (README eklemeden oluşturun).

### C2. Projeyi bu repoya bağlayıp push edin

Proje klasörünüzde Terminal açın (içinde `package.json` ve `src` olan yazu klasörü):

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu"

git init
git add .
git commit -m "Yazu ilk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/yazu.git
git push -u origin main
```

`KULLANICI_ADINIZ` yerine GitHub kullanıcı adınızı yazın.

**“Authentication failed” alırsanız:**  
GitHub artık şifre kabul etmiyor. **Personal Access Token** kullanın:  
GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token (classic)** → **repo** işaretleyin → token’ı kopyalayın.  
Push’ta **Password** istenince bu token’ı yapıştırın (hesap şifresi değil).

---

## D. Vercel’de proje ve ilk deploy

### D1. Vercel’e proje ekleyin

- https://vercel.com → giriş (GitHub ile)
- **Add New…** → **Project**
- **Import** kısmında **devyazu/yazu** (veya sizin repo adınız) → **Import**

### D2. Ortam değişkenleri (Environment Variables)

Aynı sayfada **Environment Variables** bölümüne girin. Şunları **tek tek** ekleyin:

| Name | Value |
|------|--------|
| `DATABASE_URL` | B2’de kaydettiğiniz tam adres (Supabase URI, şifre değiştirilmiş) |
| `NEXTAUTH_SECRET` | Uzun rastgele metin (örn. https://generate-secret.vercel.app/32 → Generate → kopyala) |
| `NEXTAUTH_URL` | İlk deploy için `https://yazu-xxxx.vercel.app` yazmayın; deploy bitince Vercel size adresi verir. O adresi buraya yazıp **Redeploy** edeceksiniz. Şimdilik boş bırakabilir veya `https://yazu.vercel.app` deneyin. |

**Deploy** butonuna basın.

### D3. Build’in bitmesini bekleyin

- **Deployments** sayfasında yeni satır **Building** → **Ready** olacak.
- **Ready** olunca **Visit** ile siteyi açın; Vercel’in verdiği adres (örn. `https://yazu-xxx.vercel.app`) görünecek.

### D4. NEXTAUTH_URL’i güncelleyin

- Vercel → **yazu** → **Settings** → **Environment Variables**
- `NEXTAUTH_URL` değerini, Visit’te gördüğünüz tam adres yapın (örn. `https://yazu-abc123.vercel.app`).
- **Deployments** → en son deploy → **⋯** → **Redeploy** (ayarın uygulanması için).

---

## E. Veritabanı tablolarını oluşturmak

Bilgisayarınızda proje klasöründe:

1. **.env** dosyası oluşturun (yoksa). İçine en az:

```env
DATABASE_URL="buraya_B2_deki_tam_adres"
NEXTAUTH_URL=https://yazu-xxx.vercel.app
NEXTAUTH_SECRET=buraya_vercel_icin_urettiginiz_secret
```

2. Terminal’de:

```bash
cd "/Users/engindemirci/Desktop/enhanced partners/yazu/yazu"
npm install
npm run db:push
npm run db:seed
```

Hata yoksa tablolar ve ilk planlar/araçlar oluşmuştur.

---

## F. Otomatik deploy çalışmıyorsa (Private repo vb.)

Push yaptığınızda **Deployments**’te yeni satır çıkmıyorsa:

- **Deployments** → **Create Deployment** (veya **Deploy**)
- **Commit or Branch Reference** kutusuna sadece **main** yazın (repo linki değil).
- **Create Deployment** → Build’in **Ready** olmasını bekleyin.

---

## G. Gemini (AI) — isteğe bağlı, sonra eklenebilir

- https://aistudio.google.com → **Get API key** / **Create API key** → anahtarı kopyalayın.
- Vercel → **yazu** → **Settings** → **Environment Variables** → **Add**  
  Name: `GEMINI_API_KEY`, Value: (yapıştır).
- **Deployments** → son deploy → **⋯** → **Redeploy**.

---

## H. Stripe (ödeme) — isteğe bağlı, sonra eklenebilir

- https://dashboard.stripe.com → **API Keys** → Publishable (pk_…) ve Secret (sk_…) kopyalayın.
- Vercel’de `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ve `STRIPE_SECRET_KEY` ekleyin.
- **Webhooks** → Add endpoint → URL: `https://SITENIZIN_ADRESI/api/stripe/webhook`  
  Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`  
  → Signing secret (whsec_…) → Vercel’de `STRIPE_WEBHOOK_SECRET` ekleyin.
- Stripe’da Growth/Scale için ürün ve fiyat oluşturun; Price ID’leri Supabase → **Plan** tablosunda ilgili satırlara yazın.
- **Redeploy** edin.

---

## I. Domain (yazu.digital)

- Vercel → **yazu** → **Settings** → **Domains** → **Add** → `yazu.digital`
- Vercel’in verdiği A / CNAME kayıtlarını, domain’i aldığınız yerde (SiteGround, GoDaddy vb.) DNS’e ekleyin.
- **Environment Variables**’da `NEXTAUTH_URL`’i `https://yazu.digital` yapın.
- **Redeploy** edin.
- Stripe webhook URL’ini `https://yazu.digital/api/stripe/webhook` yapın.

---

## J. İlk admin kullanıcı

- Sitede **Kayıt ol** ile bir hesap açın.
- Supabase → **Table Editor** → **User** → ilgili satırda **role** sütununu `admin` yapın.
- Siteden çıkış yapıp tekrar giriş yapın; sol menüde **Admin panel** görünür.

---

## Özet sıra (hesaplar hazır)

1. Git author ayarla (A2)  
2. Supabase: proje + DATABASE_URL (B1–B2)  
3. GitHub: repo oluştur, projeyi push et (C1–C2)  
4. Vercel: proje import, env (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL), Deploy (D1–D4)  
5. Bilgisayarda .env + db:push + db:seed (E)  
6. Gerekirse Create Deployment ile **main** (F)  
7. İsteğe bağlı: Gemini, Stripe (G–H)  
8. Domain + NEXTAUTH_URL güncelle (I)  
9. Kayıt ol → Supabase’te role = admin (J)  

Bu sırayla ilerlediğinizde site canlı olur; domain’i bağladıktan sonra yazu.digital’den erişirsiniz.
