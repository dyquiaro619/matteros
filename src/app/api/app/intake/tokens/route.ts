import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { MatterType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    hintType,
    hintName,
    expiresInDays = 14,
  } = body as { hintType?: MatterType; hintName?: string; expiresInDays?: number };

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const record = await prisma.intakeToken.create({
    data: {
      hintType,
      hintName,
      expiresAt,
      createdById: user.id,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const intakeUrl = `${baseUrl}/intake/${record.token}`;

  return NextResponse.json({ token: record.token, intakeUrl, expiresAt: record.expiresAt });
}
