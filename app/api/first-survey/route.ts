import { NextApiResponse } from "next";
import { mGET } from "./GET";

export function GET(req: Request, res: NextApiResponse) {
  return mGET(req, res);
}
