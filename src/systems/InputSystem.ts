import Phaser from "phaser";

export class InputSystem {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private ascendKey?: Phaser.Input.Keyboard.Key;
  private descendKey?: Phaser.Input.Keyboard.Key;
  private boostKey?: Phaser.Input.Keyboard.Key;
  private pointerHeld = false;

  bind(scene: Phaser.Scene): void {
    this.cursors = scene.input.keyboard?.createCursorKeys();
    this.ascendKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.descendKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.boostKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.pointerHeld = true;
      if (pointer.rightButtonDown()) {
        this.pointerHeld = false;
      }
    });

    scene.input.on("pointerup", () => {
      this.pointerHeld = false;
    });
  }

  getLiftIntent(): number {
    const upPressed =
      this.cursors?.up.isDown || this.ascendKey?.isDown || this.pointerHeld;
    const downPressed = this.cursors?.down.isDown || this.descendKey?.isDown;

    if (upPressed && !downPressed) {
      return 1;
    }

    if (downPressed && !upPressed) {
      return -1;
    }

    return 0;
  }

  wantsBoost(): boolean {
    return Boolean(this.cursors?.space?.isDown || this.boostKey?.isDown);
  }
}
