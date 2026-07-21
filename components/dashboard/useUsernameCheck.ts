"use client";

import { useEffect, useRef, useState } from "react";

export type UsernameCheckStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;
const DEBOUNCE_MS = 400;

// Debounced live availability check against /api/username/check.
// `skipValue` (e.g. the user's current username on the profile page)
// short-circuits to "available" without hitting the API.
export function useUsernameCheck(username: string, skipValue?: string) {
  const [status, setStatus] = useState<UsernameCheckStatus>("idle");
  const [message, setMessage] = useState("");

  // Guards against out-of-order responses from stale requests
  const requestId = useRef(0);

  useEffect(() => {
    const value = username.trim().toLowerCase();
    const id = ++requestId.current;

    if (!value) {
      setStatus("idle");
      setMessage("");
      return;
    }

    if (skipValue && value === skipValue) {
      setStatus("available");
      setMessage("This is your current username");
      return;
    }

    if (!USERNAME_REGEX.test(value)) {
      setStatus("invalid");
      setMessage(
        "3-30 characters; letters, numbers, hyphens and underscores only"
      );
      return;
    }

    setStatus("checking");
    setMessage("Checking availability...");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(value)}`
        );
        const data = await res.json();

        if (id !== requestId.current) return; // stale response

        setStatus(data.available ? "available" : "taken");
        setMessage(
          data.available ? "Username Available" : "Username Already Taken"
        );
      } catch {
        if (id !== requestId.current) return;

        setStatus("idle");
        setMessage("");
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [username, skipValue]);

  return { status, message };
}
