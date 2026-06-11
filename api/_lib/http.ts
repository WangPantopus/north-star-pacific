export type ApiReq = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

export type ApiRes = {
  status: (code: number) => ApiRes;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end?: (body?: string) => void;
};

export function parseJsonBody(raw: unknown): unknown {
  if (raw && typeof raw === "object") {
    return raw;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  return null;
}

export function getClientIp(req: ApiReq): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0]?.trim() ?? "unknown";
  }
  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp;
  }
  return req.socket?.remoteAddress ?? "unknown";
}

export function siteOrigin(): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:5173";
}
