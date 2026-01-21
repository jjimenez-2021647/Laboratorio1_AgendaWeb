// Crud de Tareas
// Variables globales
let tareaActual = null;
let modoEdicion = false;

// Mensajes y confirmacion 

// Agregar estilos de animación
if (!document.querySelector('#mensaje-styles')) {
    const style = document.createElement('style');
    style.id = 'mensaje-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        .form-group-textarea {
            height: auto !important;
        }
        .entrada_textarea {
            min-height: 80px;
            resize: vertical;
            padding-top: 25px !important;
        }
        .entrada_select {
            padding-top: 25px !important;
            appearance: none;
            cursor: pointer;
        }
        .label-select {
            top: 0 !important;
            font-size: 0.85rem !important;
            background: rgba(13, 152, 186, 0.8) !important;
        }
        .icon-svg {
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
        }
    `;
    document.head.appendChild(style);
}

// Función para mostrar mensajes informativos
function mostrarMensaje(mensaje, callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-out;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: slideUp 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="font-size: 50px; margin-bottom: 15px;">👻</div>
        <p style="color: #1a3a52; font-size: 16px; margin-bottom: 25px; line-height: 1.5; font-weight: 500;">
            ${mensaje}
        </p>
        <button id="btnAceptarMensaje" style="
            background: #099aa1;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(9, 154, 161, 0.3);
        ">
            Aceptar
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const btnAceptar = document.getElementById('btnAceptarMensaje');

    btnAceptar.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });

    btnAceptar.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });

    btnAceptar.addEventListener('click', function () {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 300);
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                if (callback) callback();
            }, 300);
        }
    });
}

// Función para mostrar confirmar o cancelar
function mostrarConfirmacion(mensaje, onAceptar, onCancelar) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-out;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: slideUp 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="font-size: 50px; margin-bottom: 15px;">👻</div>
        <p style="color: #1a3a52; font-size: 16px; margin-bottom: 25px; line-height: 1.5; font-weight: 500;">
            ${mensaje}
        </p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="btnCancelarConfirmacion" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
            ">
                Cancelar
            </button>
            <button id="btnAceptarConfirmacion" style="
                background: #099aa1;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(9, 154, 161, 0.3);
            ">
                Aceptar
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const btnCancelar = document.getElementById('btnCancelarConfirmacion');
    const btnAceptar = document.getElementById('btnAceptarConfirmacion');

    btnCancelar.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(220, 53, 69, 0.4)';
    });

    btnCancelar.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(220, 53, 69, 0.3)';
    });

    btnAceptar.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });

    btnAceptar.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });

    btnCancelar.addEventListener('click', function () {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (onCancelar) onCancelar();
        }, 300);
    });

    btnAceptar.addEventListener('click', function () {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (onAceptar) onAceptar();
        }, 300);
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                if (onCancelar) onCancelar();
            }, 300);
        }
    });
}

//Tareas en el LocalStorage

function obtenerTareas() {
    const tareas = localStorage.getItem('tareas');
    return tareas ? JSON.parse(tareas) : [];
}

function guardarTareas(tareas) {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function obtenerTareaPorId(id) {
    const tareas = obtenerTareas();
    return tareas.find(t => t.id === id);
}

function eliminarTareaPorId(id) {
    let tareas = obtenerTareas();
    tareas = tareas.filter(t => t.id !== id);
    guardarTareas(tareas);
}

function generarIdUnico() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

//Funciones para color y prioridad

function obtenerColorPrioridad(prioridad) {
    switch (prioridad) {
        case 'urgente': return 'rgba(220, 53, 69, 0.3)';
        case 'normal': return 'rgba(255, 193, 7, 0.3)';
        case 'baja': return 'rgba(40, 167, 69, 0.3)';
        default: return 'rgba(255, 255, 255, 0.15)';
    }
}

function obtenerBordePrioridad(prioridad) {
    switch (prioridad) {
        case 'urgente': return '2px solid rgba(220, 53, 69, 0.6)';
        case 'normal': return '2px solid rgba(255, 193, 7, 0.6)';
        case 'baja': return '2px solid rgba(40, 167, 69, 0.6)';
        default: return '1px solid rgba(255, 255, 255, 0.2)';
    }
}

function obtenerTextoPrioridad(prioridad) {
    switch (prioridad) {
        case 'urgente': return '🔴 Urgente';
        case 'normal': return '🟡 Normal';
        case 'baja': return '🟢 Baja';
        default: return prioridad;
    }
}

function obtenerTextoEstado(estado) {
    switch (estado) {
        case 'pendiente': return '🕐 Pendiente';
        case 'completada': return '✔ Completada';
        default: return estado;
    }
}

//Modal

function abrirModalAgregar() {
    modoEdicion = false;
    tareaActual = null;
    document.getElementById('tituloModal').textContent = 'Agregar Nueva Tarea';
    document.getElementById('formTarea').reset();

    // Establecer fechas por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaInicio').value = hoy;
    document.getElementById('fechaFin').value = hoy;

    // Limpiar labels activos
    document.querySelectorAll('.label-input').forEach(label => {
        label.classList.remove('label-input-activo');
    });

    // Activar labels de select
    document.getElementById('label-prioridad').classList.add('label-input-activo', 'label-select');
    document.getElementById('label-estado').classList.add('label-input-activo', 'label-select');

    // Habilitar todos los campos
    habilitarCampos(true);

    actualizarBotones();
    document.getElementById('modalTarea').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function abrirModalVer(tarea) {
    modoEdicion = false;
    tareaActual = tarea;
    document.getElementById('tituloModal').textContent = 'Detalles de la Tarea';
    cargarDatosTarea(tarea);

    // Deshabilitar campos en modo vista
    habilitarCampos(false);

    actualizarBotones();
    document.getElementById('modalTarea').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function habilitarEdicion() {
    modoEdicion = true;
    document.getElementById('tituloModal').textContent = 'Editar Tarea';

    // Habilitar campos
    habilitarCampos(true);

    actualizarBotones();
}

function habilitarCampos(habilitar) {
    const campos = ['nombreTarea', 'descripcionTarea', 'prioridadTarea', 'estadoTarea', 'fechaInicio', 'fechaFin'];
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (habilitar) {
            campo.removeAttribute('readonly');
            campo.removeAttribute('disabled');
        } else {
            if (campo.tagName === 'SELECT') {
                campo.setAttribute('disabled', 'true');
            } else {
                campo.setAttribute('readonly', 'true');
            }
        }
    });
}

function cargarDatosTarea(tarea) {
    document.getElementById('nombreTarea').value = tarea.nombre || '';
    document.getElementById('descripcionTarea').value = tarea.descripcion || '';
    document.getElementById('prioridadTarea').value = tarea.prioridad || '';
    document.getElementById('estadoTarea').value = tarea.estado || '';
    document.getElementById('fechaInicio').value = tarea.fechaInicio || '';
    document.getElementById('fechaFin').value = tarea.fechaFin || '';

    // Activar todos los labels
    activarLabelsFlotantes();
}

function cerrarModal() {
    document.getElementById('modalTarea').style.display = 'none';
    document.body.style.overflow = 'auto';
    tareaActual = null;
    modoEdicion = false;
}

function actualizarBotones() {
    const contenedor = document.getElementById('botonesModal');

    if (!tareaActual) {
        // Modo agregar
        contenedor.innerHTML = `
            <button type="submit" class="btn_editar_modal">
                <span class="bnt_texto">Agregar</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-plus"></i>
                </span>
            </button>
        `;
    } else if (modoEdicion) {
        // Modo editar
        contenedor.innerHTML = `
            <button type="submit" class="btn_editar_modal">
                <span class="bnt_texto">Guardar</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-save"></i>
                </span>
            </button>
            <button type="button" class="btn_eliminar_modal" onclick="eliminarTarea()">
                <span class="bnt_texto">Eliminar</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </button>
        `;
    } else {
        // Modo vista
        contenedor.innerHTML = `
            <button type="button" class="btn_editar_modal" onclick="habilitarEdicion()">
                <span class="bnt_texto">Editar</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-pen-to-square"></i>
                </span>
            </button>
            <button type="button" class="btn_eliminar_modal" onclick="eliminarTarea()">
                <span class="bnt_texto">Eliminar</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </button>
        `;
    }
}

function eliminarTarea() {
    if (!tareaActual) return;

    mostrarConfirmacion(
        `¿Estás seguro que quieres eliminar la tarea "${tareaActual.nombre}"?`,
        function () {
            eliminarTareaPorId(tareaActual.id);
            cerrarModal();
            mostrarMensaje('Tarea eliminada exitosamente');
            setTimeout(() => {
                cargarTareas();
            }, 300);
        },
        null
    );
}

// Funciones para los labels que se mueven

function activarLabelsFlotantes() {
    const inputs = document.querySelectorAll('.entrada_texto:not([type="date"]):not(select)');

    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            const label = input.nextElementSibling;
            if (label && label.classList.contains('label-input')) {
                label.classList.add('label-input-activo');
            }
        }

        input.addEventListener('focus', function () {
            const label = this.nextElementSibling;
            if (label && label.classList.contains('label-input')) {
                label.classList.add('label-input-activo');
            }
        });

        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                const label = this.nextElementSibling;
                if (label && label.classList.contains('label-input')) {
                    label.classList.remove('label-input-activo');
                }
            }
        });
    });

    // Para selects, siempre mostrar label arriba
    document.querySelectorAll('select.entrada_texto').forEach(select => {
        const label = select.nextElementSibling;
        if (label) {
            label.classList.add('label-input-activo', 'label-select');
        }
    });
}

// Validar y guardar lo del formulario

function validarFormulario() {
    const nombre = document.getElementById('nombreTarea').value.trim();
    const descripcion = document.getElementById('descripcionTarea').value.trim();
    const prioridad = document.getElementById('prioridadTarea').value;
    const estado = document.getElementById('estadoTarea').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (!nombre || !descripcion || !prioridad || !estado || !fechaInicio || !fechaFin) {
        mostrarMensaje('Por favor completa todos los campos');
        return false;
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
        mostrarMensaje('La fecha de fin no puede ser anterior a la fecha de inicio');
        return false;
    }

    return true;
}

document.getElementById('formTarea')?.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const tarea = {
        nombre: document.getElementById('nombreTarea').value.trim(),
        descripcion: document.getElementById('descripcionTarea').value.trim(),
        prioridad: document.getElementById('prioridadTarea').value,
        estado: document.getElementById('estadoTarea').value,
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value
    };

    let tareas = obtenerTareas();

    if (tareaActual && modoEdicion) {
        tarea.id = tareaActual.id;
        const index = tareas.findIndex(t => t.id === tarea.id);

        if (index !== -1) {
            tareas[index] = tarea;
            guardarTareas(tareas);

            mostrarMensaje('Tarea actualizada exitosamente', function () {
                cerrarModal();
                cargarTareas();
            });
        }
    } else {
        tarea.id = generarIdUnico();
        tareas.push(tarea);
        guardarTareas(tareas);

        mostrarMensaje('Tarea creada exitosamente', function () {
            cerrarModal();
            cargarTareas();
        });
    }
});

// Filtros

// Variable para almacenar filtros activos
let filtrosActivos = {
    prioridades: [],
    estados: []
};

// Abrir modal de filtros
function abrirModalFiltros() {
    const modal = document.getElementById('modalFiltros');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Restaurar los filtros previamente seleccionados
    restaurarFiltrosSeleccionados();
}

// Cerrar modal de filtros al hacer clic fuera
document.getElementById('modalFiltros')?.addEventListener('click', function (e) {
    if (e.target === this) {
        cerrarModalFiltros();
    }
});

// cerrar sesion

function cerrarSesion() {
    mostrarConfirmacion(
        '¿Estás seguro que deseas cerrar sesión?',
        function () {
            sessionStorage.removeItem('sesionActual');
            window.location.href = '../index.html';
        },
        null
    );
}

//inicializar

document.addEventListener('DOMContentLoaded', function () {
    cargarTareas();
    activarLabelsFlotantes();

    // Crear tareas de ejemplo si no hay ninguna
    const tareas = obtenerTareas();
    if (tareas.length === 0) {
        const tareasEjemplo = [
            {
                id: '1',
                nombre: 'Completar proyecto final',
                descripcion: 'Terminar el sistema de gestión de tareas y contactos',
                prioridad: 'urgente',
                estado: 'pendiente',
                fechaInicio: '2026-01-10',
                fechaFin: '2026-01-15'
            },
            {
                id: '2',
                nombre: 'Reunión con el equipo',
                descripcion: 'Revisar avances del proyecto y definir próximos pasos',
                prioridad: 'normal',
                estado: 'pendiente',
                fechaInicio: '2026-01-12',
                fechaFin: '2026-01-12'
            },
            {
                id: '3',
                nombre: 'Actualizar documentación',
                descripcion: 'Documentar las nuevas funcionalidades implementadas',
                prioridad: 'baja',
                estado: 'completada',
                fechaInicio: '2026-01-08',
                fechaFin: '2026-01-10'
            }
        ];
        guardarTareas(tareasEjemplo);
        cargarTareas();
    }
});

// Hacer funciones disponibles globalmente
window.cerrarModal = cerrarModal;
window.abrirModalAgregar = abrirModalAgregar;
window.habilitarEdicion = habilitarEdicion;
window.eliminarTarea = eliminarTarea;
window.cerrarSesion = cerrarSesion;
window.abrirModalFiltros = abrirModalFiltros;
window.cerrarModalFiltros = cerrarModalFiltros;
window.aplicarFiltros = aplicarFiltros;
window.limpiarFiltros = limpiarFiltros;
function cerrarModalFiltros() {
    const modal = document.getElementById('modalFiltros');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Restaurar los checkboxes según los filtros activos
function restaurarFiltrosSeleccionados() {
    // Limpiar todos los checkboxes primero
    document.querySelectorAll('#modalFiltros input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Marcar los filtros activos
    filtrosActivos.prioridades.forEach(prioridad => {
        const checkbox = document.getElementById(`filtro-${prioridad}`);
        if (checkbox) checkbox.checked = true;
    });

    filtrosActivos.estados.forEach(estado => {
        const checkbox = document.getElementById(`filtro-${estado}`);
        if (checkbox) checkbox.checked = true;
    });
}

// Aplicar filtros
function aplicarFiltros() {
    // Obtener prioridades seleccionadas
    const prioridades = [];
    ['urgente', 'normal', 'baja'].forEach(prioridad => {
        const checkbox = document.getElementById(`filtro-${prioridad}`);
        if (checkbox && checkbox.checked) {
            prioridades.push(prioridad);
        }
    });

    // Obtener estados seleccionados
    const estados = [];
    ['pendiente', 'completada'].forEach(estado => {
        const checkbox = document.getElementById(`filtro-${estado}`);
        if (checkbox && checkbox.checked) {
            estados.push(estado);
        }
    });

    // Guardar filtros activos
    filtrosActivos.prioridades = prioridades;
    filtrosActivos.estados = estados;

    // Actualizar estado visual del botón de filtros
    actualizarBotonFiltros();

    // Aplicar filtros y recargar tareas
    cargarTareas();

    // Cerrar modal
    cerrarModalFiltros();

    // Mostrar mensaje si hay filtros aplicados
    if (prioridades.length > 0 || estados.length > 0) {
        mostrarMensaje('Filtros aplicados correctamente');
    }
}

// Limpiar todos los filtros
function limpiarFiltros() {
    // Desmarcar todos los checkboxes
    document.querySelectorAll('#modalFiltros input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpiar filtros activos
    filtrosActivos.prioridades = [];
    filtrosActivos.estados = [];

    // Actualizar estado visual del botón de filtros
    actualizarBotonFiltros();

    // Recargar todas las tareas sin filtros
    cargarTareas();

    // Cerrar modal
    cerrarModalFiltros();

    mostrarMensaje('Filtros eliminados');
}

// Actualizar apariencia del botón de filtros
function actualizarBotonFiltros() {
    const btnFiltrar = document.getElementById('btnFiltrarTareas');

    if (filtrosActivos.prioridades.length > 0 || filtrosActivos.estados.length > 0) {
        btnFiltrar.classList.add('activo');
    } else {
        btnFiltrar.classList.remove('activo');
    }
}

// Filtrar tareas según los criterios activos
function filtrarTareas(tareas) {
    if (filtrosActivos.prioridades.length === 0 && filtrosActivos.estados.length === 0) {
        return tareas; // Sin filtros, devolver todas
    }

    return tareas.filter(tarea => {
        let cumplePrioridad = filtrosActivos.prioridades.length === 0 ||
            filtrosActivos.prioridades.includes(tarea.prioridad);

        let cumpleEstado = filtrosActivos.estados.length === 0 ||
            filtrosActivos.estados.includes(tarea.estado);

        return cumplePrioridad && cumpleEstado;
    });
}

// cargar las tareas segun los filtros

function cargarTareas() {
    let tareas = obtenerTareas();
    const listaTareas = document.getElementById('listaTareas');

    if (!listaTareas) return;

    // Aplicar filtros
    tareas = filtrarTareas(tareas);

    listaTareas.innerHTML = '';

    if (tareas.length === 0) {
        const mensajeVacio = filtrosActivos.prioridades.length > 0 || filtrosActivos.estados.length > 0
            ? 'No hay tareas que coincidan con los filtros seleccionados'
            : 'No hay tareas guardadas. ¡Agrega tu primera tarea!';

        listaTareas.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <p style="color: white; font-size: 1.2rem; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                    ${mensajeVacio}
                </p>
            </div>
        `;
        return;
    }

    tareas.forEach(tarea => {
        const tareaHTML = `
            <div class="contacto-item" data-id="${tarea.id}" 
                 style="background: ${obtenerColorPrioridad(tarea.prioridad)}; border: ${obtenerBordePrioridad(tarea.prioridad)};">
                <div class="contacto-info">
                    <h3 class="contacto-nombre">${tarea.nombre}</h3>
                    <p class="contacto-telefono">${tarea.descripcion}</p>
                    <p class="contacto-email">${obtenerTextoPrioridad(tarea.prioridad)} - ${obtenerTextoEstado(tarea.estado)}</p>
                </div>
                <div class="contacto-acciones">
                    <button class="btn-accion btn-ver-tarea" title="Ver detalles" data-id="${tarea.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        listaTareas.insertAdjacentHTML('beforeend', tareaHTML);
    });

    document.querySelectorAll('.btn-ver-tarea').forEach(btn => {
        btn.addEventListener('click', function () {
            const tareaId = this.getAttribute('data-id');
            const tarea = obtenerTareaPorId(tareaId);

            if (tarea) {
                abrirModalVer(tarea);
            }
        });
    });
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalTarea')?.addEventListener('click', function (e) {
    if (e.target === this) {
        cerrarModal();
    }
});

// Cerrar modal de filtros