# Yazu’yu yazu.digital’de yayına alma — En basit adımlar

**Deploy** = Projenizi internette açmak, yani siteyi canlı (live) hale getirmek.

Aşağıdaki adımları sırayla yapın. Her adımda “ne yapıyorum?” kısa açıklamayla yazıyor.

---

## Önce bilgisayarınızda (bir kere)

### 1. Node.js kurun

- Site: https://nodejs.org  
- “LTS” yazan yeşil butona tıklayıp indirin, kurun.  
- Kurulum bittikten sonra bilgisayarı kapatıp açmanız gerekmez; terminal/pencereyi kapatıp açmanız yeterli.

**Ne yapıyorum?** Projenin çalışması için gerekli yazılımı kuruyorum.

---

### 2. Projeyi çalıştırıp deneyin (isteğe bağlı)

- Proje klasörünü açın (yazu içinde olduğunuz klasör).  
- O klasörde bir “Terminal” veya “Komut İstemi” açın.  
- Sırayla yazın:

```text
npm install
```

Enter’a basın, işlem bitsin. Sonra:

```text
npm run dev
```

Enter’a basın. Tarayıcıda http://localhost:3000 açılınca siteyi görürsünüz.  
**Ne yapıyorum?** Projenin bilgisayarımda çalıştığını kontrol ediyorum.

---

## Veritabanı (kullanıcılar, planlar, araçlar burada tutulur)

### 3. Supabase’te ücretsiz hesap açın

- Site: https://supabase.com  
- “Start your project” → GitHub veya e-posta ile giriş yapın.

**Ne yapıyorum?** Kullanıcı ve plan bilgilerini saklayacak ücretsiz veritabanı alıyorum.

---

### 4. Yeni proje oluşturun

- Supabase’te “New project” deyin.  
- **Name:** Yazu (veya istediğiniz isim).  
- **Database password:** Güçlü bir şifre uydurun ve bir yere not edin (bu şifreyi bir daha unutmayın).  
- **Region:** Size yakın bir bölge seçin (ör. Frankfurt).  
- “Create new project” deyin, 1–2 dakika bekleyin.

**Ne yapıyorum?** Yazu’ya özel bir veritabanı kutusu oluşturuyorum.

---

### 5. Bağlantı adresini (DATABASE_URL) alın

**Yol 1 — Connect butonu (en kolay)**  
- Supabase’te projenize girin (dashboard’da projeyi seçin).  
- Sol tarafta veya ana sayfada **“Connect”** (veya **“Connect to your project”**) butonuna tıklayın.  
- Açılan pencerede **“URI”** veya **“Connection string”** sekmesini seçin.  
- Gösterilen adresi kopyalayın. Şöyle bir şey olur:

```text
postgresql://postgres.PROJE_ID:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

veya (Direct connection):

```text
postgresql://postgres:PASSWORD@db.xxxxxx.supabase.co:5432/postgres
```

- Bu metinde **PASSWORD** (veya `[YOUR-PASSWORD]`) yazan yeri, 4. adımda belirlediğiniz veritabanı şifresiyle değiştirin.  
- Son hali bir yere (Not Defteri vb.) yapıştırıp saklayın; buna **DATABASE_URL** diyeceğiz.

**Yol 2 — Project Settings üzerinden**  
- Sol alttan **Project Settings** (dişli ikonu) tıklayın.  
- Solda **“Database”** sekmesine girin.  
- Sayfada **“Connection string”** veya **“Connection info”** bölümünü bulun.  
- **“URI”** seçeneğini işaretleyip adresi kopyalayın; yukarıdaki gibi PASSWORD’u kendi şifrenizle değiştirin.

**Ne yapıyorum?** Projenin veritabanına nasıl bağlanacağını belirleyen adresi alıyorum.

---

## Siteyi internette barındırma (hosting) — Vercel

Sitenin 7/24 açık olması için **Vercel** kullanıyoruz. Next.js ile uyumlu; GitHub’a kodu atıp Vercel’e bağlayınca otomatik build alır ve yayına açar.

---

### 6. Vercel hesabı açın

- Site: https://vercel.com  
- **Sign Up** deyin. **GitHub** ile giriş yapın (GitHub hesabınız yoksa önce https://github.com üzerinden ücretsiz açın).

**Ne yapıyorum?** Sitenin yayınlanacağı platforma giriş yapıyorum.

---

### 7. Projeyi GitHub’a atın

- https://github.com → giriş yapın.  
- Sağ üst **“+”** → **New repository**.  
- **Repository name:** `yazu` (veya istediğiniz). **Public** veya **Private** seçebilirsiniz; Vercel her ikisiyle de çalışır (Private seçerseniz Vercel, GitHub’da erişim isteyecektir). **Create repository** deyin.  
- Açılan sayfada “push an existing repository” kısmındaki komutları kullanacaksınız.

**Bilgisayarınızda** (yazu proje klasöründe) **Terminal** açın (Spotlight’ta “Terminal” yazıp Enter).  

**Git kurulu mu kontrol edin:** `git --version` yazıp Enter. Sürüm numarası çıkarsa Git hazır. “command not found” derse Git kurun:  
- **Mac:** Uygulamalar → **Terminal** açın, şunu yazın: `xcode-select --install` → Enter. Açılan pencerede “Yükle” deyin (Xcode Command Line Tools ile birlikte Git gelir). Alternatif: https://brew.sh ile Homebrew kurduysanız `brew install git` yazabilirsiniz.  

Kurulumdan sonra aşağıdaki komutları **yazu proje klasöründe** sırayla çalıştırın:

```text
git init
git add .
git commit -m "Yazu ilk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/yazu.git
git push -u origin main
```

`KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın.

