import getStroke from "perfect-freehand";
import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughGenerator } from "roughjs/bin/generator";
import rough from "roughjs/bundled/rough.esm";

const generator: RoughGenerator = rough.generator();

type Stroke = number[][];

export interface Coordinate {
  x:number,
  y:number,
}

interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Element {
  id: string;
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement?: any; // Adjust this type as per the actual type of roughElement
  points?: { x: number; y: number }[];
  text?: string;
}

export const getSvgPathFromStroke = (stroke: Stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

export const resizedCoordinates = (
  clientX: number,
  clientY: number,
  position: string,
  coordinates: Coordinates
) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

export const drawElement = (roughCanvas:RoughCanvas, context, element) => {
  switch (element.type) {
    case "line":
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      break;
    case "pencil":
      const stroke = getSvgPathFromStroke(getStroke(element.points));
      context.fill(new Path2D(stroke));
      break;
    case "text":
      context.textBaseline = "top";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
};

export const distance = (
  a: { x: number; y: number },
  b: { x: number; y: number }
) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance: number = 1
) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

export const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  name: string
) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

export const positionWithinElement = (
  x: number,
  y: number,
  element: Element
) => {
  const { type, x1, x2, y1, y2, points } = element;
  switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside =
        x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "pencil":
      if (points) {
        const betweenAnyPoint = points.some((point, index) => {
          const nextPoint = points[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      }
      return null;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};


export const getElementAtPosition = (x: number, y: number, elements) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};

export const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

export const cursorForPosition = (position: string) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

export const createElement = (
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string
) : Element => {
  switch (type) {
    case "line":
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        roughElement: generator.line(x1, y1, x2, y2),
      };
    case "rectangle":
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1),
      };
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }],x1,y1,x2:x1,y2:y1 };
    case "text":
      return { id, type, x1, y1, x2, y2, text: "" };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

export const adjustmentRequired = (type) =>
  ["line", "rectangle"].includes(type);
