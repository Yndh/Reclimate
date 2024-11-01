import { NextApiResponse } from "next";
import { mPOST } from "./POST";

interface ResponseInterface<T = any> extends NextApiResponse<T> {
  params: {
    id: string;
  };
}

export function POST(req: Request, res: ResponseInterface) {
  return mPOST(req, res);
}
