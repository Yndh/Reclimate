import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { mGET } from "./GET";

export function GET(req: NextRequest, res: NextApiResponse) {
  return mGET(req, res);
}
