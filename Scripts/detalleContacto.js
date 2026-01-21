// Crud contactos
// Variables globales
let contactoActual = null;

// Agregar estilos de animación referente a los mensajes de alerta
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

// Función para mostrar mensajes informativos}
function mostrarMensaje(mensaje) {
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

    // Efectos hover
    btnAceptar.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });

    btnAceptar.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });

    // Cerrar modal
    btnAceptar.addEventListener('click', function () {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => overlay.remove(), 300);
        }
    });
}

// Función para mostrar confirmación ya sea confirmar o cancelar
function mostrarConfirmacion(mensaje, imagenUrl, onAceptar, onCancelar) {
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
        <div style="
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #099aa1;
            box-shadow: 0 8px 20px rgba(9, 154, 161, 0.3);
        ">
            <img src="${imagenUrl || '../Images/avatar-default.png'}" 
                 alt="Contacto" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.src='../Images/avatar-default.png'">
        </div>
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

    // Efectos hover botón Cancelar
    btnCancelar.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(220, 53, 69, 0.4)';
    });

    btnCancelar.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(220, 53, 69, 0.3)';
    });

    // Efectos hover botón Aceptar
    btnAceptar.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });

    btnAceptar.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });

    // Evento Cancelar
    btnCancelar.addEventListener('click', function () {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (onCancelar) onCancelar();
        }, 300);
    });

    // Evento Aceptar
    btnAceptar.addEventListener('click', function () {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (onAceptar) onAceptar();
        }, 300);
    });

    // Cerrar al hacer clic fuera 
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

// Función para obtener todos los contactos
function obtenerContactos() {
    const contactos = localStorage.getItem('contactos');
    return contactos ? JSON.parse(contactos) : [];
}

// Función para guardar contactos
function guardarContactos(contactos) {
    localStorage.setItem('contactos', JSON.stringify(contactos));
}

// Función para obtener un contacto por ID
function obtenerContactoPorId(id) {
    const contactos = obtenerContactos();
    return contactos.find(c => c.id === id);
}

// Función para eliminar un contacto
function eliminarContactoPorId(id) {
    let contactos = obtenerContactos();
    contactos = contactos.filter(c => c.id !== id);
    guardarContactos(contactos);
}

// ========== FUNCIONES DEL MODAL ==========

// Función para abrir el modal con los detalles del contacto
function abrirModalDetalles(contacto) {
    contactoActual = contacto;

    // Llenar los datos del modal
    document.getElementById('modal-imagen').src = contacto.imagen;
    document.getElementById('modal-nombre').value = contacto.nombre;
    document.getElementById('modal-apellido').value = contacto.apellido;
    document.getElementById('modal-telefono').value = contacto.telefono;
    document.getElementById('modal-correo').value = contacto.correo;
    document.getElementById('modal-direccion').value = contacto.direccion;
    document.getElementById('modal-fecha').value = contacto.fecha;

    // Mostrar el modal
    document.getElementById('modalDetalles').style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Actualizar botón de favorito según el estado
    actualizarBotonFavorito(contacto.favorito || false);
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('modalDetalles').style.display = 'none';
    document.body.style.overflow = 'auto';
    contactoActual = null;
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalDetalles')?.addEventListener('click', function (e) {
    if (e.target === this) {
        cerrarModal();
    }
});

// Función para editar contacto
function editarContacto() {
    if (!contactoActual) return;

    // Guardar el contacto en sessionStorage para editarlo
    sessionStorage.setItem('contactoEditar', JSON.stringify(contactoActual));

    // Redirigir a la página de edición
    window.location.href = `nuevoContacto.html?id=${contactoActual.id}&modo=editar`;
}

// Función para eliminar contacto
function eliminarContacto() {
    if (!contactoActual) return;

    const nombreCompleto = `${contactoActual.nombre} ${contactoActual.apellido}`;

    mostrarConfirmacion(
        `¿Estás seguro que quieres eliminar a ${nombreCompleto}?`,
        contactoActual.imagen,
        // Función cuando acepta
        function () {
            eliminarContactoPorId(contactoActual.id);
            cerrarModal();
            mostrarMensaje('Contacto eliminado exitosamente');

            // Recargar la lista después de 1 segundo
            setTimeout(() => {
                cargarContactos();
            }, 1000);
        },
        // Función cuando cancela
        null
    );
}

// Función para agregar o quitar favorito
function toggleFavorito() {
    if (!contactoActual) return;

    let contactos = obtenerContactos();
    const index = contactos.findIndex(c => c.id === contactoActual.id);

    if (index !== -1) {
        contactos[index].favorito = !contactos[index].favorito;
        guardarContactos(contactos);

        const esFavorito = contactos[index].favorito;
        const mensaje = esFavorito ?
            'Contacto agregado a favoritos' :
            'Contacto removido de favoritos';

        mostrarMensaje(mensaje);

        // Actualizar el botón
        actualizarBotonFavorito(esFavorito);

        // Actualizar contacto actual
        contactoActual.favorito = esFavorito;
    }
}

