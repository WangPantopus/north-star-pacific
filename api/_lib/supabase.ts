type ScanRow = {
  id: string;
  created_at: string;
  answers: Record<string, unknown>;
  readiness: number;
  band: string;
  surfaced_zones: unknown;
  route: string;
  email: string;
  first_name: string;
  company: string;
  audit_booked: boolean;
};

type InsertScanRow = Omit<ScanRow, "created_at" | "audit_booked"> & {
  audit_booked?: boolean;
};

function requireSupabaseEnv(): { url: string; serviceKey: string } {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("supabase-not-configured");
  }
  return { url: url.replace(/\/$/, ""), serviceKey };
}

function supabaseHeaders(serviceKey: string, prefer?: string): HeadersInit {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function insertScanResponse(row: InsertScanRow): Promise<void> {
  const { url, serviceKey } = requireSupabaseEnv();
  const response = await fetch(`${url}/rest/v1/scan_responses`, {
    method: "POST",
    headers: supabaseHeaders(serviceKey, "return=minimal"),
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`supabase-insert-failed:${response.status}:${detail}`);
  }
}

export async function fetchScanResponse(id: string): Promise<ScanRow | null> {
  const { url, serviceKey } = requireSupabaseEnv();
  const query = new URL(`${url}/rest/v1/scan_responses`);
  query.searchParams.set("id", `eq.${id}`);
  query.searchParams.set("select", "*");
  query.searchParams.set("limit", "1");

  const response = await fetch(query, {
    headers: supabaseHeaders(serviceKey),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`supabase-fetch-failed:${response.status}:${detail}`);
  }

  const rows = (await response.json()) as ScanRow[];
  return rows[0] ?? null;
}

export async function markScanBooked(id: string): Promise<boolean> {
  const { url, serviceKey } = requireSupabaseEnv();
  const query = new URL(`${url}/rest/v1/scan_responses`);
  query.searchParams.set("id", `eq.${id}`);

  const response = await fetch(query, {
    method: "PATCH",
    headers: supabaseHeaders(serviceKey, "return=minimal"),
    body: JSON.stringify({ audit_booked: true }),
  });

  return response.ok;
}

export type { ScanRow };
