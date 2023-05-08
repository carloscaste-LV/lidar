

const lines = [];

const centers = []; // Array para almacenar los centros de las figuras generadas
;


 function generateRandomPolygon(sectionWidth,sectionHeight) {
  const numSides = Math.floor(Math.random() * 5) + 3; // Genera un número aleatorio entre 4 y 8 para el número de lados
  const radius = Math.floor(Math.random() * (Math.min(sectionWidth, sectionHeight) - 200) / 2);
    const centerX = Math.floor(Math.random() * (sectionWidth - 200)) + 100;
    const centerY = Math.floor(Math.random() * (sectionHeight - 200)) + 100;

  // Verifica que la nueva figura no se superponga con las figuras existentes
  for (let i = 0; i < centers.length; i++) {
    const dx = centerX - centers[i].x;
    const dy = centerY - centers[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) { // Si la distancia es menor que 100, la figura se superpone, entonces se sale de la función
      return;
    }
  }

  const angle = (Math.PI * 2) / numSides; // Calcula el ángulo entre cada vértice
  let currentAngle = 0; // Inicializa el ángulo actual en 0

  const vertices = []; // Array para almacenar los vértices de la figura

  // Genera los vértices de la figura
  for (let i = 0; i < numSides; i++) {
    const x = centerX + radius * Math.cos(currentAngle); // Calcula la coordenada X del vértice actual
    const y = centerY + radius * Math.sin(currentAngle); // Calcula la coordenada Y del vértice actual
    vertices.push({ x, y }); // Agrega el vértice al array de vértices
    currentAngle += angle; // Actualiza el ángulo actual
  }

  // Genera las líneas que conectan los vértices
  for (let i = 0; i < numSides; i++) {
    const line = {
      x1: vertices[i].x,
      y1: vertices[i].y,
      x2: vertices[(i + 1) % numSides].x, // Conecta el vértice actual con el siguiente, excepto en el último lado que conecta con el primero
      y2: vertices[(i + 1) % numSides].y,
    };
    lines.push(line); // Agrega la línea al array de líneas
  }

  centers.push({ x: centerX, y: centerY }); // Agrega el centro de la nueva figura al array de centros
}


export {generateRandomPolygon,lines}
