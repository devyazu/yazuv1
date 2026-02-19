import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { plan: true },
  });
  const count = await prisma.brand.count({ where: { userId: session.user.id } });
  const limit = user?.plan?.brandsLimit ?? 1;
  if (count >= limit) {
    return NextResponse.json(
      { error: "Marka limitine ulaştınız. Planı yükseltin." },
      { status: 400 }
    );
  }
  const brand = await prisma.brand.create({
    data: {
      userId: session.user.id,
      name: body.name,
      description: body.description ?? null,
      assets: {},
    },
  });
  return NextResponse.json(brand);
}
