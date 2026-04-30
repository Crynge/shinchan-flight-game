import Phaser from "phaser";
import "./style.css";
import { AnalyticsSystem } from "./systems/AnalyticsSystem";
import { HudSystem } from "./systems/HudSystem";
import { StateManager } from "./systems/StateManager";
import type { GameServices } from "./systems/services";
import { BootScene } from "./scenes/BootScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { GameScene } from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { WaterSplashScene } from "./scenes/WaterSplashScene";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Unable to locate app root.");
}

app.innerHTML = `
  <div class="shell">
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">2.5D Phaser platformer • monsoon expressway mood</p>
        <h1>Shinchan Flight</h1>
        <p class="hero-body">
          Shinchan is hanging from Bochan's nose over a glowing Indian coastal road. Keep the swing stable,
          dodge traffic hazards and festival kites, and do not let the water claim the run.
        </p>
      </div>
      <div class="hero-actions">
        <button id="launch-run" class="primary-action">Launch Run</button>
        <button id="reset-stats" class="secondary-action">Reset Stats</button>
      </div>
    </header>

    <main class="experience-grid">
      <section class="stage-shell">
        <div class="stage-topline">
          <span>Bochan nose swing physics</span>
          <span>Water collision respawn</span>
          <span>Obstacle pool + wind zones</span>
        </div>
        <div id="game-root" class="game-root"></div>
      </section>

      <aside class="signal-rail">
        <section class="panel">
          <p class="panel-label">Live telemetry</p>
          <div class="metrics-grid">
            <article class="metric-card">
              <span>Distance</span>
              <strong id="metric-distance">0 m</strong>
            </article>
            <article class="metric-card">
              <span>Altitude</span>
              <strong id="metric-altitude">0%</strong>
            </article>
            <article class="metric-card">
              <span>Grip</span>
              <strong id="metric-grip">100%</strong>
            </article>
            <article class="metric-card">
              <span>Speed</span>
              <strong id="metric-speed">0 km/h</strong>
            </article>
            <article class="metric-card">
              <span>Wind</span>
              <strong id="metric-wind">Calm</strong>
            </article>
            <article class="metric-card">
              <span>Boost</span>
              <strong id="metric-boost">100%</strong>
            </article>
          </div>
        </section>

        <section class="panel">
          <p class="panel-label">Flight desk</p>
          <h2 id="status-title">Waiting for takeoff</h2>
          <p id="status-detail" class="status-detail">
            Launch the run to start the Bochan nose swing sequence.
          </p>
        </section>

        <section class="panel">
          <p class="panel-label">Persistent record</p>
          <div class="records-grid">
            <div>
              <span class="record-label">Best Distance</span>
              <strong id="best-distance">0 m</strong>
            </div>
            <div>
              <span class="record-label">Run Grade</span>
              <strong id="run-grade">Awaiting First Flight</strong>
            </div>
            <div>
              <span class="record-label">Total Runs</span>
              <strong id="total-runs">0</strong>
            </div>
          </div>
        </section>

        <section class="panel">
          <p class="panel-label">Event feed</p>
          <ul id="event-log" class="event-log"></ul>
        </section>
      </aside>
    </main>
  </div>
`;

const services: GameServices = {
  analytics: new AnalyticsSystem(),
  hud: new HudSystem(),
  stateManager: new StateManager(),
};
services.hud.renderPersistent(services.stateManager.getSnapshot());
services.hud.setStatus(
  "Waiting for takeoff",
  "Launch the run to start the Bochan nose swing sequence.",
);

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  width: 1280,
  height: 720,
  backgroundColor: "#08111d",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      gravity: {
        x: 0,
        y: 1.08,
      },
      enableSleeping: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, WaterSplashScene, GameOverScene],
  callbacks: {
    preBoot: (phaserGame) => {
      phaserGame.registry.set("services", services);
    },
  },
});

const launchButton = document.getElementById("launch-run");
const resetButton = document.getElementById("reset-stats");

launchButton?.addEventListener("click", () => {
  game.events.emit("ui-launch");
});

resetButton?.addEventListener("click", () => {
  const snapshot = services.stateManager.reset();
  services.analytics.track("stats_reset", {});
  services.hud.renderPersistent(snapshot);
  services.hud.renderEvents(services.analytics.getFeed());
  services.hud.setStatus("Stats reset", "Best run history cleared. Launch a fresh attempt.");
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    game.events.emit("ui-launch");
  }
});
