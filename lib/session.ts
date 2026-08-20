import { crypto } from "next/dist/compiled/@edge-runtime/primitives/crypto";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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

export async function getSession(sessionId: string): Promise<SessionData | null> {
  if (!sessionId) return null;

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const response = await fetch(`${REDIS_URL}/get/session:${sessionId}`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Upstash Redis getSession failed:", response.statusText);
        return null;
      }

      const resData = await response.json();
      if (resData && resData.result) {
        return JSON.parse(resData.result);
      }
      return null;
    } catch (error) {
      console.error("Error reading session from Redis:", error);
      return null;
    }
  }

  // Fallback
  return memoryStore.get(sessionId) || null;
}

export async function setSession(sessionId: string, data: SessionData): Promise<boolean> {
  if (!sessionId) return false;

  const expireSeconds = 60 * 60 * 24 * 30; // 30 days

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const response = await fetch(`${REDIS_URL}`, {
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
        console.error("Upstash Redis setSession failed:", response.statusText);
        return false;
      }

      const resData = await response.json();
      return resData && !resData.error;
    } catch (error) {
      console.error("Error writing session to Redis:", error);
      return false;
    }
  }

  // Fallback
  memoryStore.set(sessionId, data);
  return true;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const response = await fetch(`${REDIS_URL}/del/session:${sessionId}`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Upstash Redis deleteSession failed:", response.statusText);
        return false;
      }

      const resData = await response.json();
      return resData && resData.result > 0;
    } catch (error) {
      console.error("Error deleting session from Redis:", error);
      return false;
    }
  }

  // Fallback
  return memoryStore.delete(sessionId);
}
