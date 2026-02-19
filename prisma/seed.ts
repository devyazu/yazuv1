import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
      description: "Sosyal medya ve videolar için dikkat çeken giriş cümleleri üretir. Kullanıcı konu veya hedef kitlesini girer, araç marka sesine uygun hook önerileri sunar.",
      inputLabel: "Konu veya hedef (ör: ürün lansmanı, eğitim videosu)",
      inputPlaceholder: "Örn: Yeni kahve makinesi lansmanı, genç profesyoneller",
      systemPrompt: "Sen bir viral içerik uzmanısın. Verilen konu ve hedef kitle için, ilk 3 saniyede dikkat çeken, paylaşılabilir hook cümleleri üret. Kısa, çarpıcı, merak uyandıran 5 farklı hook yaz. Her biri 1-2 cümle olsun. Sadece hook listesini döndür, açıklama ekleme.",
      tier: "free" as const,
      order: 0,
    },
    {
      name: "Killer Ad Copy",
      slug: "killer-ad-copy",
      description: "Reklam kampanyaları için başlık, alt metin ve CTA üretir. Marka tonuna uygun, dönüşüm odaklı metinler.",
      inputLabel: "Ürün/hizmet ve hedef (ör: SaaS abonelik, B2B)",
      inputPlaceholder: "Örn: Proje yönetim yazılımı, küçük ekipler",
      systemPrompt: "Sen bir reklam metni yazarısın. Verilen ürün/hizmet için 1 başlık (headline), 1 alt metin (body copy, 2-3 cümle) ve 2 farklı CTA (call-to-action) buton metni üret. Dönüşüm odaklı, net ve ikna edici ol. Sadece bu dört çıktıyı etiketleyerek yaz, ek açıklama yapma.",
      tier: "basic" as const,
      order: 1,
    },
    {
      name: "Review Manager",
      slug: "review-manager",
      description: "Müşteri yorumlarından özet ve yanıt taslakları üretir. Sentiment analizi ve marka sesine uygun yanıt önerileri.",
      inputLabel: "Müşteri yorumu veya birkaç yorum (her biri ayrı satır)",
      inputPlaceholder: "Yorumları buraya yapıştırın...",
      systemPrompt: "Sen bir müşteri deneyimi uzmanısın. Verilen müşteri yorum(lar)ını değerlendir: kısa bir özet (duygu + ana nokta), ardından marka sesine uygun profesyonel bir yanıt taslağı yaz. Teşekkür ve çözüm odaklı olsun. Sadece 'Özet:' ve 'Yanıt taslağı:' başlıklarıyla çıktı ver.",
      tier: "free" as const,
      order: 2,
    },
  ];

  for (let i = 0; i < tools.length; i++) {
    const t = tools[i];
    await prisma.tool.upsert({
      where: {
        categoryId_slug: { categoryId: copywriting.id, slug: t.slug },
      },
      create: {
        categoryId: copywriting.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        inputLabel: t.inputLabel,
        inputPlaceholder: t.inputPlaceholder,
        systemPrompt: t.systemPrompt,
        tier: t.tier,
        order: t.order,
      },
      update: {
        description: t.description,
        inputLabel: t.inputLabel,
        inputPlaceholder: t.inputPlaceholder,
        systemPrompt: t.systemPrompt,
        tier: t.tier,
        order: t.order,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
