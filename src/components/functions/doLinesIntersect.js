export default function doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Encontrar las ecuaciones de las dos líneas
    const A1 = y2 - y1;
    const B1 = x1 - x2;
    const C1 = A1 * x1 + B1 * y1;

    const A2 = y4 - y3;
    const B2 = x3 - x4;
    const C2 = A2 * x3 + B2 * y3;

    // Verificar si las dos líneas son paralelas
    const det = A1 * B2 - A2 * B1;
    if (det === 0) {
        return false;
    }

    // Encontrar el punto de intersección
    const x = (B2 * C1 - B1 * C2) / det;
    const y = (A1 * C2 - A2 * C1) / det;

    // Verificar si el punto de intersección está dentro de los límites de ambas líneas
    if (x < Math.min(x1, x2) || x > Math.max(x1, x2) ||
        x < Math.min(x3, x4) || x > Math.max(x3, x4) ||
        y < Math.min(y1, y2) || y > Math.max(y1, y2) ||
        y < Math.min(y3, y4) || y > Math.max(y3, y4)) {
        return false;
    }

    // Las dos líneas se intersectan
    return [x,y];
}