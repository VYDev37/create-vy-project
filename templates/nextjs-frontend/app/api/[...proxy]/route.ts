import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api/v1";

async function handleProxy(
  req: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  const subPath = proxy.join("/");
  const targetUrl = new URL(`${BACKEND_URL}/${subPath}${req.nextUrl.search}`);

  const headers = new Headers(req.headers);
  headers.set("host", targetUrl.host);

  try {
    const isBodyAllowed = req.method !== "GET" && req.method !== "HEAD";
    const body = isBodyAllowed ? await req.blob() : undefined;

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to proxy request to backend API",
        error: error instanceof Error ? error.message : "Network error",
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
