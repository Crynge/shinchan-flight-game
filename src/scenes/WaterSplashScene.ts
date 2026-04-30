import Phaser from "phaser";

interface SplashPayload {
  distance: number;
  elapsedMs: number;
  grade: string;
  reason: string;
  bestDistance: number;
}

export class WaterSplashScene extends Phaser.Scene {
  constructor() {
    super("splash");
  }

  create(data: SplashPayload): void {
    this.cameras.main.setBackgroundColor("#06111c");
    this.add.tileSprite(640, 556, 1480, 328, "water-tile").setAlpha(0.96);
    this.add.tileSprite(640, 500, 1480, 48, "foam-tile");
    this.add.text(640, 118, "SPLASHDOWN", {
      color: "#fff5da",
      fontFamily: "Rajdhani",
      fontSize: "72px",
      fontStyle: "700",
    }).setOrigin(0.5);
    this.add.text(640, 190, data.reason, {
      color: "#a6cee9",
      fontFamily: "Sora",
      fontSize: "20px",
      wordWrap: { width: 720 },
      align: "center",
    }).setOrigin(0.5);

    const shinchan = this.add.image(640, 210, "shinchan").setScale(1.3);
    const ringOne = this.add.circle(640, 546, 12, 0xffffff, 0.22);
    const ringTwo = this.add.circle(640, 546, 12, 0x91f1ff, 0.3);

    this.tweens.add({
      targets: shinchan,
      y: 498,
      angle: 108,
      duration: 860,
      ease: "Quad.easeIn",
    });
    this.tweens.add({
      targets: [ringOne, ringTwo],
      scaleX: 8,
      scaleY: 2.2,
      alpha: 0,
      duration: 840,
      delay: 720,
      ease: "Quad.easeOut",
    });

    this.time.delayedCall(1450, () => {
      this.scene.start("gameover", data);
    });
  }
}
