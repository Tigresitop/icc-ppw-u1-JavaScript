'use strict';

/* =========================
    SELECCIÓN DE ELEMENTOS DOM
========================= */

const formTarea = document.getElementById('form-tarea');
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnLimpiar = document.getElementById('btn-limpiar');
const themeBtns = document.querySelectorAll('[data-theme]');

/* =========================
    ESTADO GLOBAL
========================= */

let tareas = []; // Array de tareas en memoria

// ✅ BIEN - createElement es seguro
function crearTarea(tarea) {
    const li = document.createElement('li');
    li.textContent = tarea.texto; // textContent escapa HTML automáticamente
    return li;
}

/**
 * TODO 5.2.1: Crear elemento de tarea con createElement
 * @param {Object} tarea - { id, texto, completada }
 * @returns {HTMLElement} Elemento <li>
 */
function crearElementoTarea(tarea) {
  // Crear <li>
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = tarea.id;
    if (tarea.completada) {

    li.classList.add('task-item--completed');
    }

  // TODO 5.2.1.1: Crear checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-item__checkbox';
    checkbox.checked = tarea.completada;

  // TODO 5.2.1.2: Crear span de texto
    const span = document.createElement('span');
    span.className = 'task-item__text';
    span.textContent = tarea.texto;  // Usar textContent, NO innerHTML

  // TODO 5.2.1.3: Crear botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn--danger btn--small';
    btnEliminar.textContent = '🗑️';

  // TODO 5.2.1.4: Crear contenedor de acciones
    const divAcciones = document.createElement('div');
    divAcciones.className = 'task-item__actions';
    divAcciones.appendChild(btnEliminar);

  // TODO 5.2.1.5: Ensamblar todo
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(divAcciones);

  // TODO 5.2.1.6: Agregar event listeners
    checkbox.addEventListener('change', () => toggleTarea(tarea.id));
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    return li;
}

/**
 * TODO 5.3.1: Renderizar todas las tareas
 */
function renderizarTareas() {
  // TODO 5.3.1.1: Limpiar la lista actual
    listaTareas.innerHTML = '';
  // TODO 5.3.1.2: Si no hay tareas, mostrar mensaje vacío
    if (tareas.length === 0) {
        const divVacio = document.createElement('div');
        divVacio.className = 'empty-state';
        const p = document.createElement('p');
        p.textContent = '🎉 No hay tareas. ¡Agrega una para comenzar!';
        divVacio.appendChild(p);
        listaTareas.appendChild(divVacio);
        return;
    }

  // TODO 5.3.1.3: Crear y agregar cada tarea
    tareas.forEach(tarea => {
        const elemento = crearElementoTarea(tarea);
        listaTareas.appendChild(elemento);
    });
}

/**
 * Mostrar mensaje temporal
 * @param {string} texto - Texto del mensaje
 * @param {string} tipo - 'success' o 'error'
 */
function mostrarMensaje(texto, tipo = 'success') {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = `mensaje mensaje--${tipo}`;
    mensajeEstado.classList.remove('oculto');
    setTimeout(() => {
    mensajeEstado.classList.add('oculto');
    }, 3000);
}

/**
 * Cargar tareas desde localStorage
 */
function cargarTareas() {
    tareas = TareaStorage.getAll();
    renderizarTareas();
}

/**
 * TODO 6.2.1: Agregar nueva tarea
 * @param {string} texto - Texto de la tarea
 */
function agregarTarea(texto) {
  // TODO 6.2.1.1: Validar que no esté vacío
    if (!texto.trim()) {
        mostrarMensaje('El texto no puede estar vacío', 'error');
        return;
    }
  // TODO 6.2.1.2: Usar el servicio para crear la tarea
    const nueva = TareaStorage.crear(texto);
  // TODO 6.2.1.3: Actualizar estado local leyendo desde localStorage
    tareas = TareaStorage.getAll();
  // TODO 6.2.1.4: Re-renderizar la lista
    renderizarTareas();
  // TODO 6.2.1.5: Mostrar mensaje de éxito
    mostrarMensaje(`✓ Tarea "${nueva.texto}" agregada`);
}

/**
 * TODO 6.3.1: Alternar completada/pendiente
 */
function toggleTarea(id) {
  // 6.3.1.1: Actualizar en storage
    TareaStorage.toggleCompletada(id);

  // 6.3.1.2: Recargar tareas
    tareas = TareaStorage.getAll();

  // 6.3.1.3: Re-renderizar
    renderTareas();
}

/**
 * TODO 6.3.2: Eliminar tarea
 */
function eliminarTarea(id) {
  // 6.3.2.1: Buscar la tarea
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

  // 6.3.2.2: Confirmación
    if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return;

  // 6.3.2.3: Eliminar del storage
    TareaStorage.eliminar(id);

  // 6.3.2.4: Recargar y renderizar
    tareas = TareaStorage.getAll();
    renderTareas();

  // 6.3.2.5: Mensaje (opcional)
    console.log('Tarea eliminada');
}

/**
 * TODO 6.3.3: Limpiar todo
 */
function limpiarTodo() {
  // 6.3.3.1: Validar
    if (tareas.length === 0) {
    alert('No hay tareas para eliminar');
    return;
    }

  // 6.3.3.2: Confirmación
    if (!confirm('¿Eliminar todas las tareas?')) return;

  // 6.3.3.3: Limpiar storage
    TareaStorage.limpiarTodo();

  // 6.3.3.4: Limpiar estado y renderizar
    tareas = [];
    renderTareas();
}

/**
 * TODO 7.1.1: Aplicar tema
 * @param {string} nombreTema - 'claro' o 'oscuro'
 */
function aplicarTema(nombreTema) {
  // TODO 7.1.1.1: Si es oscuro, aplicar variables CSS oscuras
    if (nombreTema === 'oscuro') {
        document.documentElement.style.setProperty('--bg-primary', '#1a1a2e');
        document.documentElement.style.setProperty('--card-bg', '#16213e');
        document.documentElement.style.setProperty('--text-primary', '#eaeaea');
        document.documentElement.style.setProperty('--text-secondary', '#c0c0c0');
        document.documentElement.style.setProperty('--btn-bg', '#0f3460');
        document.documentElement.style.setProperty('--btn-hover-bg', '#53354a');
  //     // ... más variables
    } else {
  //     // Tema claro (valores por defecto)
        document.documentElement.style.setProperty('--bg-primary', '#f0f0f0');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#333333');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--btn-bg', '#007bff');
        document.documentElement.style.setProperty('--btn-hover-bg', '#0056b3');
  //     // ... más variables
    }

  // TODO 7.1.1.2: Actualizar botones activos
    themeBtns.forEach(btn => {
        btn.classList.toggle('theme-btn--active', btn.dataset.theme === nombreTema);
    });

  // TODO 7.1.1.3: Guardar en localStorage
    TemaStorage.setTema(nombreTema);
}

/* =========================
    EVENTOS
========================= */

// Evento: Submit del formulario
formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();
    agregarTarea(texto);
    inputTarea.value = '';
});

// Evento: Limpiar todo
btnLimpiar.addEventListener('click', limpiarTodo);

// Evento: Cambiar tema
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        aplicarTema(btn.dataset.theme);
    });
});

/* =========================
    INICIALIZACIÓN
========================= */

// Cargar tema guardado
const temaGuardado = TemaStorage.getTema();
aplicarTema(temaGuardado);

// Cargar tareas desde localStorage
cargarTareas();

// Mensaje de bienvenida
if (tareas.length === 0) {
    mostrarMensaje('👋 Bienvenido! Agrega tu primera tarea', 'success');
}