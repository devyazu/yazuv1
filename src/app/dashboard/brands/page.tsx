import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BrandsList } from "@/components/BrandsList";

export default async function BrandsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  const [brands, user] = await Promise.all([
    prisma.brand.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    }),
  ]);

  const brandsLimit = user?.plan?.brandsLimit ?? 1;
  const canAdd = brands.length < brandsLimit;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Markalarım</h1>
      <p className="text-zinc-400 mb-6">
        Planınız: {brands.length} / {brandsLimit} marka. Marka ekleyerek araç çıktılarında
        marka verilerinizi kullanabilirsiniz.
      </p>
      <BrandsList brands={brands} canAdd={canAdd} />
    </div>
  );
}
