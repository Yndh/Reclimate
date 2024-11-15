import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
export async function mGET(req: NextRequest, res: NextApiResponse) {
  try {
    await prisma.user.findFirstOrThrow({
      select: {
        id: true,
      },
    });
  } catch (err) {
    console.log(`Refresh error: ${err}`);
  }
  console.info("REFRESH DONE");
  return new NextResponse(JSON.stringify(true), {
    status: 200,
  });
}
