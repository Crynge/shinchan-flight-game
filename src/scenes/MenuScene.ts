import Phaser from "phaser";
import type { GameServices } from "../systems/services";

export class MenuScene extends Phaser.Scene {
  private launched = false;

  constructor() {
    super("menu");
  }

  create(): void {
    const services = this.registry.get("services") as GameServices;
    const snapshot = services.stateManager.getSnapshot();

    services.hud.renderPersistent(snapshot);
    services.hud.setStatus(
      "Ready for takeoff",
      "Launch the run, then hold W or the Up Arrow to climb while Shinchan swings below.",
    );
    services.analytics.track("menu_viewed", { bestDistance: Math.round(snapshot.bestDistance) });
    services.hud.renderEvents(services.analytics.getFeed());

    this.add.rectangle(640, 360, 1280, 720, 0x07111c, 1);
    this.add.tileSprite(640, 270, 1600, 180, "cityline-tile").setAlpha(0.42);
    this.add.text(86, 84, "SHINCHAN FLIGHT", {
      color: "#fff4dd",
      fontFamily: "Rajdhani",
      fontSize: "68px",
      fontStyle: "700",
    });
    this.add.text(90, 156, "Bochan is airborne. Shinchan is hanging from the nose. The water is waiting.", {
      color: "#acc7e8",
      fontFamily: "Sora",
      fontSize: "20px",
      wordWrap: { width: 560 },
    });
    this.add.text(90, 236, "Controls", {
      color: "#ffe891",
      fontFamily: "Rajdhani",
      fontSize: "30px",
      fontStyle: "700",
    });
    this.add.text(90, 278, "W / ↑ climb\nS / ↓ descend\nSpace / Shift slipstream boost\nTap the canvas to grab height on mobile", {
      color: "#f3f7ff",
      fontFamily: "Sora",
      fontSize: "18px",
      lineSpacing: 12,
    });
    this.add.text(90, 430, "Indian monsoon moodboard", {
      color: "#ffe891",
      fontFamily: "Rajdhani",
      fontSize: "30px",
      fontStyle: "700",
    });
    this.add.text(
      90,
      474,
      "Sea-link glow, humid skies, crosswinds from the ghats, neon road dividers, and festival kites over the expressway.",
      {
        color: "#f3f7ff",
        fontFamily: "Sora",
        fontSize: "18px",
        wordWrap: { width: 620 },
      },
    );
    this.add.text(844, 130, "Best Run", {
      color: "#8cb2d6",
      fontFamily: "Sora",
      fontSize: "18px",
    });
    this.add.text(842, 154, `${Math.round(snapshot.bestDistance)} m`, {
      color: "#fff7de",
      fontFamily: "Rajdhani",
      fontSize: "56px",
      fontStyle: "700",
    });
    this.add.text(844, 244, "Press Launch Run or tap anywhere inside the stage.", {
      color: "#ffd979",
      fontFamily: "Sora",
      fontSize: "18px",
      wordWrap: { width: 280 },
    });

    this.input.once("pointerdown", () => {
      this.beginRun();
    });
    this.input.keyboard?.once("keydown-SPACE", () => {
      this.beginRun();
    });

    this.game.events.on("ui-launch", this.beginRun, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off("ui-launch", this.beginRun, this);
    });
  }

  private beginRun(): void {
    if (this.launched) {
      return;
    }

    this.launched = true;
    this.scene.start("game");
  }
}
