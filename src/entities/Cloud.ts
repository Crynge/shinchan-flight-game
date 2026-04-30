import Phaser from "phaser";

export class Cloud extends Phaser.GameObjects.Image {
  private driftSpeed = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, scale: number) {
    super(scene, x, y, "cloud-puff");
    this.setScale(scale);
    this.setAlpha(0.88);
    this.setDepth(1);
    scene.add.existing(this);
  }

  reset(x: number, y: number, driftSpeed: number, scale: number): void {
    this.setPosition(x, y);
    this.setScale(scale);
    this.driftSpeed = driftSpeed;
    this.setAlpha(0.5 + scale * 0.2);
  }

  updateCloud(delta: number, worldSpeed: number): void {
    this.x -= (this.driftSpeed + worldSpeed * 0.12) * (delta / 1000);
    if (this.x < -220) {
      this.x = 1440;
    }
  }
}
