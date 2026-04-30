import Phaser from "phaser";
import { clamp } from "../utils/gameMath";

export class Shinchan extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "shinchan");
    scene.add.existing(this);

    this.setDepth(7);
    this.setFrictionAir(0.018);
    this.setBounce(0.2);
    this.setScale(1);
    this.setMass(1.8);
  }

  applyWind(forceX: number): void {
    this.applyForce(new Phaser.Math.Vector2(forceX, 0));
  }

  getGripStrength(anchor: Phaser.Math.Vector2): number {
    const distance = Phaser.Math.Distance.Between(this.x, this.y, anchor.x, anchor.y);
    return clamp(1 - (distance - 90) / 120, 0, 1);
  }

  getGripPoint(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.x + 3, this.y - 26);
  }
}
