import { NextApiResponse } from "next";
import { mGET } from "./GET";
import { NextRequest } from "next/server";

export function GET(req: NextRequest, res: NextApiResponse) {
  return mGET(req, res);
}
