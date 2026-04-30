import Phaser from "phaser";
import { clamp, lerp } from "../utils/gameMath";

export class Bochan extends Phaser.GameObjects.Container {
  private velocityY = 0;
  private energy = 100;
  private boostActive = false;
  private bodyShell: Phaser.GameObjects.Ellipse;
  private scarf: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const bodyShell = scene.add.ellipse(0, 0, 168, 96, 0xdbe8ff, 1);
    const scarf = scene.add.rectangle(-18, 26, 128, 20, 0x4e7cff, 1).setAngle(-5);
    const ear = scene.add.circle(-48, -12, 18, 0xdbe8ff, 1);
    const cheek = scene.add.circle(42, 16, 18, 0xffd3bf, 0.95);
    const nose = scene.add.circle(64, 6, 26, 0xf7efe6, 1);
    const noseTip = scene.add.circle(74, 10, 9, 0xb6c0d0, 1);
    const eye = scene.add.circle(28, -10, 8, 0x202433, 1);
    const mouth = scene.add.rectangle(26, 20, 30, 6, 0x2f3957, 1).setAngle(8);
    const bindi = scene.add.circle(10, -28, 4, 0xff6c44, 1);

    super(scene, x, y, [bodyShell, scarf, ear, cheek, nose, noseTip, eye, mouth, bindi]);

    this.bodyShell = bodyShell;
    this.scarf = scarf;

    this.setDepth(6);
    scene.add.existing(this);
  }

  updateFlight(liftIntent: number, delta: number, boostRequested: boolean): void {
    const seconds = delta / 1000;
    this.boostActive = boostRequested && this.energy > 14;

    if (this.boostActive) {
      this.energy = clamp(this.energy - 30 * seconds, 0, 100);
    } else {
      this.energy = clamp(this.energy + 16 * seconds, 0, 100);
    }

    this.velocityY += -liftIntent * 920 * seconds;
    this.velocityY *= this.boostActive ? 0.92 : 0.9;
    this.y = clamp(this.y + this.velocityY * seconds, 132, 420);

    this.rotation = lerp(this.rotation, Phaser.Math.DegToRad(this.velocityY * 0.032), 0.16);
    this.bodyShell.scaleY = this.boostActive ? 0.97 : 1;
    this.scarf.scaleX = this.boostActive ? 1.08 : 1;
  }

  getNoseAnchor(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.x + 74, this.y + 10);
  }

  getAltitudeRatio(): number {
    return clamp(1 - (this.y - 132) / 288, 0, 1);
  }

  getBoostCharge(): number {
    return this.energy;
  }

  getCruiseSpeed(): number {
    return 132 + (this.boostActive ? 38 : 0);
  }

  isBoosting(): boolean {
    return this.boostActive;
  }
}
