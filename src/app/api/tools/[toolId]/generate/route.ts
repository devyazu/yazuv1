import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateWithGemini } from "@/lib/gemini";
import { z } from "zod";

const bodySchema = z.object({
  input: z.string().min(1),
  brandId: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { toolId } = await params;
  const tool = await prisma.tool.findUnique({
    where: { id: toolId, active: true },
    include: { category: true },
  });
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const allowedTiers = await getAllowedTiersForUser(session.user.id);
  if (!allowedTiers.includes(tool.tier)) {
    return NextResponse.json(
      { error: "Bu araç için planınız yeterli değil." },
      { status: 403 }
    );
  }

  let body: { input: string; brandId?: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  let brandContext = "";
  if (body.brandId) {
    const brand = await prisma.brand.findFirst({
      where: { id: body.brandId, userId: session.user.id },
    });
    if (brand?.assets && typeof brand.assets === "object") {
      brandContext = JSON.stringify(brand.assets, null, 2);
    }
  }

  try {
    const result = await generateWithGemini(
      tool.systemPrompt,
      body.input,
      brandContext || undefined
    );
    await prisma.output.create({
      data: {
        userId: session.user.id,
        toolId: tool.id,
        brandId: body.brandId ?? null,
        input: body.input,
        result,
      },
    });
    return NextResponse.json({ result });
  } catch (e) {
    console.error("Gemini error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Üretim hatası." },
      { status: 500 }
    );
  }
}

async function getAllowedTiersForUser(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });
  if (!user?.plan?.allowedToolTiers?.length) {
    return ["free"];
  }
  return user.plan.allowedToolTiers;
}
