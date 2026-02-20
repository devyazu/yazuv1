# E-posta (SMTP) kurulumu — Maillerin çalışması için yapılacaklar

Bu rehber, yazu uygulamasında **hesap doğrulama** ve diğer maillerin gönderilmesi için gerekli ortam değişkenlerinin nasıl ekleneceğini adım adım anlatır.

---

## 1. Neden SMTP gerekli?

Uygulama, doğrulama linki içeren e-postaları **SMTP** (e-posta sunucusu) üzerinden gönderir. SMTP ayarları verilmezse mailler hiç gönderilmez; kullanıcı “Doğrulama linki gönder” dediğinde sadece sayfada link gösterilir.

---

## 2. SMTP bilgilerini nereden alacaksınız?

Aşağıdaki seçeneklerden **birini** kullanmanız yeterli.

### Seçenek A: Kendi e-posta sunucunuz (örn. mail.yazu.digital)

- Hosting / sunucu sağlayıcınızda **e-posta hesabı** (örn. `noreply@yazu.digital`) açın.
- Panelden **SMTP sunucu adresi**, **port** (genelde 465 veya 587), **kullanıcı adı** (e-posta) ve **şifre** bilgilerini alın.
- Bu değerleri aşağıdaki “Vercel’de değişken ekleme” adımlarında kullanın.

### Seçenek B: Resend (önerilen, ücretsiz kotası var)

