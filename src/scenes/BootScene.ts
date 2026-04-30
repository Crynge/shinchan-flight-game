import Phaser from "phaser";

const generateTexture = (
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (graphics: Phaser.GameObjects.Graphics) => void,
): void => {
  if (scene.textures.exists(key)) {
    return;
  }

  const graphics = scene.add.graphics({ x: 0, y: 0 });
  graphics.setVisible(false);
  draw(graphics);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
};

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#08111d");
    this.generateArtPack();
    this.scene.start("menu");
  }

  private generateArtPack(): void {
    generateTexture(this, "shinchan", 86, 116, (graphics) => {
      graphics.fillStyle(0x2f2322, 1);
      graphics.fillCircle(40, 16, 16);
      graphics.fillStyle(0xf7d0b2, 1);
      graphics.fillCircle(42, 26, 20);
      graphics.fillStyle(0x1f2230, 1);
      graphics.fillCircle(34, 26, 3);
      graphics.fillCircle(52, 26, 3);
      graphics.fillStyle(0xe84e43, 1);
      graphics.fillRoundedRect(18, 42, 48, 26, 8);
      graphics.fillStyle(0xf4cd48, 1);
      graphics.fillRoundedRect(20, 68, 44, 18, 6);
      graphics.fillStyle(0xf7d0b2, 1);
      graphics.fillRect(22, 84, 10, 24);
      graphics.fillRect(52, 84, 10, 24);
      graphics.fillStyle(0xf7f7ff, 1);
      graphics.fillRect(18, 60, 8, 10);
      graphics.fillRect(58, 60, 8, 10);
      graphics.fillStyle(0x2d3144, 1);
      graphics.fillRect(18, 106, 12, 6);
      graphics.fillRect(50, 106, 12, 6);
      graphics.fillStyle(0xf7d0b2, 1);
      graphics.fillRect(8, 54, 10, 26);
      graphics.fillRect(66, 54, 10, 22);
    });

    generateTexture(this, "cloud-puff", 240, 120, (graphics) => {
      graphics.fillStyle(0xe8f2ff, 1);
      graphics.fillEllipse(80, 74, 98, 56);
      graphics.fillEllipse(132, 62, 120, 64);
      graphics.fillEllipse(168, 78, 90, 48);
      graphics.fillEllipse(116, 88, 180, 40);
    });

    generateTexture(this, "cityline-tile", 512, 180, (graphics) => {
      graphics.fillStyle(0x12243b, 1);
      graphics.fillRect(0, 42, 38, 138);
      graphics.fillRect(44, 72, 34, 108);
      graphics.fillRect(86, 18, 52, 162);
      graphics.fillRect(146, 62, 28, 118);
      graphics.fillRect(186, 36, 44, 144);
      graphics.fillRect(236, 54, 36, 126);
      graphics.fillRect(282, 22, 64, 158);
      graphics.fillRect(356, 80, 26, 100);
      graphics.fillRect(390, 42, 48, 138);
      graphics.fillRect(446, 66, 28, 114);
      graphics.fillRect(478, 12, 34, 168);
      graphics.fillStyle(0xffd25f, 0.8);
      for (let x = 10; x < 512; x += 22) {
        for (let y = 50; y < 170; y += 18) {
          if ((x + y) % 3 === 0) {
            graphics.fillRect(x, y, 4, 8);
          }
        }
      }
    });

    generateTexture(this, "water-tile", 512, 240, (graphics) => {
      graphics.fillStyle(0x0a4365, 1);
      graphics.fillRect(0, 0, 512, 240);
      graphics.lineStyle(4, 0x1dc2ff, 0.35);
      for (let y = 18; y < 240; y += 28) {
        graphics.beginPath();
        graphics.moveTo(0, y);
        for (let x = 0; x <= 512; x += 32) {
          graphics.lineTo(x, y + Math.sin((x + y) * 0.06) * 6);
        }
        graphics.strokePath();
      }
    });

    generateTexture(this, "foam-tile", 512, 42, (graphics) => {
      graphics.fillStyle(0xdcfbff, 0.9);
      graphics.fillRect(0, 24, 512, 18);
      graphics.fillStyle(0xffffff, 0.7);
      for (let x = 0; x < 512; x += 28) {
        graphics.fillCircle(x + 10, 18 + (x % 3), 8);
      }
    });

    generateTexture(this, "road-tile", 512, 108, (graphics) => {
      graphics.fillStyle(0x2c2f3d, 1);
      graphics.fillRect(0, 0, 512, 108);
      graphics.fillStyle(0x1a1d28, 1);
      graphics.fillRect(0, 68, 512, 40);
      graphics.lineStyle(4, 0xadb6c9, 0.14);
      for (let y = 10; y < 100; y += 14) {
        graphics.beginPath();
        graphics.moveTo(0, y);
        graphics.lineTo(512, y);
        graphics.strokePath();
      }
    });

    generateTexture(this, "divider-tile", 256, 16, (graphics) => {
      graphics.fillStyle(0xfff08c, 1);
      graphics.fillRect(0, 6, 48, 4);
      graphics.fillRect(68, 6, 48, 4);
      graphics.fillRect(136, 6, 48, 4);
      graphics.fillRect(204, 6, 48, 4);
    });

    generateTexture(this, "truck-obstacle", 220, 120, (graphics) => {
      graphics.fillStyle(0xff9040, 1);
      graphics.fillRoundedRect(22, 44, 124, 46, 12);
      graphics.fillStyle(0x2b4b8b, 1);
      graphics.fillRoundedRect(136, 54, 58, 36, 10);
      graphics.fillStyle(0xfff7e8, 1);
      graphics.fillRoundedRect(148, 60, 30, 18, 4);
      graphics.fillStyle(0x232431, 1);
      graphics.fillCircle(56, 96, 16);
      graphics.fillCircle(144, 96, 16);
      graphics.fillCircle(182, 96, 14);
    });

    generateTexture(this, "rickshaw-obstacle", 164, 104, (graphics) => {
      graphics.fillStyle(0x0dca9f, 1);
      graphics.fillRoundedRect(18, 44, 98, 38, 12);
      graphics.fillStyle(0xf7cd39, 1);
      graphics.fillRoundedRect(22, 24, 104, 26, 8);
      graphics.fillStyle(0xffffff, 0.95);
      graphics.fillRoundedRect(40, 50, 54, 16, 4);
      graphics.fillStyle(0x232431, 1);
      graphics.fillCircle(42, 88, 14);
      graphics.fillCircle(102, 88, 14);
      graphics.fillCircle(132, 88, 12);
    });

    generateTexture(this, "billboard-obstacle", 180, 172, (graphics) => {
      graphics.fillStyle(0x3a3f58, 1);
      graphics.fillRect(76, 48, 14, 120);
      graphics.fillStyle(0xff5a57, 1);
      graphics.fillRoundedRect(18, 10, 144, 70, 12);
      graphics.fillStyle(0xfff7cf, 1);
      graphics.fillRoundedRect(30, 22, 120, 14, 6);
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillRoundedRect(30, 44, 90, 12, 6);
      graphics.fillRoundedRect(30, 60, 76, 10, 5);
    });

    generateTexture(this, "kite-obstacle", 112, 112, (graphics) => {
      graphics.fillStyle(0xff77c5, 1);
      graphics.fillTriangle(56, 10, 96, 56, 56, 102);
      graphics.fillStyle(0xffdd68, 1);
      graphics.fillTriangle(56, 10, 16, 56, 56, 102);
      graphics.lineStyle(4, 0xf7f7ff, 0.9);
      graphics.beginPath();
      graphics.moveTo(56, 102);
      graphics.lineTo(56, 140);
      graphics.strokePath();
    });
  }
}
