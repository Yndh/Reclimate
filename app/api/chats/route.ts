import { NextApiResponse } from "next";
import { mGET } from "./GET";
import { mPOST } from "./POST";
import { NextRequest } from "next/server";

export function GET(req: NextRequest, res: NextApiResponse) {
  return mGET(req, res);
}

export function POST(req: NextRequest, res: NextApiResponse) {
  return mPOST(req, res);
}
