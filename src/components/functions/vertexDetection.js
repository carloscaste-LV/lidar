// const kdTree = require('kd-tree-javascript');

// const puntos = [  [1, 2],
//   [3, 4],
//   [5, 6]
// ];

// // Crear un árbol de búsqueda k-d
// const arbol = new kdTree(puntos, (a, b) => {
//   const dx = a[0] - b[0];
//   const dy = a[1] - b[1];
//   return dx * dx + dy * dy;
// });

// // Función para buscar el punto más cercano a un punto de referencia
// function encontrarPuntoMasCercano(punto, arbol) {
//   const resultado = arbol.nearest(punto, 1);
//   return resultado[0][0];
// }

// // Ejemplo de uso
// const referencia = [2, 3];

// const puntoMasCercano = encontrarPuntoMasCercano(referencia, arbol);

// console.log(puntoMasCercano); // [1, 2]