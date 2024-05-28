export interface DecomposedTransform {
  translation: {
    x: number;
    y: number;
  };
  rotation: {
    deg: number;
  };
  scale: {
    x: number;
    y: number;
  };
}

export const rgbaToCssString = (color: RGBA, opacity: number = 1): string => {
  const { r, g, b, a } = color;

  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  const alpha = Math.round(a * opacity * 100);

  return rgbaOrHexConvert(red, green, blue, alpha);
};

export const rgbToCssString = (color: RGB, opacity: number = 1): string => {
  const { r, g, b } = color;

  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  const alpha = Math.round(opacity * 100);

  return rgbaOrHexConvert(red, green, blue, alpha);
};

const rgbaOrHexConvert = (
  red: number,
  green: number,
  blue: number,
  alpha: number
) => {
  return alpha === 100
    ? rgbToHex(red, green, blue)
    : `rgba(${red}, ${green}, ${blue}, ${alpha}%)`;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error(
      "Invalid RGB value. Each component must be between 0 and 255."
    );
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const toHex = (value: number): string => {
  const hex = value.toString(16).toUpperCase();
  return hex.length === 1 ? "0" + hex : hex;
};

export const decomposeTransform = (
  transform: Transform
): DecomposedTransform => {
  const [[a, b, tx], [c, d, ty]] = transform;

  const translation: [number, number] = [
    Number(tx.toFixed(3)),
    Number(ty.toFixed(3)),
  ];

  const scaleX = 1 / Math.sqrt(a * a + c * c);
  const scaleY = 1 / Math.sqrt(b * b + d * d);
  const rotationInRadians = Math.atan2(a, c) * 1;
  const rotationInDegrees = radiansToDegrees(rotationInRadians);

  return {
    translation: {
      x: translation[0],
      y: translation[1],
    },
    rotation: {
      deg: Number(rotationInDegrees.toFixed(3)),
    },
    scale: {
      x: Number(scaleX.toFixed(0)),
      y: Number(scaleY.toFixed(3)),
    },
  };
};

const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};
