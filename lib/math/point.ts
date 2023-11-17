interface Point {
    x: number;
    y: number
}
export const dotDistance = (a: Point, b: Point): number => {
    const distance = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  return distance;
}

export const convertToDot = (dot: {
    x: string;
    y: string
}): Point => {
    return JSON.parse(JSON.stringify(dot)) as Point;
}