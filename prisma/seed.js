const path = require("path");
const fs = require("fs");
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
}
// Seed, transaction pooler (6543) ile prepared statement hatası veriyor; session (5432) kullan
if (process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}
console.log("Seed script yüklendi.");
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
console.log("Prisma bağlanıyor...");
const prisma = new PrismaClient();

async function main() {
  console.log("Seed başlıyor...");
  await prisma.plan.upsert({
    where: { slug: "starter" },
    create: {
      name: "Starter",
      slug: "starter",
      allowedToolTiers: ["free"],
      teamMembersLimit: 1,
      brandsLimit: 1,
      order: 0,
    },
    update: {},
  });
  await prisma.plan.upsert({
    where: { slug: "growth" },
    create: {
      name: "Growth",
      slug: "growth",
      allowedToolTiers: ["free", "basic"],
      teamMembersLimit: 3,
      brandsLimit: 5,
      order: 1,
    },
    update: {},
  });
  await prisma.plan.upsert({
    where: { slug: "scale" },
    create: {
      name: "Scale",
      slug: "scale",
      allowedToolTiers: ["free", "basic", "pro", "premium"],
      teamMembersLimit: 10,
      brandsLimit: 20,
      order: 2,
    },
    update: {},
  });
  console.log("Planlar eklendi.");
  const copywriting = await prisma.category.upsert({
    where: { slug: "copywriting" },
    create: {
      name: "Copywriting",
      slug: "copywriting",
      description: "Reklam ve sosyal medya metinleri",
      order: 0,
    },
    update: {},
  });
  const tools = [
    {
      name: "Viral Hooks",
      slug: "viral-hooks",
      description: "Sosyal medya ve videolar için dikkat çeken giriş cümleleri üretir.",
      inputLabel: "Konu veya hedef",
      inputPlaceholder: "Örn: Yeni kahve makinesi lansmanı",
      systemPrompt: "Sen bir viral içerik uzmanısın. Verilen konu için 5 hook cümlesi üret. Kısa ve çarpıcı olsun.",
      tier: "free",
      order: 0,
    },
    {
      name: "Killer Ad Copy",
      slug: "killer-ad-copy",
      description: "Reklam kampanyaları için başlık ve CTA üretir.",
      inputLabel: "Ürün/hizmet ve hedef",
      inputPlaceholder: "Örn: Proje yönetim yazılımı",
      systemPrompt: "Sen bir reklam metni yazarısın. 1 başlık, 1 alt metin, 2 CTA üret.",
      tier: "basic",
      order: 1,
    },
    {
      name: "Review Manager",
      slug: "review-manager",
      description: "Müşteri yorumlarından özet ve yanıt taslağı üretir.",
      inputLabel: "Müşteri yorumu",
      inputPlaceholder: "Yorumları yapıştırın...",
      systemPrompt: "Müşteri yorumunu değerlendir: özet ve profesyonel yanıt taslağı yaz.",
      tier: "free",
      order: 2,
    },
  ];
  for (const t of tools) {
    await prisma.tool.upsert({
      where: { categoryId_slug: { categoryId: copywriting.id, slug: t.slug } },
      create: { categoryId: copywriting.id, ...t },
      update: t,
    });
  }
  console.log("Kategoriler ve araçlar eklendi.");

  // Varsayılan admin: admin@yazu.digital / 1Pembekoltuk
  const adminHash = await hash("1Pembekoltuk", 12);
  await prisma.user.upsert({
    where: { email: "admin@yazu.digital" },
    create: {
      email: "admin@yazu.digital",
      name: "Yazu Admin",
      passwordHash: adminHash,
      role: "admin",
    },
    update: { passwordHash: adminHash, role: "admin" },
  });
  console.log("Varsayılan admin kullanıcısı: admin@yazu.digital");

  const homeCount = await prisma.homeSection.count();
  if (homeCount === 0) {
    await prisma.homeSection.createMany({
      data: [
        {
          page: "home",
          type: "hero",
          order: 0,
          data: {
            title: "Smart mind for your business",
            subtitle:
              "AI ile markanızın sesine uygun metinler üretin. Copywriting ve içerik araçlarıyla daha hızlı, tutarlı ve etkili çıktılar alın.",
            ctaPrimaryText: "Ücretsiz Başla",
            ctaPrimaryUrl: "/register",
            ctaSecondaryText: "Planları İncele",
            ctaSecondaryUrl: "#plans",
          },
        },
        {
          page: "home",
          type: "pricing_heading",
          order: 1,
          data: {
            title: "Üyelik paketleri",
            subtitle: "İhtiyacınıza uygun planı seçin, hemen başlayın.",
          },
        },
      ],
    });
    console.log("Ana sayfa bölümleri (CMS) eklendi.");
  }

  console.log("Seed tamamlandı.");
}

main()
  .then(() => prisma.$disconnect())
  .then(() => {
    console.log("Bağlantı kapatıldı.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("HATA:", e);
    prisma.$disconnect().finally(() => process.exit(1));
  });
