import { formatMeters } from "../utils/gameMath";
import type { StoredRunState } from "./StateManager";
import type { AnalyticsEvent } from "./AnalyticsSystem";

export interface HudPayload {
  distance: number;
  altitude: number;
  grip: number;
  speed: number;
  windLabel: string;
  boost: number;
}

export class HudSystem {
  private distance = document.getElementById("metric-distance");
  private altitude = document.getElementById("metric-altitude");
  private grip = document.getElementById("metric-grip");
  private speed = document.getElementById("metric-speed");
  private wind = document.getElementById("metric-wind");
  private boost = document.getElementById("metric-boost");
  private statusTitle = document.getElementById("status-title");
  private statusDetail = document.getElementById("status-detail");
  private bestDistance = document.getElementById("best-distance");
  private runGrade = document.getElementById("run-grade");
  private totalRuns = document.getElementById("total-runs");
  private eventLog = document.getElementById("event-log");

  renderRun(payload: HudPayload): void {
    this.distance!.textContent = formatMeters(payload.distance);
    this.altitude!.textContent = `${Math.round(payload.altitude * 100)}%`;
    this.grip!.textContent = `${Math.round(payload.grip * 100)}%`;
    this.speed!.textContent = `${Math.round(payload.speed)} km/h`;
    this.wind!.textContent = payload.windLabel;
    this.boost!.textContent = `${Math.round(payload.boost)}%`;
  }

  renderPersistent(snapshot: StoredRunState): void {
    this.bestDistance!.textContent = formatMeters(snapshot.bestDistance);
    this.runGrade!.textContent = snapshot.lastGrade;
    this.totalRuns!.textContent = snapshot.totalRuns.toString();
  }

  setStatus(title: string, detail: string): void {
    this.statusTitle!.textContent = title;
    this.statusDetail!.textContent = detail;
  }

  renderEvents(events: AnalyticsEvent[]): void {
    if (!this.eventLog) {
      return;
    }

    this.eventLog.innerHTML = "";

    for (const event of events) {
      const item = document.createElement("li");
      item.className = "event-item";
      item.textContent = `${event.type.replaceAll("_", " ")} • ${new Date(event.timestamp)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .toLowerCase()}`;
      this.eventLog.append(item);
    }
  }
}
