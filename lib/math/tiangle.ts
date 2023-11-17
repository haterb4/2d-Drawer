export function calculerLongueurTroisiemeCote(a: number, b: number, angleC: number): number {
    // Convertir l'angle de degrés à radians
    let angleEnRadians = (angleC * Math.PI) / 180;
  
    // Calculer la longueur du troisième côté en utilisant la loi des cosinus
    let c = Math.sqrt(a**2 + b**2 - 2 * a * b * Math.cos(angleEnRadians));
  
    return c;
}
  
export function calculerPerimetreTriangle(a: number, b: number, c: number): number {
    return a + b + c;
}

export function calculerSurfaceTriangle(a: number, b: number, c: number): number {
    let s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
  