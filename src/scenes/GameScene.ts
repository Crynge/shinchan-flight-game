import Phaser from "phaser";
import flightPatternData from "../../assets/maps/flight-pattern.json";
import { Bochan } from "../entities/Bochan";
import { Cloud } from "../entities/Cloud";
import { Obstacle, type ObstacleVariant } from "../entities/Obstacle";
import { Shinchan } from "../entities/Shinchan";
import { Water } from "../entities/Water";
import { AudioSystem } from "../systems/AudioSystem";
import { InputSystem } from "../systems/InputSystem";
import type { GameServices } from "../systems/services";

interface WindZone {
  start: number;
  end: number;
  force: number;
  label: string;
}

interface FlightPattern {
  waterline: number;
  lanes: number[];
  windZones: WindZone[];
  obstacles: Array<{
    variant: ObstacleVariant;
    lane: number;
    speedBias: number;
    label: string;
  }>;
}

const flightPattern = flightPatternData as FlightPattern;
export class GameScene extends Phaser.Scene {
  private services!: GameServices;
  private bochan!: Bochan;
  private shinchan!: Shinchan;
  private water!: Water;
  private rope!: Phaser.GameObjects.Graphics;
  private skyline!: Phaser.GameObjects.TileSprite;
  private inputSystem = new InputSystem();
  private audio = new AudioSystem();
  private clouds: Cloud[] = [];
  private obstacles: Obstacle[] = [];
  private anchorBody!: MatterJS.BodyType;
  private runDistance = 0;
  private elapsedMs = 0;
  private spawnTimer = 1400;
  private warningCooldown = 0;
  private lastBoostState = false;
  private ended = false;

  constructor() {
    super("game");
  }

