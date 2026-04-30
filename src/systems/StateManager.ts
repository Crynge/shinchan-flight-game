import { gradeRun } from "../utils/gameMath";

const STORAGE_KEY = "shinchan-flight-state-v1";

export interface StoredRunState {
  bestDistance: number;
  totalFalls: number;
  totalRuns: number;
  lastGrade: string;
  lastPlayedAt: number | null;
}

const defaultState = (): StoredRunState => ({
  bestDistance: 0,
  totalFalls: 0,
  totalRuns: 0,
  lastGrade: "Awaiting First Flight",
  lastPlayedAt: null,
});

export class StateManager {
  private state: StoredRunState;

  constructor() {
    this.state = defaultState();
    this.load();
  }

  private load(): void {
    if (typeof window === "undefined") {
      return;
    }

    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as Partial<StoredRunState>;
      this.state = {
        ...defaultState(),
        ...parsed,
      };
    } catch {
      this.state = defaultState();
    }
  }

  private persist(): void {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getSnapshot(): StoredRunState {
    return { ...this.state };
  }

  recordRun(distance: number, falls: number): StoredRunState {
    this.state.bestDistance = Math.max(this.state.bestDistance, distance);
    this.state.totalFalls += falls;
    this.state.totalRuns += 1;
    this.state.lastGrade = gradeRun(distance, falls);
    this.state.lastPlayedAt = Date.now();
    this.persist();
    return this.getSnapshot();
  }

  reset(): StoredRunState {
    this.state = defaultState();
    this.persist();
    return this.getSnapshot();
  }
}
