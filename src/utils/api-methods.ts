import { NextApiRequest, NextApiResponse } from "next";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: HttpMethod[]
) {
  if (!allowedMethods.includes(req.method as HttpMethod)) {
    res.setHeader("Allow", allowedMethods);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return false;
  }
  return true;
}
