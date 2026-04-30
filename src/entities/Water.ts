import Phaser from "phaser";

export class Water {
  readonly surfaceY: number;
  private water: Phaser.GameObjects.TileSprite;
  private foam: Phaser.GameObjects.TileSprite;
  private road: Phaser.GameObjects.TileSprite;
  private divider: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene, surfaceY: number) {
    this.surfaceY = surfaceY;
    this.road = scene.add.tileSprite(640, surfaceY - 102, 1480, 108, "road-tile").setDepth(2);
    this.divider = scene.add
      .tileSprite(640, surfaceY - 122, 1480, 16, "divider-tile")
      .setDepth(3)
      .setAlpha(0.95);
    this.water = scene.add.tileSprite(640, surfaceY + 70, 1480, 240, "water-tile").setDepth(0);
    this.foam = scene.add.tileSprite(640, surfaceY - 8, 1480, 42, "foam-tile").setDepth(4);
  }

  update(delta: number, worldSpeed: number): void {
    const movement = worldSpeed * (delta / 1000);
    this.road.tilePositionX += movement * 1.3;
    this.divider.tilePositionX += movement * 1.8;
    this.water.tilePositionX += movement * 0.45;
    this.foam.tilePositionX += movement * 0.8;
  }
}
