# Gemini ve Stripe Kurulum Rehberi

## Google Gemini API

### 1. Google AI Studio’ya girin

- Tarayıcıda [Google AI Studio](https://aistudio.google.com/) adresine gidin.
- Google hesabınızla giriş yapın.

### 2. API anahtarı oluşturun

- Sol menüden **“Get API key”** veya **“API Keys”** bölümüne gidin.
- **“Create API key”** ile yeni bir anahtar oluşturun (mevcut bir Google Cloud projesi seçebilir veya yeni proje oluşturabilirsiniz).
- Oluşan API anahtarını kopyalayın.

### 3. Projede kullanın

- Proje kökünde `.env` dosyasına ekleyin:

```env
GEMINI_API_KEY=buraya_anahtari_yapistirin
```

- Sunucuya deploy ederken aynı değişkeni sunucu ortamına (veya hosting panelindeki env ayarlarına) ekleyin.

### 4. Ücretlendirme (isteğe bağlı)

- [Google AI for Developers](https://ai.google.dev/pricing) sayfasından ücretlendirmeyi inceleyin.
- Ücretsiz kotada belirli sayıda istek/dakika vardır; aşımda ücretlendirme açılır.

---

## Stripe Entegrasyonu

### 1. Stripe hesabı

- [Stripe](https://dashboard.stripe.com/) hesabı oluşturun veya giriş yapın.

### 2. Ürün ve fiyatları oluşturun

- **Products** → **Add product** ile her plan için bir ürün oluşturun:
  - Örn: “Yazu Growth”, “Yazu Scale”
- Her ürün için **iki fiyat** ekleyin:
  - **Recurring – Monthly** (aylık)
  - **Recurring – Yearly** (yıllık)
- Her fiyatın **Price ID**’sini (örn: `price_xxx`) kopyalayın.

### 3. Veritabanında planları güncelleyin

- `Plan` tablosunda ilgili planların `stripe_price_id_monthly` ve `stripe_price_id_yearly` alanlarına bu ID’leri yazın.
- Prisma Studio ile: `npm run db:studio` → Plan → ilgili satırı düzenleyin.
- Veya SQL ile:

```sql
UPDATE "Plan"
SET stripe_price_id_monthly = 'price_xxx', stripe_price_id_yearly = 'price_yyy'
WHERE slug = 'growth';

UPDATE "Plan"
SET stripe_price_id_monthly = 'price_aaa', stripe_price_id_yearly = 'price_bbb'
WHERE slug = 'scale';
```

### 4. API anahtarları

- Stripe Dashboard → **Developers** → **API keys**
- **Publishable key** (pk_…) ve **Secret key** (sk_…) alın.
- `.env`:

```env
STRIPE_SECRET_KEY=sk_live_...   # veya sk_test_... test için
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 5. Webhook

- **Developers** → **Webhooks** → **Add endpoint**
- URL: `https://yazu.digital/api/stripe/webhook`
- Dinlenecek olaylar: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Webhook oluşturduktan sonra **Signing secret** (whsec_…) alın.
- `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 6. Canlı / test modu

- Test için `sk_test_` ve `pk_test_` kullanın; canlıya geçerken `sk_live_` ve `pk_live_` ile değiştirin.
- Webhook’u da canlı/teste göre ayrı tanımlayabilirsiniz.

Bu adımlar tamamlandığında ödeme akışı ve recurring faturalar Stripe üzerinden çalışır.