1. [resend.com](https://resend.com) → hesap açın.
2. **API Keys** → **Create API Key** ile bir key oluşturun.
3. **Domains** kısmında `yazu.digital` (veya kullandığınız domain) ekleyip DNS kayıtlarını tanımlayın (rehberdeki TXT / MX kayıtları).
4. Resend SMTP bilgileri:
   - **SMTP Host:** `smtp.resend.com`
   - **Port:** `465` (veya `587`)
   - **User:** `resend`
   - **Password:** Oluşturduğunuz **API Key** (örn. `re_xxxx...`)

Bu dört bilgiyi aşağıdaki `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` olarak gireceksiniz. Gönderen adres için domain doğrulaması gerekir (örn. `noreply@yazu.digital`).

### Seçenek C: SendGrid

1. [sendgrid.com](https://sendgrid.com) → hesap açın.
2. **Settings** → **API Keys** ile bir key oluşturun.
3. SMTP bilgileri: **Settings** → **Sender Authentication** / **SMTP** bölümünde yazar.
   - Genelde: Host `smtp.sendgrid.net`, Port `587`, User `apikey`, Password = API key.

### Seçenek D: Gmail (sadece test için)

- Google Hesap → **Güvenlik** → **2 adımlı doğrulama** açın.
- **Uygulama şifreleri** ile “Posta” için bir şifre oluşturun.
- SMTP: Host `smtp.gmail.com`, Port `587`, User = Gmail adresiniz, Password = uygulama şifresi.

---

## 3. Hangi ortam değişkenleri gerekli?

| Değişken      | Zorunlu | Açıklama |
|---------------|--------|----------|
| `SMTP_HOST`   | Evet   | SMTP sunucu adresi (örn. `smtp.resend.com`, `mail.yazu.digital`) |
| `SMTP_PORT`   | Evet   | Port; genelde `465` (SSL) veya `587` (STARTTLS) |
| `SMTP_USER`   | Evet   | SMTP kullanıcı adı (çoğu zaman e-posta adresi) |
| `SMTP_PASS`   | Evet   | SMTP şifresi veya API key |
| `SMTP_FROM`   | Hayır  | Gönderen e-posta; yoksa `SMTP_USER` kullanılır (örn. `noreply@yazu.digital`) |

`NEXTAUTH_URL` zaten varsa doğrulama linki doğru domain ile üretilir; mail ayarlarından bağımsızdır.

---

## 4. Vercel’de değişkenleri ekleme (adım adım)

### 4.1 Vercel’e giriş ve proje seçimi

1. [vercel.com](https://vercel.com) → giriş yapın.
2. **Dashboard** → yazu projenize tıklayın (örn. **yazuv1** veya **yazu**).

### 4.2 Environment Variables sayfasına gitme

1. Üst menüden **Settings** sekmesine tıklayın.
2. Sol menüde **Environment Variables** satırına tıklayın.

### 4.3 Tek tek değişken ekleme

Her satır için:

1. **Key** kutusuna değişken adını **tam yazın** (büyük/küçük harf önemli):
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM` (isteğe bağlı)

2. **Value** kutusuna değeri yapıştırın. Örnek:
   - `SMTP_HOST` → `smtp.resend.com` veya `mail.yazu.digital`
   - `SMTP_PORT` → `465` veya `587`
   - `SMTP_USER` → `resend` veya `noreply@yazu.digital`
   - `SMTP_PASS` → API key veya e-posta şifresi (boşluk bırakmayın)
   - `SMTP_FROM` → `noreply@yazu.digital`

3. **Environment** kısmında hangi ortamlarda kullanılacağını seçin:
   - Canlı site için **Production** işaretleyin.
   - Preview (branch) deploy’ları için **Preview** isteğe bağlı.
   - **Save** veya **Add** ile kaydedin.

4. Aynı adımları `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` ve (isterseniz) `SMTP_FROM` için tekrarlayın.

### 4.4 Önemli notlar

- Şifre veya API key’de **başta/sonda boşluk** olmamalı; yapıştırırken dikkat edin.
- Değişken adlarında **tire** yok: `SMTP_HOST` doğru, `SMTP-HOST` yanlış.
- `SMTP_PASS` gibi hassas alanlar Vercel’de masked görünür; bu normaldir.

---

## 5. Deploy’u yenilemek (Redeploy)

Ortam değişkenleri **sadece yeni bir deploy** sırasında uygulanır. Ekledikten sonra:

1. Vercel proje sayfasında **Deployments** sekmesine gidin.
2. En üstteki (son) deployment’ın sağındaki **üç nokta (⋯)** menüsüne tıklayın.
3. **Redeploy** seçin.
4. Onaylayın ve deploy’un **Ready** olmasını bekleyin (1–2 dakika).

Bundan sonra canlı sitede mail gönderimi bu yeni değişkenleri kullanır.

---

## 6. Lokal geliştirme (.env)

Bilgisayarınızda `npm run dev` ile test ederken maillerin gitmesi için proje kökünde `.env` dosyası kullanılır.

1. Proje klasöründe `.env` dosyasını açın (yoksa `.env.example`’ı kopyalayıp `.env` yapın).
2. Aynı değişkenleri ekleyin:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxxxxx
SMTP_FROM=noreply@yazu.digital
```

3. Kaydedip `npm run dev` ile tekrar çalıştırın. `.env` dosyasını **asla** GitHub’a commit etmeyin (zaten `.gitignore`’da olmalı).

---

## 7. Test etmek

1. Canlı sitede yeni bir e-posta ile **kayıt olun** veya giriş yapıp **“Doğrulama linki gönder”** deyin.
2. Birkaç dakika içinde (ve spam klasörü dahil) ilgili e-postayı kontrol edin.
3. E-posta gelmiyorsa:
   - Vercel → **Logs** (veya **Functions** log’ları): `[email] Send verification failed:` veya benzeri hata var mı bakın.
   - SMTP bilgilerini (özellikle host, port, kullanıcı, şifre) ve domain doğrulamasını (Resend/SendGrid için) tekrar kontrol edin.

---

## 8. Özet kontrol listesi

- [ ] SMTP sağlayıcısı seçildi (kendi sunucu / Resend / SendGrid / Gmail).
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` Vercel **Environment Variables**’a eklendi.
- [ ] İsteğe bağlı `SMTP_FROM` eklendi (yoksa `SMTP_USER` kullanılır).
- [ ] **Redeploy** yapıldı.
- [ ] Canlıda kayıt veya “Doğrulama linki gönder” ile test edildi.
- [ ] Gerekirse Vercel log’larında hata mesajı kontrol edildi.

Bu adımlar tamamsa maillerin çalışması gerekir. Sorun devam ederse log’taki hata mesajı ve kullandığınız SMTP sağlayıcısı ile birlikte paylaşırsanız daha net yönlendirme yapılabilir.
