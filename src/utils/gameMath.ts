export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, amount: number): number =>
  from + (to - from) * amount;

export const remap = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
): number => {
  if (inputMax === inputMin) {
    return outputMin;
  }

  const progress = (value - inputMin) / (inputMax - inputMin);
  return outputMin + progress * (outputMax - outputMin);
};

export const smoothStep = (value: number, edge0: number, edge1: number): number => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
};

export const formatMeters = (meters: number): string => `${Math.round(meters).toLocaleString()} m`;

export const gradeRun = (distance: number, falls: number): string => {
  if (distance >= 950 && falls === 0) {
    return "Monsoon Legend";
  }

  if (distance >= 720 && falls <= 1) {
    return "Causeway Ace";
  }

  if (distance >= 480) {
    return "Skyline Survivor";
  }

  if (distance >= 250) {
    return "Nose Grip Rookie";
  }

  return "Splash Trainee";
};

export const createSessionId = (): string =>
  `run-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
