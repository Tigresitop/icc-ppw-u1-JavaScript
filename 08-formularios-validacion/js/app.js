'use strict';

const form = document.querySelector('#form-registro');
const btnSubmit = document.querySelector('#btn-submit');
const mensajeGlobal = document.querySelector('#mensaje-global');
const inputPassword = document.querySelector('#password');
const inputTelefono = document.querySelector('#telefono');

/* =========================
    FUNCIONALIDAD EXTRA: MÁSCARA TELÉFONO
========================= */
inputTelefono.addEventListener('input', (e) => {
  let valor = e.target.value.replace(/\D/g, ''); // Remover todo lo que no sea dígito
    if (valor.length > 10) valor = valor.slice(0, 10);

  // Formato: (099) 999-9999
    if (valor.length > 6) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3, 6)}-${valor.slice(6)}`;
    } else if (valor.length > 3) {
    valor = `(${valor.slice(0, 3)}) ${valor.slice(3)}`;
    } else if (valor.length > 0) {
    valor = `(${valor}`;
    }

    e.target.value = valor;
});

/* =========================
    FUERZA DE CONTRASEÑA
========================= */
function evaluarFuerzaPassword(password) {
    let fuerza = 0;
    if (password.length >= 8) fuerza++;
    if (password.length >= 12) fuerza++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
    if (/\d/.test(password)) fuerza++;
    if (/[^a-zA-Z0-9]/.test(password)) fuerza++;

    const niveles = ['', 'Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const colores = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

    return { nivel: niveles[fuerza], color: colores[fuerza] };
}

inputPassword.addEventListener('input', (e) => {
    const password = e.target.value;
    const indicador = document.querySelector('#password-strength');

    if (password.length > 0) {
    const fuerza = evaluarFuerzaPassword(password);
    indicador.textContent = `Seguridad: ${fuerza.nivel}`;
    indicador.style.color = fuerza.color;
    } else {
        indicador.textContent = '';
    }
});

/* =========================
    FUNCIONALIDAD EXTRA: AUTOGUARDADO (SessionStorage)
========================= */
function guardarBorrador() {
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData);
  // Guardar estado del checkbox explícitamente
    datos.terminos = form.querySelector('#terminos').checked;
    sessionStorage.setItem('form_borrador', JSON.stringify(datos));
}

function restaurarBorrador() {
    const borrador = JSON.parse(sessionStorage.getItem('form_borrador'));
    if (borrador) {
    Object.entries(borrador).forEach(([name, value]) => {
        const campo = form.querySelector(`[name="${name}"]`);
        if (campo) {
        if (campo.type === 'checkbox') {
            campo.checked = value;
        } else {
            campo.value = value;
        }
        }
    });
    actualizarBotonSubmit();
    }
}

/* =========================
    VALIDACIÓN EN TIEMPO REAL
========================= */
function actualizarBotonSubmit() {
    const campos = form.querySelectorAll('input[required], select[required]');
    let todosLlenos = true;

    campos.forEach(c => {
        if (c.type === 'checkbox' && !c.checked) todosLlenos = false;
        else if (c.type !== 'checkbox' && !c.value.trim()) todosLlenos = false;
    });

    btnSubmit.disabled = !todosLlenos;
}

// Delegación de eventos para validar al salir del campo
form.addEventListener('focusout', (e) => {
    if (e.target.matches('input, select')) {
        validarCampo(e.target);
        actualizarBotonSubmit();
    }
});

// Limpiar error y autoguardar mientras se escribe
form.addEventListener('input', (e) => {
    if (e.target.matches('input, select')) {
    limpiarError(e.target);
    actualizarBotonSubmit();
    guardarBorrador();
    }
});

/* =========================
    ENVÍO DEL FORMULARIO
========================= */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validarFormulario(form)) {
    // Recopilar datos excluyendo confirmación de contraseña
    const datosFinales = Object.fromEntries(new FormData(form));
    delete datosFinales.confirmar_password;

    console.log('✅ Formulario válido. Datos enviados:', datosFinales);
    
    // Mostrar mensaje de éxito
    mensajeGlobal.textContent = '¡Registro completado exitosamente!';
    mensajeGlobal.className = 'mensaje-global exito';
    
    // Limpiar estado
    form.reset();
    sessionStorage.removeItem('form_borrador');
    btnSubmit.disabled = true;
    
    // Limpiar bordes verdes y texto de password
    form.querySelectorAll('.campo--valido').forEach(c => c.classList.remove('campo--valido'));
    document.querySelector('#password-strength').textContent = '';

    // Ocultar mensaje global después de 5 segundos
    setTimeout(() => {
        mensajeGlobal.style.display = 'none';
        mensajeGlobal.className = 'mensaje-global';
    }, 5000);
    } else {
        console.warn('❌ El formulario contiene errores.');
    }
});

// Iniciar app
document.addEventListener('DOMContentLoaded', restaurarBorrador);