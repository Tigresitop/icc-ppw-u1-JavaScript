'use strict';

// Declaración de variables
const nombre = 'John';
const apellido = 'Tigre';
let ciclo = 5;
const activo = true;


const direccion = {
    ciudad : 'Gualaceo',
    provincia : 'Azuay',
}

console.table({nombre, apellido, ciclo, activo, direccion});

//const calcularPromedio = (notas) => //promedio; notas.reduce((a, b) => a + b, 0) / notas.length;

const esMayorEdad = (edad) => edad >= 18;

const getSaudo = (nombre, hora) => {
    if (hora < 12) 
        return `Buenos días, ${nombre}`;
    if (hora < 18)
        return `Buenas tardes, ${nombre}`;
    return `Buenas noches, ${nombre}`;
}

const getSaludo2 = (nombre, hora) => hora < 12 
    ? `Buenos días, ${nombre}` 
    : hora < 18 
        ? `Buenas tardes, ${nombre}` 
        : `Buenas noches, ${nombre}`;

//Mostrar en html
document.getElementById('nombre').textContent = `${nombre}`;
document.getElementById('apellido').textContent = `${apellido}`;
document.getElementById('ciclo').textContent = `${ciclo}`;