// Función para actualizar el botón de favorito
function actualizarBotonFavorito(esFavorito) {
    const textoFavorito = document.getElementById('texto-favorito');
    const iconoFavorito = document.getElementById('icono-favorito');

    if (textoFavorito && iconoFavorito) {
        if (esFavorito) {
            textoFavorito.textContent = 'Quitar de Favoritos';
            iconoFavorito.classList.remove('fa-regular');
            iconoFavorito.classList.add('fa-solid');
        } else {
            textoFavorito.textContent = 'Agregar a Favoritos';
            iconoFavorito.classList.remove('fa-solid');
            iconoFavorito.classList.add('fa-regular');
        }
    }
}


// Función para renderizar la lista de contactos dinámicamente
function cargarContactos() {
    const contactos = obtenerContactos();
    const listaContactos = document.querySelector('.lista-contactos');

    if (!listaContactos) return;

    // Limpiar lista actual
    listaContactos.innerHTML = '';

    // Si no hay contactos
    if (contactos.length === 0) {
        listaContactos.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <p style="color: white; font-size: 1.2rem; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                    No hay contactos guardados. ¡Agrega tu primer contacto!
                </p>
            </div>
        `;
        return;
    }

    // Renderizar cada contacto
    contactos.forEach(contacto => {
        const contactoHTML = `
            <div class="contacto-item" data-id="${contacto.id}">
                <div class="contacto-avatar">
                    <img src="${contacto.imagen || '../Images/avatar-default.png'}" 
                         alt="${contacto.nombre}" 
                         class="foto-contacto"
                         onerror="this.src='../Images/avatar-default.png'">
                </div>
                <div class="contacto-info">
                    <h3 class="contacto-nombre">${contacto.nombre} ${contacto.apellido}</h3>
                    <p class="contacto-telefono">${contacto.telefono}</p>
                    <p class="contacto-email">${contacto.correo}</p>
                </div>
                <div class="contacto-acciones">
                    <button class="btn-accion btn-ver-detalles" title="Ver detalles">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        listaContactos.insertAdjacentHTML('beforeend', contactoHTML);
    });

    // Agregar event listeners a los botones recién creados
    document.querySelectorAll('.btn-ver-detalles').forEach(btn => {
        btn.addEventListener('click', function () {
            const contactoItem = this.closest('.contacto-item');
            const contactoId = contactoItem.getAttribute('data-id');
            const contacto = obtenerContactoPorId(contactoId);

            if (contacto) {
                abrirModalDetalles(contacto);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Cargar contactos desde localStorage
    cargarContactos();

    // Si no hay contactos, crear algunos de ejemplo 
    const contactos = obtenerContactos();
    if (contactos.length === 0) {
        const contactosEjemplo = [
            {
                id: '1',
                nombre: 'Sadie',
                apellido: 'Sink',
                telefono: '+502 1234-5678',
                correo: 'sadie.sink@gmail.com',
                direccion: 'Ciudad de Guatemala',
                fecha: '2026-01-01',
                imagen: '../Images/Contacto1.jpeg',
                favorito: true
            },
            {
                id: '2',
                nombre: 'Jefry',
                apellido: 'Cruz',
                telefono: '+502 2345-6789',
                correo: 'jefry.cruz@gmail.com',
                direccion: 'Antigua Guatemala',
                fecha: '2026-01-05',
                imagen: '../Images/Contactos2.jpg',
                favorito: true
            },
            {
                id: '3',
                nombre: 'Ana',
                apellido: 'de Armas',
                telefono: '+502 3456-7890',
                correo: 'ana.armas@gmail.com',
                direccion: 'Escuintla',
                fecha: '2026-01-08',
                imagen: '../Images/Contacto3.jpg',
                favorito: false
            },
            {
                id: '4',
                nombre: 'Roberto',
                apellido: 'Rodriguez',
                telefono: '+502 4567-8901',
                correo: 'roberto.rodriguez@gmail.com',
                direccion: 'Quetzaltenango',
                fecha: '2026-01-10',
                imagen: '../Images/contacto4.jpg',
                favorito: true
            },
            {
                id: '5',
                nombre: 'Emma',
                apellido: 'Myers',
                telefono: '+502 5678-9012',
                correo: 'emma.myers@gmail.com',
                direccion: 'Antigua Guatemala',
                fecha: '2026-01-11',
                imagen: '../Images/Contacto5.jpg',
                favorito: false
            },
            {
                id: '6',
                nombre: 'Rhandy',
                apellido: 'Caná',
                telefono: '+502 6789-0123',
                correo: 'rhandy.cana@gmail.com',
                direccion: 'Ciudad de Guatemala',
                fecha: '2026-01-11',
                imagen: '../Images/contacto6.jpg',
                favorito: false
            }
        ];
        guardarContactos(contactosEjemplo);
        cargarContactos();
    }
});

// Hacer funciones disponibles globalmente
window.cerrarModal = cerrarModal;
window.editarContacto = editarContacto;
window.eliminarContacto = eliminarContacto;
window.toggleFavorito = toggleFavorito;