**“Authentication failed” alıyorsanız:** GitHub artık şifre ile push kabul etmiyor. İki yol var:

**Yol A — Personal Access Token (en hızlı)**  
1. GitHub’da sağ üst profil fotoğrafı → **Settings**.  
2. Sol menü en altta **Developer settings** → **Personal access tokens** → **Tokens (classic)**.  
3. **Generate new token (classic)**. Note: `yazu` yazın. Expiration: 90 days veya No expiration. **repo** kutusunu işaretleyin. **Generate token** deyin.  
4. Çıkan token’ı **bir kere** gösterilir; kopyalayıp güvenli bir yere kaydedin.  
5. Terminal’de tekrar `git push -u origin main` yazın. **Username** sorunca GitHub kullanıcı adınızı, **Password** sorunca **token’ı** (şifre değil) yapıştırın.  
6. (İsteğe bağlı) Mac’te şifreyi saklamak için: `git config --global credential.helper osxkeychain` — bir sonraki push’ta token’ı Keychain’e kaydeder.

**Yol B — SSH anahtarı**  
1. Terminal’de: `ssh-keygen -t ed25519 -C "email@ornek.com"` → Enter’a basın (dosya yolu ve passphrase boş kalabilir).  
2. `cat ~/.ssh/id_ed25519.pub` yazıp çıkan metni kopyalayın.  
3. GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** → başlık verin, anahtarı yapıştırın → **Add SSH key**.  
4. Remote’u HTTPS’ten SSH’a çevirin: `git remote set-url origin git@github.com:KULLANICI_ADINIZ/yazu.git`  
5. `git push -u origin main` — artık şifre sormaz.

(GitHub’da repo oluştururken “Add a README” seçtiyseniz önce `git pull origin main --allow-unrelated-histories` yapıp sonra push edin.)

**Ne yapıyorum?** Proje kodunu GitHub’a koyuyorum; Vercel buradan çekecek.

---

### 8. Vercel’de proje oluşturup yayına alın

- https://vercel.com → **Add New…** → **Project**.  
- **Import Git Repository** kısmında GitHub’daki **yazu** reposunu seçin → **Import**.  
- **Project Name** olduğu gibi `yazu` kalabilir.  
- **Environment Variables** bölümüne girin. Aşağıdaki değişkenleri **tek tek** ekleyin (Name + Value, sonra Add):

| Name | Value |
|------|--------|
| `DATABASE_URL` | 5. adımda kaydettiğiniz adres (Supabase’ten kopyaladığınız, PASSWORD’u değiştirdiğiniz tam satır) |
| `NEXTAUTH_URL` | Önce `https://yazu-xxxx.vercel.app` yazmayın; aşağıda açıklanıyor. İlk deploy için boş bırakabilir veya `https://yazu-dusuk.vercel.app` gibi tahmini bir adres yazın. Domain bağladıktan sonra bunu `https://yazu.digital` yapacaksınız. |
| `NEXTAUTH_SECRET` | Rastgele uzun bir metin (en az 32 karakter). Örn: https://generate-secret.vercel.app/32 → Generate → kopyalayıp yapıştırın. |
| `GEMINI_API_KEY` | (9. adımda alacaksınız; şimdilik boş bırakıp sonra Vercel → Settings → Environment Variables’dan ekleyip Redeploy edebilirsiniz.) |
| `STRIPE_SECRET_KEY` | (10. adımda; şimdilik boş bırakabilirsiniz, sonra ekleyip Redeploy.) |
| `STRIPE_WEBHOOK_SECRET` | (10. adımda webhook sonrası; sonra ekleyip Redeploy.) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (10. adımda; sonra ekleyip Redeploy.) |

