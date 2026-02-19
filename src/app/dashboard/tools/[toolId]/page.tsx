import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ToolRunner } from "@/components/ToolRunner";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { toolId } = await params;
  const tool = await prisma.tool.findUnique({
    where: { id: toolId, active: true },
    include: { category: true },
  });
  if (!tool) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: { plan: true },
  });
  const allowedTiers = user?.plan?.allowedToolTiers ?? ["free"];
  const hasAccess = allowedTiers.includes(tool.tier);

  const brands = session?.user?.id
    ? await prisma.brand.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {tool.category.name}
        </span>
        <h1 className="text-2xl font-semibold text-white mt-1">{tool.name}</h1>
        <p className="mt-2 text-zinc-400">{tool.description}</p>
      </div>
      {hasAccess ? (
        <ToolRunner
          toolId={tool.id}
          toolName={tool.name}
          inputLabel={tool.inputLabel ?? "Girdi"}
          inputPlaceholder={tool.inputPlaceholder ?? ""}
          brands={brands}
        />
      ) : (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-200">
          Bu araç mevcut planınızda yer almıyor. Planınızı yükseltmek için{" "}
          <a href="/profile" className="underline">
            Profil & Fatura
          </a>{" "}
          sayfasına gidin.
        </div>
      )}
    </div>
  );
}
