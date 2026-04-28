'use strict';

/* =========================
    SELECCIÓN DE ELEMENTOS
========================= */
const formRegistro = document.querySelector('#form-registro');
const inputPassword = document.querySelector('#password');
const inputConfirmarPassword = document.querySelector('#confirmar_password');
const inputTelefono = document.querySelector('#telefono');
const passwordStrength = document.querySelector('#password-strength');
const btnEnviar = document.querySelector('#btn-enviar');
const btnLimpiar = document.querySelector('#btn-limpiar');
const mensajeEstado = document.querySelector('#mensaje-estado');
const resultadoRegistro = document.querySelector('#resultado-registro');

/* =========================
    FUNCIONES PRINCIPALES
========================= */
function validarCampoConFeedback(campo) {
    const resultado = ValidacionService.validarCampo(campo);

    if (!resultado.valido) {
        mostrarError(campo, resultado.error);
    } else {
        limpiarError(campo);
    }
}

function actualizarIndicadorFuerza(password) {
    if (!password) {
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';
    return;
    }

    const fuerza = ValidacionService.evaluarFuerzaPassword(password);

    passwordStrength.textContent = `Fortaleza: ${fuerza.nivel}`;
    passwordStrength.className = `password-strength ${fuerza.clase}`;
}

function verificarCamposLlenos(form) {
    const camposRequeridos = form.querySelectorAll('[required]');

    return [...camposRequeridos].every(campo => {
    if (campo.type === 'checkbox') {
        return campo.checked;
    }
    return campo.value.trim() !== '';
    });
}

function actualizarBotonEnviar(form) {
    const todosLlenos = verificarCamposLlenos(form);
    btnEnviar.disabled = !todosLlenos;
}

function procesarEnvio(formData) {
    const datos = Object.fromEntries(formData);

  // Agregar el checkbox manualmente
    datos.terminos = formRegistro.querySelector('#terminos').checked;

    console.log('Datos a enviar:', datos);

    mostrarMensajeTemporal(
    mensajeEstado,
    MensajeExito('Registro completado exitosamente. Los datos se muestran abajo.'),
    5000
    );

    renderizarResultado(datos, resultadoRegistro);

    formRegistro.reset();

    const campos = formRegistro.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
    campo.classList.remove('campo--valido', 'campo--error');
    });

    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';

    actualizarBotonEnviar(formRegistro);

    resultadoRegistro.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================
    EVENT LISTENERS
========================= */
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const formularioValido = ValidacionService.validarFormulario(formRegistro);

    if (!formularioValido) {
    mostrarMensajeTemporal(
        mensajeEstado,
        MensajeError('Por favor, corrige los errores en el formulario antes de continuar.'),
        5000
    );
    
    const primerError = formRegistro.querySelector('.campo--error');
    if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primerError.focus();
    }
    
    return;
    }

    const formData = new FormData(formRegistro);
    procesarEnvio(formData);
});

formRegistro.addEventListener('focusout', (e) => {
    if (e.target.matches('input, select, textarea')) {
    validarCampoConFeedback(e.target);
    }
});

formRegistro.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea')) {
    const errorDiv = e.target.parentElement.querySelector('.error-mensaje');
    if (errorDiv && errorDiv.textContent) {
        limpiarError(e.target);
    }
    }

    actualizarBotonEnviar(formRegistro);
});

inputPassword.addEventListener('input', (e) => {
    actualizarIndicadorFuerza(e.target.value);
});

inputTelefono.addEventListener('input', (e) => {
    aplicarMascaraTelefono(e.target);
});

inputPassword.addEventListener('input', () => {
    if (inputConfirmarPassword.value) {
    validarCampoConFeedback(inputConfirmarPassword);
    }
});

btnLimpiar.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
    formRegistro.reset();
    
    const campos = formRegistro.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.classList.remove('campo--valido', 'campo--error');
        const errorDiv = campo.parentElement.querySelector('.error-mensaje');
        if (errorDiv) {
        errorDiv.textContent = '';
        }
    });

    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';

    limpiarResultado(resultadoRegistro);

    mensajeEstado.classList.add('oculto');

    actualizarBotonEnviar(formRegistro);

    document.querySelector('#nombre').focus();
    }
});

/* =========================
    INICIALIZACIÓN
========================= */
actualizarBotonEnviar(formRegistro);
document.querySelector('#nombre').focus();