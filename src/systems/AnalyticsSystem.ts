import { createSessionId } from "../utils/gameMath";

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  payload: Record<string, number | string | boolean | null>;
}

const EVENT_STORAGE_KEY = "shinchan-flight-events-v1";

export class AnalyticsSystem {
  private sessionId = createSessionId();
  private events: AnalyticsEvent[] = [];

  beginSession(): void {
    this.sessionId = createSessionId();
    this.events = [];
    this.track("session_started", { sessionId: this.sessionId });
  }

  track(type: string, payload: Record<string, number | string | boolean | null> = {}): void {
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      payload,
    };

    this.events.push(event);
    if (this.events.length > 40) {
      this.events.shift();
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(this.events));
    }
  }

  getFeed(limit = 5): AnalyticsEvent[] {
    return this.events.slice(-limit).reverse();
  }

  summarize(distance: number, elapsedMs: number, falls: number): Record<string, number> {
    return {
      distance: Math.round(distance),
      elapsedSeconds: Math.round(elapsedMs / 1000),
      falls,
      eventsCaptured: this.events.length,
    };
  }
}
