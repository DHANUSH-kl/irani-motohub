import { crypto } from "next/dist/compiled/@edge-runtime/primitives/crypto";

const REDIS_URL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)?.replace(/['"]/g, "");
const REDIS_TOKEN = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)?.replace(/['"]/g, "");

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Timestamp in ms
  idToken?: string;
  customerMetadata?: {
    email: string;
    id: string;
  };
}

// Local in-memory store fallback for dev when Redis is not configured
const memoryStore = new Map<string, SessionData>();

// Helper to get formatted base REST URL ending with a slash
function getRedisBaseUrl(): string | null {
  if (!REDIS_URL) return null;
  
  if (REDIS_URL.startsWith("redis://") || REDIS_URL.startsWith("rediss://")) {
    console.error(`[Auth] Redis configuration error: UPSTASH_REDIS_REST_URL or KV_REST_API_URL must use https:// protocol for REST API, not TCP. Obtained: ${REDIS_URL.split(":")[0]}://`);
    return null;
  }
  
  return REDIS_URL.endsWith("/") ? REDIS_URL : `${REDIS_URL}/`;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  if (!sessionId) return null;

  const baseUrl = getRedisBaseUrl();

  if (baseUrl && REDIS_TOKEN) {
    try {
      console.log(`[Auth] Session retrieval started for ID: ${sessionId.substring(0, 8)}...`);
      const response = await fetch(`${baseUrl}get/session:${sessionId}`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`[Auth] Redis GET failed. Status: ${response.status}`);
        return null;
      }

      const resData = await response.json();
      if (resData && resData.result) {
        console.log("[Auth] Session successfully retrieved from Redis.");
        return JSON.parse(resData.result);
      }
      console.log("[Auth] Session key not found in Redis.");
      return null;
    } catch (error: any) {
      console.error(`[Auth] Redis GET network error: ${error?.message || error}`);
      return null;
    }
  }

  return memoryStore.get(sessionId) || null;
}

export async function setSession(sessionId: string, data: SessionData): Promise<boolean> {
  if (!sessionId) {
    console.error("[Auth] Session creation failed: Opaque session ID is empty.");
    return false;
  }

  const hasEmail = !!data.customerMetadata?.email;
  console.log(`[Auth] Session creation started. Customer ID exists: ${!!data.customerMetadata?.id}, Customer email exists: ${hasEmail}`);

  const expireSeconds = 60 * 60 * 24 * 30; // 30 days
  const baseUrl = getRedisBaseUrl();

  if (baseUrl && REDIS_TOKEN) {
    console.log(`[Auth] Redis configuration: present. Target protocol: HTTPS.`);
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          "SET",
          `session:${sessionId}`,
          JSON.stringify(data),
          "EX",
          expireSeconds.toString(),
        ]),
        cache: "no-store",
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        console.error(`[Auth] Redis SET failed. Status: ${response.status}. Response: ${errBody}`);
        return false;
      }

      const resData = await response.json();
      if (resData && resData.error) {
        console.error(`[Auth] Redis API returned error payload: ${resData.error}`);
        return false;
      }

      console.log("[Auth] Redis SET: success. Session persisted server-side.");
      return true;
    } catch (error: any) {
      console.error(`[Auth] Redis SET network error: ${error?.message || error}`);
      return false;
    }
  }

  console.warn("[Auth] Redis env variables missing. Falling back to dev in-memory store.");
  memoryStore.set(sessionId, data);
  return true;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;

  const baseUrl = getRedisBaseUrl();

  if (baseUrl && REDIS_TOKEN) {
    try {
      console.log(`[Auth] Session deletion started for ID: ${sessionId.substring(0, 8)}...`);
      const response = await fetch(`${baseUrl}del/session:${sessionId}`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`[Auth] Redis DEL failed. Status: ${response.status}`);
        return false;
      }

      const resData = await response.json();
      const success = resData && resData.result > 0;
      console.log(`[Auth] Session deletion from Redis: ${success ? "success" : "key not found"}`);
      return success;
    } catch (error: any) {
      console.error(`[Auth] Redis DEL network error: ${error?.message || error}`);
      return false;
    }
  }

  return memoryStore.delete(sessionId);
}
