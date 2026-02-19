# Yazu — Yayına Alma (Deploy) Rehberi

Her geliştirme sonrası yayına almak için aşağıdaki adımları uygulayın.

## 1. Kodu sunucuya alın

- Git kullanıyorsanız: `git pull` veya dosyaları FTP/SSH ile sunucuya kopyalayın.
- Proje kök dizinine gidin: `cd /path/to/yazu`

## 2. Bağımlılıkları güncelleyin

```bash
npm install
```

## 3. Veritabanı şemasını güncelleyin (şema değiştiyse)

```bash
npm run db:push
```

(İlk kurulumda veya migration kullandığınızda: `npx prisma migrate deploy`)

## 4. Ortam değişkenlerini kontrol edin

Sunucuda `.env` dosyasında şunlar tanımlı olmalı:

- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `NEXTAUTH_URL` — Örn: `https://yazu.digital`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `GEMINI_API_KEY`

## 5. Build alın

```bash
npm run build
```

## 6. Uygulamayı yeniden başlatın

- **PM2 kullanıyorsanız:** `pm2 restart yazu` veya `pm2 reload yazu`
- **systemd kullanıyorsanız:** `sudo systemctl restart yazu`
- **Docker kullanıyorsanız:** Container’ı yeniden build edip çalıştırın.

---

**Özet (tek seferde):**

```bash
cd /path/to/yazu
git pull
npm install
npm run db:push   # Sadece şema değiştiyse
npm run build
pm2 restart yazu  # veya kullandığınız process manager
```

Domain: **yazu.digital** — NEXTAUTH_URL ve Stripe callback URL’lerini bu domain’e göre ayarlayın.
