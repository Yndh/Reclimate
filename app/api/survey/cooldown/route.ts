import { NextApiRequest, NextApiResponse } from "next";
import { mGET } from "./GET";
import { auth } from "@/lib/auth";

export function GET(req: NextApiRequest, res: NextApiResponse) {
  return mGET(req, res);
}