  create(): void {
    this.services = this.registry.get("services") as GameServices;
    this.services.analytics.beginSession();
    this.services.analytics.track("run_started", {});
    this.services.hud.setStatus(
      "Grip the wind",
      "Keep Bochan clear of kites, trucks, and billboards. Water means game over.",
    );
    this.services.hud.renderEvents(this.services.analytics.getFeed());

    this.cameras.main.setBackgroundColor("#0c1220");
    this.add.rectangle(640, 164, 1280, 328, 0x16243f, 1).setDepth(-2);
    this.add.rectangle(640, 308, 1280, 224, 0x0d1b2c, 1).setDepth(-2).setAlpha(0.72);
    this.skyline = this.add
      .tileSprite(640, 326, 1500, 180, "cityline-tile")
      .setDepth(-1)
      .setAlpha(0.68);
    this.water = new Water(this, flightPattern.waterline);

    for (let index = 0; index < 6; index += 1) {
      const cloud = new Cloud(
        this,
        180 + index * 210,
        90 + (index % 3) * 48,
        0.9 + (index % 2) * 0.22,
      );
      cloud.reset(cloud.x, cloud.y, 26 + index * 6, cloud.scale);
      this.clouds.push(cloud);
    }

    this.bochan = new Bochan(this, 340, 240);
    this.shinchan = new Shinchan(this, 434, 332);
    this.anchorBody = this.matter.add.circle(
      this.bochan.getNoseAnchor().x,
      this.bochan.getNoseAnchor().y,
      10,
      {
        isStatic: true,
        isSensor: true,
      },
    );
    this.matter.add.constraint(this.anchorBody, this.shinchan.body as MatterJS.BodyType, 106, 0.72, {
      damping: 0.05,
      pointB: { x: 0, y: -28 },
    });
    this.rope = this.add.graphics().setDepth(6);

    this.inputSystem.bind(this);
    this.audio.unlock();
    this.audio.playCue("launch");

    this.obstacles = Array.from({ length: 8 }, () => new Obstacle(this));
    this.matter.world.setGravity(0, 1.08);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.obstacles.forEach((obstacle) => obstacle.destroy());
      this.clouds.forEach((cloud) => cloud.destroy());
      this.rope.destroy();
      this.matter.body.setPosition(this.anchorBody, new Phaser.Math.Vector2(-500, -500));
    });
  }

  update(_: number, delta: number): void {
    if (this.ended) {
      return;
    }

    this.elapsedMs += delta;
    this.warningCooldown = Math.max(0, this.warningCooldown - delta);

    const liftIntent = this.inputSystem.getLiftIntent();
    const boostRequested = this.inputSystem.wantsBoost();
    this.bochan.updateFlight(liftIntent, delta, boostRequested);

    if (this.bochan.isBoosting() && !this.lastBoostState) {
      this.audio.playCue("boost");
      this.services.analytics.track("boost_triggered", {
        distance: Math.round(this.runDistance),
      });
    }
    this.lastBoostState = this.bochan.isBoosting();

    const anchor = this.bochan.getNoseAnchor();
    this.matter.body.setPosition(this.anchorBody, new Phaser.Math.Vector2(anchor.x, anchor.y));

    const windZone = this.getActiveWindZone();
    this.shinchan.applyWind(windZone.force * delta);
    this.shinchan.setTint(this.bochan.isBoosting() ? 0xfff1aa : 0xffffff);

    const speedKmh = this.bochan.getCruiseSpeed() + Math.min(56, this.runDistance * 0.08);
    const speedMps = speedKmh / 3.6;
    this.runDistance += speedMps * (delta / 1000);

    this.skyline.tilePositionX += speedMps * (delta / 1000) * 18;
    this.water.update(delta, speedKmh);
    this.clouds.forEach((cloud) => cloud.updateCloud(delta, speedKmh));

    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      this.spawnObstacle(speedKmh);
      this.spawnTimer = Math.max(620, 1320 - this.runDistance * 0.6);
    }

    const shinchanBounds = this.shrinkBounds(this.shinchan.getBounds(), 14);
    for (const obstacle of this.obstacles) {
      obstacle.updateObstacle(delta);
      if (
        obstacle.active &&
        Phaser.Geom.Intersects.RectangleToRectangle(shinchanBounds, obstacle.getHitbox())
      ) {
        this.failRun(`Shinchan clipped the ${obstacle.getVariant()} and lost the grip.`);
        return;
      }
    }

    const grip = this.shinchan.getGripStrength(anchor);
    if (grip < 0.28 && this.warningCooldown <= 0) {
      this.audio.playCue("warning");
      this.warningCooldown = 2200;
      this.services.analytics.track("grip_warning", {
        distance: Math.round(this.runDistance),
      });
      this.services.hud.setStatus(
        "Grip warning",
        "Shinchan is stretching too far from the nose anchor. Climb smoother or use the slipstream less aggressively.",
      );
    }

    if (this.shinchan.y >= this.water.surfaceY - 10) {
      this.failRun("Shinchan slipped under Bochan and splashed into the monsoon water.");
      return;
    }

    this.renderRope(anchor);
    this.services.hud.renderRun({
      distance: this.runDistance,
      altitude: this.bochan.getAltitudeRatio(),
      grip,
      speed: speedKmh,
      windLabel: windZone.label,
      boost: this.bochan.getBoostCharge(),
    });
    this.services.hud.renderEvents(this.services.analytics.getFeed());
  }

  private getActiveWindZone(): WindZone {
    const loopedDistance = this.runDistance % 1080;
    return (
      flightPattern.windZones.find(
        (zone) => loopedDistance >= zone.start && loopedDistance < zone.end,
      ) ?? flightPattern.windZones[0]
    );
  }

  private spawnObstacle(speedKmh: number): void {
    const obstacle = this.obstacles.find((entry) => !entry.active);
    if (!obstacle) {
      return;
    }

    const pattern = Phaser.Utils.Array.GetRandom(flightPattern.obstacles);
    const laneY = flightPattern.lanes[pattern.lane];
    const yOffset =
      pattern.variant === "billboard"
        ? -12
        : pattern.variant === "kite"
          ? -18
          : 42;

    obstacle.spawn(
      1460,
      laneY + yOffset,
      pattern.variant,
      speedKmh * pattern.speedBias,
    );

    this.services.analytics.track("obstacle_spawned", {
      variant: pattern.variant,
      lane: pattern.lane,
    });
  }

  private renderRope(anchor: Phaser.Math.Vector2): void {
    const gripPoint = this.shinchan.getGripPoint();
    const controlPoint = new Phaser.Math.Vector2(
      (anchor.x + gripPoint.x) / 2 + 18,
      (anchor.y + gripPoint.y) / 2 + 8,
    );
    const ropeCurve = new Phaser.Curves.QuadraticBezier(anchor, controlPoint, gripPoint);
    this.rope.clear();
    this.rope.lineStyle(6, 0xffd879, 0.95);
    this.rope.strokePoints(ropeCurve.getPoints(22), false, false);
  }

  private shrinkBounds(bounds: Phaser.Geom.Rectangle, inset: number): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      bounds.x + inset,
      bounds.y + inset,
      bounds.width - inset * 2,
      bounds.height - inset * 2,
    );
  }

  private failRun(reason: string): void {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this.audio.playCue("splash");
    this.services.analytics.track("run_failed", {
      distance: Math.round(this.runDistance),
      reason,
    });
    const snapshot = this.services.stateManager.recordRun(this.runDistance, 1);
    this.services.hud.renderPersistent(snapshot);
    this.services.hud.setStatus("Splashdown", reason);
    this.services.hud.renderEvents(this.services.analytics.getFeed());

    this.time.delayedCall(420, () => {
      this.scene.start("splash", {
        distance: this.runDistance,
        elapsedMs: this.elapsedMs,
        grade: snapshot.lastGrade,
        reason,
        bestDistance: snapshot.bestDistance,
      });
    });
  }
}
