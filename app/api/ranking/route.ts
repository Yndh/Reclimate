import { NextApiRequest, NextApiResponse } from "next";
import { mGET } from "./GET";

export function GET(req: NextApiRequest, res: NextApiResponse) {
  return mGET(req, res);
}
