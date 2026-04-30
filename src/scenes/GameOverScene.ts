import Phaser from "phaser";
import { formatMeters } from "../utils/gameMath";
import type { GameServices } from "../systems/services";

interface GameOverPayload {
  distance: number;
  elapsedMs: number;
  grade: string;
  reason: string;
  bestDistance: number;
}

export class GameOverScene extends Phaser.Scene {
  private listening = false;

  constructor() {
    super("gameover");
  }

  create(data: GameOverPayload): void {
    const services = this.registry.get("services") as GameServices;
    services.hud.setStatus("Run archived", "Launch again to chase a cleaner line above the water.");
    services.hud.renderEvents(services.analytics.getFeed());

    this.add.rectangle(640, 360, 1280, 720, 0x08111d, 0.92);
    this.add.rectangle(640, 350, 620, 360, 0x101f35, 0.92).setStrokeStyle(2, 0xffd979, 0.45);
    this.add.text(640, 190, "RUN COMPLETE", {
      color: "#fff4d3",
      fontFamily: "Rajdhani",
      fontSize: "62px",
      fontStyle: "700",
    }).setOrigin(0.5);
    this.add.text(640, 248, data.grade, {
      color: "#ffd979",
      fontFamily: "Sora",
      fontSize: "22px",
      fontStyle: "600",
    }).setOrigin(0.5);
    this.add.text(492, 322, "Distance", {
      color: "#8cb2d6",
      fontFamily: "Sora",
      fontSize: "18px",
    });
    this.add.text(784, 322, "Best", {
      color: "#8cb2d6",
      fontFamily: "Sora",
      fontSize: "18px",
    });
    this.add.text(490, 346, formatMeters(data.distance), {
      color: "#fff5dd",
      fontFamily: "Rajdhani",
      fontSize: "48px",
      fontStyle: "700",
    });
    this.add.text(782, 346, formatMeters(data.bestDistance), {
      color: "#fff5dd",
      fontFamily: "Rajdhani",
      fontSize: "48px",
      fontStyle: "700",
    });
    this.add.text(640, 440, data.reason, {
      color: "#c7dbf0",
      fontFamily: "Sora",
      fontSize: "18px",
      align: "center",
      wordWrap: { width: 520 },
    }).setOrigin(0.5);
    this.add.text(640, 526, "Press Launch Run, tap the stage, or hit Space for another attempt.", {
      color: "#ffe695",
      fontFamily: "Sora",
      fontSize: "18px",
      align: "center",
      wordWrap: { width: 520 },
    }).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.restart();
    });
    this.input.keyboard?.once("keydown-SPACE", () => {
      this.restart();
    });

    this.game.events.on("ui-launch", this.restart, this);
    this.listening = true;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.listening) {
        this.game.events.off("ui-launch", this.restart, this);
        this.listening = false;
      }
    });
  }

  private restart(): void {
    if (this.listening) {
      this.game.events.off("ui-launch", this.restart, this);
      this.listening = false;
    }

    this.scene.start("game");
  }
}
