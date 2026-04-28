'use strict';

/* =========================
    COMPONENTES
========================= */

function MensajeExito(mensaje) {
    const container = document.createElement('div');
    container.className = 'mensaje-exito';

    const titulo = document.createElement('strong');
    titulo.textContent = '✓ Éxito';

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    container.appendChild(titulo);
    container.appendChild(texto);

    return container;
}

function MensajeError(mensaje) {
    const container = document.createElement('div');
    container.className = 'mensaje-error';

    const titulo = document.createElement('strong');
    titulo.textContent = '✗ Error';

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    container.appendChild(titulo);
    container.appendChild(texto);

    return container;
}

function ResultadoCard(datos) {
    const card = document.createElement('div');
    card.className = 'resultado-card';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Datos registrados correctamente';
    card.appendChild(titulo);

    const labels = {
    nombre: 'Nombre completo',
    email: 'Email',
    telefono: 'Teléfono',
    fecha_nacimiento: 'Fecha de nacimiento',
    genero: 'Género',
    password: 'Contraseña',
    confirmar_password: 'Confirmar Contraseña',
    terminos: 'Términos aceptados'
};

Object.entries(datos).forEach(([clave, valor]) => {
    const item = document.createElement('div');
    item.className = 'resultado-item';

    const label = document.createElement('strong');
    label.textContent = labels[clave] || clave;

    const valorSpan = document.createElement('span');
    
    if (clave === 'password' || clave === 'confirmar_password') {
        valorSpan.textContent = '•'.repeat(valor.length);
    } else if (clave === 'terminos') {
        valorSpan.textContent = valor ? 'Sí' : 'No';
    } else if (clave === 'genero') {
        const generos = {
        masculino: 'Masculino',
        femenino: 'Femenino',
        otro: 'Otro',
        prefiero_no_decir: 'Prefiero no decir'
        };
        valorSpan.textContent = generos[valor] || valor;
    } else if (clave === 'fecha_nacimiento') {
      // Evitar desfase de zona horaria al formatear agregando T00:00:00
        const fecha = new Date(valor + 'T00:00:00');
        valorSpan.textContent = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
        });
    } else {
        valorSpan.textContent = valor;
    }

    item.appendChild(label);
    item.appendChild(valorSpan);
    card.appendChild(item);
    });

    return card;
}

function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
    contenedor.innerHTML = '';
    contenedor.appendChild(elemento);
    contenedor.classList.remove('oculto');

    if (duracion > 0) {
    setTimeout(() => {
        contenedor.classList.add('oculto');
    }, duracion);
    }
}

function renderizarResultado(datos, contenedor) {
    contenedor.innerHTML = '';
    const card = ResultadoCard(datos);
    contenedor.appendChild(card);
}

function limpiarResultado(contenedor) {
    contenedor.innerHTML = '<p>No hay datos enviados aún</p>';
    contenedor.className = 'resultado-vacio';
}