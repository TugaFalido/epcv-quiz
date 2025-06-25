import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return Response.json({
    error: "LTI Error",
    message: request.nextUrl.searchParams.get("message"),
  });
}
