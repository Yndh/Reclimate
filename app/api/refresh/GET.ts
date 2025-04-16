import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
export async function mGET(req: NextRequest, res: NextApiResponse) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

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
  return new NextResponse(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
    }
  );
}
