import { describe, expect, it } from "vitest";
import { clamp, formatMeters, gradeRun, remap, smoothStep } from "../src/utils/gameMath";

describe("game math helpers", () => {
  it("clamps values inside the expected range", () => {
    expect(clamp(120, 0, 100)).toBe(100);
    expect(clamp(-2, 0, 100)).toBe(0);
    expect(clamp(52, 0, 100)).toBe(52);
  });

  it("remaps ranges proportionally", () => {
    expect(remap(5, 0, 10, 0, 100)).toBe(50);
  });

  it("eases values with smoothstep", () => {
    expect(smoothStep(0.5, 0, 1)).toBeCloseTo(0.5, 2);
    expect(smoothStep(0, 0, 1)).toBe(0);
    expect(smoothStep(1, 0, 1)).toBe(1);
  });

  it("formats meters and grades runs", () => {
    expect(formatMeters(804)).toBe("804 m");
    expect(gradeRun(980, 0)).toBe("Monsoon Legend");
    expect(gradeRun(520, 1)).toBe("Skyline Survivor");
  });
});
