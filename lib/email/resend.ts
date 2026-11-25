/**
 * Transactional email through Resend's HTTPS API. Kept free of extra SDK
 * packages so the server bundle stays lean and uniform with Meta CAPI,
 * Amplitude and HubSpot.
 *
 * Logs carry only status codes, Resend error names and message IDs — never
 * recipient addresses, subjects or message bodies.
 */
import { serverLog } from "@/lib/server-log";

const RESEND_API_BASE = "https://api.resend.com";

export const DEFAULT_RESEND_DOMAIN = "marketingzavod.com";
export const DEFAULT_RESEND_FROM = "Marketing Zavod <noreply@marketingzavod.com>";
export const DEFAULT_RESEND_VERIFY_TO = "zavodzamarketing@gmail.com";

export type ResendAttachment = {
  filename: string;
  /** Base64-encoded content. */
  content: string;
  contentType?: string;
};

export type ResendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string | string[];
  headers?: Record<string, string>;
  attachments?: ResendAttachment[];
  idempotencyKey?: string;
};

export type ResendSendResult =
  | { sent: true; id: string }
  | {
      sent: false;
      reason: "not_configured" | "error";
      status?: number;
      errorName?: string;
    };

export type ResendDomainStatus =
  | { state: "not_configured" }
  | { state: "sending_only_key" }
  | { state: "not_found"; domain: string }
  | { state: "found"; id: string; name: string; status: string; region?: string }
  | { state: "error"; status?: number; errorName?: string };

type ResendErrorBody = {
  name?: string;
  message?: string;
  statusCode?: number;
};

type ResendDomainEntry = {
  id: string;
  name: string;
  status: string;
  region?: string;
};

function apiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || undefined;
}

export function resendConfigured(): boolean {
  return Boolean(apiKey());
}

async function parseErrorName(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ResendErrorBody;
    return typeof body.name === "string" && body.name ? body.name : "http_error";
  } catch {
    return "http_error";
  }
}

function isSendingOnlyRestriction(status: number, errorName: string): boolean {
  return (status === 401 || status === 403) && errorName === "restricted_api_key";
}

function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends one transactional email via Resend. Without RESEND_API_KEY it returns
 * not_configured; network and API failures are logged without PII and never throw.
 */
export async function sendResendEmail(
  input: ResendEmailInput,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<ResendSendResult> {
  const key = apiKey();
  if (!key) {
    return { sent: false, reason: "not_configured" };
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 8000;
  const from = input.from?.trim() || process.env.RESEND_FROM?.trim() || DEFAULT_RESEND_FROM;
  const to = Array.isArray(input.to) ? input.to : [input.to];

  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  if (input.idempotencyKey) {
    headers["Idempotency-Key"] = input.idempotencyKey;
  }

  const payload: Record<string, unknown> = {
    from,
    to,
    subject: input.subject,
    text: input.text,
  };
  if (input.html) {
    payload.html = input.html;
  }
  if (input.replyTo) {
    payload.reply_to = input.replyTo;
  }
  if (input.headers && Object.keys(input.headers).length > 0) {
    payload.headers = input.headers;
  }
  if (input.attachments && input.attachments.length > 0) {
    payload.attachments = input.attachments.map((item) => ({
      filename: item.filename,
      content: item.content,
      ...(item.contentType ? { content_type: item.contentType } : {}),
    }));
  }

  try {
    const response = await fetchImpl(`${RESEND_API_BASE}/emails`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorName = await parseErrorName(response);
      serverLog.error("resend_error", { status: response.status, error_name: errorName });
      return { sent: false, reason: "error", status: response.status, errorName };
    }

    const data = (await response.json()) as { id?: string };
    const id = typeof data.id === "string" ? data.id : "";
    return { sent: true, id };
  } catch (error) {
    serverLog.error("resend_error", {
      error_name: error instanceof Error ? error.name : "network_error",
    });
    return { sent: false, reason: "error", errorName: "network_error" };
  }
}

/**
 * Checks a sender domain in Resend and triggers DNS verification when the
 * domain has not reached "verified" yet. Sending-only keys return
 * sending_only_key instead of failing.
 */
export async function verifyResendDomain(
  domain = DEFAULT_RESEND_DOMAIN,
  options: { fetchImpl?: typeof fetch; sleepMs?: number; timeoutMs?: number } = {},
): Promise<ResendDomainStatus> {
  const key = apiKey();
  if (!key) {
    return { state: "not_configured" };
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleepMs = options.sleepMs ?? 2500;
  const timeoutMs = options.timeoutMs ?? 8000;
  const authHeaders = { Authorization: `Bearer ${key}` };

  try {
    const listResponse = await fetchImpl(`${RESEND_API_BASE}/domains`, {
      method: "GET",
      headers: authHeaders,
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });

    if (!listResponse.ok) {
      const errorName = await parseErrorName(listResponse);
      if (isSendingOnlyRestriction(listResponse.status, errorName)) {
        return { state: "sending_only_key" };
      }
      serverLog.error("resend_domain_error", {
        status: listResponse.status,
        error_name: errorName,
      });
      return { state: "error", status: listResponse.status, errorName };
    }

    const listBody = (await listResponse.json()) as { data?: ResendDomainEntry[] };
    const normalized = domain.trim().toLowerCase();
    const entry = (listBody.data ?? []).find((item) => item.name.toLowerCase() === normalized);
    if (!entry) {
      return { state: "not_found", domain: normalized };
    }

    if (entry.status === "verified") {
      return {
        state: "found",
        id: entry.id,
        name: entry.name,
        status: entry.status,
        region: entry.region,
      };
    }

    await fetchImpl(`${RESEND_API_BASE}/domains/${encodeURIComponent(entry.id)}/verify`, {
      method: "POST",
      headers: authHeaders,
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });

    await sleep(sleepMs);

    const detailResponse = await fetchImpl(
      `${RESEND_API_BASE}/domains/${encodeURIComponent(entry.id)}`,
      {
        method: "GET",
        headers: authHeaders,
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      },
    );

    if (detailResponse.ok) {
      const detail = (await detailResponse.json()) as ResendDomainEntry;
      return {
        state: "found",
        id: detail.id ?? entry.id,
        name: detail.name ?? entry.name,
        status: detail.status ?? entry.status,
        region: detail.region ?? entry.region,
      };
    }

    return {
      state: "found",
      id: entry.id,
      name: entry.name,
      status: entry.status,
      region: entry.region,
    };
  } catch (error) {
    serverLog.error("resend_domain_error", {
      error_name: error instanceof Error ? error.name : "network_error",
    });
    return { state: "error", errorName: "network_error" };
  }
}

/** Reads non-PII delivery status (last_event) for a sent Resend email ID. */
export async function getResendEmailStatus(
  emailId: string,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<{ lastEvent?: string }> {
  const key = apiKey();
  if (!key || !emailId) {
    return {};
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 6000;
  try {
    const response = await fetchImpl(
      `${RESEND_API_BASE}/emails/${encodeURIComponent(emailId)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      return {};
    }
    const body = (await response.json()) as { last_event?: string };
    return typeof body.last_event === "string" ? { lastEvent: body.last_event } : {};
  } catch {
    return {};
  }
}