**NEXTAUTH_URL için:** İlk deploy bitince Vercel size bir adres verir (örn. `https://yazu-abc123.vercel.app`). O adresi `NEXTAUTH_URL` olarak ekleyin veya güncelleyin, sonra **Redeploy** edin. Domain’i (yazu.digital) bağladıktan sonra `NEXTAUTH_URL` değerini `https://yazu.digital` yapıp tekrar Redeploy edin.

- **Deploy** butonuna basın. Birkaç dakika bekleyin; bitince **Visit** veya proje sayfasında sitenizin adresi görünür (örn. `https://yazu-xxxx.vercel.app`).

**Ne yapıyorum?** Projeyi Vercel’de yayına alıyorum; ayarları (şifreler, API anahtarları) burada güvenle tanımlıyorum.

---

## Gemini (AI) anahtarı

### 9. Gemini API anahtarı alın

- Site: https://aistudio.google.com  
- Google ile giriş yapın.  
- “Get API key” veya “API Keys” bölümüne girin.  
- “Create API key” deyin → proje seçin (veya yeni proje oluşturun) → anahtar oluşsun.  
- Anahtarı kopyalayın.  
- **Vercel’e ekleyin:** Vercel → projeniz (yazu) → **Settings** → **Environment Variables** → **Add** → Name: `GEMINI_API_KEY`, Value: (yapıştırdığınız anahtar) → Save.  
- Sonra **Deployments** sekmesine gidin → en son deploy’un sağındaki **⋯** → **Redeploy** (yeni ayarın uygulanması için).

**Ne yapıyorum?** AI özelliğinin çalışması için gerekli anahtarı alıp Vercel’e ekliyorum.

---

## Stripe (ödeme)

### 10. Stripe hesabı ve ayarlar

