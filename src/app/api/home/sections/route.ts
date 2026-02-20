import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Ana sayfa bölümlerini döner (herkese açık). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "home";

  const sections = await prisma.homeSection.findMany({
    where: { page },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    sections.map((s) => ({
      id: s.id,
      type: s.type,
      order: s.order,
      data: s.data as object,
    }))
  );
}
