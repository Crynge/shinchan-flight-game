import Phaser from "phaser";

export type ObstacleVariant = "truck" | "rickshaw" | "billboard" | "kite";

const textureByVariant: Record<ObstacleVariant, string> = {
  truck: "truck-obstacle",
  rickshaw: "rickshaw-obstacle",
  billboard: "billboard-obstacle",
  kite: "kite-obstacle",
};

export class Obstacle extends Phaser.GameObjects.Image {
  private velocity = 0;
  private activeVariant: ObstacleVariant = "truck";

  constructor(scene: Phaser.Scene) {
    super(scene, -320, -320, "truck-obstacle");
    this.setActive(false);
    this.setVisible(false);
    this.setDepth(5);
    scene.add.existing(this);
  }

  spawn(x: number, y: number, variant: ObstacleVariant, velocity: number): void {
    this.activeVariant = variant;
    this.velocity = velocity;
    this.setTexture(textureByVariant[variant]);
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setAlpha(1);
  }

  updateObstacle(delta: number): void {
    if (!this.active) {
      return;
    }

    this.x -= this.velocity * (delta / 1000);
    if (this.x < -260) {
      this.recycle();
    }
  }

  recycle(): void {
    this.setActive(false);
    this.setVisible(false);
    this.x = -320;
    this.y = -320;
  }

  getVariant(): ObstacleVariant {
    return this.activeVariant;
  }

  getHitbox(): Phaser.Geom.Rectangle {
    const bounds = this.getBounds();
    const padding = this.activeVariant === "kite" ? 18 : 26;
    return new Phaser.Geom.Rectangle(
      bounds.x + padding,
      bounds.y + padding,
      bounds.width - padding * 2,
      bounds.height - padding * 2,
    );
  }
}