- Site: https://dashboard.stripe.com  
- Hesap açın / giriş yapın.  
- **API Keys:** Developers → API keys. **Publishable key** (pk_...) ve **Secret key** (sk_...) kopyalayın.  
- **Vercel’e ekleyin:** Vercel → yazu → Settings → Environment Variables → `STRIPE_SECRET_KEY` ve `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ekleyin.  
- **Webhook:** Developers → Webhooks → Add endpoint.  
  - **Endpoint URL:** Önce `https://yazu-xxxx.vercel.app/api/stripe/webhook` (Vercel’in verdiği adres); domain bağladıktan sonra `https://yazu.digital/api/stripe/webhook` yapın.  
  - **Events:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` seçin.  
  - Oluşturduktan sonra “Signing secret” (whsec_...) kopyalayın; Vercel’de `STRIPE_WEBHOOK_SECRET` olarak ekleyin.  
- **Ürün/Fiyat:** Stripe’da Products’tan Growth ve Scale için aylık/yıllık fiyat oluşturun; her fiyatın “Price ID” (price_...) değerini alın. Supabase → Table Editor → **Plan** tablosu → Growth ve Scale satırlarında `stripe_price_id_monthly` ve `stripe_price_id_yearly` sütunlarına bu price_... değerlerini yapıştırın.  
- Her env ekledikten sonra **Redeploy** edin.

**Ne yapıyorum?** Ödemelerin ve aboneliklerin çalışması için Stripe’ı bağlıyorum.

---

## Veritabanı tablolarını oluşturma (bir kere)

### 11. Projeyi veritabanına bağlayın (tabloları oluşturun)

Bu adımı **bilgisayarınızda** yapın; böylece Supabase veritabanında tablolar ve ilk planlar/araçlar oluşur.

- Bilgisayarınızda **yazu** proje klasörünü açın. İçinde **.env** dosyası olsun (yoksa oluşturun). İçine en az şunu yazın (DATABASE_URL’i 5. adımda aldığınız adresle değiştirin):

```env
DATABASE_URL="postgresql://postgres:SIFRENIZ@db.xxxxx.supabase.co:5432/postgres"
NEXTAUTH_URL=https://yazu.digital
NEXTAUTH_SECRET=buraya_32_karakter_rastgele_metin
```

(SIFRENIZ ve db.xxxxx kısmını 5. adımda kaydettiğiniz DATABASE_URL ile aynı yapın.)

- Aynı klasörde **Terminal** açıp sırayla:

```text
npm install
npm run db:push
npm run db:seed
```

- Hata almazsanız veritabanı hazır demektir (kullanıcılar, planlar, kategoriler, araçlar oluştu).

**Ne yapıyorum?** Veritabanında tabloları oluşturup ilk plan ve örnek araçları ekliyorum.

---

## Domain: yazu.digital’i Vercel’e bağlama

### 12. Domain’i Vercel’e ekleyin

- Vercel’de projenize girin (yazu) → **Settings** → **Domains**.  
- **Add** deyin, `yazu.digital` yazın, Enter.  
- İsterseniz `www.yazu.digital` de ekleyin.  
- Vercel size birkaç **kayıt bilgisi** verecek (A record veya CNAME). Bunları bir sonraki adımda domain sağlayıcınızda yapacaksınız.

**Ne yapıyorum?** yazu.digital adresinin Vercel’deki sitenize gitmesini sağlıyorum.

---

### 13. Domain sağlayıcınızda DNS ayarı

- yazu.digital’i aldığınız yere girin (SiteGround, GoDaddy, Getir, vb.).  
- “DNS ayarları” / “Domain yönetimi” / “Nameservers” bölümünü bulun.  
- Vercel’in söylediği kayıtları ekleyin. Genelde:  
  - **A record:** Name `@`, Value: `76.76.21.21` (Vercel’in verdiği IP).  
  - **CNAME:** Name `www`, Value: `cname.vercel-dns.com` (Vercel tam metni söyler).  
- Kaydedin. Birkaç dakika ile 48 saat içinde yazu.digital sitenize gider.

**Ne yapıyorum?** yazu.digital yazıldığında Vercel’deki sitenize yönlendiriyorum.

---

### 14. Her şeyi yazu.digital’e göre güncelleyin

- **Vercel → Environment Variables:** `NEXTAUTH_URL` değerini `https://yazu.digital` yapın (veya ekleyin).  
- **Stripe → Webhooks:** Webhook URL’ini `https://yazu.digital/api/stripe/webhook` yapın.  
- **Vercel:** Deployments → son deploy → **Redeploy** (ayarların uygulanması için).

---

## İlk admin kullanıcı

### 15. Kendinizi admin yapın

- Sitede https://yazu.digital (veya Vercel’in verdiği adres) üzerinden **Kayıt ol** ile bir hesap açın.  
- Supabase’e gidin → **Table Editor** → **User** tablosu.  
- Az önce oluşturduğunuz e-postayı bulun, **role** sütununu `user` yerine `admin` yapın, kaydedin.  
- Siteden çıkış yapıp tekrar giriş yapın; artık sol menüde “Admin panel” görünür.

**Ne yapıyorum?** Kendime admin yetkisi veriyorum; böylece kullanıcıları ve ayarları yönetebilirim.

---

## Özet: Vercel ile sıra

1. Node.js kur (bilgisayarında)  
2. (İsteğe bağlı) Bilgisayarda `npm install` + `npm run dev` ile dene  
3. Supabase hesabı aç, Yazu projesi oluştur, şifreyi not et  
4. DATABASE_URL’i al (PASSWORD’u değiştir), sakla  
5. ✅ Bağlantı adresini (DATABASE_URL) aldınız  
6. Vercel hesabı aç (GitHub ile)  
7. Projeyi GitHub’a at (git init, add, commit, remote, push)  
8. Vercel’de proje oluştur, Environment Variables ekle, Deploy  
9. Gemini API key al, Vercel’e ekle, Redeploy  
10. Stripe ayarla (API keys, webhook, ürün/fiyat), Vercel’e ekle, Plan tablosuna Price ID’leri yaz, Redeploy  
11. Bilgisayarda .env + `npm run db:push` + `npm run db:seed` (tabloları oluştur)  
12. Vercel’e domain ekle (yazu.digital)  
13. Domain sağlayıcıda DNS’i Vercel’e yönlendir  
14. NEXTAUTH_URL ve Stripe webhook’u yazu.digital yap, Redeploy  
15. Siteden kayıt ol, Supabase’te role = admin yap  

Bu adımlar bittiğinde siteniz **yazu.digital** adresinde Vercel üzerinde canlı (live) olur.
