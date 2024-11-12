import { NextApiResponse } from "next";
import { mPOST } from "./POST";
import { mGET } from "./GET";

interface ResponseInterface<T = any> extends NextApiResponse<T> {
  params: {
    id: string;
  };
}

export function POST(req: Request, res: ResponseInterface) {
  return mPOST(req, res);
}

export function GET(req: Request, res: ResponseInterface) {
  return mGET(req, res);
}
