# Yazu

AI tabanlı metin çıktıları üreten platform. Copywriting ve içerik araçları, marka bağlamı ve abonelik planları ile çalışır.

## Özellikler

- **Ön yüz:** Kategoriler (örn. Copywriting), araçlar (Viral Hooks, Killer Ad Copy, Review Manager), marka seçimi, AI çıktı
- **Admin paneli:** Dashboard, kullanıcılar, planlar, kategoriler, araçlar, istatistikler
- **Auth:** NextAuth (Credentials), kayıt/giriş
- **Planlar:** Starter, Growth, Scale — tool tier’ları, takım ve marka limitleri
- **Stripe:** Aylık/yıllık abonelik, checkout, customer portal, webhook
- **AI:** Google Gemini (system prompt + kullanıcı girdisi + marka verisi → çıktı)

## Gereksinimler

- Node.js 18+
- PostgreSQL (Supabase veya Neon ücretsiz tier önerilir)

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. `.env` dosyası oluşturun (`.env.example` ile aynı değişkenler):

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — Örn. `http://localhost:3000`
- `NEXTAUTH_SECRET` — `openssl rand -base64 32` ile üretin
- `GEMINI_API_KEY` — [Google AI Studio](https://aistudio.google.com/) → API key
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe Dashboard

3. Veritabanını oluşturun ve seed’leyin:

```bash
npm run db:push
npm run db:seed
```

4. İlk admin kullanıcıyı oluşturun: kayıt olun, sonra veritabanında bu kullanıcının `role` alanını `admin` yapın (Prisma Studio: `npm run db:studio` → User → ilgili satır → role: "admin").

5. Çalıştırın:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` açın.

## Veritabanı (ücretsiz → sonra upgrade)

- **Ücretsiz:** [Supabase](https://supabase.com) veya [Neon](https://neon.tech) PostgreSQL; ücretsiz tier yeterli.
- **Supabase:** Proje → Settings → Database → Connection string (URI) alın.
- **Neon:** Proje → Connection string kopyalayın.
- İleride trafik artınca aynı PostgreSQL’i büyütebilir veya başka bir host’a taşıyabilirsiniz.

## Yayına alma

Her değişiklik sonrası: `DEPLOY.md` dosyasına bakın. Özet:

```bash
npm install && npm run db:push && npm run build && pm2 restart yazu
```

## Gemini ve Stripe adımları

Detaylı kurulum: `docs/SETUP_GEMINI_STRIPE.md`

- **Gemini:** Google AI Studio → Create API key → `.env` → `GEMINI_API_KEY`
- **Stripe:** Ürün/fiyat oluştur → Price ID’leri Plan tablosuna yaz → API keys ve webhook secret → `.env`

## Proje yapısı

- `src/app` — Sayfalar (/, /login, /register, /dashboard, /profile, /admin)
- `src/app/api` — API routes (auth, tools/generate, brands, stripe)
- `src/components` — ToolRunner, BrandsList, BillingSection, Providers
- `src/lib` — db (Prisma), auth (NextAuth), gemini
- `prisma` — schema, seed

Tema rengi: `#ff6100` (primary).
