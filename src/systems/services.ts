import type { AnalyticsSystem } from "./AnalyticsSystem";
import type { HudSystem } from "./HudSystem";
import type { StateManager } from "./StateManager";

export interface GameServices {
  analytics: AnalyticsSystem;
  hud: HudSystem;
  stateManager: StateManager;
}
