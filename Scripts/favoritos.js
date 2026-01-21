// Crud de favoritos
// Variables globales
let contactoActual = null;

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

// Función para mostrar mensajes 
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
        setTimeout(() => overlay.remove(), 300);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => overlay.remove(), 300);
        }
    });
}

// Función para mostrar confirmar o cancelar
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
    
    btnCancelar.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(220, 53, 69, 0.4)';
    });
    
    btnCancelar.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(220, 53, 69, 0.3)';
    });
    
    btnAceptar.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });
    
    btnAceptar.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });
    
    btnCancelar.addEventListener('click', function() {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (onCancelar) onCancelar();
        }, 300);
    });
    
    btnAceptar.addEventListener('click', function() {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
            if (onAceptar) onAceptar();
        }, 300);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                if (onCancelar) onCancelar();
            }, 300);
        }
    });
}

//Contactos en el LocalStorage

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

// Función para obtener solo contactos favoritos
function obtenerContactosFavoritos() {
    const contactos = obtenerContactos();
    return contactos.filter(c => c.favorito === true);
}

function eliminarContactoPorId(id) {
    let contactos = obtenerContactos();
    contactos = contactos.filter(c => c.id !== id);
    guardarContactos(contactos);
}

//Modal

function abrirModalDetalles(contacto) {
    contactoActual = contacto;
    
    document.getElementById('modal-imagen').src = contacto.imagen;
    document.getElementById('modal-nombre').value = contacto.nombre;
    document.getElementById('modal-apellido').value = contacto.apellido;
    document.getElementById('modal-telefono').value = contacto.telefono;
    document.getElementById('modal-correo').value = contacto.correo;
    document.getElementById('modal-direccion').value = contacto.direccion;
    document.getElementById('modal-fecha').value = contacto.fecha;
    
    document.getElementById('modalDetalles').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Actualizar botón de favorito
    actualizarBotonFavorito(contacto.favorito || false);
}

function cerrarModal() {
    document.getElementById('modalDetalles').style.display = 'none';
    document.body.style.overflow = 'auto';
    contactoActual = null;
}

document.getElementById('modalDetalles')?.addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});

function editarContacto() {
    if (!contactoActual) return;
    
    sessionStorage.setItem('contactoEditar', JSON.stringify(contactoActual));
    window.location.href = `nuevoContacto.html?id=${contactoActual.id}&modo=editar`;
}

function eliminarContacto() {
    if (!contactoActual) return;
    
    const nombreCompleto = `${contactoActual.nombre} ${contactoActual.apellido}`;
    
    mostrarConfirmacion(
        `¿Estás seguro que quieres eliminar a ${nombreCompleto}?`,
        contactoActual.imagen,
        function() {
            eliminarContactoPorId(contactoActual.id);
            cerrarModal();
            mostrarMensaje('Contacto eliminado exitosamente');
            
            setTimeout(() => {
                cargarContactos();
            }, 1000);
        },
        null
    );
}

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
        
        actualizarBotonFavorito(esFavorito);
        contactoActual.favorito = esFavorito;
        
        // Si estamos en favoritos y se quita el favorito, recargar lista
        setTimeout(() => {
            cargarContactos();
        }, 1000);
    }
}

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

//Recargar los contactos

function cargarContactos() {
    const contactosFavoritos = obtenerContactosFavoritos();
    const listaContactos = document.querySelector('.lista-contactos');
    
    if (!listaContactos) return;
    
    listaContactos.innerHTML = '';
    
    // Si no hay contactos favoritos
    if (contactosFavoritos.length === 0) {
        listaContactos.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <p style="color: white; font-size: 1.2rem; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); margin-bottom: 10px;">
                    No tienes contactos favoritos aún
                </p>
                <p style="color: white; font-size: 1rem; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                    Marca tus contactos favoritos desde la lista principal para verlos aquí
                </p>
            </div>
        `;
        return;
    }
    
    // Renderizar cada contacto favorito
    contactosFavoritos.forEach(contacto => {
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
    
    // Agregar event listeners
    document.querySelectorAll('.btn-ver-detalles').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactoItem = this.closest('.contacto-item');
            const contactoId = contactoItem.getAttribute('data-id');
            const contacto = obtenerContactoPorId(contactoId);
            
            if (contacto) {
                abrirModalDetalles(contacto);
            }
        });
    });
}

//inicializar

document.addEventListener('DOMContentLoaded', function() {
    cargarContactos();
});


window.cerrarModal = cerrarModal;
window.editarContacto = editarContacto;
window.eliminarContacto = eliminarContacto;
window.toggleFavorito = toggleFavorito;