figma.showUI(__html__, { width: 300, height: 200 });

figma.ui.onmessage = (msg: { type: string; count: number }) => {
  if (msg.type === "generate-gradient") {
    figma.currentPage.selection.forEach((node) => {
      const minimalFillsMixin = node as MinimalFillsMixin;
      const fills = minimalFillsMixin.fills as Paint[];

      fills.forEach((fill) => {
        if (fill.type === "GRADIENT_LINEAR") {
          const gradientTransform = fill.gradientTransform;
          const colorStopsLastIndex = fill.gradientStops.length - 1;
          const colorStops = fill.gradientStops.reduce(
            (result, colorStop, index) => {
              const color = colorStop.color;
              const position = colorStop.position;

              const rgba = rgbaToCssString(color);
              const stop = Math.round(position * 100);

              if (index === colorStopsLastIndex) {
                return result + `${rgba} ${stop}%)`;
              } else {
                return result + `${rgba} ${stop}%, `;
              }
            },
            ""
          );
          const { rotation, scale, translation } =
            decomposeTransform(gradientTransform);
          console.log(scale, translation);

          const deg = rotation.deg;
          const linearGradient = `linear-gradient(${deg}deg, ${colorStops}`;
          figma.ui.postMessage(linearGradient);
        }
      });
    });
  }
};

interface DecomposedTransform {
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

function rgbaToCssString(color: RGBA): string {
  const red = Math.round(color.r * 255);
  const green = Math.round(color.g * 255);
  const blue = Math.round(color.b * 255);
  const alpha = Math.round(color.a * 100);

  return `rgba(${red}, ${green}, ${blue}, ${alpha}%)`;
}

function decomposeTransform(transform: Transform): DecomposedTransform {
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
}

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
