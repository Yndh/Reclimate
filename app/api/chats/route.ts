import { NextApiRequest, NextApiResponse } from "next";
import { mGET } from "./GET";
import { mPOST } from "./POST";

export function GET(req: NextApiRequest, res: NextApiResponse) {
  return mGET(req, res);
}

export function POST(req: NextApiRequest, res: NextApiResponse) {
  return mPOST(req, res);
}
