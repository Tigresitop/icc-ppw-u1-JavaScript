'use strict';

/* =========================
    EXPRESIONES REGULARES
========================= */
const REGEX = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
};

/* =========================
    FUNCIONES DE FEEDBACK VISUAL
========================= */
function mostrarError(campo, mensaje) {
    campo.classList.add('campo--error');
    campo.classList.remove('campo--valido');

  // Buscar contenedor de error más cercano
    const errorDiv = campo.parentElement.querySelector('.error-mensaje');
    if (errorDiv) {
    errorDiv.textContent = mensaje;
    }
}

function limpiarError(campo) {
    campo.classList.remove('campo--error');
    campo.classList.add('campo--valido');

    const errorDiv = campo.parentElement.querySelector('.error-mensaje');
    if (errorDiv) {
    errorDiv.textContent = '';
    }
}

/* =========================
    LÓGICA DE VALIDACIÓN
========================= */
function validarCampo(campo) {
  // Para checkboxes, el valor es su estado 'checked'
    const esCheckbox = campo.type === 'checkbox';
    const valor = esCheckbox ? campo.checked : campo.value.trim();
    const nombre = campo.name;
    let error = '';

  // 1. Validar 'required' genérico
    if (campo.hasAttribute('required')) {
    if (esCheckbox && !valor) {
        error = 'Debes aceptar los términos y condiciones';
    } else if (!esCheckbox && !valor) {
        error = 'Este campo es obligatorio';
    }
    }

  // 2. Validaciones específicas por campo (solo si hay valor)
    if (!error && valor) {
    switch (nombre) {
        case 'nombre':
        if (valor.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        else if (!REGEX.nombre.test(valor)) error = 'Solo se permiten letras y espacios';
        break;

        case 'email':
        if (!REGEX.email.test(valor)) error = 'Ingresa un correo electrónico válido';
        break;

        case 'telefono':
        // Quitamos los caracteres de la máscara para evaluar longitud real
        const numerosTel = valor.replace(/\D/g, '');
        if (numerosTel.length !== 10) error = 'El teléfono debe tener exactamente 10 dígitos';
        break;

        case 'fecha_nacimiento':
        const fechaNacimiento = new Date(valor);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        if (edad < 18) error = 'Debes ser mayor de edad (18+ años)';
        break;

        case 'password':
        if (valor.length < 8) error = 'Mínimo 8 caracteres';
        else if (!/[A-Z]/.test(valor)) error = 'Debe incluir al menos una letra mayúscula';
        else if (!/[a-z]/.test(valor)) error = 'Debe incluir al menos una letra minúscula';
        else if (!/\d/.test(valor)) error = 'Debe incluir al menos un número';
        break;

        case 'confirmar_password':
        const passwordOriginal = document.querySelector('#password').value;
        if (valor !== passwordOriginal) error = 'Las contraseñas no coinciden';
        break;
    }
    }

  // 3. Aplicar feedback visual
    if (error) {
        mostrarError(campo, error);
        return false;
    } else {
    // Si es requerido o si tiene valor y pasó las pruebas, es válido
    if (campo.hasAttribute('required') || valor) {
        limpiarError(campo);
    }
    return true;
    }
}

function validarFormulario(form) {
    const campos = form.querySelectorAll('input, select');
    let valido = true;
    campos.forEach(campo => {
    if (!validarCampo(campo)) valido = false;
    });
    return valido;
}