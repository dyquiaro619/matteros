import { NextRequest, NextResponse } from "next/server";
// ...your imports

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orgId = id; // alias if your code expects orgId

  // ...rest of your logic
  return NextResponse.json({ orgId /*, role */ });
}