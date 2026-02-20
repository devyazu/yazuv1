/**
 * Kullanım: node scripts/make-admin.js your@email.com
 * Bu e-postaya sahip kullanıcıyı admin yapar.
 */
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
if (process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}

const email = process.argv[2];
if (!email) {
  console.error("Kullanım: node scripts/make-admin.js your@email.com");
  process.exit(1);
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.updateMany({
    where: { email: email.trim() },
    data: { role: "admin" },
  });
  if (user.count === 0) {
    console.error("Bu e-posta ile kayıtlı kullanıcı bulunamadı:", email);
    process.exit(1);
  }
  console.log("Tamam. Şu kullanıcı admin yapıldı:", email);
  console.log("Çıkış yapıp tekrar giriş yapın, ardından https://yazuv1.vercel.app/admin adresine gidin.");
}

main()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("HATA:", e);
    prisma.$disconnect().finally(() => process.exit(1));
  });
