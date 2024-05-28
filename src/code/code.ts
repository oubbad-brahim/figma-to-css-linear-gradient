import { decomposeTransform, rgbToCssString, rgbaToCssString } from "./utils";

figma.showUI(__html__, { themeColors: true, width: 400, height: 200 });

figma.loadAllPagesAsync();

if (figma.currentPage.selection.length != 0) {
  generateBackground();
}

figma.on("selectionchange", () => {
  generateBackground();
});

figma.on("documentchange", () => {
  generateBackground();
});

figma.ui.onmessage = (msg: { type: string; message: string }) => {
  if (msg.type === "toast-message") {
    figma.notify(msg.message);
  }
};

function generateBackground() {
  let background = "";

  if (figma.currentPage.selection.length == 1) {
    const node = figma.currentPage.selection[0];
    const minimalFillsMixin = node as MinimalFillsMixin;
    const fills = minimalFillsMixin.fills as Paint[];

    const filteredFills = [...fills]
      .reverse()
      .filter(
        (fill) =>
          fill.visible &&
          (fill.type === "SOLID" || fill.type === "GRADIENT_LINEAR")
      );

    const fillsSize = filteredFills.length;
    const fillsLastIndex = filteredFills.length - 1;

    filteredFills.forEach((fill, index) => {
      if (index === 0) {
        background += "background:";
      }

      switch (fill.type) {
        case "SOLID":
          if (fillsSize === 1) background += ` ${getSolid(fill)}`;
          else
            background += ` linear-gradient(${getSolid(fill)}, ${getSolid(
              fill
            )})`;
          break;
        case "GRADIENT_LINEAR":
          background += ` ${getGradientLinear(fill)}`;
          break;

        default:
          break;
      }

      if (index === fillsLastIndex) {
        background += ";";
      } else {
        background += ",";
      }
    });
  }

  figma.ui.postMessage(background);
}

function getGradientLinear(fill: GradientPaint): string {
  const { gradientTransform, gradientStops, opacity } = fill;

  const colorStopsSize = gradientStops.length;
  const colorStopsLastIndex = gradientStops.length - 1;

  if (colorStopsSize === 1) {
    const color = gradientStops[0].color;
    const rgba = rgbaToCssString(color, opacity);
    console.log(rgba);

    return `linear-gradient(${rgba}, ${rgba})`;
  }

  const colorStops = gradientStops.reduce((result, colorStop, index) => {
    const color = colorStop.color;
    const position = colorStop.position;

    const rgba = rgbaToCssString(color, opacity);
    const stop = Math.round(position * 100);

    if (index === colorStopsLastIndex) {
      return result + `${rgba} ${stop}%)`;
    } else {
      return result + `${rgba} ${stop}%, `;
    }
  }, "");

  const { rotation } = decomposeTransform(gradientTransform);
  const deg = rotation.deg;

  return `linear-gradient(${deg}deg, ${colorStops}`;
}

function getSolid(fill: SolidPaint): string {
  const { color, opacity } = fill;
  const rgb = rgbToCssString(color, opacity);
  return rgb;
}
