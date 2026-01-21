// Crud de Contactos Nuevos editar y crear

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
    
    btnAceptar.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });
    
    btnAceptar.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });
    
    btnAceptar.addEventListener('click', function() {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 300);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                if (callback) callback();
            }, 300);
        }
    });
}

//Contactos en el localStorage 

function obtenerContactos() {
    const contactos = localStorage.getItem('contactos');
    return contactos ? JSON.parse(contactos) : [];
}

function guardarContactos(contactos) {
    localStorage.setItem('contactos', JSON.stringify(contactos));
}

function obtenerContactoPorId(id) {
    const contactos = obtenerContactos();
    return contactos.find(c => c.id === id);
}

function generarIdUnico() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

//variables globales

let modoEdicion = false;
let contactoEditando = null;
let imagenBase64 = null;

//preview de la imagen

document.getElementById('imagenContacto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Validar tamaño (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
            mostrarMensaje('La imagen es muy grande. Máximo 2MB');
            this.value = '';
            return;
        }
        
        // Validar tipo
        if (!file.type.startsWith('image/')) {
            mostrarMensaje('Por favor selecciona una imagen válida');
            this.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            imagenBase64 = e.target.result;
            document.getElementById('preview-imagen').src = imagenBase64;
        };
        reader.readAsDataURL(file);
    }
});

//Funcion para los labels que se mueven

function activarLabelsFlotantes() {
    const inputs = document.querySelectorAll('.entrada_texto:not([type="date"])');
    
    inputs.forEach(input => {
        // Si el input tiene valor, activar label
        if (input.value.trim() !== '') {
            const label = input.nextElementSibling;
            if (label && label.classList.contains('label-input')) {
                label.classList.add('label-input-activo');
            }
        }
        
        // Al hacer focus
        input.addEventListener('focus', function() {
            const label = this.nextElementSibling;
            if (label && label.classList.contains('label-input')) {
                label.classList.add('label-input-activo');
            }
        });
        
        // Al perder focus
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                const label = this.nextElementSibling;
                if (label && label.classList.contains('label-input')) {
                    label.classList.remove('label-input-activo');
                }
            }
        });
    });
}

//Comenzar a crear o editar

function inicializarFormulario() {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get('modo');
    const id = urlParams.get('id');
    
    if (modo === 'editar' && id) {
        modoEdicion = true;
        contactoEditando = obtenerContactoPorId(id);
        
        if (contactoEditando) {
            cargarDatosContacto(contactoEditando);
        } else {
            mostrarMensaje('Contacto no encontrado', function() {
                window.location.href = 'principal.html';
            });
        }
    } else {
        modoEdicion = false;
        // Establecer fecha actual por defecto
        document.getElementById('fechaRegistro').value = new Date().toISOString().split('T')[0];
    }
    
    actualizarBotones();
}

//Cargar datos para poder editar

function cargarDatosContacto(contacto) {
    document.getElementById('nombreContacto').value = contacto.nombre || '';
    document.getElementById('apellidoContacto').value = contacto.apellido || '';
    document.getElementById('telefonoContacto').value = contacto.telefono || '';
    document.getElementById('correoContacto').value = contacto.correo || '';
    document.getElementById('direccionContacto').value = contacto.direccion || '';
    document.getElementById('fechaRegistro').value = contacto.fecha || '';
    
    if (contacto.imagen) {
        imagenBase64 = contacto.imagen;
        document.getElementById('preview-imagen').src = contacto.imagen;
    }
    
    // Cambiar título
    document.querySelector('.section h2').textContent = 'Editar Contacto';
    
    // Activar labels
    activarLabelsFlotantes();
}

//botones segun el modo ya sea agregar o editar

function actualizarBotones() {
    const contenedorBoton = document.querySelector('.contenedor-boton');
    
    if (modoEdicion) {
        // Mostrar botón de editar
        contenedorBoton.innerHTML = `
            <button type="submit" class="btn_crear btn_editar" id="btnEditar">
                <span class="bnt_texto">Actualizar Contacto</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-pen-to-square"></i>
                </span>
            </button>
        `;
    } else {
        // Mostrar botón de crear
        contenedorBoton.innerHTML = `
            <button type="submit" class="btn_crear" id="btnCrear">
                <span class="bnt_texto">Crear Contacto</span>
                <span class="btn_icono">
                    <i class="fa-solid fa-user-plus"></i>
                </span>
            </button>
        `;
    }
}

//validar el formulario

function validarFormulario() {
    const nombre = document.getElementById('nombreContacto').value.trim();
    const apellido = document.getElementById('apellidoContacto').value.trim();
    const telefono = document.getElementById('telefonoContacto').value.trim();
    const correo = document.getElementById('correoContacto').value.trim();
    const direccion = document.getElementById('direccionContacto').value.trim();
    const fecha = document.getElementById('fechaRegistro').value;
    
    if (!nombre || !apellido || !telefono || !correo || !direccion || !fecha) {
        mostrarMensaje('Por favor completa todos los campos');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        mostrarMensaje('Por favor ingresa un correo válido');
        return false;
    }
    
    // Validar teléfono
    const telefonoRegex = /^[\d\s\+\-\(\)]+$/;
    if (!telefonoRegex.test(telefono)) {
        mostrarMensaje('Por favor ingresa un teléfono válido');
        return false;
    }
    
    return true;
}

//guardar o actualizar el contacto

function guardarContacto(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    const contacto = {
        nombre: document.getElementById('nombreContacto').value.trim(),
        apellido: document.getElementById('apellidoContacto').value.trim(),
        telefono: document.getElementById('telefonoContacto').value.trim(),
        correo: document.getElementById('correoContacto').value.trim(),
        direccion: document.getElementById('direccionContacto').value.trim(),
        fecha: document.getElementById('fechaRegistro').value,
        imagen: imagenBase64 || '../Images/avatar-default.png'
    };
    
    let contactos = obtenerContactos();
    
    if (modoEdicion && contactoEditando) {
        // Actualizar contacto existente
        contacto.id = contactoEditando.id;
        const index = contactos.findIndex(c => c.id === contacto.id);
        
        if (index !== -1) {
            contactos[index] = contacto;
            guardarContactos(contactos);
            
            mostrarMensaje('Contacto actualizado exitosamente', function() {
                window.location.href = 'principal.html';
            });
        } else {
            mostrarMensaje('Error al actualizar el contacto');
        }
    } else {
        // Crear nuevo contacto
        contacto.id = generarIdUnico();
        contactos.push(contacto);
        guardarContactos(contactos);
        
        mostrarMensaje('Contacto creado exitosamente', function() {
            window.location.href = 'principal.html';
        });
    }
}

//cerrar sesión

function cerrarSesion() {
    mostrarMensaje('¿Estás seguro que deseas cerrar sesión?', function() {
        sessionStorage.removeItem('sesionActual');
        window.location.href = '../index.html';
    });
}

//Inicializar

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar formulario
    inicializarFormulario();
    
    // Activar labels flotantes
    activarLabelsFlotantes();
    
    // Evento submit del formulario
    document.getElementById('formContacto').addEventListener('submit', guardarContacto);
});

// Hacer función disponible globalmente
window.cerrarSesion = cerrarSesion;